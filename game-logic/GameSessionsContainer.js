const GameSession = require('./GameSession.js');

// simple demo logic: hold all game sessions here,
// since we aren't implementing a database or such for this barebones demo
class GameSessionsContainer {
  constructor() {
    this.games = new Map();
    this.gameCount = 0;
  }

  addGame() {
    const game = new GameSession(this.gameCount);
    this.games.add(game);
    this.gameCount++;
  }

  removeGame(id) {
    if (!this.games.has(id)) {
      // todo: do we need to do anything here?
      return;
    }
    this.games.delete(id);
  }
}

module.exports = GameSessionsContainer;
