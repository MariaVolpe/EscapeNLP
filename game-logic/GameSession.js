const Agent = require('./Agent');
const Grid = require('./Grid');
const PuzzleManager = require('./PuzzleManager');
const roomLayout = require('./room-layouts/room-1');


class GameSession {
  constructor(id, name) {
    this.puzzleManager = null;
    this.grid = null;
    this.agents = [];
    this.puzzleManager = null;
    this.id = id;
    this.name = name;
  }

  getGame() {
    const players = this.agents.map(({ inventory, id }) => ({ inventory, id }));
    return { id: this.id, grid: this.grid, players };
  }

  addPlayerToSession(id) {
    this.agents.push(new Agent(id));
  }

  dropPlayerFromSession(id) {
    const newAgents = this.agents.filter(agent => agent.id !== id);
    if (newAgents.length === this.agents.length) {
      return { error: { status: 404, source: 'playerId' } };
    }

    this.agents = newAgents;
    return { error: null };
  }

  // right now, it makes sense to generate the game AFTER all players have joined
  // to make sure the game is calibrated for the right number of players
  // however if the performance on this is poor, we can optimize by adding puzzles
  // as each player joins, and if players leave, attempt to regen some parts
  generateGame() {
    const size = 12;
    const grid = roomLayout.build();
    this.grid = new Grid(size);
    this.puzzleManager = new PuzzleManager(this.grid);
    this.puzzleManager.addPuzzlesToBoard();

    // todo: generate player starting locations
    this.addAgentsToMap();
  }

  // drop everyone onto map AFTER game starts, again unless performance is poor
  addAgentsToMap(positions) {
    if (positions) {
      positions.forEach((position, index) => {
        this.grid.add(this.agents[index], position);
      });
      return;
    }

    // simple demo logic: drop agents onto first available space
    this.agents.forEach((agent) => {
      this.grid.add(agent);
    });
  }

  get playerCount() {
    return this.agents.length;
  }
}

module.exports = GameSession;
