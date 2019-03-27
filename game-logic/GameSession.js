const PuzzleManager = require('./PuzzleManager');
const Agent = require('./Agent');
const Grid = require('./Grid');

class GameSession {
  constructor(id) {
    this.puzzleManager = null;
    this.grid = null;
    this.agents = [];
    this.id = id;
  }

  addPlayerToGameSession(id) {
    this.agents.push(new Agent(id));
  }

  dropPlayerFromGameSession(id, callback) {
    const newAgents = [];
    let err = { status: 404, source: 'playerId' };

    this.agents.forEach((agent) => {
      if (agent.id !== id) {
        newAgents.push(agent);
      } else {
        err = null;
      }
    });

    this.agents = newAgents;
    callback(err);
  }

  // right now, it makes sense to generate the game AFTER all players have joined
  // to make sure the game is calibrated for the right number of players
  // however if the performance on this is poor, we can optimize by adding puzzles
  // as each player joins, and if players leave, attempt to regen some parts
  generateGame() {
    const size = 12;
    this.grid = new Grid(size);
    this.puzzleManager = new PuzzleManager(this.grid, this.agents.length);
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
}

module.exports = GameSession;
