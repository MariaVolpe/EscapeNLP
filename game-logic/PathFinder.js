const Point = require('./Point');
const BoardObject = require('./BoardObject');
/*
 * PathFinder:
    1) given a direction finds a suitable path to move along said direction
    2) given a destination finds a suitable path to reach said destination

    Note that this class doesn't do any translation of coordinates from
    player perspective to matrix indices.
 */

const stringifyCoordinates = (x, y) => `${x},${y}`;

class PathFinder {
  constructor(matrix) {
    this.matrix = matrix; // PathFinder needs a reference to matrix object to see obstacles
  }

  /*
    Returns an array of contiguous points illustrating a path
    Direction is a object that details x and y dimensions
    Use at own risk, not tested - stretch goal
  */
  getPathByDirection(start, direction) {
    const pathList = [];
    const queue = [start];
    let p;
    while (queue.length > 0) {
      p = queue.shift();
      if (!this.isPassablePoint(p)) { // stop as soon as you meet an impassible point
        return pathList;
      }
      pathList.push(p);
      const neighbors = this.getNeighborsByDirection(p, direction);
      queue.push(...neighbors);
    }
    return pathList;
  }

  // Returns an array of contiguous Points illustrating a path to reach the destination
  // from the starting coordinate. Returns an empty array if no path exists.
  getPathByDestination(start, destination) {
    const queue = [start];
    const visited = new Set([]);
    const pathList = [];
    let pathExists = false;
    let p;
    let closestP;
    let minimumDistance = Number.MAX_SAFE_INTEGER;
    while (queue.length > 0) {
      p = queue.shift();
      const distance = this.getManhattanDistance(p, destination);
      if (distance < minimumDistance) {
        minimumDistance = distance;
        closestP = p;
      }
      if (p.x === destination.x && p.y === destination.y) {
        pathExists = true;
        break;
      }
      visited.add(stringifyCoordinates(p.x, p.y));
      const neighbors = this.getNeighbors(p, visited);
      queue.push(...neighbors);
    }

    if (pathExists) {
      while (p !== start) {
        pathList.push(new Point(p.x, p.y));
        p = p.pathHistory;
      }
      pathList.reverse();
    } else { // if there is no direct path use closest point as destination
      return this.getPathByDestination(start, closestP);
    }
    return pathList;
  }

  // Runs BFS to find the closest point where there is not more than 2 items in a square
  getClosestFreePoint(start, threshold = 2) {
    const queue = [start];
    const visited = new Set([]);
    let p;
    while (queue.length > 0) {
      p = queue.shift();
      if (this.matrix[p.x][p.y].length < threshold) {
        return p;
      }
      visited.add(stringifyCoordinates(p.x, p.y));
      const neighbors = this.getNeighbors(p, visited);
      queue.push(...neighbors);
    }
    return null; // return null if no points are free
  }

  getNeighbors(p, visited, onlyPassable = true) {
    const neighbors = [
      { x: p.x - 1, y: p.y },
      { x: p.x + 1, y: p.y },
      { x: p.x, y: p.y - 1 },
      { x: p.x, y: p.y + 1 },
    ];
    const validNeighbors = [];

    neighbors.forEach((pt) => {
      if (!visited.has(stringifyCoordinates(pt.x, pt.y))) {
        if (onlyPassable && this.isPassablePoint({ x: pt.x, y: pt.y })) validNeighbors.push({ x: pt.x, y: pt.y, pathHistory: p });
        else if (!onlyPassable) validNeighbors.push({ x: pt.x, y: pt.y, pathHistory: p });
      }
    });
    return validNeighbors;
  }

  /* Gets neighbors filtered by a direction vector */
  getNeighborsByDirection(p, direction) {
    const neighbors = [];
    const dimensions = direction.x + direction.y;
    if (dimensions === 0) {
      return neighbors;
    }
    const np = new Point(p.x, p.y);
    np.x = p.x + direction.x;
    np.y = p.y + direction.y;
    if (dimensions === 1) { // movement along only 1 axis
      neighbors.push(np);
      return neighbors;
    }
    if (this.isPassablePoint({ x: np.x, y: p.y })) { // movement along 2 axis
      neighbors.push({ x: np.x, y: p.y });
      neighbors.push({ x: np.x, y: np.y });
    } else {
      neighbors.push({ x: p.x, y: np.y });
      neighbors.push({ x: np.x, y: np.y });
    }
    return neighbors;
  }

  // Checks if movement is allowed at a 2D location in the grid
  isPassablePoint({ x, y }) {
    if (x < 0 || y < 0 || x >= this.matrix.length || y >= this.matrix[0].length) {
      return false;
    }
    return this.isPassableStack({ x, y });
  }

  // Checks if all points are passable in a stack
  isPassableStack({ x, y }) {
    const stack = this.matrix[x][y];
    for (let i = 0; i < stack.length; i++) {
      const obj = stack[i];
      if (!obj.isPassable()) return false;
    } return true;
  }

  // Calculates the manhattan distance between two points
  getManhattanDistance(current, target) {
    return Math.abs(current.x - target.x) + Math.abs(current.y - target.y);
  }

  // Gets all objects near a start location bounded by a maximum distance
  getNearbyObjects(start, maxDistance = 2) {
    const nearby = [];
    const queue = [start];
    let p;
    const visited = new Set([]);
    while (queue.length > 0) {
      p = queue.shift();
      if (this.inBounds(p)
      && !visited.has(stringifyCoordinates(p.x, p.y))
      && this.getManhattanDistance(p, start) <= maxDistance) {
        nearby.push(...this.matrix[p.x][p.y]); // push the elements in this stack
        const neighbors = this.getNeighbors(p, visited, false);
        queue.push(...neighbors);
      }
      visited.add(stringifyCoordinates(p.x, p.y));
    } return nearby;
  }

  // Gets the bottom element of the stack //
  bottom(x, y) {
    if (!this.matrix[x][y].length) return null;
    return this.matrix[x][y][0];
  }

  // checks if a point is in bounds of the matrix
  inBounds(p) {
    return !(p.x < 0 || p.y < 0 || p.x >= this.matrix.length || p.y >= this.matrix[0].length);
  }

  setMatrix(matrix) {
    this.matrix = matrix;
  }
}

module.exports = PathFinder;
