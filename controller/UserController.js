var mongoose = require('mongoose'),
    User = require('./UserScheme');

mongoose.connect('mongodb://localhost/hickstonight');

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
                total: 0,
                timestamps_week: [],
                timestamps_all: [],
                created: new Date()
            });

            user.save( callback );
        },

        getUsers: function( callback ){
            console.log( 'UserController.getUsers called' );
            User.find(function(err, result) {
                 if( err || !result) {
                     this.errGetUsers();
                 }
                 else
                     callback( null, result );
            });
        },

        getUserByUsername: function(username, callback) {
            console.log( 'UserController.getUserById called' );

            User.find( { username: username }, function(err, result) {
                 if( err || !result.length) {
                     callback(new Error("user not found!"));
                 }
                 else {
                     //console.log(result);
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
            var that = this;

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

        checkOut: function( username, callback ) {
            var that = this;
            User.update( { username: username}, { active: false, active_since: -1 }, function( err, result ) {
                if( err ) return callback( new Error("update failed!") );
                // update success
                // we need to return the data obj..
                that.getUserByUsername( username, function( err, result ) {
                    if (err) return callback( new Error("updated failed2") );
                    callback( null, result );
                });
            });
        }



    };
};


