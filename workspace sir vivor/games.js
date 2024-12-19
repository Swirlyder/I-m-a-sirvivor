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
		this.ended = false;
		this.started = false;
		this.freeJoin = false;
		this.playerCap = -1;
		this.minigame = false;
		this.canLateJoin = false;
		this.canRejoin = false;
		this.winners = new Map();
		this.parentGame = null;
		this.childGame = null;
		this.golf = false;
		this.rollSwitch = false;
		this.max = false;
		this.sum = true;
	}

	mailbreak(e) {
		if (Config.developers) {
			for (let i = 0; i < Config.developers.length; i++) {
				Parse.say(this.room, '/w lady monita, .mail ' + Config.developers[i] + ', A game of ' + this.name + ' 		broke in progress! ' + (e ? e : ""));
			}
		}
		console.log(e);
		let fs = require('fs');
		if (!fs.existsSync('error.log')) fs.writeFileSync('error.log', '');
		fs.appendFileSync('error.log', e + "\n\n\n");
		this.say("I'm sorry, the game broke. moo has been notified and will fix it as soon as they can.");
		this.end();
	}

	say(message) {
	    Parse.say(this.room, message);
	}

	html(message) {
		this.room.html(message);
	}

	signups() {
		if (this.room.id === 'trivia') {
			this.say("triviasignups! If you would like to join the ~~gulag~~ game, do ``/me in``");
		} else {
			this.say("survgame! If you would like to play the game of **" + this.name + "**, use the command ``/me in``");
		}
		if (this.description) this.say("**" + this.name + "**: " + this.description);
		if (typeof this.onSignups === 'function') this.onSignups();
		this.timeout = setTimeout(() => this.start(), 5 * 60 * 1000);
	}

	getName(player) {
		return player.name;
	}
	
	elimPlayer(player) {
		player.eliminated = true;
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
		try {
			if (this.started || this.ended) return;
			if (this.playerCount < 2) {
				this.say("The game needs at least two players to start!");
				return;
			}
			this.started = true;
			if (typeof this.onStart === 'function') this.onStart();
		} catch (e) {
			this.mailbreak(e);
		}
	}

	autostart(target) {
		let x = Math.floor(target);
		if (!x || x > 300 || (x < 10 && x > 5) || x <= 0) return;
		if (x < 10) x *= 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		this.say("The game will automatically start in " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		this.timeout = setTimeout(() => this.start(), x * 1000);
	}

	dq(target) {	
		let player = this.players[Tools.toId(target)];
		if (!player || player.eliminated) return;
		player.eliminated = true;
		this.say(player.name + " was DQed.");
		if (typeof this.onLeave === 'function') this.onLeave(player);
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
		} else if (this.getRemainingPlayerCount() === 0) {
			this.say("Everybody was killed!");
		}
		Games.lastGameTime = new Date().getTime();
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
		try {
			if (this.timeout) clearTimeout(this.timeout);
			this.round++;
			if (this.getRemainingPlayerCount() < 2) {
				this.end();
				return;
			}
			if (typeof this.onNextRound === 'function') this.onNextRound();
		} catch (e) {
			this.mailbreak(e);
		}
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
		try {
			if (!(user.id in this.players) || this.players[user.id].eliminated) return;
			if (this.started) {
				this.players[user.id].eliminated = true;
			} else {
				delete this.players[user.id];
				this.playerCount--;
			}
		} catch (e) {
			this.mailbreak(e);
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
		if (this.onRename) this.onRename(user, oldName);
	}

	getSuffix(player) {
		return "";
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
			this.addPlayer(user)
			if (!this.started) user.say('You have joined the game of ' + this.name + '!');
		}
		if (typeof this.onJoin === 'function') this.onJoin(user);
	}

	elimAllExcept(player) {
		for (let userID in this.players) {
			let curp = this.players[userID];
			if (player === curp) continue;
			curp.eliminated = true;
		}
	}
	
	leave(user) {
		if (!(user.id in this.players) || this.players[user.id].eliminated) return;
		this.removePlayer(user);
		user.say("You have left the game of " + this.name + ".");
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
		return this.shufflePlayers(this.getRemainingPlayers());
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
		return Tools.shuffle(Object.values(players));
	}

	getPlayer(message) {
		for (let userID in this.players) {
			if (userID === Tools.toId(message)) return this.players[userID];
		}
		let last = message.lastIndexOf("[");
		if (last === -1) last = message.lastIndexOf("(");
		if (last === -1) last = message.length;
		return this.players[Tools.toId(message.substr(0, last))];
	}

	pl() {
		this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
	}

	sayPlayerRolls() {
		try {
			this.rolla = null;
			this.rollb = null;
			if(this.rollSwitch) {
				this.golf = false;
				let choice = (Math.random() < 0.5 ? 0 : 1);
				if(choice === 0) {
					this.golf = true;
					this.say("The roll mode is **Golf!**");
				} else {
					this.say("The roll mode is **Regular!**");
				}
			}
			if (this.roll1 && this.roll2) {
				this.say("!roll " + this.roll1);
				this.say("!dice " + this.roll2);
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}

	handleRoll(roll) { 
		if (!this.rolla) this.rolla = roll;
		else {
			this.rollb = roll;
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same. Rerolling...");
				this.timeout = setTimeout(() => this.sayPlayerRolls(), 5 * 1000);
			} else {
				let winPlayer, losePlayer;
				if (this.rolla > this.rollb && (!this.golf) || (this.rolla < this.rollb && this.golf)) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
				} else {
					winPlayer = this.oplayer;
					losePlayer = this.curPlayer;
				}
				if (typeof this.handleWinner === 'function') this.handleWinner(winPlayer, losePlayer);
			}
		}
	}

	handleRolls(rolls) {
		let roll = 0;
		if (!roll) {
			Parse.say("/w Lady Monita, .mail Cheese, rolls is undefined in a game of " + this.name + "!");
		}
		if (this.max) {
			for (let i = 0; i < rolls.length; i++) {
				roll = Math.max(roll, rolls[i]);
			}
		} else {
			for (let i = 0; i < rolls.length; i++) {
				roll += rolls[i];
			}
		}
		if (typeof this.handleRoll === 'function') this.handleRoll(roll);
	}
	handlehtml(message) {
		try {
			if (!this.started) return;
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
					message = message.substr(0, message.indexOf('&')) + message.substr(message.indexOf(';') + 1);
				}
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
		} catch (e) {
			this.mailbreak(e);
		}
	}
}

