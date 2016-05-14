// ------------------------------e------------------------
// CONFIG

// assumes co-hosting
//
var MESSAGE_WS_SERVER_URL = 'ws://' + document.domain + ':8667';

var KEY_LENGTH = 16;

// ------------------------------------------------------
// DATA MODEL

var 
	channelKey = null, 
	randomChannelKeyHexString = null,
	socketKey = null,
	secretKey = null;

// ------------------------------------------------------

// DOM
//
var stdin = document.getElementById('stdin');
var stdout = document.getElementById('stdout');
var domConnect = document.getElementById('connect');
var domStatus = document.getElementById('status');

var domChannelKey = document.getElementById('channelKey'); 
var domSecretKey = document.getElementById('secretKey'); 

var domGenRandomChannelKey = document.getElementById('genRandomChannelKey');
var domGenRandomSecretKey = document.getElementById('genRandomSecretKey');

var domCopyChannelKey = document.getElementById('copyChannelKey');
var domCopySecretKey = document.getElementById('copySecretKey');

function setStatus(text) {
	text = text.trim().toLowerCase();
	domStatus.textContent = text;
}

function setRandomChannelKey(delimitedHexString) {

	channelKey = delimitedHexString;
	domChannelKey.value = delimitedHexString;
}

function setRandomSecretKey(delimitedHexString) {

	secretKey = delimitedHexString;
	domSecretKey.value = delimitedHexString;
}


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

function onTextSubmission(text) {

	var nick = document.getElementById('nick').value;

	addBubble(text, 'left');

	stdin.value = null;

	var hexKey = domSecretKey.value.trim().replace(/:/g, '');
	var key = sjcl.codec.hex.toBits(hexKey);

	var dto = {
		crypto: sjcl.encrypt(key, text, {mode : "gcm"}),
		source: nick
	};

	/*	
	var clearText = sjcl.decrypt(key, cipherText, {mode : "gcm"});
	console.log('clearText: ' + clearText);
	*/

	socket.emit("MESSAGE", dto);
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

	// anti-bounce
	//
	if (domConnect.disabled === true) { return; }
	else { domConnect.disabled = true; }

	domGenRandomChannelKey.disabled = true;
	domGenRandomSecretKey.disabled = true;

	channelKey = domChannelKey.value;
	socketKey = randomHexString(KEY_LENGTH);

	domChannelKey.disabled = true;
	domSecretKey.disabled = true;

	socket = io(MESSAGE_WS_SERVER_URL);

	var auth = { 
		channelKey : channelKey,
		socketKey : socketKey
	};
	
	socket.emit('AUTH', JSON.stringify(auth));

	socket.on('AUTH', function(dto){ 
		setStatus(dto); 
	});

	socket.on('MESSAGE', function(dto){ 

		var hexKey = domSecretKey.value.trim().replace(/:/g, '');
		var key = sjcl.codec.hex.toBits(hexKey);

		var clearText = sjcl.decrypt(key, dto.crypto, {mode : "gcm"});
		console.log('clearText: ' + clearText);

		var text = dto.source + ': ' + clearText; 

		addBubble(text, 'right');
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

function copyChannelKey() {

	var originalState = domChannelKey.disabled; 
	domChannelKey.disabled = false;
	domChannelKey.select();
	document.execCommand('copy');
	domChannelKey.disabled = originalState;
}
domCopyChannelKey.onclick = copyChannelKey;

function copySecretKey() {

	var originalState = domSecretKey.disabled; 
	domSecretKey.disabled = false;
	domSecretKey.select();
	document.execCommand('copy');
	domChannelKey.disabled = originalState;
}
domCopySecretKey.onclick = copySecretKey;

function generateRandomSecretKey() {

	if (domGenRandomSecretKey.disabled === true) {
		return;
	}

	var hexString = randomHexString(256 / 8);
	setRandomSecretKey(hexString);
}
domGenRandomSecretKey.onclick = generateRandomSecretKey;

// INIT
//
generateRandomChannelKey();
generateRandomSecretKey();