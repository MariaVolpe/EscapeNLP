const BoardObject = require('./BoardObject');
const Inventory = require('./Inventory');

class Agent extends BoardObject {
  constructor(id) {
    super({
      name: null,
      id,
      moveable: false,
      possesable: false,
      transferable: false,
      usable: false,
      passable: true,
      inspectable: false,
      destructable: false,
      puzzleType: null,
      objectType: 'Agent',
    });
    this.inventory = new Inventory();
  }

  getItem(item) {
    this.inventory.pickupItem(item);
  }
}

module.exports = Agent;
