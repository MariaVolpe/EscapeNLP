const getGames = require('./util/getGames');
const { io } = require('../server');
const { gameContainer } = require('../app');
const { parseActionResults } = require('./flavorText');

module.exports = (socket) => {
  socket.on('startGame', async () => {
    await gameContainer.startGame(socket.gameId);
    const board = await gameContainer.getFormattedBoard(socket.gameId);
    io.in(socket.currentRoom).emit('updateBoard', board, false);
    socket.broadcast.emit('refreshRoomsReceived', getGames(gameContainer));
  });

  const updateBoard = async () => {
    const gameComplete = await gameContainer.getIsGameCompleted(socket.gameId);

    const board = await gameContainer.getFormattedBoard(socket.gameId);
    const players = await gameContainer.getFormattedPlayersList(socket.gameId);

    io.in(socket.currentRoom).emit('updateBoard', board, gameComplete);
    io.in(socket.currentRoom).emit('updatePlayers', players);
  };

  socket.on('chatMessage', async (message) => {
    io.in(socket.currentRoom).emit('chatMessage', message);

    if (message.type === 'action') {
      const actionResults = await gameContainer.performAction(socket.gameId, message);
      parseActionResults(socket, message, actionResults);

      updateBoard();
    }
  });

  setInterval(() => {
    if (socket.currentRoom) {
      if (io.sockets.adapter.rooms[socket.currentRoom]) {
        if (io.sockets.adapter.rooms[socket.currentRoom].gameStart) {
          const currentTime = Date.now();
          const timer = currentTime - io.sockets.adapter.rooms[socket.currentRoom].startTime;
          socket.emit('updateTimer', timer);
        }
      }
    }
  }, 1000);
};
