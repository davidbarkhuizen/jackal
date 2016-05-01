console.log('tachyon msg server');
var config = require('./msgsrv.config.json');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('xmessage', function(data){
		console.log('xmessage: ' + data);
	});
});

http.listen(config.port, function(){
	console.log('listening on localhost:' + config.port);
});