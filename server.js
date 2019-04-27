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
    if (dataFromClient.type === 'action') {
      console.log('give data to game logic');
      io.in(currentRoom).emit('updateGame', ({'playerOne': {inventory: {}, ready: false}}, [], false));
    }
    io.in(currentRoom).emit('chatMessage', dataFromClient);
  });

  socket.on('updateGame', () => {
    io.in(currentRoom).emit('updateGame', ({'playerOne': {inventory: {}, ready: false}}, [], false));
  })

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
      updatePlayers('disconnected');
    }
  });
});
