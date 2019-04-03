const Puzzle = require('./Puzzle');
const BoardObject = require('./BoardObject');

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
    const boardObs = this.getBoardObjectPlacement();
    boardObs.forEach(({ obj, coordinates }) => {
      this.grid.add(obj, coordinates);
    });
  }

  getBoardObjectPlacement() {
    const boardObjArr = [];
    this.puzzles.forEach((puzzle) => {
      puzzle.items_required.forEach((obj) => {
        boardObjArr.push({ obj: new BoardObject(obj.name, obj.id), coordinates: obj.coordinates });
      })
    });
    return boardObjArr;
  }

  populateProgressMap(){

  }

  // todo: set puzzles on this.puzzles, dynamically
  findPuzzles() {
    this.puzzles.push(Weight);
    this.puzzles.push(Switch);
    this.puzzles.push(Door);
  }
}

module.exports = PuzzleManager;
