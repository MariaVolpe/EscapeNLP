const BoardObject = require('./BoardObject.js');
const ItemLib = require('./board-object-library/item-library.js');

class Item extends BoardObject {
  constructor(name) {
    super({ name: name, id: ItemLib[name].id, moveable: false, possesable: true,
      transferable: true, usable: true, passable: true, inspectable: true,
      destructable: false, puzzleType: null, objectType: "Item" });
    this.use = null; //TODO: Check ItemLib for appropiate use function, set reference
  }
}
module.exports = Item;
