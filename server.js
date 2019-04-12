const socketio = require('socket.io');
const app = require('./app');

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
  socket.on('chatMessage', (dataFromClient) => {
    console.log(dataFromClient);
  });
});

io.of('/game').on('connect', (socket) => {
  console.log('welcome to the game');
  socket.emit('messageFromServer', { data: 'welcome' });
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });
});
