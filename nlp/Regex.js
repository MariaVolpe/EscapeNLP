const compromise = require('compromise');

class Regex {
  constructor() {
  }

  match(line) {
    /*const matches = compromise(line).match(this.regexp).out('array');
    const data = {};
    if (!matches.length) return;
    for (let match of matches) {
      const nouns = compromise(match).match('#Noun').out('array');
      if (!nouns.length) continue;
      const noun = nouns[nouns.length-1];
      if (!data[noun])
        data[noun] = new Set();
      data[noun].add(match);
    }
    return data;*/
  }

}

class VerbRegex extends Regex {
  constructor({ word, synonyms, regExps }) {
    super();
    this.word = word;
    this.synonyms = synonyms;
    this.regExps = regExps;
  }

  match(line) {
    let valid = new Set();
    for (let regex of this.regExps) {
      const matches = compromise(line).match(regex).out('array');
      if (!matches.length) continue;
      for (let match of matches) {
        const verbs = new Set(compromise(match).verbs().out('array'));
        for (let verb of verbs)
          if (this.synonyms.has(verb))
            valid.add(match);
      }
    } return valid;
  }
}

module.exports = VerbRegex;
