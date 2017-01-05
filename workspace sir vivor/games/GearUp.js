'use strict';

const name = "Gear Up";
const description = "**Gear Up**: So you have items? You think you're cool? Pffft! You totally shouldn't click this link and learn about Gear Up (Long Games) Game rules: http://survivor-ps.weebly.com/gear-up.html";
const id = toId(name);

const items = {
	ts: {name: "Toy Sword", aliases: ["ts", "toysword"], effects: {attack: 10}, class: 0},
	pcs: {name: "Poorly Crafted Sword", aliases: ["pcs", "poorlycraftedsword"], effects: {attack: 20}, class: 0},
	wms: {name: "Well Made Sword", aliases: ["wms", "wellmadesword"], effects: {attack: 30}, class: 0},
	ks: {name: "Knight Sword", aliases: ["ks", "knightsword"], effects: {attack: 40}, class:0 },
	ms: {name: "Master Sword", effects: {attack: 50}, class: 0},
	ph: {name: "Paper Hat", aliases: ["ph", "paperhat"], effects: {defense: 3}, class: 1},
	ih: {name: "Iron Helmet", effects: {defense: 6}, class: 1},
	sh: {name: "Steel Helmet", effects: {defense: 9}, class: 1},
	th: {name: "Titanium Helmet", effects: {defense: 12}, class: 1},
	imh:{name: "Impenetrable Helmet", effects: {defense: 15}, class: 1},
	pt: {name: "Paper Tunic", aliases: ["pt", "papertunic"], effects: {defense: 4}, class: 2},
	it: {name: "Iron Chestplate", effects: {defense: 8}, class: 2},
	st: {name: "Steel Chestplate", effects: {defense: 12}, class: 2},
	tt: {name: "Titanium Chestplate", effects: {defense: 16}, class: 2},
	imt:{name: "Impenetrable Chestplate", effects: {defense: 20}, class: 2},
	pp: {name: "Paper Pants", aliases: ["pp", "paperpants"], effects: {defense: 2}, class: 3},
	il: {name: "Iron Leggings", effects: {defense: 4}, class: 3},
	sl: {name: "Steel Leggings", effects: {defense: 6}, class: 3},
	tl: {name: "Titanium Leggings", effects: {defense: 8}, class: 3},
	iml:{name: "Impenetrable Leggings", effects: {defense: 10}, class: 3},
	ps: {name: "Paper Shoes", aliases: ["ps", "papershoes"], effects: {defense: 1}, class: 4},
	ib: {name: "Iron Boots", effects: {defense: 2}, class: 4},
	sb: {name: "Steel Boots", effects: {defense: 3}, class: 4},
	tb: {name: "Titanium Boots", effects: {defense: 4}, class: 4},
	imb:{name: "Impenetrable Boots", effects: {defense: 5}, class: 4},
}

class GearUp extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.items = new Map();
		this.attacks = new Map();
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.items.set(player, []);
		}
		this.nextRound();
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			let winPlayer = this.getLastPlayer();
			this.say("**Winner:** " + winPlayer.name);
			this.say(".win " + winPlayer.name);
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 0) {
			this.say("Everyone was mked!");
			this.end();
			return;
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			let curCards = this.items.get(player);
			let card = items[Tools.sample(Object.keys(items))];
			if (this.round !== 1) {
				player.say("You were awarded " + card.name + " for surviving another round!");
			} else {
				player.say("Your starting item is: " + card.name);
			}
			let attackGain = 0;
			let defenseGain = 0;
			curCards.push(card);
			this.items.set(player, curCards);
			player.say("Current stat bonuses: **ATK:** " + this.getStats(player, true) + ", **DEF:**" + this.getStats(player, false) + ".");
		}
		this.numAttacks = 0;
		this.canAttack = true;
		this.order = [];
		this.attacks.clear();
		this.pl();
		this.say("Everyone please pm me your target! **Command:** ``" + Config.commandCharacter + "destroy [user]`` (in pms)");
		this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
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
	}
	
	getStats(player, attack) {
		let items = this.items.get(player);
		let maxes = [0,0,0,0,0,0];
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			let effects = item.effects;
			let value;
			if (attack) {
				value = effects.attack;
			} else {
				value = effects.defense;
			}
			if (value) {
				let index = item.class;
				maxes[index] = Math.max(maxes[index], value);
			}
		}
		let sum = 0;
		for (let i = 0; i < 6; i++) {
			sum += maxes[i];
		}
		return sum;
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
		this.rolla = null;
		this.rollb = null;
		let attack = 100 + this.getStats(this.curPlayer, true);
		let defense = 100 + this.getStats(this.oplayer, false);
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
				let winPlayer, losePlayer;
				if (this.rolla > this.rollb) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
					let winItems = this.items.get(winPlayer), loseItems = this.items.get(losePlayer);
					let randItem = Tools.sample(loseItems);
					winItems.push(randItem);
					this.players[losePlayer.id].eliminated = true;
					this.items.set(winPlayer, winItems);
					this.say("**" + winPlayer.name + "** beats up **" + losePlayer.name + "** and steals their " + randItem.name + "!");
				} else {
					this.say("**" + this.oplayer.name + "** defended successfully!");
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
	}
}

exports.game = GearUp;
exports.name = name;
exports.id = id;
exports.description = description;
exports.aliases = [];