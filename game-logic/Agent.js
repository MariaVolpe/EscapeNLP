const BoardObject = require('./BoardObject');
const Inventory = require('./Inventory');

class Agent extends BoardObject {
  constructor(id, grid) {
    super({
      name: null,
      id,
      moveable: false,
      possesable: false,
      transferable: false,
      usable: false,
      passable: false,
      inspectable: false,
      destructable: false,
      puzzleType: null,
      objectType: 'Agent',
    });
    this.inventory = new Inventory();
    this.grid = grid;
  }

  getItem(item) {
    this.inventory.pickupItem(item);
  }

  giveItem(itemName, recipient) {
    const item = this.removeItem(itemName);
    recipient.getItem(item);
  }

  // given an item name drops it onto the board
  dropItem(itemName) {
    const item = this.removeItem(itemName);
    this.grid.dropOntoBoard({ centerObj: this, droppedObject: item });
  }

  giveItem(itemName, receipient) {
    const item = this.inventory.removeItem(itemName);
  }
}

module.exports = Agent;
