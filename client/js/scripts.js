

var TIME_TO_CHANGE_TOP_RIGHT_IMAGE = 3000
var i = 0;
var SLEEP_TIME = 6000;
var stopFlag = true;
var $images = $('.my_inner').find('.my_image');
var NUM_OF_IMAGE = $('.my_inner > div').length;

var alterImages = setInterval( slideMyImage, TIME_TO_CHANGE_TOP_RIGHT_IMAGE);

function slideMyImage() {
    var index = (i % 5);
    if (stopFlag) {

        if (index == 0) {
            prev = NUM_OF_IMAGE -1;
        } else {
            prev = index - 1;
        }
        hideByIndex(prev);
        showByIndex(index);
        i++;
        if(i>1000){
            i=0;
        }
    }
}

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
}

$('#stop').on('click', function(e) {
    stopStartFlag();
});

$('#left').on('click', function(e) {
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
    
    $shownImg = $('.my_image').parent().find('.activate');
    $shownImg.hide();
    $shownImg.removeClass('activate');
    if ($shownImg.prev()[0] !== undefined) {
        $shownImg.prev().fadeIn().addClass('activate');
    } else {
        showByIndex(NUM_OF_IMAGE - 1);
    }
});


