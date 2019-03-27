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
    const game = new GameSession(this.gameIdCounter);
    this.games.set(this.gameIdCounter, game);
    return this.gameIdCounter++;
  }

  removeGame(id, callback) {
    if (!this.games.has(id)) {
      return callback({ status: 404 });
    }
    this.games.delete(id);
    callback(null);
  }

  startGame(id, callback) {
    if (!this.games.has(id)) {
      return callback({ status: 404 });
    }
    this.games.get(id).generateGame();
    callback(null);
  }

  addPlayerToGameSession(gameId, loggedInPlayerId, callback) {
    console.log(this.games.has(gameId));
    console.log()
    console.log(gameId);
    
    if (!this.games.has(gameId)) {
      return callback({ status: 404 });
    }
    const playerId = loggedInPlayerId || this.playerIdCounter;
    this.games.get(gameId).addPlayerToGameSession(playerId);
    this.playerIdCounter++;
    callback(null, playerId);
  }

  dropPlayerFromSession(gameId, playerId, callback) {
    if (!this.games.has(gameId)) {
      return callback({ status: 404 });
    }
    this.games.get(gameId).dropPlayerFromSession(playerId);
    callback(null);
  }
}

module.exports = GameSessionsContainer;
