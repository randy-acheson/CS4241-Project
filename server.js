var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

app.use(express.static(path.join(__dirname, '/public')));