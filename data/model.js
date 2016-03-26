function guid() {

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

function user(name, id) {

	return {
		id: id,
		name: name
	};
}

function message(from, to, text) {
	return {
		from: from,
		to: to,
		text: text
	};
}