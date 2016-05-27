$(document).ready(function () {
    //$('#prev').contents().find('body').html('<div> blah </div>');
    //
    //
    //get userid val from last div in the html page
    var userID = $('#userID').text();
//    var galleryUrl = "http://localhost/~roberto/progetti-copia/spedicato/superslide/examples/preserved-images.html";
    var galleryUrl = "http://www.di-vision.org/verardi/venobox/";
    
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
     
     <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RgbrzuM6cXr9JiU5gjFrM_" frameborder="0" allowfullscreen></iframe>
     
     
     */
     var playlist = "https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RgbrzuM6cXr9JiU5gjFrM_";//cantine 2 palme
     var playlist = "https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9T7abW8PGKOF8RKj8LXGrZf";//sfilate
     
    if ($(window).width() > 500) {
        $('<iframe>', {
            src: playlist + '&amp;controls=0&amp;showinfo=0&amp;autoplay=1&amp;loop=1',
            id: 'myFrame',
            class: 'class',
            frameborder: 0,
            scrolling: 'no',
            width: 800,
            height: 600
        }).prependTo('#iframeContainer');

        $('<iframe>', {
            src: 'http://www.di-vision.org/news/',
            id: 'myFrame2',
            class: 'iframes',
            frameborder: 0,
            scrolling: 'no'
        }).prependTo('.iframe-wrapper');
    }
    
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
    
    function myEmit(actionToDo, clickedTagID){
    	//socket.emit(userID+'-'+actionToDo, {action: clickedTagID, dataVal: "esempio-data"});
    	//socket.emit(userID+'-'+actionToDo, {action: clickedTagID, dataVal: actionToDo});
    	//socket.emit(actionToDo, {action: actionToDo, dataVal: actionToDo});
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
    
    
    $('.infoleft').on('click', function (e) {
    	window.open("http://192.168.1.126:8080/spedicato");
    });
    
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
        
        socket.on('connect', function (data) {
            //socket.emit('storeClientInfo', { customId:"000_spedicatoJS_0000" });
        });
        /*
        socket.on('greeting', function (data) {
            console.log('greeting '+data);
        });*/
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

        
        // export
        exports.socket = socket;
    })(window);
});

