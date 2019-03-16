import Point from './Point';
import PathFinder from './PathFinder';
/*
 * Grid
 * 1) encapsulates positions of agents, items, walls in the environment
 *
 * Variables:
 *  positionMap: used to match the name of an object to its position within the grid
 *      using the position the object can be found
 */

class Grid {
  constructor(size) {
    this.boardSize = size;
    this.positionMap = new Map(); //Keeps coordinates of object in board
    this.matrix = new Array(size).fill(null).map(() => new Array(size).fill(null));
  }

  /*
   * Adds an object to the board. Coordinates are assumed to be
   * from the player's perspective, and are translated to the
   * proper indices for the matrix.
   */
  add(obj, {x, y} = {}) {
    var p;
    if (x && y) {// Converts coordinates from player perspective to matrix indices
      var p = new Point(this.boardSize-1-y, x);
    }
    else{//Add an object to the first available space in the board.
      var p = this.findFreeSpace();
    }
    this.positionMap[obj.name] = p;
    this.matrix[p.x][p.y] = obj;
  }

  //Finds a free space in the board, returns a point with its indices.
  findFreeSpace() {
    let p = new Point();
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++)
        if (this.matrix[i][j] == null /*|| EMPTY SLOT */) {
          p.x = i;
          p.y = j;
          return p;
        }
    }
  }

  // Given a destination object, call pathfinder to find a suitable path towards it
  moveToDestination(movingObj, destination) {
    let startPoint = this.positionMap[movingObj];
    let path = this.pathfinder.getPathByDestination(destination);
    for (let i = 0; i < path.length; i++) {
      this.point = path[i]; // update current position
      // update grid | TODO: whenever that class gets written
    }
  }

  // given a direction, move towards it
  moveByDirection(movingObj, direction) {
    let startPoint = this.positionMap[movingObj];
    path = this.pathfinder.getPathByDirection(direction);
  }

  //Returns Point representing indices of desired object within the grid.
  getPosition(objName) {
    return this.positionMap[objName];
  }
}

export default Grid;
