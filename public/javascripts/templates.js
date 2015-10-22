if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('templates', function () {
	return {
		chatWindow: {
			url: 'templates/chat-window.html'
		},
		loginWindow: {
			url: 'templates/login-window.html'
		}
	};
});
