
/*
 * GET home page.
 */

var userController = require('../controller/UserController')();

exports.index = function( io ) {
  var io = io;
  return function(req, res){
    console.log('index called');
    if ( req.method == 'GET' ) {
        userController.getUsers( function(err, results) {
            console.log(results)
            if ( req.session.user ) {
                var current_user = {
                    active: req.session.active,
                    username: req.session.user
                };
                res.render('index', { title: req.session.nickname, users: results, user: current_user } )
            }
            else {
                res.render('index', { title: 'No user', users: results, login: true } )
            }
        });
    }

    else { // post request 
        console.log(req.body);

        // 1. user is checking in
        if ( req.body.checkin ) return userController.checkIn( req.body.user, function(err, result) {
            if( err ) return res.send("something went wrong..");

            // update activity
            req.session.active = result[0].active;
            // redirect
            io.sockets.emit( 'checkedIn', { nickname: result[0].nickname, active_since: result[0].active_since } );
            res.redirect('/');

            // send message to all sockets
            /*
            if( req.app.get('socket').sockets != null )
                req.app.get('socket').sockets.emit( "checkedIn",  { nickename: result[0].nickname, active_since: result[0].active_since } );
            else
                console.log(req.app.get('socket'));
                */

        });

        // 2. user is checking out
        if ( req.body.checkout ) return userController.checkOut( req.body.user, function(err, result) {
            if( err ) return res.send("something went wrong..");

            // update activity
            req.session.active = result[0].active;
            // redirect
            io.sockets.emit( 'checkedOut', { nickname: result[0].nickname } );
            res.redirect('/');
        });


        // 3. user is signing out
        if ( req.body.signout ) {
            req.session.user = null;
            req.session.nickname = null;
            req.session.active = null;

            return res.redirect('/');
        }

        // 4. user in loggin in
        userController.authenticate( req.body.user, req.body.pass, function (err, result) {
            console.log( "authenticating...");
            if(err) {
                res.send("authentication failed" + err);
            }
            else {
                console.log("in routes..");
                console.log(result);
                req.session.user = result[0].username;
                req.session.nickname = result[0].nickname;
                req.session.active = result[0].active;

                res.redirect('/');
            }
        });
    }
  }
};


exports.newUser = function(req, res){
    if ( req.method == 'GET' )
        res.render( 'newuser' );

    else {
        // verify auth code
        if ( req.body.admin != 'devty1023' )
            res.send( 'you are not admin! (gasp) ' );
        else {
            // construct post data
            var post_obj = {
                username: req.body.username,
                nickname: req.body.nickname,
                password: req.body.pass
            }

            // RUN VALIDATIONS

            // 1. Cannot be empty
            if ( post_obj.username == "" || post_obj.nickname == "" || post_obj.password == "" )
                res.send( ' bad input ');

            // 2. username and nickname must contain only characters and numbers
            var regularExpression = /^[a-zA-Z0-9]+$/;
            if ( !regularExpression.test(post_obj.username) || !regularExpression.test(post_obj.nickname) || !regularExpression.test(post_obj.password) )
                res.send('username, nickname, and password must consist of alphanumeric characters only (no spaces, tabs, !@#$%)');

            else {
                // add to database
                userController.addUser( post_obj, function ( err ) {
                    if (err) res.send(err);
                    res.send('complete');    
                });
            }

        }
    }
};
