const socketio = require('socket.io');
const { app, gameContainer } = require('./app');

const PORT = 8000;

const server = app.listen(PORT, () => {
  console.log(`EscapeNLP Server listening on port ${PORT}!`); // eslint-disable-line no-console
});

// // probably need to configure cors here
// const io = socketio(server, {
//   origins: 'cors stuff'
// });

const io = socketio(server);

const getGames = () => {
  const { data } = gameContainer.getAllSessions();
  return data;
};

io.on('connection', (socket) => {
  console.log('connection established'); // eslint-disable-line no-console

  socket.on('joinRoom', (roomId) => {
    const prevRooms = Object.keys(io.sockets.adapter.sids[socket.id]);
    prevRooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(roomId);
    socket.currentRoom = roomId;
    socket.gameId = parseInt(roomId, 10);
    socket.playerNumber = io.nsps['/'].adapter.rooms[roomId].length;
    socket.broadcast.emit('refreshRoomsReceived', getGames());
    io.in(socket.currentRoom).emit('playerIsJoining', io.nsps['/'].adapter.rooms[roomId].length);
  });

  socket.on('attemptJoin', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo] && io.nsps['/'].adapter.rooms[roomInfo].length > 4) {
      socket.emit('canJoin', false);
    } else {
      socket.emit('canJoin', true);
    }
  });

  socket.on('confirmJoin', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo] && io.nsps['/'].adapter.rooms[roomInfo].length > 4) {
      socket.emit('confirmJoin', false);
    } else {
      socket.emit('confirmJoin', true);
    }
  });

  socket.on('checkRoomSize', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo]) {
      const roomSize = io.nsps['/'].adapter.rooms[roomInfo].length;
      socket.emit('checkRoomSize', roomSize);
    }
  });

  socket.on('getAllRooms', () => {
    socket.emit('refreshRoomsReceived', getGames());
  });

  socket.on('chatMessage', (message) => {
    if (message.type === 'action') {
      gameContainer.performAction(socket.gameId, message);
    }
    io.in(socket.currentRoom).emit('chatMessage', message);
  });

  socket.on('getInventories', (inventories) => {
    io.in(socket.currentRoom).emit('updateInventories', inventories);
  });

  socket.on('startGame', async () => {
    await gameContainer.startGame(socket.gameId);
    const board = await gameContainer.getBoard(socket.gameId);
    console.log(board);
    io.in(socket.currentRoom).emit('updateBoard', board, false);
  });

  const updatePlayers = (reason, room, disconnectedPlayer) => {
    const allPlayerNames = [];
    const allPlayers = io.sockets.adapter.rooms[room].sockets;
    const playerNumbers = [];

    Object.keys(allPlayers).forEach((playerId, i) => {
      if (reason === 'disconnected') {
        io.sockets.connected[playerId].playerInfo.ready = false;
      }
      const player = io.sockets.connected[playerId];
      if (player.playerInfo) {
        allPlayerNames.push(player.playerInfo);
      }
      playerNumbers.push(i + 1);
      io.sockets.connected[playerId].playerNumber = i + 1;
    });

    if (reason === 'disconnected' && allPlayerNames.length > 0 && io.sockets.adapter.rooms[room].gameStart) {
      disconnectedPlayer.leftGame = true;
      allPlayerNames.push(disconnectedPlayer);
    } else {
      gameContainer.dropPlayerFromSession(socket.gameId, socket.playerInfo.name);
    }

    io.in(room).emit('setNames', allPlayerNames, playerNumbers);
  };

  socket.on('getName', (playerInfo) => {
    socket.playerInfo = playerInfo;
    socket.playerInfo.position = socket.playerNumber;
    updatePlayers('', socket.currentRoom, {});
  });

  socket.on('readyToggle', () => {
    socket.playerInfo.ready = !socket.playerInfo.ready;

    const allPlayers = io.sockets.adapter.rooms[socket.currentRoom].sockets;
    const allReady = [];

    Object.keys(allPlayers).forEach((playerId) => {
      const player = io.sockets.connected[playerId];
      allReady.push(player.playerInfo.ready);
    });

    io.sockets.adapter.rooms[socket.currentRoom].gameStart = !(allReady.indexOf(false) >= 0);

    io.in(socket.currentRoom).emit('readyUp', socket.playerInfo, io.sockets.adapter.rooms[socket.currentRoom].gameStart);
  });

  socket.on('disconnect', () => {
    if (io.nsps['/'].adapter.rooms[socket.currentRoom] && socket.playerInfo) {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const mess = `${socket.playerInfo.name} has disconnected`;
      const message = { commenter: time, time: '', mess };
      io.in(socket.currentRoom).emit('chatMessage', message);
      io.in(socket.currentRoom).emit('removePlayer', socket.playerInfo.name);
      if (io.nsps['/'].adapter.rooms[socket.currentRoom].gameStart) {
        updatePlayers('disconnected', socket.currentRoom, socket.playerInfo);
      } else {
        updatePlayers('disconnected', socket.currentRoom, {});
      }
      delete socket.currentRoom;
    }
  });

  socket.on('updatePlayerCount', (playerList, roomId) => {
    io.in(roomId).emit('updatePlayerCount', playerList);
  });
});
