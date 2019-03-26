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
    const isSuccessful = this.items.get(itemName).use();
    if (isSuccessful) {
      this.deleteItem(itemName);
    } else {
      // todo: cant use
    }
  }

  dropItem(itemName) {
    // may or may not need these guard clauses depending on UI
    // also might be able to DRY this up if it needs to stay
    if (!this.items.has(itemName)) {
      // todo: catch
      return;
    }
    // todo: return to grid ?
    this.deleteItem(itemName);
  }

  // why? because i had to change the implementation from {} to map so
  // this made it easier. maybe delete later and save a few lines of code
  deleteItem(itemName) {
    this.items.delete(itemName);
  }

  pickupItem(item) {
    this.items.set(item.name, item);
  }

  giveItem(itemName, recipient) {
    if (!this.items.has(itemName)) {
      // todo: catch
      return;
    }
    recipient.getItem(this.items.get(itemName));
    this.deleteItem(itemName);
  }
}

module.exports = Inventory;
