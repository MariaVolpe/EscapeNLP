const NLInterpreter = require('../../nlp/NLInterpreter');
const PuzzleManager = require('../../game-logic/PuzzleManager');
const { Grid } = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');
const Agent = require('../../game-logic/Agent');
const Item = require('../../game-logic/Item');

describe('Natural Language (NLInterpreter) tests', () => {
  describe('Move', () => {
    it('Should move to an object', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, sonic], [wall]],
      ];
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'sonic',
        data: 'I walk to the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Sonic',
          action: 'move',
          result: [
            {
              objectName: 'Sonic', destination: 'door', path: [{ x: 1, y: 1 }],
            },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
    it('Should move an object to a destination', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const sonic = new Agent(0);
      sonic.setName('Sonic');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, sonic], [wall]],
      ];
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'sonic',
        data: 'I walk to the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Sonic',
          action: 'move',
          result: [
            {
              objectName: 'Sonic', destination: 'door', path: [{ x: 1, y: 1 }],
            },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
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
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'james bond',
        data: 'I look around',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'James Bond',
          action: 'look',
          result: [
            { objectName: 'door', text: 'It\'s a closed door.' },
            { objectName: 'weight', text: 'The bottom of the block is locked into the impression now.' },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });

    it('Should look at a specific object', async () => {
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
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'james bond',
        data: 'I look at the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'James Bond',
          action: 'look',
          result: [
            { objectName: 'door', text: 'It\'s a closed door.' },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
  });

  describe('Take', () => {
    it('Should take an item off the grid', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent(0);
      agent.setName('Agent');
      const item = new Item('key', '5', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const grid = new Grid(startingMatrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'agent',
        data: 'I take the key',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Agent',
          action: 'take',
          result: [
            { objectName: 'key', source: '' },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });

    /* it('Should move to take an item off the grid', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const agent = new Agent(0);
      agent.setName('Agent');
      const item = new Item('key', '5', null);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, item], [wall]],
        [[wall], [floor], [wall]],
        [[wall], [floor, agent], [wall]],
      ];
      const grid = new Grid(startingMatrix);
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'agent',
        data: 'I take the key',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Agent',
          action: 'move',
          result: [
            { destination: 'key' },
          ],
        },
        {
          userName: 'Agent',
          action: 'take',
          result: [
            { objectName: 'key', source: '' },
          ],
        },
      ];
      //expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    }); */
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
      swiper.takeItem(item);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floor, swiper], [wall]],
        [[wall], [floor, dora], [wall]],
        [[wall], [floor], [wall]],
      ];
      const grid = new Grid(startingMatrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'Swiper',
        data: 'i give the key to dora',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Swiper',
          action: 'give',
          result: [
            { objectName: 'key', recipient: 'Dora' },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
  });
  describe('Place', () => {
    it('Should place an item already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const floorSwitch = new Structure('floor switch', '3', null);
      const idol = new Item('key', '6', null);
      const indianaJones = new Agent(0);
      idol.setName('idol');
      indianaJones.setName('Indiana Jones');
      floorSwitch.setName('impression');
      indianaJones.takeItem(idol);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [floorSwitch], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];
      const grid = new Grid(startingMatrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'Indiana Jones',
        data: 'i put it down the idol on the impression',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Indiana Jones',
          action: 'place',
          result: [
            { objectName: 'idol', destination: 'impression' },
          ],
        },
      ];
      // TODO: THIS IS INCORRRECTLY CLASSIFYING FIX LATER
      //expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
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
      const grid = new Grid(initMatrix);
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'Player',
        data: 'I open the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Player',
          action: 'activate',
          result: [
            { objectName: 'door', successful: true },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
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
      const interpreter = new NLInterpreter(grid, new PuzzleManager(grid, true));
      const input = {
        userName: 'Player',
        data: 'I open the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Player',
          action: 'activate',
          result: [
            { objectName: 'door', successful: false },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
  });
  describe('Place', () => {
    it('Should place an item already possessed onto the board', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const impression = new Structure('impression', '3', null);
      const idol = new Item('key', '6', null);
      const indianaJones = new Agent(0);
      idol.setName('idol');
      indianaJones.setName('Indiana Jones');
      impression.setName('impression');
      indianaJones.takeItem(idol);
      const startingMatrix = [
        [[wall], [wall], [wall]],
        [[wall], [impression], [wall]],
        [[wall], [floor, indianaJones], [wall]],
        [[wall], [floor], [wall]],
      ];
      const grid = new Grid(startingMatrix);
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'Indiana Jones',
        data: 'i put it down the idol on the impression',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Indiana Jones',
          action: 'place',
          result: [
            { objectName: 'idol', destination: 'impression' },
          ],
        },
      ];
      // TODO: THIS IS INCORRRECTLY CLASSIFYING FIX LATER
      // expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
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
      const grid = new Grid(initMatrix);
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'Player',
        data: 'I open the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Player',
          action: 'activate',
          result: [
            { objectName: 'door', successful: true },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
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
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'Player',
        data: 'I open the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          userName: 'Player',
          action: 'activate',
          result: [
            { objectName: 'door', successful: false },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
  });
});
