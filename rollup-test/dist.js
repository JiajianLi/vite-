'use strict';

require('path');

function a () {
    console.log('a');
}

const funA = a;

var name = "rollup-test";
var version = "1.0.0";
var description = "";
var main = "index.js";
var scripts = {
	test: "echo \"Error: no test specified\" && exit 1",
	build: "rollup -c rollup.config.js"
};
var author = "";
var license = "ISC";
var dependencies = {
	"@rollup/plugin-json": "^4.1.0",
	rollup: "^2.77.2"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	author: author,
	license: license,
	dependencies: dependencies
};

funA();
console.log('hello rollup1', pkg);
