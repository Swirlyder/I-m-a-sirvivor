'use strict';

const name = 'Roll Switch';
const id = Tools.toId(name);
let rollSwitchMode = function() {
	this.rollSwitch = true;
}

exports.name = name;
exports.id = id;
exports.naming = 'prefix';
exports.aliases = ['rs'];
exports.requiredFunctions = [];
exports.mode = rollSwitchMode
