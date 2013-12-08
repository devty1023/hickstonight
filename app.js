
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app)
  , routes = require('./routes');


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session( {secret: 'devty1023rocks'}));
  app.use(app.router);
  //app.use(express.cookieSession());
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.set("test", "teststring");

// Routes
app.get('/', routes.index(io));
app.post('/', routes.index(io));

app.get('/admin/newuser', routes.newUser);
app.post('/admin/newuser', routes.newUser);

app.listen( process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// web socket!
io.sockets.on( 'connection', function(socket) {
  //io.sockets.emit( 'this', { will: 'be received by everyone'});
});
