(function () {
	var c = {},
		regexExpression = /\[\[(.+?)]]/g,
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
		var match = regexExpression.exec(template);
		while (match !== null) {
			template = template.replace(match[0], data[match[1]]);
			match = regexExpression.exec(template);
		}

		return template;
	}

	c.append = function (template, container, callback) {
		container.innerHTML = template;
		callback && callback();
	};

	window.c = c;
})();
