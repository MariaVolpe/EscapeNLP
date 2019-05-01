/* A Class that acts a skeleton for objects that can appear
 * on the game board. Note that all objects that can appear
 * on the board should inherit from this class. The specific
 * properties of the object will be determined by the
 * subclass it belongs to.
 *
 * Property definitions:
 * Name: A name/type for the object
 * Id: A unique identifier for the object
 * Moveable: Can the object be moved by an agent?
 * Possesable: Can the object be picked up or dropped?
 * Transferable: Can the object be given to another agent?
 * Usable: Can the object be used?
 * Passable: Can agents pass through the object while moving?
 * Inspectable: Can agents get a description of the item?
 * Desctructable: Can the object be destroyed?
 * Puzzle Type: What puzzle does the object belong to?
 *
 * This class defines properties.
 * Use Methods and other functions should be defined in the
 * sub-class of the object, or used as a paramter when
 * constructing an object of the sub-class.
 */

class BoardObject {
  constructor({
    name, id, moveable, possesable, transferable,
    usable, passable, inspectable, destructable, puzzleType, objectType,
  }) {
    this.name = name;
    this.id = id;
    this.moveable = moveable;
    this.possesable = possesable;
    this.transferable = transferable;
    this.usable = usable;
    this.passable = passable;
    this.inspectable = inspectable;
    this.destructable = destructable;
    this.puzzleType = puzzleType;
    this.objectType = objectType;
    this.position = {
      x: null,
      y: null,
    }
  }

  isPassable() {
    return this.passable;
  }
}

module.exports = BoardObject;
