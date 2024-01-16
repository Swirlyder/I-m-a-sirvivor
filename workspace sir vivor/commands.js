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

loadCommands('commands', commands);

exports.commands = commands;