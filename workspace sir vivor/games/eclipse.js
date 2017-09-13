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
		this.cards = new Map();
		this.attacks = new Map();
		this.order = [];
		this.rolls = new Map();
		this.playerAttacks = new Map();
	}

	onStart() {
		for (let userID in this.players) {
			this.cards.set(this.players[userID], ["sunlight", "moonshine"]);
		}
		this.nextRound();
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 2) {
			this.finals = true;
			this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
		} else {
			this.attacks.clear();
			this.rolls.clear();
			this.canAttack = true;
			this.order = [];
			this.playerAttacks.clear();
			for (let userID in this.players) {
				this.playerAttacks.set(this.players[userID], []);
			}
			this.say("**" + this.getPlayerNames(this.getRemainingPlayers()) + "**, say your actions in chat with ``" + Config.commandCharacter + "attack [player]``, ``" + Config.commandCharacter + "sunlight``, or ``" + Config.commandCharacter + "moonshine [player]``!");
			this.timeout = setTimeout(() => this.elimPlayers(), 60 * 1000);
		}
	}

	elimPlayers() {
		this.canAttack = false;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) {
				player.eliminated = true;
				player.say("You didn't attack anyone this round and are eliminated!");
			}
		}
		this.handleAttacks();
	}

	handleAttacks() {
		if (this.order.length === 0) {
			this.nextRound();
			return;
		}
		this.curPlayer = this.order.shift();
		this.oplayer = this.attacks.get(this.curPlayer);
		if (!this.oplayer.id || this.curPlayer.eliminated || this.oplayer.eliminated) {
			this.handleAttacks();
			return;
		}
		this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
		this.doRolls();
	}

	doRolls() {
		this.roll1 = (this.rolls.has(this.curPlayer) ? 120 : 100);
		this.roll2 = 100;
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer || this.finals) {
			losePlayer.eliminated = true;
			this.say("**" + winPlayer.name + "** defeats **" + losePlayer.name + "**!");
		} else {
			this.say("**" + winPlayer.name + "** defends successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	handlePick(message) {
		this.curPlayer = this.players[Tools.toId(message)];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && player !== this.curPlayer) {
				this.oplayer = player;
				break;
			}
		}
		this.attacks.set(this.curPlayer, this.oplayer);
		this.order = [this.curPlayer];
		this.handleAttacks();
	}

	attack(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (this.attacks.has(player)) {
			return user.say("You have already attacked someone this round!");
		}
		if (Tools.toId(target) === "constructor") return;
		let targPlayer = this.players[Tools.toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		let curAttacks = this.playerAttacks.get(targPlayer);
		curAttacks.push(player);
		this.playerAttacks.set(targPlayer, curAttacks);
		this.attacks.set(player, targPlayer);
		this.order.push(player);
	}

	sunlight(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let cards = this.cards.get(player);
		if (cards.indexOf("sunlight") === -1) return;
		let curAttacks = this.playerAttacks.get(player);
		if (curAttacks.length === 0) return;
		let targPlayer = curAttacks.pop();
		cards.splice(cards.indexOf("sunlight"), 1);
		this.attacks.set(targPlayer, false);
		this.order.splice(this.order.indexOf(targPlayer), 1);
	}

	moonshine(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (Tools.toId(target) === "constructor") return;
		let targPlayer = this.players[Tools.toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.attacks.get(player) !== false) return;
		let cards = this.cards.get(player);
		if (cards.indexOf('moonshine') === -1) return;
		cards.splice(cards.indexOf('moonshine'), 1);
		this.attacks.set(player, targPlayer);
		this.rolls.set(player, 120);
		this.order.push(player);
	}
}

exports.commands = {
	attack: "attack",
	sunlight: "sunlight",
	moonshine: "moonshine",
}
exports.game = Eclipse;
exports.name = name;
exports.id = id;
exports.description = description;