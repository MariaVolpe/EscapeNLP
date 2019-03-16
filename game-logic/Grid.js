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
    // Adds an object to a specified x y position in the matrix //
    if (x && y) {
      let p = new Point(this.boardSize-1-y, x);
      this.positionMap[obj.name] = p;
      this.matrix[this.boardSize-1-y][x] = obj;
    }
    //Add an object to the first available space in the board.
    else {
      let p = new Point();
      let spotFound = false;
      for (let i = 0; i < this.matrix.length && !spotFound; i++) {
        for (let j = 0; j < this.matrix[i].length && !spotFound; j++)
          if (this.matrix[i][j] == null /*|| EMPTY SLOT */) {
            p.x = j;
            p.y = i;
            spotFound = true;
          }
      }
      this.positionMap[obj] = p;
      this.matrix[p.y][p.x] = obj; 
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