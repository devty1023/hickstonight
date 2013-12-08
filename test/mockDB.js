var mongoose = require('mongoose'),
    User = require('../controller/UserScheme');

mongoose.connect('mongodb://localhost/hickstonight');

errSave = function(err) {
    console.log('error while saving');
};

var user1 = new User( {
    username: "ltae9110",
    nickname: 'daniel',
    password: 'passwd',
    active: false,
    active_since: -1,
    total: 0,
    timestamps_week: [],
    timestamps_all: [],
    created: new Date()
});

var user2 = new User( {
    username: 'lee832',
    nickname: 'devty',
    password: 'psswd',
    active: false,
    active_since: -1,
    total: 0,
    timestamps_week: [],
    timestamps_all: [],

    created: new Date()
});

var user3 = new User( {
    username: 'jennirell',
    nickname: 'jennifer',
    password: 'psswd1',
    active: false,
    active_since: -1,
    total: 0,
    timestamps_week: [],
    timestamps_all: [],

    created: new Date()
});



user1.save( errSave );
user2.save( errSave );
user3.save( errSave );

mongoose.disconnect();

