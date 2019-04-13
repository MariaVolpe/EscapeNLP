const Grid = require('../../game-logic/Grid');

describe('Grid functionality tests', () => {
  describe('Object movement', () => {
    it('should move a named object to a named destination', async () => {
      const grid = new Grid(0);
      // hardcode matrices to these //
      grid.setMatrix({ matrix: [[1, null, null], [1, null, 1], [null, null, 1]] });
      grid.setDefaultMatrix({ matrix: [[1, null, null], [1, null, 1], [null, null, 1]] });
      // initialize moving object
      const object = { name: 'object', id: 0 };
      // place a moving object and destination at these points //
      grid.add(object, { x: 0, y: 2 });
      grid.add({ name: 'destination', id: 1 }, { x: 2, y: 0 });
      // move object
      grid.moveToDestination('object', 'destination');
      // do checks
      const expected = JSON.stringify([[1, null, null], [1, null, 1], [object, null, 1]]);
      expect(grid.getPosition('object').x).toEqual(grid.getPosition('destination').x);
      expect(grid.getPosition('object').y).toEqual(grid.getPosition('destination').y);
      expect(JSON.stringify(grid.matrix)).toEqual(expected);
    });
  });
});
