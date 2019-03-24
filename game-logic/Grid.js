import Point from './Point';
import PathFinder from './PathFinder';
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
    this.positionMap = new Map(); // Keeps coordinates of object in board
    this.matrix = new Array(size).fill(null).map(() => new Array(size).fill(null));
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
      // Converts coordinates from player perspective to matrix indices
      p = new Point(this.boardSize - 1 - y, x);
    }
    this.positionMap[obj.id] = p;
    this.matrix[p.x][p.y] = obj;
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
    const startPoint = this.positionMap[movingObj];
    const path = PathFinder.getPathByDestination(startPoint, destination);
    for (let i = 0; i < path.length; i++) {
      this.point = path[i]; // update current position
      // update grid | TODO: whenever that class gets written
    }
  }

  // given a direction, move towards it
  moveByDirection(movingObj, direction) {
    const startPoint = this.positionMap[movingObj];
    const path = PathFinder.getPathByDirection(startPoint, direction);
  }

  // Returns Point representing indices of desired object within the grid.
  getPosition(objId) {
    return this.positionMap[objId];
  }
}

export default Grid;
