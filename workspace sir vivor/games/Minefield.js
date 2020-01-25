'use strict';
const name = "Minefield";
const description = "__Watch your step!__ Game rules: https://survivor-ps.weebly.com/minefield.html";
const id = Tools.toId(name);

class Minefield extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
	}

	checkMine(num, stacked = false) {
		if (stacked) return this.stack.includes(num%100);
		if (this.number === false) return false;
		if (!this.before) return false;
		num = (num % 100).toString();
		if (num.length < 2) num = "0" + num;
		if (this.before === 1) {
			return num.startsWith(this.number);
		}
		else {
			return num.endsWith(this.number);
		}
	}

	onStart() {
		this.attacks = {};
		if (this.variation === "stacked") this.stack = [];
		this.phase = false;
		this.bypass = false;

		this.before = false;
		this.number = false;
		this.nextRound();
	}

	onNextRound() {
		if (this.variation === "simple") this.before = false; // This variable name is bad, needs to be renamed eventually
		if (this.variation === "simple") this.number = false;
		this.phase = "mine";
		this.pl();
		this.say(`!roll 10`);
	}

	afterMines() {
		this.phase = "attack";
		this.attacks = {};
		if (this.getRemainingPlayerCount() === 2) {
			let players = this.getRemainingPlayers();
			this.say("**Only 2 players remain!**");
			let n1 = Object.keys(players)[0];
			let n2 = Object.keys(players)[1];
			this.attacker = players[n1];
			this.defender = players[n2];
			this.phase = "damage";
			this.say(`**${this.attacker.name} attacks ${this.defender.name}!**`);
			this.sayRolls();
			return;
		}
		this.pl()
		this.say("**PM me your attack using ``.destroy [name]``**");
		this.timeout = setTimeout(() => this.checkWaiting(), 45 * 1000);
	}

	checkWaiting() {
		let players = this.getRemainingPlayers();
		let waiting = [];
		for (let i in players) {
			if (!this.attacks[i]) waiting.push(players[i].name);
		}
		this.say('Waiting for: ' + waiting.join(', '));
		this.timeout = setTimeout(() => this.elimWaiting(), 30 * 1000);
	}

	elimWaiting() {
		let players = this.getRemainingPlayers();
		let waiting = [];
		for (let i in players) {
			if (!this.attacks[i]) {
				waiting.push(players[i].name);
				players[i].eliminated = true;
			}
		}
		this.say(waiting.join(', ') + ` ha${waiting.length === 1 ? "s" : "ve"} been eliminated for not sending their attack in time.`);
		if (this.getRemainingPlayerCount() <= 1) return this.end();
		this.handleAttacks();
	}

	handleAttacks() {
		this.phase = "damage";
		if (this.getRemainingPlayerCount() <= 2) return this.nextRound();
		if (Object.keys(this.attacks).length) {
			let n = Object.keys(this.attacks).length
			this.attacker = Object.keys(this.attacks)[Math.floor(Math.random() * n)];
			this.defender = this.players[this.attacks[this.attacker]];
			this.attacker = this.players[this.attacker];
			if (this.defender.eliminated) {
				delete this.attacks[toId(this.attacker.name)];
				return this.handleAttacks();
			}
			this.say(`**${this.attacker.name} attacks ${this.defender.name}!**`);
			this.sayRolls();
		}
		else {
			this.nextRound();
		}
	}

	sayRolls() {
		this.rolla = false;
		this.rollb = false;
		this.say('!roll 100');
		this.say('!dice 100');
	}

	handlePick(pick) {
		if (this.variation !== "simple" || this.before === false) this.before = pick === "beginning" ? 1 : 2;
		let nums = [];
		for (let i = 1; i <= 100; i++) {
			if (this.checkMine(i)) {
				nums.push(i);
				if (this.variation === "stacked") this.stack.push(i);
			}
		}
		this.say(`**The mines are anything ${this.before === 1 ? "starting with" : "ending on"} a ${this.number % 10}** (${nums.join(', ')})`);
		setTimeout(() => this.afterMines(), 2000);
	}

	handleRoll(roll) {
		if (this.phase === "mine") {
			if (this.variation !== "simple" || this.number === false) this.number = roll % 10;
			this.say('!pick beginning, end');
		}
		if (this.phase === "damage") {
			if (!this.rolla) {
				this.rolla = roll;
				if (this.checkMine(roll)) {
					this.say(`${this.attacker.name} rolled a mine! They're eliminated.`);
					this.attacker.eliminated = true;
					this.bypass = true;
				}
			}
			else if (!this.rollb) {
				if (this.bypass) {
					this.bypass = false;
					return setTimeout(() => this.handleAttacks(), 2 * 1000);
				}
				if (this.checkMine(roll)) {
					this.say(`${this.defender.name} rolled a mine! They're eliminated.`);
					this.defender.eliminated = true;
					return setTimeout(() => this.handleAttacks(), 2 * 1000);
				}
				this.rollb = roll;
				delete this.attacks[toId(this.attacker.name)];
				if (this.rolla > this.rollb) {
					this.say(`**${this.defender.name} is eliminated!**`);
					this.defender.eliminated = true;
					delete this.attacks[toId(this.defender.name)];
				}
				else if (this.rolla < this.rollb) {
					this.say(`**${this.attacker.name} is eliminated!**`);
					this.attacker.eliminated = true;
				}
				else {
					this.say(`**The rolls were the same... Rerolling!**`);
					this.timeout = setTimeout(() => this.sayRolls(), 5 * 1000);	
				}
				this.timeout = setTimeout(() => this.handleAttacks(), 2 * 1000);
			}
		}

	}

	destroy(target, user) {
		let player = this.players[user.id];
		if (this.phase !== "attack") return;
		if (this.attacks[user.id]) return user.say("You already chose your target.");
		if (!player) return;
		if (toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let targPlayer = this.players[toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (targPlayer === this.curPlayer) return this.say(">Attacking yourself.");
		this.attacks[user.id] = toId(target);
		player.say('You attacked ``' + targPlayer.name + '``.');
		if (Object.keys(this.attacks).length === Object.values(this.players).filter(pl => !pl.eliminated).length) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}
}

exports.name = name;
exports.description = description;
exports.id = id;
exports.game = Minefield;
exports.commands = {
	destroy: "destroy"
}
exports.pmCommands = {
	destroy: true
}
exports.variations = [
	{
		name: "Stacked Minefield",
		aliases: [],
		variation: "stacked",
		variationAliases: [],
	},
	{
		name: "Simple Minefield",
		aliases: [],
		variation: "simple",
		variationAliases: [],
	},
	/*{
		name: "Double Whammy Minefield",
		aliases: ["doubleminefield", "whammyminefield"],
		variation: "doublewhammy",
		variationAliases: ["double", "whammy"],
	},*/
]
