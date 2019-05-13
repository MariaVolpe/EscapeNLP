const Point = require('./Point');
const { PathFinder, getManhattanDistance } = require('./PathFinder');
const Agent = require('./Agent');
const { matchRegex, convertToIndices } = require('./util');
/*
 * Grid
 * 1) encapsulates positions of agents, items, walls in the environment
 *
 * Variables:
 *  positionMap: used to match the id of an object to its position within the grid
 *      using the position the object can be found
 */

const getDistance = (centerObj, otherObj) => (
  getManhattanDistance(centerObj.position, otherObj.position)
);

class Grid {
  constructor(layoutGrid) {
    this.nameToObjsList = new Map(); // resolves names to list of objects
    this.matrix = layoutGrid;
    this.recordObjectInformation();
    // this.matrix = this.setMatrix({ xDim: xDimension, yDim: yDimension });
    this.pathFinder = new PathFinder(this.matrix);
    this.pathFinder.setMatrix(this.matrix);
  }

  /*
   * Adds an object to the board. Coordinates are assumed to be
   * from the player's perspective, and are translated to the
   * proper indices for the matrix.
   */
  add(obj, { x, y } = {}) {
    let p;
    if (x === undefined || y === undefined) {
      p = this.findFreeSpace();
    } else {
      p = new Point(x, y);
    }
    obj.position = p;
    this.addToNameToObjectsMap(obj);
    this.matrix[p.x][p.y].push(obj);
  }