class GamesManager {
	constructor() {
		this.botHostRoom = null;
		this.games = {};
		this.modes = {};
		this.aliases = {};
		this.commands = {};
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
		this.hostbans = {};
		this.numHosts = {};
		this.destroyMsg = [
			"annihilates",
			"beats up",
			"reks",
			"destroys",
			"demolishes",
			"decimates",
			"obliterates",
		];
		this.lastGame = null;
		this.aprilFools = false;
		this.lastGameTime = null;
		this.timeBetweenGames = 900000;
	}

	say(room, message) {
	    Parse.say(room, message);
	}

	importData() {
		try {
			this.numHosts = JSON.parse(fs.readFileSync('./databases/hosts.json').toString());
		} catch (e) {};
		let id = fs.readFileSync('./databases/host.json').toString();
		if (id) {
			Games.hostid = id;
		}
		else Games.hostid = null;
		if (!Games.host) Games.host = null;
		try {
			this.hostbans = JSON.parse(fs.readFileSync('./databases/hostbans.json').toString());
		}  catch (e) {};
		for (let i in this.hostbans) {
			let remainingTime = this.hostbans[i].endTime - new Date().getTime();
			setTimeout(() => this.unHostBan(i), remainingTime);
		}
	}

	hostBan(user, days) {
		if (user.id in this.hostbans) {
			return "**" + user.name + "** is already hostbanned";
		}
		this.hostbans[user.id] = {
			name: user.name,
			endTime: new Date().getTime() + days * 24 * 60 * 60 * 1000,
		}
		return "**" + user.name + "** has been hostbanned for " + days + " day" + (days > 1 ? "s" : "");
	}

