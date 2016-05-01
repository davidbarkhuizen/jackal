// ------------------------------------------------------
// CONFIG

var MESSAGE_WS_SERVER_URL = 'ws://localhost:8667';
var CHANNEL_KEY_LENGTH = 16;

// ------------------------------------------------------

// DOM
//
var stdin = document.getElementById('stdin');
var stdout = document.getElementById('stdout');
var connect = document.getElementById('connect');

var domChannelKey = document.getElementById('channelkeyin'); 

var domGenRandomChannelKey = document.getElementById('genRandomChannelKey');
var domCopyRandomChannelKey = document.getElementById('copyRandomChannelKey');
domCopyRandomChannelKey.disabled = true;

var randomChannelKey = null;
var domRandomChannelKey = document.getElementById('randomChannelKey');

function setRandomChannelKey(stringVal) {

	randomChannelKey = stringVal; 
	domRandomChannelKey.textContent = stringVal; 

	domCopyRandomChannelKey.disabled = false;
}

function copyRandomChannelKey() {
	domChannelKey.value = randomChannelKey;
}
domCopyRandomChannelKey.onclick = copyRandomChannelKey;

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

var messageSocket = null;
function establishConnection(e) {

	connect.disabled = true;
	var socket = io(MESSAGE_WS_SERVER_URL);

	var auth_msg = {
		one_time_channel_key : 'dogs bollocks'
	};

	socket.emit('AUTH', JSON.stringify(auth_msg));
}
connect.onclick = establishConnection;


function generateRandomChannelKey() {

	var hexString = randomHexString(CHANNEL_KEY_LENGTH);

	setRandomChannelKey(hexString);
}

domGenRandomChannelKey.onclick = generateRandomChannelKey;
generateRandomChannelKey();

// FLOW
//
// new message text submitted
// send text to server
// -- on error, indicate, retain text
// -- on success, indicate success of delivery => move to bubble
// 
// new message received
// 