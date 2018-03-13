var express = require('express');


var dataStorages = express.Router();
var dataStorage = require('../models/dataStorage');

/* GET dataStorages listing. */
dataStorages.route('/')

/* POST new equipment  */
.post(function(req,res,next)
{
    dataStorage.create(req.body, res);
})


/* Update lastFile field for a data storage  */
dataStorages.route('/:id')
.put(function(req,res,next)
{
    dataStorage.updateLastFile(req.params.id, req.body, res);
})

/* GET data storage listing for a category. */
dataStorages.route('/category/:id')
.get(function(req,res,next)
{
    dataStorage.getAll(req.params.id,res);
})

module.exports = dataStorages;