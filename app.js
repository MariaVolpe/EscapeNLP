const express = require('express');
/*const helmet = require('helmet');
const path = require('path');
const gameSessionRouter = require('./routers/GameSession');
const GameSessionsContainer = require('./game-logic/GameSessionsContainer');

const gameContainer = new GameSessionsContainer();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/game', (req, res, next) => {
  req.gameContainer = gameContainer;
  next();
}, gameSessionRouter);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}*/

const NLAnalyzer = require('./nlp/NLAnalyzer');

const adhock = async () => {
  const analyzer = new NLAnalyzer();

  console.log('FIRST CLASSIFIER');
  await analyzer.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/', analyzer.actionClassifier);
  analyzer.tester.printTest();
  await analyzer.tester.testNetworkByDirectory('./nlp/data/design/test/', analyzer.actionClassifier);
  analyzer.tester.printTest();

  console.log('SECOND CLASSIFIER');
  analyzer.loadClassifier('./nlp/classifier-versions/classifier-model-v2');
  await analyzer.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/', analyzer.actionClassifier);
  analyzer.tester.printTest();
  await analyzer.tester.testNetworkByDirectory('./nlp/data/design/test/', analyzer.actionClassifier);
  analyzer.tester.printTest();

  console.log('TRAINING 3rd Classifier');
  analyzer.loadClassifier('./nlp/classifier-model.nlp');
  await analyzer.trainNetwork('./nlp/data/design/training/', './nlp/classifier-versions/classifier-model-v3');
  analyzer.loadClassifier('./nlp/classifier-versions/classifier-model-v3');
  console.log('THIRD CLASSIFIER');
  await analyzer.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/', analyzer.actionClassifier);
  analyzer.tester.printTest();
  await analyzer.tester.testNetworkByDirectory('./nlp/data/design/test/', analyzer.actionClassifier);
  analyzer.tester.printTest();
};

adhock();

//module.exports = { app, gameContainer };
