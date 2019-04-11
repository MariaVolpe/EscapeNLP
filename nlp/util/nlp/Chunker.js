const compromise = require('compromise');

class Chunker {
  constructor() { }

  // Returns a chunked version of the input given as verb phrases
  chunkInput(input) {
    input = this.preprocessInput(input);
    const words = input.split(' '); // split into words
    const chunks = [];
    let c = '';
    // Remove chunks as you chunk them from input vector
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const tags = this.stripTags(word);

      if (word == 'i') { // if we see i, assume the next word is a verb
        if (c != '') chunks.push(c);
        c = `i ${words[++i]} `;
        continue;
      }
      if (tags.has('Determiner')) { // then the next word will be treated as a noun
        const result = this.determinerRule(words, i);
        c += result.string;
        i = result.i;
        continue;
      }
      if (tags.has('Verb') && c != '') { // if start of a new verb phrase
        chunks.push(c);
        c = '';
      }
      c += `${word} `;
      input = input.replace(c, '');
    }
    if (c != '') chunks.push(c);
    return chunks;
  }

  // treats words following determiners (a, the, my, her etc) as a noun
  determinerRule(words, i) {
    let substr = `${words[i++]} `; // starts at the
    let j = i;
    for (; j < words.length; j++) {
      const word = words[j];
      const tags = this.stripTags(word);
      if (tags.has('Determiner') || tags.has('Preposition' || tags.has('Conjunction'))) {
        j--; // j-- because calling function will increment
        break;
      }
      if (tags.has('Verb') && !this.stripTags(words[j - 1]).has('Determiner')) {
        j--;
        break;
      }
      substr += `${word} `;
    }
    return { string: substr, i: j };
  }

  getObjectsOfSentence(input) {
    input = this.preprocessInput(input);
    const words = input.split(' '); // split into words
    const directObjs = [];
    const indirectObjs = [];
    let direct = true;
    let i = 0;

    for (; i < words.length; i++) {
      const word = words[i];
      const tags = this.stripTags(word);
      if (word == 'i') {
        i += 1;
        continue;
      }

      if (tags.has('Determiner')) { // then the next word will be treated as a noun
        const result = words[++i];
        if (direct) directObjs.push(result);
        else indirectObjs.push(result);
        const nextTags = this.stripTags(words[i + 1]);
        if (direct && !((nextTags.has('Conjunction') && words[i + 1] == 'and')
         || nextTags.has('Noun'))) { direct = !direct; }
        continue;
      }
      if (tags.has('Conjunction') && word != 'and' && directObjs.length) {
        if (direct) { direct = !direct; }
      }
      if (tags.has('Preposition') && directObjs.length) if (direct) { direct = !direct; }
      if (tags.has('Noun')) {
        if (direct) directObjs.push(word);
        else indirectObjs.push(word);
      }
    }
    return { directObjs, indirectObjs };
  }

  nextNoun(words, i) {
    for (;i < words.length; i++) {
      const word = words[i];
      const tags = this.stripTags(word);
      if (tags.has('Noun')) return i;
    } return i;
  }

  stripTags(word) {
    const tagArr = compromise(word).out('tags').map(t => t.tags);
    const tags = new Set();
    for (const x of tagArr) for (const y of x) tags.add(y);
    return tags;
  }

  preprocessInput(input) {
    input = input.toLowerCase();
    input = input.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');// remove punctuation
    return input;
  }
}

module.exports = Chunker;
