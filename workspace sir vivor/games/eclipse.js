'use strict';

const name = 'Eclipse';
const description = "__Winner of NBT #5!__ Game rules: http://survivor-ps.weebly.com/eclipse-survivor.html";
const id = Tools.toId(name);

class Eclipse extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.rolls = new Map();
		this.canceled = new Map();
		this.cards = new Map();
		this.attacks = new Map();
		this.moonshined = new Map();
		this.hasDone = new Map();
		this.canAttack = true;
		this.order = [];
		this.AI = true;
	}

	onSignups() {
		this.say("This game isn't ready yet rip.");
		this.end();
		return;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.cards.set(player, ["sunlight", "moonshine"]);
		}
		this.nextRound();
	}

	onNextRound() {
		for (let userID in this.getRemainingPlayers()) {
			let player = this.players[userID];
			this.rolls.set(player, 100);
		}
		this.attacks.clear();
		this.canceled.clear();
		this.moonshined.clear();
		this.hasDone.clear();
		this.order = [];
		if (this.getRemainingPlayerCount() === 1) {
			let winPlayer = this.getLastPlayer();
			this.say("**Winner:** " + winPlayer.name);
			this.say(".win " + winPlayer.name);
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			this.AI = false;
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.pl();
			this.canAttack = true;
			this.say("The eclipse phase has started! Enter your commands in chat. **Commands:** ``" + Config.commandCharacter + "attack [user]``, ``" + Config.commandCharacter + "use [card]``");
			this.timeout = setTimeout(() => this.elimPlayers(), 60 * 1000);
		}
	}

	doPlayerAttack() {
		this.rolla = null;
		this.rollb = null;
		let attack = this.rolls.get(this.curPlayer);
		let defense = 100;
		this.say("Rolling for **" + this.curPlayer.name + "'s** attack.");
		this.say("!roll " + attack);
		this.say("Rolling for **" + this.oplayer.name + "'s** defense.");
		this.say("!roll " + defense);
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.rolla !== this.rollb) {
				if (this.rolla > this.rollb) {
					this.oplayer.eliminated = true;
					this.say("**" + this.curPlayer.name + "** beats up **" + this.oplayer.name + "**!");
				} else {
					if (this.AI) {
						this.say("**" + this.oplayer.name + "** defended successfully!");
					} else {
						this.curPlayer.eliminated = true;
						this.say("**" + this.oplayer.name + "** beats up **" + this.curPlayer.name + "**!");
					}
				}
				this.timeout = setTimeout(() => this.handleAttacks(), 10 * 1000);
				
			} else {
				this.say("The rolls were the same! rerolling...");
				this.rolla = null;
				this.rollb = null;
				this.doPlayerAttack();
			}
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
	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let curAttack = this.hasDone.get(player);
			if (!curAttack) {
				player.say("You didn't attack a player this round and were eliminated!");
				this.players[userID].eliminated = true;
			}
		}
		this.handleAttacks();
	}
	
	attack(target, user) {
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
		console.log(user.name + " attacked " + oplayer.name);
		this.order.push(curPlayer);
		this.attacks.set(curPlayer, oplayer);
		this.hasDone.set(curPlayer, true);
	}

	use(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		target = Tools.toId(target);
		if (target.startsWith('sunlight')) {
			let cards = this.cards.get(player);
			if (cards.indexOf('sunlight') === -1) return user.say("You have already used Sunlight.");
			let i;
			for (i = this.order.length - 1; i >= 0; i--) {
				let curPlayer = this.order[i];
				let attacked = this.attacks.get(curPlayer);
				if (attacked === player) {
					this.order.splice(i, 1);
					this.attacks.delete(curPlayer);
					break;
					this.moonshined.set(curPlayer, true);
				}
			}
			if (i !== -1) {
				cards.splice(cards.indexOf('sunlight'));
				this.cards.set(player, cards);
			}
		} else if (target.startWith('moonshine')) {
			target = target.substr(9);
			if (!this.moonshined.has(player)) return;
			let cards = this.cards.get(player);
			if (cards.indexOf('moonlight') === -1) return user.say("You have already used Moonshine.");
			let attacked = this.players[target];
			if (!attacked || attacked.eliminated) return;
			this.attacks.set(player, attacked);
			this.rolls.set(player, 120);
			this.order.push(player);
		}
		this.hasDone.set(player, true);
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Eclipse;
exports.aliases = ["dext", "dex"];