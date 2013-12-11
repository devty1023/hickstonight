var fs = require('fs');
var userController = require("./UserController")();


module.exports = function TimeController() {
    return {
        weeklyUpdate: function( callback ) {
            console.log('weeklyUpdate called');

            // read the file
            fs.readFile('meta', 'utf8', function( err, data) {
                // file reading failed
                if (err) {
                    callback( new Error("update failed (read file failed"));
                }

                // file reading success
                else {
                    if( data == '1\n' ) {
                        console.log("weekly update will execute");

                        // intialize all user total_week to zero
                        userController.initWeek( callback ); 

                        // update meta file
                        fs.writeFile("meta", "0\n", function(err) {
                            if(err) {
                                callback(err);
                           }
                            else {
                                callback(null);
                            }
                        });
                    }
                    else {
                      callback(new Error("update aborted/uneeded"));
                    }
                }
            });
        },

        prepareUpdate: function(callback) {
            console.log("prepareUpdate called");
            fs.writeFile("meta", "1\n", function(err) {
                if(err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        }
    };
};
