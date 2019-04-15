const BoardObject = require('./BoardObject');
const StruLib = require('./board-object-library/structure-library');

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
    super(name, id, StruLib[name].moveable, false,
      false, StruLib[name].usable, StruLib[name].passable, true,
      StruLib[name].destructable, puzzleType );
    this.activated = false;
    this.inspectTextInactive = StruLib[name].inspectTextInactive;
    this.inspectTextActive = StruLib[name].inspectTextActive;
    this.useTextUsed = StruLib[name].useTextUsed;
    this.useTextNotUsable = StruLib[name].useTextNotUsable;

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
