const Grid = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');
const ActionExecuter = require('../../nlp/ActionExecuter');

describe('ActionExecuter tests', () => {
  describe('Move', () => {
    it('Should move to destination object', async () => {
    });

    it('Should move in a direction', async () => {
    });
  });

  describe('Look', () => {
    it('Should look around', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      g.setMatrix({
        matrix: [
          [[weight], [door], [wall]],
          [[wall], [floor], [wall]],
          [[wall], [wall], [wall]],
        ],
      });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: [],
      }).filter(text => text !== '');
      const expected = JSON.stringify([
        'This door won\'t budge. There has to be a way to open it...',
        'A really heavy block. Maybe you can move it somewhere...']);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look at a particular object', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      g.setMatrix({
        matrix: [
          [[weight], [door], [wall]],
          [[wall], [floor], [wall]],
          [[wall], [wall], [wall]],
        ],
      });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: ['door'],
      }).filter(text => text !== '');
      const expected = JSON.stringify([
        'This door won\'t budge. There has to be a way to open it...']);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look around in a larger space', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      g.setMatrix({
        matrix: [
          [[weight], [wall], [wall]],
          [[wall], [door], [wall]],
          [[wall], [new Structure('floor', 6, null)], [wall]],
          [[wall], [floor], [wall]],
        ],
      });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: [],
      }).filter(text => text !== '');
      const expected = JSON.stringify([
        'This door won\'t budge. There has to be a way to open it...']);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    // Stretch goal test
    /* it('Should filter out objects whose view is obstructed', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      g.setMatrix({
        matrix: [
          [[weight], [wall], [wall]],
          [[wall], [door], [wall]],
          [[wall], [new Structure('floor', 6, null)], [wall]],
          [[wall], [floor], [wall]],
        ],
      });
    }); */
  });

  describe('Take', () => {

  });

  describe('Give', () => {

  });

  describe('Destroy', () => {

  });

  describe('Activate', () => {

  });

  describe('Deactivate', () => {

  });

  describe('Use', () => {

  });
});
