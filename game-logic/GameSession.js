const PuzzleManager = require('./PuzzleManager');
const Agent = require('./Agent');
const Grid = require('./Grid');

class GameSession {
  constructor() {
    this.puzzleManager = new PuzzleManager();
    this.agents = [];
  }

  addPlayerToGameSession(id) {
    const agent = new Agent(id);
    this.agents.push(agent);
  }

  dropPlayerFromGameSession(id) {
    const newAgents = [];
    this.agents.forEach((agent) => {
      if (agent.id !== id) {
        newAgents.push(agent);
      }
    });
    this.agents = newAgents;
  }

  // right now, it makes sense to generate the game AFTER all players have joined
  // to make sure the game is calibrated for the right number of players
  // however if the performance on this is poor, we can optimize by adding puzzles
  // as each player joins, and if players leave, attempt to regen some parts
  generateGame() {
    const size = 12;
    this.grid = new Grid(size);
    // possible steps: todo: generate puzzles therefore map
    // todo: generate player starting locations
    const positions = [];
    this.addAgentsToMap(positions);
  }

  // drop everyone onto map AFTER game starts, again unless performance is poor
  addAgentsToMap(positions) {
    positions.forEach((position, index) => {
      this.grid.add(this.agents[index], position);
    });
  }
}

module.exports = GameSession;
