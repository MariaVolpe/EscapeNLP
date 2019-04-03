const Puzzle = require('./Puzzle');
const Item = require('./Item');

// todo: ...dont do it this way, since its not arbitrary puzzles but a random get
const Weight = require('./puzzles/weight');
const Switch = require('./puzzles/switch');
const Door = require('./puzzles/door');

class PuzzleManager {
  constructor(grid) {
    this.puzzles = [];
    this.puzzleIndex = 0;
    this.grid = grid;
    this.puzzleProgress = new Map();

    this.findPuzzles();
  }

  addPuzzlesToBoard() { //Should this also set the activation management?
    const items = this.getItemPlacement();
    items.forEach(({ item, coordinates }) => {
      this.grid.add(item, coordinates);
    });
  }

  getItemPlacement() {
    const itemsArr = [];
    this.puzzles.forEach((puzzle) => {
      puzzle.items_required.forEach((item) => {
        itemsArr.push({ item: new Item(item.name, item.id), coordinates: item.coordinates });
      })
    });
    return itemsArr;
  }

  // todo: set puzzles on this.puzzles, dynamically
  findPuzzles() {
    this.puzzles.push(Weight);
    this.puzzles.push(Switch);
    this.puzzles.push(Door);
  }
}

module.exports = PuzzleManager;
