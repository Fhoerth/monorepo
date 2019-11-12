const express = require('express');

const app = express();

app.get('*', (req, res) => {
  res.json({ data2: 'package-2-server-data' });
});

app.listen(3002, () => {
  console.log('Server package-2 initialized!');
});