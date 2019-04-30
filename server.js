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
let gameMap = [
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
let defaultMap = [
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

let currentRoom;

io.on('connection', (socket) => {
  console.log('connection established');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;
    socket.broadcast.emit('refreshRoomsReceived', getGames());
    io.in(currentRoom).emit('playerIsJoining', io.nsps['/'].adapter.rooms[currentRoom].length);
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
    //   gameContainer.performAction(currentRoom, message);
    // }
    io.in(currentRoom).emit('chatMessage', message);
  });

  socket.on('updateGame', () => {
    const numberOfPlayers = io.nsps['/'].adapter.rooms[currentRoom].length;
    for (let i=0; i<numberOfPlayers; i++) {
      let row = Math.floor(Math.random() * Math.floor(12));
      let col = Math.floor(Math.random() * Math.floor(15));
      while (gameMap[row][col] === p) {
        row = Math.floor(Math.random() * Math.floor(12));
        col = Math.floor(Math.random() * Math.floor(15));
      }
      gameMap[row][col] = p;
    }
    io.in(currentRoom).emit('updateGame', gameMap, false);
  });

  socket.on('setBoard', () => {
    io.in(currentRoom).emit('updateGame', gameMap, false);
  });

  const updatePlayers = (reason) => {
    const allPlayerNames = [];
    const allPlayers = io.sockets.adapter.rooms[currentRoom].sockets;

    Object.keys(allPlayers).forEach((playerId) => {
      if (reason === 'disconnected') {
        io.sockets.connected[playerId].playerInfo.ready = false;
      }
      const player = io.sockets.connected[playerId];
      if (player.playerInfo) {
        allPlayerNames.push(player.playerInfo);
      }
    });

    io.in(currentRoom).emit('setNames', allPlayerNames);
  };

  socket.on('getName', (playerInfo) => {
    socket.playerInfo = playerInfo;
    updatePlayers('');
  });

  socket.on('readyToggle', () => {
    socket.playerInfo.ready = !socket.playerInfo.ready;
    io.in(currentRoom).emit('readyUp', socket.playerInfo);
  });

  socket.on('disconnect', () => {
    if (io.nsps['/'].adapter.rooms[currentRoom] && socket.playerInfo) {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const mess = `${socket.playerInfo.name} has disconnected`;
      const message = { commenter:time, time:'', mess };
      io.in(currentRoom).emit('chatMessage', message);
      io.in(currentRoom).emit('removePlayer', socket.playerInfo.name);
      gameMap = defaultMap;
      updatePlayers('disconnected');
    }
  });
});
