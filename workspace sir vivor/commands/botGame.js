/***********************************************
	 *             BOT GAME COMMANDS               *
	 ***********************************************/


module.exports = {

	signups: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let id = Tools.toId(target);
		//if (id === 'ftl' || id === 'followtheleader') return room.say("Follow the Leader is currently down for repairs.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
		room.say("/modnote HOST: " + user.name + " started signups of " + room.game.name + ".");
	},

	forcesignups: function (target, user, room) {
		if (!user.hasRank(room.id, '#')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let id = Tools.toId(target);
		Games.lastGameTime = false;
		if (!Games.createGame(target, room)) return;
		room.game.signups();
		room.say("/modnote " + user.name + " forcibly started signups of " + room.game.name + ".");
	},

	startgame: 'start',
	start: function (target, user, room) {
		if (!user.hasRank(room.id, '+') || !room.game) return;
		if (typeof room.game.start === 'function') room.game.start();
	},

	endgame: 'end',
	end: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!room.game) {
			if (Games.host) {
				Games.host = null;
				Games.clearPlayerList();
				this.say(room, 'The game was forcibly ended.');
				this.say(room, '/modnote ' + user.name + ' ended a game.');
			}
			return;
		}
		room.game.forceEnd();
	},

	randgame: "randomgame",
	randomgame: function (arg, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let goodids = Object.keys(Games.games).slice();
		goodids = goodids.concat(Object.keys(Games.aliases));
		let id = Tools.sample(goodids);
		Games.createGame(id, room);
		while (room.game.baseId === Games.lastGame || id === 'ssb' || id === 'supersurvivorbros') {
			id = Tools.sample(goodids);
			Games.createGame(id, room);
		}
		console.log(id);
		room.game.signups();
		room.say("/modnote HOST: " + user.name + " started a random game of " + room.game.name + ".");
	},

	authhunt: function (target, user, room) {
		let split = target.split(",");
		if (split[0].toLowerCase() == 'status') {
			// return status of past battles won/lost
			return user.say(dd.authhunt_status(user.id));
		}
		if (split[0].toLowerCase() == 'help') {
			// return available commands
			user.say("``.authhunt status``: See status of battles recorded");
			if (!user.hasRank('survivor', '+')) return user.say("and ``.authhunt help``:To see a list of available commands.");
			user.say("``.authhunt list``: List of challengers fought");
			if (user.hasRank('survivor', '@')) {
				user.say("``.authhunt clearallrecords``: To clear all records for a new event.");
				user.say("``.authhunt addpoints``: To add points to LB and clear the auth hunt records after adding them.")
			}
			return user.say("``.authhunt <challenger>, <winner>``: To record the result of a battle.");
		}
		if (!user.hasRank('survivor', '+')) return;
		if (split[0].toLowerCase() == 'list') {
			// return list of battle challenges completed
			return user.say(dd.authhunt_getlist(user.id));
		}
		if (split[0].toLowerCase() == 'clearallrecords' && user.hasRank('survivor', '@')) {
			// clear records for new authhunt event
			dd.clear_authhunt_records();
			return user.say('successful!');
		}
		if (split[0].toLowerCase() == 'addpoints' && user.hasRank('survivor', '@')) {
			// clear records for new authhunt event
			dd.add_authunt_points();
			dd.clear_authhunt_records();
			return user.say('successful!');
		}
		if (split.length < 2) return user.say("Use ``.authhunt help`` to see available commands.")
		if (split.length != 2) return user.say("Please use the command as: ``.authunt challenger, winner`` or use ``.authhunt help``");
		let challenger = Tools.toId(split[0]);
		let winner = Tools.toId(split[1]);
		if (challenger == user.id) return user.say("You can't challenge yourself!");
		if (winner != challenger && winner != user.id) return user.say("Winner must be either yourself or the challenger!");
		let success = dd.authhunt_battle(user.id, challenger, winner);
		if (success) return user.say("Recorded successfully!");
		else return user.say("Already recorded, can't overright");
	},

	use: function (target, user, room) {
		if (!room.game) return;
		if (typeof room.game.use === 'function') room.game.use(target, user);
	},

	mk: 'dq',
	modkill: 'dq',
	dq: function (target, user, room) {
		if (room.game) {
			if (!user.hasRank(room.id, '+')) return;
			if (room.game && typeof room.game.dq === 'function') room.game.dq(target);
		}
		else if(Games.host) {
			if ((user.id == Games.host.id) || user.hasRank(room.id, '+')) {
				Games.dq(target, room);
			}
		}
		else return;
	},

	//Swirl note: I assume this is for bothosted
	pl: 'players',
	players: function (target, user, room) {
		if (room.game) {
			if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
			if (room.game && typeof room.game.pl === 'function') {room.game.pl(); }
		}
		else if(Games.host) {
			if(user.id == Games.host.id && target == 'survivor') {
				this.say(room, "/msgroom survivor, " + Games.displayPlayerList());
			}
			else if ((user.id == Games.host.id) || (room.id === user.id)) {
				const split = target.split(","), arg = split[0].trim().toLowerCase();
				switch (arg) {
					case 'shuffle':
						const list = Games.shuffleList(Games.getPlayerList());
						if (room.id === 'survivor') {
							this.say(room, "/addhtmlbox " + list);
						} else {
							this.say(room, "!htmlbox " + list);
						}
						break;
					case 'pick':
						const pick = Games.pickPlayer(Games.getPlayerList());
						if (room.id === 'survivor') {
							this.say(room, "/addhtmlbox " + pick);
						} else {
							this.say(room, "!htmlbox " + pick);
						}
						break;
					case 'elim':
						const playerName = split[1];
						const player = Games.players[Tools.toId(playerName)];
						Games.eliminatePlayer(player);
						break;
					case 'close':
						Games.disableSignups();
						break;
					case 'open':
						Games.enableSignups();
						break;
					case 'timer':
						const arg = split[1].trim();
						if (arg === "end") {
							if (Games.isTimer) {
								clearTimeout(Games.timeout);
								this.say(room, "The signup timer has been ended.");
								Games.isTimer = false;
								Games.isSignupTimer = false;
							} else {
								this.say(room, "There is no signup timer running!");
							}
							return;
						}
						let x = parseFloat(arg);
						if (!x || x > 300 || (x < 10 && x > 5) || x <= 0) return this.say(room, "The timer must be between 10 seconds and 5 minutes.");
						if (x < 10) x *= 60;
						let minutes = Math.floor(x / 60);
						let seconds = x % 60;
						clearTimeout(Games.timeout);
						this.say(room, "Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
						Games.timeout = setTimeout(() => Games.signupsTimer(room), x * 1000);
						Games.isTimer = true;
						Games.isSignupTimer = true;
						Games.signupsOpen = false;
						break;
					case 'add':
						const newPlayer = split[1];
						Games.addPlayer(newPlayer);
						break;
					default:
						this.say(room, Games.displayPlayerList());
				}
			}
		}
	},

	autostart: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (room.game && typeof room.game.autostart === 'function') room.game.autostart(target);
	},
};