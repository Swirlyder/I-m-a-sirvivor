'use strict';

const name = "Hunger Games";
const description = "__[Insert \"high noon\" meme here]__ Game rules: http://survivor-ps.weebly.com/outlaws.html";
const id = toId(name);

class Outlaws extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.attacks = new Map();
		this.troops = new Map();
		this.sum = false;
		this.max = true;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.troops.set(player, 1);
		}
		this.nextRound();
	}

	onNextRound() {
		this.order = [];
		if (this.getRemainingPlayerCount() === 2) {
			this.finals = true;
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			return;
		}
		this.numAttacks = 0;
		this.canAttack = true;
		this.attacks.clear();
		let names = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			names.push(player.name + "[" + this.troops.get(player) + "]");
		}
		this.say("Everyone please pm me your target! **Command:** ``" + Config.commandCharacter + "destroy [user]`` (in pms)");
		this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
	}

	listRemaining() {
		try {
			let waitings = []
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				let curAttack = this.attacks.get(player);
				if (!curAttack) waitings.push(player.name);
			}
			this.say("Waiting on: "  + waitings.join(", "));
			this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	elimPlayers() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				let curAttack = this.attacks.get(player);
				if (!curAttack) {
					player.say("You didn't attack a player this round and were eliminated!");
					this.players[userID].eliminated = true;
				}
			}
			this.handleAttacks();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.curPlayer = this.order[0];
			this.order.splice(0, 1);
			this.oplayer = this.attacks.get(this.curPlayer);
			if (this.oplayer.eliminated || this.curPlayer.eliminated) {
				this.handleAttacks();
			} else {
				this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
				this.doPlayerAttack();
			}
		}
	}

	doPlayerAttack() {
		this.rolla = this.troops.get(this.curPlayer) + "d100";
		this.rollb = this.troops.get(this.oplayer) + "d100";
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		if ((winPlayer === this.curPlayer) || this.finals) {
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + " and steals one gang member!");
			let troops = this.troops.get(winPlayer);
			troops++;
			this.troops.set(winPlayer, troops);
			losePlayer.eliminated = true;
		} else {
			this.say("**" + winPlayer.name + "** defends successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	destroy(target, user) {
		try {
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
				this.handleAttacks();
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}
}

exports.game = Outlaws;
exports.name = name;
exports.id = id;
exports.aliases = [];
exports.description = description;
