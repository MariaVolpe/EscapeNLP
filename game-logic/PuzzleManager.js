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

  // todo: set puzzles on this.puzzles, dynamically
  findPuzzles() {
    this.puzzles.push(Weight);
    this.puzzles.push(Switch);
    this.puzzles.push(Door);
  }

  addPuzzlesToBoard() {
    const boardObs = this.getBoardObjectDetails();
    boardObs.forEach(({ obj, coordinates, manage, puzzleType }) => {
      this.grid.add(obj, coordinates);
      if(manage){
        this.addToProgressMap(puzzleType, obj);
      }
    });
  }

  getBoardObjectDetails() {
    const boardObjArr = [];
    this.puzzles.forEach((puzzle) => {
      puzzle.items_required.forEach((obj) => {
        boardObjArr.push({ 
          obj: new BoardObject(obj.name, obj.id), 
          coordinates: obj.coordinates, 
          manage: obj.manage, 
          puzzleType: puzzle.puzzle_type 
        });
      })
    });
    return boardObjArr;
  }

  addToProgressMap(puzzleType, obj) {
    if(this.puzzleProgress.has(puzzleType)) {
      this.puzzleProgress.get(puzzleType).push(obj);
    }
    else{
      this.puzzleProgress.set(puzzleType, [obj]);
    }
  }

  evaluatePuzzleStatus(puzzleType) {
    switch(puzzleType) {
      case "weight":
        break;
      case "switch":
        break;
      case "goal":
        break;
      default:
    }
  }

}

module.exports = PuzzleManager;
