'use strict';
const name = "Dragon Orbs";
const description = "__Get your power level over 9000 by collecting getting the right balls or whatever..__ Game rules: https://survivor-ps.weebly.com/dragon-orbs.html";
const id = Tools.toId(name);
class DragonOrbs extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
	}

	onStart() {
		this.attacks = {};
		this.numbers = {};
		this.phase = false;
		this.nextRound();
	}

	onNextRound() {
		this.phase = false;
		this.attacks = {};
		this.numbers = {};
		if (this.getRemainingPlayerCount() === 2) {
			let players = this.getRemainingPlayers();
			this.say("**Only 2 players remain!**");
			let n1 = Object.keys(players)[0];
			let n2 = Object.keys(players)[1];
			this.attacker = players[n1];
			this.defender = players[n2];
			this.say(`**${this.attacker.name} attacks ${this.defender.name}! Choose your number using \`\`.choose [number (1-3)]\`\`**`);
			this.phase = true;
			this.timeout = setTimeout(() => this.checkWaiting(), 15 * 1000);
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
			if (!this.phase) {
				if (!this.attacks[i]) waiting.push(players[i].name);
			}
			else if (!this.numbers[i] && (players[i].name === this.attacker.name || players[i].name === this.defender.name)) waiting.push(players[i].name);
		}
		this.say('Waiting for: ' + waiting.join(', '));
		this.timeout = setTimeout(() => this.elimWaiting(), (this.phase ? 10 : 30) * 1000);
	}

	elimWaiting() {
		let players = this.getRemainingPlayers();
		let waiting = [];
		for (let i in players) {
			if (!this.phase) {
				if (!this.attacks[i]) {
					waiting.push(players[i].name);
					players[i].eliminated = true;
				}
			}
			else {
				if (!this.numbers[i] && (players[i].name === this.attacker.name || players[i].name === this.defender.name)) {
					waiting.push(players[i].name);
					players[i].eliminated = true;
				}
			}

		}
		this.say(waiting.join(', ') + ` ha${waiting.length === 1 ? "s" : "ve"} been eliminated for not sending their ${this.phase ? "number" : "attack"} in time.`);
		if (this.getRemainingPlayerCount() <= 1) return this.end();
		this.handleAttacks();
	}

	handleAttacks() {
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
			this.say(`**${this.attacker.name} attacks ${this.defender.name}! Choose your number using \`\`.choose [number (1-3)]\`\`**`);
			this.phase = true;
			this.numbers = {};
			this.timeout = setTimeout(() => this.checkWaiting(), 15 * 1000);
		}
		else {
			this.nextRound();
		}
	}

	sayRolls() {
		this.rolla = false;
		this.rollb = false;
		this.say('!roll ' + this.atkroll);
		this.say('!dice ' + this.defroll);
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		}
		else if (!this.rollb) {
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

	handleRolls(rolls) {
		let n = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
		}
		for (let i of rolls) {
			n[i] += 25;
		}
		this.atkroll = 100 + n[4] + n[this.numbers[toId(this.attacker.name)]];
		this.defroll = 100 + n[4] + n[this.numbers[toId(this.defender.name)]];
		this.say(`${this.attacker.name} [${this.atkroll}] vs ${this.defender.name} [${this.defroll}]`);
		setTimeout(() => this.sayRolls(), 2.5 * 1000);
	}

	continueAttack() {
		this.say('The numbers are in!');
		this.say('!roll 4d4');
	}

	choose(target, user) {
		let player = this.players[user.id];
		if (!this.phase) return;
		if (this.numbers[user.id]) return player.say('You have already selected a number.');
		target = parseInt(target, 10);
		if (isNaN(target) || target < 1 || target > 3) return player.say(`You need to pick a number between 1 and 3.`);
		this.numbers[user.id] = target;
		player.say('You chose ``' + target + '``.');
		if (Object.keys(this.numbers).length === 2) {
			clearTimeout(this.timeout);
			this.continueAttack();
		}
	}

	destroy(target, user) {
		let player = this.players[user.id];
		if (this.phase) return;
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
exports.game = DragonOrbs;
exports.commands = {
	destroy: "destroy",
	choose: "choose"
}
exports.pmCommands = {
	destroy: true,
	choose: true
}