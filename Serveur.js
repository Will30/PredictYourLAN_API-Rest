var express = require('express');
// BordyParser va permettre de traiter le contenu POST des requêtes HTTP pour pouvoir l’utiliser.
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

/*    -------------   My Routes          ---------------- */
var connection = require('./connection');
var users = require('./routes/users');
var SPs = require('./routes/strategicPoints');
var services = require('./routes/services');
var equipments = require('./routes/equipments');
var networks = require('./routes/networks');
var dataStorages = require('./routes/dataStorages');
var bugs = require('./routes/bugs');
var categorys = require('./routes/categorys');

var app = express();


app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Date',new Date());   
});



// Start connection with database
connection.init();

// only parses JSON. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
app.use(bodyParser.json({limit: '20mb'}));
// This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());



app.use('/users', users);
app.use('/SPs', SPs);
app.use('/services', services);
app.use('/equipments', equipments);
app.use('/networks', networks);
app.use('/dataStorages', dataStorages);
app.use('/bugs', bugs);
app.use('/categorys', categorys);

// Port 3001 : Port TCP/UDP
app.listen(3001);
console.log('Listening on port 3001...');


module.exports = app;