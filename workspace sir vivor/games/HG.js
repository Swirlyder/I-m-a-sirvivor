'use strict';

const name = "Hunger Games";
const description = "**Hunger Games**: __Classic but with a twist: No alliances.__ Game rules: http://survivor-ps.weebly.com/hunger-games.html";
const id = toId(name);

class HG extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.items = new Map();
		this.attacks = new Map();
	}

	onStart() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				this.items.set(player, []);
			}	
			this.nextRound();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	onNextRound() {
		try {
			if (this.getRemainingPlayerCount() === 1) {
				this.end();
				return;
			} else if (this.getRemainingPlayerCount() === 2) {
				let playersLeft = this.getRemainingPlayers();
				this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
				this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
				this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
				return;
			}
			this.numAttacks = 0;
			this.canAttack = true;
			this.order = [];
			this.attacks.clear();
			this.pl();
			this.say("Everyone please pm me your target! **Command:** ``" + Config.commandCharacter + "destroy [user]`` (in pms)");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
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
			this.end();
			return;
		}
	}

	handleAttacks() {
		try {
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
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	doPlayerAttack() {
		try {
			this.rolla = null;
			this.rollb = null;
			this.say("!roll 100");
			this.say("!roll 100");
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	handleRoll(roll) {
		try {
			if (!this.rolla) {
				this.rolla = roll;
			} else {
				this.rollb = roll;
				if (this.rolla !== this.rollb) {
					let winPlayer, losePlayer;
					if (this.rolla > this.rollb) {
						winPlayer = this.curPlayer;
						losePlayer = this.oplayer;
					} else {
						winPlayer = this.oplayer;
						losePlayer = this.curPlayer;
					}
					this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
					losePlayer.eliminated = true;
					this.timeout = setTimeout(() => this.handleAttacks(), 10 * 1000);
				} else {
					this.say("The rolls were the same! rerolling...");
					this.doPlayerAttack();
				}
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
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
			this.end();
			return;
		}
	}
}

exports.game = HG;
exports.name = name;
exports.id = id;
exports.aliases = ['hg'];
exports.description = description;
