/**
 * Games
 * BotStuff - https://github.com/CheeseMuffin/BotStuff
 *
 * This file contains the game system and related commands for BotStuff.
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');

class Player {
	constructor(user) {
		this.name = user.name;
		this.id = user.id;
		this.eliminated = false;
	}

	say(message) {
	    Users.add(this.id).say(message);
	}
}

class Game {
	constructor(room) {
		this.room = room;
		this.players = {};
		this.playerCount = 0;
		this.round = 0;
		this.started = false;
		this.ended = false;
		this.freeJoin = false;
		this.playerCap = -1;
		this.minigame = false;
		this.canLateJoin = false;
		this.canRejoin = false;
	}

	mailbreak() {
		Parse.say(this.room, '/w lady monita, .mail Moo, A game of ' + this.name + ' broke in progress!');
	}

	say(message) {
	    Parse.say(this.room, message);
	}

	html(message) {
		this.room.html(message);
	}

	signups() {
		this.say("survgame! If you would like to play, use the command ``/me in``");
		if (this.description) this.say(this.description);
		if (typeof this.onSignups === 'function') this.onSignups();
		if (this.freeJoin) this.started = true;
		this.timeout = setTimeout(() => this.start(), 5 * 60 * 1000);
	}

	getPlayerNames(players) {
		if (!players) players = this.players;
		let names = [];
		for (let i in players) {
			names.push(players[i].name);
		}
		return names.join(", ");
	}

	start() {
		if (this.started) return;
		if (this.playerCount < 1) {
			this.say("The game needs at least two players to start!");
			return;
		}
		this.started = true;
		if (typeof this.onStart === 'function') this.onStart();
	}

	autostart(target) {
		let x = Math.floor(target);
		if (!x || x > 120 || (x < 10 && x > 2) || x <= 0) return;
		if (x < 10) x *= 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		this.say("The game will automatically start in " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		this.timeout = setTimeout(() => this.start(), x * 1000);
	}

	cap(target) {
		let x = Math.floor(target);
		if (!x || x < 2) return;
		this.playerCap = x;
		if (this.playerCount >= x) {
			this.start();
		} else {
			this.say("The game will automatically start with " + x + " players!");
		}
	}

	end() {
		if (this.getRemainingPlayerCount() === 1) {
			let winPlayer = this.getLastPlayer();
			this.say("**Winner:** " + winPlayer.name);
		}
		if (this.ended) return;
		if (this.timeout) clearTimeout(this.timeout);
		if (typeof this.onEnd === 'function') this.onEnd();
		this.ended = true;
		this.room.game = null;
	}

	forceEnd() {
		if (this.ended) return;
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.say("The game was forcibly ended.");
		this.ended = true;
		this.room.game = null;
	}

	nextRound() {
		if (this.timeout) clearTimeout(this.timeout);
		this.round++;
		if (this.getRemainingPlayerCount() < 2) {
			this.end();
			return;
		}
		if (typeof this.onNextRound === 'function') this.onNextRound();
	}

	addPlayer(user) {
		if (user.id in this.players) return;
		let player = new Player(user);
		this.players[user.id] = player;
		this.playerCount++;
		if (this.playerCount === this.playerCap) {
			this.start();
		}
		return player;
	}

	removePlayer(user) {
		if (!(user.id in this.players) || this.players[user.id].eliminated) return;
		if (this.started) {
			this.players[user.id].eliminated = true;
		} else {
			delete this.players[user.id];
			this.playerCount--;
		}
	}

	renamePlayer(user, oldName) {
		let oldId = Tools.toId(oldName);
		if (!(oldId in this.players)) return;
		let player = this.players[oldId];
		player.name = user.name;
		if (player.id === user.id || user.id in this.players) return;
		player.id = user.id;
		this.players[user.id] = player;
		delete this.players[oldId];
		if (this.onRename) this.onRename(user);
	}

	join(user) {
		if (this.started && !this.canLateJoin) return;
		if (user.id in this.players && !this.canRejoin) return;
		if (this.freeJoin) {
			user.say("This game does not require you to join!");
			return;
		}
		if (user.id in this.players) {
			let player = this.players[user.id];
			if (!player.eliminated) return;
			user.say("You have rejoined the game of " + this.name + "!");
			player.eliminated = false;
			this.players[user.id] = player;
		} else {
			this.addPlayer(user);
			if (!this.started) user.say('You have joined the game of ' + this.name + '!');
		}
		if (typeof this.onJoin === 'function') this.onJoin(user);
	}

	leave(user) {
		if (!(user.id in this.players) || this.players[user.id].eliminated) return;
		this.removePlayer(user);
		user.say("You have left the game of " + this.name + "!");
		if (typeof this.onLeave === 'function') this.onLeave(user);
	}

	getRemainingPlayers() {
		let remainingPlayers = {};
		for (let i in this.players) {
			if (!this.players[i].eliminated) remainingPlayers[i] = this.players[i];
		}
		return remainingPlayers;
	}

	getRandomOrdering() {
		let remainPlayers = this.getRemainingPlayers();
		let order = Tools.shuffle(Object.keys(remainPlayers));
		let realOrder = [];
		for (let i = 0; i < order.length; i++) {
			realOrder.push(remainPlayers[order[i]]);
		}
		return realOrder;
	}

	getLastPlayer() {
		let remainingPlayers = this.getRemainingPlayers();
		return remainingPlayers[Object.keys(remainingPlayers)[0]];
	}

	getRemainingPlayerCount() {
		let count = 0;
		for (let i in this.players) {
			if (!this.players[i].eliminated) count++;
		}
		return count;
	}

	shufflePlayers(players) {
		if (!players) players = this.players;
		let list = [];
		for (let i in players) {
			list.push(players[i]);
		}
		return Tools.shuffle(list);
	}

	pl() {
		let players = [];
		for (let userID in this.players) {
			if (this.players[userID].eliminated) continue;
			players.push(this.players[userID].name);
		}
		this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + players.join(", "));
	}
	handlehtml(message) {
		if (!this.started) return;
		console.log(message);
		//try {
			message = message.substr(21);
			if (message.substr(0, 4) === "Roll") {
				let colonIndex = message.indexOf(":");
				message = message.substr(colonIndex + 2);
				message = message.substr(0, message.length - 6);
				if (typeof this.handleRoll === 'function') this.handleRoll(Math.floor(message));
			} else if (message.substr(4, 2) === "We") {
				let colonIndex = message.indexOf(":");
				message = message.substr(colonIndex + 7);
				message = message.substr(0, message.length - 6);
				while (message.indexOf('&') !== -1) {
					console.log(message.substr(0, message.indexOf('&')));
					console.log(message.substr(message.indexOf(';')) + 1);
					console.log(message.substr(0, message.indexOf('&')) + message.substr(message.indexOf(';')) + 1);
					message = message.substr(0, message.indexOf('&')) + message.substr(message.indexOf(';') + 1);
				}
				console.log(message);
				if (typeof this.handlePick === 'function') this.handlePick(message);
			} else {
				if (message.indexOf("rolls") !== -1) {
					let colonIndex = message.indexOf(":");
					message = message.substr(colonIndex + 2);
					let finalIndex = message.indexOf("<");
					message = message.substr(0, finalIndex);
					let rolls = [];
					message = message.split(", ");
					for (let i = 0; i < message.length; i++) {
						rolls.push(Math.floor(message[i]));
					}
					if (typeof this.handleRolls === 'function') this.handleRolls(rolls);
				}
			}
		//} catch (e) {
			//this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			//console.log(e);
			//this.end();
			//return;
		//}
	}
}

class GamesManager {
	constructor() {
		this.blah = null;
		this.games = {};
		this.aliases = {};
		this.fileMap = {};
		this.host = null;
		this.hosts = [];
		this.canTheme = true;
		this.canIntro = true;
		this.canQueue = true;
		this.isTimer = false;
		this.points = null;
		this.excepted = [];
		this.numHosts = {};
		this.destroyMsg = [
			"annihilates",
			"beats up",
			"reks",
			"destroys",
			"demolishes",
			"decimates",
		];
		this.lastGame = null;
	}

	importHosts() {
		try {
			this.numHosts = JSON.parse(fs.readFileSync('./databases/hosts.json'));
			console.log(this.numHosts);
		} catch (e) {};
	}

	exportHosts() {
		fs.writeFileSync('./databases/hosts.json', JSON.stringify(this.numHosts));
	}

	importHost() {
		let id = fs.readFileSync('./databases/host.json').toString();
		if (id) {
			console.log(id);
			Games.host = Users.get(id);
		}
		else Games.host = null;
		if (!Games.host) Games.host = null;
	}

	exportHost() {
		if (Games.host) {
			fs.writeFileSync('./databases/host.json', this.host.id);
		} else {
			fs.writeFileSync('./databases/host.json', '');
		}
	}
	addHost(user) {
		if (user.id) {
			user = user.id;
		}
		user = Tools.toId(user);
		let time = Math.floor(new Date().getTime() / 1000);
		if (user in this.numHosts) {
			this.numHosts[user].push(time);
		} else {
			this.numHosts[user] = [time];
		}
	}

	getHosts(user, days) {
		user = Tools.toId(user);
		let curTime = Math.floor(new Date().getTime() / 1000);
		if (!(user in this.numHosts)) {
			return ("**" + user + "** has never hosted.");
		} else {
			let time = days * 60 * 60 * 24;
			let hosts = this.numHosts[user];
			let numHosts = 0;
			for (let i in hosts) {
				let hostTime = hosts[i];
				if (Math.abs(curTime - hostTime) < time) {
					numHosts++;
				}
			}
			if (numHosts === 0) {
				return ("**" + user + "** has not hosted in the last " + days + " day" + (days > 1 ? "s" : "") + ".");
			} else {
				return ("**" + user + "** has hosted " + numHosts + " time" + (numHosts > 1 ? "s" : "") + " in the last " + days + " day" + (days > 1 ? "s" : "") + ".");
			}
		}
	}

	removeHost(user) {
		if (user.id) {
			user = user.id;
		}
		user = Tools.toId(user);
		if (!(user in this.numHosts)) return false;
		if (this.numHosts[user].length === 0) return false;
		this.numHosts[user].splice(this.numHosts[user].length - 1, 1);
		return true;
	}

	timer(room) {
	    Parse.say(room, "**Time's up!**");
		this.isTimer = false;
	}
	onLoad() {
		this.loadGames();
	}

	loadGame(fileName) {
		var path = process.cwd();
		delete require.cache[path + '\\games\\' + fileName];
		let file = require('./games/' + fileName);
		if (file.game && file.name && file.id) this.games[file.id] = file;
		this.aliases[file.name] = file.aliases;
	}

	loadGames() {
		let games;
		try {
			games = fs.readdirSync('./games');
		} catch (e) {}
		if (!games) return;
		for (let i = 0, len = games.length; i < len; i++) {
			let file = games[i];
			if (!file.endsWith('.js')) continue;
			let fileName = file;
			file = require('./games/' + file);
			if (file.game && file.name && file.id)  {
				this.games[file.id] = file;
			}
			this.aliases[file.name] = file.aliases;
			this.fileMap[file.id] = fileName;
		}
		this.importHosts();
		this.importHost();
	}

	createGame(game, room) {
		if (room.game) {
			return Parse.say(room, "A game of " + room.game.name + " is already in progress.");
		}
		let id = Tools.toId(game);
		for (let fileID in this.games) {
			let game = this.games[fileID];
			if (game.aliases.indexOf(id) !== -1) {
				id = fileID;
				break;
			} else if (id === fileID) {
				break;
			}
		}
		if (!(id in this.games)) return Parse.say(room, "The game '" + game.trim() + "' was not found.");
		if (this.games[id].minigame) return Parse.say(room, "You cannot signup a minigame!");
		this.loadGame(this.fileMap[id]);
		room.game = new this.games[id].game(room); // eslint-disable-line new-cap
		this.lastGame = id;
		return room.game;
	}
}

let Games = new GamesManager();
Games.Game = Game;
Games.Player = Player;
Games.backupInterval = setInterval(() => Games.exportHosts(), 60 * 1000);
Games.backupHostInterval = setInterval(() => Games.exportHost(), 60 * 1000);


module.exports = Games;
