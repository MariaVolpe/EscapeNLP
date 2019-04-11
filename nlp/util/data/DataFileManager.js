const fs = require('fs');

class DataFileManager {
  constructor() {}

  // Converts Query data to more usable object //
  convertQueryData(queryData) {
    const obj = JSON.parse(JSON.stringify(queryData)); // deep copy of object
    for (let i = 0; i < queryData.length; i++) { // for every word
      const wordData = queryData[i];
      obj[i].types = new Set();
      obj[i].ignore = new Set();
      for (let j = 0; j < wordData.types.length; j++) // for all its types
      { obj[i].types.add(wordData.types[j]); }
      for (let j = 0; j < wordData.ignore.length; j++) obj[i].ignore.add(wordData.ignore[j]);
    } return obj;
  }

  readQueryFile(path) {
    const queryFile = fs.readFileSync(path);
    try {
      return this.convertQueryData(JSON.parse(queryFile));
    } catch (err) {
      console.log(`error reading query file ${path}`);
      console.log(err);
    }
  }

  readRecord(path) {
    const folder = path.split('/').slice(0, 4).join('/');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, (err) => { if (err) console.log(err); });
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 4));
    return JSON.parse(fs.readFileSync(path));
  }

  writeRecord(path, newRecord) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, (err) => { if (err) console.log(err); });
    fs.writeFileSync(path, JSON.stringify(newRecord, null, 4));
  }

  // given a directory, obj will be written as batch JSON file
  writeBatchJSON(path, obj) {
    const folder = path.split('/').slice(0, 6).join('/');
    if (!fs.existsSync(folder, () => {})) {
      fs.mkdirSync(folder, () => {});
    }
    const items = fs.readdirSync(folder);
    this.writeJSONFile(`${path}/batch${items.length + 1}.json`, obj);
  }

  writeJSONFile(path, obj) {
    fs.writeFileSync(path, JSON.stringify(this.convertToObj(obj), null, 4), (err) => {
      if (err) { console.log(err); return; }
      console.log(`file written${path}`);
    });
  }

  // used to convert maps to JS objects for jsonification
  convertToObj(original) {
    const obj = {};
    for (const [key, value] of original) obj[key] = Array.from(value);
    return obj;
  }

  // Recursively flushes the data in a directory
  flushData(path) {
    const items = fs.readdirSync(path);
    for (const item of items) {
      const stats = fs.lstatSync(path + item);
      if (stats.isFile()) fs.unlinkSync(path + item);
      else this.flushData(`${path + item}/`);
    }
  }

  getFilesInDir(path) {
    return fs.readdirSync(path);
  }

  fileToObj(path) {
    if (!fs.existsSync(path)) {
      console.log(`No such file: ${path}`);
      return;
    } return JSON.parse(fs.readFileSync(path));
  }
}

module.exports = DataFileManager;
