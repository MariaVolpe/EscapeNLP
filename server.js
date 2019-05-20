const socketio = require('socket.io');
const { app } = require('./app');

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`EscapeNLP Server listening on port ${PORT}!`); // eslint-disable-line no-console
});

const io = socketio(server);

module.exports = {
  io,
};

<<<<<<< HEAD
require('./socket/socketMain');
=======
require('./socket/socket');
>>>>>>> development
