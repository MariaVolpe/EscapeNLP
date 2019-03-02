
import Inventory from 'Inventory'; // TODO

class Agent extends Object {
  constructor(startingX, startingY, maxSteps, grid) {
    super(startingX, startingY, maxSteps, grid);
    this.inventory = new Inventory();
    this.passable = false; // by default agents will not be passable
    //grid.add(this, startingX, startingY); <- does this work in javascript?
    // WE'll FIND OUT HAHAHHAHAHAAHAA
  }

  getItem(item) {
    this.inventory.pickupItem(item);
  }
}

export default Agent;
