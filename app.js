let port = process.env.PORT || 5000;

const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
}); 

app.get('/nextholiday', function(req, res){
  res.json({
    'test' : 'test'
  });
}); 

app.listen(port, () => console.log('Server http://localhost:'+port));
