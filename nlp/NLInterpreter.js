const NLAnalyzer = require('./NLAnalyzer');
const ActionExecuter = require('./ActionExecuter');

const flattenOutput = (output) => {
  const flatOutput = [];
  return _flattenOutput(flatOutput, output);
};

const _flattenOutput = (flatOutput, output) => {
  for (let i = 0; i < output.length; i++) {
    const o = output[i];
    if (o.action) { // if start of new action
      _flattenOutput(flatOutput, o.result);
      flatOutput.push(o);
    }
  }
}

class NLInterpreter {
  /*
    EscapeNLP receives user input, analyzes it, and executes actions on the game state
    @params
    1) grid: wrapper object that contains BoardObjects and the grid that contains them
    2) agents: list of agents in the game
  */
  constructor(grid, puzzleManager) {
    this.grid = grid;
    this.actionQueue = []; // queue object that holds actions to be executed | MAY NOT NEED THIS IF TURN BASED
    this.nlp = new NLAnalyzer();
    this.actionExecuter = new ActionExecuter({ grid: grid });
    this.puzzleManager = puzzleManager;
  }

  /*
    Takes in user input, gets metadata of input, then enqueues actions to be executed
    @params: input = {user: username, inputStr: data}
  */
  executeInput(input) {
    const userName = input.userName.toLowerCase(); // the user who typed in the data
    const metaData = this.nlp.getActions(input.data); // data about the actions
    let results = [];
    for (let data of metaData) data.userName = userName; // add user field to metaData
    for (const data of metaData) { 
      results.push(this.doAction(data));
      results = results.reduce((acc, val) => acc.concat(val), []);
    }
    return results;
  }

  /* Tries action type with associated data, if valid returns true */
  doAction(data) {
    const classifications = data.classifications;
    for (const classification of classifications) {
      const actionType = classification.label;
      const result = this.actionExecuter.executeAction(actionType, data);
      const itemResults = this.puzzleManager.evaluateAllPuzzles(data.userName);
      if (result) { 
        console.log("itemResults", itemResults);
        result.result = result.result.concat(itemResults);
        console.log("full result: ", result);
        return result; 
      } // else keep trying other actions
    }
  }
}

module.exports = NLInterpreter;
