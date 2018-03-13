var express = require('express');


var networks = express.Router();
var network = require('../models/network');

/* GET networks listing. */
networks.route('/')

/* POST new network  */
.post(function(req,res,next)
{
    network.create(req.body, res);
})

/* GET data storage listing for a category. */
networks.route('/category/:id')
.get(function(req,res,next)
{
    network.getAll(req.params.id,res);
})

module.exports = networks;