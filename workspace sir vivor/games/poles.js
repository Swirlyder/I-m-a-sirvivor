'use strict';

const name = 'Dexterity';
const description = '**Dexterity**: __Where accuracy can give you the advantage or just make you fail...__ Game rules: http://survivor-ps.weebly.com/dexterity.html';
const id = Tools.toId(name);

const data = {"twig": {atk:50, acc:100, name: "Twig", aliases: ["twig", "stick"], cd: 0},
			  "club": {atk:75, acc:85, name: "Club", aliases: ["club"], cd: 0},
			  "sword":{atk:100, acc:70, name: "Classic Sword", aliases: ["sword", "classicsword"], cd: 0},
			  "jabulin": {atk:125, acc:50, name: "Jabulin of Pain", aliases: ["jabulin", "jabulinofpain", "jab"], cd: 0},
			  "sofa": {atk:135, acc:40, name: "Sofa of Median", aliases: ["sofa", "sofaofmedian"], cd: 1},
			  "ax": {atk:150, acc:30, name: "Mass O' Ax", aliases: ["ax", "axe", "massoax"], cd: 2},
"death": {atk:200, acc:10, name: "30lbs lance of Diamond known simply as DEATH", aliases: ["death", "30lbslanceofdiamondknownsimplyasDEATH"], cd: 3}};

class Dexterity extends Games.Game {
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
		} else {
			this.expectingSpore = true;
			this.expectingWow = false;
			this.attack.clear();
			this.say("Please pm me your attacks and spores with ``" + Config.commandCharacter + "destroy [user]``, " + Config.commandCharacter + "action spore, [user]``");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		}
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
			if (!curAttack) {
				player.say("You didn't attack a player this round and were eliminated!");
				this.players[userID].eliminated = true;
			}
		}
		this.handleAttacks();
	}
	
	handleAttacks() {
		this.expectingSpore = false;
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.curPlayer = this.order.shift();
			this.oplayer = this.attacks.get(this.curPlayer);
			if (this.curPlayer.eliminated || this.oplayer.eliminated) {
				this.handleAttacks();
			} else {
				this.actions.clear();
				this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**! Please pm me your actions with ``" + Config.commandCharacter + "action [card], [user]``");
				this.timeout = setTimeout(() => this.handleActions(), 30 * 1000); 
			}
		}
	}

	handleRoll(roll) {
		
	}

	destroy(target, user) {
		
	}

	action(target, user) {
		
	}

	hand(target, user) {
		
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Dexterity;
exports.aliases = ["dext", "dex"];