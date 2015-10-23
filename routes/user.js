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

	// When a user logs in with the form
	// Checks that the nickname is not used and creates the session
	router.post('/login', function(req, res) {
		res.setHeader('content-type', 'application/json');

		// checks if a users already exists
		if (chat.getUserByName(req.body.nickname)) {
			res.sendStatus(401);
		}
		else {
			req.session.user = req.body.nickname;
			res.json(['OK']);
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
