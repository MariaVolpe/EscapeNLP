import Inventory from 'Inventory';

class Agent extends Object {
  constructor(name) {
    // todo: generate id
    const id = 'set_later';
    super(name, id);
    this.inventory = new Inventory();
    this.passable = false; // by default agents will not be passable
  }
}

export default Agent;
