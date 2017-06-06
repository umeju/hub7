var PORT = process.env.OPENSHIFT_INTERNAL_PORT
		|| process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP
	//	|| process.env.OPENSHIFT_NODEJS_IP || '192.168.1.104' || '127.0.0.1';
	//	|| process.env.OPENSHIFT_NODEJS_IP || '192.168.43.74' || '127.0.0.1';

//                || process.env.OPENSHIFT_NODEJS_IP || '192.168.1.40' || '127.0.0.1';
	      || process.env.OPENSHIFT_NODEJS_IP || '192.168.1.103' || '127.0.0.1';


var express = require('express');
//var reload = require('reload');
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
/*
 * VAR TO GET DATA FROM THE FRONT END 
 * WE SAVE IT EACH TIME TO USE IN THE event{a:function(testData)}
 */
var testData = '';
var socket = this;
// Setup a very simple express application.
app = express();
// Allow cross origin requests.
app.use(function(req, res, next) {
    var origin = '*';
    try {
        var parts = req.headers.referer.split('/').filter(function(n) {
                return n;
        });
        if (parts.length >= 2) {
                origin = parts[0] + '//' + parts[1];
        }
        /*	console.log(parts[0]); //--> http:
                console.log(parts[1]); //--> 192.168.xxx.xxx
                console.log(parts[2]); //--> tattoo
        * */
        testData = parts[2];
    } catch (e) {}

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// How we pass our websocket URL to the client.
app.use('/varSocketURI.js', function(req, res) {
	var port = argv['websocket-port'];
	// Modify the URI only if we pass an optional connection port in.
	var socketURI = port ? ':' + port + '/' : '/';
	res.set('Content-Type', 'text/javascript');
	res.send('var socketURI=window.location.hostname+"' + socketURI + '";');
});
// The client path is for client specific code.
app.use('/client', express.static(__dirname + '/client'));
// The common path is for shared code: used by both client and server.
app.use('/common', express.static(__dirname + '/common'));
app.use('/audio', express.static(__dirname + '/audio'));
app.use('/pages', express.static(__dirname + '/pages'));

// The root path should serve the client HTML.
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/client/index.html');
});
// The root path should serve the client HTML.
// ROMANO
app.get('/romano', function(req, res) {
	res.sendfile(__dirname + '/romano/index.html');
});// VERARDI
app.get('/verardi', function(req, res) {
	res.sendfile(__dirname + '/verardi/index.html');
});
app.get('/verardi/remote', function(req, res) {
	res.sendfile(__dirname + '/verardi/remote.html');
});
app.get('/verardi/2', function(req, res) {
	res.sendfile(__dirname + '/verardi/index2.html');
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
// MARINI
app.get('/marini', function(req, res) {
	res.sendfile(__dirname + '/marini/index.html');
});
//LICIGNANO
app.get('/licignano', function(req, res) {
	res.sendfile(__dirname + '/licignano/index.html');
});
//SPEDICATO
app.get('/spedicato', function(req, res) {
	res.sendfile(__dirname + '/spedicato/index.html');
});
//HOLTANNA
app.get('/holtanna', function(req, res) {
	res.sendfile(__dirname + '/holtanna/index.html');
});
app.get('/tattoo', function(req, res) {
	res.sendfile(__dirname + '/tattoo/index.html');
});
app.get('/marinelli', function(req, res) {
	res.sendfile(__dirname + '/marinelli/index.html');
});
app.get('/2palme', function(req, res) {
	res.sendfile(__dirname + '/2palme/index.html');
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

io.sockets.on('connection',
    function(socket) {
            
        console.log('client connected');
        //*******  PARAMETRICO !!!  ********* TELECOMANDO ESTERNO ALLA PAGINA
        app.get("/pages/:action/:ID", function(req, res) {
                    //var event = req.params.event;
            var data = {
                "pages": {
                        "action": req.params.action,
                        "ID": req.params.ID
                }
            };
            var referID = data.pages.ID;
            var referAction = data.pages.action;
            
            // the user was found and is available in req.user
            console.log(req.user);
          socket.broadcast.emit(data.pages.ID+'-'+data.pages.action, data.pages.ID+'-'+data.pages.action);
          //  socket.volatile.emit(data.pages.ID+'-'+data.pages.action, data.pages.ID+'-'+data.pages.action);
            
            console.log("data.pages.ID: "+data.pages.ID);
            console.log("data.pages.action: "+data.pages.action);
            res.send(data);
        });
    /*
    function lkj() {
        app.param('name', function(req, res, next, name) {
                // save name to the request
                req.name = modified;
                next();
        });
    }  
    //	************	save the first user
    //clients.push(socket.id);
    
     * for (var i = 0; i < clients.length; i++) {
                    console.log(clients[i]);
            }
    
    io.sockets.socket(clients[0]).emit("greeting", "user0");
    
    var obj = arr.reduce(function(o, v, i) {
            o[i] = v;
            return o;
    }, {});
         */
        //mapping all the possible events
        ev = [
            'right',
            'left',
            'changeNews',
            'refresh',
            'tab0',
            'tab1',
            'tab2',
            'showFlashMsg',
            'zoomOut',

        ];
        // love to have all events here:
        var events = ev.reduce(function(result, item) {
            result[item] = function(data) {
                console.log("emit: "+testData + '-'+item+"data: "+testData + '-'+item);
                socket.broadcast.emit(testData + '-'+item, testData + '-'+item);
                //socket.volatile.emit(testData + '-'+item, testData + '-'+item);
            }
            return result;
        }, {});
        
        //console.log(events);
        /*old events obj
        var events = {
                "left" : function(data) {
                        console.log('new-left, testData: ' + testData);
                        socket.broadcast.emit(testData + '-left', testData
                                        + '-left');
                },
                "right" : function(data) {
                        console.log('new-right, testData: ' + testData);
                        socket.broadcast.emit(testData + '-right', testData
                                        + '-right');
                },
                "changeNews" : function(data) {
                        console.log('new-changeNews, testData: ' + testData);
                        socket.broadcast.emit('changeNews', testData
                                        + '-changeNews');
                },
                "refresh" : function(data) {
                        console.log('new-refresh, testData: ' + testData);
                        socket.broadcast.emit(testData + '-refresh', testData
                                        + '-refresh');
                },
                "tab1" : function(data) {
                        console.log('tab1, testData: ' + testData);
                        socket.broadcast.emit(testData + '-tab1', testData
                                        + '-tab1');
                },
                "tab2" : function(data) {
                        console.log('tab2, testData: ' + testData);
                        socket.broadcast.emit(testData + '-tab2', testData
                                        + '-tab2');
                },

                //************ FLASH MESSAGES PER GARZIA *********
                "showFlashMsg" : function(data) {
                        msgText = splitMsg(testData);
                        socket.broadcast.emit('garzia-showFlashMsg', msgText);
                },
        }*/
        //***********************   magic happensss:  ************************
        for ( var method in events) {
            var dynamicHandler = function(realMethod) {
                socket.on(realMethod, function(data) {
                    /*
                     * console.log('CONTROL: received realMethod -->'
                     * + realMethod);*/
                    console.log('DATA: received -->'+data.dataVal);
                    testData = data.dataVal;
                    console.log('DATA: received '+JSON.stringify(data));
                    events[realMethod].apply(this, data);
                });
            };
            dynamicHandler(method);
        }
        //split message per messaggio sergio garzia tempo reale
        function splitMsg(testData) {
            var array = testData.split(':');
            var lowerCaseString = array[0].toLowerCase();
            console.log('testData: *******************' + lowerCaseString);
            if (lowerCaseString == "seroga2") {
                return array[1];
            } else {
                console.log('Error: *******************' + testData);
                return "error";
            }
        }

        socket.on('storeClientInfo', function(data) {
            /*
            var clientInfo = new Object();
            clientInfo.customId = data.customId;
            clientInfo.clientId = socket.id;
            console.log('clients push: ' + socket.id +' '+data.customId);
            clients.push(clientInfo);
             */
        });

        socket.on('disconnect', function(data) {
                console.log('client disconnected');
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
        socket.on('connect', function(data) {
                console.log('c  lient connected');
        });
    });