	unHostBan(userName) {
		let userID = Tools.toId(userName);
		if (userID in this.hostbans) {
			let name = this.hostbans[userID].name;
			delete this.hostbans[userID];
			return "**" + name + "** has been unhostbanned.";
		} else {
			return "**" + userName+ "** is not currently hostbanned.";
		}
	}

	banTime(userName) {
		let userID = Tools.toId(userName);
		if (userID in this.hostbans) {
			let millis = this.hostbans[userID].endTime - new Date().getTime();
			millis /= 1000;
			millis = Math.floor(millis);
			let numDays = Math.floor(millis / (24 * 60 * 60));
			millis %= (24 * 60 * 60);
			let numHours = Math.floor(millis / (60 * 60));
			millis %= (60 * 60);
			let numMinutes = Math.floor(millis / 60);
			let str = "";
			if (numDays > 0) {
				str += numDays + " day" + (numDays > 1 ? "s" : "");
			}
			if (numHours > 0) {
				if (str) str += ", ";
				str += numHours + " hour" + (numHours > 0 ? "s" : "");
			}
			return str;
		} else {
			return "**" + userName + "** is not currently hostbanned.";
		}
	}

	exportData() {
		fs.writeFileSync('./databases/hosts.json', JSON.stringify(this.numHosts));
		if (Games.host) {
			fs.writeFileSync('./databases/host.json', Games.host.id);
		} else {
			fs.writeFileSync('./databases/host.json', '');
		}
		fs.writeFileSync('./databases/hostbans.json', JSON.stringify(this.hostbans));
	}

