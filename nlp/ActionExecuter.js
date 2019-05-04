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
    let movingObjectNames = [];
    const movingObjects = [];
    // if there are indirect objects, use those as the destination
    if (data.indirectObjects.length) {
      destinations = data.indirectObjects;
      movingObjectNames = data.directObjects;
      // else: there are only direct objects, use those as the destination
    } else { destinations = data.directObjects; }

    // validate moving objects
    for (let i = 0; i < movingObjects.length; i++) {
      const objName = movingObjectNames[i]; // the name of the object
      const object = this.grid.getObject(objName);
      // TODO: include pronoun caching
      if (!object || !object.isMovable()) {
        return false;
      }
      movingObjects.push(object);
    }
    // validate destinations
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      // TODO: include pronoun caching later
      if (!this.grid.getObject({ centerObj: data.user, identifier: dest })) { return false; }
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
      // if the user is too far from the object move them to it
      if (this.grid.getDistance(data.user, object) > 2) {
        this.grid.moveToObject([data.user], object);
      } texts.push(object.inspectText);
    } return texts;
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
