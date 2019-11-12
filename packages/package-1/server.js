const http = require('http');
const express = require('express');

const app = express();

app.get('*', (req, res) => {
  http.get('http://localhost:3002/', (httpRes) => {
    let data2 = '';

    httpRes.on('data', (chunk) => {
      data2 += chunk.toString();
    }).on('end', () => {
      data2 = JSON.parse(data2);
      console.log(data2);
      res.json({ data1: 'package-1-server-data', ...data2 });
    
    });
  });
});

app.listen(3001, () => {
  console.log('Server package-1 initialized!');
});