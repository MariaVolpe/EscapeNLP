const { SimilarSearch } = require('node-nlp');
const compromise = require('compromise');
const wnjs = require('wordnetjs');
const wn = require('wordnet');
const corpus = require('nlp-corpus');
const { PythonShell } = require('python-shell');
const readline = require('readline');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const DataFileManager = require('./DataFileManager');
/*
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
    this.wordRelations = new Map();
    this.input = readline.createInterface({
      input: process.stdin,
      output: process.stdout });
    this.similar = new SimilarSearch({ normalize: true });
    for (let i = 0; i < words.length; i++)
      this.wordRelations.set(words[i], new Set());
    if (doLabel)
      this.processLookups(words);
  }

  // for every word in wordUses, populate related words into the set of valid uses
  loadVerbs(words) {
    for (let i = 0; i < words.length; i++) {
      this.addRelation(words[i], words[i].text);
      // add user inputted synonyms
      const synonyms = words[i].synonyms;
      for (let j = 0; j < synonyms.length; j++) {
        this.addRelation(words[i], synonyms[j]);
      }
      // Add related words provided by wordnet.js
      const lookup = wnjs.lookup(words[i].text);
      if (!lookup || !lookup.length)
        continue;
      for (let j = 0; j < lookup.length; j++) {
        const l = lookup[j];
        const pos = l.lexname.split('.')[0];
        const type = l.lexname.split('.')[1];
        if (words[i].pos != pos || !words[i].types.has(type) 
          || words[i].ignore.has(l.words[0]))
          continue; // if not the same part of speech skip it
        for (let k = 0; k < l.words.length; k++)
          this.addRelation(words[i], l.words[k]);
      }
    }

    // add synonyms available by wordnet
    // const wnsyn = wnjs.verb('');
    // for (let j = 0; j < wnsyn.length; j++) {
    //   console.log(wnsyn[j]);
    //   //this.addRelation(words[i])
    // }
    // //console.log(wnjs.verb('warrant'));
  }

  getLabels() {
    return this.wordRelations;
  }

  // User function for processing the lookups contained in processQueue
  processLookups(words) {
    this.loadVerbs(words);
    this.convertToCsv(words); // write lookups to csv and then process in python
  }

  // Wrapper function that populates wordUses
  addRelation(word, other) {
    if (this.wordRelations.get(word).has(other))// if present
      return;
    else // if not already present
      this.wordRelations.get(word).add(other);
  }

  convertToCsv(words) {
    let dataMatrix = [];
    let columnMap = new Map(); // maps word to column where relations are found
    let rowMap = new Map(); // maps word to current row index
    let maxLength = 0;
    for (let i = 0; i < words.length; i++) {
      columnMap.set(words[i],i);
      rowMap.set(words[i], 0);
      if (maxLength < this.wordRelations.get(words[i]).size)
        maxLength = this.wordRelations.get(words[i]).size;
    }
    // populate an empty matrix
    for (let i = 0; i < maxLength; i++)
      dataMatrix.push(new Array(words.length).fill(''));
    for (let [key, value] of this.wordRelations) {
      for (let v of value) {
        let c = columnMap.get(key);
        let r = rowMap.get(key);
        rowMap.set(key, rowMap.get(key) + 1);
        dataMatrix[r][c] = v;
      }
    }
    const head = words.map((word) => word.text);
    const csvWriter = createCsvWriter({
      header: head,
      path: './nlp/data/d_verbs.csv',
    });
    csvWriter.writeRecords(dataMatrix)
      .then(()=> {
        console.log('...done writing');
      });
    /*let pyOptions = {
      mode: 'text',
      encoding: 'utf8',
      pythonOptions: ['-u'],
      args: ['d_verbs.csv'],
    };
    let py = new PythonShell('./data/labelvalidator.py', pyOptions);
    py.on('message', (message)=> {
      console.log(message);
    });*/
  }

  // collects uses of words from nlp-corpus //
  collectUses() {
    const friends = corpus.friends.array();
    let relationData = this.stripRelations();
    this.addTenses(relationData);
    //this.printSnapshot(relationData);
    
    for (let i = 0; i < friends.length; i++) { // for every episode
      const lines = compromise(friends[i]).sentences().out('array');
      for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        const match = compromise(line).match('I #Adjective? #Verb #Determiner #Noun').out('text');
        if (match=='') continue; // skip lines that dont match the regex
        const verbs = new Set(compromise(match).verbs().out('array'));
        for (let verb of verbs)
          for (let [key, values] of relationData)
            if (values.has(verb)) {
              console.log(verb + ' matched with: ' + match);
              this.relationData.get(key).add(match); // undefined error here
            }
      }
    }
  }

  // Conjugate all words and add their other tenses into relations
  addTenses(relations) {
    for (let [key, value] of relations) {
      let tenses = [];
      for (let v of value) {
        tenses.push(compromise(v).sentences().toPastTense().out('text'));
        tenses.push(compromise(v).sentences().toPresentTense().out('text'));
        tenses.push(compromise(v).sentences().toFutureTense().out('text'));
      }
      tenses.map((tense)=>relations.get(key).add(tense));
    }
  }

  // strips this.wordRelations to text to text object relations //
  stripRelations() {
    let data = new Map();
    for (let [key, values] of this.wordRelations)
      data.set(key.text, new Set(Array.from(values)));
    return data;
  }

  printSnapshot(relations){
    for (let [key, value] of relations)
      console.log(key + ' -> ' + Array.from(value));
  }

  getDataSize() { // tells how many data points there are in the map
    let sum = 0;
    for (let [key, values] of this.wordRelations) {
      sum += values.size;
    } return sum;
  }
}
module.exports = DataLabeler;

