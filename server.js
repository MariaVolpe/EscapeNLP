const socketio = require('socket.io');
const { app, gameContainer } = require('./app');

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`EscapeNLP Server listening on port ${PORT}!`); // eslint-disable-line no-console
});

const io = socketio(server);

const getGames = () => {
  const { data } = gameContainer.getAllSessions();
  return data;
};


const safeGetAtIndex = (arr, index) => {
  if (arr && Array.isArray(arr) && arr.length > index) {
    return arr[index];
  }
};

const parseActionResults = (socket, message, actionResults) => {
  const failActionText = {
    type: 'flavor',
    time: message.time,
    commenter: message.commenter,
    mess: 'You can\'t do that.',
  };

  actionResults.forEach((actionObj) => {
    if (!actionObj.action || !actionObj.result) {
      return io.in(socket.currentRoom).emit('chatMessage', failActionText);
    }

    let interprettedMsg = `action: ${actionObj.action}, `;
    interprettedMsg += `${actionObj.result.length > 1 ? 'targets:' : 'target:'} `;

    actionObj.result.forEach((result) => {
      interprettedMsg += `${result.objectName}, `;
    });

    if (actionObj.action === 'move') {
      interprettedMsg += `destination: ${safeGetAtIndex(actionObj.result, 0).destination}, `;
    }

    interprettedMsg = interprettedMsg.slice(0, interprettedMsg.length - 2);

    const actionMsg = {
      type: 'interpreted',
      time: message.time,
      commenter: message.commenter,
      mess: interprettedMsg,
    };

    io.in(socket.currentRoom).emit('chatMessage', actionMsg);

    actionObj.result.forEach((item) => {
      if (item.text) {
        const flavorText = {
          type: 'flavor',
          time: message.time,
          commenter: message.commenter,
          mess: item.text,
        };

        io.in(socket.currentRoom).emit('chatMessage', flavorText);
      }

      // 'successful' must be explicitly set to false
      // or else the action should be assumed to be successful
      if (!item.text && item.successful === false) {
        io.in(socket.currentRoom).emit('chatMessage', failActionText);
      }
    });
  });
};

io.on('connection', (socket) => {
  console.log('connection established'); // eslint-disable-line no-console

  socket.on('checkRoomSize', (roomInfo) => {
    if (io.nsps['/'].adapter.rooms[roomInfo]) {
      const roomSize = io.nsps['/'].adapter.rooms[roomInfo].length;
      socket.emit('checkRoomSize', roomSize);
    }
  });

  socket.on('joinRoom', (roomId) => {
    const prevRooms = Object.keys(io.sockets.adapter.sids[socket.id]);
    prevRooms.forEach((room) => {
      socket.leave(room);
    }); // force current socket to only belong to one room when they join a game
    socket.join(roomId);
    const roomSize = io.nsps['/'].adapter.rooms[roomId].length;
    socket.currentRoom = roomId;
    socket.gameId = parseInt(roomId, 10);
    socket.playerNumber = roomSize;
    socket.broadcast.emit('refreshRoomsReceived', getGames());
    io.nsps['/'].adapter.rooms[roomId].timer = 0;
    io.in(socket.currentRoom).emit('playerIsJoining', roomSize);
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
    } else if (io.nsps['/'].adapter.rooms[roomInfo] && io.sockets.adapter.rooms[roomInfo].gameStart) {
      socket.emit('confirmJoin', false);
    } else {
      socket.emit('confirmJoin', true);
    }
  });

  socket.on('getAllRooms', () => {
    socket.emit('refreshRoomsReceived', getGames());
  });

  socket.on('chatMessage', async (message) => {
    io.in(socket.currentRoom).emit('chatMessage', message);

    if (message.type === 'action') {
      const actionResults = await gameContainer.performAction(socket.gameId, message);
      parseActionResults(socket, message, actionResults);

      const gameComplete = await gameContainer.getIsGameCompleted(socket.gameId);

      const board = await gameContainer.getFormattedBoard(socket.gameId);
      const players = await gameContainer.getFormattedPlayersList(socket.gameId);

      io.in(socket.currentRoom).emit('updateBoard', board, gameComplete);
      io.in(socket.currentRoom).emit('updatePlayers', players);
    }
  });

  socket.on('getInventories', (inventories) => {
    io.in(socket.currentRoom).emit('updateInventories', inventories);
  });

  socket.on('startGame', async () => {
    await gameContainer.startGame(socket.gameId);
    const board = await gameContainer.getFormattedBoard(socket.gameId);
    io.in(socket.currentRoom).emit('updateBoard', board, false);
  });

  const updatePlayers = (reason, room, disconnectedPlayer) => {
    const allPlayerNames = [];
    const allPlayers = io.sockets.adapter.rooms[room].sockets;

    Object.keys(allPlayers).forEach((playerId, i) => {
      if (reason === 'disconnected') {
        io.sockets.connected[playerId].playerInfo.ready = false;
        if (!io.sockets.adapter.rooms[room].gameStart) {
          io.sockets.connected[playerId].playerNumber = i + 1;
          io.sockets.connected[playerId].playerInfo.position = i + 1;
        }
      }
      const player = io.sockets.connected[playerId];
      if (player.playerInfo) {
        allPlayerNames.push(player.playerInfo);
      }
    });

    if (reason === 'disconnected' && allPlayerNames.length > 0 && io.sockets.adapter.rooms[room].gameStart) {
      disconnectedPlayer.hasLeftGame = true;
      allPlayerNames.push(disconnectedPlayer);
    }

    io.in(room).emit('setNames', allPlayerNames);
  };

  socket.on('getName', async (playerInfo) => {
    socket.playerInfo = playerInfo;
    if (playerInfo !== '') {
      const { playerId, name } = playerInfo;
      await gameContainer.setPlayerName(socket.gameId, playerId, name);
    }

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

    const shouldStart = !(allReady.indexOf(false) >= 0);
    io.sockets.adapter.rooms[socket.currentRoom].gameStart = shouldStart;

    if (shouldStart) {
      io.sockets.adapter.rooms[socket.currentRoom].startTime = Date.now();
    }

    io
      .in(socket.currentRoom)
      .emit('readyUp', socket.playerInfo, shouldStart);
  });

  socket.on('disconnect', () => {
    if (io.nsps['/'].adapter.rooms[socket.currentRoom] && socket.playerInfo) {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const mess = `${socket.playerInfo.name} has disconnected`;
      const message = { commenter: time, time: '', mess };
      gameContainer.dropPlayerFromSession(socket.gameId, socket.playerInfo.name);
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
});
