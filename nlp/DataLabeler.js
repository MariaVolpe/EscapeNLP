const { SimilarSearch } = require('node-nlp');
const compromise = require('compromise');
const wnjs = require('wordnetjs');
const wn = require('wordnet');
const corpus = require('nlp-corpus');
const { PythonShell } = require('python-shell');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const DataFileManager = require('./DataFileManager');
const VerbRegex  = require('./Regex');
const Batcher = require('./Batcher');

/*

  Give
  Use - wrapper function for item use
  Place/replaces throw
  Take
  Attack
  Move
  Speak
  Activate
  Deactivate
  Look
  otherwise no result

  Labeler:
    Takes in an array of words, each word and its synonyms will be searched for in the
    corpus. Sentences containing these words will be shown to the user, if sentence contains
    the word used with the intended meaning, then it will be approved by the user and
    added to the wordUses map.
    wordUses: an object that holds words and their corresponding similar words/uses of them
      key: word
      value: set of sentences with valid word uses
    After all of the corpus has been analyzed, the wordUses object will be returned
    for use in training
 */

class DataLabeler {
  constructor(words, doLabel) {
    this.fs = new DataFileManager();
    this.verbRelations = new Map();
    this.objectRelations = new Map();
    this.similar = new SimilarSearch({ normalize: true });
    for (let i = 0; i < words.length; i++)
      this.verbRelations.set(words[i], new Set());
    if (doLabel)
      this.processLookups(words);
  }

  // for every word in wordUses, populate related words into the set of valid uses
  loadVerbs(words) {
    for (let i = 0; i < words.length; i++) {
      this.addVerbRelation(words[i], words[i].text);
      // add user inputted synonyms
      const synonyms = words[i].synonyms;
      for (let j = 0; j < synonyms.length; j++) {
        this.addVerbRelation(words[i], synonyms[j]);
      }
      // Add related words provided by wordnet.js
      const lookup = wnjs.lookup(words[i].text);
      if (!lookup || !lookup.length)
        continue;
      for (let j = 0; j < lookup.length; j++) {
        const l = lookup[j];
        const pos = l.lexname.split('.')[0];
        const type = l.lexname.split('.')[1];
        if (words[i].pos != pos || !words[i].types.has(type))
          continue; // if not the same part of speech skip it
        for (let k = 0; k < l.words.length; k++) {
          if (words[i].ignore.has(l.words[k]))
            continue;
          this.addVerbRelation(words[i], l.words[k]);
        }
      }
    }
  }

  getLabels() {
    return this.verbRelations;
  }

  // User function for processing the lookups contained in processQueue
  processLookups(words) {
    this.loadVerbs(words);
  }

  // Wrapper function that populates wordUses
  addVerbRelation(word, other) {
    if (this.verbRelations.get(word).has(other))// if present
      return;
    else // if not already present
      this.verbRelations.get(word).add(other);
  }

  // collects uses of words from nlp-corpus //
  collectUses(batchSize, fromBeginning=false) {
    const friends = corpus.friends.array();
    this.printSnapshot(this.verbRelations);
    const keys = Array.from(this.verbRelations.keys()).map(v => v.text);
    const trainingBatcher = new Batcher({
      keys: keys, maxSize: batchSize, batchPath: './nlp/data/friends/training/',
      initialData: this.stripRelations(this.verbRelations),
    });
    const testBatcher = new Batcher({
      keys: keys, maxSize: batchSize, batchPath: './nlp/data/friends/test/',
    });
    const verbRegex = Array.from(this.verbRelations.keys()).map( w => new VerbRegex({
      word: w, synonyms: this.verbRelations.get(w), regExps: w.regex } ));
    let record = this.fs.readRecord('./nlp/data/friends/record.json');
    let start = { s1: 0, s2: 0 };
    if (!fromBeginning && Object.keys(record).length != 0) { // if there was a previous record
      start.s1 = record.s1;
      start.s2 = record.s2;
    }

    for (let i = start.s1; i < friends.length; i++) { // for every episode
      const lines = compromise(friends[i]).sentences().out('array');
      for (let l = start.s2; l < lines.length; l++) {
        const line = lines[l];
        for (let r of verbRegex) {
          const matches = r.match(line);
          if (!matches.size) continue;
          for (let m of matches) {
            if (Math.random() <= 0.2)
              testBatcher.addRelations({ verb: r.word.text, match: m, i: i, l: l });
            else
              trainingBatcher.addRelations({ verb: r.word.text, match: m, i: i, l: l });
          }
        }

      }
    }
  }

  // strips this.verbRelations to text to text object relations //
  stripRelations(relations) {
    let data = new Map();
    for (let [key, values] of relations)
      data.set(key.text, new Set(Array.from(values)));
    return data;
  }

  printSnapshot(relations){
    for (let [key, value] of relations)
      console.log(key.text + ' -> ' + Array.from(value) + '\n');
  }

  getDataSize(relations) { // tells how many data points there are in the map
    let sum = 0;
    for (let [key, values] of relations) {
      sum += values.size;
    } return sum;
  }
}
module.exports = DataLabeler;

