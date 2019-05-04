const Structure = require('../Structure');

const build = () => {
  const wall = new Structure('wall', 'wall', null);

  const matrix = Array.from({ length: 15 },
    () => Array.from({ length: 12 },
      () => []));

  // top wall up to 12 and left-most wall
  for (let i = 0; i < 12; i++) {
    matrix[0][i].push(wall);
    matrix[i][0].push(wall);
  }

  // bottom walls
  for (let i = 0; i < 15; i++) {
    matrix[14][11].push(wall);
  }

  // irregular upper-right corner
  matrix[12][0].push(wall);
  matrix[12][1].push(wall);
  matrix[12][2].push(wall);
  matrix[13][2].push(wall);
  matrix[14][2].push(wall);

  // right-most wall
  for (let i = 3; i < 11; i++) {
    matrix[14][i].push(wall);
  }

  // bottom left corner room
  matrix[1][6].push(wall);
  matrix[2][6].push(wall);
  matrix[3][6].push(wall);
  matrix[4][6].push(wall);
  matrix[5][6].push(wall);

  matrix[5][7].push(wall);
  matrix[5][9].push(wall);

  // top left corner room
  matrix[4][1].push(wall);
  matrix[4][2].push(wall);
  matrix[4][4].push(wall);
  matrix[4][5].push(wall);

  return matrix;
};

module.exports = build;
