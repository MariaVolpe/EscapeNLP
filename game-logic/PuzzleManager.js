const Structure = require('./Structure');
const Item = require('./Item');
// todo: ...dont do it this way, since its not arbitrary puzzles but a random get
const Weight = require('./puzzles/weight');
const Lever = require('./puzzles/lever');
const Door = require('./puzzles/door');
const Forge = require('./puzzles/forge');
const Goal = require('./puzzles/goal');
const Dragon = require('./puzzles/dragon');
const Pots = require('./puzzles/pots');

class PuzzleManager {
  constructor(grid, testingMode = false) {
    this.puzzles = [];
    this.grid = grid;
    this.puzzleProgress = new Map();
    this.puzzleRewardGranted = new Map();
    this.gameComplete = false;
    if (!testingMode) {
      this.findPuzzles();
    }
  }

  findPuzzles() {
    this.puzzles.push(Door);
    this.puzzles.push(Weight);
    this.puzzles.push(Forge);
    this.puzzles.push(Pots);
    this.puzzles.push(Lever);
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

  evaluateAllPuzzles(userObj) {
    this.puzzles.forEach(({ puzzle_type }) => {
      this.rewardSolvedPuzzle(puzzle_type, userObj);
    });
  }

  rewardSolvedPuzzle(puzzleType, userObj) {
    // Check to see that the puzzle has been completed and that the reward hasn't been given.
    if (this.checkPuzzleCompleted(puzzleType) && !this.checkRewardGranted(puzzleType)) {
      switch (puzzleType) {
        case 'door':
          const doorObj = this.puzzleProgress.get('door')[0];
          doorObj.setPassable(true);
          break;
        case 'weight':
          userObj.takeItem(new Item('blade'));
          break;
        case 'lever':
          userObj.takeItem(new Item('hilt'));
          break;
        case 'pots':
          userObj.takeItem(new Item('key'));
          // and return { id: name: spirte, coordinate }
          break;
        case 'goal':
          this.gameComplete = true;
          break;
      }
      this.puzzleRewardGranted.set(puzzleType, true);
    }
  }

  //Should just check that the right light switches have been activated
  checkPuzzleCompleted(puzzleType) {
    const managedObjs = this.puzzleProgress.get(puzzleType);
    let puzzleCompleted = true;
    if (managedObjs) {
      managedObjs.forEach((obj) => {
        if (!obj.activated) {
          puzzleCompleted = false;
          break;
        }
      });
    }
    return puzzleCompleted;
  }

  // This ensures puzzle logic isn't repeated once the puzzle is complete
  checkRewardGranted(puzzleType) {
    return this.puzzleRewardGranted.get(puzzleType);
  }

  checkGameComplete() {
    return this.gameComplete;
  }
}

module.exports = PuzzleManager;
