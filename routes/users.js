var express = require('express');


var users = express.Router();
var user = require('../models/user');

/* GET users listing. */
users.route('/')
.get(function(req,res,next)
{
    user.getAll(res);
})
.post(function(req,res,next)
{
    user.create(req.body, res);
})
// Special function for Junit. It will delete the last user created
.delete(function(req,res,next)
{
   user.delete(res);
})

/** get stuff from specific user */
users.route('/:id')
.get(function(req,res,next)
{
    user.get(req.params.id, res);
})
.put(function(req, res, next)
{  
    user.update(req.params.id, req.body, res);
})

.delete(function(req,res,next)
{
    user.deleteID(req.params.id, res);
})


/** get elements from login */
users.route('/login')
.post(function(req, res, next) 
{
    console.log('check login');
    user.checkLogin(req.body, res);
});


module.exports = users;