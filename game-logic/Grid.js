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
    this.positionMap = new Map(); // Keeps coordinates of object in board, resolves ids to positions
    this.nameMap = new Map(); // resolves names to object IDs
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
    this.nameMap.set(obj.name, obj.id);
    this.positionMap.set(obj.id, p);
    this.matrix[p.x][p.y].push(obj);
  }

  /* Removes an object from the board */
  remove({
    obj, id, name,
  }) {
    let ID;
    let NAME;
    let object = obj;
    if (id) { // if the id was passed in
      ID = id;
      object = this.getObject(ID);
      NAME = object.name;
    } else if (name) { // if the name was passed in
      ID = this.nameMap.get(name);
      object = this.getObject(ID);
      NAME = object.name;
    }
    // delete from maps
    this.nameMap.delete(NAME);
    this.positionMap.delete(ID);
    this.removeFromStack(object);
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

  // Given a destination object, call pathfinder to find a suitable path towards it
  // movingObjs is a list of objects that are moving ordered by following to leading
  moveToDestination(movingObjs, destination) {
    const destinationPoint = this.getPosition(destination);
    for (let i = 0; i < movingObjs.length; i++) {
      const movingObj = movingObjs[i];
      const startPoint = this.getPosition(movingObj);
      const path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
      const lastPoint = i + 1 <= path.length ? path[path.length - i - 1] : path[0]; // offset by how many things we are moving
      // update matrix @ current point //
      this.pushOnMatrix(lastPoint.x, lastPoint.y, movingObj);
      // update matrix @ previous point //
      this.removeFromStack(movingObj); // this wont work for moving objects
      // in the middle of the stack
      // update position of object
      this.getPosition(movingObj).x = lastPoint.x;
      this.getPosition(movingObj).y = lastPoint.y;
    }
  }

  // given a direction, move towards it
  moveByDirection(movingObj, direction) {
    const startPoint = this.positionMap[movingObj];
    const path = PathFinder.getPathByDirection(startPoint, direction);
  }

  // Gets an object either by its object id, its name, or by the object itself
  getObject(objID) {
    let stack;
    if (this.positionMap.has(objID)) { // passed in a objID
      const p = this.positionMap.get(objID);
      stack = this.matrix[p.x][p.y];
    } else if (this.nameMap.has(objID)) { // passed in a name
      const id = this.nameMap.get(objID);
      const p = this.positionMap.get(id);
      stack = this.matrix[p.x][p.y];
    }
    return stack.find(o => objID.name === o.name);
  }

  // Returns Point representing indices of desired object within the grid.
  getPosition(objID) {
    let id;
    if (this.positionMap.has(objID)) {
      return this.positionMap.get(objID);
    }
    if (this.nameMap.has(objID)) {
      id = this.nameMap.get(objID);
    } else { // object
      id = objID.id;
    }
    return this.positionMap.get(id);
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

  // removes an element from the stack by its ID or the object reference itself
  removeFromStack(obj) {
    const p = this.positionMap.get(obj.id);
    const stack = this.matrix[p.x][p.y].filter(o => obj !== o);
    this.matrix[p.x][p.y] = stack;
  }
}

module.exports = Grid;
