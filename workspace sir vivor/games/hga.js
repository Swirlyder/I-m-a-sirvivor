'use strict';

const name = 'Hunger Games Anon';
const description = '__Hunger Games but you don\'t know who is who...__ Game rules: http://survivor-ps.weebly.com/hunger-games-anon.html';
const id = Tools.toId(name);

class HGA extends Games.Game {
    constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.attacks = new Map();
		this.numAttacks = 0;
		this.nicks = [];
		this.order = [];
    }

    onStart() {
		this.pl();
		this.say("Please choose your nicknames (in pms) with ``" + Config.commandCharacter + "nick [name]``.");
		this.timeout = setTimeout(() => this.listNicksLeft(), 60 * 1000);
    }

    listNicksLeft() {
		try {
			let waitings = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.nick) continue;
				waitings.push(player.name);
			}
			this.say("Waiting on: " + waitings.join(", "));
			this.timeout = setTimeout(() => this.elimNicks(), 30 * 1000);
		} catch (e) {
			this.mailbreak(e);
		}
    }

    elimNicks() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				if (!player.nick) {
					player.say("You never chose a nickname!");
					player.eliminated = true;
				}
			}
			this.nextRound();
		} catch (e) {
			this.mailbreak(e);
		}
    }

    onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			this.canAttack = false;
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			this.say("Only **" + this.curPlayer.nick + "** and **" + this.oplayer.nick + "** are left! Moving directly to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.canAttack = true;
			let nicks = [];
			let names = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				nicks.push(player.nick);
				names.push(player.name);
			}
			this.order = [];
			this.numAttacks = 0;
			this.attacks.clear();
			this.say("**Nicks**: " + Tools.shuffle(nicks).join(", "));
			this.say("**Names**: " + this.getPlayerNames(this.getRemainingPlayers()));
			this.say("PM me your attacks with ``" + Config.commandCharacter + "destroy [nickname]``!");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		}
    }
    listRemaining() {
		try {
			let waitings = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (this.attacks.has(player) || player.eliminated) continue;
				waitings.push(player.name);
			}
			this.say("Waiting on: " + waitings.join(", "));
			this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
		} catch (e) {
			this.mailbreak(e);
		}
    }

    elimPlayers() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				if (!this.attacks.has(player)) {
					player.say("You didn't choose someone to attack this round and have been eliminated!");
					player.eliminated = true;
				}
			}
			this.handleAttacks();
		} catch (e) {
			this.mailbreak(e);
		}
    }

    handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.curPlayer = this.order.shift();
			this.oplayer = this.attacks.get(this.curPlayer);
			if (this.curPlayer.eliminated || this.oplayer.eliminated) {
				this.handleAttacks();
			} else {
				this.say('**' + this.curPlayer.nick + "** is attacking **" + this.oplayer.nick + "**!");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			}
		}
    }

    doPlayerAttack() {
		this.rolla = null;
		this.rollb = null;
		this.roll1 = 100;
		this.roll2 = 100;
		this.sayPlayerRolls();
    }

	handleWinner(winPlayer, losePlayer) {
		this.say("**" + winPlayer.nick + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.nick + "**, who was actually **" + losePlayer.name + "**!");
		this.elimPlayer(losePlayer);
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

    destroy(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
	    	if (Tools.toId(player.nick) === Tools.toId(target)) return;
		if (this.attacks.has(player)) return user.say("You have already attacked someone this round!");
		let attackedPlayer;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && Tools.toId(player.nick) === Tools.toId(target)) {
				attackedPlayer = player;
				break;
			}
		}
		if (!attackedPlayer) {
			return user.say("Invalid nickname to attack.");
		}
		this.attacks.set(player, attackedPlayer);
		user.say("You have attacked **" + attackedPlayer.nick + "**!");
		this.numAttacks++;
		this.order.push(player);
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
    }

	nick(target, user) {
		if (!target) return;
		let player = this.players[user.id];
		if (!player) return;
		if (player.nick) return user.say("You have already chosen a nickname!");
		if (this.nicks.indexOf(Tools.toId(target)) !== -1) return user.say("Somebody has already chosen that nickname!");
		if (Tools.toId(target).length !== target.length) {
			return user.say("Your nickname can only contain alphanumeric characters.");
		}
		if (target.length > 15) {
			return user.say("Your nickname can only be 15 characters long.");
		}
		player.nick = target;
		this.nicks.push(Tools.toId(target));
		user.say("You have chosen your nickname as **" + target + "**!");
		if (this.nicks.length === this.playerCount) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
    }
}

exports.name = name;
exports.id = id;
exports.aliases = ['hga'];
exports.game = HGA;
exports.description = description;
exports.modes = ['Golf', 'Roll Switch', 'Second Wind'];
exports.commands = {
	destroy: "destroy",
	nick: "nick",
}
exports.pmCommands = {
	destroy: true,
	nick: true,
}
