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
    total_all: 1001,
    total_week: 1000,
    timestamps: [],
    created: new Date()
});

var user2 = new User( {
    username: 'lee832',
    nickname: 'devty',
    password: 'psswd',
    active: false,
    active_since: -1,
    total_all: 0,
    total_week: 0,
    timestamps: [],

    created: new Date()
});

var user3 = new User( {
    username: 'jennirell',
    nickname: 'jennifer',
    password: 'psswd1',
    active: false,
    active_since: -1,
    total_week: 0,
    total_all: 2000,
    timestamps: [],

    created: new Date()
});



user1.save( errSave );
user2.save( errSave );
user3.save( errSave );

mongoose.disconnect();

