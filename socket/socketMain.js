const getGames = require('./util/getGames');
const { io } = require('../server');
const { gameContainer } = require('../app');
const registerGameListeners = require('./gameListeners');
const registerPlayerListeners = require('./playerListeners');

io.on('connection', (socket) => {
  console.log('connection established'); // eslint-disable-line no-console

  registerGameListeners(socket);
  registerPlayerListeners(socket);

  socket.on('checkRoomSize', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo]) {
      const roomSize = io.nsps['/'].adapter.rooms[roomInfo].length;
      socket.emit('checkRoomSize', roomSize);
    }
  });

  socket.on('getAllRooms', () => {
    socket.emit('refreshRoomsReceived', getGames(gameContainer));
  });

  socket.on('updatePlayerCount', (playerList, roomId) => {
    io.in(roomId).emit('updatePlayerCount', playerList);
  });
});
