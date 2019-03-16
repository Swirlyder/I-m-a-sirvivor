'use strict';
const name = "Rock, Paper, Scissors";
const description = "__Sorry, no lizards or Spocks involved. Winner of NBT #2!__ Game rules: http://survivor-ps.weebly.com/rock-paper-scissors.html __Modification includes Lizard and Spock:__ https://docs.google.com/document/d/1O_6xyXaOnFf6pvBrq3RZW6rFPZBYdO7Q9OIvHervivI/";
const id = Tools.toId(name);
class RPS extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.order = [];
		this.attacks = new Map();
		this.rps = new Map();
		this.straightRPS = false;
	}

	onStart() {
		if (this.variation) {
			this.poss = ['rock', 'lizard', 'spock', 'scissors', 'paper', 'r', 'l', 'sp', 's', 'p'];
			this.rpsname = "rock, paper, scissors, lizard, spock";
		} else {
			this.rpsname = "rock, paper, scissors";
			this.poss = ['rock', 'scissors', 'paper', 'r', 's', 'p'];
		}
		this.nextRound();
	}

	onNextRound() {
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
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! PM me your " + this.rpsname + " choice! **Command:** ``" + Config.commandCharacter + "destroy [rps]``");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		} else {
			this.numAttacks = 0;
			this.canAttack = true;
			this.order = [];
			this.attacks.clear();
			this.rps.clear();
			this.pl();
			this.say("Everyone please pm me your attacks! **Command:** ``" + Config.commandCharacter + "destroy [user], [" + this.rpsname + "]``")
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
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
			this.mailbreak(e);
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
			this.handleAttacks();
		} catch (e) {
			this.mailbreak(e);
		}
	}

	getWinner(index1, index2) {
		let diff = index1 - index2;
		if (diff < 0) diff += 5;
		if (diff === 0) return "tie";
		if (diff%2 === 0) return "first";
		return "second";
	}

	handleAttacks() {
		try {
			this.canAttack = false;
			if (this.straightRPS) {
				if (this.getRemainingPlayerCount() < 2) {
					this.end();
					return;
				}
				let rpsA = this.rps.get(this.curPlayer);
				let rpsB = this.rps.get(this.oplayer);
				let winner = this.getWinner(rpsA, rpsB);
				if (winner === "tie") {
					this.say("Both **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** chose " + Tools.turnFirstUpper(this.poss[rpsA]) + "... Please repm me your next attacks!");
					this.numAttacks = 0;
					this.rps.clear();
					this.canAttack = true;
					this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
				} else if (winner === "second") {
					this.say("**" + this.oplayer.name + "** used " + Tools.turnFirstUpper(this.poss[rpsB]) + " and defeats **" + this.curPlayer.name + "**, who used " + Tools.turnFirstUpper(this.poss[rpsA]));
					this.curPlayer.eliminated = true;
					this.nextRound();
				} else {
					this.say("**" + this.curPlayer.name + "** used " + Tools.turnFirstUpper(this.poss[rpsA]) + " and defeats **" + this.oplayer.name + "**, who used " + Tools.turnFirstUpper(this.poss[rpsB]));
					this.oplayer.eliminated = true;
					this.nextRound();
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
			this.mailbreak(e);
		}
	}

	doPlayerAttack(num) {
		try {
			this.rolla = null;
			this.rollb = null;
			let rpsA = this.rps.get(this.curPlayer);
			let rpsB = this.rps.get(this.oplayer);
			let winner = this.getWinner(rpsA, rpsB);
			if (winner === "tie") {
				this.say("**" + this.curPlayer.name + "** attacked **" + this.oplayer.name + "**, but they both used " + Tools.turnFirstUpper(this.poss[rpsA]) + '.');
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			} else {
				this.say("**" + this.curPlayer.name + "** attacks **" + this.oplayer.name + "** with **" + Tools.turnFirstUpper(this.poss[rpsA]) + "**, who defends with **" + Tools.turnFirstUpper(this.poss[rpsB]) + "**.");
				if (winner === "first") {
					this.roll1 = 125;
					this.roll2 = 100;
					this.win = true;
				} else {
					this.roll1 = 100;
					this.roll2 = 125;
					this.win = false;
				}
				this.sayPlayerRolls();
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}
	handleWinner(winPlayer, losePlayer) {
		if ((this.win && winPlayer === this.curPlayer) || (!this.win && winPlayer === this.oplayer)) {
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
			this.elimPlayer(losePlayer);
		} else {
			this.say("**" + winPlayer.name + "** defended successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (this.straightRPS) {
			let index = this.poss.indexOf(Tools.toId(target));
			if (index === -1) {
				return user.say("That is not a valid RPS attack!");
			}
			if (this.rps.has(player)) {
				return user.say("You have already chosen this round!");
			}
			let realindex = index % (this.poss.length / 2);
			user.say("You have chosen **" + Tools.turnFirstUpper(this.poss[realindex]) + "**!");
			this.order.push(player);
			this.rps.set(player, realindex);
		} else {
			let split = target.split(",");
			if (split.length !== 2) {
				return user.say("**Usage:** ``" + Config.commandCharacter + "destroy [user], [weapon]``");
			}
			let attackedPlayer = this.players[Tools.toId(split[0])];
			if (Tools.toId(split[0]) === "constructor") return user.say("You cannot attack 'constructor'");
			if (!attackedPlayer) return user.say("That player is not in the game!");
			if (attackedPlayer.eliminated) return user.say("That player has already been eliminated!");
			if (attackedPlayer.id === player.id) return user.say(">Attacking yourself.");
			let index = this.poss.indexOf(Tools.toId(split[1]));
			if (index === -1) {
				return user.say("That is not a valid RPS attack!");
			}
			if (this.attacks.has(player)) {
				return user.say("You have already attacked someone this round.");
			}
			this.attacks.set(player, attackedPlayer);
			let realindex = index % (this.poss.length / 2);
			user.say("You have chosen to attack **" + attackedPlayer.name + "** with **" + Tools.turnFirstUpper(this.poss[realindex]) + "**!");
			this.order.push(player);
			this.rps.set(player, realindex);
		}
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}
}

exports.name = name;
exports.description = description;
exports.id = id;
exports.game = RPS;
exports.aliases = ['rockpaperscissors', 'rps'];
exports.modes = ['Second Wind'];
exports.commands = {
	destroy: "destroy",
}
exports.pmCommands = {
	destroy: true,
}
exports.variations = [
	{
		name: "Rock, Paper, Scissors, Lizard, Spock",
		aliases: ["rpsls", "rpslsp"],
		variation: "spock",
		variationAliases: ["ls"],
	}
]
