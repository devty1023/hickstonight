var mongoose = require('mongoose'),
    Timestamp = require('./TimeScheme');

//mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hickstonight');

module.exports = function TimeController() {
    return {
        createTimestamp: function( time, callback ) {
            console.log( 'createTimeimestamp called' );
            console.log( time );
            var timestamp = new Timestamp( {
                owner: time.owner,
                startTime: time.startTime,
                endTime: time.endTime,
                elapsedTime: time.elapsedTime,
                created: new Date()
            });

            timestamp.save(function() {}  );

            var stamp_id = String(timestamp._id);
            console.log( timestamp._id + " : " + stamp_id);
            callback( null, stamp_id );
        },

        // debug purpose
        getTimestamps: function( callback ) {
            console.log( 'getTimeStamps called' );
            Timestamp.find( function( err, result ) {
                if( err || !result ) {
                    callback( new Error("timestamp error"));
                }
                else {
                    callback( null, result )
                }
            });

        },

        getTimestampsByUsername: function( username, callback ) {
            console.log( 'getTimestampsByUsername called with ' + username );
            Timestamp.find({owner: username}).sort( { endTime: -1} ).exec( function( err, result) {
                if ( err ) callback( new Error("getTimestampsByIds failed") );
                else
                    callback(null, result);
            });

        }
    };
};

 
