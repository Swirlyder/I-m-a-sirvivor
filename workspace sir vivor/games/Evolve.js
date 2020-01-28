'use strict';

let goodmons = {};
let dex = Tools.data.pokedex;
for (let s0 in dex) {
	let b0 = dex[s0];
	if (b0.num < 1) continue;
	if (b0.evos) {
		for (let s1 of b0.evos) {
			let b1 = dex[toId(s1)];
			if (b1.evos) {
				for (let s2 of b1.evos) {
					if (!goodmons[s0]) goodmons[s0] = [];
					goodmons[s0].push(`${s0},${s1},${s2}`);
				}
			}
		}
	}
}


const name = "Evolve";
const description = "__This isn\'t even my final form!__ Game Rules: https://survivor-ps.weebly.com/evolve.html";
const id = Tools.toId(name);

class Evolve extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.mons = new Map();
		this.paths = new Map();
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
			let mon = Tools.sample(Object.keys(goodmons));
			let path = Tools.sample(goodmons[mon]);
			let player = this.order.shift();
			this.mons.set(player, mon);
			this.paths.set(player, path);
			if (this.variation === "shade") this.hp.set(player, Tools.data.pokedex[mon].baseStats.hp);
			player.say("Your mon is **" + Tools.data.pokedex[mon].species + "**!");
			this.timeout = setTimeout(() => this.handoutmon(), 0.2 * 1000);
		}
	}

	onNextRound() {
		this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name + "(" + this.hp.get(pl) + ")").join(", ") + "! PM me your attacks now with ``" + Config.commandCharacter + "destroy [user], [physical/special (or p/s)]``");
		if (this.round%3 === (this.variation === "shade" ? 0 : 2)) {
			this.say("**This round, you can also choose to evolve with ``" + Config.commandCharacter + "evolve``**!");
			this.canEvolve = true;
		}
		else this.canEvolve = false;
		this.order = [];
		this.attacks.clear();
		this.hasEvolved.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.timeout = setTimeout(() => this.listWaiting(), 60 * 1000);
	}

	listWaiting() {
		this.say("Waiting on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.attacks.has(pl) && !this.hasEvolved.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player) && !this.hasEvolved.has(player)) {
				player.eliminated = true;
				player.say("You didn't attack anybody and are eliminated!");
			}
		}
		this.handleAttacks();
	}

	beforeNextRound() {
		if (this.getRemainingPlayerCount() < 2) return this.nextRound();
		return this.nextRound();
		if (this.round%3 === 2) {
			this.say("**You can now choose to evolve with ``" + Config.commandCharacter + "evolve``**!");
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
		if (this.variation === "shade" && losePlayer.id === this.curPlayer.id) {
			this.say('**AI**');
		}
		else {
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
		if (this.hasEvolved.has(player)) return player.say("You have already evolved!");
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
		if (!player || player.eliminated) return;
		if (!this.canEvolve) return player.say("You can't evolve this round");
		let mon = this.mons.get(player);
		if (!Tools.data.pokedex[mon].evos) return player.say("You have already evolved twice!");
		if (this.attacks.has(player)) return user.say("You have already attacked somebody!");
		if (this.hasEvolved.has(player)) return player.say("You have already evolved!");

		let path = this.paths.get(player).split(',');
		let index = path.indexOf(toId(mon)) + 1;
		let evo = path[index];
		this.mons.set(player, evo);
		if (index === 1) {
			this.hp.set(player, 75);
		} else {
			this.hp.set(player, 100);
		}
		if (this.variation === "shade") this.hp.set(player, Tools.data.pokedex[evo].baseStats.hp);
		this.hasEvolved.set(player, true);
		player.say("You have evolved into **" + Tools.data.pokedex[evo].species + "**!");
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
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
exports.variations = [
	{
		name: "Shade's Evolve",
		aliases: [],
		variation: "shade",
		variationAliases: ["shades"],
	}
]
