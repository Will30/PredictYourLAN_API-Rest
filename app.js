var express = require('express');

var app = express();

app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Date',new Date());   
});

app.post('/', function(req, res) {
console.log(" ******************      res date"+res.headers)
 //   res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Date',new Date());
});


