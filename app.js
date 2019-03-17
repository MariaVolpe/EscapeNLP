const express = require('express');
const app = express();
const port = 3000;

// glove (John told me about this) if training doesnt work well

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
  console.log(`EscapeNLP Server listening on port ${port}!`); // eslint-disable-line no-console
});
