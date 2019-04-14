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

io.on('connection', (socket) => {
  console.log('connection established');
  socket.emit('messageFromServer', { data: 'welcome' });

  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });

  var currentRoom;

  socket.on('joinRoom', (roomInfo) => {
    socket.join(roomInfo);
    currentRoom = Object.keys( io.sockets.adapter.sids[socket.id] )[1];
    let allRooms = Object.keys(io.sockets.adapter.rooms);
    let gameRooms = [];
    for (let i=0; i<allRooms.length; i++) {
      //every socket is automatically put into a hashed room of length 20
      if (allRooms[i].length < 20) {
        gameRooms.push(allRooms[i]);
      }
    }
    socket.broadcast.emit('getAllRooms', gameRooms);
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
    let allRooms = Object.keys(io.sockets.adapter.rooms);
    let gameRooms = [];
    for (let i=0; i<allRooms.length; i++) {
      //every socket is automatically put into a hashed room of length 20
      if (allRooms[i].length < 20) {
        gameRooms.push(allRooms[i]);
      }
    }
    console.log(gameRooms);
    socket.emit('getAllRooms', gameRooms);
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
