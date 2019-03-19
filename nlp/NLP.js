const { NlpManager, NlpClassifier, NerManager } = require('node-nlp');
const compromise = require('compromise');
const synonyms = require('synonyms');
const DataLabeler = require('./DataLabeler');
const DataFileManager = require('./DataFileManager');

class NLP {
  constructor(){
    this.fs = new DataFileManager();
    this.actionClassifier = new NlpClassifier({ language: 'en' });
    this.objectClassifier = new NlpClassifier({ language: 'en' });
    const queries = this.fs.readQueryFile('./nlp/data/verb_queries.json');

    this.labeler = new DataLabeler(queries, true);
    //this.labeler.collectUses();
  }
  
  async train() {
    await this.actionClassifier.train();
  }

  classify(input) {
    return { // just returns the highest probability action/object for now
      actions: this.getAction(input),
      objects: this.getObject(input),
    };
  }

  getAction(input) {
    return this.actionClassifier.getClassifications(input);
  }

  getObjects(input) {
    return this.objectClassifier.getClassifications(input);
  }

  
}

module.exports = NLP;
