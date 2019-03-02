class Item extends Object {
  constructor(name, id, useMethod) {
    super(name, id, useMethod);
    this.use = useMethod;
    this.passable = true; // items are passable by default
  }
}

export default Item;
