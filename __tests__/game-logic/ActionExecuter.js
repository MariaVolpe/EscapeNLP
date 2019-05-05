const Grid = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');
const Agent = require('../../game-logic/Agent');
const Item = require('../../game-logic/Item');
const ActionExecuter = require('../../nlp/ActionExecuter');

const stripNames = (matrix) => {
  const namesMatrix = Array.from({ length: matrix.length },
    () => Array.from({ length: matrix[0].length },
      () => Array.from({ length: 0 },
        () => '')));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      namesMatrix.push(...matrix[i][j].map(e => e.name));
    }
  } return namesMatrix;
};

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
    it('Should take an item off the grid', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent('4', g);
      const item = new Item('key', '5', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      g.setMatrix({
        matrix: startingMatrix,
      });
      actionExecuter.executeTake({
        user: agent,
        directObjects: ['key'],
        indirectObjects: [],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedInventory = JSON.stringify(['key']);
      const actualInventory = JSON.stringify(agent.getAllItems().map(e => e.name));
      expect(actualInventory).toEqual(expectedInventory);
    });
    it('Should move to take an item off the grid', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent('4', g);
      const item = new Item('key', '5', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor], [wall]],
      ];
      g.setMatrix({
        matrix: startingMatrix,
      });
      actionExecuter.executeTake({
        user: agent,
        directObjects: ['key'],
        indirectObjects: [],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedInventory = JSON.stringify(['key']);
      const actualInventory = JSON.stringify(agent.getAllItems().map(e => e.name));
      expect(actualInventory).toEqual(expectedInventory);
    });

    it('Should steal an item from another agent', async () => {
      const g = new Grid({ xDimension: 3, yDimension: 3 });
      const actionExecuter = new ActionExecuter({ grid: g });
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent('Swiper', g);
      const otherAgent = new Agent('Dora', g);
      const item = new Item('key', '6', null);
      otherAgent.getItem(item);

      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, otherAgent], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, otherAgent], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
      ];
      g.setMatrix({
        matrix: startingMatrix,
      });
      actionExecuter.executeTake({
        user: agent,
        directObjects: ['key'],
        indirectObjects: ['Dora'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify(['key']);
      const actualAgentInventory = JSON.stringify(agent.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
      const expectedOtherAgentInventory = JSON.stringify([]);
      const actualOtherAgentInventory = JSON.stringify(otherAgent.getAllItems().map(e => e.name));
      expect(actualOtherAgentInventory).toEqual(expectedOtherAgentInventory);
    });
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
