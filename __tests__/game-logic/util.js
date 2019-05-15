const { matchRegex, convertToIndices } = require('../../game-logic/util');
// File for test utility functions to clean up test code //

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

describe('Regexp coordinate parsing', () => {
  it('Should  a coordiate from a string', async () => {
    const input = 'a20';
    expect(matchRegex(/(^[a-z])([0-9])?([0-9])$/g, input).join('')).toEqual('a20');
    const other = 'a2';
    expect(matchRegex(/(^[a-z])([0-9])?([0-9])$/g, other).join('')).toEqual('a2');
  });
});

describe('Converting front-end coordinates', () => {
  it('should convert a front-end coordiante to indices', async () => {
    const input = 'a20';
    const result = convertToIndices(input);
    const expected = { x: 19, y: 0 };
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });
});

module.exports = { stripNames };
