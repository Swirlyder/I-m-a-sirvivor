'use strict';

const name = 'Dexterity';
const description = '__Where accuracy can give you the advantage or just make you fail...__ Game rules: https://sites.google.com/view/survivor-ps/themes-and-events/survivor-themes/dexterity';
const id = Tools.toId(name);

const data = {"twig": {atk:50, acc:100, name: "Twig", aliases: ["twig", "stick"], cd: 0},
			  "club": {atk:75, acc:85, name: "Club", aliases: ["club"], cd: 0},
			  "sword":{atk:100, acc:70, name: "Classic Sword", aliases: ["sword", "classicsword", 'theclassicsword'], cd: 0},
			  "jabulin": {atk:125, acc:50, name: "Jabulin of Pain", aliases: ["jabulin", "jabulinofpain", "jab", 'thejabulinofpain'], cd: 0},
			  "sofa": {atk:135, acc:40, name: "Sofa of Median", aliases: ["sofa", "sofaofmedian"], cd: 1},
			  "ax": {atk:150, acc:30, name: "Mass O' Ax", aliases: ["ax", "axe", "massoax", 'themassoax'], cd: 2},
			  "death": {atk:200, acc:10, name: "30lbs lance of Diamond known simply as DEATH", aliases: ["death", "30lbslanceofdiamondknownsimplyasdeath", "the30lbslanceofdiamondknownsimplyasdeath"], cd: 3}};

class Dexterity extends Games.Game {
	constructor(room) {
		super(room);
		this.blah = 0;
		this.id = id;
		this.description = description;
		this.name = name;
		this.order = [];
		this.items = new Map();
		this.attacks = new Map();
		this.prevAttacks = new Map();
		this.timePer = 10;
		this.canChooseItems = false;
		this.canAttack = false;
		this.doneAcc = false;
	}

	onStart() {
		try {
			for (let userID in this.players) {
				let player = this.players[userID];
				this.prevAttacks.set(player, []);
			}
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
			this.numAttacks = 0;
			this.pl();
			this.oplayer = null;
			this.curPlayer = null;
			this.order = [];
			this.canChooseItems = false;
			this.canAttack = false;
			this.items.clear();
			this.attacks.clear();
			this.roll1 = null;
			this.roll2 = null;
			this.chooseStuff();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

	chooseStuff() {
		try {
			this.canAttack = true;
			this.say("PM me your item and opponent now! **Command:** ``" + Config.commandCharacter + "destroy [user], [weapon]``. You can also use ``" + Config.commandCharacter + "weapons`` (in pms) to see the available weapons");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
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
			this.mailbreak(e);
		}
	}

	elimPlayers() {
		try {
			this.canAttack = false;
			for (let userID in this.getRemainingPlayers()) {
				let player = this.players[userID];
				let curAttack = this.attacks.get(player);
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

	doAttacks() {
		try {
			let item = this.items.get(this.curPlayer);
			let item2 = this.items.get(this.oplayer);
			this.roll1 = null;
			this.roll2 = null;
			this.winIndex = null;
			this.say("!roll " + item.atk);
			this.say("!dice " + item2.atk);
		} catch (e) {
			this.mailbreak(e);
		}
	}
	handleAttacks() {
		try {
			if (this.order.length === 0) {
				this.nextRound();
			} else {
				this.curPlayer = this.order.shift();
				this.oplayer = this.attacks.get(this.curPlayer);
				if (this.curPlayer.eliminated || this.oplayer.eliminated) {
					this.handleAttacks()
				} else {
					let attackeritem = this.items.get(this.curPlayer);
					let defenderitem = this.items.get(this.oplayer);
					this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "** with the **" + attackeritem.name + "**, who defends with the **" + defenderitem.name + "**!");
					this.timeout = setTimeout(() => this.doAttacks(), 5 * 1000);
				}
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}

	handleRoll(roll) {
		if (!this.roll1) {
			this.roll1 = roll;
		} else if (!this.roll2) {
			this.roll2 = roll;
			if (this.roll1 > this.roll2) {
				this.say("**" + this.curPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "**!");
				this.winIndex = 0;
			} else if (this.roll1 < this.roll2) {
				this.say("**" + this.oplayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + this.curPlayer.name + "**!");
				this.winIndex = 1;
			} else {
				this.say("The rolls were a tie! Rerolling...");
				this.doAttacks();
			}
			if (this.winIndex === 0 || this.winIndex === 1) {
				let bothPlayers = [this.curPlayer, this.oplayer];
				let item = this.items.get(bothPlayers[this.winIndex]);
				let acc = item.acc;
				if (acc === 100) {
					this.say("The item has 100% accuracy! RIP **" + bothPlayers[1 - this.winIndex].name + "**.");
					this.elimPlayer(bothPlayers[1 - this.winIndex]);
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				} else {
					this.say("Rolling for **" + bothPlayers[this.winIndex].name + "'s** accuracy!");
					this.timeout = setTimeout(() => {
						this.say("!roll 100");
					}, 5 * 1000);
				}
			}
		} else {
			let actAcc = roll;
			let bothPlayers = [this.curPlayer, this.oplayer];
			let item = this.items.get(bothPlayers[this.winIndex]);
			let acc = item.acc;
			if (actAcc <= acc) {
				this.say("The attack hits! RIP **" + bothPlayers[1 - this.winIndex].name + "**.");
				this.elimPlayer(bothPlayers[1 - this.winIndex]);
			} else {
				this.say("Fortunately for **" + bothPlayers[1 - this.winIndex].name + "**, the attack missed!");
			}
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
		}
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("Usage: ``" + Config.commandCharacter + "destroy [user], [weapon]``");
		if (Tools.toId(split[0]) === "constructor") return user.say("You cannot attack 'constructor'");
		let attackedPlayer = this.players[Tools.toId(split[0])];
		if (!attackedPlayer) return;
		if (attackedPlayer.eliminated) return user.say("That player has already been eliminated!")
		let weaponName = Tools.toId(split[1]);
		let weapon;
		for (let name in data) {
			let curWeapon = data[name];
			if (curWeapon.aliases.indexOf(weaponName) !== -1) {
				weapon = curWeapon;
				break;
			}
		}
		if (!weapon) return user.say("That is not a valid weapon!");
		let prevAttacks = this.prevAttacks.get(player);
		if (prevAttacks.indexOf(weapon.name) !== -1 && prevAttacks.indexOf(weapon.name) < weapon.cd) return user.say("Your cooldown is not over for that weapon!");
		if (this.attacks.has(player)) return user.say("You have already attacked somebody this round!");
		if (attackedPlayer.id === player.id) return user.say("You can't attack yourself.");
		this.attacks.set(player, attackedPlayer);
		this.items.set(player, weapon);
		prevAttacks.unshift(weapon.name);
		this.prevAttacks.set(player, prevAttacks);
		this.order.push(player);
		user.say("You have attacked **" + attackedPlayer.name + "** with the " + weapon.name + "!");
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}

	weapons(target, user) {
		let start = "<div class = \"infobox\"><html>";
		for (let i in data) {
			let weapon = data[i];
			start += "<b><u>" + weapon.name + "</u></b><ul><li>Damage: " + weapon.atk + " </li><li>Accuracy: " + weapon.acc + "</li></ul>";
		}
		start += "</html></div>";
		Rooms.get('survivor').say("/pminfobox " + user.id + "," + start);
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Dexterity;
exports.aliases = ["dext", "dex"];
exports.modes = ['Second Wind'];
exports.commands = {
	destroy: "destroy", 
	weapons: "weapons",
}
exports.pmCommands = {
	destroy: true,
	weapons: true,
}
