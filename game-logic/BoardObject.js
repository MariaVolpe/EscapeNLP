class BoardObject {
  constructor(name, id, passable = false) {
    this.name = name;
    this.id = id;
    this.passable = passable;
  }
}

module.exports = BoardObject;
