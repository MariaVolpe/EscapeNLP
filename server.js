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

const g = 'ground';
const p = 'player';
const k = 'key';
const d = 'dragon';
const s = 'switch';
const b = 'block';
const w = 'weapon';

io.on('connection', (socket) => {
  console.log('connection established');

  socket.on('joinRoom', (roomId) => {
    let prevRooms = Object.keys(io.sockets.adapter.sids[socket.id]);
    prevRooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(roomId);
    socket.currentRoom = roomId;
    console.log(Object.keys(io.sockets.adapter.sids[socket.id]))
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
    // if (message.type === 'action') {
    //   gameContainer.performAction(socket.currentRoom, message);
    // }
    io.in(socket.currentRoom).emit('chatMessage', message);
  });

  socket.on('updateGame', () => {
    const numberOfPlayers = io.nsps['/'].adapter.rooms[socket.currentRoom].length;
    let currentGame = io.nsps['/'].adapter.rooms[socket.currentRoom].gameMap;
    for (let i=0; i<numberOfPlayers; i++) {
      let row = Math.floor(Math.random() * Math.floor(12));
      let col = Math.floor(Math.random() * Math.floor(15));
      while (currentGame[row][col] === p) {
        row = Math.floor(Math.random() * Math.floor(12));
        col = Math.floor(Math.random() * Math.floor(15));
      }
      currentGame[row][col] = p;
    }
    io.in(socket.currentRoom).emit('updateGame', currentGame, false);
  });

  socket.on('setBoard', () => {
    const gameMap = [
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
      [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g]
    ];
    io.nsps['/'].adapter.rooms[socket.currentRoom].gameMap = gameMap;
    io.in(socket.currentRoom).emit('updateGame', gameMap, false);
  });

  const updatePlayers = (reason) => {
    const allPlayerNames = [];
    const allPlayers = io.sockets.adapter.rooms[socket.currentRoom].sockets;

    Object.keys(allPlayers).forEach((playerId) => {
      if (reason === 'disconnected') {
        io.sockets.connected[playerId].playerInfo.ready = false;
      }
      const player = io.sockets.connected[playerId];
      if (player.playerInfo) {
        allPlayerNames.push(player.playerInfo);
      }
    });

    io.in(socket.currentRoom).emit('setNames', allPlayerNames);
  };

  socket.on('getName', (playerInfo) => {
    socket.playerInfo = playerInfo;
    updatePlayers('');
  });

  socket.on('readyToggle', () => {
    socket.playerInfo.ready = !socket.playerInfo.ready;
    io.in(socket.currentRoom).emit('readyUp', socket.playerInfo);
  });

  socket.on('disconnect', () => {
    if (io.nsps['/'].adapter.rooms[socket.currentRoom] && socket.playerInfo) {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const mess = `${socket.playerInfo.name} has disconnected`;
      const message = { commenter:time, time:'', mess };
      io.in(socket.currentRoom).emit('chatMessage', message);
      io.in(socket.currentRoom).emit('removePlayer', socket.playerInfo.name);
      delete socket.currentRoom;
      updatePlayers('disconnected');
    }
  });
});
