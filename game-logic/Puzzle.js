class Puzzle {
  constructor(num) {
    // demo logic: for every number passed in, set a different puzzle
    this.puzzle = this.generatePuzzle(num);
  }

  setPuzzle(num) {
    switch (num) {
      case 1:
        // switch puzzle
        break;
      case 2:
        // weight puzzle
        break;
      case 3:
        // maze
        break;
      case 4:
        // activation
        break;
      case 5:
        // monster
        break;
      default:
    }
  }
}

module.exports = Puzzle;
