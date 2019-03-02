class Item extends Object {
  // items are passable by default
  constructor(name, id, useMethod, passable = true) {
    super(name, id, passable);
    this.use = useMethod;
  }
}

export default Item;
