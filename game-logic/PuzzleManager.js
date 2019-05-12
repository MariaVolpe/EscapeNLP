const Structure = require('./Structure');
const Item = require('./Item');
// todo: ...dont do it this way, since its not arbitrary puzzles but a random get
const Weight = require('./puzzles/weight');
const Switch = require('./puzzles/switch');
const Door = require('./puzzles/door');
const Forge = require('./puzzles/forge');
const Goal = require('./puzzles/goal');
const Dragon = require('./puzzles/dragon');
const Pots = require('./puzzles/pots');

class PuzzleManager {
  constructor(grid) {
    this.puzzles = [];
    this.grid = grid;
    this.puzzleProgress = new Map();
    this.puzzleRewardGranted = new Map();
    this.gameComplete = false;
    this.findPuzzles();
  }

  findPuzzles() {
    this.puzzles.push(Door);
    this.puzzles.push(Weight);
    this.puzzles.push(Forge);
    this.puzzles.push(Pots);
    this.puzzles.push(Switch);
    this.puzzles.push(Dragon);
    this.puzzles.push(Goal);
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
      this.puzzleRewardGranted.set(puzzleType, false);
    }
  }

  evaluateAllPuzzles() {
    this.puzzles.forEach( ({puzzle_type}) => {
      this.evaluatePuzzleStatus(puzzle_type);
    })
  }

  evaluatePuzzleStatus(puzzleType) {
    // Leave if the Puzzle hasn't been completed, or if its reward has been granted already
    if (!this.checkPuzzleComplete(puzzleType) || this.checkRewardGranted(puzzleType)) {
      return;
    }
    switch (puzzleType) {
      case 'door':
        const doorObj = this.puzzleProgress.get('door')[0];
        doorObj.setPassable(true);
      case 'weight':
        this.grid.add(new Item('sword_blade'));
        break;
      case 'binary':
        this.grid.add(new Item('sword_hilt'));
        break;
      case 'pots':
        this.grid.add(new Item('key'));
        break;
      case 'goal':
        this.gameComplete = true;
        break;
    }
    this.puzzleRewardGranted.set(puzzleType, true);
  }

  checkPuzzleComplete(puzzleType) {
    if (!puzzleType) {
      return false;
    }
    const managedObjs = this.puzzleProgress.get(puzzleType);
      if(managedObjs) { 
        managedObjs.forEach((obj) => {
        if (!obj.activated) {
          return false;
        }
      });
      return true;
    }
  }

  // This ensures puzzle logic isn't repeated once the puzzle is complete
  checkRewardGranted(puzzleType) {
    if (!puzzleType) {
      return false;
    }
    return this.puzzleRewardGranted.get(puzzleType);
  }

  checkGameComplete() {
    return this.gameComplete;
  }
}

module.exports = PuzzleManager;
