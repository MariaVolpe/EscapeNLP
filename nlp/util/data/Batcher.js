const compromise = require('compromise');
const DataFileManager = require('./DataFileManager');

class Batcher {
  constructor({
    keys, maxSize, batchPath, initialData = null,
  }) {
    this.keys = Array.from(keys);
    this.fileManager = new DataFileManager();
    this.verbRelations = new Map();
    if (initialData) { this.verbRelations = this.stripRelations(initialData); } else keys.map(k => this.verbRelations.set(k, new Set()));
    this.objectRelations = new Map();
    this.batchSize = { verbs: 0, objects: 0 };
    this.batchPath = batchPath;
    this.maxSize = maxSize;
    this.addTenses();
  }

  addRelations({
    verb, match, i, l,
  }) {
    this.addObjectRelation(match);
    this.verbRelations.get(verb).add(match);
    this.batchSize.verbs++;
    this.writeBatch({ i, l });
    console.log(`${verb} <- matched: ${match}`);
  }

  addObjectRelation(match) {
    const nouns = compromise(match).match('#Noun').out('array');
    const noun = nouns[nouns.length - 1]; // the last noun is currently the object
    if (!this.objectRelations.has(noun)) this.objectRelations.set(noun, new Set([match]));
    else this.objectRelations.get(noun).add(match);
    this.batchSize.objects++;
  }

  writeBatch({ i, l }) {
    if (this.batchSize.objects >= this.maxSize) {
      this.batchSize.objects = 0;
      this.fileManager.writeRecord('./nlp/data/friends/record.json', { s1: i, s2: l });
      this.fileManager.writeBatchJSON(`${this.batchPath}object-relations`,
        this.objectRelations);
      this.objectRelations = new Map();
    }
    if (this.batchSize.verbs >= this.maxSize) {
      this.batchSize.verbs = 0;
      this.fileManager.writeRecord('./nlp/data/friends/record.json', { s1: i, s2: l });
      this.fileManager.writeBatchJSON(`${this.batchPath}verb-relations`, this.verbRelations);
      this.keys.map(k => this.verbRelations.set(k, new Set()));
    }
  }

  // Conjugate all words and add their other tenses into relations
  addTenses() {
    for (const [key, value] of this.verbRelations) {
      const tenses = [];
      for (const v of value) {
        tenses.push(compromise(v).sentences().toPastTense().out('text'));
        tenses.push(compromise(v).sentences().toPresentTense().out('text'));
        tenses.push(compromise(v).sentences().toFutureTense().out('text'));
        const conjugation = compromise(v).verbs().conjugate();
        if (!conjugation.length) continue;
        tenses.push(conjugation[0].gerund);
        tenses.push(conjugation[0].infinitive);
      }
      tenses.map((tense) => {
        if (tense) this.verbRelations.get(key).add(tense);
      });
    }
  }

  // strips this.verbRelations to text to text object relations //
  stripRelations(relations) {
    const data = new Map();
    for (const [key, values] of relations) data.set(key, new Set(Array.from(values)));
    return data;
  }
}

module.exports = Batcher;
