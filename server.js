var PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 8080;
//var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '192.168.1.4' || '127.0.0.1';

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

var clients = [];

/*/fs = require('fs')
/*
fs.readFile('/home/division/public_html/fromAdminPanel.php', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  newsFromPanel = data;
  console.log(data);
});
*/
// Setup a very simple express application.
app = express();

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
// VERARDI PAGE
app.get('/verardi', function(req, res) {
    res.sendfile(__dirname + '/verardi/index.html');
});
//  MUCCA PAGE
app.get('/frisenda', function(req, res) {
    res.sendfile(__dirname + '/frisenda/index.html');
});


// Our express application functions as our main listener for HTTP requests
// in this example which is why we don't just invoke listen on the app object.
server = require('http').createServer(app);
server.listen(PORT, IPADDRESS);

// socket.io augments our existing HTTP server instance.
io = require('socket.io').listen(server);
io.configure(function() {
    // Logging: 3 = debug (default), 1 = warn
    //var logLevel = (argv["log-level"] === undefined) ? 3 : argv["log-level"];
    var logLevel = (argv["log-level"] === undefined) ? 1 : argv["log-level"];
    io.set("log level", logLevel);
});

io.sockets.on('connection', function (socket) {
    // The username for this socket.
    console.log("connection!");
    //save the first user
    //clients.push(socket.id);
    for(var i=0;i<clients.length;i++){
        console.log(clients[i]);
    }
    //io.sockets.socket(clients[0]).emit("greeting", "user0");
    
    var events = {
        "verardi-left": function(data){
            console.log('verardi-left, data: '+data);
            socket.broadcast.emit('verardi-left', data);
        },
        "verardi-right": function(data){
            console.log('verardi-right, data: ' + data);
            socket.broadcast.emit('verardi-right', data);
        },
        
        "client-right": function(data){
            console.log('client-right, data: ' + data);
            socket.broadcast.emit('client-right', data);
        },
        "client-left": function(data){
            console.log('client-left, data: ' + data);
            socket.broadcast.emit('client-left', data);
        },
        
        "frisenda-right": function(data){
            console.log('frisenda-right, data: ' + data);
            socket.broadcast.emit('frisenda-right', data);
        },
        "frisenda-left": function(data){
            console.log('frisenda-left, data: ' + data);
            socket.broadcast.emit('frisenda-left', data);
        },
        
        "verardi-stop": function(data){
            console.log('!!! data: ' + data);
            socket.broadcast.emit('stop', data);
        },
        "verardi-changeNews": function(data){
            console.log('!!!___' + data);
        }
    };
    
    for (var method in events) {
        //console.log("add handler for " + method);
        //console.log("aaaaa" + event);
        
        (function (realMethod) {
            socket.on(realMethod, function (data) {
                //console.log('CONTROL: realMethod ####### ' + realMethod);
                //console.log('data.action: ' +data.action);
                events[realMethod].apply(this, data);
            });
        })(method);
    }
/*
	socket.on('99999-left', function(data){
            console.log("data log from server:**********"+data.action);
            //io.sockets.emit('left', { action: 'left' });
            //socket.broadcast.emit('left', { action: 'left' });
            socket.broadcast.emit('left', data.action);
	});

	socket.on('99999-right', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('right', { action: 'right' });
	});
        
	socket.on('99999-stop', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('stop', { action: 'stop' });
	});
        */
        
        socket.on('verardi-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('verardi-changeNews', data.action);
	});
        
        socket.on('frisenda-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('frisenda-changeNews', data.action);
	});
        
        socket.on('client-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('client-changeNews', data.action);
	});
        
        
        
        socket.on('storeClientInfo', function (data) {
            /*
            var clientInfo = new Object();
            clientInfo.customId = data.customId;
            clientInfo.clientId = socket.id;
            console.log('clients push: ' + socket.id +' '+data.customId);
            clients.push(clientInfo);
            */
        });
        socket.on('disconnect', function (data) {
            /*
            for( var i=0, len=clients.length; i<len; ++i ){
                var c = clients[i];
                if(c.clientId == socket.id){
                    clients.splice(i,1);
                    console.log('clients splice: ' + c.clientId +' _ '+i);
                    break;
                }
            }
            */
        });
        
        
        
    
    
        /*
         * new page in verardi folder
         
        socket.on('stop_verardi', function(data){
            console.log('server listen on action ');
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('stop_verardi', { action: 'stop_verardi' });
	});*/
});
