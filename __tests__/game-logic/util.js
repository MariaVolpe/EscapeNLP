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

// this needs to be here to stop Jest from whining that theres no test in this file
describe('', () => {
  it('', async () => {
  });
});

module.exports = { stripNames };
