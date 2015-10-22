if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.executeModule('main',
'templates', 'ViewManager', 'events',
function (templates, ViewManager, events) {
	var socketAction,
		currentUser,
		currentRoom,
		host,
		initChatWindow,
		socket,
		submitLoginEvent;

	host = window.location.protocol.concat('//')
		.concat(window.location.hostname)
		.concat(':').concat(window.location.port);

	socketAction = function (action, success, error) {
		if (action()) {
			success && success();
		}
		else {
			error && error();
		}
	};

	events.on(
		'connection',
		null,
		function (nickname, room) {
			socketAction(
				function () {
					// log in with nickname and room
					console.log('log in through socket');

					socket = new io.connect(
						host,
						{
							resource: 'A/socket.io',
							'force new connection': true,
							query: 'nickname=' + nickname + '&room=' + room
						}
					);

					socket.on('message', ViewManager.messageReceived);
					return true;
				},
				function () {
					currentUser = nickname;
					currentRoom = room;
					ViewManager.loadChatRoom(currentUser, currentRoom);

				}
			);
		}
	);

	ViewManager.init();
});
