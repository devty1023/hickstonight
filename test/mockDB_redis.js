/**
 * Creates a mock database
 */

// 0. Set up redis database
var redis = require("redis"),
    client = redis.createClient();


client.on("error", function (err) {
    console.log("Error " + err);
});


// 1. Flush all data
client.flushall();


// 2. Set Globals
client.set( "global:nextUserId", 0 );
client.set( "global:nextTimeId", 0 );

// 3. Set up 3 users; daniel yg jennifer
// 3.a get next user id
client.incr( "global:nextUserId", function( err, obj ) {
    var myid;
    myid = obj;
    client.set( "uid:" + myid + ":username", "lee832" );
    client.set( "uid:" + myid + ":nickname", "daniel" );
    // client.set( "uid:" + myid + ":timestamps", "daniel" ); # CANT DO THIS YET
    client.set( "uid:" + myid + ":total", 0 );
    client.set( "username:" + "lee832" + ":uid", 1 );
});

client.incr( "global:nextUserId", function( err, obj ) {
    var myid = obj;
    client.set( "uid:" + myid + ":username", "seong" );
    client.set( "uid:" + myid + ":nickname", "jennifer" );
    // client.set( "uid:" + myid + ":timestamps", "daniel" ); # CANT DO THIS YET
    client.set( "uid:" + myid + ":total", 0 );
    client.set( "username:" + "seong" + ":uid", 2 );
});

client.incr( "global:nextUserId", function( err, obj ) {
    var myid = obj;
    client.set( "uid:" + myid + ":username", "yg222" );
    client.set( "uid:" + myid + ":nickname", "yongchae" );
    // client.set( "uid:" + myid + ":timestamps", "daniel" ); # CANT DO THIS YET
    client.set( "uid:" + myid + ":total", 0 );
    client.set( "username:" + "yg222" + ":uid", 3 );

    client.quit();
});


// ADD CORRESPONDING USERNAMES



// quit
