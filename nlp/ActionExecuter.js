const compromise = require('compromise');

class ActionExecuter {
  constructor(grid, boardObjects) {
    this.functionMap = this.createFunctionMap();
    this.boardObjects = boardObjects;
  }

  createFunctionMap() {
    const functionMap = new Map();
    functionMap.set('move', this.doMove);
    functionMap.set('look', this.doLook);
    functionMap.set('take', this.doTake);
    functionMap.set('give', this.doGive);
    functionMap.set('destroy', this.doDestroy);
    functionMap.set('attack', this.doAttack);
    functionMap.set('place', this.doPlace);
    functionMap.set('jump', this.doJump);
    functionMap.set('speak', this.doSpeak);
    functionMap.set('activate', this.doActivate);
    functionMap.set('deactivate', this.doDeactivate);
    functionMap.set('use', this.doUse);
    return functionMap;
  }

  // User function to call appropriate function designated by actionType | Called in EscapeNLP.doAction() //
  executeAction(user, actionType, data) {
    return this.functionMap.get(actionType)(user, data);
  }

  // Executes a move action if data is valid //
  doMove(user, data) {
    // Check for all the direct objects, then indirect
    let destinations = [];
    let movingObjects = [];
    if (data.indirectObjects.length) { // if there are indirect objects, use those as the destination
      destinations = data.indirectObjects;
      movingObjects = data.directObjects;
    } else { // if there are only direct objects, use those as the destination
      destinations = data.directObjects;
    }

    // validate moving objects
    for (let i = 0; i < movingObjects.length; i++) {
      const obj = movingObjects[i];
      if (!this.objectMap.has(obj)) // include pronoun caching later
      { return false; }
    }
    // validate destinations
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      if (!this.objectMap.has(obj))// include pronoun caching later
      { return false; }
    }

    for (let i = 0; i < destinations.length; i++) {
      for (let i = 0; i < movingObjects.length; i++) {
        const path = this.grid.PathFinder.getPathByDestination(destinations[i]);
      }
    }
  }

  // Executes a look action if data is valid //
  doLook(user, data) {

  }

  // Executes a take action if data is valid //
  doTake(data) {

  }

  // Executes a give action if data is valid //
  doGive(data) {

  }

  // Executes a destroy action if data is valid //
  doDestroy(data) {

  }

  // Executes an attack action if data is valid //
  doAttack(data) {

  }

  // Executes a place action if data is valid //
  doPlace(data) {

  }

  // Executes a jump action if data is valid //
  doJump(data) {

  }

  // Executes a speak action if data is valid //
  doSpeak(data) {

  }

  // Executes a activate action if data is valid //
  doActivate(data) {

  }

  // Executes a deactivate action if data is valid //
  doDeactivate(data) {

  }

  // Executes a use action if data is valid //
  doUse(data) {

  }
}
module.exports = ActionExecuter;
