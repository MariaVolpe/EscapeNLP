const BoardObject = require('./BoardObject');
const Inventory = require('./Inventory');

class Agent extends BoardObject {
  constructor(id) {
    super(null, id, false);
    this.inventory = new Inventory();
  }

  getItem(item) {
    this.inventory.pickupItem(item);
  }
}

module.exports = Agent;
