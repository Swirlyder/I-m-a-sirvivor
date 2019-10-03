   /**
 * This is the main file of Pokémon Showdown Bot
 *
 * Some parts of this code are taken from the Pokémon Showdown server code, so
 * credits also go to Guangcong Luo and other Pokémon Showdown contributors.
 * https://github.com/Zarel/Pokemon-Showdown
 *
 * @license MIT license
 */
'use strict';
 
const MESSAGE_THROTTLE = 110;

// First dependencies and welcome message
require('babel/register')({
	blacklist: [
		'es6.arrowFunctions',
		'es6.blockScoping',
		'es6.classes',
		'es6.constants',
		'es6.forOf',
		'es6.templateLiterals',
		'regenerator'
	],
	optional: ['asyncToGenerator']
});
var chokidar = require('chokidar');
require('sugar');
global.colors = require('colors');

global.info = function (text) {
	if (Config.debuglevel > 3) return;
	console.log('info'.cyan + '  ' + text);
};

global.debug = function (text) {
	if (Config.debuglevel > 2) return;
	console.log('debug'.blue + ' ' + text);
};

global.recv = function (text) {
	if (Config.debuglevel > 0) return;
	console.log('recv'.grey + '  ' + text);
};

global.cmdr = function (text) { // receiving commands
	if (Config.debuglevel !== 1) return;
	console.log('cmdr'.grey + '  ' + text);
};

global.dsend = function (text) {
	if (Config.debuglevel > 1) return;
	console.log('send'.grey + '  ' + text);
};

global.error = function (text) {
	console.log('error'.red + ' ' + text);
};

global.ok = function (text) {
	if (Config.debuglevel > 4) return;
	console.log('ok'.green + '    ' + text);
};

global.toId = function(text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

console.log('------------------------------------'.yellow);
console.log('| Welcome to Pokemon Showdown Bot! |'.yellow);
console.log('------------------------------------'.yellow);
console.log('');

global.stripCommands = function (text) {
	text = text.trim();
	if (text.charAt(0) === '/') return '/' + text;
	if (text.charAt(0) === '!' || /^>>>? /.test(text)) return ' ' + text;
	return text;
};

// Config and config.js watching...
try {
	global.Config = require('./config.js');
} catch (e) {
	console.log(e);
	error('config.js doesn\'t exist; are you sure you copied config-example.js to config.js?');
	process.exit(-1);
}

var checkCommandCharacter = function () {
	if (!/[^a-z0-9 ]/i.test(Config.commandcharacter)) {
		error('invalid command character; should at least contain one non-alphanumeric character');
		process.exit(-1);
	}
};

checkCommandCharacter();

var fs = require('fs');
if (Config.watchconfig) {
	fs.watchFile('./config.js', function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve('./config.js')];
			Config = require('./config.js');
			info('reloaded config.js');
			checkCommandCharacter();
		} catch (e) {}
	});
}
if (Config.commandCharacter === '.') {
	process.on('uncaughtException', err => {
		if (global.Parse) {
			global.Parse.say(Rooms.get('survivor'), '/w lady monita, .mail Cheese, An error occurred! ' + err);
		}
		console.log(err);
	});
}

// And now comes the real stuff...
info('starting server');
var WebSocketClient = require('websocket').client;
global.Tools = require('./tools.js');
console.log(Tools.mod(912673, 688165, 1032247));
global.Battles = require('./Battles.js');
global.dd = require('./points.js');
dd.importData();
global.Commands = require('./commands.js').commands;
global.Users = require('./users.js');
global.Rooms = require('./rooms.js');
global.Parse = require('./parser.js').parse;
global.Games = require('./games.js');
Games.loadGames();
try {
	global.chatmes = JSON.parse(fs.readFileSync('./databases/chat.json').toString());
} catch (e) {}
if (!global.chatmes) global.chatmes = {};
function saveChatMes() {
	fs.writeFileSync('./databases/chat.json', JSON.stringify(chatmes));
}
setInterval(() => saveChatMes(), 10 * 60 * 1000);
global.Connection = null;
fs.watchFile('./commands.js', function (curr, prev) {
	if (curr.mtime <= prev.mtime) return;
	try {
		delete require.cache[require.resolve('./commands.js')];
		Config = require('./config.js');
		info('reloaded commands');
	} catch (e) {}
});
var watcher = chokidar.watch('./games', {ignored: /^\./, persistent: true});
function reloadGames () {
	delete require.cache[require.resolve('./games.js')];
	Games = require('./games.js');
	Games.loadGames();
	info('Games reloaded.');
}
watcher
  .on('add', function(path) {
	  reloadGames();
  })
  .on('change', function(path) {
	  reloadGames();
  });
fs.watchFile('./games.js', function (curr, prev) {
	if (curr.mtime <= prev.mtime) return;
	try {
		delete require.cache[require.resolve('./games.js')];
		Games = require('./games.js');
		Games.loadGames();
		info('Games reloaded.');
	} catch (e) {}
});

var queue = [];
var dequeueTimeout = null;
var lastSentAt = 0;

global.send = function (data) {
	if (!data || !Connection.connected) return false;
	
	var now = Date.now();
	if (now < lastSentAt + MESSAGE_THROTTLE - 5) {
		queue.push(data);
		if (!dequeueTimeout) {
			dequeueTimeout = setTimeout(dequeue, now - lastSentAt + MESSAGE_THROTTLE);
		}
		return false;
	}
	if (!Array.isArray(data)) data = [data.toString()];
	data = JSON.stringify(data);
	dsend(data);
	Connection.send(data);

	lastSentAt = now;
	if (dequeueTimeout) {
		if (queue.length) {
			dequeueTimeout = setTimeout(dequeue, MESSAGE_THROTTLE);
		} else {
			dequeueTimeout = null;
		}
	}
};

function dequeue() {
	send(queue.shift());
}

global.connect = function (retry) {
	if (retry) {
		info('retrying...');
	}

	var ws = new WebSocketClient();

	ws.on('connectFailed', function (err) {
		error('Could not connect to server ' + Config.server + ': ' + err.stack);
		info('retrying in 3 seconds');

		setTimeout(function () {
			connect(true);
		}, 3000);
	});

	ws.on('connect', function (con) {
		Connection = con;
		ok('connected to server ' + Config.server);

		con.on('error', function (err) {
			error('connection error: ' + err.stack);
		});

		con.on('close', function (code, reason) {
			// Is this always error or can this be intended...?
			error('connection closed: ' + reason + ' (' + code + ')');
			info('retrying in 3 seconds');

			for (var i in Users.users) {
				delete Users.users[i];
			}
			Rooms.rooms.clear();
			setTimeout(function () {
				connect(true);
			}, 3000);
		});

		con.on('message', function (response) {
			if (response.type !== 'utf8') return false;
			var message = response.utf8Data;
			recv(message);

			// SockJS messages sent from the server begin with 'a'
			// this filters out other SockJS response types (heartbeats in particular)
			if (message.charAt(0) !== 'a') return false;
			Parse.data(message);
		});
	});

	// The connection itself
	var id = ~~(Math.random() * 1000);
	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
	var str = '';
	for (var i = 0, l = chars.length; i < 8; i++) {
		str += chars.charAt(~~(Math.random() * l));
	}

	var conStr = 'ws://' + Config.server + ':' + Config.port + '/showdown/' + id + '/' + str + '/websocket';
	info('connecting to ' + conStr + ' - secondary protocols: ' + (Config.secprotocols.join(', ') || 'none'));
	ws.connect(conStr, Config.secprotocols);
};

connect();
