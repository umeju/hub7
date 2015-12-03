$(document).ready(function () {
    //$('#prev').contents().find('body').html('<div> blah </div>');
    //
    //
    //get userid val from last div in the html page
    var userID = $('#userID').text();
    
    var directions = ['left','stop','right'];
    
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
        socket.emit('verardi-changeNews', {action: category});
    });
    
    /*
     * cambiare src iframe al click da cell:
     * $('iframe').attr('src','http://192.168.1.8/~division/testv/testvv/index2.php')
     * 
     * 
     * <iframe width="560" height="315" 
     *  src="https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RmObuh2zatbiSNKCUAxr8H" 
     *  frameborder="0" allowfullscreen>
     * </iframe>
     * 
     * 
     */
    
    $('<iframe>', {
        src: 'https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RmObuh2zatbiSNKCUAxr8H&autoplay=0&loop=1',
        id:  'myFrame',
        class: 'visible-sm-myFrame',
        frameborder: 0,
        scrolling: 'no',
        width: 600,
        height: 450
    }).prependTo('#iframeContainer');
    
    $('<iframe>', {
        src: 'http://www.di-vision.org/news/',
        id:  'myFrame2',
        class: 'iframes visible-sm-iframes',
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
    
    $('.stop').click(function (){
        console.log('stop clicked!');
        clickedTagID = this.id;
        myEmit('stop', clickedTagID);
    });
    
    function myEmit(actionToDo, clickedTagID){
        socket.emit(userID+'-'+actionToDo, {action: clickedTagID});
        /*
         * esempio:
         * userID: 99999
         * actionToDo: left
         * clickedTagID: 99999-left
         */
    }
    function changeNewsCategory(newsCategory){
        $('#myFrame2').attr('src','http://www.di-vision.org/news/index.php?news=' +
                newsCategory);
        $('.newsCategory').text("NEWS: " + newsCategory);
        $('.actualNews').text(newsCategory);
        $('.actualNews').show();
        
    }
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
    /*
    $('.left').on('click', function (e) {
        //console.log('click on left! emit left');
        //socket.emit('left', {action: this.id});
    });

    $('.right').on('click', function (e) {
        //console.log('click on right! emit right');
        //socket.emit('right', {action: this.id});
    });
    
    $('.stop').on('click', function (e) {
        //console.log('stop clicked!');
        //socket.emit('stop', {action: this.id});
    });
    */
    /*
    $('#checkbox').change(function () {
        setInterval(function () {
            moveRight();
        }, 6000);
    });*/
    
    (function (exports){
        var socket = io.connect(socketURI);
        
        socket.on('connect', function (data) {
            //socket.emit('storeClientInfo', { customId:"000_verardiJS_0000" });
        });
        /*
        socket.on('greeting', function (data) {
            console.log('greeting '+data);
        });*/
        socket.on('verardi-left', function (data) {
            console.log('codejs client slide to left ' + data);
            oneLess();
        });
        socket.on('verardi-right', function (data) {
            console.log('codejs client  slide to right ' + data);
            oneMore();
        });
        socket.on('verardi-stop', function (data) {
            console.log('client code l-92: stop/start ' + data);
        });
        socket.on('verardi-changeNews', function (data) {
            changeNewsCategory(data);
        });
        /*
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
        });*/
        
        // export
        exports.socket = socket;
    })(window);
});

