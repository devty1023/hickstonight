var mongoose = require('mongoose');

var timeScheme = new mongoose.Schema( {
    created: Date,
    owner: String,
    startTime: Number,
    endTime: Number,
    elapsedTime: Number,
}, {collection: 'timestamps'});
    
