const Inventory = require('./Inventory');

class Agent extends Object {
  constructor(id) {
    super(null, id);
    this.inventory = new Inventory();
    this.passable = false;
  }

  getItem(item) {
    this.inventory.pickupItem(item);
  }
}

module.exports = Agent;
