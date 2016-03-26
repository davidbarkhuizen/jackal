var config = require('./config.json');
var express = require('express');
var app = express();

app.use(express.static(config.static));

bootstrap_html = "<!DOCTYPE html><html><head><link rel='stylesheet' type='text/css' href='{{css}}'></head><body></body><script src='{{entrypoint}}'></script></html>"
	.replace('{{entrypoint}}', config.entrypoint)
	.replace('{{css}}', config.css)

app.get('/', function (req, res) {
  res.send(bootstrap_html);
});

app.post('/message', function (req, res) {
	console.log(JSON.stringify(req));
});

// ---------------------------------------------------

app.listen(config.port, function () {
  console.log('nodefx @ http://localhost:' + config.port);
});