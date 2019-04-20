const compromise = require('compromise');

class ActionExecuter {
  constructor(grid, boardObjects) {
    this.functionMap = this.createFunctionMap();
    this.boardObjects = boardObjects;
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

  // User function to call appropriate function designated by actionType | Called in EscapeNLP.doAction() //
  executeAction(user, actionType, data) {
    return this.functionMap[actionType](user, data);
  }
  
  executeMove(user, data) {
    // Check for all the direct objects, then indirect
    let destinations = [];
    let movingObjects = [];
    if (data.indirectObjects.length) { // if there are indirect objects, use those as the destination
      destinations = data.indirectObjects;
      movingObjects = data.directObjects;
    } else // if there are only direct objects, use those as the destination
    { destinations = data.directObjects; }


    // validate moving objects
    for (let i = 0; i < movingObjects.length; i++) {
      const obj = movingObjects[i];
      if (!this.boardObjects.has(obj) || !this.boardObjects.get(obj).isMovable()) // include pronoun caching later
      { return false; }
    }
    // validate destinations
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      if (!this.boardObjects.has(obj))// include pronoun caching later
      { return false; }
    }

    for (let i = 0; i < destinations.length; i++) for (let j = 0; j < movingObjects.length; j++) this.grid.moveByDestination(movingObjects[j], destinations[i]);
    return true;
  }

  executeLook(user, data) {

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
