import PuzzleManager from './PuzzleManager';
import Grid from './Grid';

class GameSession {
  constructor() {
    this.puzzleManager = new PuzzleManager();
    this.grid = new Grid();
    this.agents = [];
  }
}

export default GameSession;
