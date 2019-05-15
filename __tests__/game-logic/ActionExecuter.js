const { Grid } = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');
const Agent = require('../../game-logic/Agent');
const Item = require('../../game-logic/Item');
const ActionExecuter = require('../../nlp/ActionExecuter');
const { stripNames } = require('./util');

describe('ActionExecuter tests', () => {
  describe('Move', () => {
    it('Should move to destination object', async () => {
      const floor = new Structure('floor', '1', null);
      const door = new Structure('door', '3', null);
      const wall = new Structure('wall', '2', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const matrix = [
        [[wall], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, sonic], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [door], [wall]],
        [[wall], [floor, sonic], [wall]],
        [[wall], [floor], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeMove({
        userName: 'sonic',
        directObjects: ['door'],
        indirectObjects: [],
      });
      expect(JSON.stringify(stripNames(g.matrix))).toEqual(JSON.stringify(stripNames(expectedMatrix)));
    });

    it('Should move an object to a destination', async () => {
      const floor = new Structure('floor', '1', null);
      const door = new Structure('door', '3', null);
      const wall = new Structure('wall', '2', null);
      const weight = new Structure('weight', '4', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const startingMatrix = [
        [[wall], [floor, door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, weight], [wall]],
        [[wall], [floor, sonic], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [floor, door], [wall]],
        [[wall], [floor, weight], [wall]],
        [[wall], [floor, sonic], [wall]],
        [[wall], [floor], [wall]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeMove({
        userName: 'sonic',
        directObjects: ['weight'],
        indirectObjects: ['door'],
      });
      expect(JSON.stringify(stripNames(g.matrix))).toEqual(JSON.stringify(stripNames(expectedMatrix)));
    });

    it('Should move to a coordinate', async () => {
      const floor = new Structure('floor', '1', null);
      const door = new Structure('door', '3', null);
      const wall = new Structure('wall', '2', null);
      const weight = new Structure('weight', '4', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const startingMatrix = [
        [[floor], [floor, door], [floor]],
        [[floor], [floor], [floor]],
        [[floor], [floor], [floor]],
        [[floor], [floor, sonic], [floor]],
      ];
      const expectedMatrix = [
        [[floor, sonic], [floor, door], [floor]],
        [[floor], [floor], [floor]],
        [[floor], [floor], [floor]],
        [[floor], [floor], [floor]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeMove({
        userName: 'sonic',
        directObjects: ['a1'],
        indirectObjects: [],
      });
      expect(JSON.stringify(stripNames(g.matrix))).toEqual(JSON.stringify(stripNames(expectedMatrix)));
    });

    it('Should move an object to a coordinate', async () => {
      const floor = new Structure('floor', '1', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const startingMatrix = [
        [[floor], [floor, door], [floor]],
        [[floor], [floor], [floor]],
        [[floor], [floor, weight], [floor]],
        [[floor], [floor, sonic], [floor]],
      ];
      const expectedMatrix = [
        [[floor], [floor, door], [floor]],
        [[floor], [floor, weight], [floor]],
        [[floor], [floor, sonic], [floor]],
        [[floor], [floor], [floor]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeMove({
        userName: 'sonic',
        directObjects: ['weight'],
        indirectObjects: ['b1'],
      });
      expect(JSON.stringify(weight.position)).toEqual(JSON.stringify({ x: 1, y: 1 }));
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
      const agent = new Agent(0);
      agent.setName('James Bond');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        userName: 'james bond',
        directObjects: [],
        indirectObjects: [],
      }).result.map(e => e.text);
      const expected = JSON.stringify([door.inspectText, weight.inspectText]);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look at a particular object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const agent = new Agent(0);
      agent.setName('James Bond');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        userName: 'james bond',
        directObjects: ['door'],
        indirectObjects: [],
      }).result.map(e => e.text);
      const expected = JSON.stringify([door.inspectText]);
      expect(JSON.stringify(lookResponse)).toEqual(expected);
    });
    it('Should look around in a larger space', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const agent = new Agent(0);
      agent.setName('James Bond');
      const matrix = [
        [[weight], [wall], [wall]],
        [[wall], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
      ];
      const g = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      const lookResponse = actionExecuter.executeLook({
        userName: 'james bond',
        directObjects: [],
        indirectObjects: [],
      }).result.map(e => e.text);
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
      const item = new Item('key', '5', null);
      const agent = new Agent(0);
      agent.setName('Agent');
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
        userName: 'agent',
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
    it('Should NOT take an structure off the grid', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const item = new Structure('pot', '5', null);
      const agent = new Agent(0);
      agent.setName('Agent');
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeTake({
        userName: 'agent',
        directObjects: ['key'],
        indirectObjects: [],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedInventory = JSON.stringify([]);
      const actualInventory = JSON.stringify(agent.getAllItems().map(e => e.name));
      expect(actualInventory).toEqual(expectedInventory);
    });
    it('Should move to take an item off the grid', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const item = new Item('key', '5', null);
      const agent = new Agent(0);
      agent.setName('Agent');
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
        userName: 'agent',
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
      const key = new Item('key', '6', null);
      const dora = new Agent(0);
      const swiper = new Agent(-1);
      dora.setName('Dora');
      swiper.setName('Swiper');
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
        userName: 'swiper',
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
      const item = new Item('key', '6', null);
      const dora = new Agent(0);
      const swiper = new Agent(-1);
      dora.setName('Dora');
      swiper.setName('Swiper');
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
        userName: 'swiper',
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
      const item = new Item('key', '6', null);
      const dora = new Agent(0);
      const swiper = new Agent(-1);
      dora.setName('Dora');
      swiper.setName('Swiper');
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
        userName: 'swiper',
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
      const item = new Item('key', '6', null);
      const dora = new Agent(0);
      const swiper = new Agent(-1);
      dora.setName('Dora');
      swiper.setName('Swiper');
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
        userName: 'swiper',
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
    it('Should place an item already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const impression = new Structure('impression', '3', null);
      const idol = new Item('key', '6', null);
      idol.name = 'idol';
      const indianaJones = new Agent(0);
      indianaJones.setName('Indiana Jones');
      indianaJones.takeItem(idol);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression, idol], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executePlace({
        userName: 'indiana jones',
        directObjects: ['idol'],
        indirectObjects: ['impression'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify([]);
      const actualAgentInventory = JSON.stringify(indianaJones.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
    });

    it('Should move to place an item already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const impression = new Structure('impression', '3', null);
      const indianaJones = new Agent(0);
      indianaJones.setName('Indiana Jones');
      const idol = new Item('key', '6', null);
      idol.setName('idol');
      indianaJones.takeItem(idol);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, indianaJones], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression, idol], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executePlace({
        userName: 'indiana jones',
        directObjects: ['idol'],
        indirectObjects: ['impression'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify([]);
      const actualAgentInventory = JSON.stringify(indianaJones.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
    });

    it('Should move to place an item not already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const impression = new Structure('impression', '3', null);
      const indianaJones = new Agent(0);
      indianaJones.setName('Indiana Jones');
      const idol = new Item('key', '6', null);
      idol.setName('idol');
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression], [wall]],
        [[floor, idol], [floor], [wall]],
        [[wall], [floor, indianaJones], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression, idol], [wall]],
        [[floor], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executePlace({
        userName: 'indiana jones',
        directObjects: ['idol'],
        indirectObjects: ['impression'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      // Check that the item was added to the user inventory
      const expectedAgentInventory = JSON.stringify([]);
      const actualAgentInventory = JSON.stringify(indianaJones.getAllItems().map(e => e.name));
      expect(actualAgentInventory).toEqual(expectedAgentInventory);
    });

    // REVISIT THIS TEST WHEN MOVE METHOD TESTS ARE WRITTEN
    /* it('Should place an item not possessable somewhere else on the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const impression = new Structure('impression', '3', null);
      const indianaJones = new Agent('Indiana Jones');
      const weight = new Structure('weight', '6', null);
      weight.name = 'weight';
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression], [wall]],
        [[floor, weight], [floor], [wall]],
        [[wall], [floor, indianaJones], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression, weight], [wall]],
        [[floor], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];

      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executePlace({
        user: indianaJones,
        directObjects: ['weight'],
        indirectObjects: ['impression'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was placed correctly
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
    }); */
  });

  describe('Destroy', () => {
    it('Should destroy an object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const pot = new Structure('pot', '3', null);
      const agent = new Agent(0);
      agent.setName('CrashBandicoot');
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, pot], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeDestroy({
        userName: 'crashbandicoot',
        directObjects: ['pot'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      expect(pot.activated).toEqual(true);
    });
    it('Should not destroy an object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const agent = new Agent(0);
      agent.setName('CrashBandicoot');
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
      ];
      const expectedMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [floor], [wall]],
      ];
      const g = new Grid(startingMatrix);
      const actionExecuter = new ActionExecuter({ grid: g });
      actionExecuter.executeDestroy({
        userName: 'crashbandicoot',
        directObjects: ['door'],
      });
      const actualMatrix = stripNames(g.matrix);
      const expectedNamesMatrix = stripNames(expectedMatrix);
      // Check that the item was removed from the matrix
      expect(JSON.stringify(actualMatrix)).toEqual(JSON.stringify(expectedNamesMatrix));
      expect(door.activated).toEqual(false);
    });
  });

  describe('Activate', () => {
    it('Should activate the object and move the player', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const player = new Agent(0);
      player.setName('Player');
      const initMatrix = [
        [[floor], [floor], [floor]],
        [[player], [floor], [door]],
        [[floor], [floor], [floor]],
      ];
      const finalMatrix = [
        [[floor], [floor], [floor]],
        [[], [floor, player], [door]],
        [[floor], [floor], [floor]],
      ];

      const grid = new Grid(initMatrix);
      const actionExecuter = new ActionExecuter({ grid });
      const activateResponse = actionExecuter.executeActivate({
        userName: 'player',
        directObjects: ['door'],
      });

      expect(door.activated).toEqual(true);
      expect(JSON.stringify(stripNames(grid.matrix))).toEqual(JSON.stringify(stripNames(finalMatrix)));
    });

    it('Should NOT activate the object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const player = new Agent(0);
      player.setName('Player');
      const matrix = [
        [[floor], [wall], [floor]],
        [[player], [wall], [door]],
        [[floor], [wall], [floor]],
      ];

      const grid = new Grid(matrix);
      const actionExecuter = new ActionExecuter({ grid });
      const activateResponse = actionExecuter.executeActivate({
        userName: 'player',
        directObjects: ['door'],
      });
      expect(door.activated).toEqual(false);
      expect(JSON.stringify(stripNames(grid.matrix))).toEqual(JSON.stringify(stripNames(matrix)));
    });
  });

  describe('Deactivate', () => {

  });

  describe('Use', () => {

  });
});
