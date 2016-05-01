function randomHexString(byteLength) {

	var buf = new Uint8Array(byteLength);
	window.crypto.getRandomValues(buf);
	var hexList = [];

	buf.map(function(x){ hexList.push( ('00' + x.toString(16).toUpperCase()).slice(-2)); });

	return hexList.join(':');
}