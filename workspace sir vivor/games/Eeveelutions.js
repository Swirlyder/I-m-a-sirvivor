'use strict';

const name = "Eeveelutions"
const id = Tools.toId(name);
const description = "**Eeveelutions**: __More than one kind? I can't beleevee this!__ Game rules: http://survivor-ps.weebly.com/eeveelutions.html";

class Eevee extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.eevees = new Map();
		this.attacks = new Map();
		this.numEevees = 0;
		this.possEevees = ['eevee', 'flareon', 'vaporeon', 'jolteon', 'espeon', 'umbreon', 'glaceon', 'leafeon', 'sylveon'];
		this.hasUsedEevee = new Map();
		this.rolla = null;
		this.rollb = null;
		this.curPlayer = null;
		this.oplayer = null;
		this.doinga = false;
		this.doingb = false;
		this.abila = false;
		this.abilb = false;
		this.eevee1 = null;
		this.eevee2 = null;
		this.canAttack = false;
		this.canEevee = false;
		this.order = [];
		this.finals = false;
	}

	onStart() {
		this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
		this.canEevee = true;
		this.say("Please pm me your eevee withs ``" + Config.commandCharacter + "eevee [eeveelution]``");
		this.timeout = setTimeout(() => this.listEeveeWaits(), 60 * 1000);
	}

	listEeveeWaits() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.eevees.has(player)) waitings.push(player.name);
		}
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimEevees(), 30 * 1000);
	}

	elimEevees() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.eevees.has(player)) {
				player.say("You never chose an eevee!");
				player.eliminated = true;
			}
		}
		this.nextRound();
	}

	onNextRound() {
		this.canEevee = false;
		if (this.getRemainingPlayerCount() === 2) {
			this.finals = true;
			let lastPlayers = this.shufflePlayers(this.getRemainingPlayers());
			this.curPlayer = lastPlayers[0];
			this.oplayer = lastPlayers[1];
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving straight to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.attacks.clear();
			this.numAttacks = 0;
			this.order = [];
			this.canAttack = true;
			this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
			this.say("Please pm me your attack with ``" + Config.commandCharacter + "destroy [user]``");
			this.timeout = setTimeout(() => listRemaining(), 60 * 1000);
		}
	}

	listRemaining() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) waitings.push(player.name);
		}
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimRemaining() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.attacks.has(player)) {
				player.say("You never attacked anyone this round!");
				player.eliminated = true;
			}
		}
		this.handleAttacks();
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
		this.rolla = null, this.rollb = null;
		let eevee1 = this.eevees.get(this.curPlayer);
		let eevee2 = this.eevees.get(this.oplayer);
		this.doinga = true, this.doingb = true;
		if (this.eevee1 === 'Umbreon') this.doingb = false;
		if (this.eevee2 === 'Umbreon') this.doinga = false;
		if (this.eevee1 === 'Espeon') this.eevee1 = eevee2;
		if (this.eevee2 === 'Espeon') this.eevee2 = eevee1;
		this.roll1 = 100, this.roll2 = 100;
		console.log(this.eevee1 + "," + this.eevee2);
		if (this.doinga) {
			if (this.eevee1 === 'Jolteon') {
				if (this.eevee2 === 'Sylveon') {
					this.roll1 = '2d50';
				} else {
					this.roll1 = '2d65';
				}
			}
			if (this.eevee1 === 'Flareon') {
				this.roll1 += 25;
			}
		}
		if (this.doingb) {
			if (this.eevee2 === 'Jolteon') {
				if (this.eevee1 === 'Sylveon') {
					this.roll2 = '2d50';
				} else {
					this.roll2 = '2d65';
				}
			}
			if (this.eevee2 === 'Leafeon') {
				this.roll2 += 25
			}
		}
		console.log(this.roll1 + "," + this.roll2);
		this.say("!roll " + this.roll1);
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
			this.handleRolla();
		} else if (!this.rollb) {
			this.rollb = roll;
			this.handleRollb();
		} else {
			if (roll < 21) {
				this.say("Fortunately for **" + this.oplayer.name + "**, they dodged the attack!");
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			} else {
				this.say("Unfortunately, **" + this.oplayer.name + "** was unable to dodge the attack.");
				this.oplayer.eliminated = true;
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			}
		}
	}
	handleRolls(rolls) {
		let sum = 0;
		for (let i = 0; i < rolls.length; i++) {
			sum += rolls[i];
		}
		if (!this.rolla) {
			this.rolla = sum;
			this.handleRolla();
		} else if (!this.rollb) {
			this.rollb = sum;
			this.handleRollb();
		}
	}
	handleRolla() {
		if (this.eevee1 === 'Vaporeon' && this.rolla < 26) {
			this.rolla = null;
			this.say("**" + this.currentPlayer.name + "** gets a reroll, as they were a Vaporeon!");
			this.say("!roll " + this.roll1);
		} else {
			this.say("!roll " + this.roll2);
		}
	}
	handleRollb() {
		if (this.eevee2 === 'Vaporeon' && this.rollb < 26) {
			this.rollb = null;
			this.say("**" + this.oplayer.name + "** gets a reroll, as they were a Vaporeon!");
			this.say("!roll " + this.roll2);
		} else {
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same. Rerolling...");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			} else {
				if (this.rolla > this.rollb) {
					if (this.eevee2 === 'eevee' && this.getRemainingPlayerCount() > 3 && !this.hasUsedEevee.has(this.oplayer)) {
						this.say("**" + this.oplayer + "** Runs Away as eevee!")
						this.hasUsedEevee.set(this.oplayer, true);
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					} else if (this.eevee2 === 'Glaceon') {
						this.say("Rolling for **" + this.oplayer.name + "**'s dodge chance!");
						this.say("!roll 100");
					} else {
						this.say("**" + this.curPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "**!");
						this.oplayer.eliminated = true;
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					}
				} else {
					if (this.finals) {
						this.say("**" + this.oplayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.curPlayer.name + "**!");
						this.curPlayer.eliminated = true;
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					} else {
						this.say("**" + this.oplayer.name + "** defended successfully!");
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					}
				}
			}
		}
	}
	turnFirstUpper(str) {
		return str[0].toUpperCase() + str.substr(1);
	}

	eevee(target, user) {
		if (!this.canEevee) return;
		let player = this.players[user.id];
		if (this.eevees.has(player)) return user.say("You have already chosen an eevee!");
		target = Tools.toId(target);
		if (this.possEevees.indexOf(target) === -1) return user.say("Invalid eeveelution.");
		target = this.turnFirstUpper(target);
		user.say("You have chosen your eeveelution as **" + target + "**!");
		this.eevees.set(player, target);
		this.numEevees++;
		if (this.numEevees === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
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
			this.handleAttacks();
		}
	} catch (e) {
		this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
		this.mailbreak();
		this.end();
		return;
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Eevee;
exports.aliases = ["eevee"];