var express = require('express'),
	router = express.Router();

module.exports = function (io) {
		/* POST a message from user in room. */
	router.post('/:room/:uid', function(req, res) {
		res.setHeader('content-type', 'application/json');

		try {
			io.to(req.params.room).emit('message',
				{nickname: req.params.uid, message: req.body.message}
			);
			res.json(['OK']);
		}
		catch (e) {
			res.status(400);
			console.log(e);
			res.json(['Bad value']);
		}
	});

	return router;
};
