'use strict';

const name = 'Hunger Games Spotlight';
const description = '**Hunger Games Spotlight**: __Classic but with a twist: No alliances.__ Game rules: http://survivor-ps.weebly.com/hunger-games.html';
const id = Tools.toId(name);

class HGS extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.curPlayer = null;
		this.oplayer = null;
		this.rolla = null;
		this.rollb = null;
		this.freeJoin = false;
	}

	onStart() {
		try {
			this.nextRound();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	onNextRound() {
		try {
			this.oplayer = null;
			this.rolla = null;
			this.rollb = null;
			if (this.curPlayer) {
				this.say(this.curPlayer.name + " didn't attack anyone and is eliminated!");
				this.curPlayer.eliminated = true;
			}
			this.curPlayer = null;
			if (this.getRemainingPlayerCount() === 1) {
				this.end();
				return;
			} else if (this.getRemainingPlayerCount() === 2) {
				let playersLeft = this.getRemainingPlayers();
				this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
				this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
				this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
				this.timeout = setTimeout(() => this.handleAttack(), 5 * 1000);
			} else {
				let names = [];
				for (let userID in this.players) {
					if (this.players[userID].eliminated) continue;
					names.push(this.players[userID].name);
				}
				this.say("!pick " + names.join(", "));
				this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	handleAttack() {
		try {
			if (!this.oplayer) {
				this.say("**" + this.curPlayer.name + "** didn't choose a player and is eliminated!");
				delete this.players[this.curPlayer.id];
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			} else {
				this.say("!roll 100");
				this.say("!roll 100");
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	handleRoll(roll) {
		try {
			if (!this.rolla) {
				this.rolla = Math.floor(roll);
			} else if (!this.rollb) {
				this.rollb = Math.floor(roll);
				if (this.rolla !== this.rollb) {
					if (this.rolla < this.rollb) {
						this.say("**" + this.oplayer.name + "** beats up **" + this.curPlayer.name + "**!");
						this.players[this.curPlayer.id].eliminated = true;
					} else if (this.rolla > this.rollb) {
						this.say("**" + this.curPlayer.name + "** beats up **" + this.oplayer.name + "**!");
						this.players[this.oplayer.id].eliminated = true;
					}
					this.curPlayer = null;			
					this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
				} else {
					this.say("The rolls were the same! rerolling...");
					this.rolla = null;
					this.rollb = null;
					this.handleAttack();
				}
				this.timeout = setTimeout(() => this.handleAttack(), 90 * 1000);
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	handlePick(message) {
		try {
			if (!this.curPlayer) {
				this.curPlayer = this.players[Tools.toId(message)];
				this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [player]``");
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}

	attack(target, user) {
		try {
			if (!this.curPlayer) return;
			if (this.curPlayer.name !== user.name) return;
			let oplayer = this.players[Tools.toId(target)];
			if (!oplayer || oplayer.eliminated) return;
			if (oplayer.name === this.curPlayer.name) {
				this.say(">Attacking yourself.");
				return;
			}
			this.say("**" + this.curPlayer.name + "** has chosen to attack **" + oplayer.name + "**!");
			clearTimeout(this.timeout);
			this.oplayer = oplayer;
			this.timeout = setTimeout(() => this.handleAttack(), 5 * 1000);
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.end();
			return;
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = HGS;
exports.aliases = ["hgs"];