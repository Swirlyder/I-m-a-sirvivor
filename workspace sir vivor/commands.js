/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL



// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */



const fs = require('fs');
let commands = {};

function loadCommands(directory, targetObject) {
	const files = fs.readdirSync(directory);

	for (const file of files) {
		if (!file.endsWith('.js') || file == 'askvivor.js' || file == 'authText.js') continue;

		const filePath = './' + directory + '/' + file;

		if (require.cache[require.resolve(filePath)]) {
			delete require.cache[require.resolve(filePath)];
		}

		const moduleExports = require(filePath);
		Object.assign(targetObject, moduleExports);
	}
}

fs.readdirSync('./modules').forEach(function (file) {
	console.log(file);
	if (file.substr(-3) === '.js') {
		try {
			let cmds = require('./modules/' + file).commands;
			for (let i in cmds) {
				commands[i] = cmds[i];
			}
		} catch (e) {
			error("Could not load commands file: ./modules/" + file + " | " + e.stack);
		}
	}
});

loadCommands('commands', commands);

exports.commands = commands;