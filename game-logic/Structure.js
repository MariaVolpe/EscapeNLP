const BoardObject = require('./BoardObject');
const StructLib = require('./board-object-library/structure-library');
const StructText = require('./board-object-library/structure-text');

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
      usable: StructLib[name].usable,
      attackable: StructLib[name].attackable,
      transferable: false,
      passable: StructLib[name].passable,
      inspectable: true,
      destructable: StructLib[name].destructable,
      speakable: StructLib[name].speakable,
      puzzleType,
      objectType: 'Structure',
    });
    this.use = StructLib[name].use;
    this.jumpable = StructLib[name].jumpable;
    this.placeable = StructLib[name].placeable;
    this.manuallyActivateable = StructLib[name].manuallyActivateable;
    this.manuallyDeactivateable = StructLib[name].manuallyDeactivateable;
    this.speakable = StructLib[name].speakable;
    this.armored = StructLib[name].armored;
    this.locked = StructLib[name].locked;

    this.activated = false;

    // this is the least efficient code i've ever written. sorry to my future self
    this.moveFalseText = StructText[name].moveFalseText;
    this.moveTrueText = StructText[name].moveTrueText;
    this.takeFalseText = StructText[name].takeFalseText;
    this.takeTrueText = StructText[name].takeTrueText;
    this.destroyFalseText = StructText[name].destroyFalseText;
    this.destroyTrueText = StructText[name].destroyTrueText;
    this.attackFalseText = StructText[name].attackFalseText;
    this.attackTrueText = StructText[name].attackTrueText;
    this.speakFalseText = StructText[name].speakFalseText;
    this.speakTrueText = StructText[name].speakTrueText;
    this.activateTrueText = StructText[name].activateTrueText;
    this.activateFalseText = StructText[name].activateFalseText;
    this.deactivateTrueText = StructText[name].deactivateTrueText;
    this.deactivateFalseText = StructText[name].deactivateFalseText;

    this.inspectTextInactive = StructText[name].inspectTextInactive;
    this.inspectTextActive = StructText[name].inspectTextActive;
    this.inspectText = this.activated ? StructText[name].inspectTextActive : StructText[name].inspectTextInactive;
    // this.inspectTextInactive = StructText[name].inspectTextInactive;
    // this.inspectTextActive = StructText[name].inspectTextActive;
    // this.useTextUsed = StructText[name].useTextUsed;
    // this.useTextNotUsable = StructText[name].useTextNotUsable;
    // this.useFunction = null;
    // this.inspectText = this.inspectTextInactive; // initialize inspectText to this
  }

  activate() {
    this.activated = true;
    this.inspectText = this.inspectTextActive;
  }

  deactivate() {
    this.activated = false;
    this.inspectText = this.inspectTextInactive;
  }

  toggleActivation() {
    this.activated ? (this.activated = false) : (this.activated = true);
  }

  setPassable(boolean) {
    this.passable = boolean;
  }

  setMoveable(boolean) {
    this.moveable = boolean;
  }

  setUsable(boolean) {
    this.usable = boolean;
  }

  getSpriteName() {
    if (this.activated) {
      return `${this.name}_activated`;
    }
    return this.name;
  }
}

module.exports = Structure;
