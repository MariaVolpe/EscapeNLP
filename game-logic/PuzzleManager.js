const Puzzle = require('./Puzzle');

class PuzzleManager {
  constructor(grid, numPlayers) {
    this.grid = grid;
    this.puzzles = [];
    this.puzzleIndex = 0;

    this.generatePuzzles(numPlayers);
  }

  generatePuzzles(numPlayers) {
    // simple demo logic: for every player,
    // generate a puzzle to add to the grid
    for (let i = 0; i < numPlayers; i++) {
      this.puzzles.push(new Puzzle(i));
    }
  }
}

module.exports = PuzzleManager;
