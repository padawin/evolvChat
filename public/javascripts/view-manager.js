if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('ViewManager',
'c', 'templates', 'events',
function (c, templates, events) {
	c.init(templates);

	var submitLoginEvent = function (e) {
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
			events.fire('login', [nickname, room]);
		}
		e.preventDefault();
	};

	return {
		loadLogin: function () {
			c.url(
				templates.loginWindow.url,
				{},
				B.$id('main'),
				function () {
					B.addEvent(B.$id('login-form'), 'submit', submitLoginEvent);
				}
			);
		},
		usernameAlreadyTaken: function () {
			B.removeClass('nickname-taken-error', 'hidden');
		},
		messageReceived: function(data) {
			// @TODO use template
			B.$id('discussion').innerHTML += data.nickname + ': ' + data.message + '<br />';
		},
		loadChatRoom: function (user, room) {
			function initChatRoom () {
				B.addEvent('message-button', 'click', function () {
					B.Ajax.request(
						'/api/message/' + room + '/' + user,
						{
							200: function (response) {
								B.$id('message-field').value = '';
								B.$id('message-field').focus();
							}
						}, {}, 'POST',
						'message=' + B.$id('message-field').value
					);
				});

				B.addEvent('logout', 'click', function (e) {
					events.fire('logout');
					e.preventDefault();
				});
			}

			if (B.$id('login-form')) {
				B.removeEvent(B.$id('login-form'), 'submit', submitLoginEvent);
			}

			c.url(
				templates.chatWindow.url,
				{nickname: user},
				B.$id('main'),
				initChatRoom
			);
		},
		updateUsersList: function (data) {
			console.log(data);
		},
		userLeft: function (data) {
			// @TODO use template
			B.$id('discussion').innerHTML += data.nickname + ' left the room.' + '<br />';
		},
		newUser: function (data) {
			// @TODO use template
			if (B.$id('discussion')) {
				B.$id('discussion').innerHTML += data.nickname + ' entered the room.' + '<br />';
			}
		}
	};
});
