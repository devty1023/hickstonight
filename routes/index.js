
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
            //console.log(results)
            if ( req.session.user ) {
                var current_user = {
                    active: req.session.active,
                    username: req.session.user
                };
                res.render('index', { title: req.session.nickname, users: results, user: current_user, forced: req.session.forcedCheckout } )
                req.session.forcedCheckout = null; // update
            }
            else {
                res.render('index', { title: 'No user', users: results, login: true } )
            }
        });
    }

    else { // post request 
        //console.log(req.body);

        // 1. user is checking in
        if ( req.body.checkin ) {
            if( !req.session.checkin ) {
                req.session.checkout = false;
                req.session.checkin = true;
                return userController.checkIn( req.body.user, function(err, result) {
                    if( err ) {

                        req.session.checkout = true;
                        req.session.checkin = false;
                        return res.send("something went wrong.. " + err);
                    }

                    // update activity
                    req.session.active = result[0].active;
                    // redirect
                    io.sockets.emit( 'checkedIn', { nickname: result[0].nickname, active_since: result[0].active_since } );
                    return res.redirect('/');

                });
            }
            else {
                console.log( 'checkin already processed..' );
                return res.redirect('/');
            }
        }

        // 2. user is checking out
        if ( req.body.checkout ) {
            if( !req.session.checkout ) {
                req.session.checkin = false; // toggle
                req.session.checkout = true; // toggle

                // UPDATE:
                // 1. To implement timestamp, I need not only username, but also the active_since info
                // 2. This information can only be safetly retrieved from the database only (no cookie gaurantee..)

                return userController.getUserByUsername( req.body.user, function( err, result ) {
                    // create user object
                    if( err ) { 
                        // we couldn't check out..
                        req.session.checkout=false;
                        req.session.checkin=true;
                        return res.send("getUserByUsername failed... " + err);
                    }

                    var user = { username: result[0].username, active_since: result[0].active_since }
                    console.log( "retrived user info: " + user );

                    // this body is used when we are forcing a checkout (< 30 min )
                    if ( req.body.forcedCheckout ) {
                        console.log("we will now force checkout..");
                        return userController.checkOutForced( user, function( err, result ) {
                            if( err ) {
                                // we couldn't check out..
                                req.session.checkout=false;
                                req.session.checkin=true;
                                return res.send("something went wrong... " + err);
                            }

                            // update activity
                            req.session.active = result[0].active;

                            // send socket messages
                            io.sockets.emit( 'checkedOut', { nickname: result[0].nickname } );

                            return res.redirect('/');
                        });

                    }

                    return userController.checkOut( user , function(err, result) {
                        if( err ) {
                            // we couldn't check out..
                            req.session.checkout=false;
                            req.session.checkin=true;
                            if( err.message == "code:00" ) { // session was < 30 min 
                                console.log("forced checkout initialized");
                                req.session.forcedCheckout = true;
                                return res.redirect("/");
                            }
                            return res.send("something went wrong... " + err);
                        }
                        // update activity
                        req.session.active = result[0].active;
                        console.log("!!!!!!!!!!! " + req.session.active);
                        // redirect
                        io.sockets.emit( 'checkedOut', { nickname: result[0].nickname } );
                        return res.redirect('/');
                    });

                });

            }
            else {
                console.log( 'checkout already processed..' );
                return res.redirect('/');
            }
        }


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
                //console.log(result);
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
