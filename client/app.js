var bubble_template = '<div class="left bubble">{{text}}</div><div style="clear:both;"></div>';

var stdinID = 'stdin';
var stdin = document.getElementById(stdinID);

var stdoutID = 'stdout';
var stdout = document.getElementById(stdoutID);

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

function addLeftBubble(text) { addBubble(text, 'left'); }
function addRightBubble(text) { addBubble(text, 'right'); }

var i = 0;

function onTextSubmission(e) {

	if (!e)
		e = window.event;
    
    var keyCode = e.keyCode || e.which;
    
    if (keyCode == '13'){

    	var text = stdin.value;
    	
    	if (text.length === 0)
    		return false;
    	
    	i = i + 1;
    	addBubble(text, ['left', 'right'][i % 2])
    	stdin.value = null;

		return false;
    }
}

stdin.onkeypress = onTextSubmission; 