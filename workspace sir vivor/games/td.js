'use strict';

const name = 'Tower Defense';
const description = '**Tower Defense**: __Can you defend your tower? Who will be left standing when the dust settles? (Long Games)__ Game rules: http://survivor-ps.weebly.com/tower-defense.html';
const id = Tools.toId(name);

class TD extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.troops = new Map();
		this.rolla = null;
		this.rollb = null;
		this.curPlayer = null;
		this.oplayer = null;
	}

	onStart() {
		for (let userID in this.players) {
			let player = this.players[userID];
			this.troops.set(player, 50);
		}
		this.nextRound();
	}

	doPlayerAttack() {
		this.rolla = null;
		this.rollb = null;
		this.say("!roll 100");
		this.say("!roll 100");
	}

	onNextRound() {
		if (this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** didn't choose someone to attack and is eliminated!");
			this.curPlayer.eliminated = true;
		}
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			let playersLeft = this.getRemainingPlayers();
			let index = Math.floor(Math.random() * 2);
			this.curPlayer = playersLeft[Object.keys(playersLeft)[index]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1 - index]];
		this.say("Only **" + this.curPlayer.name + "[" + this.troops.get(this.curPlayer) + "]** and **" + this.oplayer.name + "[" + this.troops.get(this.oplayer) + "]** are left! Moving directly to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			let strs = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				strs.push(player.name + '[' + this.troops.get(player) + ']');
			}
			this.say("!pick " + strs.join(", "));
			this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
		}
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same! rerolling...");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			} else {
				let winPlayer, losePlayer;
				if (this.rolla > this.rollb) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
				} else {
					winPlayer = this.oplayer;
					losePlayer = this.curPlayer;
				}
				let loseTroops = this.troops.get(losePlayer);
				let diff = Math.abs(this.rolla - this.rollb);
				if (diff >= loseTroops) {
					this.say("**" + losePlayer.name + "** lost all of their troops!");
					losePlayer.eliminated = true;
				} else {
					this.say("**" + losePlayer.name + "** lost " + diff + " troop" + (diff > 1 ? "s" : "") + "!");
					this.troops.set(losePlayer, loseTroops - diff);
				}
				this.curPlayer = null;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			}
		}
	}

	handlePick(pick) {
		if (!this.curPlayer) {
			let index = pick.lastIndexOf('[');
			this.curPlayer = this.players[Tools.toId(pick.substr(0, index))];
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [player]``");
		}
	}

	attack(target, user) {
		if (!this.curPlayer) return;
		if (this.curPlayer.name !== user.name) return;
		let oplayer = this.players[Tools.toId(target)];
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
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = TD;
exports.aliases = ['td'];