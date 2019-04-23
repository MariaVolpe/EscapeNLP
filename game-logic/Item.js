const BoardObject = require('./BoardObject.js');

class Item extends BoardObject {
  constructor(name, id, useMethod) {
    super({
      name,
      id,
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
    this.use = useMethod;
  }
}
module.exports = Item;
