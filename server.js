var PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 8080;
//var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '192.168.1.8' || '127.0.0.1';

var express = require('express');
var server;
var io;
var app;
// Import our common modules.
var Handlebars = require('./common/handlebars').Handlebars;
var Message = require('./common/models').Message;
var User = require('./common/models').User;
// Grab any arguments that are passed in.
var argv = require('optimist').argv;

var newsFromPanel = '';
fs = require('fs')
fs.readFile('/home/division/public_html/fromAdminPanel.php', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  newsFromPanel = data;
  console.log(data);
  
});


// Setup a very simple express application.
app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


// Allow cross origin requests.
app.use(function(req, res, next) {
    var origin = '*';
    try {
        var parts = req.headers.referer.split('/').filter(function(n){return n;});
        if (parts.length >= 2){
            origin = parts[0] + '//' + parts[1];
        }
    } catch (e) {
        // no referrer
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});
// How we pass our websocket URL to the client.
app.use('/varSocketURI.js', function(req, res) {
    var port = argv['websocket-port'];
    // Modify the URI only if we pass an optional connection port in.
    var socketURI = port ? ':'+port+'/' : '/';
    res.set('Content-Type', 'text/javascript');
    res.send('var socketURI=window.location.hostname+"'+socketURI+'";');
});
// The client path is for client specific code.
app.use('/client', express.static(__dirname + '/client'));
// The common path is for shared code: used by both client and server.
app.use('/common', express.static(__dirname + '/common'));
// The root path should serve the client HTML.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/client/index.html');
});

app.get('/verardi', function(req, res) {
    res.sendfile(__dirname + '/verardi/index.html');
});

// Our express application functions as our main listener for HTTP requests
// in this example which is why we don't just invoke listen on the app object.
server = require('http').createServer(app);
server.listen(PORT, IPADDRESS);

// socket.io augments our existing HTTP server instance.
io = require('socket.io').listen(server);
io.configure(function() {
    // Logging: 3 = debug (default), 1 = warn
    var logLevel = (argv["log-level"] === undefined) ? 3 : argv["log-level"];
    io.set("log level", logLevel);
});

io.sockets.on('connection', function (socket) {

	console.log("connection!");
    // The username for this socket.

	socket.on('left', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('left', { action: 'left' });
            //socket.broadcast.emit('left', { action: 'left' });
            socket.broadcast.emit('news-calcio', { action: 'news-calcio' });
            
	});

	socket.on('right', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('right', { action: 'right' });
	});
        
        socket.on('stop', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('stop', { action: 'stop' });
	});
        /*
         * new page in verardi folder
         */
	socket.on('left_verardi', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('left', { action: 'left' });
            socket.broadcast.emit('left_verardi', { action: 'left' });
	});

	socket.on('right_verardi', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('right_verardi', { action: 'right_verardi' });
	});
        
        socket.on('stop_verardi', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('stop_verardi', { action: 'stop_verardi' });
	});
});
