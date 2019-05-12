const compromise = require('compromise');
const Agent = require('../game-logic/Agent');
const Structure = require('../game-logic/Structure');
const { getDistance } = require('../game-logic/Grid');
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
    return this.functionMap[actionType].bind(this)(data);
  }

  executeMove(data) {
    // Check for all the direct objects, then indirect
    const { userName } = data;
    const user = this.grid.getObject({ identifier: userName });
    let destinations = [];
    let movingObjectNames = [];
    const movingObjects = [];
    const destinationObjects = [];
    const results = [];
    if (data.indirectObjects.length) { // if there are indirect objects, use those as the destination
      destinations = data.indirectObjects;
      movingObjectNames = data.directObjects;
      movingObjectNames.push(user.name);
    } else { // else: there are only direct objects, use those as the destination
      movingObjects.push(user);
      destinations = data.directObjects;
    }
    // validate moving objects
    for (let i = 0; i < movingObjectNames.length; i++) {
      const objName = movingObjectNames[i]; // the name of the object
      const object = this.grid.getObject({ searchOriginObj: user, identifier: objName });
      if (!object) continue;
      movingObjects.push(object);
    }
    // validate destinations
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      const destinationObject = this.grid.getObject({ searchOriginObj: user, identifier: dest }); 
      if (!destinationObject) continue;
      destinationObjects.push(destinationObject);
    }
    for (let i = 0; i < destinationObjects.length; i++) {
      const destinationObject = destinationObjects[i];//this.grid.getObject({ searchOriginObj: user, identifier: destinations[i] })
      const paths = this.grid.moveToObject(movingObjects, destinationObject);
      for (let i = 0; i < movingObjects.length; i++) {
        const movingObject = movingObjects[i];
        results.push({
          objectName: movingObject.name,
          destination: destinationObject.name,
          path: paths[i],
        });
      } 
    }
    return { userName: user.name, action: 'move', result: results }
  }

  executeLook(data) {
    const texts = [];
    const { userName } = data;
    const user = this.grid.getObject({ identifier: userName });
    if (!data.directObjects.length) { // if no specified object to look at, look around
      const nearbyObjects = this.grid.getNearbyObjects(user);
      return {
        userName: user.name,
        action: 'look',
        result: nearbyObjects.filter(e => e.name != 'floor'
          && e.name != 'wall'
          && e.inspectText != '').map(e => ({
            objectName: e.name,
            text: e.inspect()
        }))
      };
    }
    // if specified direct objects, look at that those objects
    for (let i = 0; i < data.directObjects.length; i++) {
      const name = data.directObjects[i];
      const object = this.grid.getObject({ searchOriginObj: user, identifier: name });
      if (!object) return false;
      // if the user is too far from the object move them to it
      // if still too far, then we cant look at this object
      if (!this.attemptMoveCloser(user, object, 2)) continue;
      texts.push({
        objectName: name,
        text: object.inspect(),
      });
    } return { userName: user.name, action: 'look', result: texts };
  }

  executeTake(data) {
    const sources = data.indirectObjects;
    const objectNames = data.directObjects;
    const { userName } = data;
    const user = this.grid.getObject({ identifier: userName });
    const taken = [];
    // if there is a source
    for (let i = 0; i < sources.length; i++) {
      const sourceName = sources[i];
      const sourceObject = this.grid.getObject({ searchOriginObj: user, identifier: sourceName });
      if (!sourceObject) continue;
      if (sourceObject instanceof Agent) { // you can take items from other agents
        for (let j = 0; j < objectNames.length; j++) {
          const objectName = objectNames[j];
          if (!this.attemptMoveCloser(user, sourceObject, 1)) continue;
          sourceObject.giveItem(objectName, user);
          taken.push({ objectName: objectName, source: sourceName });
        }
      } else { // take from the grid
        for (let j = 0; j < objectNames.length; j++) {
          const objectName = objectNames[j];
          const object = this.grid.getObject({ searchOriginObj: user, identifier: objectName });
          if (!this.attemptMoveCloser(user, object, 1)) continue;
          user.takeItem(object);
          this.grid.removeFromBoard(object);
          taken.push({ objectName: objectName, source: sourceName });
        }
      }
    }
    // if there is not a source
    if (!sources.length) {
      // search for it in the grid | TODO: implement stealing if its not on the grid
      for (let j = 0; j < objectNames.length; j++) {
        const objectName = objectNames[j];
        const object = this.grid.getObject({ searchOriginObj: user, identifier: objectName });
        if (!object) continue;
        if (!this.attemptMoveCloser(user, object, 1)) continue;
        user.takeItem(object);
        this.grid.removeFromBoard(object);
        taken.push({ objectName: objectName, source: '' });
      }
    }
    return { userName: user.name, action: 'take', result: taken };
  }

  executeGive(data) {
    const { userName } = data;
    const user = this.grid.getObject({ identifier: userName });
    // we can expect receipients whenever an object is given
    const recipients = data.indirectObjects;
    const objectNames = data.directObjects;
    const results = [];
    for (let i = 0; i < recipients.length; i++) {// for all receipients
      const recipientName = recipients[i];
      const recipient = this.grid.getObject({ searchOriginObj: user, identifier: recipientName });
      for (let j = 0; j < objectNames.length; j++) {// for all items
        const objectName = objectNames[j];
        const hasItem = user.hasItem(objectName);
        if (hasItem) {
          if (!this.attemptMoveCloser(user, recipient, 1)) continue;
          user.giveItem(objectName, recipient);
        } else {// if item was not already possessed
          const takeAttemptData = {
            userName: userName,
            directObjects: [objectName],
            indirectObjects: []
          };
          const taken = this.executeTake(takeAttemptData);
          if (!this.attemptMoveCloser(user, recipient, 1)) continue;
          if (taken) user.giveItem(objectName, recipient); // give the item to the recipient
        }
        results.push({ objectName: objectName, recipient: recipient.name });
      }
    } return { userName: user.name, action: 'give', result: results };
  }

  executePlace(data) {
    const destinations = data.indirectObjects;
    const objectNames = data.directObjects;
    const { userName } = data;
    const user = this.grid.getObject({ identifier: userName });
    const results = [];
    if (!destinations.length) { // if no destinations specified
      for (let i = 0; i < objectNames.length; i++) {
        const objName = objectNames[i];
        if (user.hasItem(objName)) {
          const object = user.inventory.removeItem(objName);
          this.grid.dropOntoBoard({ searchOriginObj: user, droppedObject: object });
          results.push({ objectName: object.name, destination: '' });
        }
      }
    }
    // if there were destinations specified
    for (let i = 0; i < destinations.length; i++) {
      const destinationName = destinations[i];
      const destinationObj = this.grid.getObject({ searchOriginObj: user, identifier: destinationName });
      for (let j = 0; j < objectNames.length; j++) {
        const objName = objectNames[j];
        let object;
        if (user.hasItem(objName)) object = user.inventory.getItem(objName);
        else object = this.grid.getObject({ searchOriginObj: user, identifier: objName });
        
        if (object.possesable) {
          if (!user.hasItem(objName)) { // if not already possessed
            const takeAttemptData = {
              userName: userName,
              directObjects: [objName],
              indirectObjects: []
            };
            this.executeTake(takeAttemptData);
          }
          if (!this.attemptMoveCloser(user, destinationObj, 1, false)) continue;
          const object = user.inventory.removeItem(objName);
          // if a specific destination is specified, we need to be able to have more than
          // 2 things on a square?
          this.grid.dropOntoBoard({ searchOriginObj: destinationObj, droppedObject: object },
            Number.MAX_VALUE);
          results.push({ objectName: object.name, destination: destinationObj.name });
        } else { // if we cant possess the object we have to try to move it
          const moveAttemptData = {
            userName: userName,
            directObjects: [objName, userName],
            indirectObjects: [destinationName]
          };
          this.executeMove(moveAttemptData);
        }
      }
    } return { userName: user.name, action: 'place', result: results };
  }

  executeDestroy(data) {
    const user = this.grid.getObject({ identifier: data.userName });
    const results = [];
    const targets = data.directObjects; // assume targets are direct objects

    for (let i = 0; i < targets.length; i++) {
      const targetName = targets[i];
      const targetObj = this.grid.getObject({ searchOriginObj: user, identifier: targetName });
      if (!targetObj)
        results.push({ objectName: targetName, successful: false });
      if (getDistance(user, targetObj) > 1) {
        results.push(this.executeMove());
      }
    }

  }

  executeAttack(data) {

  }

  executeJump(data) {

  }

  executeSpeak(data) {

  }

  executeActivate(data) {
    const user = this.grid.getObject({ identifier: data.userName });
    const results = [];
    data.directObjects.forEach( (directObj) => {
      const subject = this.grid.getObject({ searchOriginObj: user, identifier: directObj });
      if (subject && subject.manuallyActivateable) {
        this.grid.moveToObject([user], subject);
        if (getDistance(user, subject) < 2){ //Check Agent is next to subject
          subject.activate();
        }
        if (subject instanceof Structure) results.push({ objectName: subject.name, successful: subject.activated });
        else results.push({ objectName: subject.name, successful: false });
      } else {
        results.push({ objectName: '', successful: false });
      }
    });
    return { userName: user.name, action: 'activate', result: results };
  }

  executeDeactivate(data) {

  }

  executeUse(data) {
    const user = this.grid.getObject({ identifier: data.userName });
    const results = [];
    data.directObjects.forEach( (directObj) => {
      const subject = this.grid.getObject({ searchOriginObj: user, identifier: directObj });
      if (subject && subject.use) {
        if (this.functionMap[subject.use]) {
          results.push(this.functionMap[subject.use].bind(this)(data));
        }
        else {
          //TODO: Account for special use functions
        }
      }
    });
    return { userName: user.name, action: 'use', result: results };
  }

  /* util method that moves an object closer to a destination | called in executeMethods
      acceptableDistance: describes how far an agent can be from the destination to consider it
      a successful move
      onTop: describes whether we want the agent to be on top of the destination if possible
      false otherwise
   */
  attemptMoveCloser(movingObj, destinationObj, acceptableDistance=1, onTop = true) {
    if (getDistance(movingObj, destinationObj) > acceptableDistance) {
      this.grid.moveToObject([movingObj], destinationObj, onTop);
    } return getDistance(movingObj, destinationObj) <= acceptableDistance;
  }

}

module.exports = ActionExecuter;
