'use strict';

const name = 'Exclusions';
const description = '**Exclusions**: __The theme where even you don\'t wanna know who you are...__ Game rules: http://survivor-ps.weebly.com/exclusions.html';
const id = Tools.toId(name);

class EXC extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.attacks = new Map();
		this.nicks = [];
	}

	onStart() {
		this.pl();
		this.say("Please choose your nicknames (in pms) with ``" + Config.commandCharacter + "nick [name]``.");
		this.timeout = setTimeout(() => this.listNicksLeft(), 60 * 1000);
    }

	listNicksLeft() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.nick) continue;
			waitings.push(player.name);
		}
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimNicks(), 30 * 1000);
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

	elimNicks() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!player.nick) {
				player.say("You never chose a nickname!");
				player.eliminated = true;
			}
		}
		this.nextRound();
    }

	onNextRound() {
		this.order = [];
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			this.canAttack = false;
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
			this.finals = true;
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.canAttack = true;
			this.numAttacks = 0;
			this.pl();
			this.attacks.clear();
			this.say("PM me your attacks with ``" + Config.commandCharacter + "destroy [user]``!");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		}
	}

	listRemaining() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (this.attacks.has(player) || player.eliminated) continue;
			waitings.push(player.name);
		}
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
    }

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.attacks.has(player)) {
				player.say("You didn't choose someone to attack this round and have been eliminated!");
				player.eliminated = true;
			}
		}
		this.setOrder();
    }

	setOrder() {
		this.canAttack = false;
		this.nicks = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			this.nicks.push(player.nick);
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let attacked = this.attacks.get(player);
			let index = this.nicks.indexOf(attacked.nick);
			if (index !== -1) this.nicks.splice(index, 1);
		}
		this.doNextNick();
	}

	doNextNick() {
		if (this.nicks.length === 0) {
			this.startAttacks();
		} else {
			let nick = this.nicks[0];
			let realp;
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.nick === nick) {
					realp = player;
					break;
				}
			}
			if (realp.eliminated) {
				this.nicks.shift();
				this.doNextNick();
			} else {
				this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
			}
		}
	}

	startAttacks() {
		this.say("Time to begin attacks!");
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	handleAttacks() {
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.curPlayer = this.order.shift();
			this.oplayer = this.attacks.get(this.curPlayer);
			if (this.curPlayer.eliminated || this.oplayer.eliminated) {
				this.handleAttacks();
			} else {
				this.say('**' + this.curPlayer.nick + "** is attacking **" + this.oplayer.name + "**!");
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
		if (winPlayer === this.curPlayer) {
			this.say("**" + winPlayer.nick + "** beats up **" + this.oplayer.name + "**, whose nickname was **" + this.oplayer.nick + "**!");
			this.oplayer.eliminated = true;
		} else {
			this.say("**" + winPlayer.name + "** defends successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	handlePick(pick) {
		this.nickPlayer = this.players[Tools.toId(pick)];
		this.nick = this.nicks.shift();
		this.say("**" + this.nickPlayer.name + "**, who do you think **" + this.nick + "** is? Use ``" + Config.commandCharacter + "suspect [user]`` to guess.");
		this.timeout = setTimeout(() => this.elimPlayer(), 90 * 1000);
	}

	elimPlayer() {
		this.nickPlayer.eliminated = true;
		this.say("**" + this.nickPlayer.name + "** never suspected anyone!");
		this.nickPlayer = null;
		this.timeout = setTimeout(() => this.doNextNick(), 5 * 1000);
	}

	suspect(target, user) {
		if (!this.nickPlayer) return;
		let player = this.players[user.id];
		if (!player || player.id !== this.nickPlayer.id) return;
		let attackedPlayer = this.players[Tools.toId(target)];
		if (!attackedPlayer) return user.say("That is not a valid player!");
		if (attackedPlayer.nick === this.nick) {
			this.say("Correct! RIP **" + attackedPlayer.name + "**.");
			attackedPlayer.eliminated = true;
		} else {
			this.say("Incorrect.");
		}
		this.nickPlayer = null;
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.doNextNick(), 5 * 1000);
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let curPlayer = this.players[user.id];
		if (!curPlayer) return;
		let realID = toId(target);
		let oplayer = this.players[realID];
		if (!oplayer) {
			user.say("That player is not in the game!");
			return;
		}
		if (oplayer.id === curPlayer.id) {
			user.say("Are you sure you want to attack yourself?");
			return;
		}
		if (oplayer.eliminated) return;
		let curAtt = this.attacks.get(curPlayer);
		if (curAtt) {
			user.say("You have already attacked someone this round!");
			return;
		}
		this.order.push(curPlayer);
		user.say("You have chosen to attack **" + oplayer.name + "**!");
		this.attacks.set(curPlayer, oplayer);
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.setOrder();
		}
	}
}

exports.game = EXC;
exports.id = id;
exports.name = name;
exports.description = description;
exports.aliases = [];
exports.modes = ['Golf'];