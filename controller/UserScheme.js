var mongoose = require('mongoose');

// init set
var userSchema = new mongoose.Schema( {
    username:   { type: String, unique: true},
    nickname:   { type: String, unique: true},
    password:   String,
    active:     Boolean,
    active_since: Number,
    total_week:   Number,
    total_all:    Number,
    timestamps: [String],
    created: Date
}, {collection: 'users'});



module.exports = mongoose.model('User', userSchema);
