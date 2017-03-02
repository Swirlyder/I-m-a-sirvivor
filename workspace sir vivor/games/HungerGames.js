'use strict';

const name = 'Hunger Games Spotlight';
const description = '__Classic but with a twist: No alliances.__ Game rules: http://survivor-ps.weebly.com/hunger-games.html';
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
			this.mailbreak();
			this.end();
			return;
		}
	}

	handleAttack() {
		try {
			if (!this.oplayer) {
				this.say("**" + this.curPlayer.name + "** didn't choose a player and is eliminated!");
				this.curPlayer.eliminated = true;
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			} else {
				this.roll1 = 100;
				this.roll2 = 100;
				this.sayPlayerRolls();
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}
	handleWinner(winPlayer, losePlayer) {
		this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
		losePlayer.eliminated = true;
		this.curPlayer = null;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	handlePick(message) {
		if (!this.curPlayer) {
			this.curPlayer = this.players[Tools.toId(message)];
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [player]``");
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
			this.mailbreak();
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
exports.modes = ['Golf'];