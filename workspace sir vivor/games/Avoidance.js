'use strict';
const name = "Avoidance";
const description = "__The trick is to pick the number that makes you not lose.__ Game rules: https://survivor-ps.weebly.com/avoidance.html";
const id = Tools.toId(name);
class Avoidance extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.maxNum = 3;

		this.canNum = false;
		this.canAtk = false;
	}

	onStart() {
		this.maxNum = Math.ceil(this.getRemainingPlayerCount() / 1.5);
		this.phase = true;
		this.numbers = new Map();
		this.attacks = new Map();
		this.number = 1;
		this.nextRound();
	}

	onNextRound() {
		if (this.phase && this.getRemainingPlayerCount() === 2) {
			this.phase = false;
			this.say("**We're down to the last 2 players!**")
		}
		if (this.phase) {
			this.pl();
			this.numbers.clear();
			this.say("Choose your number in my PMs using ``.choose [number (1-" + this.maxNum + ")]``.");
			this.canNum = true;
			this.timeout = setTimeout(() => this.checkWaiting(), 45 * 1000);
		}
		else {
			if (this.getRemainingPlayerCount() === 2) {
				let players = this.getRemainingPlayers();
				this.attacker = players[Object.keys(players)[this.round % 2 === 0 ? 0 : 1]];
				this.defender = players[Object.keys(players)[this.round % 2 === 0 ? 1 : 0]];
				this.say(`**${this.attacker.name} attacks ${this.defender.name}**`);
				this.timeout = setTimeout(() => this.sayRolls(), 2 * 1000);
			}
			else {
				let targets = Object.values(this.players).filter(pl => !pl.eliminated && this.numbers.get(pl) === this.number);
				if (targets.length === 2) {
					this.say(`**${targets[0].name} attacks ${targets[1].name}**`);
					this.attacker = targets[0];
					this.defender = targets[1];
					this.timeout = setTimeout(() => this.sayRolls(), 2 * 1000);
				}
				else {
					this.canAtk = true;
					this.attacks = new Map();
					this.say(`**${targets.map(pl => pl.name).join(', ')}! PM me your target using \`\`.destroy [user]\`\`.**`);
					this.timeout = setTimeout(() => this.checkWaiting(), 45 * 1000);
				}
			}
		}
	}

	checkWaiting() {
		let players = this.getRemainingPlayers();
		let waiting = [];
		for (let i in players) {
			if (this.phase) {
				if (!this.numbers.has(this.players[i])) waiting.push(players[i].name);
			}
			else if (!this.attacks.has(this.players[i]) && this.numbers.get(this.players[i]) === this.number) waiting.push(players[i].name);
		}
		this.say('Waiting for: ' + waiting.join(', '));
		setTimeout(() => this.elimWaiting(), 30 * 1000);
	}

	elimWaiting() {
		let players = this.getRemainingPlayers();
		let waiting = [];
		for (let i in players) {
			if (this.phase) {
				if (!this.numbers.has(this.players[i])) {
					waiting.push(this.players[i].name);
					this.players[i].eliminated = true;
				} 
			}
			else if (!this.attacks.has(this.players[i]) && this.numbers.get(this.players[i]) === this.number) {
				waiting.push(players[i].name);
				this.players[i].eliminated = true;
			}
		}
		this.say(waiting.join(', ') + ` ha${waiting.length === 1 ? "s" : "ve"} been eliminated for not sending their ${this.phase ? "number" : "attack"} in time.`);
		if (this.getRemainingPlayerCount() <= 1) return this.end();
		this.handleAttacks();
	}

	numPL() {
		this.say(Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name + " [" + this.numbers.get(pl) + "]").join(", "))
	}

	handleAttacks() {
		if (this.phase) {
			this.canNum = false;
			this.numPL();
			this.say('**The number is...**');
			this.say('!roll ' + this.maxNum);
		}
		else {
			if (this.canAtk) {
				this.say('**Attacks are in!**');
				this.canAtk = false;
			}
			if (this.attacks.size) {
				this.attacker = Array.from(this.attacks.keys())[0];
				this.defender = this.attacks.get(this.attacker);
				if (this.defender.eliminated) {
					this.attacks.delete(this.attacker);
					return this.handleAttacks();
				}
				this.say(`**${this.attacker.name} attacks ${this.defender.name}!**`);
				this.timeout = setTimeout(() => this.sayRolls(), 2 * 1000);
			}
			else {
				this.phase = true;
				this.nextRound();
			}

		}
	}

	sayRolls() {
		this.rolla = false;
		this.rollb = false;
		this.say('!roll 100');
		this.say('!dice 100');
	}

	handleRoll(roll) {
		if (this.phase) {
			this.number = roll;
			let toAttack = [];
			for (let i of this.numbers) {
				if (i[1] === roll) toAttack.push(i[0]);
			}
			if (toAttack.length <= 1) {
				if (toAttack.length === 1) {
					this.say(`**${toAttack[0].name} is eliminated!**`);
					toAttack[0].eliminated = true;
				}
				this.nextRound();
			}
			else {
				this.phase = false;
				this.onNextRound();
			}
		}
		else {
			if (!this.rolla) this.rolla = roll;
			else if (!this.rollb) {
				this.rollb = roll;
				this.attacks.delete(this.attacker);
				if (this.rolla > this.rollb) {
					this.say(`**${this.defender.name} is eliminated!**`);
					this.defender.eliminated = true;
					this.attacks.delete(this.defender);
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
			// This is legit the hardest part. I don't understand Sir Vivor
		}
	}

	choose(target, user) {
		let player = this.players[user.id];
		if (!this.canNum) return;
		if (this.numbers.get(player)) return player.say('You have already selected a number.');
		target = parseInt(target, 10);
		if (isNaN(target) || target < 1 || target > this.maxNum) return player.say(`You need to pick a number between 1 and ${this.maxNum}.`);
		this.numbers.set(player, target);
		player.say('You chose ``' + target + '``.');
		if (this.numbers.size === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}

	destroy(target, user) {
		let player = this.players[user.id];
		if (!this.canAtk) return;
		if (this.attacks.has(player)) return user.say("You already chose your target.");
		if (!player) return;
		if (this.numbers.get(player) !== this.number) return user.say("You can't attack this round.");
		if (toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let targPlayer = this.players[toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.numbers.get(targPlayer) !== this.number) return user.say("That player can't be attacked this round.");
		if (targPlayer === this.curPlayer) return this.say(">Attacking yourself.");
		this.attacks.set(player, targPlayer);
		player.say('You attacked ``' + targPlayer.name + '``.');
		if (this.attacks.size === Object.values(this.players).filter(pl => !pl.eliminated && this.numbers.get(pl) === this.number).length) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}
}

exports.name = name;
exports.description = description;
exports.id = id;
exports.game = Avoidance;
exports.commands = {
	destroy: "destroy",
	choose: "choose"
}
exports.pmCommands = {
	destroy: true,
	choose: true
}