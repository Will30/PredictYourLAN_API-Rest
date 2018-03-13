var express = require('express');


var SPs = express.Router();
var SP = require('../models/strategicPoint');

/* GET strategicPoints listing. */
SPs.route('/')
.get(function(req,res,next)
{
    SP.getAll(res);
})

/* POST new strategicPoints  */
.post(function(req,res,next)
{
    SP.create(req.body, res);
})

/** get stuff from specific Strategic point */
SPs.route('/:id')
.get(function(req,res,next)
{
    SP.get(req.params.id, res);
})

/** update specific Strategic point -- Create a bug for this   */
.post(function(req, res, next)
{
    SP.createBUG(req.params.id, req.body, res);
})

/** update specific Strategic point   */
.put(function(req, res, next)
{
    SP.update(req.params.id, req.body, res);
})

/** delete specific Strategicpoint */
.delete(function(req,res,next)
{
    SP.delete(req.params.id, res);
})

/** get stuff from specific Strategic point for Detail Window */
SPs.route('/moreElement/:id')
.post(function(req,res,next)
{
    SP.findMoreElement(req.params.id, res);
})

/** get SPs for a category */
SPs.route('/category/:id')
.get(function(req,res,next)
{
    SP.getSPsforACategory(req.params.id, res);
})

module.exports = SPs;