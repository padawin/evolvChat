var express = require('express'),
	chat = require('../modules/chat'),
	router = express.Router();

// @TODO Some code should be in controllers, the routes should just be a mapping
// @TODO Use HTTP response codes

module.exports = function (io) {
	io.on('connection', function(socket) {
		socket.join(socket.handshake.query.room);

		chat.addUser(
			socket.handshake.query.room,
			[socket, socket.handshake.query.nickname]
		);

		io.to(socket.handshake.query.room).emit('users-list',
			chat.getUsersNicknames(socket.handshake.query.room)
		);
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
		delete req.session.user;
		res.json(['OK']);
	});

	return router;
};
