let Point = require('./Point');

/*
 * PathFinder:
    1) given a direction finds a suitable path to move along said direction
    2) given a destination finds a suitable path to reach said destination

    Note that this class doesn't do any translation of coordinates from
    player perspective to matrix indices.
 */

class PathFinder {
  constructor(matrix) {
    this.matrix = matrix; // PathFinder needs a reference to matrix object to see obstacles
  }

  // TODO: PathFinding Algorithms Go Here
  // Returns an array of contiguous points illustrating a path
  getPathByDirection(start, direction) {
    path = [];
    return path;
  }

  // Returns an array with directions on how to reach the destination
  // from the starting coordinate. Returns an empty array if no path exists.
  getPathByDestination(start, destination) {
    let queue = [start];
    let visited = new Set([]);
    let pathList = [];
    let pathExists = false;
    let p;

    while (queue.length > 0) {
      p = queue.shift();
      if (p.x == destination.x && p.y == destination.y) {
        pathExists = true;
        break;
      }

      visited.add(this.stringifyCoordinates(p.x,p.y));
      let neighbors = this.getNeighbors(p, visited);
      queue.push(...neighbors);
    }

    if (pathExists) {
      while (p != start) {
        pathList.push(new Point(p.x, p.y));
        p = p.pathHistory;
      }
      pathList.reverse();
    }
    return pathList;
  }

  getNeighbors(p, visited){
    let neighbors = [];
    if (!visited.has(this.stringifyCoordinates(p.x-1,p.y)) && this.isValidPoint({ x: p.x-1, y :p.y })) {
      neighbors.push({ x: p.x-1, y: p.y , pathHistory: p });
    }
    if (!visited.has(this.stringifyCoordinates(p.x+1,p.y)) && this.isValidPoint({ x: p.x+1,y: p.y })) {
      neighbors.push({ x: p.x+1, y: p.y  , pathHistory: p });
    }
    if (!visited.has(this.stringifyCoordinates(p.x,p.y-1)) && this.isValidPoint({ x: p.x, y: p.y-1 })) {
      neighbors.push({ x: p.x, y: p.y-1  , pathHistory: p });
    }
    if (!visited.has(this.stringifyCoordinates(p.x,p.y+1)) && this.isValidPoint({ x: p.x, y: p.y+1 })) {
      neighbors.push({ x: p.x, y: p.y+1  , pathHistory: p });
    }
    return neighbors;
  }

  isValidPoint({ x,y }) {
    if (x < 0 || y < 0 || x >= this.matrix.length ||  y >= this.matrix[0].length) {
      return false;
    }
    else if ( this.matrix[x][y] == null || this.matrix[x][y].isPassable() ) {
      return true;
    }
    return false;
  }

  stringifyCoordinates(x, y){
    return `${x},${y}`;
  }  
}

module.exports = PathFinder;
