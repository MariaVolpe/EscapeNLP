const compromise = require('compromise');
const Agent = require('../game-logic/Agent');
const { getDistance } = require('../game-logic/grid');
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
    const { user } = data;
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
    for (let i = 0; i < movingObjectsNames.length; i++) {
      const objName = movingObjectNames[i]; // the name of the object
      const object = this.grid.getObject({ searchOriginObj: data.user, identifier: objName });
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
      if (!this.grid.getObject({ searchOriginObj: data.user, identifier: dest })) { return false; }
    }
    for (let i = 0; i < destinations.length; i++) {
      this.grid.moveToObject(movingObjects, this.grid.resolveNameToNearestObject(destinations[i]));
    } return true;
  }

  executeLook(data) {
    if (!data.directObjects.length) { // if no specified object to look at, look around
      const nearbyObjects = this.grid.getNearbyObjects(data.user);
      return nearbyObjects.filter(e => e.name != 'floor' && e.name != 'wall').map(e => e.inspectText);
    }
    // if specified direct objects, look at that those objects
    const texts = [];
    for (let i = 0; i < data.directObjects.length; i++) {
      const name = data.directObjects[i];
      const object = this.grid.getObject({ searchOriginObj: data.user, identifier: name });
      if (!object) return false;
      // if the user is too far from the object move them to it
      if (getDistance(data.user, object) > 2) {
        this.grid.moveToObject([data.user], object);
      } texts.push(object.inspectText);
    } return texts;
  }

  executeTake(data) {
    const sources = data.indirectObjects;
    const objectNames = data.directObjects;
    // if there is a source
    for (let i = 0; i < sources.length; i++) {
      const sourceName = sources[i];
      const sourceObject = this.grid.getObject({ searchOriginObj: data.user, identifier: sourceName });
      if (!sourceObject) continue;
      if (sourceObject instanceof Agent) { // you can take items from other agents
        for (let j = 0; j < objectNames.length; j++) {
          const objName = objectNames[j];
          if (getDistance(data.user, sourceObject) > 1) {
            this.grid.moveToObject([data.user], sourceObject);
          }
          sourceObject.giveItem(objName, data.user);  
        }
      } else { // take from the grid
        for (let j = 0; j < objectNames.length; j++) {
          const objectName = objectNames[j];
          const object = this.grid.getObject({ searchOriginObj: data.user, identifier: objectName });
          if (getDistance(data.user, object) > 1) {
            this.grid.moveToObject([data.user], object);
          }
          data.user.takeItem(object);
          this.grid.removeFromBoard(object);
        }
      }
    }
    // if there is not a source
    if (!sources.length) {
      // search for it in the grid | TODO: implement stealing if its not on the grid
      for (let j = 0; j < objectNames.length; j++) {
        const objectName = objectNames[j];
        const object = this.grid.getObject({ searchOriginObj: data.user, identifier: objectName });
        if (!object) continue;
        if (getDistance(data.user, object) > 1) {
          this.grid.moveToObject([data.user], object);
        }
        data.user.takeItem(object);
        this.grid.removeFromBoard(object);
      }
    }
    return true;
  }

  executeGive(data) {
    // we can expect receipients whenever an object is given
    const recipients = data.indirectObjects;
    const objectNames = data.directObjects;
    for (let i = 0; i < recipients.length; i++) {// for all receipients
      const recipientName = recipients[i];
      const recipient = this.grid.getObject({ searchOriginObj: data.user, identifier: recipientName });
      for (let j = 0; j < objectNames.length; j++) {// for all items
        const objectName = objectNames[j];
        const hasItem = data.user.hasItem(objectName);
        if (hasItem) {
          this.grid.moveToObject([data.user], recipient);
          data.user.giveItem(objectName, recipient);
        } else {// if item was not already possessed
          const takeAttemptData = {
            user: data.user,
            directObjects: [objectName],
            indirectObjects: []
          };
          const taken = this.executeTake(takeAttemptData);
          this.grid.moveToObject([data.user], recipient); // move to the recipient
          const arr = this.grid.matrix[data.user.position.x][data.user.position.y];
          if (taken) data.user.giveItem(objectName, recipient); // give the item to the recipient
        }
      }
    } return true;
  }

  executePlace(data) {
    // if no destinations specified
    //    for all items
    //      if we have the item
    //        place all items at the nearest points
    // for all destinations
    //    for all items
    //
    
  }

  executeDestroy(data) {

  }

  executeAttack(data) {

  }

  executeJump(data) {

  }

  executeSpeak(data) {

  }

  executeActivate(data) {
    const user = this.grid.getObject({ identifier: data.user });
    data.directObjects.forEach( (directObj) => {
      const subject = this.grid.getObject({ searchOriginObj: user, identifier: directObj });
      if (subject && subject.manuallyActivateable) {
        this.grid.moveToObject([user], subject);
        if (getDistance(user, subject) < 2){ //Check Agent is next to subject
          subject.activate();
        }
      }
      else {
        return false;
      }
    })
    return true;
  }

  executeDeactivate(data) {

  }

  executeUse(data) {
    const user = this.grid.getObject({ identifier: data.user });
    data.directObjects.forEach( (directObj) => {
      const subject = this.grid.getObject({ searchOriginObj: user, identifier: directObj });
      if (subject && subject.use) {
        if (this.functionMap[subject.use]) {
          return this.functionMap[subject.use](data);
        }
        else {
          //TODO: Account for special use functions
        }
      }
      return false;
    })
    return true;
  }

}

module.exports = ActionExecuter;
