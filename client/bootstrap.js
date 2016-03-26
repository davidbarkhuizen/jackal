var doc = {
	title: "netnode",
	bodyTemplateURL: "body.html",
};

document.title = doc.title;

function loadBodyHTML(url, focusOnId) {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onreadystatechange= function() {
	    
	    if (this.readyState !== 4)
	    	return;
	    
	    if (this.status !== 200)
	    	return;

	    document.body.innerHTML= this.responseText;

	    document.getElementById(focusOnId).focus();
	};

	xhr.send();
}

loadBodyHTML(doc.bodyTemplateURL, 'stdin');