import Point from "Point";
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
        this.positionMap = new Map();
        this.matrix = Array(size).fill(null).positionMap(()=>Array(size).fill(null)); 
    }

    // Adds an object to the first available position in the matrix
    add (obj) {
        let p = new Point();
        let spotFound = false;
        for (let i = 0; i < matrix.length && !spotFound; i++) {
            for (let j = 0; j < matrix[i].length && !spotFound; j++)
                if (matrix[i][j] == null /*|| EMPTY SLOT */) {
                    point.x = j; point.y = i;
                    spotFound = true;
                }
        }
        this.positionMap[obj] = p;
        this.matrix[p.y][p.x] = obj;
    }

    // Adds an object to a specified x y position in the matrix //
    add (obj, x, y) {
        let p = new Point(x, y);
        this.positionMap[obj.name] = p;
        this.matrix[y][x] = obj;
    }
    // Given a destination object, call pathfinder to find a suitable path towards it
    moveToDestination (movingObj, destination) {
        let startPoint = this.positionMap[movingObj];
        let path = this.pathfinder.getPathByDestination(destination);
        for (let i = 0; i < path.length; i++) {
            this.point = path[i]; // update current position
            // update grid | TODO: whenever that class gets written
        }
    }

    // given a direction, move towards it
    moveByDirection (movingObj, direction) {
        let startPoint = this.positionMap[movingObj];
        path = this.pathfinder.getPathByDirection(direction);
    }

    getPosition(obj) {
        return this.positionMap[obj];
    }

}

export default Grid;