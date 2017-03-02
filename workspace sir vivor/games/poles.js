'use strict';

const name = 'Poles';
const description = '__Your power is within the cards, can you use them wisely?__ Game rules: http://survivor-ps.weebly.com/poles.html';
const id = Tools.toId(name);

const realnames = {
	"spore": "Spore",
	"willowisp": "Will-o-Wisp",
	"helpinghand": "Helping Hand",
};
class Poles extends Games.Game {
	constructor(room) {
		super(room);
		this.id = id;
		this.description = description;
		this.name = name;
		this.order = [];
		this.attacks = new Map();
		this.cards = new Map();
		this.points = new Map();
		this.actions = new Map();
		this.spores = [];
		this.expectingSpore = false;
		this.expectingWow = false;
		this.isSpored = new Map();
		this.curPlayer = null;
		this.oplayer = null;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.cards.set(player, ["Will-o-Wisp", "Spore", "Helping Hand"]);
			this.points.set(player, 0);
		}
		this.nextRound();
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			this.say("Since we're down to two players, we're just gonna start finals yo.");
			let lastPlayers = this.getRemainingPlayers();
			this.curPlayer = this.players[Object.keys(lastPlayers)[0]];
			this.oplayer = this.players[Object.keys(lastPlayers)[1]];
			this.finalAttack();
		} else {
			let maxPoints = 0;
			let names = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				let points = this.points.get(player);
				maxPoints = Math.max(maxPoints, points);
				names.push(player.name + "[" + points + "]");
			}
			this.say("**Players (" + names.length + "):** " + names.join(", "));
			if (maxPoints >= 5) {
				this.say("Somebody has reached 5 points! We will now begin finals.");
				this.timeout = setTimeout(() => this.finalAttackee(), 5 * 1000);
			} else {
				this.expectingSpore = true;
				this.expectingWow = false;
				this.attacks.clear();
				this.spores = [];
				this.order = [];
				this.isSpored.clear();
				this.say("Please pm me your attacks and spores with ``" + Config.commandCharacter + "destroy [user]``, ``" + Config.commandCharacter + "action spore, [user]``");
				this.timeout = setTimeout(() => this.listRemainingPlayers(), 60 * 1000);
			}
		}
	}

	listRemainingPlayers() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) waitings.push(player.name);
		}
		if (waitings.length > 0) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}
	
	finalAttackee() {
		let maxPoints = 0;
		this.bestplayers = [];
		this.finalAttacker = true;
		let names = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let points = this.points.get(player);
			if (points > maxPoints) {
				maxPoints = points;
				this.bestplayers = [player];
				names = ["**" + player.name + "**"];
			} else if (points === maxPoints) {
				this.bestplayers.push(player);
				names.push("**" + player.name + "**");
			}
		}
		if (names.length === 1) {
			this.say(names[0] + " has the most points and advances to the finals!");
			this.curPlayer = this.bestplayers[0];
			this.finalAttacker = false;
			this.timeout = setTimeout(() => this.finalDefend(), 5 * 1000);
		} else {
			this.say(names.join(", ") + " are all tied for the most points and will have a roll battle to see who advances to the finals!");
			this.length = names.length;
			this.timeout = setTimeout(() => this.sayMultiRolls(), 5 * 1000);
		}
	}

	finalDefend() {
		let minPoints = 100;
		this.bestplayers = [];
		this.finalDefender = true;
		let names = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let points = this.points.get(player);
			if (points < minPoints) {
				this.bestplayers = [player];
				minPoints = points;
				names = ["**" + player.name + "**"];
			} else if (points === minPoints) {
				this.bestplayers.push(player);
				names.push("**" + player.name + "**");
			}
		}
		if (names.length === 1) {
			this.say(names[0] + " has the least points and advances to the finals!");
			this.oplayer = this.bestplayers[0];
			this.finalDefender = false;
			this.timeout = setTimeout(() => this.finalAttack(), 5 * 1000);
		} else {
			this.say(names.join(", ") + " are all tied for the least points and will have a roll battle to see who advances to the finals!");
			this.length = names.length;
			this.timeout = setTimeout(() => this.sayMultiRolls(), 5 * 1000);
		}
	}

	sayMultiRolls() {
		this.say("!roll " + this.length + "d100");
	}

	finalAttack() {
		this.say("**FINALS!** **" + this.curPlayer.name + "** is facing **" + this.oplayer.name + "**!");
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player !== this.curPlayer && player !== this.oplayer) {
				player.eliminated = true;
			}
		}
		this.finals = true;
		this.sayFinalRolls();
	}

	sayFinalRolls() {
	    this.rolla = null;
	    this.rollb = null;
		this.say("!roll 100");
		this.say("!roll 100");
	}

	listRemaining() {
		let waitings = []
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let curAttack = this.attacks.get(player);
			if (!curAttack) waitings.push(player.name);
		}
		this.say("Waiting on: "  + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.getRemainingPlayers()) {
			let player = this.players[userID];
			let curAttack = this.attacks.get(player);
			if (!player.eliminated && !curAttack) {
				player.say("You didn't attack a player this round and were eliminated!");
				player.eliminated = true;
			}
		}
		this.saySpores();
	}

	saySpores() {
		if (this.spores.length === 0) {
			this.handleAttacks();
		} else {
			let pair = this.spores.shift();
			let attacker = pair[0], attacked = pair[1];
			this.say("**" + attacker.name + "** spores **" + attacked.name + "**!");
			this.isSpored.set(attacked, true);
			this.timeout = setTimeout(() => this.saySpores(), 5 * 1000);
		}
	}

	handleAttacks() {
		this.expectingSpore = false;
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.curPlayer = this.order.shift();
			this.oplayer = this.attacks.get(this.curPlayer);
			if (this.curPlayer.eliminated || this.oplayer.eliminated || this.isSpored.has(this.curPlayer)) {
				this.handleAttacks();
			} else {
				this.actions.clear();
				this.expectingWow = true;
				this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**! Please pm me your actions with ``" + Config.commandCharacter + "action [card], [user]``");
				this.timeout = setTimeout(() => this.handleActions(), 30 * 1000); 
			}
		}
	}

	handleActions() {
		this.expectingWow = false;
		this.attackWows = [];
		this.defenseWows = [];
		this.attackHelps = [];
		this.defenseHelps = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.actions.has(player)) continue;
			let actions = this.actions.get(player);
			let card = actions[0];
			let target = actions[1];
			let name = "**" + player.name + "**";
			if (target === this.curPlayer && card === "Helping Hand") {
				this.attackHelps.push(name);
			} else if (target === this.curPlayer && card === "Will-o-Wisp") {
				this.attackWows.push(name);
			} else if (card === "Helping Hand") {
				this.defenseHelps.push(name);
			} else {
				this.defenseWows.push(name);
			}
		}
		if (this.attackWows.length > 0) {
			if (this.attackWows.length === 1) {
				this.say(this.attackWows.join(", ") + " Will-o-Wisps **" + this.curPlayer.name + "**");
			} else {
				this.say(this.attackWows.join(", ") + " all Will-o-Wisp **" + this.curPlayer.name + "**");
			}
		}
		if (this.defenseWows.length > 0) {
			if (this.defenseWows.length === 1) {
				this.say(this.defenseWows.join(", ") + " Will-o-Wisps **" + this.oplayer.name + "**");
			} else {
				this.say(this.defenseWows.join(", ") + " all Will-o-Wisp **" + this.oplayer.name + "**");
			}
		}
		if (this.attackHelps.length > 0) {
			if (this.attackHelps.length === 1) {
				this.say(this.attackHelps.join(", ") + " Helping Hands **" + this.curPlayer.name + "**");
			} else {
				this.say(this.attackHelps.join(", ") + " all Helping Hand **" + this.curPlayer.name + "**");
			}
		}
		if (this.defenseHelps.length > 0) {
			if (this.defenseHelps.length === 1) {
				this.say(this.defenseHelps.join(", ") + " Helping Hands **" + this.oplayer.name + "**");
			} else {
				this.say(this.defenseHelps.join(", ") + " all Helping Hand **" + this.oplayer.name + "**");
			}
		}
		if ((this.defenseHelps.length + this.attackHelps.length + this.defenseWows.length + this.attackWows.length) === 0) {
			this.say("No actions were made!");
		}
		this.timeout = setTimeout(() => this.doAttack(), 10 * 1000);
	}

	doAttack() {
		this.rolla = null;
		this.rollb = null;
		let adda = (this.attackHelps.length - this.attackWows.length) * 30;
		let addb = (this.defenseHelps.length - this.defenseWows.length) * 30;
		let rolla = 100 + adda, rollb = 100 + addb;
		if (rolla < 0) rolla = 10;
		if (rollb < 0) rollb = 10;
		this.roll1 = rolla;
		this.roll2 = rollb;
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		if (this.finals) {
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
			losePlayer.eliminated = true;
		} else if (winPlayer === this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "** and gains 2 points!");
		} else {
			this.say("**" + this.oplayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.curPlayer.name + "** and gains 1 point!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	handleRolls(rolls) {
		let bestPlayers = [];
		let maxRoll = 0;
		let names = [];
		for (let i = 0; i < rolls.length; i++) {
			let roll = rolls[i];
			if (roll > maxRoll) {
				maxRoll = roll;
				bestPlayers = [this.bestplayers[i]];
				names = ["**" + bestPlayers[0].name + "**"];
			} else if (roll === maxRoll) {
				bestPlayers.push(this.bestplayers[i]);
				names.push("**" + bestPlayers[bestPlayers.length - 1].name + "**");
			}
		}
		if (names.length === 1) {
			this.say(names[0] + " has the highest roll and advances to the finals!");
			if (this.finalAttacker) {
				this.curPlayer = bestPlayers[0];
				this.timeout = setTimeout(() => this.finalDefend(), 5 * 1000);
			} else {
				this.oplayer = bestPlayers[0];
				this.timeout = setTimeout(() => this.finalAttack(), 5 * 1000);
			}
		} else {
			this.say(names.join(", ") + " tied for the highest roll and will have a reroll!");
			this.bestplayers = bestPlayers;
			this.timeout = setTimeout(() => function() {
				this.say("!roll " + names.length + "d100");
			});
		}
	}

	destroy(target, user) {
		if (!this.expectingSpore) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let attacked = this.players[Tools.toId(target)];
		if (!attacked) {
			return user.say("Invalid player.");
		} else if (attacked.eliminated) {
			return user.say("That player has already been eliminated!");
		}
		if (this.attacks.has(player)) {
			return user.say("You have already attacked someone this round!");
		}
		if (attacked.id === user.id) {
			return user.say("You can't attack yourself...");
		}
		this.attacks.set(player, attacked);
		this.order.push(player);
		user.say("You have attacked **" + attacked.name + "**!");
	}

	action(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		target = target.split(",");
		if (target.length !== 2) {
			return user.say("Usage: ``" + Config.commandCharacter + "action [card], [user]``");
		}
		let card = Tools.toId(target[0]);
		let posscards = ["spore", "willowisp", "wow", "wisp", "hh", "helpinghand"];
		let index = posscards.indexOf(card);
		if (index === -1) {
			return user.say("Invalid card.");
		}
		if (card === "hh") {
		    card = "helpinghand";		   
		}
		if (card === "wisp" || card === "wow") {
		    card = "willowisp";
		}
		let cards = this.cards.get(player);
		let i;
		for (i = 0; i < cards.length; i++) {
			if (Tools.toId(cards[i]) === card) {
				break;
			}
		}
		if (i == cards.length) {
			return user.say("You have already used " + realnames[card]);
		}
		if (index === 0) {
			if (!this.expectingSpore) {
				return user.say("You cannot use Spore at this time.");
			}
			let attacked = this.players[Tools.toId(target[1])];
			if (!attacked) {
				return user.say("Invalid player.");
			}
			if (attacked.eliminated) {
				return user.say("That player has already been eliminated");
			}
			if (this.actions.has(player)) {
				return user.say("You have already Spored someone this round!");
			}	
			this.spores.push([player, attacked]);
			this.actions.set(player, 'spore');
			cards.splice(i, 1);
			this.cards.set(player, cards);
			return user.say("You have spored **" + attacked.name + "**!");
		} else {
			if (!this.expectingWow) {
				if (this.expectingSpore) {
					return user.say("You can only use Spore at this time.");
				} else {
					return user.say("You cannot use an action card at this moment");
				}
			}
			if (this.actions.has(player)) {
				return player.say("You have already used " + this.actions.get(player)[0]);
			}
			let attacked = this.players[Tools.toId(target[1])];
			if (!attacked) {
				return user.say("Invalid player.");
			}
			if (attacked !== this.curPlayer && attacked !== this.oplayer) {
				return user.say("You can only use " + realnames[card] + " on the players currently up!");
			}
			this.actions.set(player, [realnames[card], attacked]);
			cards.splice(i,1);
			this.cards.set(player,cards);
			return user.say("You have used " + realnames[card] + " on **" + attacked.name + "**!");

		}
	}

	hand(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let cards = this.cards.get(player);
		if (cards.length === 0) {
			return user.say("You've already used all of your cards!");
		} else {
			return user.say("Remaining cards: " + cards.join(", "));
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Poles;
exports.aliases = [];
exports.modes = ['Golf'];