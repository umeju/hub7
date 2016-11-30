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
    
    var directions = ['left', 'refresh', 'right'];
    
    var _AGGIORNAMENTO_NEWS = 18000,
        _TIMEOUT_TIME = 12000,
        tempo = 1,
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
    
    setInterval(function(){
            changePicUp();
        }, _TIMEOUT_TIME);
    
    $('body').click(function(){
        changePicUp();
    });
    
    function changePicUp()
    {
        tempo < items.length ? ++tempo : tempo = 0;
        $('.my_inner').html(items[tempo]).hide();
        setDimPic();
        $('.my_inner').show();
    }
    
    function changePicDown()
    {
        tempo < 1 ? tempo = items.length : --tempo;
        $('.my_inner').html(items[tempo]);
        setDimPic();
    }
    
    $('.right').click(function () {
        console.log('click on right! emit right');
        clickedTagID = this.id;
        myEmit('right', clickedTagID);
        changePicUp();
    });

    $('.left').click(function () {
        clickedTagID = this.id;
        myEmit('left', clickedTagID);
        changePicDown();
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
    
    function myEmit(actionToDo, clickedTagID)
    {
        socket.emit(actionToDo, {action: actionToDo, dataVal: userID});
        /*  esempio:
         * userID: 99999
         * actionToDo: left
         * clickedTagID: 99999-left
         */
    }
        
    function refresh() {
        $('.overlay, #lightbox')
            .fadeIn('slow', function () {
                $(this).remove();
            });
        zoom();
    }

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
    
    function setDimPic()
    {
        h = $(window).height();
        w = $(window).width();
        
        $('.descrizione img')
            .css({
                'height': h/100*90,
                'width': w/100*75,
                'float': 'left',
        });
        
        $('#right-side-info')
            .css({
                'height': h/100*90,
                'width': w/100*22,
                'float': 'right',
                'top':'8%',
                'right': '1%',
        });/*
        border: 8px solid red;
    width: 22%;
    height: 90%;
    position: absolute;
    top: 9%;
    right: 1%;
        */
    }
    setDimPic();
    
    function createAndAppend(current, callback) {
        var imageSrc = current.find('img')[0].src;
        var percentage;
        switch (userID){
            case '00011': 
                percentage = '137';
                break;
            /*
            case '00012':
                percentage = '100';
                break;
            */    
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
        
    }
    
    (function (exports) {
        var socket = io.connect(socketURI);
        
        socket.on('connection', function (data) {
            console.log('connect!');
            //welcome();
            //socket.emit('welcome', { customId:"000_spedicatoJS_0000" });
        });
        socket.on(userID + '-left', function (data) {
            console.log(userID + ' left connect!');
            changePicDown();
            $("#lightbox").trigger('click');
        });
        socket.on(userID + '-right', function (data) {
            console.log(userID + ' right connect!');
            changePicUp();
            $("#lightbox").trigger('click');
        });
        socket.on(userID + '-refresh', function (data) {
            refresh();
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
