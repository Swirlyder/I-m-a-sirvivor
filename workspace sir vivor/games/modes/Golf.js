'use strict';

const name = 'Golf';
const id = Tools.toId(name);
let golfMode = function() {
	this.name = name + " " + this.name;
	this.golf = true;
}

exports.name = name;
exports.id = id;
exports.naming = 'prefix';
exports.requiredFunctions = [];
exports.mode = golfMode

