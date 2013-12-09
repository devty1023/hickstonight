
var TimeController = require( "../controller/TimeController" );

var timeController = TimeController();

var stamp1 = {
    owner: "devty",
    startTime: "123456",
    endTime: "7890",
    elapsedTime: "1111"
}

timeController.createTimestamp( stamp1, function(err, result) { if(err) console.log(err); else console.log(result);} );

timeController.getTimestamps( function(err, result) { if(err) console.log(err); else console.log(result); });

