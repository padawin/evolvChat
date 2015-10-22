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

	initChatWindow = function () {
		B.addEvent('message-button', 'click', function () {
			console.log(B.$id('message-field').value + ' sent by ' + currentUser);
			B.Ajax.request(
				'/api/message/' + currentRoom + '/' + currentUser,
				{}, {}, 'POST',
				'message=' + B.$id('message-field').value
			);
		});
	};

	submitLoginEvent = function (e) {
		var nickname = B.$id('nickname').value.trim(),
			room = B.$id('room').value.trim(),
			valid = true;

		if (nickname == '') {
			B.removeClass('nickname-error', 'hidden');
			valid = false;
		}
		else {
			B.addClass('nickname-error', 'hidden');
			valid = true;
		}

		if (room == '') {
			B.removeClass('room-error', 'hidden');
			valid = false;
		}
		else {
			B.addClass('room-error', 'hidden');
			valid = valid && true;
		}

		if (valid) {
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
				});

			B.removeEvent(B.$id('login-form'), 'submit', submitLoginEvent);
		}
		e.preventDefault();
	};

	B.addEvent(B.$id('login-form'), 'submit', submitLoginEvent);
});
