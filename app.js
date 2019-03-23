const express = require('express');
const helmet = require('helmet');
const gameSessionRouter = require('./routers/GameSession');


const app = express();
const PORT = 8000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/game', gameSessionRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => {
  console.log(`EscapeNLP Server listening on port ${PORT}!`); // eslint-disable-line no-console
});

