const { NlpManager, NlpClassifier, NerManager } = require('node-nlp');
const compromise = require('compromise');
const DataLabeler = require('./DataLabeler');
const DataFileManager = require('./DataFileManager');
const Chunker = require('./Chunker');
const Tester = require('./Tester');

class NLP {
  constructor(){
    this.fs = new DataFileManager();
    this.actionClassifier = new NlpClassifier({ language: 'en' });
    const queries = this.fs.readQueryFile('./nlp/data/verb_queries.json');
    this.dataLabeler = new DataLabeler(queries, true);
    this.chunker = new Chunker();
    this.tester = new Tester();
    this.actionClassifier.load('./nlp/classifier-model.nlp');
  }

  runTests() {
    this.getActions('Running quickly, I move away from the door');
    let tests = {
      'place': ['I throw the key to foo'],
      'give': ['I pass the key to foo'],
      'activate': ['I turn on the machine'],
      'deactivate': ['I turn off the machine'],
      'look': ['I read the book for my son and put him to bed after'],
      'take': ['I grab the stone and set it down on the platform'],
      'destroy': ['I break the wall'],
      'attack': ['I slash at the dragon', 'I attack the dragon and zombies with my sword'],
      'jump': ['I leap over the edge and grab the trinkets then i assemble the artifact'],
      'speak': ['I tell the dragon the answer and attack him after'] };
    let accuracy = this.tester.testNetwork(tests, this.actionClassifier);
    this.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/', this.actionClassifier);
    this.tester.printTest();
    this.getActions('I give the key and bag to fred');
    for (let key in tests)
      for (let t of tests[key])
        this.getActions(t);
  }

  getActions (input) {
    let chunks = this.chunker.chunkInput(input);
    let actionObjects = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let classifications = this.actionClassifier.getClassifications(chunk);
      let ret = this.chunker.getObjectsOfSentence(chunk);
      let directObjects = ret.directObjs;
      let indirectObjects = ret.indirectObjs;
      let adverb = compromise(chunk).match('#Adverb').out('array');
      let prepositions = compromise(chunk).match('#Preposition').out('array');
      actionObjects.push({
        classifications,
        adverb,
        prepositions,
        directObjects,
        indirectObjects });
    }
    return actionObjects;
  }

  async trainNetwork() {
    // TODO grab verb and object training batches and sequentially run train 
    let path = './nlp/data/friends/training/verb-relations/';
    let batches = this.fs.getFilesInDir(path);
    for (let batchFile of batches) {
      let batch = this.fs.fileToObj(path+batchFile);
      for (let key in batch)
        for (let val of batch[key])
          this.actionClassifier.add(val, key);
      await this.actionClassifier.train(); // train by each batch
      this.actionClassifier.save();
    }
  }

  saveNetworks() {
    this.nlpManager.save();
    this.actionClassifier.save();
  }

}

module.exports = NLP;