	addHost(user, room) {
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
		this.botHostRoom = room;
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

	timer(room, user) {
	    room.say("**Time's up, " + user.name + "!**");
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
		
			games = fs.readdirSync('./games');
		
		if (!games) return;
		for (let i = 0, len = games.length; i < len; i++) {
			let game = games[i];
			if (!game.endsWith('.js')) continue;
			game = require('./games/' + game);
			this.games[game.id] = game;
		}

		let modes;
		
			modes = fs.readdirSync('./games/modes');
		
		if (modes) {
			for (let i = 0, len = modes.length; i < len; i++) {
				let mode = modes[i];
				if (!mode.endsWith('.js')) continue;
				mode = require('./games/modes/' + mode);
				this.modes[mode.id] = mode;
				if (mode.commands) {
					if (i in this.commands && this.commands[i] !== mode.commands[i]) throw new Error(mode.name + " command '" + i + "' is already used for a different game function (" + this.commands[i] + ").");
					for (let i in mode.commands) {
						if (i in Commands) {
							if (i in this.commands) continue;
							//throw new Error(mode.name + " mode command '" + i + "' is already a command.");
						}
						let gameFunction = mode.commands[i];
						this.commands[i] = gameFunction;
						if (gameFunction in mode.commands && gameFunction !== i) {
							Commands[i] = gameFunction;
							continue;
						}
						Commands[i] = function (target, room, user, command, time) {
							if (room.game) {
								if (typeof room.game[gameFunction] === 'function') room.game[gameFunction](target, user, command, time);
							} else if (room === user) {
							Rooms.rooms.forEach(function (value, room) {
									if (room.game && room.game.pmCommands && (room.game.pmCommands === true || i in room.game.pmCommands) && typeof room.game[gameFunction] === 'function') room.game[gameFunction](target, user, command, time);
								});
							}
						};
					}
				}
			}

			for (let i in this.modes) {
				let mode = this.modes[i];
				if (mode.aliases) {
					for (let i = 0, len = mode.aliases.length; i < len; i++) {
						let alias = Tools.toId(mode.aliases[i]);
						if (alias in this.modes) throw new Error(mode.name + " alias '" + alias + "' is already a mode.");
						this.modes[alias] = mode;
						mode.aliases[i] = alias;
					}
				}
			}
		}

		for (let i in this.games) {
			let game = this.games[i];
			if (game.inherits) {
				if (!game.install) throw new Error(game.name + " must have an install method to inherit from other games.");
				let parentId = Tools.toId(game.inherits);
				if (parentId === game.id || !(parentId in this.games)) throw new Error(game.name + " inherits from an invalid game.");
				if (!this.games[parentId].install) throw new Error(game.name + "'s parent game '" + game.inherits + "' must have an install method.");
				game.inherits = parentId;
			}
			if (game.commands) {
				for (let i in game.commands) {
					if (i in this.commands && this.commands[i] !== game.commands[i]) throw new Error(game.name + " command '" + i + "' is already used for a different game function (" + this.commands[i] + ").");
					if (i in Commands) {
						if (i in this.commands) continue;
						//throw new Error(game.name + " command '" + i + "' is already a command.");
					}
					let gameFunction = game.commands[i];
					this.commands[i] = gameFunction;
					if (gameFunction in game.commands && gameFunction !== i) {
						Commands[i] = gameFunction;
						continue;
					}
					Commands[i] = function (target, user, room, command, time) {
						if (room.game) {
							if (typeof room.game[gameFunction] === 'function') room.game[gameFunction](target, user, command, time);
						} else if (room === user) {
							Rooms.rooms.forEach(function (room) {
								if (room.game && room.game.pmCommands && (room.game.pmCommands === true || i in room.game.pmCommands) && typeof room.game[gameFunction] === 'function') room.game[gameFunction](target, user, command, time);
							});
						}
					};
				}
			}
			if (game.aliases) {
				for (let i = 0, len = game.aliases.length; i < len; i++) {
					let alias = Tools.toId(game.aliases[i]);
					if (!(alias in this.aliases) && !(alias in this.games)) this.aliases[alias] = game.id;
				}
			}
			if (game.variations) {
				let variations = game.variations;
				game.variations = {};
				for (let i = 0, len = variations.length; i < len; i++) {
					let variation = variations[i];
					let id = Tools.toId(variation.name);
					if (id in this.games) throw new Error(game.name + " variation '" + variation.name + "' is already a game.");
					variation.id = id;
					let variationId = Tools.toId(variation.variation);
					if (variationId in this.modes) throw new Error(variation.name + "'s variation '" + variation.variation + "' exists as a mode.");
					variation.variationId = variationId;
					game.variations[variationId] = variation;
					if (!(id in this.aliases)) this.aliases[id] = game.id + ',' + variationId;
					if (variation.aliases) {
						for (let i = 0, len = variation.aliases.length; i < len; i++) {
							let alias = Tools.toId(variation.aliases[i]);
							if (!(alias in this.aliases) && !(alias in this.modes)) this.aliases[alias] = game.id + ',' + variationId;
						}
					}
					if (variation.variationAliases) {
						if (!game.variationAliases) game.variationAliases = {};
						for (let i = 0, len = variation.variationAliases.length; i < len; i++) {
							let alias = Tools.toId(variation.variationAliases[i]);
							if (!(alias in game.variationAliases) && !(alias in this.modes)) game.variationAliases[alias] = variationId;
						}
					}
				}
			}
			if (game.modes) {
				let modes = game.modes;
				game.modes = {};
				for (let i = 0, len = modes.length; i < len; i++) {
					let modeId = Tools.toId(modes[i]);
					if (!(modeId in this.modes)) throw new Error(game.name + " mode '" + modeId + "' does not exist.");
					game.modes[modeId] = modeId;
					let prefix = this.modes[modeId].naming === 'prefix';
					let id;
					if (prefix) {
						id = this.modes[modeId].id + game.id;
					} else {
						id = game.id + this.modes[modeId].id;
					}
					if (!(id in this.aliases)) this.aliases[id] = game.id + ',' + modeId;
					if (this.modes[modeId].aliases) {
						if (!game.modeAliases) game.modeAliases = {};
						for (let i = 0, len = this.modes[modeId].aliases.length; i < len; i++) {
							game.modeAliases[this.modes[modeId].aliases[i]] = modeId;
							let id;
							if (prefix) {
								id = this.modes[modeId].aliases[i] + game.id;
							} else {
								id = game.id + this.modes[modeId].aliases[i];
							}
							if (!(id in this.aliases)) this.aliases[id] = game.id + ',' + modeId;
						}
					}
				}
			}
		}
		this.importData();
	}

	getFormat(target) {
		if (typeof target === 'object') return target;
		target = target.split(',');
		let format = target.shift();
		let id = Tools.toId(format);
		if (id in this.aliases) {
			id = this.aliases[id];
			if (id.includes(',')) return this.getFormat(id + ',' + target.join(','));
		}
		if (!(id in this.games)) return;
		format = Object.assign({}, this.games[id]);
		let variation, mode;
		for (let i = 0, len = target.length; i < len; i++) {
			let id = Tools.toId(target[i]);
			if (format.variations) {
				if (format.variationAliases && id in format.variationAliases) id = format.variationAliases[id];
				if (id in format.variations) variation = format.variations[id];
			}
			if (format.modes) {
				if (format.modeAliases && id in format.modeAliases) id = format.modeAliases[id];
				if (id in format.modes) mode = format.modes[id];
			}
		}
		if (variation) Object.assign(format, variation);
		if (mode) format.modeId = mode;
		format.baseId = id.split(",")[0];
		return format;
	}

	formatTime(time) {
		let x = Math.floor(time / 1000);
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		return (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "");
	}

	createGame(target, room) {
		if (room.game) {
			room.say("A game of " + room.game.name + " is already in progress.");
			return false;
		}

		if (this.lastGameTime) {
			let curTime = new Date().getTime();
			/*if ((curTime - this.lastGameTime) < this.timeBetweenGames) {
				room.say("You must wait another " + this.formatTime(this.lastGameTime + this.timeBetweenGames - curTime) + " before starting another game.");
				return false;
			}*/
		}

		let format = this.getFormat(target);
		Game.lastGame = format.baseId;
		let baseClass;
		if (format.inherits) {
			let parentFormat = format;
			let parentFormats = [];
			while (parentFormat.inherits) {
				parentFormat = this.games[parentFormat.inherits];
				if (parentFormats.includes(parentFormat)) throw new Error("Infinite inherit loop created by " + format.name + ".");
				parentFormats.unshift(parentFormat);
			}
			baseClass = Game;
			for (let i = 0, len = parentFormats.length; i < len; i++) {
				baseClass = parentFormats[i].install(baseClass);
			}
			baseClass = format.install(baseClass);
		} else if (format.install) {
			baseClass = format.install(Game);
		} else {
			baseClass = format.game;
		}
		room.game = new baseClass(room); // eslint-disable-line new-cap
		Object.assign(room.game, format);
		if (format.modeId) this.modes[format.modeId].mode.call(room.game);
		return room.game;
	}

	createChildGame(format, parentGame) {
		parentGame.room.game = null;
		let childGame = this.createGame(format, parentGame.room);
		parentGame.childGame = childGame;
		childGame.parentGame = parentGame;
		childGame.players = parentGame.players;
		childGame.playerCount = parentGame.playerCount;
		return childGame;
	}
	getCardHTML(rank, suit) {
		return `<div style="width:75px; background-color:#FAF9F6; color:black; padding:3px; border-radius: 5px;"><p style="margin:0px;">${rank}${suit}</p><p style="text-align:center; font-size:2em;">${suit}</p><p style="color:black; margin-bottom:1px; transform: rotate(180deg)">${rank}${suit}</p></div>`;
		}
}
// ##PLAYERLIST TOOL## 
// Due the unorganized nature of games.js, this feature 
// will currently only work properly in the survivor room
// enable via .enabletool pltool, disable via .disabletool pltool
// Is currently set to disable after a host ends.
const pl_assistant_PAGE_ID = 'playerlistassistant';
class PL_Assistant extends GamesManager{
    constructor(room){
		super(room);
		this.pageID = pl_assistant_PAGE_ID;
		this.playerCount = 0;
		this.players = {};
		this.playerListToolEnabled = false;
		this.signupsOpen = true;
		this.expandedUser = 'none';
		this.notes = '';
		this.playersElim = {};
		this.hideNotes = true;
		this.isSignupTimer = false;
		this.PLCooldown = false;
    }
	addPlayer(user) {
		if (this.host.id === user.id || user.id in this.players) return;
		const player = new Player(user);
		this.players[user.id] = player;
		this.playerCount++;
		return player;
	}
	removePlayer(player) {
		if (!player) return;
		delete this.players[player.id];
}
	removePlayerAndDecrement(user) {
		if (!(user.id in this.players) || this.players[user.id].eliminated) return;
		this.removePlayer(user);
		this.playerCount--;
	}
	eliminatePlayer(player) {
		if (!player || player.eliminated) return;
		player.eliminated = true;
		this.playerCount--;
	}
	undoElimination(player) {
		if (!player || !player.eliminated) return;
		player.eliminated = false;
	}
	getPlayerList() {
		let names = [], result='';
		for (let i in this.players) {
			if(!this.players[i].eliminated) names.push(this.players[i].name);
		}
		result += names.join(", ");
		return result;
	}
	displayPlayerList() {
		let pl = "**PL: (" + this.playerCount + ")**: " + this.getPlayerList();
		return pl;
	}
	shuffleList(pl) {
		let stuff = pl.split(",");
		this.shuffle(stuff);
		let str = "<i>" + stuff.join(', ').replace(/>/g, "&gt;").replace(/</g, "&lt;").trim() + "</i>";
		return str;
	}
	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	pickPlayer(pl) {
		let stuff = pl.split(",");
		let str = "<em>We randomly picked:</em> " + Tools.sample(stuff).replace(/>/g, "&gt;").replace(/</g, "&lt;").trim();
		return str;
	}
	signupsOpened(){
		return this.signupsOpen;
	}
	toggleSignups() {
		this.signupsOpen = !this.signupsOpen;
	}
	enableSignups(){
		this.signupsOpen = true;
	}
	disableSignups(){
		this.signupsOpen = false;
	}
	enablePlTool(){
		this.playerListToolEnabled = true;
	}
	disablePlTool(){
		this.playerListToolEnabled = false;
	}
	plToolIsEnabled(){
		return this.playerListToolEnabled;
	}
	saveNotes(notes){
		this.notes = notes;
	}
	handleSignupsTimer(room, user){
		this.say(room, "/msgroom Survivor, Signups are closed!");
		this.signupsOpen = false;
		this.isSignupTimer = false;
		const html = PL_Menu.generatePLAssistantHTML();
		PL_Menu.sendPage(user.id, "Playerlist-Assistant", html, room);
	}
	handlePlayerListExit(user, room){
		this.say(room, "/msgroom survivor, /closehtmlpage + " + user.id + ", " + pl_assistant_PAGE_ID);
	}
	handlePLDisplayCooldown(){
		this.PLCooldown = false;
	}
	resetPLData() {
		this.players= [];
		this.playersElim = [];
		this.playerCount = 0;
		this.signupsOpen = true;
		this.expandedUser = 'none';
		this.playerListToolEnabled = false;
		this.PLCooldown = false;
	}
}

let Games = new PL_Assistant();
Games.Game = Game;
Games.Player = Player;
Games.backupInterval = setInterval(() => Games.exportData(), 60 * 1000);
module.exports = Games;
