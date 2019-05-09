const { Grid } = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');
const Agent = require('../../game-logic/Agent');
const Item = require('../../game-logic/Item');
const ActionExecuter = require('../../nlp/ActionExecuter');
const { stripNames } = require('./util');

describe('ActionExecuter tests', () => {
  describe('Move', () => {
    it('Should move to destination object', async () => {
    });

    it('Should move in a direction', async () => {
    });
  });

  describe('Look', () => {
    it('Should look around', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [wall], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: [],
      }).filter(text => text !== '');
      const expected = JSON.stringify([door.inspectText, weight.inspectText]);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look at a particular object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [wall], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: ['door'],
      }).filter(text => text !== '');
      const expected = JSON.stringify([door.inspectText]);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look around in a larger space', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const matrix = [
        [[weight], [wall], [wall]],
        [[wall], [door], [wall]],
        [[wall], [new Structure('floor', 6, null)], [wall]],
        [[wall], [floor], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        user: floor,
        directObjects: [],
      }).filter(text => text !== '');
      const expected = JSON.stringify([door.inspectText]);
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
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent('Agent');
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
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
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
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent('Agent');
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
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
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
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const swiper = new Agent('Swiper');
      const dora = new Agent('Dora');
      const key = new Item('key', '6', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, dora], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, swiper], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, dora], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      dora.takeItem(key);
      actionExecuter.executeTake({
        user: swiper,
        directObjects: ['key'],
        indirectObjects: ['dora'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify(['key']);
      const actualAgentInventory = JSON.stringify(swiper.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
      const expectedOtherAgentInventory = JSON.stringify([]);
      const actualOtherAgentInventory = JSON.stringify(dora.getAllItems().map(e => e.name));
      expect(actualOtherAgentInventory).toEqual(expectedOtherAgentInventory);
    });
  });

  describe('Give', () => {
    it('Should give an item already possessed to another agent', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const swiper = new Agent('Swiper');
      const dora = new Agent('Dora');
      const item = new Item('key', '6', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor, dora], [wall]],
        [[wall], [floor], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor, dora], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      swiper.takeItem(item);
      actionExecuter.executeGive({
        user: swiper,
        directObjects: ['key'],
        indirectObjects: ['dora'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify(['key']);
      const actualAgentInventory = JSON.stringify(dora.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
      const expectedOtherAgentInventory = JSON.stringify([]);
      const actualOtherAgentInventory = JSON.stringify(swiper.getAllItems().map(e => e.name));
      expect(actualOtherAgentInventory).toEqual(expectedOtherAgentInventory);
    });

    it('Should move to give an item already possessed to another agent', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const swiper = new Agent('Swiper');
      const dora = new Agent('Dora');
      const item = new Item('key', '6', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, dora], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor, dora], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      swiper.takeItem(item);
      actionExecuter.executeGive({
        user: swiper,
        directObjects: ['key'],
        indirectObjects: ['dora'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify(['key']);
      const actualAgentInventory = JSON.stringify(dora.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
      const expectedOtherAgentInventory = JSON.stringify([]);
      const actualOtherAgentInventory = JSON.stringify(swiper.getAllItems().map(e => e.name));
      expect(actualOtherAgentInventory).toEqual(expectedOtherAgentInventory);
    });

    it('Should move to pick up an item and give to another agent', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const swiper = new Agent('Swiper');
      const dora = new Agent('Dora');
      const item = new Item('key', '6', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[floor, item], [floor], [wall]],
        [[wall], [floor, dora], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor], [wall]],
        [[floor], [floor, swiper], [wall]],
        [[wall], [floor, dora], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeGive({
        user: swiper,
        directObjects: ['key'],
        indirectObjects: ['dora'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify(['key']);
      const actualAgentInventory = JSON.stringify(dora.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
      const expectedOtherAgentInventory = JSON.stringify([]);
      const actualOtherAgentInventory = JSON.stringify(swiper.getAllItems().map(e => e.name));
      expect(actualOtherAgentInventory).toEqual(expectedOtherAgentInventory);
    });
  });

  describe('Place', () => {
    /*it('Should place an item already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const floorSwitch = new Structure('floor_switch', '3', null);
      const indianaJones = new Agent('Indiana Jones');
      const idol = new Item('Idol', '6', null);
      indianaJones.takeItem(idol);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floorSwitch], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floorSwitch, idol], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executePlace({
        user: indianaJones,
        directObjects: ['idol'],
        indirectObjects: ['floor_switch'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify([]);
      const actualAgentInventory = JSON.stringify(indianaJones.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
    });*/
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
