const Structure = require('./Structure');
const Item = require('./Item');
// todo: ...dont do it this way, since its not arbitrary puzzles but a random get
const Weight = require('./puzzles/weight');
const Switch = require('./puzzles/switch');
const Door = require('./puzzles/door');

class PuzzleManager {
  constructor(grid) {
    this.puzzles = [];
    this.grid = grid;
    this.puzzleProgress = new Map();
    this.gameComplete = false;

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
    structures.forEach(({ obj, coordinates, isManaged }) => {
      this.grid.add(obj, coordinates);
      if (isManaged) {
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
    if (!this.checkPuzzleComplete(puzzleType)) {
      return;
    }
    switch (puzzleType) {
      case 'weight':
        this.grid.add(new Item("sword_blade"));
        break;
      case 'binary':
        this.grid.add(new Item("sword_hilt"));
        break;
      case 'pots':
        this.grid.add(new Item("key"));
        break;
      case: 'goal':
        this.gameComplete = true;
        break;
    }
  }

  checkPuzzleComplete(puzzleType) {
    this.puzzleProgress.get(puzzleType).forEach((obj) => {
      if (!obj.activated) {
        return false;
      }
    });
    return true;
  }

  checkGameComplete() {
    return this.gameComplete;
  }
}

module.exports = PuzzleManager;
