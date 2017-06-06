
var init = function (callback) {
    $.getJSON("test.json", function (data) {
        //var items = [];
        $.each(data, function (key, val) {

            $.each(data[1], function (k, v) {

                var items = [];

                items.push("<div class='inside-block'>");

                $.each(v, function (a, b) {

                    // console.log(a); console.log(b);

                    switch (a) {

                        case "foto":
                            $.each(b, function (a, url) {
                                //items.push(a + " " + "<div class='" + a + "'>" + b + "</div>");
                               // items.push("<img src='" + url + "' class='image' />");

                                jQuery('<img />', {
                                    //id: 'foo',
                                    class: 'bordered',
                                    src: url,
                                    title: '',
                                    rel: '',
                                    //height: '50',
                                    //width: '50',
                                    text: "foto"
                                            //}).appendTo('body');
                                });
                            });
                            break;

                        case "titolo":
                            items.push("<div class='" + a + "'>" + b + "</div>");

                            jQuery('<div/>', {
                                //   id: 'foo',
                                class: 'title',
                                href: '#',
                                title: '',
                                rel: '',
                                text: ' ' + b
                                        //}).appendTo('body');
                            });
                            break;

                        case "caratteristiche":
                            items.push("<div class='" + a + "'>" + b + "</div>");

                            jQuery('<div/>', {
                                //     id: 'foo',
                                class: 'bg-colored',
                                href: '#',
                                title: '',
                                rel: '',
                                text: ' ' + b
                                        //}).appendTo('body');
                            });
                            break;

                        case "descrizione":
                            items.push("<div class='" + a + "'>" + b + "</div>");

                            jQuery('<div/>', {
                                //   id: 'foo',
                                class: 'bordered',
                                href: '#',
                                title: '',
                                rel: '',
                                text: ' ' + b
                                        //}).appendTo('body');
                            });
                            break;

                        case "codice":
                            items.push("<div class='" + a + "'>" + b + "</div>");

                            jQuery('<div/>', {
                                //   id: 'foo',
                                class: 'bordered',
                                href: '#',
                                title: '',
                                rel: '',
                                text: ' ' + b
                                        //}).appendTo('body');
                            });
                            break;

                        default:
                    }
                });

                items.push("</div>");

                $("<div/>", {
                    "class": "block",
                    html: items.join("")
                }).appendTo(".wrapper");

            });

        });

        /*
         $("<ul/>", {
         "class": "my-new-list",
         html: items.join("")
         }).appendTo(".wrapper");
         */
        console.log(data[1][0]);
        //.css({"width":"200"})

        $asd = $('.inside-block').find('img:first');
        $asd.addClass("first-image");
        
        callback();

    });
};

function readData() {
    /*
    $('.wrapper').css({
        "width": "100%",
        "height": "100%"
    });
    */
    var width = $('.wrapper').width();
    var height = $(window).height();
    
    $('.block').css({
        "width": width - 32,
        "height": height -66
    });
    
    $('.caratteristiche').css({
       //"bottom": height - "50",
       "bottom": "50px",
       "right": "50px"
       
    });
}

init(readData);