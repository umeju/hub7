
// Images must be preloaded before they are used to draw into canvas
function preloadImages( images, callback ) {

    function _preload( asset ) {
        asset.img = new Image();
        asset.img.src = 'img/' + asset.id+'.png';

        asset.img.addEventListener("load", function() {
            _check();
        }, false);

        asset.img.addEventListener("error", function(err) {
            _check(err, asset.id);
        }, false);
    }

    var loadc = 0;
    function _check( err, id ) {
    	if ( err ) {
	        alert('Failed to load ' + id );
    	}
	    loadc++;
	    if ( images.length == loadc ) callback();
    }

    images.forEach(function(asset) {
	    _preload( asset );
    });
}

function _initWebAudio( AudioContext, format, audios, callback ) {
    // See more details in http://www.html5rocks.com/en/tutorials/webaudio/intro/

    var context = new AudioContext();

    function _preload( asset ) {
        var request = new XMLHttpRequest();
        request.open('GET',  'audio/' + asset.id + '.' + format, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {

                asset.play = function() {
                    var source = context.createBufferSource(); // creates a sound source
                    source.buffer = buffer;                    // tell the source which sound to play
                    source.connect(context.destination);       // connect the source to the context's destination (the speakers)

					// play the source now
					// support both webkitAudioContext or standard AudioContext
                    source.noteOn ? source.noteOn(0) : source.start(0);
                };
                // default volume
				// support both webkitAudioContext or standard AudioContext
                asset.gain = context.createGain ? context.createGain() : context.createGainNode();
                asset.gain.connect(context.destination);
                asset.gain.gain.value = 0.5;

                _check();

            }, function(err) {
                asset.play = function() {};
                _check(err, asset.id);
            });
        };
        request.onerror = function(err) {
            asset.play = function() {};
            _check(err, asset.id);
        };
        // kick off load
        request.send();
    }
    var loadc = 0;
    function _check( err, id ) {
        if ( err ) {
            alert('Failed to load ' + id + '.' + format);
        }
        loadc++;
        if ( audios.length == loadc ) callback();
    }

    audios.forEach(function(asset) {
        _preload( asset );
    });

}

function _initHTML5Audio( format, audios, callback ) {

    function _preload( asset ) {
        asset.audio = new Audio( 'audio/' + asset.id + '.' + format);
        asset.audio.preload = 'auto';
        asset.audio.addEventListener("loadeddata", function() {
            // Loaded ok, set play function in object and set default volume
            asset.play = function() {
                asset.audio.play();
            };
            asset.audio.volume = 0.6;

            _check();
        }, false);

        asset.audio.addEventListener("error", function(err) {
            // Failed to load, set dummy play function
            asset.play = function() {}; // dummy

            _check(err, asset.id);
        }, false);

    }
    var loadc = 0;
    function _check( err, id ) {
        if ( err ) {
            alert('Failed to load ' + id + '.' + format);
        }
        loadc++;
        if ( audios.length == loadc ) callback();
    }

    audios.forEach(function(asset) {
        _preload( asset );
    });
}

// Initializes audio and loads audio files
function initAudio( audios, callback ) {

    var format = 'mp3';
    var elem = document.createElement('audio');
    if ( elem ) {
        // Check if we can play mp3, if not then fall back to ogg
        if( !elem.canPlayType( 'audio/mpeg;' ) && elem.canPlayType('audio/ogg;')) format = 'ogg';
    }

    var AudioContext = window.AudioContext || window.mozAudioContext || window.MSAudioContext || window.AudioContext;

    if ( AudioContext ) {
        $('#audio_debug').text('WebAudio Supported');
        // Browser supports webaudio
        // https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
        return _initWebAudio( AudioContext, format, audios, callback );
    } else if ( elem ) {
        $('#audio_debug').text('HTML5 Audio Supported');
        // HTML5 Audio
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#the-audio-element
        return _initHTML5Audio(format, audios, callback);
    } else {
        $('#audio_debug').text('Audio NOT Supported');
        // audio not supported
        audios.forEach(function(item) {
            item.play = function() {}; // dummy play
        });
        callback();
    }
}


function SlotGame() {
    
    var game = new Game();

    // Audio file names
    var audios = [
        {id: 'roll'}, // Played on roll tart
        {id: 'slot'}, // Played when reel stops
        {id: 'win'},  // Played on win
        {id: 'nowin'}  // Played on loss
    ];

    game.audios = audios;
    
    initAudio(audios, function() {
            // audio is initialized and loaded
            game.audios[0].play();
        });
        
        

    $('#play').click(function(e) {
        game.audios[0].play();
    });
}

function Game() {
    console.log('Game obj');
}
var t = new SlotGame();
//t.game.audios[0].play();