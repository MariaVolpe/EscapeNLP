class Inventory {
  constructor() {
    // inventory is managed by a Map and not a plain object for performance
    // concerns related to frequent adding and deleting, and keeping items ordered
    this.items = new Map();
  }

  useItem(itemName) {
    if (!this.items.has(itemName)) {
      // todo: catch
      return;
    }
    //const item = this.removeItem();
    //if (item) item.use();
  }

  // why? because i had to change the implementation from {} to map so
  // this made it easier. maybe delete later and save a few lines of code
  removeItem(itemName) {
    if (!this.items.has(itemName)) return null;
    return this.items.get(itemName).pop();
  }

  addItem(item) {
    if (!this.items.has(item.name)) this.items.set(item.name, []);
    this.items.get(item.name).push(item);
  }

  // returns a list of all items in inventory
  flattenInventory() {
    const inventory = [];
    for (let [itemName, list] of this.items) {
      inventory.push(...list);
    } return inventory;
  }
}

module.exports = Inventory;
