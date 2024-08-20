/*'use strict';

const name = "Killer in the Dark";
const id = Tools.toId(name);
const description = '__"Local serial killer escapes again. Citizens riot as bodies pile up."__ Game rules: https://sites.google.com/view/survivor-ps/themes/kitd';
class KITD extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.roles = ['Serial Killer', 'Citizen', 'Cop'];
		this.playerRoles = new Map();
		this.attacks = new Map();
		this.numAttacks = 0;
		this.order = [];
		this.hasKilled = new Map();
		this.skRevealed = new Map();
		this.accRoll = false;
	}

	onStart() {
		this.say("**Distributing the roles!**");
		this.playerOrder = this.shufflePlayers();
		this.playerRoles.set(this.playerOrder[0], 'Serial Killer');
		this.playerOrder[0].say("You were chosen as the **Serial Killer!**");
		this.playerOrder.shift();
		this.playerRoles.set(this.playerOrder[0], 'Cop');
		this.playerOrder[0].say("You were chosen as the **Cop!**");
		this.playerOrder.shift();
		this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
	}

	handoutRoles() {
		if (this.playerOrder.length === 0) {
			this.nextRound();
		}
		else {
			let player = this.playerOrder[0];
			let role = 'Citizen';
			this.playerRoles.set(player, role);
			player.say("You are a **" + role + "**!");
			this.playerOrder.shift();
			this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
		}
	}

	onNextRound() {
		this.attacks.clear();
		this.hasKilled.clear();
		this.skRevealed.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.order = [];
		if (this.getRemainingPlayerCount() === 2) {
			if (this.finals) {
				let player = this.curPlayer;
				this.curPlayer = this.oplayer;
				this.oplayer = player;
			}
			else {
				this.finals = true;
				this.num = Math.floor(Math.random() * 2);
				let lastPlayers = this.shufflePlayers(this.getRemainingPlayers());
				this.curPlayer = lastPlayers[this.num];
				this.oplayer = lastPlayers[1 - this.num];
			}
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving straight to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		}
		else {
			this.numAttacks = 0;
			this.say("**Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
			this.say("**Please pm me your attacks now with** ``" + Config.commandCharacter + "destroy [user]``");
			this.timeout = setTimeout(() => this.listRemaining(), 60 * 1000);
		}
	}

	listRemaining() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.attacks.has(player)) continue;
			waitings.push(player.name);
		}
		if (waitings.length > 0) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.attacks.has(player)) continue;
			player.eliminated = true;
			player.say("You were eliminated for not attacking!");
		}
		this.setOrder();
	}

	setOrder() {
		try {
			let hasStuff = {
				killer: false,
				cop: false,
			};
			for (let userID in this.players) {
				let player = this.players[userID];
				if (!player.eliminated) {
					let role = this.playerRoles.get(player);
					if (role === 'Serial Killer') {
						hasStuff.killer = true;
					} else if (role === 'Cop') {
						hasStuff.cop = true;
					}
				}
			}
			for (let i in hasStuff) {
				let citizens = Object.values(this.players).filter(pl => !pl.eliminated && this.playerRoles.get(pl) === 'Citizen');
				if (!hasStuff[i]) {
					let randCitizen = Tools.sample(citizens);
					let targetRole;
					if (i === 'killer') {
						targetRole = "Serial Killer";
					} else {
						targetRole = "Cop";
					}
					randCitizen.say("Your role was changed to the **" + targetRole + "**!");
					this.playerRoles.set(randCitizen, targetRole);
				}
			}
			let serKiller, cop;
			for (let userID in this.players) {
				let player = this.players[userID];
				let role = this.playerRoles.get(player);
				if (role === 'Serial Killer') {
					serKiller = player;
				} else if (role === 'Cop') {
					cop = player;
				}
			}
			let oldorder = this.order;
			this.order = [serKiller];
			for (let i = 0; i < oldorder.length; i++) {
				let player = oldorder[i];
				if (player !== serKiller && player !== cop) {
					this.order.push(player);
				}
			}
			if (!cop.eliminated) this.order.push(cop);
			this.handleAttacks();
		} catch (e) {
			this.mailbreak(e);
		}
	}

	handleAttacks() {
		if (this.order.length === 0) {
			this.nextRound();
			return;
		}
		this.curPlayer = this.order.shift();
		this.oplayer = this.attacks.get(this.curPlayer);
		let role1 = this.playerRoles.get(this.curPlayer);
		let role2 = this.playerRoles.get(this.oplayer);
		if (this.curPlayer.eliminated || this.oplayer.eliminated) {
			this.handleAttacks();
			return;
		}
		if (this.playerRoles.get(this.curPlayer) === 'Serial Killer') {
			this.say("The **Serial Killer** is attacking **" + this.oplayer.name + "**!");
		}
		else if (this.playerRoles.get(this.curPlayer) === 'Cop') {
			this.say("The **Cop** is attacking **" + this.oplayer.name + "**!");
		}
		else if (!this.skRevealed.get(this.oplayer)) {
			this.say("**???** is attacking **" + this.oplayer.name + "**!");
		}
		else {
			this.say("**" + this.curPlayer.name + "** is attacking **???!**")
		}
		this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
	}

	doPlayerAttack() {
		this.roll1 = 100;
		this.roll2 = 100;
		this.sayPlayerRolls();
	}

	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer) {
			if (this.playerRoles.get(this.curPlayer) === 'Serial Killer') {
				this.oplayer.eliminated = true;
				if (this.playerRoles.get(this.oplayer) === 'Cop') {
					this.say("The **Serial Killer** murders the cop who was **" + this.oplayer.name + "!**");
					this.say("A note was found on the cop's body.");
					this.say("__**" + this.curPlayer.name + "** is the **Serial Killer**!__");
					this.skRevealed.set(this.curPlayer, true);
				}
				else {
					this.say("The **Serial Killer** murders **" + this.oplayer.name + "!**");
				}
				this.hasKilled.set(this.curPlayer, true);
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			}
			else if (this.playerRoles.get(this.curPlayer) === 'Cop') {
				if (this.hasKilled.get(this.curPlayer) === true) {
					this.oplayer.eliminated = true;
					this.say("The **Cop** shoots **" + this.oplayer.name + "** for manslaughter!");
					if (this.playerRoles.get(this.oplayer === 'Serial Killer')) {
						this.say("**" + this.oplayer.name + "** was the Serial Killer! GG **" + this.curPlayer.name + "**!");
						this.elimAllExcept(this.curPlayer);
						this.end();
					}
					else {
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					}
				}
				else {
					this.say("!pick Success, Failure");
				}
			}
			else {
				this.say("!pick Success, Failure");
			}
		}
		else {
			this.say("**???** defended successfully!");
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
		}
	}

	handlePick(message) {
		if (this.playerRoles.get(this.curPlayer) === 'Cop') {
			if (message === "Failure") {
				this.say("**???** defended successfully!");
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			}
			else {
				if (this.playerRoles.get(this.oplayer) === 'Serial Killer') {
					this.say("The **Cop** shoots **" + this.oplayer.name + "**!");
					this.say("**" + this.oplayer.name + "** was the Serial Killer! GG **" + this.curPlayer.name + "**!");
					this.elimAllExcept(this.curPlayer);
					this.end();
				}
				else {
					this.say("The **Cop** shoots **" + this.oplayer.name + "**!");
					this.oplayer.eliminated = true;
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				}
			}
		}
		else {
			if (message === "Failure") {
				if (this.skRevealed.get(this.oplayer) === true) {
					this.say("**???** defended successfully!");
				}
				else {
					this.say("**" + this.oplayer.name + "** defended successfully!");
				}
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			}
			else {
				if (this.playerRoles.get(this.oplayer) === 'Serial Killer') {
					this.say("**???** murders **" + this.oplayer.name + "** who was the Serial Killer! GG **" + this.curPlayer.name + "**!");
					this.elimAllExcept(this.curPlayer);
					this.end();
				}
				else if (this.playerRoles.get(this.oplayer) === 'Cop') {
					this.oplayer.eliminated = true;
					this.say("**???** murders **" + this.oplayer.name + "** who was the Cop! **" + this.curPlayer.name + "** was revealed as the killer!");
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				}
				else {
					this.say("**???** murders **" + this.oplayer.name + "**!");
					this.oplayer.eliminated = true;
					this.hasKilled.set(this.curPlayer, true);
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				}
			}
		}
	}
	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (Tools.toId(target) === "constructor") return user.say("You cannot attack 'constructor'");
		let targetPlayer = this.players[Tools.toId(target)];
		if (!targetPlayer) return user.say("That player is not in the game!");
		if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.attacks.has(player)) return user.say("You have already attacked someone this round!");
		this.attacks.set(player, targetPlayer);
		this.order.push(player);
		player.say("You have attacked **" + targetPlayer.name + "**!");
		this.numAttacks++;
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.setOrder();
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = KITD;
exports.aliases = ['kitd'];
exports.commands = {
	destroy: "destroy",
}
exports.pmCommands = {
	destroy: true,
}
*/
