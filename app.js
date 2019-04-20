const express = require('express');
const helmet = require('helmet');
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

app.get('/', (req, res) => res.send('Hello World! This is a test.'));

module.exports = { app, gameContainer };
