
const isCoordinate = obj => !(obj.x === undefined && obj.y === undefined);

const matchRegex = (regex, input) => input.match(regex);

const convertToIndices = (coordinate) => {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  return {
    x: Number.parseInt(coordinate.substring(1)) - 1,
    y: alphabet.indexOf(coordinate[0]),
  };
};

const convertToFECoordinate = (obj) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const letter = alphabet[obj.y];
  const number = obj.x + 1;
  return letter.toString() + number.toString();
};

module.exports = {
  isCoordinate, matchRegex, convertToIndices, convertToFECoordinate,
};
