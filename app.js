const express = require('express');
const { NlpManager, NlpClassifier, NerManager } = require('node-nlp');
const synonyms = require('synonyms');
const app = express();
const port = 3000;

// glove (John told me about this) if training doesnt work well

app.get('/', (req, res) => res.send('Hello World!'));

const manager = new NlpManager({ languages: ['en'] });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');

// Train and save the model.
(async() => {
    await manager.train();
    //manager.save();
    const response = await manager.process('en', 'I have to go');
    console.log(response);
})();

const classifier = new NlpClassifier({ language: 'en' });
classifier.add('walk', 'move');
classifier.add('run', 'move');
classifier.add('jog', 'move');
classifier.add("toss", 'throw');
classifier.add('pass', 'throw');
moveWords = synonyms("move", "v");
moveWords.push("walk"); // add walk as it is a similar word for us
for (let i = 0; i < moveWords.length; i++)
    classifier.add (moveWords[i], "move");
console.log (synonyms("throw", 'v'));

(async() => {
    await classifier.train(); 
    let tests = [
        "walk",
        "I walk to the door",
        "I run around",
        "I jog in place",
        "I throw the key",
        "I toss the ball",
        "I pass the ball"
    ];
    //const classifications = classifier.getClassifications("walk");
    //console.log (classifications);
    for (let i = 0; i < tests.length; i++) {
        var test = tests[i];
        //console.log(test);
        const classifications = classifier.getClassifications(test);
        //console.log (classifications);
        //console.log ();
    }
    var c = classifier.getClassifications("move");
    console.log ("move: ");
    console.log(c);
    c = classifier.getClassifications("go");
    console.log ("go: ");
    console.log(c);
})();

// NER MANAGER EXAMPLE
const nerManager = new NerManager({ threshold: 0.8 });
const fromEntity = nerManager.addNamedEntity('fromEntity', 'trim');
fromEntity.addBetweenCondition('en', 'from', 'to');
fromEntity.addAfterLastCondition('en', 'to');
const toEntity = nerManager.addNamedEntity('toEntity', 'trim');
fromEntity.addBetweenCondition('en', 'to', 'from');
fromEntity.addAfterLastCondition('en', 'from');
nerManager.findEntities(
  'I want to travel from Barcelona to Madrid',
  'en',
).then(entities => console.log(entities));

/*console.log(synonyms("screen", "v"));
console.log(synonyms("sieve", "v"));
console.log (synonyms("walk")); // undefined output, no synonyms 
console.log(synonyms ("go", "v"));
console.log (synonyms("run", "v"));
console.log (synonyms("pass", "v"));

console.log (synonyms("move", "v"));*/


//console.log (synonyms.dictionary);
app.listen(port, () => console.log (`EscapeNLP Server listening on port ${port}!`));