const DataFileManager = require('../data/DataFileManager');

class Tester {
  constructor() { this.lastTest = null; this.fm = new DataFileManager(); }

  printTest() {
    console.log(this.lastTest);
  }

  // Uses a batch of test data in a directory to evaluate error rate of model
  testNetworkByFile(path, classifier) {
    let errors = 0;
    let total = 0;
    const incorrect = [];
    const batch = this.fm.fileToObj(path);
    for (const label in batch) {
      for (const data of batch[label]) {
        const classification = classifier.getBestClassification(data);
        if (label != classification.label) {
          errors++;
          incorrect.push({
            attempt: classification.label,
            label,
            data,
          });
        }
        total++;
      }
    }
    this.lastTest = { errorRate: errors / total, incorrect };
    return this.lastTest;
  }

  // Uses batches of test data in a directory to evaluate error rate of model
  // test data path = './nlp/data/friends/test/verb-relations/';
  testNetworkByDirectory(path, classifier) {
    const batches = this.fm.getFilesInDir(path);
    let errors = 0;
    let total = 0;
    const incorrect = [];
    for (const batchFile of batches) {
      const batch = this.fm.fileToObj(path + batchFile);
      for (const label in batch) {
        for (const data of batch[label]) {
          const classification = classifier.getBestClassification(data);
          if (label != classification.label) {
            errors++;
            incorrect.push({
              attempt: classification.label,
              label,
              data,
            });
          }
          total++;
        }
      }
    }
    const errorPercent = errors / total;
    this.lastTest = { errorRate: errorPercent, incorrect };
    return errorPercent;
  }

  // Uses customBatch of test data passed by user to evaluate error rate of model
  testNetwork(customBatch, classifier) {
    let errors = 0;
    let total = 0;
    const incorrect = [];
    for (const label in customBatch) {
      for (const data of customBatch[label]) {
        const classification = classifier.getBestClassification(data);
        if (label != classification.label) {
          errors++;
          incorrect.push({
            attempt: classification.label,
            label,
            data,
          });
        }
        total++;
      }
    }
    this.lastTest = { errorRate: errors / total, incorrect };
    return this.lastTest;
  }
}
module.exports = Tester;
