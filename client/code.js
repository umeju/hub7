$(document).ready(function () {


    var _AGGIORNAMENTO_NEWS = 34000
    
    var winW = $(window).width();
    var winH = $(window).height();

    var items = [];
    var getNews = function () {

        //var url = 'http://localhost/slider/test.php?callback=?';
        var url = 'http://www.di-vision.org/feedOpenshift.php?callback=?';
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (json) {

                //console.dir(json.sites);

                $.each(json.sites, function (key, val) {
//                    items.push("<li>" + val.titolo + "<br/>" + val.descrizione + "</li>");
                    items.push("<h2 class='red_background'>"
                            + val.titolo
                            + "</h2><br> <div id='scroll_text'><p class='scroll_text'>"
                            + val.descrizione + "</p></div>");
                });
                putInPage(items);
            },
            error: function (e) {
                console.log(e.message);
            }
        });
    };
    getNews();

    function showNews(i) {
        /* visualizzo la prima notizia */
        $('.allNews').hide().html(items[i]).fadeIn('slow');
    }
    
    function putInPage(items) {
        var items = items;
        var i = 0;
        //show last news at first 
        showNews(10);
        
        var interval = setInterval(
            function () {
                showNews(i);

                if (i < 10) {
                    i++;
                } else {
                    i = 0;
                }
            }, _AGGIORNAMENTO_NEWS);

        setInterval(
            function () {
                $('.scroll_text').animate({
                    "marginTop": "-=70px"
                }, 3500, "linear");
                //loop();
            }, 1000);

    }

    (function (exports){
        var socket = io.connect(socketURI);

        socket.on('left', function (data) {
            console.log('client cod l-83: slide to left');
            /*console.log("data log from client:" + data);
            $("a.control_prev").trigger("click");
            $(".glyphicon-chevron-left").trigger("click");
            */
            slideToLeft();
$.playSound('/client/bip');
        });

        socket.on('right', function (data) {
            console.log('client cod l-83: slide to right');
            /*console.log("data log from client:" + data);
            $("a.control_next").trigger("click");
            $(".glyphicon-chevron-right").trigger("click");
            */
            slideToRight();
$.playSound('/client/bip');
        });
        
        socket.on('stop', function (data) {
            console.log('client code l-92: stop/start');
            /*console.log("data log from client:" + data);
            $("a.control_next").trigger("click");
            $(".glyphicon-chevron-right").trigger("click");
            */
            stopSlide();
        });
        
        // export
        exports.socket = socket;
    })(window);

    $('#left').on('click', function (e) {
        console.log('click on left!');
        //$( "a.control_next" ).trigger( "click" );
        socket.emit('left', {action: 'left'});
    });

    $('#right').on('click', function (e) {
        console.log('click on right!');
        //$( "a.control_prev" ).trigger( "click" );
        socket.emit('right', {action: 'right'});
    });
    
    $('#stop').on('click', function (e) {
        console.log('stop clicked!');
        //$( "a.control_prev" ).trigger( "click" );
        socket.emit('stop', {action: 'stop'});
    });
    
    $('#checkbox').change(function () {
        setInterval(function () {
            moveRight();
        }, 6000);
    });

    var slideCount = $('#slider ul li').length;
    var slideWidth = $('#slider ul li').width();
    var slideHeight = $('#slider ul li').height();
    var sliderUlWidth = slideCount * slideWidth;

    $('#slider').css({width: slideWidth, height: slideHeight});

    $('#slider ul').css({width: sliderUlWidth, marginLeft: -slideWidth});

    $('#slider ul li:last-child').prependTo('#slider ul');

    $('#left').click(function () {
        moveLeft();
    });

    $('#right').click(function () {
        moveRight();
    });

    function moveLeft() {
        $(".glyphicon-chevron-left").trigger("click");

        $('#slider ul').animate({
            left: +slideWidth
        }, 200, function () {
            $('#slider ul li:last-child').prependTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        $(".glyphicon-chevron-right").trigger("click");

        $('#slider ul').animate({
            left: -slideWidth
        }, 200, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function slideToLeft() {
        $shownImg = $('.my_image').parent().find('.activate');
        $shownImg.hide();
        $shownImg.removeClass('activate');
        if ($shownImg.next()[0] !== undefined) {
            $shownImg.next().fadeIn().addClass('activate');
        } else {
            showByIndex(0);
        }
    }

    function slideToRight() {
        $shownImg = $('.my_image').parent().find('.activate');
        $shownImg.hide();
        $shownImg.removeClass('activate');
        if ($shownImg.prev()[0] !== undefined) {
            $shownImg.prev().fadeIn().addClass('activate');
        } else {
            showByIndex(2);
        }
    }
    
    function stopSlide() {
        stopStartFlag();
    }


});

