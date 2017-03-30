'use strict';

const name = 'Roll Switch';
const id = Tools.toId(name);
let rollSwitchMode = function() {
	this.rollSwitch = true;
}

exports.name = name;
exports.id = id;
exports.aliases = ['rs'];
exports.naming = 'prefix';
exports.requiredFunctions = [];
exports.mode = rollSwitchMode
