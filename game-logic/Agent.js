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
      passable: true,
      inspectable: false,
      destructable: false,
      puzzleType: null,
      objectType: 'Agent',
    });
    this.inventory = new Inventory();
    this.grid = grid;
  }

  getItem(item) {
    if (!item) return;
    this.inventory.addItem(item);
  }

  giveItem(itemName, recipient) {
    const item = this.removeItem(itemName);
    if (item) recipient.getItem(item);
  }

  // given an item name drops it onto the board
  dropItem(itemName) {
    const item = this.removeItem(itemName);
    this.grid.dropOntoBoard({ centerObj: this, droppedObject: item });
  }

  // returns a list of all the items in this agent's inventory
  getAllItems() {
    return this.inventory.flattenInventory();
  }
}

module.exports = Agent;
