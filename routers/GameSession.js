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
  const results = gameContainer.getAllSessions();
  const { data } = results;
  res.json({ data });
});

router.get('/:gameId', (req, res) => {
  const results = gameContainer.getGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    return res.sendStatus(results.error.status);
  }
  const { data } = results;
  res.json({ data });
});

router.post('/', (req, res) => {
  const results = gameContainer.addGame();
  const { data } = results;
  res.status(201).json({ data });
});

router.delete('/:gameId', (req, res) => {
  const results = gameContainer.removeGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    return res.sendStatus(results.error.status);
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
  const { data } = results;
  res.status(201).json({ data });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  const results = gameContainer.dropPlayerFromSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
  );
  if (results.error) {
    return res.status(results.error.status).json(results.error);
  }
  res.sendStatus(204);
});

router.post('/:gameId/start', (req, res) => {
  const results = gameContainer.startGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    const err = results.error;
    return res.status(err.status);
  }
  res.sendStatus(204);
});

router.post('/:gameId/action', parseAction, (req, res) => {
  res.json({ actionResult: 'text' });
});

module.exports = router;
