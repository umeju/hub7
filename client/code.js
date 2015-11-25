$(document).ready(function () {
    /*
     * cambiare src iframe al click da cell:
     * $('iframe').attr('src','http://192.168.1.8/~division/testv/testvv/index2.php')
     * 
     */
    $('<iframe>', {
        src: 'https://www.youtube.com/embed/YQHsXMglC9A?list=PLFgquLnL59amLh5g4ZZoSl1Wf9e0_rco7&autoplay=0&loop=1',
        id:  'myFrame',
        frameborder: 0,
        scrolling: 'no',
        width: 600,
        height: 450
    }).prependTo('#iframeContainer');
    
    $('<iframe>', {
        src: 'http://www.di-vision.org/news/',
        id:  'myFrame2',
        class: 'iframes',
        frameborder: 0,
        scrolling: 'no'
    }).prependTo('.iframe-wrapper');
    
    
    var _AGGIORNAMENTO_NEWS = 18000;
    var _TIMEOUT_TIME = 12000;
    /*
    var _ULTIMORA_URL = 'http://www.di-vision.org/getFeedUltimora.php?newsType=ultimora';
    var _TECH_URL = 'http://www.di-vision.org/getFeedUltimora.php?newsType=tech';
    var _GOSSIP_URL = 'http://www.di-vision.org/getFeedUltimora.php?newsType=gossip';
    var _CALCIO_URL = 'http://www.di-vision.org/getFeedUltimora.php?newsType=calcio';
    */
    var _ULTIMORA_URL = 'http://www.di-vision.org/news/index.php?news=ultimora';
    var _TECH_URL = 'http://www.di-vision.org/news/index.php?news=tech';
    var _GOSSIP_URL = 'http://www.di-vision.org/news/index.php?news=gossip';
    var _SPORT_URL = 'http://www.di-vision.org/news/index.php?news=sport';
    
    
    
    var count = 0;
    var countFunc = null;
    
    function runInterval(cmd) {
        if(countFunc !== null) return;
        if(cmd === "start"){
            countFunc = setInterval(function () {
                count += 1;
                if (count > $('.notizia').length) {
                    count = 0;
                }
                loopNews();
            }, _AGGIORNAMENTO_NEWS);
            
        } else { // stop
            setTimeout(function(){
                runInterval("start");
            }, _TIMEOUT_TIME);
        }
    }
    
    runInterval("start");

    function loopNews(){
        notizie = $('.notizia');
        notizie.hide();
        notizia = $('.notizia').eq(count);
        notizia.css('display','inline-block');
    }
    
    $('#right').click(function (){
        oneMore();
    });
    
    $('#left').click(function (){
        oneLess();
    });
    // move 1 pic back
    function oneLess(){
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        
        count -=1;
        if(count > $('.notizia').length){
            count = 0;
        }
        loopNews();
    }
    // move 1 pic ahead
    function oneMore(){
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        
        count +=1;
        if(count > $('.notizia').length){
            count = 0;
        }
        loopNews();
    }
    
    (function (exports){
        var socket = io.connect(socketURI);

        socket.on('left', function (data) {
            console.log('codejs client slide to left');
            /*console.log("data log from client:" + data);
            $("a.control_prev").trigger("click");
            $(".glyphicon-chevron-left").trigger("click");
            */
            slideToLeft();
            oneMore()();
        });

        socket.on('right', function (data) {
            console.log('codejs client  slide to right');
            /*console.log("data log from client:" + data);
            $("a.control_next").trigger("click");
            $(".glyphicon-chevron-right").trigger("click");
            */
            slideToRight();
            oneMore();
        });
        
        socket.on('stop', function (data) {
            console.log('client code l-92: stop/start');
            /*console.log("data log from client:" + data);
            $("a.control_next").trigger("click");
            $(".glyphicon-chevron-right").trigger("click");
            */
            stopSlide();
        });
        
        /*
         * INTERAZIONE PER NEWS
         */
        socket.on('news-calcio', function (data) {
            console.log('news calcio clicked');
            $('#myFrame2').attr('src',_CALCIO_URL);
        });
        
        socket.on('news-ultimora', function (data) {
            console.log('news calcio clicked');
            $('#myFrame2').attr('src',_ULTIMORA_URL);
        });
        
        socket.on('news-gossip', function (data) {
            console.log('news calcio clicked');
            $('#myFrame2').attr('src',_GOSSIP_URL);
        });
        
        socket.on('news-tech', function (data) {
            console.log('news calcio clicked');
            $('#myFrame2').attr('src',_TECH_URL);
            console(_TECH_URL);
        });
        
        // export
        exports.socket = socket;
    })(window);
    

    $('#left').on('click', function (e) {
        console.log('click on left! emit left');
        //$( "a.control_next" ).trigger( "click" );
        socket.emit('news-tech', {action: 'news-tech'}); //send to js server 
        $('#myFrame2').attr('src','http://www.di-vision.org/news/index.php?news=gossip')
    });

    $('#right').on('click', function (e) {
        console.log('click on right! emit right');
        //$( "a.control_prev" ).trigger( "click" );
        socket.emit('right', {action: 'right'});
        $('#myFrame2').attr('src','http://www.di-vision.org/news/index.php?news=tech');
    });
    
    $('#stop').on('click', function (e) {
        console.log('stop clicked!');
        
        //$( "a.control_prev" ).trigger( "click" );
        socket.emit('stop', {action: 'stop'});
    });
    /*
    $('#checkbox').change(function () {
        setInterval(function () {
            moveRight();
        }, 6000);
    });*/

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
//TODO: nuovo slide action con criterio usato per immagini .eq(index)
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

