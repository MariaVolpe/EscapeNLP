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

router.get('/:gameId', (req, res) => {
  // todo: fetch game updates ?
  res.json({ place: 'holder' });
});

router.post('/', (req, res) => {
  const gameId = GameContainer.addGame();
  res.json({ gameId });
});

router.delete('/:gameId', (req, res) => {
  GameContainer.removeGame(req.params.gameId, (err) => {
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
  GameContainer.addPlayerToGameSession(req.params.gameId, playerId, (err, id) => {
    if (err) {
      return res.sendStatus(err.status);
    }
    playerId = id;
    res.json({ playerId });
  });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  GameContainer.dropPlayerFromSession(req.params.gameId, req.params.playerId, (err) => {
    if (err) {
      return res.sendStatus(err.status);
    }
    res.sendStatus(204);
  });
});

router.post('/:gameId/start', (req, res) => {
  GameContainer.startGame(req.params.gameId, (err) => {
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
