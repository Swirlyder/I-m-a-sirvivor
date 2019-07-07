'use strict';

function getFish(roll) {
	if (roll === 1) {
		return {
			name: "Kyogre",
			value: 100,
		};
	} else if (roll === 6 || roll === 66) {
		return {
			name: "Random Nugget",
			value: 80,
		};
	} else if (roll === 69) {
		return {
			name: "Shiny Gyarados",
			value: 125,
		};
	} else if (roll === 100) {
		return {
			name: "Golden Magikarp",
			value: 150,
		};
	} else if (roll < 11) {
		return {
			name: "Feebas",
			value: 2,
		};
	} else if (roll < 22) {
		 return {
			name: "Magikarp",
			value: 5,
		};
	} else if (roll < 33) {
		return {
			name: "Goldeen",
			value: 10,
		};
	} else if (roll < 44) {
		return {
			name: "Seaking",
			value: 15,
		};
	} else if (roll < 55) {
		return {
			name: "Alomomola",
			value: 20,
		};
	} else if (roll < 66) {
		return {
			name: "Stunfisk",
			value: 25,
		};
	} else if (roll < 75) {
		 return {
			name: "Basculin Blue",
			value: 30,
		};
	} else if (roll < 78) {
		return {
			name: "Broken Pokeball",
			value: -34,
		};
	} else if (roll < 90) {
		return {
			name: "Basculin Red",
			value: 35,
		};
	} else {
		return {
			name: "Qwilfish",
			value: 50,
		};
	}
}

const name = "Fishing";
const id = Tools.toId(name);
const description = "__Only the greatest fishermen win after catching two Poké Balls. Are you one of them? Theme by Fuzzytales__ Game Rules: https://survivor-ps.weebly.com/fishing.html";

class Fishing extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.hasRolled = new Set();
		this.rolls = new Map();
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
			this.timeout = setTimeout(() => this.doNextPick(), 5 * 1000);
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
			let fish = getFish(roll);
			let curRoll = this.rolls.get(this.curPlayer);
			curRoll += fish.value;
			this.say("**" + this.curPlayer.name + "** reels in **" + fish.name + "**!");
			this.curPlayer.say("You gained **" + fish.value + "** to your roll!");
			this.rolls.set(this.curPlayer, curRoll);
			this.hasRolled.add(this.curPlayer);
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
}

exports.game = Fishing;
exports.name = name;
exports.id = id;
exports.description = description;
exports.commands = [];

