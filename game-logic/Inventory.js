class Inventory {
  constructor() {
    // inventory is managed by a Map and not a plain object for performance
    // concerns related to frequent adding and deleting, and keeping items ordered
    this.items = new Map();
  }

  getFormattedInventory() {
    const inventoryArr = [];
    this.items.forEach((value, key) => {
      value.forEach(() => {
        inventoryArr.push(key);
      });
    });
    return inventoryArr;
  }

  useItem(itemName) {
    if (!this.items.has(itemName)) {
      // todo: catch

    }
    // const item = this.removeItem();
    // if (item) item.use();
  }

  removeItem(itemName) {
    if (!this.items.has(itemName)) return null;
    const item = this.items.get(itemName).pop();
    if (!this.items.get(itemName).length) this.items.delete(itemName);
    return item;
  }

  addItem(item) {
    if (!this.items.has(item.name)) this.items.set(item.name, []);
    this.items.get(item.name).push(item);
  }

  inventoryHasItem(itemName) {
    return this.items.has(itemName);
  }
  
  // returns the reference to an item without removing it from inventory
  getItem(itemName) {
    if (!this.items.has(itemName)) return null;
    const list = this.items.get(itemName);
    return list[0];
  }

  // returns the reference to an item without removing it from inventory
  getItem(itemName) {
    if (!this.items.has(itemName)) return null;
    const list = this.items.get(itemName);
    return list[0];
  }

  // returns the reference to an item without removing it from inventory
  getItem(itemName) {
    if (!this.items.has(itemName)) return null;
    const list = this.items.get(itemName);
    return list[0];
  }

  // returns a list of all items in inventory
  flattenInventory() {
    const inventory = [];
    for (const [itemName, list] of this.items) inventory.push(...list);
    return inventory;
  }
}

module.exports = Inventory;
