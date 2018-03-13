var express = require('express');


var equipments = express.Router();
var equipment = require('../models/equipment');

/* GET equipmenents listing. */
equipments.route('/')

/* POST new equipment  */
.post(function(req,res,next)
{
    equipment.create(req.body, res);
})

/* GET equipmenents listing. */
equipments.route('/list')
.get(function(req,res,next)
{
    equipment.getListandModel(res);
})

/** get OID from specific equipment */
equipments.route('/:id')
.get(function(req,res,next)
{
    equipment.getOID(req.params.id, res);
})

/* GET equipments listing for a category. */
equipments.route('/category/:id')
.get(function(req,res,next)
{
    equipment.getAll(req.params.id,res);
})


module.exports = equipments;