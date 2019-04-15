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

var currentRoom;

io.on('connection', (socket) => {
  console.log('connection established');
  socket.emit('messageFromServer', { data: 'welcome' });

  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;
    socket.broadcast.emit('getAllRooms', getGames());
  });

  socket.on('attemptJoin', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo] && io.nsps['/'].adapter.rooms[roomInfo].length > 4) {
      socket.emit('canJoin', false);
    }
    else {
      socket.emit('canJoin', true);
    }
  });

  socket.on('confirmJoin', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo] && io.nsps['/'].adapter.rooms[roomInfo].length > 4) {
      socket.emit('confirmJoin', false);
    }
    else {
      socket.emit('confirmJoin', true);
    }
  });

  socket.on('checkRoomSize', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo]) {
      let roomSize = io.nsps['/'].adapter.rooms[roomInfo].length;
      console.log('room size: ' + roomSize);
      socket.emit('checkRoomSize', roomSize);
    }
  });

  socket.on('getAllRooms', () => {
    socket.emit('getAllRooms', getGames());
  });

  socket.on('chatMessage', (dataFromClient) => {
    console.log(dataFromClient);
    io.in(currentRoom).emit('chatMessage', dataFromClient);
  });

  socket.on('getName', (playerInfo) => {
    socket.playerInfo = playerInfo;
    let allPlayerNames = [];
    let allPlayers = io.sockets.adapter.rooms[currentRoom].sockets;
    for (let playerId in allPlayers) {
      let player = io.sockets.connected[playerId];
      if (player.playerInfo !== undefined) {
        allPlayerNames.push(player.playerInfo);

      }
      console.log(allPlayerNames);
    }

    io.in(currentRoom).emit('setNames', allPlayerNames);
  });

  socket.on('readyToggle', () => {
    socket.playerInfo[1] = !socket.playerInfo[1];
    let allPlayerNames = [];
    let allPlayers = io.sockets.adapter.rooms[currentRoom].sockets;
    for (let playerId in allPlayers) {
      let player = io.sockets.connected[playerId];
      if (player.playerInfo !== undefined) {
        allPlayerNames.push(player.playerInfo);

      }
      console.log(allPlayerNames);
    }

    io.in(currentRoom).emit('setNames', allPlayerNames);
  });
});

io.of('/game').on('connect', (socket) => {
  console.log('welcome to the game');
  socket.emit('messageFromServer', { data: 'welcome' });
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });
});
