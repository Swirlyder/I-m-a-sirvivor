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

	say(message) {
	    Parse.say(this.room, message);
	}

	html(message) {
		this.room.html(message);
	}

	signups() {
		this.say("survgame! If you would like to play, use the command ``/me in``");
		if (this.description) this.say("Description: " + this.description);
		if (typeof this.onSignups === 'function') this.onSignups();
		if (this.freeJoin) this.started = true;
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
		if (!x || x >= 120 || (x < 10 && x > 2) || x <= 0) return;
		if (x === 1) x = 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		this.say("The game will automatically start in " + (minutes > 0 ? "1 minute, " : "") + seconds + " seconds.");
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
		if (this.ended) return;
		if (this.timeout) clearTimeout(this.timeout);
		if (typeof this.onEnd === 'function') this.onEnd();
		this.ended = true;
		this.room.game = null;
	}

	forceEnd() {
		if (this.ended) return;
		if (this.timeout) clearTimeout(this.timeout);
		this.say("The game was forcibly ended.");
		this.ended = true;
		this.room.game = null;
	}

	nextRound() {
		if (this.timeout) clearTimeout(this.timeout);
		this.round++;
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
			if (typeof this.handlePick === 'function') this.handlePick(message);
		}
	}
}

class GamesManager {
	constructor() {
		this.games = {};
		this.aliases = {};
		this.fileMap = {};
		this.host = null;
		this.hosts = [];
		this.canTheme = true;
		this.canIntro = true;
		this.canQueue = true;
		this.isTimer = false;
	}

	timer(room) {
	    Parse.say(room, "**Time's up!**");
		this.isTimer = false;
	}
	onLoad() {
		this.loadGames();
	}

	loadGame(fileName) {
		delete require.cache[Config.homepath + fileName];
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
			if (file.game && file.name && file.id) this.games[file.id] = file;
			this.aliases[file.name] = file.aliases;
			this.fileMap[file.id] = fileName;
		}
	}

	sayDescription(game, room) {
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
		if (!(id in this.games)) return;
		if (this.games[id].minigame) return;
		Parse.say(room, this.games[id].description);
	}

	createMiniGame(game, room) {
	    if (room.game) return Parse.say(room, "A game of " + room.game.name + " is already in progress.");
	    if (room.canVote) return Parse.say(room, "Voting is in progress");
		this.loadGames();
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
		if (!this.games[id].minigame) return Parse.say(room, "Needs to be a minigame!");
		this.loadGame(this.fileMap[id]);
		room.game = new this.games[id].game(room); // eslint-disable-line new-cap
		room.game.signups();
	}
	createGame(game, room) {
	    if (room.canVote) return Parse.say(room, "Voting is in progress!");
		if (room.game) {
			if (room.game.minigame) {
			    return Parse.say(room, "A minigame is in progress!");
			} else {
			    return Parse.say(room, "A game of " + room.game.name + " is already in progress.");
			}
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
		return room.game;
	}
}

let Games = new GamesManager();
Games.Game = Game;
Games.Player = Player;

module.exports = Games;
