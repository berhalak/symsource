#!/usr/bin/env node

var args = process.argv.splice(process.execArgv.length + 2);

var lib = require('../index.js');


if (args.length && args[0] == '--unlink') {
	console.log("Unlinking");
	lib.unlink();
} else if (args.length && args[0] == '--help') {
	console.log("Usage: npm-libs [--unlink]");
} else {
	// Displays the text in the console
	lib.link();
}