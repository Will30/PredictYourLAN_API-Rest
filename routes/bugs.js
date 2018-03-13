var express = require('express');


var bugs = express.Router();
var bug = require('../models/bug');

/* GET bugs listing. */
bugs.route('/')
.get(function(req,res,next)
{
    bug.getAll(res);
})


/** update specific bug  */
.put(function(req, res, next)
{
    bug.update(req.body, res);
})


/* GET bugs active for Main Window. */
bugs.route('/category')
.get(function(req,res,next)
{
    bug.getActiveBug(res);
})

/** get Bug for a specific strategic point */
bugs.route('/thisSP')
.post(function(req,res,next)
{
    bug.getBugForThisSP(req.body, res);
})

/** get bug for specific Strategic point at given period */
bugs.route('/')
.post(function(req,res,next)
{
    bug.getBugForSPAtGivenPeriod(req.body, res);
})

module.exports = bugs;