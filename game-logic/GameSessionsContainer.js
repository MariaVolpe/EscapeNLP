const GameSession = require('./GameSession.js');

// simple demo logic: hold all game sessions here,
// since we aren't implementing a database or such for this barebones demo

const notFoundErr = (id) => {
  const error = { error: { status: 404, source: 'id' } };

  if (typeof id === 'string') {
    error.message = 'field id expected an integer but received a string';
  }

  return error;
};

class GameSessionsContainer {
  constructor() {
    this.games = new Map();
    this.gameIdCounter = 0;
    this.playerIdCounter = 0;
  }

  getFormattedBoard(id) {
    if (!this.games.has(id)) {
      return notFoundErr(id);
    }
    return this.games.get(id).getFormattedBoard();
  }

  startGame(id) {
    if (!this.games.has(id)) {
      return notFoundErr(id);
    }
    this.games.get(id).startGame();
  }

  getAllSessions() {
    const games = [];
    this.games.forEach(({ playerCount, id: gameId, name: gameName, inProgress }) => {
      games.push({
        gameId, gameName, playerCount, inProgress,
      });
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
      return notFoundErr(id);
    }
    this.games.delete(id);
    return { error: null };
  }

  addPlayerToSession(gameId, loggedInPlayerId) {
    if (!this.games.has(gameId)) {
      return notFoundErr(gameId);
    }
    const playerId = loggedInPlayerId || this.playerIdCounter;
    this.games.get(gameId).addPlayerToSession(playerId);
    this.playerIdCounter++;
    return { data: { playerId } };
  }

  dropPlayerFromSession(gameId, playerId) {
    if (!this.games.has(gameId)) {
      return notFoundErr(gameId);
    }
    return this.games.get(gameId).dropPlayerFromSession(playerId);
  }
}

module.exports = GameSessionsContainer;
