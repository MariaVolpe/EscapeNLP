const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const results = req.gameContainer.addGame(req.body.gameName);
  const { data } = results;
  res.status(201).json({ error: null, data });
});

router.post('/:gameId/player', (req, res) => {
  // stretch goal: check if user is logged in
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

module.exports = router;
