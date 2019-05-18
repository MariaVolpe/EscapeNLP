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

  evaluateAllPuzzles(userName) {
    const userObj = this.grid.getObject({ identifier: userName });
    this.puzzles.forEach(({ puzzle_type }) => {
      this.rewardSolvedPuzzle(puzzle_type, userObj);
    });
  }

  rewardSolvedPuzzle(puzzleType, userObj) {
    // Check to see that the puzzle has been completed and that the reward hasn't been given.
    if (!this.checkRewardGranted(puzzleType) && this.checkPuzzleCompleted(puzzleType)) {
      switch (puzzleType) {
        case 'door':
          const doorObj = this.puzzleProgress.get('door')[0];
          doorObj.setPassable(true);
          break;
        case 'weight':
          userObj.takeItem(new Item('blade'));
          const forgeObj = this.puzzleProgress.get('forge')[0];
          forgeObj.activate();
          forgeObj.setUsable(true);
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

  // This ensures puzzle logic isn't repeated once the puzzle is complete
  checkRewardGranted(puzzleType) {
    return this.puzzleRewardGranted.get(puzzleType);
  }

  // Should just check that the right light switches have been activated
  checkPuzzleCompleted(puzzleType) {
    switch (puzzleType) {
      case 'weight':
        return this.checkWeightPuzzle();
        break;
      case 'lever':
        return this.checkLeverPuzzle('101');
        break;
      case 'forge':
        // TODO
        return false;
      default:
        return this.checkAllManagedObjectsActivated(puzzleType);
    }
  }

  checkAllManagedObjectsActivated(puzzleType) {
    const managedObjs = this.puzzleProgress.get(puzzleType);
    let puzzleCompleted = true;
    if (managedObjs) {
      managedObjs.forEach((obj) => {
        if (!obj.activated) {
          puzzleCompleted = false;
        }
      });
    }
    return puzzleCompleted;
  }

  checkLeverPuzzle(combination) {
    const levers = this.puzzleProgress.get('lever');
    let matchingCombination = true;
    for (let i = 0; i < levers.length; ++i) {
      if (levers[i].activated && (combination[i] === '0')) {
        matchingCombination = false;
      }
      if (!levers[i].activated && (combination[i] === '1')) {
        matchingCombination = false;
      }
    }
    return matchingCombination;
  }

  checkWeightPuzzle() {
    const impressions = this.puzzleProgress.get('weight');
    let puzzleCompleted = true;
    impressions.forEach((impression) => {
      if (!this.grid.checkStackForObjectName(impression.position, 'weight')) {
        puzzleCompleted = false;
      } else {
        impression.activate();
        const finishedWeight = this.grid.getObjectFromStackByName(impression.position, 'weight');
        finishedWeight.setMoveable(false);
        impression.setPassable(false);
      }
    });
    return puzzleCompleted;
  }

  checkGameComplete() {
    return this.gameComplete;
  }
}

module.exports = PuzzleManager;
