if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('ViewManager',
'B', 'templates',
function (B, templates) {
	B.Template.init(templates);

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
			B.Events.fire('login', [nickname, room]);
		}
		e.preventDefault();
	};

	return {
		loadLogin: function () {
			B.Template.compile(
				'loginWindow',
				null,
				function (html) {
					B.$id('main').innerHTML = html;
					B.on(B.$id('login-form'), 'submit', submitLoginEvent);
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
				B.on('message-button', 'click', function () {
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

				B.on('logout', 'click', function (e) {
					B.Events.fire('logout');
					e.preventDefault();
				});
			}

			if (B.$id('login-form')) {
				B.off(B.$id('login-form'), 'submit', submitLoginEvent);
			}

			B.Template.compile(
				'chatWindow',
				{nickname: user},
				function (html) {
					B.$id('main').innerHTML = html;
					initChatRoom();
				}
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
