const Grid = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');

describe('Grid functionality tests', () => {
  // This needs to be changed to use Structure objects to work //
  describe('Adding and removing elements', () => {
    console.log('STARTING ADD AND REMOVE TEST');
    const floor = new Structure('floor_switch', 'a', null);
    const wall = new Structure('weight', 'b', null);
    const mover = { name: 'object', id: '0', position: { x: 0, y: 0 } };
    const destination = { name: 'destination', id: '1', position: { x: 0, y: 0 } };
    let expected;
    it('should add elements', async () => {
      const addingGrid = new Grid(3);
      addingGrid.setMatrix({
        matrix: [
          [[wall], [floor], [floor]],
          [[wall], [floor], [wall]],
          [[floor], [floor], [wall]],
        ],
      });
      // place a moving object and destination at these points //
      addingGrid.add(mover, { x: 0, y: 2 });
      addingGrid.add(destination, { x: 2, y: 0 });
      expected = JSON.stringify(
        [
          [[wall], [floor], [floor, mover]],
          [[wall], [floor], [wall]],
          [[floor, destination], [floor], [wall]],
        ],
      );
      expect(JSON.stringify(addingGrid.matrix)).toEqual(expected);
    });

    it('should remove elements', async () => {
      const removingGrid = new Grid(3);
      removingGrid.setMatrix({
        matrix: [
          [[wall], [floor], [floor]],
          [[wall], [floor], [wall]],
          [[floor], [floor], [wall]],
        ],
      });
      // place a moving object and destination at these points //
      removingGrid.add(mover, { x: 0, y: 2 });
      removingGrid.add(destination, { x: 2, y: 0 });
      removingGrid.removeFromBoard(mover);
      removingGrid.removeFromBoard(destination); // deleting by name
      removingGrid.add(destination, { x: 2, y: 0 });
      removingGrid.removeFromBoard(destination);
      expected = JSON.stringify(
        [
          [[wall], [floor], [floor]],
          [[wall], [floor], [wall]],
          [[floor], [floor], [wall]],
        ],
      );
      expect(JSON.stringify(removingGrid.matrix)).toEqual(expected);
    });
  });
  describe('Object movement', () => {
    it('should move a named object to a named destination', async () => {
      const grid = new Grid(3);
      const floor = new Structure('floor_switch', 'a', null);
      const weight = new Structure('weight', 'b', null);
      const wall = new Structure('weight', 'c', null);
      // hardcode matrices to these //
      grid.setMatrix({ matrix: [[[wall], [floor], [floor]], [[wall], [floor], [wall]], [[floor], [floor], [wall]]] });
      const destination = { name: 'destination', id: 1, position: { x: 0, y: 0 } };
      // place a moving object and destination at these points //
      grid.add(weight, { x: 0, y: 2 });
      grid.add(destination, { x: 2, y: 0 });
      // move object
      grid.moveToObject([weight], grid.resolveNameToNearestObject(weight, 'destination'));
      // do checks
      const expected = JSON.stringify([[[wall], [floor], [floor]], [[wall], [floor], [wall]],
        [[floor, destination, weight], [floor], [wall]]]);
      expect(JSON.stringify(grid.matrix)).toEqual(expected);
    });
  });
});