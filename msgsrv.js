console.log('---------------');
console.log('jackal MESSAGE');
console.log('---------------');

var config = require('./msgsrv.config.json');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function newSocket(key, socket) {
	return {
		key: key,
		socket: socket
	}
}

function newChannel(key, socket) {
	return {
		key: key,
		sockets: [socket]
	};
}

var channels = [];

io.on('connection', function(socket){

	var channelKey, socketKey;

	var addr = socket.request.connection.remoteAddress;
	console.log('a user connected from ' + addr);

	socket.on('disconnect', function(){
		
		console.log('user disconnected');

		var channelsVacated = [];

		// vacate channels based on socket key
		//
		for(var c = 0; c < channels.length; c++) {
			for(var s = 0; s < channels[c].sockets.length; s++) {

				if (channels[c].sockets[s].key === socketKey) {
					channels[c].sockets.splice(s, 1);
					console.log('removed from channel ' + channels[c].key);
					continue;
				}
			}
		}

		// notify vacated channels of departure
		//
		for(var c = 0; c < channelsVacated.length; c++) {
			var channel = channelsVacated[c];
			for(var s = 0; s < channel.sockets.length; s++) {
				channel.sockets[s].emit('AUTH', 'left: ' + socketKey);
			}			
		}
	});

	socket.on('MESSAGE', function(message){
	
		var dto = JSON.parse(message);
		console.log(JSON.stringify(dto));

		for(var i = 0; i < channels.length; i++) {
			for(var j = 0; j < channels[i].sockets.length; j++) {
				if (channels[i].sockets[j].key !== socketKey) {
					channels[i].sockets[j].socket.emit('MESSAGE', message);
				}
			}
		}
	});
	
	socket.on('AUTH', function(data){

		function describeChannel(channel) {
			return channel.key + ' (' + channel.sockets.length.toString() + ' endpoint[s])';
		} 

		data = JSON.parse(data);

		console.log('AUTH RQ: ' + data);

		for(var i = 0; i < channels.length; i++) {
			if (channels[i].key === data.channelKey) {
				
				var channel = channels[i];

				for(var j = 0; j < channel.sockets.length; j++) {
					if (channel.sockets[j].key === data.socketKey) {
						socket.emit('AUTH', 'already registered');
						return;						
					}
				}

				channelKey = data.channelKey;
				socketKey = data.socketKey;

				channel.sockets.push(newSocket(data.socketKey, socket));
				socket.emit('AUTH', 'joining channel ' + describeChannel(channel));
				
				for(var j = 0; j < channel.sockets.length; j++) {
					if (channel.sockets[j].key !== socketKey) {
						channel.sockets[j].socket.emit('AUTH', 'new joiner: ' + socketKey);
					}
				}

				return;		
			}
		}

		channelKey = data.channelKey;
		socketKey = data.socketKey;

		var channel = newChannel(channelKey, newSocket(socketKey, socket)); 
		channels.push(channel);
		socket.emit('AUTH', 'creating channel ' + describeChannel(channel));
	});
});

http.listen(config.port, function(){
	console.log('listening on localhost:' + config.port);
});