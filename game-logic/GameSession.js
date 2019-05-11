const Agent = require('./Agent');
const { Grid } = require('./Grid');
const PuzzleManager = require('./PuzzleManager');
const roomLayoutBuild = require('./room-layouts/room-1');

class GameSession {
  constructor(id, name) {
    this.puzzleManager = null;
    this.grid = null;
    this.agents = [];
    this.puzzleManager = null;
    this.id = id;
    this.name = name;
    this.playerIdCounter = 0;
  }

  getFormattedBoard() {
    return this.grid.getFormattedGrid();
  }

  addPlayerToSession() {
    this.agents.push(new Agent(this.playerIdCounter));
    return this.playerIdCounter++;
  }

  dropPlayerFromSession(id) {
    const newAgents = this.agents.filter(agent => agent.id !== id);
    if (newAgents.length === this.agents.length) {
      return { error: { status: 404, source: 'playerId' } };
    }

    this.agents = newAgents;
    return { error: null };
  }

  // formats players array into the object format used on frontend
  // this object format may not be optimal but we'd have to rewrite
  // a good chunk of the frontend to fix it
  getFormattedPlayersList() {
    const formattedObj = {};
    const agentObjs = this.agents.map(agent => ({
      name: agent.name,
      id: agent.id,
      inventory: agent.getFormattedInventory(),
    }));

    this.agents.forEach((agent, index) => {
      formattedObj[agent.name] = agentObjs[index];
    });

    return formattedObj;
  }

  // right now, it makes sense to generate the game AFTER all players have joined
  // to make sure the game is calibrated for the right number of players
  // however if the performance on this is poor, we can optimize by adding puzzles
  // as each player joins, and if players leave, attempt to regen some parts
  generateGame() {
    // const size = 12;
    const grid = roomLayoutBuild();
    this.grid = new Grid(grid);
    this.puzzleManager = new PuzzleManager(this.grid);
    this.puzzleManager.addPuzzlesToBoard();

    // todo: generate player starting locations
    this.addAgentsToMap();
  }

  // drop everyone onto map AFTER game starts, again unless performance is poor
  addAgentsToMap() {
    const spawnPoints = [{ x: 1, y: 7 }, { x: 1, y: 9 }, { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 2, y: 8 }];
    this.agents.forEach((agent) => {
      this.grid.add(agent, spawnPoints.pop());
    });
  }

  get playerCount() {
    return this.agents.length;
  }
}

module.exports = GameSession;
