
/*
 * Point describes a position on a 2D grid
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get point() {
    return { x: this.x, y: this.y };
  }

  set point({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

export default Point;
