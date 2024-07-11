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
const logging = require('./utilities/logging.js');
const fs = require('fs');
const path = require('path');

global.toId = function(text) {
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
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

try {
	global.Config = require('./config.js');
} catch (e) {
	console.log(e);
	logging.error('config.js doesn\'t exist; are you sure you copied config-example.js to config.js?');
	process.exit(-1);
}

// And now comes the real stuff...
logging.info('starting server');
var WebSocketClient = require('websocket').client;

//classes
global.Tools = require('./classes/Tools.js');
global.dd = require('./classes/points.js');
global.Battles = require('./classes/Battles.js');
global.Users = require('./classes/User.js');
global.Rooms = require('./classes/Room.js');

global.Commands = require('./commands.js').commands;
global.Parse = require('./parser.js').parse;

global.Games = require('./games.js');
global.PL_Menu = require('./classes/HTMLPage.js');


console.log(Tools.mod(912673, 688165, 1032247));
dd.importData();
Games.loadGames();


try {
	global.chatmes = JSON.parse(fs.readFileSync('./databases/chat.json').toString());
} catch (e) {}
if (!global.chatmes) global.chatmes = {};
function saveChatMes() {
	fs.writeFileSync('./databases/chat.json', JSON.stringify(chatmes));
}

global.Connection = null;
setInterval(() => saveChatMes(), 10 * 60 * 1000);

fs.watchFile('./commands.js', function (curr, prev) {
	if (curr.mtime <= prev.mtime) return;
	try {
		delete require.cache[require.resolve('./commands.js')];
		Config = require('./config.js');
		logging.info('reloaded commands');
	} catch (e) {}
});

var watcher = chokidar.watch('./games', {ignored: /^\./, persistent: true});
function reloadGames () {
	delete require.cache[require.resolve('./games.js')];
	Games = require('./games.js');
	Games.loadGames();
	logging.info('Games reloaded.');
}
watcher
  .on('add', function(path) {
	  reloadGames();
  })
  .on('change', function(path) {
	  reloadGames();
  });
fs.watchFile('./Games.js', function (curr, prev) {
	if (curr.mtime <= prev.mtime) return;
	try {
		delete require.cache[require.resolve('./Games.js')];
		Games = require('./games.js');
		Games.loadGames();
		logging.info('Games reloaded.');
	} catch (e) {}
});

var queue = [];
var dequeueTimeout = null;
var lastSentAt = 0;

global.send = function (data) {
	if (!data || !global.Connection.connected) return false;
	
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
	logging.dsend(data);
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

// Function to connect to the WebSocket server
global.connect = function (retry) {
	if (retry) {
		logging.info('retrying...');
	}

	var ws = new WebSocketClient({ maxReceivedFrameSize: 0x400000 });

	ws.on('connectFailed', function (err) {
		logging.error('Could not connect to server ' + Config.server + ': ' + err.stack);
		logging.info('retrying in 3 seconds');

		setTimeout(function () {
			global.connect(true);
		}, 3000);
	});

	ws.on('connect', function (con) {
		global.Connection = con; // Store the connection in the global variable
		logging.ok('connected to server ' + Config.server);

		con.on('error', function (err) {
			logging.error('connection error: ' + err.stack);
		});

		con.on('close', function (code, reason) {
			logging.error('connection closed: ' + reason + ' (' + code + ')');
			logging.info('retrying in 3 seconds');

			for (var i in Users.users) {
				delete Users.users[i];
			}
			Rooms.rooms.clear();
			setTimeout(function () {
				global.connect(true);
			}, 3000);
		});

		con.on('message', function (response) {
			if (response.type !== 'utf8') return false;
			var message = response.utf8Data;
			if (!['c', 'l', 'n', 'j'].includes(toId(message.split('|')[1]))) logging.recv(message);

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
	logging.info('connecting to ' + conStr + ' - secondary protocols: ' + (Config.secprotocols.join(', ') || 'none'));
	ws.connect(conStr, Config.secprotocols);
};

//Set up back up a backup for LB points
const ExternalDoc = require('./classes/ExternalDoc.js');
const LbFilePath = path.join(__dirname, './databases/dd.json');
const Backup = new ExternalDoc();
const interval = 30 * 60 * 1000; // 30 mins in miliseconds

//Initial backup
Backup.copyToBackup(LbFilePath, Config.backupLBDocID);

//Copies dd.json to backup doc every 30 minutes
setInterval(() => {
	Backup.copyToBackup(LbFilePath, Config.backupLBDocID);
}, interval);


//Connect to PS
global.connect();