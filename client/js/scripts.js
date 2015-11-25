//var t=0 , dd, aa;

var items = $('.news-from-control-panel');

var TIME_TO_CHANGE_TOP_RIGHT_IMAGE = 35000;
var i = 0;
var SLEEP_TIME = 6000;
var stopFlag = true;
var $images = $('.my_inner').find('.my_image');
var NUM_OF_IMAGE = $('.my_inner > div').length;
/*
function showByIndex(currentImg){
    $($images[currentImg]).fadeIn('slow');
    $($images[currentImg]).addClass('activate');
}

function hideByIndex(index){
    $($images[index]).hide();
    $($images[index]).removeClass('activate');
}

function stopStartFlag(){
    stopFlag = !stopFlag;
    $('#myModal').modal('show');
    if(stopFlag){
        $('#stop').attr('src', '/common/img/suremote-universal-remote-8-l-140x140.png');
    }else{
        $('#stop').attr('src', '/common/img/grey-suremote-universal-remote-8-l-140x140.png');
    }
}

$('#stop').on('click', function(e) {
    stopStartFlag();
});

$('#left').on('click', function(e) {
    stopStartFlag();
    $shownImg = $('.my_image').parent().find('.activate');
    $shownImg.hide();
    $shownImg.removeClass('activate');
    if($shownImg.next()[0] !== undefined){
        $shownImg.next().fadeIn().addClass('activate');
    }else{
        showByIndex(0);
    }
});

$('#right').on('click', function (e) {
    stopStartFlag();
    $shownImg = $('.my_image').parent().find('.activate');
    $shownImg.hide();
    $shownImg.removeClass('activate');
    if ($shownImg.prev()[0] !== undefined) {
        $shownImg.prev().fadeIn().addClass('activate');
    } else {
        showByIndex(NUM_OF_IMAGE - 1);
    }
});


*/