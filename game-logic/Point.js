
/*
 * Point describes a position on a 2D grid
 */
class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // returns a copy of this object with coordinate information
  getPoint() {
    return { x: this.x, y: this.y };
  }

  // changes coordinate information of this point
  setPoint(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default Point;
