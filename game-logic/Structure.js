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
  constructor(name, id, puzzleType) {
    // moveable, passable, usable
    super({
      name,
      id,
      moveable: StructLib[name].moveable,
      possesable: false,
      attackable: StructLib[name].attackable,
      transferable: false,
      passable: StructLib[name].passable,
      speakable: StructLib[name].speakable,
      manuallyActivateable: StructLib[name].manuallyActivateable,
      manuallyDeactivateable: StructLib[name].manuallyDeactivateable,
      inspectable: true,
      jumpable: StructLib[name].jumpable,
      placeable: false,
      destructable: StructLib[name].destructable,
      puzzleType,
      objectType: 'Structure',
    });

    this.activated = false;

    // this is the least efficient code i've ever written. sorry to my future self
    this.moveFalseText = StructLib[name].moveFalseText;
    this.moveTrueText = StructLib[name].moveTrueText;
    this.takeFalseText = StructLib[name].takeFalseText;
    this.takeTrueText = StructLib[name].takeTrueText;
    this.destroyFalseText = StructLib[name].destroyFalseText;
    this.destroyTrueText = StructLib[name].destroyTrueText;
    this.attackFalseText = StructLib[name].attackFalseText;
    this.attackTrueText = StructLib[name].attackTrueText;
    this.speakFalseText = StructLib[name].speakFalseText;
    this.speakTrueText = StructLib[name].speakTrueText;
    this.activateTrueText = StructLib[name].activateTrueText;
    this.activateFalseText = StructLib[name].activateFalseText;
    this.deactivateTrueText = StructLib[name].deactivateTrueText;
    this.deactivateFalseText = StructLib[name].deactivateFalseText;

    this.inspectTextInactive = StructLib[name].inspectTextInactive;
    this.inspectTextActive = StructLib[name].inspectTextActive;

    // this.inspectTextInactive = StructLib[name].inspectTextInactive;
    // this.inspectTextActive = StructLib[name].inspectTextActive;
    // this.useTextUsed = StructLib[name].useTextUsed;
    // this.useTextNotUsable = StructLib[name].useTextNotUsable;
    // this.useFunction = null;
    // this.inspectText = this.inspectTextInactive; // initialize inspectText to this
  }

  inspect() {
    if (this.activated) {
      this.inspectText = this.inspectTextActive;
    }
    return this.inspectText;
  }

  activate() {
    this.activated = true;
  }

  getSpriteName() {
    if (this.activated) {
      return `${this.name}_activated`;
    }
    return this.name;
  }
}

module.exports = Structure;
