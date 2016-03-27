var doc = {
	title: "netnode",
	bodyTemplateURL: "body.html",
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

function bootstrap() {
	loadScript('app.js');	
}

loadBodyHTML(doc.bodyTemplateURL, 'stdin', bootstrap);