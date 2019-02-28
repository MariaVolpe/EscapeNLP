import Point from "./Point";

/*
 * PathFinder:
    1) given a direction finds a suitable path to move along said direction
    2) given a destination finds a suitable path to reach said destination
 */

class PathFinder {
    constructor (grid) {
        this.grid = grid; // PathFinder needs a reference to grid object to see obstacles
    }

    // TODO: PathFinding Algorithms Go Here
    // Returns an array of contiguous points illustrating a path
    getPathByDirection(start, direction) {
        path = [];
        return path;
    }
    // Returns an array of contiguous points illustrating a path | BFS
    getPathByDestination(start, destination) {
        path = [];
        destinationPoint = {x: 0, y: 0, p: start};
        queue = [start];
        visited = new Set([]);

        while (queue.size > 0) {
            p = queue.shift(); // like pop in a queue
            if (p.x < 0 || p.y < 0 || p.y >= grid.size || p.x >= grid[p.y].size)
                continue;
            if (visited.has (p)) // will this compare by reference or value though?
                continue;
            if (grid[destination].x == p.x && grid[destination].y == p.y) {
                destinationPoint = {x: p.x, y: p.y, p: p};
                break;
            }
                
            // push in neighbors //
            p.push({x: p.x-1, y: p.y, path: p}); // left square
            p.push({x: p.x+1, y: p.y, path: p}); // right square
            p.push({x: p.x, y: p.y-1, path: p}); // bottom square
            p.push({x: p.x, y: p.y+1, path: p}); // top square
        }
        while (destinationPoint.path != start) { // track back to beginning
            path.push (new Point (destinationPoint.x, destinationPoint.y));
            destinationPoint = destinationPoint.path;
        }
        path.reverse(); // reverse to get forward order
        return path;
    }

    

}

export default PathFinder;