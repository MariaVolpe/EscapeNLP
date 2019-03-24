const express = require('express');
const generateId = require('../helpers/generateId');

const router = express.Router();

const parseAction = (req, res, next) => {
  // NLP parse
  next();
};

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
  const playerId = generateId('player');
  res.json({ playerId });
});

router.delete('/:gameId/player/:playerId', (req, res) => {
  // todo
  res.sendStatus(204);
});

router.post('/:gameId/action', parseAction, (req, res) => {
  res.json({ actionResult: 'text' });
});

module.exports = router;
