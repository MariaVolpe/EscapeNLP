const BoardObject = require('./BoardObject');
const StructLib = require('./board-object-library/structure-library');

/*
 * Class for BoardObjects that are part of a puzzle.
 * Properties:
 * Moveable: Variable
 * Possesable: False
 * Transferable: False
 * Usable: Variable
 * Passable: Variable
 * Inspectable: True
 * Puzzle Type: What puzzle does the object belong to?
 *
 * Activated: Used for Puzzle Management. Value only matters for Structures
 * being monitored. Tells PuzzleManager whether this part of the puzzle is
 * complete.
 */

class Structure extends BoardObject {
  constructor(name, id, puzzleType ) {
    // moveable, passable, usable,
    super({name: name, id: id, moveable: StructLib[name].moveable, possesable: false,
      transferable: false, usable: StructLib[name].usable, passable: StructLib[name].passable,
      inspectbale: true, destructable: StructLib[name].destructable, puzzleType: puzzleType });
    this.activated = false;
    this.inspectTextInactive = StructLib[name].inspectTextInactive;
    this.inspectTextActive = StructLib[name].inspectTextActive;
    this.useTextUsed = StructLib[name].useTextUsed;
    this.useTextNotUsable = StructLib[name].useTextNotUsable;

    this.useFunction = null;
  }

  inspect() {
    if (this.activated) {
      return this.inspectTextActive;
    }
    else {
      return this.inspectTextInactive;
    }
  }

  activate() {
    this.activated = true;
  }

}

module.exports = Structure;
