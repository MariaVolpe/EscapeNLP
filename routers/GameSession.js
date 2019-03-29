const express = require('express');
const GameSessionsContainer = require('../game-logic/GameSessionsContainer');

const router = express.Router();
const gameContainer = new GameSessionsContainer();

const parseAction = (req, res, next) => {
  // NLP parse
  next();
};

const checkForFailure = (req, res) => {
  if (!res.headersSent) {
    res.sendStatus(500);
  }
};

// to do: rename route? this only returns the bare minimum of session info
// will not be consistent with what is returned from GET /game/:id
router.get('/', (req, res) => {
  const games = gameContainer.getAllSessions();
  res.json(games);
});

router.get('/:gameId', (req, res) => {
  const results = gameContainer.getGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    return res.sendStatus(results.error.status);
  }
  const { game } = results;
  res.json({ game });
});

router.post('/', (req, res) => {
  const gameId = gameContainer.addGame();
  res.status(201).json({ gameId });
});

router.delete('/:gameId', (req, res) => {
  const err = gameContainer.removeGame(parseInt(req.params.gameId, 10));
  if (err) {
    return res.sendStatus(err.status);
  }
  res.sendStatus(204);
});

router.post('/:gameId/player', (req, res) => {
  // todo: check if user is logged in
  // if so grab from database
  // else for guests...:
  const results = gameContainer.addPlayerToSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
  );
  if (results.error) {
    return res.sendStatus(results.error.status);
  }
  const { playerId } = results;
  res.status(201).json({ playerId });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  const err = gameContainer.dropPlayerFromSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
  );
  if (err) {
    return res.status(err.status).json(err);
  }
  res.sendStatus(204);
});

router.post('/:gameId/start', (req, res) => {
  const err = gameContainer.startGame(parseInt(req.params.gameId, 10));
  if (err) {
    return res.sendStatus(err.status);
  }
  res.sendStatus(204);
});

router.post('/:gameId/action', parseAction, (req, res) => {
  res.json({ actionResult: 'text' });
});

module.exports = router;
