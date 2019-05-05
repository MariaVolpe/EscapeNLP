const BoardObject = require('./BoardObject');
const ItemLib = require('./board-object-library/item-library');

class Item extends BoardObject {
  constructor(name) {
    super({
      name,
      id: ItemLib[name].id,
      moveable: false,
      possesable: true,
      transferable: true,
      usable: true,
      passable: true,
      inspectable: true,
      destructable: false,
      puzzleType: null,
      objectType: 'Item',
    });
    this.use = ItemLib[name].useMethod;
  }
}

module.exports = Item;
