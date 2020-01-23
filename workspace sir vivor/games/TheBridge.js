'use strict';
const name = "The Bridge";
const description = "__Why burn the bridge when it will crumble on its own?__ Game rules: https://survivor-ps.weebly.com/the-bridge.html";
const id = Tools.toId(name);

class Bridge extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
	}

	numPL() {
		let ret = Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name + " [" + this.planks[toId(pl.name)] + "]").join(", ");
		this.say('**' + ret + '**');
		return ret;
	}

	onStart() {
		this.attacker = false;
		this.defender = false;
		this.saveroll = 100;
		this.attacks = {};
		this.planks = {}
		for (let i in this.players) {
			this.planks[i] = 1;
		}
		this.phase = false;
		this.max = Math.ceil(this.getRemainingPlayerCount() * 1.25);
		this.say(`/wall Players win if they reach plank \`\`${this.max}\`\``);
		this.nextRound();
	}

	onNextRound() {
		this.defender = false;
		this.current = false;
		this.say(`/wall Round ${this.round}`);
		if (this.getRemainingPlayerCount() === 0) {
			this.say(`**Everyone died! Bringing back ${this.steps.join(', ')}`);
			for (let i of this.steps) {
				players[i].eliminated = false;
			}
			if (this.getRemainingPlayerCount() === 1) return this.end();
		}
		this.steps = []
		let npl = this.numPL();
		let PL = this.getRemainingPlayers();
		
		let wins = [];
		for (let i in PL) {
			if (this.planks[i] >= this.max) wins.push(PL[i].name);
		}
		if (wins.length === 1) {
			this.say('/wall ' + wins[0] + ' made it to the end! GG');
			this.say('**Winner:** ' + wins[0]);
			this.end();
		}
		else if (wins.length > 1) {
			if (this.phase !== "finals") {
				this.phase = "finals";
				this.say("**More than one player reached the end! Moving to HGS**");
			}
			this.say('!pick ' + this.wins.join(', '));
		}
		else {
			this.phase = "move";
			this.rpl = npl.split(', ');
			setTimeout(() => this.nextPlayer(), 2500);
		}
	}

	nextPlayer() {
		//if (this.getRemainingPlayerCount() <= 1) return this.end();
		if (this.rpl.length === 0) setTimeout(() => this.nextRound(), 5 * 1000);
		else if (this.rpl.length === 1) {
			let pick = this.rpl[0];
			this.rpl.splice(this.rpl.indexOf(pick), 1);
			let player = pick.split(' [')[0];
			this.current = this.players[toId(player)];
			this.say(`**${this.current.name}! You're up! You can choose to step for 1 plank or leap for 2 planks using \`\`.step\`\` or \`\`.leap\`\`**`);
			this.timeout = setTimeout(() => checkWaiting(), 30 * 1000);
		}
		else this.say('!pick ' + this.rpl.join(', '));
	}

	checkWaiting() {
		this.say('Waiting for: ' + this.current.name);
		this.timeout = setTimeout(() => this.elimWaiting(), 30 * 1000);
	}

	elimWaiting() {
		this.current.eliminated = true;
		this.say(`${this.current.name} has been eliminated for not sending their move in time.`);
		this.saveroll += 5;
		if (this.getRemainingPlayerCount() <= 1) return this.end();
		this.nextPlayer();
	}


	sayRolls() {
		this.rolla = false;
		this.rollb = false;
		if (this.phase === "step") this.say('!roll ' + this.saveroll);
		else this.say('!roll 100');
		this.say('!dice 100');
	}

	handlePick(pick) {
		if (pick === "break") {
			this.say("**The plank breaks! Let's see if they can save themselves**");
			this.sayRolls();
		}
		else if (pick === "no break") {
			this.nextPlayer();
		}
		else if (this.phase === "finals") { // Separate check for finals because it should jump to different code here.
			this.say(`**${pick} choose your target using \`\`.destroy [target]\`\`**`);
			this.current = this.current = this.players[toId(pick)];
			this.timeout = setTimeout(() => checkWaiting(), 30 * 1000);
		}
		else {
			this.rpl.splice(this.rpl.indexOf(pick), 1);
			let player = pick.split(' [')[0];
			this.current = this.players[toId(player)];
			this.say(`**${this.current.name}! You're up! You can choose to step for 1 plank or leap for 2 planks using \`\`.step\`\` or \`\`.leap\`\`**`);
			this.timeout = setTimeout(() => checkWaiting(), 30 * 1000);
		}
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		}
		else if (!this.rollb) {
			this.rollb = roll;
			if (this.phase === "finals") {
				if (this.rolla > this.rollb) {
					this.say(`**${this.defender.name} is eliminated!**`);
					this.defender.eliminated = true;
					setTimeout(() => this.nextRound(), 2 * 1000);
				}
				else if (this.rolla < this.rollb) {
					this.say(`**${this.current.name} is eliminated!**`);
					this.current.eliminated = true;
					setTimeout(() => this.nextRound(), 2 * 1000);
				}
				else {
					this.say(`**The rolls were the same.. Rerolling!**`);
					setTimeout(() => this.sayRolls(), 2 * 1000);
				}
			}
			else {
				if (this.rolla > this.rollb) {
					this.say(`**${this.current.name} narrowly escapes falling!**`);
					setTimeout(() => this.nextPlayer(), 2 * 1000);
				}
				else if (this.rolla < this.rollb) {
					if (this.phase === "step") this.say(`**Despite taking it easy, ${this.current.name} fell to their doom...**`);
					else this.say(`**${this.current.name} should've thought twice about rushing ahead, now they're gone...**`);
					this.saveroll += 5;
					this.current.eliminated = true;
					setTimeout(() => this.nextPlayer(), 2 * 1000);
				}
				else {
					this.say(`**The rolls were the same.. Rerolling!**`);
					setTimeout(() => this.sayRolls(), 2 * 1000);
				}
			}
		}
	}

	step(target, user) {
		let player = this.players[user.id];
		if (!player) return;
		if (player.id !== this.current.id) return;
		clearTimeout(this.timeout);
		this.say(`**${player.name} is taking a single step!**`);
		this.planks[player.id] += 1;
		this.phase = "step";
		this.steps.push(player.id);
		this.say("!pick break, no break");
	}

	leap(target, user) {
		let player = this.players[user.id];
		if (!player) return;
		if (player.id !== this.current.id) return;
		clearTimeout(this.timeout);
		this.say(`**${player.name} is leaping 2 planks ahead!**`);
		this.planks[player.id] += 2;
		this.phase = "leap";
		this.sayRolls();
	}

	destroy(target, user) {
		let player = this.players[user.id];

		let wins = [];
		for (let i in this.getRemainingPlayers()) {
			if (this.planks[i] >= this.max) wins.push(i);
		}

		if (this.phase !== "finals") return;
		if (user.id !== this.current.id) return;
		if (!player) return;
		if (toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let targPlayer = this.players[toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (!wins.includes(toId(target))) return user.say("That's not a valid target.");
		if (targPlayer === player) return this.say(">Attacking yourself.");
		clearTimeout(this.timeout);
		this.defender = targPlayer;
		this.say(`**${player.name} is attacking ${targPlayer.name}**`);
		this.sayRolls();
	}
}

exports.name = name;
exports.description = description;
exports.id = id;
exports.game = Bridge;
exports.aliases = ['thebridge', 'bridge'];
exports.commands = {
	step: "step",
	leap: "leap",
	destroy: "destroy"
}
exports.pmCommands = {
	step: false,
	leap: false,
	destroy: false
}