var mongoose = require('mongoose'),
    User = require('./UserScheme'),
    TimeController = require('./TimeController')();

mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost/hickstonight');

module.exports = function UserController() {
    return {

        errGetUsers: function(err) {
            if(err) console.log('Error on getUsers/find');
        },

        addUser: function( usr, callback ) {
            console.log( 'UserController.addUser called' );

            var user = new User( {
                username: usr.username,
                nickname: usr.nickname,
                password: usr.password,
                active:   false,
                active_since: -1,
                total_week: 0,
                total_all: 0,
                timestamps: [],
                created: new Date()
            });

            user.save( callback );
        },

        getUsers: function( callback ){
            // same as getUsersByWeek
            console.log( 'UserController.getUsers called' );
            User.find(function(err, result) {
                //console.log(result);
            });
            User.find().sort( {total_week: -1 }).exec( function(err, result) {
                 if( err || !result) {
                     this.errGetUsers();
                 }
                 else
                     callback( null, result );
            });
        },

        getUsersByAll: function( callback ){
            // THIS ONE SORTS BY TOTAL_ALL
            console.log( 'UserController.getUserAll called' );
            User.find().sort( {total_all: -1 }).exec( function(err, result) {
                 if( err || !result) {
                     this.errGetUsers();
                 }
                 else
                     callback( null, result );
            });
        },

        getUserByUsername: function(username, callback) {
            console.log( 'UserController.getUserByUsername called' );

            User.find( { username: username }, function(err, result) {
                 if( err || !result.length) {
                     callback(new Error("user not found!"));
                 }
                 else {
                     //console.log(result);
                     console.log(result[0].timestamps.length);
                     callback( null, result );
                 }
            });

        },

        authenticate: function( username, pass, callback ) {
            console.log('authenticate called');
            this.getUserByUsername( username, function (err, user) {
                if (user) {
                    if(err) callback( err );
                    // hash function
                    console.log('we found the user');
                    if (pass == user[0].password) {
                        console.log('with a correct password!');
                        // authentication success
                        callback( null, user );
                    }
                    else {
                        console.log('but incorrect password!');
                        callback( new Error("wrong passwrod!")  );
                    }
                }
                else {
                    callback(err);
                }
            });
        },

        checkIn: function( username, callback ) {
            console.log("checkIn called");
            var that = this;

            // BUG FIX: we might click checkIn multiple times. 
            // we must ensure that checkIn is called only once

            // fix: save it on cookie

            // get time
            var cur_time = Math.floor(new Date().getTime() / 1000);
            User.update( { username: username}, { active: true, active_since: cur_time }, function( err, result ) {
                if( err ) return callback( new Error("update failed!") );
                // update success
                // we need to return the data obj..
                that.getUserByUsername( username, function( err, result ) {
                    if (err) return callback( new Error("updated failed2") );
                    callback( null, result );
                });
            });
        },

        // checkout function to be called if user wants to checkout while session is < 30
        checkOutForced: function(usr, callback ) {
            console.log("checkOutForced called");

            var that = this;
            User.update( { username: usr.username}, { active: false, active_since: -1 }, function( err, result ) {
                if( err ) return callback( new Error("update failed!") );
                // update success
                // we need to return the data obj..
                that.getUserByUsername( usr.username, function( err, result ) {
                    if (err) return callback( new Error("updated failed2") );
                    callback( null, result );
                });
            });

        },

        checkOut: function( user, callback ) {
            console.log("checkOut called");
            var that = this;


            // 1. create time stamp for this user
            // TODO: create timestamp only if current session > 30 min

            // 1a. create current stamp information
            var cur_time = Math.floor(new Date().getTime() / 1000);
            console.log( "cur time is " + cur_time );
            var elapsedTime = cur_time - user.active_since;
            var cur_stamp = { owner: user.username, startTime: user.active_since, endTime: cur_time, elapsedTime: elapsedTime };

            // TODO: current session must be > 30 min
            // DEVELOPMENT: 1min 
            if ( elapsedTime < 30 ) { // less than 30 minutes 
                return callback( new Error("code:00") );
            }

            TimeController.createTimestamp( cur_stamp, function(err, result ) {
                if( err ) console.log('create time stamp failed');

                // update user info

                // 2. update user info and return page
                User.update( { username: user.username}, { active: false, active_since: -1,  $inc: { total_week: elapsedTime, total_all: elapsedTime }, $push: { timestamps: result} }, function( err, result ) {
                    if( err ) return callback( new Error("update failed!") );
                    // update success
                    // we need to return the data obj too callback func
                    that.getUserByUsername( user.username, function( err, result ) {
                        if (err) return callback( new Error("updated failed2") );
                        callback( null, result );
                    });
                });
    
            });

          },


          getUserTimestamps: function( username, callback) {
            console.log("getUserTimestamps called");

            this.getUserByUsername( username, function( err, result_user) {
                if(err || !result_user) {
                    console.log("user not found!"); 
                    callback(err);
                }
                else {
                    TimeController.getTimestampsByUsername(username, function( err, result_timestamp) {
                        if(err) callback(err);
                        else {
                            console.log('getTimestampsByUsername returned succesfully')

                            var ret_obj = new Array();
                            ret_obj[0] = result_user;
                            ret_obj[1] = result_timestamp;
                            callback( null, ret_obj);
                        }

                    });
                }

            });
        },

        initWeek: function(callback) {
            User.update({}, { total_week: 0 },  {multi: true}, function( err, num, raw ) {
                if (err ){
                    callback( new Error("update failed") );
                }
                else
                    console.log(num + " " + raw );
            });
        }
    };
};


