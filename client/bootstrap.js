var doc = {
	title: "jackal",
	bodyTemplateURL: "body.html",
	entryPoint: "client.js",
	scripts : ["socket.io.js", "cliutil.js", "sjcl.js"],
};

document.title = doc.title;

function loadBodyHTML(url, focusOnId, next) {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onreadystatechange= function() {
	    
	    if (this.readyState !== 4)
	    	return;
	    
	    if (this.status !== 200)
	    	return;

	    document.body.innerHTML= this.responseText;

	    document.getElementById(focusOnId).focus();
	
	    next();
	};

	xhr.send();
}

function loadScript(url) {

	var script = document.createElement('script');
	script.src = url;

	document.head.appendChild(script);
}

function loadScripts(urls) {

	for(var i = 0; i < urls.length; i++) {
		loadScript(urls[i]);
	}
}

function bootstrap() {
	loadScript(doc.entryPoint);	
}

loadBodyHTML(doc.bodyTemplateURL, 'stdin', bootstrap);
loadScripts(doc.scripts);