  getFormattedGrid() {
    const frontEndMatrix = Array.from({ length: this.matrix.length },
      () => Array.from({ length: this.matrix[0].length },
        () => []));

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        this.matrix[i][j].forEach((item) => {
          frontEndMatrix[i][j].push({
            sprite: item.getSpriteName(),
            hint: item.name,
          });
        });
      }
    }
    return frontEndMatrix;
  }

  removeFromBoard(boardObj) {
    if (!boardObj) {
      return;
    }
    this.removeFromStack(boardObj);
    const p = boardObj.position;
    this.matrix[p.x][p.y] = this.matrix[p.x][p.y].filter(o => boardObj !== o);
    const name = boardObj.name.toLowerCase();
    const removed = this.nameToObjsList.get(name).filter(o => boardObj !== o);
    this.nameToObjsList.set(name, removed);
  }

  // drops the specified object to the nearest point to the center object
  dropOntoBoard({ searchOriginObj, droppedObject }, maxItemsOnSquare = 2) {
    const p = this.pathFinder.getClosestFreePoint(searchOriginObj.position, maxItemsOnSquare);
    this.add(droppedObject, { x: p.x, y: p.y });
  }

  // Finds a free space in the board, returns a point with its indices.
  findFreeSpace() {
    const p = new Point();
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j].length && this.pathFinder.isPassablePoint({ x: i, y: j })) {
          p.x = i;
          p.y = j;
          return p;
        }
      }
    }
    // todo: handle if board is full
  }

  // Given destination coordinates, call pathfinder to find a suitable path towards it
  // movingObjs is a list of objects that are moving ordered by following to leading
  moveToCoordinates(movingObjs, destinationPoint) {
    const pathsTaken = [];
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      if (!movingObj.isMovable()) { pathsTaken.push([]); continue; }
      const startPoint = movingObj.position;
      let path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
      if (!path.length) { pathsTaken.push([]); continue; }
      // offset by how many things we are moving
      path = i + 1 <= path.length ? path.slice(0, path.length - i) : path.slice(0, 1);
      const lastPoint = path[path.length - 1];
      pathsTaken.push(path); // slice arrays and store the result
      // update matrix @ previous point //
      this.removeFromStack(movingObj);
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // update position of object
      movingObj.position.x = lastPoint.x;
      movingObj.position.y = lastPoint.y;
    }
    return pathsTaken;
  }

  // Given a destination object, call pathfinder to find a suitable path towards it
  // movingObjs is a list of objects that are moving ordered by following to leading
  // onTop: true when mover moves on top of the destinationObj if possible, false otherwise
  moveToObject(movingObjs, destinationObj, onTop = true) {
    const destinationPoint = destinationObj.position;
    const pathsTaken = [];
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      if (!movingObj.isMovable()) { pathsTaken.push([]); continue; }
      const startPoint = movingObj.position;
      let path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
      if (!path.length) { pathsTaken.push([]); continue; }
      if (!onTop && destinationObj.isPassable()) path.pop();
      // offset by how many things we are moving
      path = i + 1 <= path.length ? path.slice(0, path.length - i) : path.slice(0, 1);
      // const lastPoint = i + 1 <= path.length ? path[path.length - i - 1] : path[0];
      const lastPoint = path[path.length - 1];
      pathsTaken.push(path); // slice arrays and store the result
      // update matrix @ previous point //
      this.removeFromStack(movingObj);
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // update position of object
      movingObj.position.x = lastPoint.x;
      movingObj.position.y = lastPoint.y;
    }
    return pathsTaken;
  }

  // TODO: STRETCH GOAL CODE
  // given a direction, move in that direction
  moveByDirection(movingObjs, direction) {
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      const startPoint = movingObj.position;
      const path = this.pathFinder.getPathByDirection(startPoint, direction);
      // offset by how many things we are moving
      const lastPoint = i + 1 <= path.length ? path[path.length - i - 1] : path[0];
      // update matrix @ previous point //
      this.removeFromStack(movingObj); // this wont work for moving objects
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // in the middle of the stack
      // update position of object
      movingObj.position.x = lastPoint.x;
      movingObj.position.y = lastPoint.y;
    }
  }

  // Gets an object relative to a centerObj and its the object name
  getObject({ searchOriginObj, identifier }) {
    // if passed in a name and a centerObj, get nearest one, otherwise just get first in list
    identifier = identifier.toLowerCase();
    if (this.nameToObjsList.has(identifier)) {
      const objList = this.nameToObjsList.get(identifier);
      return searchOriginObj ? this.getNearestObject(searchOriginObj, objList) : objList[0];
    }
    return null;
  }

  /* Creates a 3D matrix with xDim and yDim */
  setMatrix(matrix) {
    this.matrix = matrix;
    this.pathFinder.setMatrix(matrix);
    this.recordObjectInformation();
  }

  // updates a position of matrix with an object //
  pushOnMatrix(x, y, obj) {
    this.matrix[x][y].push(obj);
  }

  // Given a center object and an object name, find the nearest object that matches that name
  resolveNameToNearestObject(searchOriginObj, objName) {
    objName = objName.toLowerCase();
    const objList = this.nameToObjsList.get(objName);
    return this.getNearestObject(searchOriginObj, objList);
  }

  // STRETCH GOAL CODE
  // given a directional classification, resolves to a direction vector
  resolveDirectionToVector({ start, end, direction }) { // eslint-disable-line
  }

  // Given a center object and list of objects, find the nearest object to it.
  getNearestObject(searchOriginObj, objList) {
    const originPosition = searchOriginObj.position;
    let nearest = null;
    let distance = Number.MAX_VALUE;
    objList.forEach((element) => { // for all objects in the list provided find the nearest
      const d = getManhattanDistance(originPosition, element.position);
      if (d < distance) {
        distance = d;
        nearest = element;
      }
    }); return nearest;
  }

  // Given a center object get all objects within a threshold distance
  getNearbyObjects(searchOriginObj, maxDistance = 3) {
    return this.pathFinder.getNearbyObjects(searchOriginObj.position, maxDistance, false);
  }

  // removes an element from the stack by the object reference itself
  removeFromStack(boardObj) {
    const p = boardObj.position;
    const stack = this.matrix[p.x][p.y].filter(o => boardObj !== o);
    this.matrix[p.x][p.y] = stack;
  }

  // Goes through the objects in the grid and updates their position fields
  recordObjectInformation() {
    const matrix = this.matrix; // eslint-disable-line prefer-destructuring
    this.nameToObjsList.clear();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const stack = matrix[i][j];
        stack.forEach((e) => {
          e.position.x = i;
          e.position.y = j;
          this.addToNameToObjectsMap(e);
        });
      }
    }
  }

  addToNameToObjectsMap(obj) {
    const name = obj.name.toLowerCase();
    if (!this.nameToObjsList.has(name)) this.nameToObjsList.set(name, []);
    this.nameToObjsList.get(name).push(obj);
  }

  // gets all objects of type agent from the grid //
  // NOT READY YET
  getAgents() {
    const matrix = this.matrix; // eslint-disable-line prefer-destructuring
    const agents = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const stack = matrix[i][j];
        for (let k = 0; k < stack.length; k++) {
          const obj = stack[k];
          if (obj instanceof Agent) agents.push(obj);
        }
      }
    }
  }
}

module.exports = { Grid, getDistance };
