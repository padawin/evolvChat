if (typeof (require) != 'undefined') {
	var loader = require('../public/javascripts/loader.js').loader;
}

loader.executeModule('cTests', 'c', 'Tests', function (c, Tests) {
	Tests.addSuite('c', [
		/**
		 * Test if the methods exist
		 */
		function() {
			Tests.isA(c.init, 'function');
			Tests.isA(c.compile, 'function');
		},

		/**
		 * Test to compile a static template from an url
		 */

		/**
		 * Test to compile a static template from a html
		 */


		/**
		 * Test to compile a template with a simple expression
		 */

		/**
		 * Test to compile a template with an expression's attribute
		 */

		/**
		 * Test to compile a template with two expressions on the same line
		 */

		/**
		 * Test to compile a template with two expressions on different lines
		 */

		/**
		 * Test to compile a template with a each call
		 */

		/**
		 * Test to compile a template with a if call
		 */

		/**
		 * Test to compile a template with an invalid placeholder
		 */

		/**
		 * Test to compile a template with an valid placeholder but invalid command
		 */

		/**
		 * Test to compile a template with an unprovided data
		 */
	]);
});
