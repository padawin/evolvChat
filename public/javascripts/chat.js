if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.executeModule('main',
'ViewManager', 'B',
function (ViewManager, B) {
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

	B.Events.on(
		'login',
		null,
		function (nickname, room) {
			B.Ajax.request(
				'/api/user/login',
				{
					200: function (response) {
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
								return true;
							},
							function () {
								socket.on('message', ViewManager.messageReceived);
								socket.on('users-list', ViewManager.updateUsersList);
								socket.on('user-connected', ViewManager.newUser);
								socket.on('user-left', ViewManager.userLeft);

								currentUser = nickname;
								currentRoom = room;
								ViewManager.loadChatRoom(currentUser, currentRoom);
							}
						);
					},
					401: function () {
						ViewManager.usernameAlreadyTaken();
					}
				}, {}, 'POST',
				'nickname=' + nickname + '&room=' + room
			);
		}
	);

	B.Events.on(
		'logout',
		null,
		function () {
			B.Ajax.request(
				'/api/user/logout',
				{
					200: ViewManager.loadLogin
				}, {}, 'POST',
				'room=' + currentRoom
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
