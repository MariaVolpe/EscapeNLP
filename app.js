const express = require('express');
const helmet = require('helmet');
const gameSessionRouter = require('./routers/GameSession');
const EscapeNLP = require('./nlp/EscapeNLP');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/game', gameSessionRouter);

app.get('/', (req, res) => res.send('Hello World! This is a test.'));

module.exports = app;
