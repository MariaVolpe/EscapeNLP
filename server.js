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

let currentRoom;

io.on('connection', (socket) => {
  console.log('connection established');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;
    socket.broadcast.emit('refreshRoomsReceived', getGames());
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

  socket.on('chatMessage', (dataFromClient) => {
    io.in(currentRoom).emit('chatMessage', dataFromClient);
  });

  const updatePlayers = () => {
    const allPlayerNames = [];
    const allPlayers = io.sockets.adapter.rooms[currentRoom].sockets;

    Object.keys(allPlayers).forEach((playerId) => {
      const player = io.sockets.connected[playerId];
      if (player.playerInfo) {
        allPlayerNames.push(player.playerInfo);
      }
    });

    io.in(currentRoom).emit('setNames', allPlayerNames);
  };

  socket.on('getName', (playerInfo) => {
    socket.playerInfo = playerInfo;
    updatePlayers();
  });

  socket.on('readyToggle', () => {
    socket.playerInfo[1] = !socket.playerInfo[1];
    updatePlayers();
  });

  socket.on('disconnect', () => {
    if (io.nsps['/'].adapter.rooms[currentRoom] && socket.playerInfo) {
      let date = new Date();
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let mess = socket.playerInfo[0] + ' has disconnected';
      const message = ['', time, mess];
      io.in(currentRoom).emit('chatMessage', message);
      updatePlayers();
    }
  });
});
