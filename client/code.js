$(document).ready(function() {

    (function (exports) {
        // We use socket.io as our bridge. It will sort out what sort of
        // connection we're going to use.
        var socket = io.connect(socketURI);
        // These are events reserved by socket.io, and we listen in.
        socket.on('connect', function() {
            messages.info('connection to server established.');
        });
        socket.on('error', function() {
            messages.error('sorry, we are experiencing technical difficulties.');
        });
        socket.once('disconnect', function() {
            messages.info('you have disconnected from the server.');
            users.clear();
        });
        // These are custom events, published by the server.
        socket.on('chat', function (data) {
            messages.chat(data);
        });
        socket.on('user-list', function(data) {
            users.update(data);
        });

        // export
        exports.socket = socket;
    })(window);



    // Message management.
    (function(exports) {
        // Templates we'll use:
        var template = Handlebars.compile($("#message-template").html());

        // How many messages do we allow to be displayed at any one time
        // in the client?
        var messageLimit = 100;
        // Current list of messages.
        var messageList = [];

        var writeMessage = function(data) {
            // Build our HTML from the associated template.
            var message = template(data);
            messageList.unshift(message);
            messageList = messageList.slice(0, messageLimit);
            // Write the current history of messages.
            $('#messages ul').html(messageList.join(''));
        };

        // Export.
        exports.messages = {
            // Info and error are overloaded methods that can take objects
            // as a parameter, or they can just take a string, which are
            // occasionally used to have the web browser participant in
            // the chat (aka. log messages from the browser's perspective).
            'info': function(data) {
                if (typeof data == "string") {
                    // String arguments only happen in the client.
                    data = Message(data, User("web browser"));
                }
                writeMessage(data);
            },
            'error': function(data) {
                if (typeof data == "string") {
                    // String arguments only happen in the client.
                    data = Message(data, User("web browser"), "error");
                }
                writeMessage(data);
            },
            'chat': function(data) {
                if (data.user.name == user.name) {
                    // Since data is not reused, modify messages directly
                    // for client use.
                    data.type = 'echo';
                }
                writeMessage(data);
            }
        };
    })(window);



    // User management.
    (function(exports) {
        // Only 1 template for our user list.
        var template =  Handlebars.compile($("#userlist-template").html());

        // Users are always updated en-masse.
        var update = function(data) {
            $('#users ul').html(template(data));
        };

        var clear = function() {
            $('#users ul').empty();
        };

        // export
        exports.users = {
            'update': update,
            'clear': clear
        };
    })(window);



    // Information about the person using the client (the person in your chair).
    (function(exports) {
        var user = User();
        // Mixin some client side functionality for our user.
        user.setName = function(name) {
            this.name = name;
            // Publish our name change to the server.
            socket.emit('set-name', {
                'username': name
            });
        };

        exports.user = user;
    })(window);



    // Setup DOM event listeners.
    $('#status-update-form input[type="text"]').on('keydown', function(e) {
        // The context of the message is determined by our state.
        var message = $(this).val();

        // Send a message to everyone on the return key.
        if (e.which == 13 && message && socket.socket.connected) {
            if (!user.name) {
                // Attempt to name ourselves first.
                user.setName(message);
            }
            else {
                // Normal message broadcast.
                socket.emit('chat', {
                    'user': user,
                    'message': message
                });
            }
            // Clean out the value for the next input.
            $(this).val("");
        }
    });
    $('#status-update-form button').on('click', function(e) {
        //socket.disconnect();
    });

	$('#left').on('click', function(e) {
        console.log('oooh!');
		$( "a.control_next" ).trigger( "click" );
    });

	$('#right').on('click', function(e) {
        console.log('uuuh!');
		$( "a.control_prev" ).trigger( "click" );

    });





  $('#checkbox').change(function(){
    setInterval(function () {
        moveRight();
    }, 3000);
  });

	var slideCount = $('#slider ul li').length;
	var slideWidth = $('#slider ul li').width();
	var slideHeight = $('#slider ul li').height();
	var sliderUlWidth = slideCount * slideWidth;

	$('#slider').css({ width: slideWidth, height: slideHeight });

	$('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        $('#slider ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('#slider ul li:last-child').prependTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        $('#slider ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });


});

