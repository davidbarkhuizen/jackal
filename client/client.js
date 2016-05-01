// ------------------------------------------------------
// CONFIG

var MESSAGE_WS_SERVER_URL = 'ws://localhost:8667';
var KEY_LENGTH = 16;

// ------------------------------------------------------
// DATA MODEL

var 
	channelKey = null, 
	randomChannelKeyHexString = null,
	socketKey = null;

// ------------------------------------------------------

// DOM
//
var stdin = document.getElementById('stdin');
var stdout = document.getElementById('stdout');
var domConnect = document.getElementById('connect');
var domStatus = document.getElementById('status');

var domChannelKey = document.getElementById('channelKey'); 

var domGenRandomChannelKey = document.getElementById('genRandomChannelKey');
var domUseRandomChannelKey = document.getElementById('useRandomChannelKey');
domUseRandomChannelKey.disabled = true;

var domRandomChannelKey = document.getElementById('randomChannelKey');

function setStatus(text) {
	text = text.trim().toLowerCase();
	domStatus.textContent = text;
}

function setRandomChannelKey(delimitedHexString) {

	randomChannelKeyHexString = delimitedHexString; 

	domRandomChannelKey.textContent = delimitedHexString; 
	domUseRandomChannelKey.disabled = false;
}

function useRandomChannelKey() {
	
	if (domUseRandomChannelKey.disabled == true) {
		return;
	}

	channelKey = randomChannelKeyHexString; 

	domUseRandomChannelKey.disabled = true;
	domChannelKey.value = randomChannelKeyHexString;
}
domUseRandomChannelKey.onclick = useRandomChannelKey;

// ------------------------------------------------------

var bubble_template = '<div class="left bubble">{{text}}</div><div style="clear:both;"></div>';
function addBubble(text, className) {

	var bubbleDiv = document.createElement('div');
	bubbleDiv.className = 'bubble ' + className;
	bubbleDiv.textContent = text;

	var clearDiv = document.createElement('div');
	clearDiv.className = 'clear';

	if (stdout.children.length === 0) {
	
		stdout.appendChild(bubbleDiv);
		stdout.appendChild(clearDiv);
	}
	else {

		stdout.insertBefore(clearDiv, stdout.children[0]);
		stdout.insertBefore(bubbleDiv, stdout.children[0]);
	}
}

var i = 0;
function onTextSubmission(text) {

	i = i + 1;
	addBubble(text, ['left', 'right'][i % 2])

	stdin.value = null;
}

function onKeyPress(e) {

	if (!e)
		e = window.event;
    
    var keyCode = e.keyCode || e.which;
    
    if (keyCode == '13'){

    	var text = stdin.value.trim();
    	
    	if (text.length === 0)
    		return false;
    	
    	onTextSubmission(text);

		return false;
    }
}
stdin.onkeypress = onKeyPress;

var socket = null;
function establishConnection(e) {

	channelKey = domChannelKey.value;

	socketKey = randomHexString(KEY_LENGTH);

	domGenRandomChannelKey.disabled = true;
	domConnect.disabled = true;
	domUseRandomChannelKey.disabled = true;
	domChannelKey.disabled = true;

	socket = io(MESSAGE_WS_SERVER_URL);

	var auth = { 
		channelKey : channelKey,
		socketKey : socketKey
	};
	
	socket.emit('AUTH', JSON.stringify(auth));

	socket.on('AUTH', function(dto){ 
		console.log(dto);
		setStatus(dto); 
	});
}
domConnect.onclick = establishConnection;

function generateRandomChannelKey() {

	if (domGenRandomChannelKey.disabled === true) {
		return;
	}

	var hexString = randomHexString(KEY_LENGTH);
	setRandomChannelKey(hexString);
}

domGenRandomChannelKey.onclick = generateRandomChannelKey;
generateRandomChannelKey();