if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('c', function () {
	var c = {},
		regexTemplate = /\[\[(.+?)]]/g,
		savedTemplates = {};

	c.url = function (url, data, container, callback) {
		if (savedTemplates[url]) {
			c.append(c.template(xhr.response, data, callback), container, callback);
			return;
		}

		B.Ajax.request(url, {
			200: function (xhr) {
				c.append(c.template(xhr.response, data), container, callback);
			}
		});
	};

	c.template = function (template, data, callback) {
		var match = regexTemplate.exec(template);
		while (match !== null) {
			template = template.replace(match[0], data[match[1]]);
			match = regexTemplate.exec(template);
		}

		return template;
	}

	c.append = function (template, container, callback) {
		container.innerHTML = template;
		callback && callback();
	};

	return c;
});
