'use strict';

let fishdict = {
	old: {
		"Wailmer": [40, 1],
		"Tentacool": [-20, 19],
		"Tympole": [10, 49],
		"Poliwag": [20, 68],
		"Dratini": [50, 69],
		"Bruxish": [30, 85],
		"Milotic": [40, 99],
		"Golden Magikarp": [80, 100]
	},
	good: {
		"Wailord": [50, 1],
		"Carvanha": [-35, 19],
		"Floatzel": [35, 49],
		"Milotic": [40, 68],
		"Pink Dratini": [75, 69],
		"Dragalge": [-35, 85],
		"Clawitzer": [60, 99],
		"Red Toxapex": [120, 100]
	},
	super: {
		"Kyogre": [100, 1],
		"Sharpedo": [-50, 19],
		"Mega Sharpedo": [false, 49],
		"Lumineon": [75, 68],
		"Dragonair": [120, 69],
		"Kabutops": [90, 85],
		"Omastar": [110, 99],
		"Red Gyarados": [150, 100]
	}
}
function getFish(rod, roll) {
	for (let i in fishdict[rod]) {
		if (fishdict[rod][i][1] >= roll) return [i, fishdict[rod][i][0]]
		
	}
}

const name = "Fishing";
const id = Tools.toId(name);
const description = "__Only the greatest fishermen win after catching two Poké Balls. Are you one of them?__ Game Rules: https://survivor-ps.weebly.com/fishing.html";

class Fishing extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.hasRolled = new Set();
		this.hasPicked = new Set();
		this.rolls = new Map();
		this.rods = new Map();
		this.canRod = false;
		this.fishNum = 0;
	}

	onStart() {
		for (let userID in this.players) {
			this.rolls.set(this.players[userID], 100);
		}
		this.nextRound();
	}

	onNextRound() {
		this.hasRolled.clear();
		if (this.round < 4) {
			this.say("/wall Beginning Round " + this.round + "!");
			this.beforeNextRound();
		} else {
			if (this.round === 4) {
				this.say("It is now time for Hunger Games Spotlight!");
			}
			if (this.curPlayer) {
				this.curPlayer.eliminated = true;
				this.say("**" + this.curPlayer.name + "** did not choose anybody to attack!");
				this.curPlayer = null;
			}
			this.say("!pick " + Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name + "[" + this.rolls.get(pl) + "]").join(", "));
		}
	}

	beforeNextRound() {
		if (this.round < 4) {
			this.hasPicked.clear();
			this.canRod = true;
			this.say("**PL: " + Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name + "[" + this.rolls.get(pl) + "]").join(", ") + "! Pick your rod using ``.choose [old/good/super]``**!");
			this.timeout = setTimeout(() => this.listWaiting(), 45 * 1000);
		} else {
			this.nextRound();
		}
	}

	doNextPick() {
		let availPlayers = Object.values(this.players).filter(pl => !pl.eliminated && !this.hasRolled.has(pl));
		if (availPlayers.length === 0) {
			this.curPlayer = null;
			this.nextRound();
		} else if (availPlayers.length === 1) {
			this.curPlayer = availPlayers[0];
			this.say("Rolling for **" + this.curPlayer.name + "**'s next catch!");
			fishNum++;
			let cmd = fishNum % 2 === 0 ? "!roll" : "dice";
			this.say(cmd + " 100");
		} else {
			this.say("!pick __" + Object.values(this.players).filter(pl => !pl.eliminated && !this.hasRolled.has(pl)).map(pl => pl.name).join("__, __") + "__");
		}
	}

	doAttack() {
		this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
		this.sayRolls();
	}

	sayRolls() {
		this.rolla = null;
		this.rollb = null;
		this.say("!roll " + this.rolls.get(this.curPlayer));
		this.say("!dice " + this.rolls.get(this.oplayer));	
	}

	handlePick(message) {
		this.curPlayer = this.getPlayer(message);
		if (this.round < 4) {
			this.say("Rolling for **" + this.curPlayer.name + "**'s next catch!");
			this.say("!roll 100");
		} else {
			if (this.getRemainingPlayerCount() === 2) {
				this.oplayer = Object.values(this.players).filter(pl => !pl.eliminated && pl !== this.curPlayer)[0];
				this.doAttack();
			} else {
				this.say("**" + this.curPlayer.name + "**, you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [user]``.");
				this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
			}
		}
	}

	handleRoll(roll) {
		if (this.round < 4) {
			let fish = getFish(this.rods.get(this.curPlayer), roll);
			let curRoll = this.rolls.get(this.curPlayer);
			curRoll += fish[1];
			this.say("**" + this.curPlayer.name + "** reels in **" + fish[0] + "**!");
			if (fish[1] === false) {
				this.curPlayer.eliminated = true;
				this.say("**" + this.curPlayer.name + "** is eliminated!");
			} 
			else {
				this.curPlayer.say("You gained **" + fish[1] + "** to your roll!");
				this.rolls.set(this.curPlayer, curRoll);
				this.hasRolled.add(this.curPlayer);
			}
			this.timeout = setTimeout (() => this.doNextPick(), 5 * 1000); 
		} else if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same, rerolling...");
				this.timeout = setTimeout(() => this.sayRolls(), 5 * 1000);
			} else {
				let winPlayer, losePlayer;
				if (this.rolla > this.rollb) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
				} else {
					winPlayer = this.oplayer;
					losePlayer = this.curPlayer;
				}
				this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
				losePlayer.eliminated = true;
				this.curPlayer = null;
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			}
		}
	}

	listWaiting() {
		this.say("Waiting on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.rods.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.rods.has(player)) {
				player.eliminated = true;
				player.say("You didn't pick a rod and are eliminated!");
			}
		}
		this.doNextPick();
	}

	attack(target, user) {
		let player = this.players[user.id];
		if (!player || !this.curPlayer || player !== this.curPlayer) return;
		if (Tools.toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let targPlayer = this.players[Tools.toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (targPlayer === this.curPlayer) return this.say(">Attacking yourself.");
		this.oplayer = targPlayer;
		clearTimeout(this.timeout);
		this.doAttack();
	}

	choose(target, user) {
		let player = this.players[user.id];
		if (!this.canRod || !player || player.eliminated) return;
		target = toId(target);
		if (this.rods.has(player)) return user.say("You have already picked a rod.");
		if (!['old', 'good', 'super'].includes(target)) return user.say('Usage: ``.choose old/good/super``');
		this.rods.set(player, target);
		this.hasPicked.add(player);
		user.say('You have picked the ``' + target + ' rod``!');
		if (this.rods.size === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.doNextPick();
		}
	}
}

exports.game = Fishing;
exports.name = name;
exports.id = id;
exports.description = description;
exports.commands = {
	"choose": "choose"
};
exports.pmCommands = {
	"choose": true
}

