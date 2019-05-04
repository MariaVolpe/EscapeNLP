const Point = require('./Point');
const PathFinder = require('./PathFinder');
/*
 * Grid
 * 1) encapsulates positions of agents, items, walls in the environment
 *
 * Variables:
 *  positionMap: used to match the id of an object to its position within the grid
 *      using the position the object can be found
 */

class Grid {
  constructor({ xDimension, yDimension }) {
    this.nameToObjsList = new Map(); // resolves names to list of objects
    this.matrix = this.setMatrix({ xDim: xDimension, yDim: yDimension });
    this.pathFinder = new PathFinder(this.matrix);
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
    if (this.nameToObjsList.has(obj.name)) { // if a list already exists
      this.nameToObjsList.get(obj.name).push(obj);
    } else this.nameToObjsList.set(obj.name, [obj]);
    this.matrix[p.x][p.y].push(obj);
  }

  removeFromBoard(boardObj) {
    if (!boardObj) {
      return;
    }
    this.removeFromStack(boardObj);
    const p = boardObj.position;
    this.matrix[p.x][p.y] = this.matrix[p.x][p.y].filter(o => boardObj !== o);
    const { name } = boardObj;
    const removed = this.nameToObjsList.get(name).filter(o => boardObj !== o);
    this.nameToObjsList.set(name, removed);
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
  moveToCoordinates(movingObjs, destinationCoords) {
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      const startPoint = movingObj.position;
      const path = this.pathFinder.getPathByDestination(startPoint, destinationCoords);
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

  // Given a destination object, call pathfinder to find a suitable path towards it
  // movingObjs is a list of objects that are moving ordered by following to leading
  moveToObject(movingObjs, destinationObj) {
    const destinationPoint = destinationObj.position;
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      const startPoint = movingObj.position;
      const path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
      // offset by how many things we are moving
      const lastPoint = i + 1 <= path.length ? path[path.length - i - 1] : path[0];
      // update matrix @ previous point //
      this.removeFromStack(movingObj);
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // in the middle of the stack
      // update position of object
      movingObj.position.x = lastPoint.x;
      movingObj.position.y = lastPoint.y;
    }
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

  // Gets an object either by its name or the object id
  getObject({ centerObj, identifier }) {
    // if passed in a name and a centerObj, get nearest one, otherwise just get first in list
    if (this.nameToObjsList.has(identifier)) {
      const objList = this.nameToObjsList.get(identifier);
      return centerObj ? this.getNearestObject(centerObj, objList) : this.nameToObjsList.get(identifier)[0];
    }
    // otherwise its an id
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const stack = this.matrix[i][j];
        const found = stack.find(o => identifier === o.id);
        if (found) return found;
      }
    } return null;
  }

  // updates a position of matrix with an object //
  pushOnMatrix(x, y, obj) {
    this.matrix[x][y].push(obj);
  }

  // Given a center object and an object name, find the nearest object that matches that name
  resolveNameToNearestObject(centerObj, objName) {
    const objList = this.nameToObjsList.get(objName);
    return this.getNearestObject(centerObj, objList);
  }

  // STRETCH GOAL CODE
  // given a directional classification, resolves to a direction vector
  resolveDirectionToVector({ start, end, direction }) { // eslint-disable-line
  }

  // Given a center object and list of objects, find the nearest object to it.
  getNearestObject(centerObj, objList) {
    const centerPosition = centerObj.position;
    let nearest = null;
    let distance = Number.MAX_VALUE;
    objList.forEach((element) => { // for all objects in the list provided find the nearest
      const d = this.pathFinder.getManhattanDistance(centerPosition, element.position);
      if (d < distance) {
        distance = d;
        nearest = element;
      }
    }); return nearest;
  }

  // Given a center object get all objects within a threshold distance
  getNearbyObjects(centerObj, maxDistance = 2) {
    return this.pathFinder.getNearbyObjects(centerObj.position, maxDistance, false);
  }

  // removes an element from the stack by the object reference itself
  removeFromStack(boardObj) {
    const p = boardObj.position;
    const stack = this.matrix[p.x][p.y].filter(o => boardObj !== o);
    this.matrix[p.x][p.y] = stack;
  }

  getDistance(centerObj, otherObj) {
    return this.pathFinder.getManhattanDistance(centerObj.position, otherObj.position);
  }

  // Goes through the objects in the grid and updates their position fields
  updateObjectInformation() {
    const matrix = this.matrix; // eslint-disable-line prefer-destructuring
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const stack = matrix[i][j];
        stack.forEach((e) => {
          e.position.x = i;
          e.position.y = j;
          this.addToObjectMap(e);
        });
      }
    }
  }

  addToObjectMap(object) {
    if (!this.nameToObjsList.has(object.name)) {
      this.nameToObjsList.set(object.name, []);
    }
    this.nameToObjsList.get(object.name).push(object);
  }

  /* Creates a 3D matrix with xDim and yDim */
  setMatrix({ xDim, yDim, matrix }) {
    if (matrix) {
      this.matrix = matrix;
      this.pathFinder.setMatrix(matrix);
      this.updateObjectInformation();
      return;
    }
    this.matrix = Array.from({ length: xDim },
      () => Array.from({ length: yDim },
        () => []));
  }
}

module.exports = Grid;
