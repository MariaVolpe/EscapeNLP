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

const f = 'floor';
const p = 'player';
const k = 'key';
const d = 'dragon';
const s = 'button';
const b = 'block';
const w = 'wep';

io.on('connection', (socket) => {
  console.log('connection established');

  socket.on('joinRoom', (roomId) => {
    const prevRooms = Object.keys(io.sockets.adapter.sids[socket.id]);
    prevRooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(roomId);
    socket.currentRoom = roomId;
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
      gameContainer.performAction(socket.currentRoom, message);
    }
    io.in(socket.currentRoom).emit('chatMessage', message);
  });

  socket.on('getInventories', (inventories) => {
    io.in(socket.currentRoom).emit('updateInventories', inventories);
  });

  socket.on('startGame', (board) => {
    const numberOfPlayers = io.nsps['/'].adapter.rooms[socket.currentRoom].length;
    const allPlayers = io.sockets.adapter.rooms[socket.currentRoom].sockets;
    const blocks = [k, d, s, b, w];

    blocks.forEach((block, i) => {
      board[0][i][1] = block;
    });

    Object.keys(allPlayers).forEach((playerId) => {
      const player = io.sockets.connected[playerId];
      let row = Math.floor(Math.random() * Math.floor(12));
      let col = Math.floor(Math.random() * Math.floor(15));
      while (board[row][col][1] !== f) {
        row = Math.floor(Math.random() * Math.floor(12));
        col = Math.floor(Math.random() * Math.floor(15));
      }
      board[row][col][1] = p + player.playerNumber;
    });

    io.nsps['/'].adapter.rooms[socket.currentRoom].gameMap = board;
    io.in(socket.currentRoom).emit('updateGame', board, false);
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
      playerNumbers.push(i+1);
      io.sockets.connected[playerId].playerNumber = i+1;
    });

    if (reason === 'disconnected' && allPlayerNames.length > 0 && io.sockets.adapter.rooms[room].gameStart) {
      disconnectedPlayer.leftGame = true;
      allPlayerNames.push(disconnectedPlayer);
    } else {
      gameContainer.dropPlayerFromSession(socket.currentRoom, socket.playerInfo.name);
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
    let allReady = [];

    Object.keys(allPlayers).forEach((playerId) => {
      const player = io.sockets.connected[playerId];
      allReady.push(player.playerInfo.ready);
    });

    io.sockets.adapter.rooms[socket.currentRoom].gameStart = allReady.indexOf(false) >= 0 ? false : true;

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
