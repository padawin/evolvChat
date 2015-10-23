var express = require('express'),
	router = express.Router();

module.exports = function (io) {
	io.on('connection', function(socket) {
		socket.join(socket.handshake.query.room);
	});

	// When a user load the page, to know if a session exists
	router.post('/enter', function(req, res) {
		res.setHeader('content-type', 'application/json');

		if ('user' in req.session) {
			res.json({nickname: req.session.user.nickname, room: req.session.user.room});
		}
		else {
			res.json(null);
		}
	});

	// When a user load the page, to know if a session exists
	router.post('/logout', function(req, res) {
		res.setHeader('content-type', 'application/json');
		delete red.session.user;
		res.json(['OK']);
	});

	return router;
};
