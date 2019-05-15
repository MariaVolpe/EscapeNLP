const { NlpManager, NlpClassifier, NerManager } = require('node-nlp');
const compromise = require('compromise');
const DataLabeler = require('./util/data/DataLabeler');
const DataFileManager = require('./util/data/DataFileManager');
const Chunker = require('./util/nlp/Chunker');
const Tester = require('./util/nlp/Tester');

class NLAnalyzer {
  constructor() {
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
    const tests = {
      move: ['I move to the door'],
      place: ['I throw the key to foo'],
      give: ['I pass the key to foo'],
      activate: ['I turn on the machine'],
      deactivate: ['I turn off the machine'],
      look: ['I read the book for my son and put him to bed after'],
      take: ['I grab the stone and set it down on the platform'],
      destroy: ['I break the wall'],
      attack: ['I slash at the dragon', 'I attack the dragon and zombies with my sword'],
      jump: ['I leap over the edge and grab the trinkets then i assemble the artifact'],
      speak: ['I tell the dragon the answer and attack him after'],
    };
    const accuracy = this.tester.testNetwork(tests, this.actionClassifier);
    this.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/', this.actionClassifier);
    this.tester.printTest();
    this.getActions('I give the key and bag to fred');
    this.getActions('I move to the door');
    this.getActions('I move the stone to the door');
  }

  getActions(input) {
    const chunks = this.chunker.chunkInput(input);
    const actionObjects = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const classifications = this.actionClassifier.getClassifications(chunk);
      const ret = this.chunker.getObjectsOfSentence(chunk);
      const directObjects = ret.directObjs;
      const indirectObjects = ret.indirectObjs;
      const adverb = compromise(chunk).match('#Adverb').out('array');
      const prepositions = compromise(chunk).match('#Preposition').out('array');
      actionObjects.push({
        classifications,
        adverb,
        prepositions,
        directObjects,
        indirectObjects,
      });
    }
    return actionObjects;
  }

  // Takes a path to a DIRECTORY ex: './folder/' where training data can be found
  async trainNetwork(path) {
    // TODO grab verb and object training batches and sequentially run train
    const batches = this.fs.getFilesInDir(path);
    for (const batchFile of batches) {
      const batch = this.fs.fileToObj(path + batchFile);
      for (const key in batch) for (const val of batch[key]) this.actionClassifier.add(val, key);
      await this.actionClassifier.train(); // train by each batch
      this.actionClassifier.save();
    }
  }

  saveNetworks() {
    this.nlpManager.save();
    this.actionClassifier.save();
  }
}

module.exports = NLAnalyzer;
