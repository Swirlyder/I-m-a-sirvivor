'use strict';

const name = "Risk";
const description = "**Risk**: __Pssh, who needs an army when you have a hulk__? Game rules: http://survivor-ps.weebly.com/risk.html";
const id = Tools.toId(name);
const nations = {
	pt: {name: "the Primitive Tribe", aliases: ["pt", "primitivetribe", "theprimitivetribe"], armies: 25, gain: 10},
	in: {name: "the Island Nation", aliases: ["in", "islandnation", "theislandnation"], armies: 50, gain: 20},
	pr: {name: "the Populous Republic", aliases: ["pr", "populousrepublic", "thepopulousrepublic", "poprep"], armies: 100, gain: 50},
	nwca: {name: "the Nuclear-War Crazed Autocracy", aliases: ["nwca", "nuclearwarcrazedautocracy", "thenuclearwarcrazedautocracy"], armies: 150, gain: 70},
	russia: {name: "Russia", aliases: ["russia"], armies: 200, gain: 100},
};
class Risk extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.troops = new Map();
		this.attacks = new Map();
		this.rolla = null;
		this.rollb = null;
		this.canLateJoin = true;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.troops.set(player, 100);
		}
		this.doingCountry = true;
		this.nextRound();
	}

	onJoin(user) {
		if (this.started && this.round > 2) {
			user.say("Too late to join, rip!");
			this.players[user.id].eliminated = true;
		} else if (this.started) {
			user.say("You have latejoined the game of risk!");
		}
	}

	onNextRound() {
		this.canAttack = true;
		this.attacks.clear();
		this.numAttacks = 0;
		if (this.getRemainingPlayerCount() === 0) {
			this.say("Everyone was mked!");
			this.end();
			return;
		}
		if (this.round < 4) {
			this.order = [];
			let strs = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				strs.push(player.name + "(" + this.troops.get(player) + ")");
			}
			this.say("**Players: (" + this.getRemainingPlayerCount() + ")**:" + strs.join(", "));
			this.say("PM me which country you would like to attack! **Command:** ``" + Config.commandCharacter + "destroy [name]``");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		} else {
			if (this.round === 4) {
				this.doingCountry = false;
				this.say("It is now time for hunger games, with the number of troops you earned from before!");
			}
			if (this.attackPlayer) {
				this.say(this.curPlayer.name + " didn't attack anyone and is eliminated!");
				this.curPlayer.eliminated = true;
			}
			if (this.getRemainingPlayerCount() === 1) {
				let winPlayer = this.getLastPlayer();
				this.say("**Winner:** " + winPlayer.name);
				this.end();
				return;
			} else if (this.getRemainingPlayerCount() === 2) {
				this.rolla = null;
				this.rollb = null;
				let playersLeft = this.getRemainingPlayers();
				this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
				this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
				this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			} else {
				this.curPlayer = null;
				this.oplayer = null;
				this.rolla = null;
				this.rollb = null;
				let strs = [];
				for (let userID in this.players) {
					let player = this.players[userID];
					if (player.eliminated) continue;
					strs.push(player.name + "(" + this.troops.get(player) + ")");
				}
				this.say("!pick " + strs.join(", "));
				this.attackPlayer = true;
				this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
			}
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
		for (let userID in this.players) {
			let player = this.players[userID];
			let curAttack = this.attacks.get(player);
			if (!curAttack) {
				player.say("You didn't attack a country this round and were eliminated!");
				this.players[userID].eliminated = true;
			}
		}
		if (this.getRemainingPlayerCount() === 1) {
			let winPlayer = this.getLastPlayer();
			this.say("Since people were modkilled, " + winPlayer.name + " won!");
			this.end();
			return;
		}
		this.handleAttacks();
	}

	handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			this.rolla = null;
			this.rollb = null;
			this.curPlayer = this.order[0];
			this.attackedCountry = this.attacks.get(this.curPlayer);
			this.order.splice(0, 1);
			this.say("**" + this.curPlayer.name + "** is attacking " + this.attackedCountry.name + "!");
			this.timeout = setTimeout(() => this.doCountryAttack(), 5 * 1000);
		}
	}

	doCountryAttack() {
		let curTroops = this.troops.get(this.curPlayer);
		let enemyTroops = this.attackedCountry.armies;
		this.say("!roll " + curTroops);
		this.say("!roll " + enemyTroops);
	}

	doPlayerAttack() {
		let troops1 = this.troops.get(this.curPlayer);
		let troops2 = this.troops.get(this.oplayer);
		this.say("!roll " + troops1);
		this.say("!roll " + troops2);
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.doingCountry) {
				if (this.rolla < this.rollb) {
					this.say("**" + this.curPlayer.name + "** lost to " + this.attackedCountry.name + ". Their troops were reset to 100.");
					this.troops.set(this.curPlayer, 100);
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				} else if (this.rolla > this.rollb) {
					this.say("**" + this.curPlayer.name + "** defeats " + this.attackedCountry.name + " and gains " + this.attackedCountry.gain + " troops!");
					let troops = this.troops.get(this.curPlayer);
					troops += this.attackedCountry.gain;
					this.troops.set(this.curPlayer, troops);
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				} else {
					this.say("The rolls were a tie! Rerolling...");
					this.rolla = null;
					this.rollb = null;
					this.doCountryAttack();
				}
			} else {
				this.rollb = Math.floor(roll);
				if (this.rolla !== this.rollb) {
					if (this.rolla < this.rollb) {
						this.say("**" + this.oplayer.name + "** beats up **" + this.curPlayer.name + "**!");
						this.players[this.curPlayer.id].eliminated = true;
					} else if (this.rolla > this.rollb) {
						this.say("**" + this.curPlayer.name + "** beats up **" + this.oplayer.name + "**!");
						this.players[this.oplayer.id].eliminated = true;
					}
					this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
				} else {
					this.say("The rolls were the same! rerolling...");
					this.rolla = null;
					this.rollb = null;
					this.doPlayerAttack();
				}
			}
		}
	}

	handlePick(message) {
		if (!this.curPlayer) {
			let parenIndex = message.indexOf("(");
			this.curPlayer = this.players[Tools.toId(message.substr(0, parenIndex))];
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [player]``");
		}
	}

	attack(target, user) {
		if (!this.curPlayer) return;
		if (this.curPlayer.name !== user.name) return;
		let otherUser = Users.get(target);
		if (!otherUser) return;
		let oplayer = this.players[otherUser.id];
		if (!oplayer || oplayer.eliminated) return;
		if (oplayer.name === this.curPlayer.name) {
			this.say(">Attacking yourself.");
			return;
		}
		this.attackPlayer = false;
		this.say("**" + this.curPlayer.name + "** has chosen to attack **" + oplayer.name + "**!");
		clearTimeout(this.timeout);
		this.oplayer = oplayer;
		this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let curAttack = this.attacks.get(player);
		if (curAttack) return;
		let country = null;
		target = Tools.toId(target);
		for (let countryID in nations) {
			let curCountry = nations[countryID];
			if (curCountry.aliases.indexOf(target) !== -1) {
				country = curCountry;
				break;
			}
		}
		if (!country) {
			user.say("That is not a valid country!");
			return;
		}
		this.attacks.set(player, country);
		user.say("You have attacked " + country.name + "!");
		this.order.push(player);
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}
}

exports.game = Risk;
exports.name = name;
exports.id = id;
exports.description = description;
exports.aliases = [];