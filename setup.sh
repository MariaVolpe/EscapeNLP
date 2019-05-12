#!/bin/bash
npm install
cat ./nlp-classifier/nlp-classifier.js > ./node_modules/node-nlp/lib/nlp/nlp-classifier.js
cd client
npm install
cd ..