'use strict';

let goodmons = [];
for (let i in Tools.data.pokedex) {
	let mon = Tools.data.pokedex[i];
	if (mon.num < 1 || mon.baseSpecies) continue;
	if (mon.evos && mon.evos.length === 1) {
		let evo = Tools.data.pokedex[mon.evos[0]];
		if (evo.evos && evo.evos.length === 1) {
			goodmons.push(i);
		}
	}
}

const name = "Evolve";
const description = "https://docs.google.com/document/d/1CRDCidN_Y7TJl3pUuuQ2mRZBBWIyTOT4LU4QFCXnBiU/edit";
const id = Tools.toId(name);

class Evolve extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.mons = new Map();
		this.hp = new Map();
		this.attacks = new Map();
		this.hasEvolved = new Map();
		this.order = [];
		this.numAttacks = 0;
		this.canAttack = false;
		this.canEvolve = false;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.hp.set(player, 50);
		}
		this.say("I will now handout mons!");
		this.order = Tools.shuffle(Object.values(this.players));
		this.handoutmon();
	}

	handoutmon() {
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			let mon = Tools.sample(goodmons);
			let player = this.order.shift();
			this.mons.set(player, mon);
			player.say("Your mon is **" + Tools.data.pokedex[mon].species + "**!");
			this.timeout = setTimeout(() => this.handoutmon(), 5 * 1000);
		}
	}

	onNextRound() {
		this.say("**Remaining Players (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + "! PM me your attacks now with ``" + Config.commandCharacter + "destroy [user], [physical/special (or p/s)]``");
		this.order = [];
		this.attacks.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.canEvolve = false;
		this.timeout = setTimeout(() => this.listWaiting(), 60 * 1000);
	}

	listWaiting() {
		this.say("Waiting on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.attacks.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) {
				player.eliminated = true;
				player.say("You didn't attack anybody and are eliminated!");
			}
		}
		this.handleAttacks();
	}

	beforeNextRound() {
		if (this.getRemainingPlayerCount() < 2) return this.nextRound();
		if (this.round%3 === 2) {
			this.say("**You can now choose to evolve with** ``**" + Config.commandCharacter + "evolve**``!");
			this.hasEvolved.clear();
			this.canEvolve = true;
			this.timeout = setTimeout(() => this.nextRound(), 60 * 1000);
		} else {
			this.nextRound();
		}
	}
	handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			return this.beforeNextRound();
		}
		this.curPlayer = this.order.shift();
		let stuff = this.attacks.get(this.curPlayer);
		this.oplayer = stuff[0];
		if (this.curPlayer.eliminated || this.oplayer.eliminated) {
			return this.handleAttacks();
		}
		this.type = (stuff[1][0] === "p" ? "Physically" : "Specially");
		this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "** **" + this.type + "**!");
		this.timeout = setTimeout(() => this.setPlayerRolls(), 5 * 1000);
	}

	setPlayerRolls() {
		if (this.type === "Physically") {
			this.roll1 = Tools.data.pokedex[this.mons.get(this.curPlayer)].baseStats.atk;
			this.roll2 = Tools.data.pokedex[this.mons.get(this.oplayer)].baseStats.def;
		} else {
			this.roll1 = Tools.data.pokedex[this.mons.get(this.curPlayer)].baseStats.spa;
			this.roll2 = Tools.data.pokedex[this.mons.get(this.oplayer)].baseStats.spd;
		}
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		let diff = Math.abs(this.rolla - this.rollb);
		let losehp = this.hp.get(losePlayer);
		if (diff >= losehp) {
			this.say("**" + losePlayer.name + "** loses all of their health! They were: ");
			this.say("!dt " + this.mons.get(losePlayer));
			losePlayer.eliminated = true;
		} else {
			this.say("**" + losePlayer.name + "** loses **" + diff + "** health!");
			this.hp.set(losePlayer, losehp - diff);
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	onEnd() {
		if (this.getRemainingPlayerCount() === 1) {
			let lastPlayer = this.getLastPlayer();
			this.say("!dt " + this.mons.get(lastPlayer));
		}
	}

	destroy(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.canAttack) return;
		if (this.attacks.has(player)) return user.say("You have already attacked somebody!");
		let split = target.split(",");
		if (split.length !== 2) return user.say("Usage: ``" + Config.commandCharacter + "destroy [user], [physical/special (or p/s)]");
		let targPlayer = this.players[Tools.toId(split[0])];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (['physical', 'special', 'p', 's'].indexOf(Tools.toId(split[1])) === -1) return user.say("You must specify your attack as physical or special");
		this.attacks.set(player, [targPlayer, Tools.toId(split[1])]);
		player.say("You have attacked **" + targPlayer.name + "**!");
		this.numAttacks++;
		this.order.push(player);
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}

	evolve(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.canEvolve) return;
		let mon = this.mons.get(player);
		if (!Tools.data.pokedex[mon].evos) return player.say("You have already evolved twice!");
		if (this.hasEvolved.has(player)) return player.say("You have already evolved!");
		this.mons.set(player, Tools.data.pokedex[mon].evos[0]);
		if (Tools.data.pokedex[Tools.data.pokedex[mon].evos[0]].evos) {
			this.hp.set(player, 75);
		} else {
			this.hp.set(player, 100);
		}
		this.hasEvolved.set(player, true);
		player.say("You have evolved into **" + Tools.data.pokedex[Tools.data.pokedex[mon].evos[0]].species + "**!");
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Evolve;
exports.commands = {
	"destroy": "destroy",
	"evolve": "evolve",
};

exports.pmCommands = {
	"destroy": true,
	"evolve": true,
}