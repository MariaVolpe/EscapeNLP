const compromise = require('compromise');

class ActionExecuter {
  constructor(grid, boardObjects) {
    this.functionMap = this.createFunctionMap();
    this.boardObjects = boardObjects;
  }

  createFunctionMap() {
    const functionMap = {};
    functionMap['move'] = this.doMove;
    functionMap['look'] = this.doLook;
    functionMap['take'] = this.doTake;
    functionMap['give'] = this.doGive;
    functionMap['destroy'] = this.doDestroy;
    functionMap['attack'] = this.doAttack;
    functionMap['place'] = this.doPlace;
    functionMap['jump'] = this.doJump;
    functionMap['speak'] = this.doSpeak;
    functionMap['activate'] = this.doActivate;
    functionMap['deactivate'] = this.doDeactivate;
    functionMap['use'] = this.doUse;
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
