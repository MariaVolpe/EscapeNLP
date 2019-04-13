class BoardObject {
  constructor(name, id, puzzleType = null, passable = false) {
    this.name = name;
    this.id = id;
    this.puzzleType = puzzleType;
    this.passable = passable;
  }
}

module.exports = BoardObject;
