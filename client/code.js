$(document).ready(function() {
    var items = [];
    var getNews = function(){
        
        //var url = 'http://localhost/slider/test.php?callback=?';
        var url = 'http://www.di-vision.org/pediatra/feedOpenshift.php?callback=?';
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (json) {
                console.dir(json.sites);
                $.each(json.sites, function (key, val) {
//                    items.push("<li>" + val.titolo + "<br/>" + val.descrizione + "</li>");
                    items.push("<h2 class='red_background'>" + val.titolo + "</h2><br/><p class='scroll_text'>" + val.descrizione + "</p>");    
                });
                putInPage(items);
            },
            error: function (e) {
                console.log(e.message);
            }
        });
    };
    getNews();

    function putInPage(items){
        var items = items;
	var i = 1;	
	$('.allNews').css({"marginLeft": "0px" });
                   $('.allNews').html(items[0]);
        $(".scroll_text").animate({ 
			"marginLeft": "-=9200px" }, 90000, "linear" );
	
        setInterval(
                function(){

                   $('.allNews').css({"marginLeft": "0px" });
                   $('.allNews').html(items[i]);
		   $(".scroll_text").animate({ 
			"marginLeft": "-=9200px" }, 90000, "linear" );
                    if(i<10){
                        i++;
                    }else{
                        i=0;
                    }
                }, 90000);
    }

/*
function scroll(){

for (i = 0; i < 10000; i++) {
	$(".scroll_text").css("margin-left", '-'+i+'px');
}
$(".scroll_text").animate({
    			marginLeft: '-=338px'
		}, 500);

}
*/    
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

