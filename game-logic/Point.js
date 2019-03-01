
/*
 * Point describes a position on a 2D grid
 */
class Point {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // returns a copy of this object with coordinate information
    getPoint () { 
        return {x:this.x, y:this.y};
    }

    // changes coordinate information of this point 
    setPoint (x, y) {
        this.x = x;
        this.y = y;
    }
}

export default Point;