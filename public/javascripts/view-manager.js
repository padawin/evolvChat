if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('ViewManager',
'c', 'templates', 'events',
function (c, templates, events) {
	return {
		init: function () {
			c.url(
				templates.loginWindow.url,
				{},
				B.$id('main'),
				function () {
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
							events.fire('connection');
							B.removeEvent(B.$id('login-form'), 'submit', submitLoginEvent);
						}
						e.preventDefault();
					};

					B.addEvent(B.$id('login-form'), 'submit', submitLoginEvent);
				}
			);
		},
		messageReceived: function(data) {
			console.log(data);
			B.$id('discussion').innerHTML += data.nickname + ': ' + data.message + '<br />';
		},
		loadChatRoom: function (user, room) {
			c.url(
				templates.chatWindow.url,
				{nickname: user},
				B.$id('main'),
				function () {
					B.addEvent('message-button', 'click', function () {
						console.log(B.$id('message-field').value + ' sent by ' + user);
						B.Ajax.request(
							'/api/message/' + room + '/' + user,
							{}, {}, 'POST',
							'message=' + B.$id('message-field').value
						);
					});
				}
			);
		}
	};
});
