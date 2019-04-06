const BoardObject = require('./BoardObject.js');

class Item extends BoardObject {
  constructor(name, id, useMethod) {
    super(name, id, false, true, true, true, true, true, false, null);
    this.use = useMethod;
  }

}

module.exports = Item;
