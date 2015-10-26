/* global require, process */
var tests = require('./tests.js').Tests;
require('./tests-of-tests.js');
require('../public/javascripts/loader.js');
require('../public/javascripts/c.js');
require('./c.js');

process.exit(tests.runTests(console.log));
