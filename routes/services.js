var express = require('express');


var services = express.Router();
var service = require('../models/service');

/* GET services listing. */
services.route('/')
.get(function(req,res,next)
{
    service.getAll(res);
})


/** get name from specific service */
services.route('/:id')
.get(function(req,res,next)
{
    service.getName(req.params.id, res);
})

services.route('/id')
.post(function(req,res,next)
{
    service.getID(req.body, res);
})

module.exports = services;