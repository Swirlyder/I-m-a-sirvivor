'use strict';

const name = 'Golf';
const id = Tools.toId(name);
let golfMode = function() {
	this.name = name + " " + this.name;
	this.golf = true;
	let index = this.description.lastIndexOf("__");
	let start = this.description.substr(0, index);
	let end = this.description.substr(index + 2);
	this.description = start + "(Golf Mode)__" + end;
}

exports.name = name;
exports.id = id;
exports.naming = 'prefix';
exports.requiredFunctions = [];
exports.mode = golfMode

