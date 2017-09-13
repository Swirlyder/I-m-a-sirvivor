'use strict';

const name = "Lego Tower Defense";
const id = Tools.toId(name);
const description = "https://docs.google.com/document/d/13MJ8zaUxrjDRNeYNbi7vGM3P7FOPYnrgT2uk5LLQzqw/edit";

class LegoTD extends Games.Game {
	constructor(room) {
		super(room);
		this.id = id;
		this.name = name;
		this.description = description;
		this.stats = new Map();
		this.numChoose = 0;
	}

	onStart() {
		this.numBlocks = Math.floor(Math.random() * 3) + 5;
		this.say("**" + this.getPlayerNames() + "**. PM me your attack/defense block distribution of " + this.numBlocks + " blocks with ``" + Config.commandCharacter + "choose [attack], [defense]``");
		this.timeout = setTimeout(() => this.listWaiting(), 60 * 1000);
	}

	listWaiting() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!this.stats.has(player) && !player.eliminated) waitings.push(player.name);
		}
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}
	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!this.stats.has(player) && !player.eliminated) {
				player.eliminated = true;
				player.say("You were eliminated for providing your distribution!");
			}
		}
		this.nextRound();
	}

	getPlayerNames(players) {
		if (!players) players = this.players;
		let names = [];
		for (let userID in players) {
			let player = this.players[userID];
			let stats = this.stats.get(player);
			if (stats) {
				names.push(player.name + " [" + stats[0] + "/" + stats[1] + "]");
			} else {
				names.push(player.name);
			}
		}
		return names.join(", ");
	}
	
	onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
		}
		if (this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** didn't choose anyone to attack and is eliminated!");
			this.curPlayer.eliminated = true;
		}
		this.curPlayer = null;
		this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
	}

	handlePick(message) {
		if (!this.curPlayer) {
			message = message.substr(0, message.lastIndexOf("["));
			this.curPlayer = this.players[Tools.toId(message)];
			if (this.getRemainingPlayerCount() === 2) {
				let remaining = this.getRemainingPlayers();
				for (let userID in remaining) {
					let player = this.players[userID];
					if (player !== this.curPlayer) this.oplayer = player;
				}
				this.handleAttacks();
			} else {
				this.say("**" + this.curPlayer.name + "**, who do you wish to attack?");
				this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
			}
		}
	}
	
	handleAttacks() {
		this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
		let attackStat = this.stats.get(this.curPlayer)[0];
		let defStat = this.stats.get(this.oplayer)[1];
		this.roll1 = 50*attackStat;
		this.roll2 = 50*defStat;
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer) {
			let stats = this.stats.get(losePlayer);
			stats[1]--;
			if (stats[1] === 0) {
				this.say("**" + losePlayer.name + "** loses one defense block and is eliminated!");
				losePlayer.eliminated = true;
			} else {
				this.say("**" + losePlayer.name + "** loses one defense block!");
			}
		} else {
			let stats = this.stats.get(losePlayer);
			stats[0]--;
			if (stats[0] === 0) {
				this.say("**" + losePlayer.name + "** loses one attack block and is eliminated!");
				losePlayer.eliminated = true;
			} else {
				this.say("**" + losePlayer.name + "** loses one attack block!");
			}
		}
		this.curPlayer = null;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}
	choose(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (this.stats.has(player)) return user.say("You have already chosen your stat distribution!");
		let split = target.split(",");
		if (split.length < 2) return user.say("You must specify both your attack and defense blocks");
		let attackBlocks = parseInt(split[0]);
		if (!attackBlocks || attackBlocks < 1) return user.say("You must have at least one attack block");
		let defenseBlocks = parseInt(split[1]);
		if (!defenseBlocks || defenseBlocks < 1) return user.say("You must have at least one defense block");
		if ((attackBlocks + defenseBlocks) !== this.numBlocks) return user.say("You must have a total of " + this.numBlocks + " blocks.");
		this.stats.set(player, [attackBlocks, defenseBlocks]);
		user.say("You have chosen your distribution as **" + attackBlocks + "** attack blocks and **" + defenseBlocks + "** defense blocks!");
		this.numChoose++;
		if (this.numChoose === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
	}

	attack(target, user) {
		let player = this.players[user.id];
		if (!player || !this.curPlayer || this.curPlayer.id !== player.id) return;
		if (Tools.toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let attackedPlayer = this.players[Tools.toId(target)];
		if (!attackedPlayer) return user.say("That player is not in the game!");
		if (attackedPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.curPlayer.id === attackedPlayer.id) return this.say(">Attacking yourself.");
		this.oplayer = attackedPlayer;
		clearTimeout(this.timeout);
		this.handleAttacks();
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = LegoTD;
exports.aliases = ['legotd'];
exports.commands = {
	choose: "choose",
	attack: "attack",
};
exports.pmCommands = {
	choose: true
};