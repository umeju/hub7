$(document).ready(function() {

    (function (exports)
	{
        var socket = io.connect(socketURI);

		socket.on('left', function(data) {
            console.log('client listen on left');
			console.log("data log from client:"+data);
			$( "a.control_prev" ).trigger( "click" );
        });

		socket.on('right', function(data) {
            console.log('client listen on right');
			console.log("data log from client:"+data);
			$( "a.control_next" ).trigger( "click" );
        });



        // export
        exports.socket = socket;
    })(window);

		$('#left').on('click', function(e) {
			console.log('click on left!');
			//$( "a.control_next" ).trigger( "click" );
			socket.emit('left', { action: 'left' });
		});

		$('#right').on('click', function(e) {
			console.log('click on right!');
			//$( "a.control_prev" ).trigger( "click" );
			socket.emit('right', { action: 'right' });
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

