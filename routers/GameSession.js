const express = require('express');
const generateId = require('./helpers/generateId');

const router = express.Router();

router.get('/:gameId', (req, res) => {
  // fetch game updates ?
  res.json({ place: 'holder' });
});

router.post('/', (req, res) => {
  const gameId = generateId('game');
  res.json({ gameId });
});

router.delete('/:gameId', (req, res) => {
  res.sendStatus(204);
});

router.post('/:gameId/player', (req, res) => {
  // todo: check if user is logged in
  // if so grab from database
  // else for guests...:
  const playerId = generateAgentId('player'); // todo: generate player id
  res.json({ playerId });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  // todo
  res.sendStatus(204);
});

module.exports = router;
