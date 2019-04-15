const GameSession = require('./GameSession.js');

// simple demo logic: hold all game sessions here,
// since we aren't implementing a database or such for this barebones demo
class GameSessionsContainer {
  constructor() {
    this.games = new Map();
    this.gameIdCounter = 0;
    this.playerIdCounter = 0;
  }

  getGame(id) {
    if (!this.games.has(id)) {
      return { error: { status: 404 } };
    }
    return { data: this.games.get(id).getGame() };
  }

  getAllSessions() {
    const games = [];
    this.games.forEach(({ playerCount, id: gameId, name: gameName }) => {
      games.push({ gameId, gameName, playerCount });
    });
    return { data: games };
  }

  // rename b/c there's nothing about this that would indicate
  // that it returns the id
  addGame(name) {
    const game = new GameSession(this.gameIdCounter, name);
    this.games.set(this.gameIdCounter, game);
    return { data: { gameId: this.gameIdCounter++ } };
  }

  removeGame(id) {
    if (!this.games.has(id)) {
      return { error: { status: 404 } };
    }
    this.games.delete(id);
    return { error: null };
  }

  startGame(id) {
    if (!this.games.has(id)) {
      return { error: { status: 404 } };
    }
    this.games.get(id).generateGame();
    return { error: null };
  }

  addPlayerToSession(gameId, loggedInPlayerId) {
    if (!this.games.has(gameId)) {
      return { error: { status: 404 } };
    }
    const playerId = loggedInPlayerId || this.playerIdCounter;
    this.games.get(gameId).addPlayerToSession(playerId);
    this.playerIdCounter++;
    return { data: { playerId } };
  }

  dropPlayerFromSession(gameId, playerId) {
    if (!this.games.has(gameId)) {
      return { error: { status: 404, source: 'gameId' } };
    }
    return this.games.get(gameId).dropPlayerFromSession(playerId);
  }
}

module.exports = GameSessionsContainer;
