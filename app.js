const express = require('express');
const NLP = require('./nlp/NLP');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`EscapeNLP Server listening on port ${port}!`));
