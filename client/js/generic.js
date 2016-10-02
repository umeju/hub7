$(document).ready(function () {

    /* get params form url in html page */
    var QueryString = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
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
    }();
//alert(QueryString.ID + "asd");
    /***************************/

    //get userid val from last div in the html page
    var userID = QueryString.ID;//$('#userID').text();

    var directions = ['left', 'refresh', 'right'];

    // generate images to slide top right news
    for (var x in directions) {
        $('<img>', {
            id: userID + "-" + directions[x],
            src: "/common/img/" + directions[x] + "_arrow_sign.png",
            class: "img-circle " + directions[x]
        }).prependTo('#for-' + directions[x]);
    }

    $("select.my-select").change(function () {
        var category = $(".my-select option:selected").val();
        console.log("select.my-select - " + category);
        //changeNewsCategory(category);
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });
    $('.btn-warning').on('click', function () {
        var category = $(this).data('category');
        socket.emit('changeNews', {dataVal: userID + '-' + category});
    });

    if ($(window).width() > 500) {
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
        if (countFunc !== null)
            return;
        if (cmd === "start") {
            countFunc = setInterval(function () {
                count += 1;
                if (count > $('.notizia').length) {
                    count = 0;
                }
                loopNews();
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

    $('.refresh').click(function () {
        clickedTagID = this.id;
        myEmit('refresh', clickedTagID);
    });

    function myEmit(actionToDo, clickedTagID) {
        /*socket.emit(userID+'-'+actionToDo, {action: clickedTagID, dataVal: "esempio-data"});
         socket.emit(userID+'-'+actionToDo, {action: clickedTagID, dataVal: actionToDo});
         socket.emit(actionToDo, {action: actionToDo, dataVal: actionToDo});*/
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

    /* change News Category */
    function changeNewsCategory(newsCategory) {
        newsCategorySplitted = splitNewsName(newsCategory);

        //gestire hi tech con spazio o trattino
        switch (newsCategorySplitted[1]) {
            case "HI TECH":
                console.log('poi' + newsCategorySplitted[1]);
                newsCategorySplitted[1] = "HI-TECH";
            default:
        }

        $('#myFrame2').attr('src', 'http://www.di-vision.org/news/index.php?news=' +
                newsCategorySplitted[1]);

        $('.newsCategory').text("NEWS: " + newsCategorySplitted[1]);
        $('.actualNews').text(newsCategory);
        $('.actualNews').show();
    }

    // move 1 pic back
    function oneLess() {
        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");

        count -= 1;
        if (count > $('.notizia').length - 1) {
            count = 0;
        }

        if (count == -1) {
            count = $('.notizia').length - 1;
        }
        loopNews();
    }
    // move 1 pic ahead
    function oneMore() {

        clearInterval(countFunc);
        countFunc = null;
        runInterval("stop");

        count += 1;
        if (count > $('.notizia').length - 1) {
            count = 0;
        }

        if (count == -1) {
            count = $('.notizia').length - 1;
        }

        loopNews();
    }

    function refresh() {
        $('.overlay, #lightbox')
            .fadeIn('slow', function () {
                //$(this).remove();
                });
        zoom();
    }

    $('.newsCategory').on('click', function (e) {
        window.close();
    });

    function animHide(obj) {
        obj.fadeOut('slow', function () {
            $('#close-image').fadeOut('slow');
        });
    }

    function removeLightBoxImage() {
        //console.log('00');
        $('.overlay, #lightbox')
                .fadeOut('slow', function () {
                    $(this).remove();
                });
    }

    function positionLightBoxImage() {
        //var top = ($(window).height() - $('#lightbox').height()) / 2;
        var left = ($(window).width() - $('#lightbox').height()) / 2 - 260;
        var top = 0;
                
        $('#lightbox > img')
                .css({
                    'left': left,
                    'top': top
                }).show();

        $('#lightbox').fadeIn();
    }
    
    var zoom = function () {
//        removeLightBoxImage();
        var cur = $("[style*='inline-block']");
        if (cur.length)
            createAndAppend(cur, zoom);
    };
    
    function createAndAppend(current, callback) {
                
        var imageSrc = current.find('img')[0].src;

        //CREA DIV ID OVERLAY
        $('<div class="overlay"></div>')
                .css('top', $(document).scrollTop())
                .css('opacity', '0')
                .animate({'opacity': '1'}, 'slow')
                .appendTo('body');

        $('<div id="lightbox"></div>')
                .hide().appendTo('.overlay');

        $('<img />', {
            src: imageSrc,
            class: "newClass",
            css: {
                //'top': top + $(document).scrollTop(),
                //'left': left
                'position': "absolute"
            },
            click: function () {
              //  removeLightBoxImage();
            },
        }).appendTo('#lightbox').fadeIn();
        positionLightBoxImage();
    }

    zoom();

    var loadImgs = function () {
        var immagini = $('.notizia > .descrizione > p > img');
        var current = $('.descrizione').find('img.show');

        //console.log(current);

        $.each(immagini, function (key, val) {
            //console.log(key);
//        console.log(val);
            $('<img />', {
                src: val.src,
                class: 'show',
                click: function () {
                 //   removeLightBoxImage();
                }
            }).appendTo('.overlay');
        });

        $(immagini[0]).addClass('show');
    };

    (function (exports) {
        var socket = io.connect(socketURI);

        socket.on('connect', function (data) {
            //socket.emit('storeClientInfo', { customId:"000_spedicatoJS_0000" });
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