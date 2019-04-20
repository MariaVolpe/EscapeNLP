const NLAnalyzer = require('./NLAnalyzer');
const ActionExecuter = require('./ActionExecuter');

class NLInterpreter {
  /*
    EscapeNLP receives user input, analyzes it, and executes actions on the game state
    @params
    1) grid: wrapper object that contains BoardObjects and the grid that contains them
    2) agents: list of agents in the game
  */
  constructor(grid, agents, boardObjects) {
    this.grid = grid;
    this.agents = agents;
    this.actionQueue = []; // queue object that holds actions to be executed | MAY NOT NEED THIS IF TURN BASED
    this.nlp = new NLAnalyzer();
    this.actionExecuter = new ActionExecuter(grid, boardObjects);
  }

  /*
    Takes in user input, gets metadata of input, then enqueues actions to be executed
    @params: input = {user: username, inputStr: data}
  */
  executeInput(input) {
    const user = input.user; // the user who typed in the data
    const metaData = this.nlp.getActions(input.data); // data about the actions
    for (const data of metaData) this.doAction(user, data);
  }

  /* Tries action type with associated data, if valid returns true */
  doAction(user, data) {
    const classifications = data.classifications;
    for (const actionType of classifications) {
      const result = this.actionExecuter.executeAction(user, actionType, data);
      if (result) { return true; } // else keep trying other actions
    }
  }
}

module.exports = NLInterpreter;
