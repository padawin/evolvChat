if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('c', function () {
	var c = {},
		_parseMatch,
		regexTemplate = /\[\[(.+?)]]/g,
		savedTemplates = {},
		_template,
		_url;

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

	_url = function (templateName, data, callback) {
		B.Ajax.request(savedTemplates[templateName].url, {
			200: function (xhr) {
				var html = xhr.responseText;
				savedTemplates[templateName].html = html;
				callback(_template(html, data));
			}
		});
	};

	_template = function (template, data) {
		var match;
		template = template.replace(regexTemplate, function () {
			// parse match
			_parseMatch(arguments[1]);
			return data[arguments[1]];
		});

		return template;
	}

	c.init = function (templates) {
		savedTemplates = templates;
	};

	c.compile = function (templateName, data, callback) {
		if (!(templateName in savedTemplates)) {
			throw "Invalid template";
		}
		else if ('html' in savedTemplates[templateName]) {
			callback(_template(savedTemplates[templateName].html, data));
		}
		else if ('url' in savedTemplates[templateName]) {
			_url(templateName, data, callback);
		}
	}

	return c;
});
