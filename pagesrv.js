console.log('------------');
console.log('jackal PAGE');
console.log('------------');

var config = require('./pagesrv.config.json');

var express = require('express');
var app = express();

app.use(express.static(config.static));

bootstrap_html = "<!DOCTYPE html><html><head><link rel='stylesheet' type='text/css' href='{{css}}'></head><body></body><script src='{{entrypoint}}'></script></html>"
	.replace('{{entrypoint}}', config.entrypoint)
	.replace('{{css}}', config.css)

app.get('/*', function (req, res) {
	res.send(bootstrap_html);
});

app.listen(config.port, function () {
	console.log('http://localhost:' + config.port);
});