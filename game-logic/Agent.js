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
      passable: false,
      inspectable: false,
      destructable: false,
      puzzleType: null,
      objectType: 'Agent',
    });
    this.inventory = new Inventory();
  }

  // Checks if an agent has an item in their inventory
  hasItem(itemName) {
    return this.inventory.inventoryHasItem(itemName);
  }

  // Given an item object, adds the object to the agent's inventory
  takeItem(item) {
    if (!item) return false;
    this.inventory.addItem(item);
    return true;
  }

  // Given an item name and the recipient agent, gives an item to the recipient
  giveItem(itemName, recipient) {
    if (!this.inventory.inventoryHasItem(itemName)) return false;
    const item = this.inventory.removeItem(itemName);
    recipient.takeItem(item);
    return true;
  }

  // returns a list of all the items in this agent's inventory
  getAllItems() {
    return this.inventory.flattenInventory();
  }

  getSpriteName() {
    if (this.id >= 5){
      return 'player0';
    }
    else {
      return `player${this.id}`;
    }
  }
}

module.exports = Agent;
