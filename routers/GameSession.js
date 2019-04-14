const express = require('express');

const router = express.Router();

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
  const results = req.gameContainer.getAllSessions();
  const { data } = results;
  res.json({ error: null, data });
});

router.get('/:gameId', (req, res) => {
  const results = req.gameContainer.getGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    const { error } = results;
    return res.status(error.status).json({ error, data: null });
  }
  const { data } = results;
  res.json({ error: null, data });
});

router.post('/', (req, res) => {
  const results = req.gameContainer.addGame();
  const { data } = results;
  res.status(201).json({ error: null, data });
});

router.delete('/:gameId', (req, res) => {
  const results = req.gameContainer.removeGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    const { error } = results;
    return res.status(error.status).json({ error, data: null });
  }
  res.sendStatus(204);
});

router.post('/:gameId/player', (req, res) => {
  // todo: check if user is logged in
  // if so grab from database
  // else for guests...:
  const results = req.gameContainer.addPlayerToSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
  );
  if (results.error) {
    const { error } = results;
    return res.status(error.status).json({ error, data: null });
  }
  const { data } = results;
  res.status(201).json({ error: null, data });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  const results = req.gameContainer.dropPlayerFromSession(
    parseInt(req.params.gameId, 10),
    parseInt(req.params.playerId, 10),
  );
  if (results.error) {
    const { error } = results;
    return res.status(error.status).json({ error, data: null });
  }
  res.sendStatus(204);
});

router.post('/:gameId/start', (req, res) => {
  const results = req.gameContainer.startGame(parseInt(req.params.gameId, 10));
  if (results.error) {
    const { error } = results;
    return res.status(error.status).json({ error, data: null });
  }
  res.sendStatus(204);
});

router.post('/:gameId/action', parseAction, (req, res) => {
  res.json({ actionResult: 'text' });
});

module.exports = router;
