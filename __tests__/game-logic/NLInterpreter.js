const { Grid } = require('../../game-logic/Grid');
const NLInterpreter = require('../../nlp/NLInterpreter');
const Structure = require('../../game-logic/Structure');
const Agent = require('../../game-logic/Agent');
const Item = require('../../game-logic/Item');

describe('Natural Language (NLInterpreter) tests', () => {
  describe('Look', () => {
    it('Should look around', async () => {
      const floor = new Structure('floor', '1', null);
      const wall = new Structure('wall', '2', null);
      const door = new Structure('door', '3', null);
      const weight = new Structure('weight', '4', null);
      const agent = new Agent('James Bond');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'james bond',
        data: 'I look around',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          action: 'look',
          result: [
            { objectName: 'door', inspectText: 'It\'s a closed door.' },
            { objectName: 'weight', inspectText: 'The bottom of the block is locked into the floor switch now.' },
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
      const agent = new Agent('James Bond');
      const matrix = [
        [[weight], [door], [wall]],
        [[wall], [floor, agent], [wall]],
        [[wall], [wall], [wall]],
      ];
      const grid = new Grid(matrix);
      const interpreter = new NLInterpreter(grid);
      const input = {
        userName: 'james bond',
        data: 'I look at the door',
      };
      const results = interpreter.executeInput(input);
      const expected = [
        {
          action: 'look',
          result: [
            { objectName: 'door', inspectText: 'It\'s a closed door.' },
          ],
        },
      ];
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
    });
  });
});
