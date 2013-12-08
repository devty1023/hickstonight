
/*
 * GET home page.
 */

var userController = require('../controller/UserController')();

exports.newUser = function(req, res){
    console.log('wtf is going on?');
    res.send('hello admin');
};
