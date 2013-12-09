var mongoose = require('mongoose');

// init set
var userSchema = new mongoose.Schema( {
    username:   { type: String, unique: true},
    nickname:   { type: String, unique: true},
    password:   String,
    active:     Boolean,
    active_since: Number,
    total:      Number,
    timestamps_week: [ { id: String } ],
    timestamps_all: [ { id: String } ],
    created: Date
}, {collection: 'users'});



module.exports = mongoose.model('User', userSchema);
