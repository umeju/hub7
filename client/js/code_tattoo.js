$(document).ready(function () {
    //$('#prev').contents().find('body').html('<div> blah </div>');

    //get userid val from last div in the html page
    var userID = $('#userID').text();
    var galleryUrl = "http://www.di-vision.org/tattoo/venobox/";
    
    var directions = ['left','refresh','right'];
    
    // generate images to slide top right news
    for (var x in directions){
        $('<img>', {
            id: userID + "-" + directions[x],
            src: "/common/img/"+directions[x]+"_arrow_sign.png",
            class: "img-circle " + directions[x]
        }).prependTo('#for-' + directions[x]);
    }
    
    $("select.my-select").change(function(){
        var category = $(".my-select option:selected").val();
        console.log("select.my-select - " + category);
        //changeNewsCategory(category);
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });
    $('.btn-warning').on('click', function(){
        var category = $(this).data('category');
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });
    
    /* cambiare src iframe al click da cell:
     * $('iframe').attr('src','http://192.168.1.8/~division/testv/testvv/index2.php')
     * 
     * <iframe width="560" height="315" 
     *  src="https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RmObuh2zatbiSNKCUAxr8H" 
     *  frameborder="0" allowfullscreen>
     * </iframe>
     */

    if ($(window).width() > 500) {
    	/*  hide video top left iframe
        $('<iframe>', {
            //src: 'https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RmObuh2zatbiSNKCUAxr8H&autoplay=0&loop=1',
            src: 'https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9SfGb4dw2Z2Hh_5cI9_pEP-&amp;controls=0&amp;showinfo=0&amp;autoplay=1&amp;loop=1',
            //src: 'https://www.youtube.com/embed/HXjq1O4s3c8?rel=0&autoplay=1&loop=1&amp;controls=0&amp;showinfo=0',
            id: 'myFrame',
            class: 'class',
            frameborder: 0,
            scrolling: 'no',
            width: 600,
            height: 450
        }).prependTo('#iframeContainer');
       */
        
        /* hide news per orlando tattoo
        $('<iframe>', {
            src: 'http://www.di-vision.org/tattoo-news/',
            id: 'myFrame2',
            class: 'iframes',
            frameborder: 0,
            scrolling: 'no'
        }).prependTo('.iframe-wrapper');
        */
    }
    
    var _AGGIORNAMENTO_NEWS = 18000;
    var _TIMEOUT_TIME = 12000;
    
    var _ULTIMORA_URL = 'http://www.di-vision.org/news/index.php?news=ultimora';
    var _TECH_URL = 'http://www.di-vision.org/news/index.php?news=tech';
    var _GOSSIP_URL = 'http://www.di-vision.org/news/index.php?news=gossip';
    var _SPORT_URL = 'http://www.di-vision.org/news/index.php?news=sport';
    
    var count = 0;
    var countFunc = null;
    var clickedTagID = '';
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
    
    $('.right').click(function (){
        console.log('click on right! emit right');
        /*
         * this.id è l'id del tag html su cui 
         * è stato fatto il click:
         */
        clickedTagID = this.id;
        myEmit('right', clickedTagID);
        oneMore();
    });
    
    $('.left').click(function (){
        console.log('click on left! emit left');
        clickedTagID = this.id;
        myEmit('left', clickedTagID);
        oneLess();
    });
    
    $('.refresh').click(function (){
        console.log('refresh clicked!');
        clickedTagID = this.id;
        myEmit('refresh', clickedTagID);
    });
    $('.tabs').click(function (){
        console.log('p1 p2!');
        clickedTagID = this.id;
        
        myEmit(clickedTagID, clickedTagID);
    });
    
    function myEmit(actionToDo, clickedTagID){
    	socket.emit(actionToDo, {action: actionToDo, dataVal: userID});
    	
        /*
         * esempio:
         * userID: 99999
         * actionToDo: left
         * clickedTagID: 99999-left
         */
    }

    function splitNewsName(data) {
    	newsName = data.split('-');
    	return newsName;
    }    
    
    function changeNewsCategory(newsCategory){
        newsCategorySplitted = splitNewsName(newsCategory);
        //gestire hi tech con spazio o trattino
        switch(newsCategorySplitted[1]) {
            case "HI TECH":
            console.log('poi' + newsCategorySplitted[1]);
            newsCategorySplitted[1] = "HI-TECH";
            default:
        }
    	  
        $('#myFrame2').attr('src','http://www.di-vision.org/news/index.php?news=' +
            newsCategorySplitted[1]);

        $('.newsCategory').text("NEWS: " + newsCategorySplitted[1]);
        $('.actualNews').text(newsCategory);
        $('.actualNews').show();
    }
    // move 1 pic back
    function oneLess(){
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        
        count -=1;
        if(count > $('.notizia').length-1){
            count = 0;
        }
        
        if(count == -1){
            count = $('.notizia').length-1;
        }
        loopNews();
    }
    // move 1 pic ahead
    function oneMore(){
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        
        count +=1;
        if(count > $('.notizia').length-1){
            count = 0;
        }
        
        if(count == -1){
            count = $('.notizia').length-1;
        }
        loopNews();
    }
    
    function refresh(){
        location.reload();
    }
    
    $('.newsCategory').on('click', function (e) {
    	window.close();
    });
    
    $(".logoframe").hover(function() {
    	animShow($("#interaction"));
    	animShow($("#gallerySpan"));
    	//$('#close-image').slideDown();
    });
    
    $("#gallerySpan").hover(function() {
    	//location.replace("http://www.di-vision.org/spedicato/superslide/examples/preserved-images.html#1");
//    	location.replace(galleryUrl);
    });
    
    $('#close-image').hover(function() {
    	animHide($("#interaction"));
        //$('#close-image').slideUp();
    });

    function animShow(obj) {
    	obj.fadeIn('slow', function(){
            $('#close-image').fadeIn('slow');
    	});
    }
    
    function animHide(obj) {
        obj.fadeOut('slow', function(){
            $('#close-image').fadeOut('slow');
        });
    }
    
    (function (exports){
        var socket = io.connect(socketURI);
        
        socket.on('connection', function (data) {
            socket.emit('connect', { customId:"000_spedicatoJS_0000" });
        });
        socket.on(userID + '-left', function (data) {
            console.log('codejs client slide to left ' + data);
            oneLess();
        });
        socket.on(userID + '-right', function (data) {
            console.log('codejs client  slide to right ' + data);
            oneMore();
        });
        
        socket.on(userID + '-refresh', function (data) {
            console.log('client code l-92: refresh/start ' + data);
            refresh();
        });
        socket.on('changeNews', function (data) {
            console.log('codejs client  slide to changeNews ' + data);
            changeNewsCategory(data);
        });
        
        socket.on(userID + '-tab1', function (data) {
            console.log('tab1 ' + data);
            $("#panel-1").trigger('click');
        });
        
        socket.on(userID + '-tab2', function (data) {
            console.log('tab2 ' + data);
            $("#panel-2").trigger('click');
        });
        exports.socket = socket;
    })(window);
});