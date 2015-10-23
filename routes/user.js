var express = require('express'),
	router = express.Router();

module.exports = function (io) {
	var session;
	io.on('connection', function(socket) {
		socket.join(socket.handshake.query.room);
		console.log(socket.handshake.query.nickname, socket.handshake.query.room);
		session.user = socket.handshake.query;
	});

	// When a user load the page, to know if a session exists
	router.post('/enter', function(req, res) {
		res.setHeader('content-type', 'application/json');

		if (typeof(session) == 'object' && 'user' in session) {
			res.json({nickname: session.user.nickname, room: session.user.room});
		}
		else {
			session = req.session;
			res.json(null);
		}
	});

	// When a user load the page, to know if a session exists
	router.post('/logout', function(req, res) {
		res.setHeader('content-type', 'application/json');
		delete session.user;
		res.json(['OK']);
	});

	return router;
};
