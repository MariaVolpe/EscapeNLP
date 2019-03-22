const BoardObject = require('./BoardObject.js');

class Item extends BoardObject {
  // items are passable by default
  constructor(name, id, useMethod, passable = true) {
    super(name, id, passable);
    this.use = useMethod;
  }
}

module.exports = Item;
