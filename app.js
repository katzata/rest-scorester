const express = require('express');
const app = express();
const port = process.env.NODE_ENV === "development" ? 5000 : 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`rest scorester listening on http://localhost:${port}`);
});