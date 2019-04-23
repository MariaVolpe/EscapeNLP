const Grid = require('../../game-logic/Grid');

describe('Grid functionality tests', () => {
  // This needs to be changed to use Structure objects to work //
  /* describe('Adding and removing elements', () => {
    it('should add and remove elements elements', async () => {
      const grid = new Grid(3);
      // hardcode matrices to these //
      grid.setMatrix({ matrix: [[[1], [null], [null]], [[1], [null], [1]], [[null], [null], [1]]] });
      // initialize moving object
      const mover = { name: 'object', id: 0 };
      const destination = { name: 'destination', id: 1 };
      // place a moving object and destination at these points //
      grid.add(mover, { x: 0, y: 2 });
      grid.add(destination, { x: 2, y: 0 });
      let expected = JSON.stringify([[[1], [null], [null, mover]], [[1], [null], [1]], [[null, destination], [null], [1]]]);
      expect(JSON.stringify(grid.matrix)).toEqual(expected);
      grid.remove(mover);
      grid.remove(destination);
      expected = JSON.stringify([[[1], [null], [null]], [[1], [null], [1]], [[null], [null], [1]]]);
      expect(JSON.stringify(grid.matrix)).toEqual(expected);
    });
  }); */
  describe('Object movement', () => {
    it('should move a named object to a named destination', async () => {
      const grid = new Grid(3);
      // hardcode matrices to these //
      grid.setMatrix({ matrix: [[[1], [null], [null]], [[1], [null], [1]], [[null], [null], [1]]] });
      // initialize moving object
      const mover = { name: 'object', id: 0 };
      const destination = { name: 'destination', id: 1 };
      // place a moving object and destination at these points //
      grid.add(mover, { x: 0, y: 2 });
      grid.add(destination, { x: 2, y: 0 });
      // move object
      grid.moveToDestination([mover], 'destination');
      // do checks
      const expected = JSON.stringify([[[1], [null], [null]], [[1], [null], [1]], [[null, destination, mover], [null], [1]]]);
      expect(grid.getPosition('object').x).toEqual(grid.getPosition('destination').x);
      expect(grid.getPosition('object').y).toEqual(grid.getPosition('destination').y);
      expect(JSON.stringify(grid.matrix)).toEqual(expected);
    });
  });
});
