const Grid = require('../../game-logic/Grid');
const Structure = require('../../game-logic/Structure');

describe('ActionExecuter tests', () => {
  describe('Move', () => {
    it('Should move to destination object', async () => {
    });

    it('Should move in a direction', async () => {
    });
  });

  describe('Look', () => {
    const grid = new Grid({ xDimension: 3, yDimension: 3 });
    grid.setMatrix({
      matrix: [
        [],
        [],
        [],
      ],
    });
    it('Should look around', async () => {

    });

    it('Should look at a particular object', async () => {
    });
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
