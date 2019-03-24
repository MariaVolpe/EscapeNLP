const GameSession = require('./GameSession.js');

// simple demo logic: hold all game sessions here,
// since we aren't implementing a database or such for this barebones demo
class GameSessionsContainer {
  constructor() {
    this.games = new Map();
    this.gameIdCounter = 0;
    this.playerIdCounter = 0;
  }

  // rename b/c there's nothing about this that would indicate
  // that it returns the id
  addGame() {
    const game = new GameSession(this.gameCount);
    this.games.add(game);
    return this.gameCount++;
  }

  removeGame(id, callback) {
    if (!this.games.has(id)) {
      // todo: do we need to do anything here?
      return callback('requested gameId doesnt exist');
    }
    this.games.delete(id);
    return callback(null);
  }

  startGame(id, callback) {
    if (!this.games.has(id)) {
      // todo: do we need to do anything here?
      return callback('requested gameId doesnt exist');
    }
    this.games.get(id).generateGame();
    return callback(null);
  }

  addPlayerToGameSession(gameId, loggedInPlayerId, callback) {
    if (!this.games.has(gameId)) {
      return callback('requested gameId doesnt exist');
    }
    const playerId = loggedInPlayerId || this.playerIdCounter;
    this.games.get(gameId).addPlayerToGameSession(playerId);
    this.playerIdCounter++;
    return callback(null, playerId);
  }

  dropPlayerFromSession(gameId, playerId, callback) {
    if (!this.games.has(gameId)) {
      return callback('requested gameId doesnt exist');
    }
    this.games.get(gameId).dropPlayerFromSession(playerId);
    return callback(null);
  }
}

module.exports = GameSessionsContainer;
