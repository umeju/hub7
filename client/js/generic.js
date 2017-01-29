$(document).ready(function () {
    /* get params form url in html page */
    var QueryString = function () {
        /* This function is anonymous, is executed immediately and 
         the return value is assigned to QueryString!
         */
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }();//alert(QueryString.ID + "asd");
    //get userid val from last div in the html page
    var userID = QueryString.ID;//$('#userID').text();
    var h = $(window).height();
    var w = $(window).width();
    var directions = ['left', 'refresh', 'right'];
    
    var _AGGIORNAMENTO_NEWS = 18000,
        _TIMEOUT_TIME = 12000,
        _ULTIMORA_URL = 'http://www.di-vision.org/news/index.php?news=ultimora',
        _TECH_URL = 'http://www.di-vision.org/news/index.php?news=tech',
        _GOSSIP_URL = 'http://www.di-vision.org/news/index.php?news=gossip',
        _SPORT_URL = 'http://www.di-vision.org/news/index.php?news=sport',
        _CALCIO_URL = 'http://www.di-vision.org/news/index.php?news=calcio',
        count = 0,
        countFunc = null,
        clickedTagID = '';
    
    // GENERATE images to slide top right news
    for (var x in directions) {
        $('<img>', {
            id: userID + "-" + directions[x],
            src: "/common/img/" + directions[x] + "_arrow_sign.png",
            class: "img-circle " + directions[x]
        }).prependTo('#for-' + directions[x]);
    }

    $("select.my-select").change(function () {
        var category = $(".my-select option:selected").val();
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });

    $('.btn-warning').on('click', function () {
        var category = $(this).data('category');
        console.log("emit changeNews, userID:" + userID +', category:'+category);
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });
    
    
    if ($(window).width() > 500 && $('.iframe-wrapper').length) 
    {
        /*
         $('<iframe>', {
         src: 'https://www.youtube.com/embed/videoseries?list=PLZX9Y6fsfm9RJq3MvTFD_TkPmA_nUmDZZ&amp;controls=1&amp;showinfo=0&amp;autoplay=1&amp;loop=1',
         id: 'myFrame',
         class: 'class',
         frameborder: 0,
         scrolling: 'no',
         width: 600,
         height: 450
         }).prependTo('#iframeContainer');
         */
        $('<iframe>', {
            src: 'http://www.di-vision.org/news/',
            id: 'myFrame2',
            class: 'iframes',
            frameborder: 0,
            scrolling: 'no'
        }).prependTo('.iframe-wrapper');
    }

    function runInterval(cmd) {
        if (countFunc !== null)
            return;
        if (cmd === "start") {
            countFunc = setInterval(function () {
                count += 1;
                if (count > $('.notizia').length) {
                    count = 0;
                }
                loopNews();
                setDimImg();
            }, _AGGIORNAMENTO_NEWS);

        } else { // stop
            setTimeout(function () {
                runInterval("start");
            }, _TIMEOUT_TIME);
        }
    }
    runInterval("start");

    function loopNews() {
        notizie = $('.notizia');
        notizie.hide();
        notizia = $('.notizia').eq(count);
        notizia.css('display', 'inline-block');
    }

    $('.right').click(function () {
        console.log('click on right! emit right');
        /*
         * this.id è l'id del tag html su cui 
         * è stato fatto il click:
         */
        clickedTagID = this.id;
        myEmit('right', clickedTagID);
        oneMore();
    });

    $('.left').click(function () {
        clickedTagID = this.id;
        myEmit('left', clickedTagID);
        oneLess();
    });
    // zoom function
    $('.refresh').click(function () {
        clickedTagID = this.id;
        $('#tab3').removeClass('hidden');
        myEmit('refresh', clickedTagID);
    });
    
    $('.tabs').click(function (){
        clickedTagID = this.id;
        myEmit(clickedTagID, clickedTagID);
    });
    
    $('#tab3').click(function (){
        $(this).addClass('hidden');
        removeLightBoxImage();
        myEmit('zoomOut', "zoomOut");
    });
    
    function myEmit(actionToDo, clickedTagID) {
        socket.emit(actionToDo, {action: actionToDo, dataVal: userID});
        /*  esempio:
         * userID: 99999
         * actionToDo: left
         * clickedTagID: 99999-left
         */
    }
    
    function splitNewsName(data) {
        newsName = data.split('-');
        return newsName;
    }
    
    /* change News Category */
    function changeNewsCategory(newsCategory) {
        newsCategorySplitted = splitNewsName(newsCategory);
        //gestire hi tech con spazio o trattino
        switch (newsCategorySplitted[1]) {
            case "HI TECH":
                console.log('hi tech change news: ' + newsCategorySplitted[1]);
                newsCategorySplitted[1] = "HI-TECH";
            default:
        }
        $('#myFrame2').attr('src', 'http://www.di-vision.org/news/index.php?news=' +
                newsCategorySplitted[1]);
        console.log(newsCategorySplitted[1]);
        $('.newsCategory').text("NEWS: " + newsCategorySplitted[1]);
        $('.actualNews').text(newsCategory);
        $('.actualNews').show();
    }
    
    function setDimImg()
    {
        if($('.tattoo-img').length){
            $('.tattoo-img')
            .css({
                'height': h,
                'width': h*0.65,
                'left': '12%'
            });
        }
    }
    // move 1 pic back
    function oneLess(){
        removeLightBoxImage();
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        // -1 pic
        count -= 1;
        if (count > $('.notizia').length - 1) {
            count = 0;
        }
        if (count == -1) {
            count = $('.notizia').length - 1;
        }
        loopNews();
        setDimImg();
    }
    
    // move 1 pic ahead
    function oneMore(){
        removeLightBoxImage();
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");
        // +1 pic
        count += 1;
        if (count > $('.notizia').length - 1) {
            count = 0;
        }
        if (count == -1) {
            count = $('.notizia').length - 1;
        }
        loopNews();
        setDimImg();
    }
    
    function refresh() {
        $('.overlay, #lightbox')
            .fadeIn('slow', function () {
                $(this).remove();
            });
        zoom();
    }
    
    function refresh2() {
        location.reload();
    }
    
    /*
    $('.newsCategory').on('click', function (e) {
        window.close();
    });
    */
    function animHide(obj) {
        obj.fadeOut('slow', function () {
            $('#close-image').fadeOut('slow');
        });
    }

    function removeLightBoxImage() {
        $('.overlay, #lightbox')
            .fadeOut('slow', function () {
                $(this).remove();
            });
    }

    function positionLightBoxImage() {
        //var top = ($(window).height() - $('#lightbox').height()) / 2;
        var left = ($(window).width() - $('#lightbox > img').width()) / 2 ;
        var wTot = $(window).width();
        var top = 0;
        //var left = 0;

        $('#lightbox > img')
            .css({
                'top': top,
            }).show();
        $('#lightbox').fadeIn();
    }

    var zoom = function () {
        var cur = $("[style*='inline-block']");
        if (cur.length){
            createAndAppend(cur, zoom);
        }else{
            removeLightBoxImage();
        }
    };
    
    function createAndAppend(current, callback) {
        var imageSrc = current.find('img')[0].src;
        var percentage;
        switch (userID){
            case '00011': 
                percentage = '137';
                break;
                
            case '00012':
                percentage = '100';
                break;
                
            default:
                percentage = '100';
                break;
        }
        
        //CREA DIV ID OVERLAY
        $('<div class="overlay"></div>')
            .css('top', $(document).scrollTop())
            .css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'height': '100%',
                'width': '100%',
                'zIndex': '4',
                'background': 'black url("loader.gif") no-repeat scroll center center'
            })
            .animate({'opacity': '1'}, 'slow')
            .appendTo('body');
    
        $('<div id="lightbox"></div>', {
            css: {
                'top'       : "0",
                'width'     : "100%",
                'height'     : "100%",
                'position'  : "relative"
            },
            click: function () {
                removeLightBoxImage();
            },
        }).hide().appendTo('.overlay');
        
        $('<img />', {
            src: imageSrc,
            class: "_newClass",
            css: {
                'top': "0",
                'left': "0",
                'right': "0",
                'bottom': "0",
                'margin': "auto",
                'position': "absolute",
                'height': percentage+"%"
            },
            click: function () {
                removeLightBoxImage();
            }
        }).appendTo('#lightbox').fadeIn();
        positionLightBoxImage();
    }
    //zoom();
    function welcome() {
        //CREA DIV ID OVERLAY
        $('<div class="overlay"></div>')
            .css('top', $(document).scrollTop())
            .css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'height': '100%',
                'width': '100%',
                'zIndex': '4',
                'background': 'black url("loader.gif") no-repeat scroll center center'
            })
            .animate({'opacity': '0.9'}, 'slow')
            .appendTo('body').hide();
            
        $('<div id="lightbox"></div>', {
            css: {
                'top'       : "0",
                'width'     : "100%",
                'height'     : "100%",
                'position'  : "relative"
            },
            click: function () {
                removeLightBoxImage();
            },
        }).hide().appendTo('.overlay');
        
        $('.tubo').append('#lightbox').removeClass('hidden');
        
        /*
        $('<iframe>', {
            //src: 'https://youtu.be/kgK3Hx7VWfQ',
            src: 'https://www.youtube.com/embed/kgK3Hx7VWfQ',
            
            id: 'myFrame2',
            class: 'iframes',
            frameborder: 0,
            scrolling: 'no',
            click: function () {
                removeLightBoxImage();
            },
        }).prependTo('#lightbox');
        */
    }
    /*
    var loadImgs = function () {
        var immagini = $('.notizia > .descrizione > p > img');
        var current = $('.descrizione').find('img.show');
        $.each(immagini, function (key, val) {
            $('<img />', {
                src: val.src,
                class: 'show',
                click: function () {
                    //   removeLightBoxImage();
                }
            }).appendTo('.overlay');
        });
        $(immagini[0]).addClass('show');
    };*/

    (function (exports) {
        var socket = io.connect(socketURI);
        
        socket.on('connection', function (data) {
            console.log('connect!');
            //welcome();
            //socket.emit('welcome', { customId:"000_spedicatoJS_0000" });
        });
        socket.on(userID + '-left', function (data) {
            console.log(userID + 'left connect!');
            oneLess();
            $("#lightbox").trigger('click');
        });
        socket.on(userID + '-right', function (data) {
            console.log(userID + 'right connect!');
            oneMore();
            $("#lightbox").trigger('click');
        });
        socket.on(userID + '-refresh', function (data) {
            refresh();
        });
        
        socket.on(userID + '-refresh2', function (data) {
            refresh2();
        });
        
        socket.on(userID+'-OROSCOPO-changeNews', function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+'-SPORT-changeNews', function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+'-HI TECH-changeNews', function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+'-GOSSIP-changeNews', function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+"-ULTIM'ORA-changeNews", function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+"-RPI-changeNews", function (data) {
            changeNewsCategory(data);
        });
        socket.on(userID+'-tab0', function (data) {
            $("#panel-0").trigger('click');
        });
        socket.on(userID+'-tab1', function (data) {
            $("#panel-1").trigger('click');
        });
        socket.on(userID+'-tab2', function (data) {
            $("#panel-2").trigger('click');
        });
        socket.on(userID+'-zoomOut', function (data) {
            removeLightBoxImage();
        });
        exports.socket = socket;
    })(window);
});

/*
 $('<img />')
 .attr({
 'src': $(c).attr('src'),
 'class': 'addedClass'
 })
 .load(function() {
 positionLightBoxImage();
 })
 .click(function(){
 removeLightBox();
 }).appendTo('#lightbox');
 
 
 $('<img />', {
 src: current.attr('src'),
 class: 'generic',
 load: function () {
 positionLightBoxImage();
 },
 click: function () {
 removeLightBoxImage();
 },
 }).appendTo('#lightbox');
 //removeLightBoxImage();
 callback(current);
 
 
 function slideShow() {
 
 var current2 = $('#overlay .show');
 var current2 = $('.notizia:visible').find("[style:'display=inline-block']");
 
 var next = current2.next().length ? current2.next() : current2.parent().children(':first');
 
 //console.log("next: " + next);
 
 current2.hide().removeClass('show');
 next.fadeIn().addClass('show');
 
 
 setTimeout(function () {
 slideShow();
 }, 3000);
 
 }  
 */ 
