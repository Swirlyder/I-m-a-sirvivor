'use strict';
const name = "Rock, Paper, Scissors";
const description = "__Winner of NBT #2!__ Game rules: http://survivor-ps.weebly.com/rock-paper-scissors.html";
const id = Tools.toId(name);
let stuff = ["Rock", "Paper", "Scissors"];
class RPS extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.order = [];
		this.attacks = new Map();
		this.rps = new Map();
		this.poss = ['rock', 'paper', 'scissors', 'r', 'p', 's'];
		this.straightRPS = false;
	}

	onStart() {
		try {
			this.nextRound();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
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
				this.straightRPS = true;
				this.canAttack = true;
				let playersLeft = this.getRemainingPlayers();
				this.rps.clear();
				this.attacks.clear();
				this.numAttacks = 0;
				this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
				this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
				this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! PM me your rps choice! **Command:** ``" + Config.commandCharacter + "destroy [rps]``");
				this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
			} else {
				this.numAttacks = 0;
				this.canAttack = true;
				this.order = [];
				this.attacks.clear();
				this.rps.clear();
				this.pl();
				this.say("Everyone please pm me your attacks! **Command:** ``" + Config.commandCharacter + "destroy [user], [rps]``")
				this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	listRemaining() {
		try {
			let waitings = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				let curAttack = this.straightRPS ? this.rps.has(player) : this.attacks.has(player);
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
		this.canAttack = false;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let curAttack = this.straightRPS ? this.rps.has(player) : this.attacks.has(player);
			if (!curAttack) {
				player.say("You didn't attack a player this round and were eliminated!");
				this.players[userID].eliminated = true;
			}
		}
		if (this.getRemainingPlayerCount() < 2) {
			this.nextRound();
		} else {
			this.handleAttacks();
		}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	handleAttacks() {
		try {
			this.canAttack = false;
			if (this.straightRPS) {
				let rpsA = this.rps.get(this.curPlayer);
				let rpsB = this.rps.get(this.oplayer);
				if (rpsA === rpsB) {
					this.say("Both **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** chose " + stuff[rpsA] + "... Please repm me your next attacks!");
					this.numAttacks = 0;
					this.rps.clear();
					this.canAttack = true;
					this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
				} else {
					let diff = ((rpsA - rpsB) + 3) % 3;
					if (diff === 2) {
						this.say("**" + this.oplayer.name + "** used " + stuff[rpsB] + " and defeats **" + this.curPlayer.name + "**, who used " + stuff[rpsA]);
						this.curPlayer.eliminated = true;
						this.nextRound();
					} else {
						this.say("**" + this.curPlayer.name + "** used " + stuff[rpsA] + " and defeats **" + this.oplayer.name + "**, who used " + stuff[rpsB]);
						this.oplayer.eliminated = true;
						this.nextRound();
					}
				}
			} else {
				if (this.order.length === 0) {
					this.nextRound();
				} else {
					this.curPlayer = this.order.shift();
					this.oplayer = this.attacks.get(this.curPlayer);
					if (this.oplayer.eliminated || this.curPlayer.eliminated) {
						this.handleAttacks();
					} else {
						this.doPlayerAttack(0);
					}
				}
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	doPlayerAttack(num) {
		try {
			this.rolla = null;
			this.rollb = null;
			let rpsA = this.rps.get(this.curPlayer);
			let rpsB = this.rps.get(this.oplayer);
			if (rpsA === rpsB) {
				this.say("**" + this.curPlayer.name + "** attacked **" + this.oplayer.name + "**, but they both used " + stuff[rpsA] + '.');
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			} else {
				this.win = true;
				let diff = ((rpsA - rpsB) + 3) % 3;
				if (num === 0) {
					this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "** with **" + stuff[rpsA] + "**, who defends with **" + stuff[rpsB] + "**.");
				}
				if (diff === 1) {
					this.roll1 = 125;
					this.roll2 = 100;
				} else {
					this.roll1 = 100;
					this.roll2 = 125;
					this.win = false;
				}
				this.sayPlayerRolls();
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}
	handleWinner(winPlayer, losePlayer) {
		if ((this.win && winPlayer === this.curPlayer) || (!this.win && winPlayer === this.oplayer)) {
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
			losePlayer.eliminated = true;
		} else {
			this.say("**" + winPlayer.name + "** defended successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	destroy(target, user) {
		try {
			if (!this.canAttack) return;
			let player = this.players[user.id];
			if (!player || player.eliminated) return;
			if (this.straightRPS) {
				let index = this.poss.indexOf(Tools.toId(target));
				if (index === -1) {
					return user.say("That is not a valid rps attack!");
				}
				if (this.rps.has(player)) {
					return user.say("You have already chosen this round!");
				}
				user.say("You have chosen " + stuff[index%3]);
				this.order.push(player);
				this.rps.set(player, index%3);
			} else {
				let split = target.split(",");
				if (split.length !== 2) {
					return user.say("**Usage:** ``" + Config.commandCharacter + "destroy [user], [rps]``");
				}
				let attackedPlayer = this.players[Tools.toId(split[0])];
				if (!attackedPlayer || attackedPlayer.eliminated) return;
				let index = this.poss.indexOf(Tools.toId(split[1]));
				if (index === -1) {
					return user.say("That is not a valid rps attack!");
				}
				if (this.attacks.has(player)) {
					return user.say("You have already attacked someone this round.");
				}
				this.attacks.set(player, attackedPlayer);
				user.say("You have chosen to attack **" + attackedPlayer.name + "** with " + stuff[index%3] + "!");
				this.order.push(player);
				this.rps.set(player, index%3);
			}
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

exports.name = name;
exports.description = description;
exports.id = id;
exports.game = RPS;
exports.aliases = ['rockpaperscissors', 'rps'];