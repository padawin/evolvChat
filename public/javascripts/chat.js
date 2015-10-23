if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.executeModule('main',
'ViewManager', 'events',
function (ViewManager, events) {
	var socketAction,
		currentUser,
		currentRoom,
		host,
		socket;

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
		'login',
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

	events.on(
		'logout',
		null,
		function () {
			B.Ajax.request(
				'/api/user/logout',
				{
					200: ViewManager.loadLogin
				}, {}, 'POST', {}
			);
		}
	);

	B.Ajax.request(
		'/api/user/enter',
		{
			200: function (response) {
				var response = JSON.parse(response.responseText);
				if (!response) {
					// new user
					ViewManager.loadLogin();
				}
				else {
					// logged in user
					ViewManager.loadChatRoom(response.nickname, response.room);
				}
			}
		}, {}, 'POST', {}
	);
});
