const BoardObject = require('./BoardObject');
const StructureLib = require('./board-object-library/structure-library');

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
	constructor(name, id, moveable, passable, usable, puzzleType) {
    super(name, id, moveable, false, false, usable, passable, true, puzzleType );
    this.activated = false;
    this.inspectTextInactive = 'Inactive Text Missing';
    this.inspectTextActive = 'Active Text Missing';
    this.useTextUsed = 'Used text missing';
    this.useTextNotUsable = 'Not useable text missing';
    this.useFunction = null;
	}

	static buildFromJSON(structureName, id) {

	}

  inspect() {
    if (this.activated) {
      return this.inspectTextActive;
    }
    else {
      return this.inspectTextInactive;
    }
  }

}

module.exports = Structure;
