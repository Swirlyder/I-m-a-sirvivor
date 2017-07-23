'use strict';

const name = 'Hidden Type';
const description = '__The theme that won our April 2015\'s NBT!__ Game rules: http://survivor-ps.weebly.com/hidden-type.html';
const id = Tools.toId(name);

class HT extends Games.Game {
    constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.attacks = new Map();
		this.numAttacks = 0;
		this.numTypes = 0;
		this.types = new Map();
		this.order = [];
		this.isFinals = false;
    }

    onStart() {
		this.pl();
		this.say("Please choose your types (in pms) with ``" + Config.commandCharacter + "type [type-name]``.");
		this.timeout = setTimeout(() => this.listTypesLeft(), 60 * 1000);
    }

    listTypesLeft() {
		try {
			let waitings = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (this.types.has(player)) continue;
				waitings.push(player.name);
			}
			this.say("Waiting on: " + waitings.join(", "));
			this.timeout = setTimeout(() => this.elimTypes(), 30 * 1000);
		} catch (e) {
			this.mailbreak(e);
		}
    }

    elimTypes() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				if (!this.types.has(player)) {
					player.say("You never chose a type!");
					player.eliminated = true;
				}
			}
			this.nextRound();
		} catch (e) {
			this.mailbreak(e);
		}
    }

	turnFirstUpper(str) {
		if (str.length === 0) return "";
		return str.charAt(0).toUpperCase() + str.substr(1);
	}

    onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			if (this.isFinals) {
				this.cur = 1 - this.cur;
			} else {
				this.cur = Math.floor(Math.random() * 2);
			}
			this.isFinals = true;
			this.canAttack = false;
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[this.cur]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1 - this.cur]];
			let type1 = this.turnFirstUpper(this.types.get(this.curPlayer)), type2 = this.turnFirstUpper(this.types.get(this.oplayer));
			this.say("Only **" + this.getName(this.curPlayer) + "**, who is a **" + type1 + "** type and **" + this.getName(this.oplayer) + "** the **" + type2 + "** type are left! Moving directly to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.canAttack = true;
			this.order = [];
			this.numAttacks = 0;
			this.attacks.clear();
			this.pl();
			this.say("PM me your attacks with ``" + Config.commandCharacter + "destroy [user]``!");
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
		try {
			this.canAttack = false;
			if (this.order.length === 0) {
				this.nextRound();
			} else {
				this.curPlayer = this.order.shift();
				this.oplayer = this.attacks.get(this.curPlayer);
				if (this.curPlayer.eliminated || this.oplayer.eliminated) {
					this.handleAttacks();
				} else {
					this.doPlayerAttack();
				}
			}
		} catch (e) {
			this.mailbreak(e);
		}
    }

    doPlayerAttack() {
		this.rolla = null;
		this.rollb = null;
		let eff = Tools.data.typeChart[Tools.data.convertType[this.types.get(this.curPlayer)]][Tools.data.convertType[this.types.get(this.oplayer)]];
		let roll1, roll2;
		if (eff === 0) {
			this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "**, but the defending type is immune!");
			this.roll1 = 75;
			this.roll2 = 125;
		} else  if (eff === 0.5) {
			this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "**, but the defending type resists the attacking type!");
			this.roll1 = 75;
			this.roll2 = 100;
		} else if (eff === 1) {
			this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "**, but the attack is neutral.");
			this.roll1 = 100;
			this.roll2 = 100;
		} else {
			this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "** super-effectively!");
			this.roll1 = 125;
			this.roll2 = 100;
		}
		this.sayPlayerRolls();
    }

	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "**, who was a **" + this.turnFirstUpper(this.types.get(this.oplayer)) + "** type!");
			this.elimPlayer(this.oplayer);
		} else {
			this.say("**" + this.oplayer.name + "** defended successfully!");
			if (this.cur) {
				let player = this.curPlayer;
				this.curPlayer = this.oplayer;
				this.oplayer = player;
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
				return;
			}
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	} 

    destroy(target, user) {
		if (!this.canAttack) return;
		let curPlayer = this.players[user.id];
		if (!curPlayer) return;
		let realID = toId(target);
		let oplayer = this.players[realID];
		if (!oplayer) {
			return user.say("That player is not in the game!");
		}
		if (oplayer.id === curPlayer.id) {
			user.say("Are you sure you want to attack yourself?");
			return;
		}
		if (oplayer.eliminated) 
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
			this.handleAttacks();
		}
    }

	type(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		target = Tools.toId(target);
		if (target.endsWith('type')) target = target.substr(0, target.length - 4);
		if (!(target in Tools.data.convertType)) return user.say("Invalid type.");
		if (this.types.has(player)) return user.say("You have already chosen a type!");
		this.types.set(player, target);
		user.say("You have chosen the **" + this.turnFirstUpper(target) + "** type!");
		this.numTypes++;
		if (this.numTypes === this.playerCount) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
    }

}

exports.name = name;
exports.id = id;
exports.aliases = ['ht'];
exports.game = HT;
exports.description = description;
exports.modes = ['Second Wind', 'Golf'];
exports.commands = {
	destroy: "destroy",
	type: "type",
}

exports.pmCommands = {
	destroy: true,
	type: true,
}