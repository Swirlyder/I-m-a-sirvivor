'use strict';

const name = 'Roll Switch';
const id = Tools.toId(name);
let rollSwitchMode = function() {
	this.name = name + " " + this.name;
	this.rollSwitch = true;
	let index = this.description.lastIndexOf("__");
	let start = this.description.substr(0, index);
	let end = this.description.substr(index + 2);
	this.description = start + "(Roll Switch Mode)__" + end;
}

exports.name = name;
exports.id = id;
exports.naming = 'prefix';
exports.aliases = ['rs'];
exports.requiredFunctions = [];
exports.mode = rollSwitchMode
