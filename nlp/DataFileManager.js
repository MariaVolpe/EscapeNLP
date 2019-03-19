const fs = require('fs');

class DataFileManager {
  constructor() {}
  // Converts Query data to more usable object //
  convertQueryData(queryData) {
    let obj = JSON.parse(JSON.stringify(queryData)); // deep copy of object
    for (let i = 0; i < queryData.length; i++) { // for every word
      const wordData = queryData[i];
      obj[i].types = new Set();
      obj[i].ignore = new Set();
      for (let j = 0; j < wordData.types.length; j++) // for all its types
        obj[i].types.add(wordData.types[j]);
      for (let j = 0; j < wordData.ignore.length; j++)
        obj[i].ignore.add(wordData.ignore[j]);
    } return obj;
  }

  readQueryFile(path) {
    let queryFile = fs.readFileSync(path);
    try {
      return this.convertQueryData(JSON.parse(queryFile));
    } catch (err) {
      console.log('error reading query file ' + path);
      console.log(err);
    }
  }
  writeJSONFile(path, obj) {
    fs.writeFile(path, JSON.stringify(obj, null, 4), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('file written' + path);
    });
  }
}

module.exports = DataFileManager;
