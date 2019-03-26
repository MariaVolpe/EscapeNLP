const { NlpManager, NlpClassifier, NerManager } = require('node-nlp');
const compromise = require('compromise');
const synonyms = require('synonyms');
const DataLabeler = require('./DataLabeler');
const DataFileManager = require('./DataFileManager');

class NLP {
  constructor(){
    this.fs = new DataFileManager();
    this.nlpManager = new NlpManager();
    this.actionClassifier = new NlpClassifier({ language: 'en' });
    this.objectClassifier = new NlpClassifier({ language: 'en' });
    const queries = this.fs.readQueryFile('./nlp/data/verb_queries.json');

    this.labeler = new DataLabeler(queries, true);
    this.labeler.collectUses(100, true);
    //this.fs.readRecord('./nlp/data/friends/record.json');
    //this.fs.writeBatchJSON('./nlp/data/friends/object-relations', {});
  }
  
  async trainNetwork() {
    // TODO set up training batches
    await this.actionClassifier.train();
  }

  saveNetworks() {
    this.nlpManager.save();
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
