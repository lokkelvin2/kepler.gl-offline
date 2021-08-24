//https://stackoverflow.com/a/40899767
var path = require('path');
var express = require('express');
var app = express();
var cors = require('cors')

var dir = path.join(__dirname, 'public');

app.use(cors())
app.use(express.static(dir));

app.listen(4000, function () {
    console.log('Listening on http://localhost:4000/');
});


