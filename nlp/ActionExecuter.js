const compromise = require('compromise');

/*
  Action Executer methods take in metadata and return result objects with success/failure flags
 */

class ActionExecuter {
  constructor({ grid }) {
    this.functionMap = this.createFunctionMap();
    this.grid = grid;
  }

  createFunctionMap() {
    const functionMap = {
      move: this.executeMove,
      look: this.executeLook,
      take: this.executeTake,
      give: this.executeGive,
      destroy: this.executeDestroy,
      attack: this.executeAttack,
      place: this.executePlace,
      jump: this.executeJump,
      speak: this.executeSpeak,
      activate: this.executeActivate,
      deactivate: this.executeDeactivate,
      use: this.executeUse,
    };
    return functionMap;
  }

  // User function to call appropriate function designated by actionType | Called in EscapeNLP.doAction()
  executeAction(actionType, data) {
    return this.functionMap[actionType](data);
  }

  executeMove(data) {
    // Check for all the direct objects, then indirect
    const { user } = data.user;
    let destinations = [];
    let movingObjects = [];
    // if there are indirect objects, use those as the destination
    if (data.indirectObjects.length) {
      destinations = data.indirectObjects;
      movingObjects = data.directObjects;
      // else: there are only direct objects, use those as the destination
    } else { destinations = data.directObjects; }

    // validate moving objects
    for (let i = 0; i < movingObjects.length; i++) {
      const objName = movingObjects[i]; // the name of the object
      const object = this.grid.getObject(objName);
      // TODO: include pronoun caching
      if (!object || !object.isMovable()) {
        return false;
      }
    }
    // validate destinations
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      // TODO: include pronoun caching later
      if (!this.grid.getObject({ identifier: dest })) { return false; }
    }
    for (let i = 0; i < destinations.length; i++) {
      this.grid.moveToObject(movingObjects, this.grid.resolveNameToNearestObject(destinations[i]));
    } return true;
  }

  executeLook(data) {
    if (!data.directObjects.length) { // if no specified object to look at, look around
      const nearbyObjects = this.grid.getNearbyObjects(data.user);
      return nearbyObjects.map(e => e.inspectText);
    }
    // if specified direct objects, look at that those objects
    const texts = [];
    for (let i = 0; i < data.directObjects.length; i++) {
      const name = data.directObjects[i];
      const object = this.grid.getObject({ identifier: name });
      if (!object) return false;
      if (this.grid.getDistance(data.user, object) > 2) { // if the user is too far from
        this.grid.moveToObject([data.user], object); // the object, move them to it
      } texts.push(object.inspectText);
    }
  }

  executeTake(data) {

  }

  executeGive(data) {

  }

  executeDestroy(data) {

  }

  executeAttack(data) {

  }

  executePlace(data) {

  }

  executeJump(data) {

  }

  executeSpeak(data) {

  }

  executeActivate(data) {

  }

  executeDeactivate(data) {

  }

  executeUse(data) {

  }
}

module.exports = ActionExecuter;
