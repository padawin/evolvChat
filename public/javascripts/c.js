if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('c', function () {
	var c = {},
		_parseMatch,
		regexTemplate = /\[\[(.+?)]]/g,
		savedTemplates = {};

	_parseMatch = function (template) {
		/*
		 * allowed commands:
		 * expression
		 * expression.attribute
		 * each expression on template
		 * if expression then template
		 */
		var regexExpression = /^[a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/g,
			regexEach = /^each\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s+on\s+[a-zA-Z_$\-0-9]+$/,
			regexIf = /^if\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s+then\s+[a-zA-Z_$\-0-9]+$/;
		console.log(regexExpression.exec(template));
		console.log(regexEach.exec(template));
		console.log(regexIf.exec(template));
	};

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
			// parse match
			_parseMatch(match[1]);
			template = template.replace(match[0], data[match[1]]);
			match = regexTemplate.exec(template);
		}

		return template;
	}

	c.append = function (template, container, callback) {
		container.innerHTML = template;
		callback && callback();
	};

	c.init = function (templates) {
		savedTemplates = templates;
	};

	return c;
});
