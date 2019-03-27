const express = require('express');
const GameSessionsContainer = require('../game-logic/GameSessionsContainer');

const router = express.Router();
const GameContainer = new GameSessionsContainer();

const parseAction = (req, res, next) => {
  // NLP parse
  next();
};

const checkForFailure = (req, res) => {
  if (!res.headersSent) {
    res.sendStatus(500);
  }
};

router.get('/', (req, res) => {
  res.json({ place: 'holder' });
});

router.get('/:gameId', (req, res) => {
  // todo: fetch game updates ?
  res.json({ place: 'holder' });
});

router.post('/', (req, res) => {
  const gameId = GameContainer.addGame();
  res.status(201).json({ gameId });
});

router.delete('/:gameId', (req, res) => {
  GameContainer.removeGame(parseInt(req.params.gameId, 10), (err) => {
    if (err) {
      return res.sendStatus(err.status);
    }
    res.sendStatus(204);
  });
});

router.post('/:gameId/player', (req, res) => {
  let playerId = null;
  // todo: check if user is logged in
  // if so grab from database
  // else for guests...:
  GameContainer.addPlayerToGameSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
    (err, id) => {
      if (err) {
        return res.sendStatus(err.status);
      }
      playerId = id;
      res.status(201).json({ playerId });
    },
  );
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  GameContainer.dropPlayerFromGameSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
    (err) => {
      if (err) {
        return res.status(err.status).json(err);
      }
      res.sendStatus(204);
    },
  );
});

router.post('/:gameId/start', (req, res) => {
  GameContainer.startGame(parseInt(req.params.gameId, 10), (err) => {
    if (err) {
      return res.sendStatus(err.status);
    }
    res.sendStatus(204);
  });
});

router.post('/:gameId/action', parseAction, (req, res) => {
  res.json({ actionResult: 'text' });
});

module.exports = router;
