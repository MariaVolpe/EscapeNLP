const NLP = require('./NLP');
class EscapeNLP {
  /*
    EscapeNLP receives user input, analyzes it, and executes actions on the game state
    @params 
    1) grid: wrapper object that contains BoardObjects and the grid that contains them
    2) agents: list of agents in the game
  */
  constructor(grid, agents) {
    this.grid = grid;
    this.agents = agents;
    this.actionQueue = []; // queue object that holds actions to be executed
    this.nlp = new NLP();
  }

  /*
    Takes in user input, gets metadata of input, then enqueues actions to be executed
  */
  interpretInput(input) {
    const metaData = this.nlp.getActions(input);
    for (let data of metaData) {
      const classifications = data.classifications;
      let directObjects = data.directObjects;
      let indirectObjects = data.indirectObjects;
      let prepositions = data.prepositions;
      this.findAction(classifications, directObjects, indirectObjects, prepositions);
    }
  }

  findAction(classifications, directObjects, indirectObjects, prepositions) {
    for (let classification of classifications) {
      switch (classification.label) {
      case 'move':
        break;
      case 'look':
        break;
      case 'take':
        break;
      case 'give':
        break;
      case 'destroy':
        break;
      case 'attack':
        break;
      case 'place':
        break;
      case 'jump':
        break;
      case 'speak':
        break;
      case 'activate':
        break;
      case 'deactivate':
        break;
      case 'use':
        break;
      }
    }
  }

  enqueueAction() {

  }

}

module.exports = EscapeNLP;
