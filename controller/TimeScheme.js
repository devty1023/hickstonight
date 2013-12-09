var mongoose = require('mongoose');

var timeSchema = new mongoose.Schema( {
    created: Date,
    owner: String,
    startTime: Number,
    endTime: Number,
    elapsedTime: Number,
}, {collection: 'timestamps'});
    
module.exports = mongoose.model('Timestamp', timeSchema);
