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
    this.objectMap = new Map(); // resolves objects to object IDs
    this.matrix = this.setMatrix({ xDim: size, yDim: size });
    this.defaultMatrix = this.setDefaultMatrix({ xDim: size, yDim: size });
    this.pathFinder = new PathFinder(this);
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
    this.objectMap.set(obj, p);
    this.matrix[p.x][p.y] = obj;
  }

  /* Removes an object from the board */
  remove({
    obj, id, name, x, y, defaultMatrix = false,
  }) {
    let NAME;
    let ID;
    let object;
    const matrix = defaultMatrix ? this.defaultMatrix : this.matrix;
    if (obj) { // if the object was passed in
      NAME = obj.name;
      ID = this.objectMap.get(obj);
      object = obj;
    } else if (id) { // if the id was passed in
      const p = this.positionMap.get(id);
      object = matrix[p.x][p.y];
      NAME = object.name;
      ID = id;
    } else if (name) { // if the name was passed in
      ID = this.nameMap.get(name);
      const p = this.positionMap.get(ID);
      object = matrix[p.x][p.y];
      NAME = object.name;
    } else { // if the coordinates were passed in
      object = matrix[x][y];
      ID = object.id;
      NAME = object.name;
    }
    // delete from maps
    this.nameMap.delete(NAME);
    this.objectMap.delete(object);
    this.positionMap.delete(ID);
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
  moveToDestination(movingObj, destination) {
    const startPoint = this.getPosition(movingObj);
    const destinationPoint = this.getPosition(destination);
    const path = this.pathFinder.getPathByDestination(startPoint, destinationPoint);
    const lastPoint = path[path.length - 1];
    // update matrix @ current point //
    this.updateMatrix(lastPoint.x, lastPoint.y, this.matrix[startPoint.x][startPoint.y]);
    // update matrix @ previous point //
    this.updateMatrix(startPoint.x, startPoint.y, this.defaultMatrix[startPoint.x][startPoint.y]);
    // update position of object
    this.getPosition(movingObj).x = lastPoint.x;
    this.getPosition(movingObj).y = lastPoint.y;
    return { movingObject: movingObj, position: this.getPosition(movingObj), pathTaken: path };
  }

  // given a direction, move towards it
  moveByDirection(movingObj, direction) {
    const startPoint = this.positionMap[movingObj];
    const path = PathFinder.getPathByDirection(startPoint, direction);
  }

  // Gets an object either by its object id, its name, or by the object itself
  getObj(objID) {
    let p;
    if (typeof objID === 'number') {
      p = this.positionMap.get(objID);
    } else if (typeof objID === 'string') {
      const id = this.nameMap.get(objID);
      p = this.positionMap.get(id);
    } else { // objectID is an object
      const id = this.objectMap.get(objID);
      p = this.positionMap.get(id);
    }
    return this.matrix[p.x][p.y];
  }

  // Returns Point representing indices of desired object within the grid.
  getPosition(objID) {
    if (typeof objID === 'number') {
      return this.positionMap.get(objID);
    }
    if (typeof objID === 'string') {
      const id = this.nameMap.get(objID);
      return this.positionMap.get(id);
    }
    // else objID is an object
    const id = this.objectMap.get(objID);
    return this.positionMap.get(id);
  }

  /* Sets the default state of defaultMatrix */
  setDefaultMatrix({ xDim, yDim, matrix }) {
    if (matrix) {
      this.defaultMatrix = matrix;
      return;
    }
    this.defaultMatrix = new Array(xDim).fill(null).map(() => new Array(yDim).fill(null));
  }

  /* Sets the state of Matrix */
  setMatrix({ xDim, yDim, matrix }) {
    if (matrix) {
      this.matrix = matrix;
      return;
    }
    this.matrix = new Array(xDim).fill(null).map(() => new Array(yDim).fill(null));
  }

  // updates a position of the default matrix with an object //
  updateDefaultMatrix(x, y, obj) {
    this.defaultMatrix[x][y] = obj;
  }

  // updates a position of matrix with an object //
  updateMatrix(x, y, obj) {
    this.matrix[x][y] = obj;
  }
}

module.exports = Grid;
