module.exports = (gameContainer) => {
  const { data } = gameContainer.getAllSessions();
  return data;
};
