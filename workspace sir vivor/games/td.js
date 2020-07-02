'use strict';

const name = 'Tower Defense';
const description = '__Can you defend your tower? Who will be left standing when the dust settles?__ Game rules: https://sites.google.com/view/survivor-ps/themes-and-events/survivor-themes/tower-defense';
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
			if (this.variation) {
				this.troops.set(player, 100);
			} else {
				this.troops.set(player, 50);
			}
		}
		this.nextRound();
	}

	onNextRound() {
		if (this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** didn't choose someone to attack and is eliminated!");
			this.curPlayer.eliminated = true;
			this.curPlayer = null;
		}
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			if (this.finals) {
				this.num = 1 - this.num;
			} else {
				this.finals = true;
				this.num = Math.floor(Math.random() * 2)
			}
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[this.num]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1 - this.num]];
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

	doPlayerAttack() {
		this.rolla = null;
		this.rollb = null;
		if (this.variation) {
			this.roll1 = 200 - this.troops.get(this.curPlayer);
			this.roll2 = 200 - this.troops.get(this.oplayer);
		} else {
			this.roll1 = 100;
			this.roll2 = 100;
		}
		this.sayPlayerRolls();
	}
	
	handleWinner(winPlayer, losePlayer) {
		let diff = Math.abs(this.rolla - this.rollb);
		let loseTroops = this.troops.get(losePlayer);
		if (diff >= loseTroops) {
			this.say("**" + losePlayer.name + "** lost all of their troops!");
			losePlayer.eliminated = true;
		} else {
			this.say("**" + losePlayer.name + "\'s** tower  lost " + diff + "HP!");
			this.troops.set(losePlayer, loseTroops - diff);
		}
		this.curPlayer = null;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
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
		if (Tools.toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
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
exports.modes = ['Golf', 'Roll Switch'];
exports.commands = {
	attack: "attack",
}
exports.variations = [
	{
		name: "Berserk Tower Defense",
		aliases: ["btd"],
		variation: "Berserk",
		variationAliases: ["b"],
	}
]
