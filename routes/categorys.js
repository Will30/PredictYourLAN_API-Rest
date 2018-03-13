var express = require('express');


var categorys = express.Router();
var category = require('../models/category');

/* GET categorys listing. */
categorys.route('/')
.get(function(req,res,next)
{
    category.getAll(req,res);
})

categorys.route('/:id')
/** update specific Strategic point   */
.put(function(req, res, next)
{
    category.update(req.params.id, req.body, res);
})

module.exports = categorys;