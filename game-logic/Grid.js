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
  constructor(size) {
    this.boardSize = size;
    this.nameToObjsList = new Map(); // resolves names to list of objects|useful when multiple of same name
    this.matrix = this.setMatrix({ xDim: size, yDim: size });
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
    // TODO: FIX THIS LINE
    // this.nameToObjList.set(obj.name, obj.id);
    this.positionMap.set(obj.id, p);
    this.matrix[p.x][p.y].push(obj);
  }

  removeFromBoard(boardObj) {
    if (!boardObj) {
      return;
    }

    this.removeFromStack(boardObj);
    // todo: delete from list not the key
    // this.nameToObjsList.delete(boardObj.name);
  }

  // Finds a free space in the board, returns a point with its indices.
  findFreeSpace() {
    const p = new Point();
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === null /* || EMPTY SLOT */) {
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
    // todo
  }

  // Given a destination object, call pathfinder to find a suitable path towards it
  // movingObjs is a list of objects that are moving ordered by following to leading
  moveToObj(movingObjs, destinationObj) {
    const destinationPoint = destinationObj.position;
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      const startPoint = this.getPosition(movingObj);
      const path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
      // offset by how many things we are moving
      const lastPoint = i + 1 <= path.length ? path[path.length - i - 1] : path[0];
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // update matrix @ previous point //
      this.removeFromStack(movingObj); // this wont work for moving objects
      // in the middle of the stack
      // update position of object
      movingObj.position.x = lastPoint.x;
      movingObj.position.y = lastPoint.y;
    }
  }

  // given a direction, move towards it
  moveByDirection(movingObj, direction) {
    const startPoint = movingObj.position;
    const path = PathFinder.getPathByDirection(startPoint, direction);
  }

  // todo: rewrite this! it doesn't work in its current form! note the change
  // in name and functionality of nameMap -> nameToObjsList
  // Gets an object either by its object id, its name, or by the object itself
  getObject(objID) {
    let stack;
    if (this.positionMap.has(objID)) { // passed in a objID
      const p = this.positionMap.get(objID);
      stack = this.matrix[p.x][p.y];
      return stack.find(o => objID === o.id);
    }
    if (this.nameToObjsList.has(objID)) { // passed in a name
      const id = this.nameMap.get(objID);
      const p = this.positionMap.get(id);
      stack = this.matrix[p.x][p.y];
      return stack.find(o => objID === o.name);
    }
    for (let i = 0; i < this.matrix.length; i++) { // otherwise we have to brute force search for the obj
      for (let j = 0; j < this.matrix[i].length; j++) {
        stack = this.matrix[i][j];
        const found = stack.find(o => objID.id === o.id);
        if (found) return found;
      }
    }
    return null;
  }

  /* Creates a 3D matrix with xDim and yDim */
  setMatrix({ xDim, yDim, matrix }) {
    if (matrix) {
      this.matrix = matrix;
      this.pathFinder.setMatrix(matrix);
      return;
    }
    this.matrix = Array.from({ length: xDim },
      () => Array.from({ length: yDim },
        () => []));
  }

  // updates a position of matrix with an object //
  pushOnMatrix(x, y, obj) {
    this.matrix[x][y].push(obj);
  }

  resolveNameToNearestObject(player, objName) {
    const objList = this.nameToObjsList.get(objName);
    getNearestObject(playerId, objList);
  }

  getNearestObject(player, objList) {
    const playerPosition = player.position;
    const nearest = null;
    // do calc
    return nearest;
  }

  // removes an element from the stack by the object reference itself
  removeFromStack(boardObj) {
    const p = boardObj.position
    const stack = this.matrix[p.x][p.y].filter(o => boardObj !== o);
    this.matrix[p.x][p.y] = stack;
  }
}

module.exports = Grid;
