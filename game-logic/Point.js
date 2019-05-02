
/*
 * Point describes a position on a 2D grid
 */
class Point {
  constructor(x = null, y = null) {
    this.x = x;
    this.y = y;
  }

  /*get point() {
    return { x: this.x, y: this.y };
  }

  get x() {
    return this.x;
  }

  get y() {
    return this.y;
  }

  set x(x) {
    this.x = x;
  }

  set y(y) {
    this.y = y;
  }

  set point({ x, y }) {
    this.x = x;
    this.y = y;
  }*/
}

module.exports = Point;
