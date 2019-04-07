const DataFileManager = require('./DataFileManager');
class Tester {
  constructor() { this.lastTest = null; this.fm = new DataFileManager(); }

  printTest () {
    console.log(this.lastTest);
  }

  // Uses a batch of test data in a directory to evaluate error rate of model
  testNetworkByFile(path, classifier) {
    let errors = 0;
    let total = 0;
    let incorrect = [];
    let batch = this.fm.fileToObj(path);
    for (let label in batch)
      for (let data of batch[label]) {
        let classification = classifier.getBestClassification(data);
        if (label != classification.label) {
          errors++;
          incorrect.push({
            attempt: classification.label,
            label: label,
            data: data });
        }
        total++;
      }
    this.lastTest = { errorRate: errors/total, incorrect: incorrect };
    return this.lastTest;
  }

  // Uses batches of test data in a directory to evaluate error rate of model
  // test data path = './nlp/data/friends/test/verb-relations/';
  testNetworkByDirectory(path, classifier) {
    let batches = this.fm.getFilesInDir(path);
    let errors = 0;
    let total = 0;
    let incorrect = [];
    for (let batchFile of batches) {
      let batch = this.fm.fileToObj(path+batchFile);
      for (let label in batch)
        for (let data of batch[label]) {
          let classification = classifier.getBestClassification(data);
          if (label != classification.label) {
            errors++;
            incorrect.push({
              attempt: classification.label,
              label: label,
              data: data });
          }
          total++;
        }
    }
    this.lastTest = { errorRate: errors/total, incorrect: incorrect };
    return this.lastTest;
  }

  // Uses customBatch of test data passed by user to evaluate error rate of model
  testNetwork(customBatch, classifier) {
    let errors = 0;
    let total = 0;
    let incorrect = [];
    for (let label in customBatch)
      for (let data of customBatch[label]) {
        let classification = classifier.getBestClassification(data);
        if (label != classification.label) {
          errors++;
          incorrect.push({
            attempt: classification.label,
            label: label,
            data: data });
        }
        total++;
      }
    this.lastTest = { errorRate: errors/total, incorrect: incorrect };
    return this.lastTest;
  }
}
module.exports = Tester;
