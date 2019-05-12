const express = require('express');
const helmet = require('helmet');
const path = require('path');
const gameSessionRouter = require('./routers/GameSession');
const GameSessionsContainer = require('./game-logic/GameSessionsContainer');

const gameContainer = new GameSessionsContainer();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/game', (req, res, next) => {
  req.gameContainer = gameContainer;
  next();
}, gameSessionRouter);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = { app, gameContainer };
