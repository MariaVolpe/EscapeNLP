const Structure = require('./Structure');

// todo: ...dont do it this way, since its not arbitrary puzzles but a random get
const Weight = require('./puzzles/weight');
const Switch = require('./puzzles/switch');
const Door = require('./puzzles/door');

class PuzzleManager {
  constructor(grid) {
    this.puzzles = [];
    this.grid = grid;
    this.puzzleProgress = new Map();

    this.findPuzzles();
  }

  // todo: set puzzles on this.puzzles, dynamically
  findPuzzles() {
    this.puzzles.push(Weight);
    this.puzzles.push(Switch);
    this.puzzles.push(Door);
  }

  addPuzzlesToBoard() {
    const structures = this.getStructureDetails();
    structures.forEach(({ obj, coordinates, manage }) => {
      this.grid.add(obj, coordinates);
      if (manage) {
        this.addToProgressMap(obj.puzzleType, obj);
      }
    });
  }

  getStructureDetails() {
    const structureArr = [];
    this.puzzles.forEach((puzzle) => {
      puzzle.items_required.forEach((obj) => {
        structureArr.push({
          obj: new Structure(obj.name, obj.id, puzzle.puzzle_type),
          coordinates: obj.coordinates,
          isManaged: obj.isManaged,
        });
      });
    });
    return structureArr;
  }

  addToProgressMap(puzzleType, obj) {
    if (this.puzzleProgress.has(puzzleType)) {
      this.puzzleProgress.get(puzzleType).push(obj);
    } else {
      this.puzzleProgress.set(puzzleType, [obj]);
    }
  }

  evaluatePuzzleStatus(puzzleType) {
    switch (puzzleType) {
      case 'weight':
        break;
      case 'switch':
        break;
      case 'goal':
        break;
      default:
    }
  }
}

module.exports = PuzzleManager;
