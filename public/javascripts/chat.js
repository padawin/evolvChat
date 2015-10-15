(function () {
	var socketAction,
		currentUser,
		initChatWindow,
		socket,
		submitEvent;


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
			socket.emit('message', B.$id('message-field').value);
		});
	};

	submitEvent = function (e) {
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
						'http://127.0.0.1:3000',
						{
							resource: 'A/socket.io',
							'force new connection': true,
							query: 'nickname=' + nickname + '&room=' + room
						}
					);

					socket.on('message', function(data) {
						console.log(data);
					});
					return true;
				},
				function () {
					currentUser = nickname;
					c.url(
						templates.chatWindow.url,
						{nickname: currentUser},
						B.$id('main'),
						initChatWindow
					);
				});

			B.removeEvent(B.$id('login-form'), 'submit', submitEvent);
		}
		e.preventDefault();
	};

	B.addEvent(B.$id('login-form'), 'submit', submitEvent);
})();
