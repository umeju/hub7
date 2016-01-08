var PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 8080;
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '192.168.1.3' || '127.0.0.1';
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
    } catch (e) {}

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

// VERARDI
app.get('/verardi', function(req, res) {
    res.sendfile(__dirname + '/verardi/index.html');
});
//  MUCCA 
app.get('/frisenda', function(req, res) {
    res.sendfile(__dirname + '/frisenda/index.html');
});
// GARZIA
app.get('/garzia', function(req, res) {
    res.sendfile(__dirname + '/garzia/index.html');
});
// PREITE
app.get('/preite', function(req, res) {
    res.sendfile(__dirname + '/preite/index.html');
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

var socket = this;
io.sockets.on('connection', function (socket) {
    // The username for this socket.
    console.log("connection!");
    //save the first user
    //clients.push(socket.id);
    for(var i=0;i<clients.length;i++){
        console.log(clients[i]);
    }
    //io.sockets.socket(clients[0]).emit("greeting", "user0");
    var users = {
            "verardi":"verardi",
            "garzia":"garzia",
            "client":"client",
            "frisenda":"frisenda",
            "preite":"preite"
        };
    var actions = {
            'left':'left',
            'right':'right',
            'refresh':'refresh',
            'changeNews':'changeNews'
            };
    
    var events2 = {};
    
    for(var action in actions)
    {
        for(var user in users)
        {
            key = user +'-'+action;
            console.log(key);
            
            events2[key] = function(data){
                        console.log(user + ' --- ' +  action);
                        socket.broadcast.emit(user +' --- '+action);
                    };            
        }
    }
        console.log(JSON.stringify(events2));
    
    var events = {
        "verardi-left": function(data){
            console.log('verardi-left, data: '+data);
            socket.broadcast.emit('verardi-left', 'verardi-left');
        },
        "verardi-right": function(data){
            console.log('verardi-right, data: ' + data);
            socket.broadcast.emit('verardi-right', 'verardi-right');
        },
        "verardi-refresh": function(data){
            console.log('verardi-refresh data: ' + data);
            socket.broadcast.emit('verardi-refresh', 'verardi-refresh');
        },
        "verardi-changeNews": function(data){
            console.log('verardi-changeNews data:' + data);
            //socket.broadcast.emit('verardi-changeNews', 'verardi-changeNews');
        },
        
        "garzia-left": function(data){
            console.log('garzia-left, data: '+data);
            socket.broadcast.emit('garzia-left', 'garzia-left');
        },
        "garzia-right": function(data){
            console.log('garzia-right, data: ' + data);
            socket.broadcast.emit('garzia-right', 'garzia-right');
        },
        "garzia-refresh": function(data){
            console.log('garzia-refresh, data: ' + data);
            socket.broadcast.emit('garzia-refresh', 'garzia-refresh');
        },
        "garzia-changeNews": function(data){
            console.log('garzia-changeNews data:' + data);
            //socket.broadcast.emit('garzia-changeNews', 'garzia-changeNews');
        },
        
        "client-right": function(data){
            console.log('client-right, data: ' + data);
            socket.broadcast.emit('client-right', 'client-right');
        },
        "client-left": function(data){
            console.log('client-left, data: ' + data);
            socket.broadcast.emit('client-left', 'client-left');
        },
        "client-refresh": function(data){
            console.log('client-refresh data: ' + data);
            socket.broadcast.emit('refresh', 'client-refresh');
        },
        "client-changeNews": function(data){
            console.log('client-changeNews data:' + data);
            //socket.broadcast.emit('client-changeNews', 'client-right');
        },
        
        "frisenda-right": function(data){
            console.log('frisenda-right, data: ' + data);
            socket.broadcast.emit('frisenda-right', 'frisenda-right');
        },
        "frisenda-left": function(data){
            console.log('frisenda-left, data: ' + data);
            socket.broadcast.emit('frisenda-left', 'frisenda-left');
        },
        "frisenda-refresh": function(data){
            console.log('frisenda-refresh data: ' + data);
            socket.broadcast.emit('frisenda-refresh', 'frisenda-refresh');
        },
        "frisenda-changeNews": function(data){
            console.log('frisenda-changeNews data:' + data);
            //socket.broadcast.emit('frisenda-changeNews',  'frisenda-changeNews');
        },
        
        
        "preite-right": function(data){
            console.log('preite-right, data: ' + data);
            socket.broadcast.emit('preite-right',  'preite-right');
        },
        "preite-left": function(data){
            console.log('preite-left, data: ' + data);
            socket.broadcast.emit('preite-left',  'preite-left');
        },
        "preite-refresh": function(data){
            console.log('preite-refresh data: ' + data);
            socket.broadcast.emit('refresh',  'preite-refresh');
        },
        "preite-changeNews": function(data){
            console.log('preite-changeNews data:' + data);
            //socket.broadcast.emit('preite-changeNews', 'preite-changeNews');
        },
    };
    
    for (var method in events) {
        var dynamicHandler = function (realMethod) 
        {
            socket.on(realMethod, function (data) {
                console.log('CONTROL: received -->'+realMethod);
                //console.log('DATA: received '+JSON.stringify(data.dataVal));
                events[realMethod].apply(this, data);
            });
        };
        dynamicHandler(method);
        /*
         *  OLD SOLUTION DIDN'T WORK
        (function (realMethod) {
            socket.on(realMethod, function (data) {
                console.log('CONTROL: received '+realMethod);
                
                events[realMethod].apply(this, data);
            });
        })(method);
        */
    }
    
        /* ON CHANGE NEWS USATO QUI PER SPARARE I DATI NEL CLIENT: 
        socket.on('verardi-changeNews', function(data){
            console.log("server data log data.action:"+data.action);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('verardi-changeNews', data.action);
	});
        
        socket.on('frisenda-changeNews', function(data){
            console.log("server data log data.action:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('frisenda-changeNews', data.action);
	});
        
        socket.on('client-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('client-changeNews', data.action);
	});
        
        socket.on('garzia-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('garzia-changeNews', data.action);
	});
        
        socket.on('preite-changeNews', function(data){
            console.log("data log from server:"+data);
            //io.sockets.emit('right', { action: 'right' });
            socket.broadcast.emit('garzia-changeNews', data.action);
	});
        */
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
            console.log('disconnect!');
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
});
