var express = require('express'),
	router = express.Router();

module.exports = function (io) {
	io.on('connection', function(socket) {
		socket.join(socket.handshake.query.room);
		console.log(socket.handshake.query.nickname, socket.handshake.query.room);
	});

	return router;
};
