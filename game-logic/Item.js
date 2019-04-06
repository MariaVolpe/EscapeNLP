const BoardObject = require('./BoardObject.js');

class Item extends BoardObject {
  constructor(name, id, useMethod) {
    super(name, id, false, true, true, true, true, true, null);
    this.use = useMethod;
  }

  static buildFromJSON(fileName, itemName, id) {
    
  }

}

module.exports = Item;
