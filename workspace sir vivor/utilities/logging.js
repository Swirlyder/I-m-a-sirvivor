const Config = require('../config.js');

module.exports = {
	info: function (text) {
		if (Config.debuglevel > 3) return;
		console.log('info'.cyan + '  ' + text);
	},
    debug: function (text) {
        if (Config.debuglevel > 2) return;
        console.log('debug'.blue + ' ' + text);
    },
    recv: function (text) {
        if (Config.debuglevel > 0) return;
        console.log('recv'.grey + '  ' + text);
    },
    cmdr: function (text) {
        if (Config.debuglevel !== 1) return;
        console.log('cmdr'.grey + '  ' + text);
    },
    dsend: function (text) {
        if (Config.debuglevel > 1) return;
        console.log('send'.grey + '  ' + text);
    },
    error: function (text) {
        console.log('error'.red + ' ' + text);
    },
    ok: function (text) {
        if (Config.debuglevel > 4) return;
        console.log('ok'.green + '    ' + text);
    }
}