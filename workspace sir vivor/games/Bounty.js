'use strict';

const name = "Bounty";
const id = Tools.toId(name);
const description = '__Who is the bounty? Thats your mission to find out and capture them to win this game mode!__ Game rules: http://survivor-ps.weebly.com/bounty.html'
class Bounty extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.roles = ['Private Eye', 'Bomb', 'LoudMouth', 'Weapons Dealer', 'Trapper', 'The Medium', 'Heavy', 'Goo', 'Misinformer', 'Sleeping'];
		this.rolls = new Map();
		this.playerRoles = new Map();
		this.attacks = new Map();
		this.playerActions = new Map();
		this.numAttacks = 0;
		this.hasBeenAttacked = new Map();
		this.order = [];
		this.blocked = new Map();
		this.trappersUsed = new Map();
		this.reveals = [];
	}

	onStart() {
		this.say("Now handing out roles!");
		if (this.getRemainingPlayerCount() > 9) {
			this.roles.push('Decoy');
		}
		for (let userID in this.players) {
			this.hasBeenAttacked.set(this.players[userID], false);
		}
		this.playerOrder = this.shufflePlayers();
		this.playerRoles.set(this.playerOrder[0], 'Bounty');
		this.playerOrder[0].say("You were chosen as the **Bounty!**");
		this.rolls.set(this.playerOrder[0], 100);
		this.playerOrder.shift();
		this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
	}

	handoutRoles() {
		try {
			if (this.playerOrder.length === 0) {
				this.nextRound();
			} else {
				let player = this.playerOrder[0];
				let role = Tools.sample(this.roles);
				this.playerRoles.set(player, role);
				player.say("Your role is the **" + role + "**!");
				if (role === "Weapons Dealer") {
					this.rolls.set(player, 115)
				} else {
					this.rolls.set(player, 100);
				}
				this.playerOrder.shift();
				this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}

	onNextRound() {
		this.blocked.clear();
		this.attacks.clear();
		this.trappersUsed.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.order = [];
		this.reveals = [];
		if (this.getRemainingPlayerCount() === 2) {
			if (this.finals) {
				let player = this.curPlayer;
				this.curPlayer = this.oplayer;
				this.oplayer = player;
			} else {
				this.finals = true;
				this.num = Math.floor(Math.random() * 2);
				let lastPlayers = this.shufflePlayers(this.getRemainingPlayers());
				this.curPlayer = lastPlayers[this.num];
				this.oplayer = lastPlayers[1 - this.num];
			}
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving straight to attacks.");
			this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
		} else {
			this.say("**Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
			this.say("Please pm me your actions (if applicable) and attacks now with ``" + Config.commandCharacter + "destroy [user]``, ``" + Config.commandCharacter + "action effect``. You can also pm me ``" + Config.commandCharacter + "actions`` to see the actions");
			this.timeout = setTimeout(() => this.listRemaining(), 45 * 1000);
		}
	}

	listRemaining() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.attacks.has(player) || (this.playerRoles.get(player) === "The Medium" && this.round === 1)) continue;
			let role = this.playerRoles.get(player);
			if (role === "The Medium" && this.round === 1) continue;
			waitings.push(player.name);
		}
		if (waitings.length > 0) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 15 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.attacks.has(player) || (this.roles.get(player) === "The Medium" && this.round === 1)) continue;
			player.eliminated = true;
			player.say("You were eliminated for not providing an action this round!");
		}
		this.reveal();
	}

	reveal() {
		try {
			this.canAttack = false;
			if (this.reveals.length === 0) {
				this.handleAttacks();
			} else {
				let pair = this.reveals.shift();
				this.say("**" + pair[0].name + "** was revealed to be the **" + pair[1] + "**!");
				this.timeout = setTimeout(() => this.reveal(), 5 * 1000);
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}
	
	doPlayerAttack() {
		try {
			let role1 = this.playerRoles.get(this.curPlayer);
			if (role1 === "Sleeping") {
				this.roll1 = 125;
			} else if (role1 === "Heavy") {
				this.roll1 = 120;
			} else {
				this.roll1 = this.rolls.get(this.curPlayer);
			}
			this.roll2 = this.rolls.get(this.oplayer);
			this.sayPlayerRolls();
		} catch (e) {
			this.mailbreak(e);
		}
	}
	
	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer) {
			let start = ("**" + this.curPlayer.name + "** "+ Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "**");
			let role1 = this.playerRoles.get(this.curPlayer), role2 = this.playerRoles.get(this.oplayer);
			this.oplayer.eliminated = true;
			if (role2 === "Bomb") {
				if (role1 === "Bounty") {
					for (let i in this.players) {
						if (i !== this.oplayer.id) {
							this.players[i].eliminated = true;
						}
					}				
					this.start(", who was the bomb, but **" + this.curPlayer.name + "** was the bounty! GG **" + this.oplayer.name + "**!");
					this.end();
					return;
				} else {
					this.say(start + ", but **" + this.oplayer.name + "** was also a bomb! RIP them both");
				}
				this.curPlayer.eliminated = true;
				this.oplayer.eliminated = true;
			} else if (role2 === "Bounty") {
				this.say(start + ", who was the bounty! GG!");
				for (let i in this.players) {
					if (i !== this.curPlayer.id) {
						this.players[i].eliminated = true;
					}
				}
				this.end();
				return;
			} else if (role2 === "Weapons Dealer") {
				this.say(start + ", who was the weapons dealer! **" + this.curPlayer.name + "'s** roll is now increased!");
				this.rolls.set(this.curPlayer, 115);
			} else if (role2 === "LoudMouth") {
				this.say(start + ", who was the Loud Mouth! They reveal **" + this.curPlayer.name + "'s** ability to be the **" + role1 + "**!");
			} else if (role2 === "Decoy") {
				this.say(start, ", who was the decoy! GG to the bounty!");
				this.end();
				return;
			} else if (role2 === "Goo") {
				this.say(start + ", who was goo! **" + this.curPlayer.name + "** turns into the goo!");
				if (role1 !== "Bounty") this.playerRoles.set(this.curPlayer, "Goo");
			} else {
				this.say(start + " who was the **" + role2 + "**!");
			}
		} else {
			this.say("**" + winPlayer.name + "** defended successfully!");
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	handleAttacks() {
		try {
			if (this.order.length === 0) {
				this.nextRound();
			} else {
				this.curPlayer = this.order.shift();
				this.oplayer = this.attacks.get(this.curPlayer);
				let role1 = this.playerRoles.get(this.curPlayer);
				if (role1 === 'Heavy' && this.order.length !== 0) {
					this.order.push(this.curPlayer);
				} else {
					if (this.curPlayer.eliminated || this.oplayer.eliminated) {
						this.handleAttacks();
					} else {
						if (role1 === 'Sleeping' && !this.hasBeenAttacked.get(this.curPlayer)) {
							this.handleAttacks();
						} else {
							if (this.blocked.has(this.curPlayer)) {
								this.say("**" + this.curPlayer.name + "'s** attack was blocked by the trapper!");
								this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
							} else {
								this.hasBeenAttacked.set(this.oplayer, true);
								if (role1 === "The Medium") {
									if (this.playerActions.has(this.curPlayer)) {
										let attackedPlayer = this.playerActions.get(this.curPlayer);
										if (attackedPlayer.eliminated) this.rolls.set(this.curPlayer, 120);
									}
								}
								this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
								this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
							}
						}
					}
				}
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}
	
	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let targetPlayer = this.players[Tools.toId(target)];
		if (!targetPlayer) return user.say("That player is not in the game!");
		if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (targetPlayer === player) return user.say("You can't attack yourself.");
		if (this.attacks.has(player)) return user.say("You have already attacked someone this round!");
		let role = this.playerRoles.get(player);
		if (role === "The Medium" && this.round === 1) {
			return user.say("You are The Medium and so can't attack on the first round!");
		}
		this.attacks.set(player, targetPlayer);
		this.order.push(player);
		player.say("You have attacked **" + targetPlayer.name + "**!");
	}

	actions(target, user) {
		let actions = {
			"Private Eye": "Once per game, at the beginning of a turn, they can choose a player and reveal his role in chat. Usage: <code>" + Config.commandCharacter + "action [user]</code>",
			"Trapper": "Chooses one person every turn and blocks their attack. Usage: <code>" + Config.commandCharacter + "action [user]</code>",
			"Misinformer": "Once per game, at the beginning of a turn, they can choose a player and a role to say in chat. Usage: <code>" + Config.commandCharacter + "action [user], [role]</code>",
			"The Medium": "At the start of the game they choose one person. If that person dies, the medium will roll 120 for the rest of the game. [Cannot Attack Turn 1]. Usage: <code>" + Config.commandCharacter + "action [player]</code>",
		}
		let start = "<div class = \"infobox\"><html>";
		for (let name in actions) {
			start += "<b><u>" + name + "</u></b>: " + actions[name] + "<br><br>";
		}
		start += "</html></div>";
		Rooms.get('survivor').say("/pminfobox " + user.id + "," + start);
	}

	action(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let role = this.playerRoles.get(player);
		if (role === "Trapper") {
			if (this.trappersUsed.has(player)) {
				return user.say("You've already used your action this turn.");
			}
			let targetPlayer = this.players[Tools.toId(target)];
			if (!targetPlayer) return user.say("That player is not in the game!");
			if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
			this.trappersUsed.set(player, targetPlayer);
			this.blocked.set(targetPlayer, true);
			return user.say("You have blocked the attack of **" + targetPlayer.name + "**!");
		} else if (role === "Misinformer") {
			if (this.playerActions.has(player)) {
				return user.say("You've already used your action.");
			}
			let split = target.split(",");
			if (split.length !== 2) {
				return user.say("Usage: ``" + Config.commandCharacter + "action [name], [role]");
			}
			let targetPlayer = this.players[Tools.toId(split[0])];
			if (!targetPlayer) return user.say("That player is not in the game!");
			if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
			let targetRole = null;
			let roles = this.roles.slice();
			roles.push("Decoy");
			roles.push("Bounty");
			for (let i = 0, len = roles.length; i < len; i++) {
				if (Tools.toId(roles[i]) === Tools.toId(split[1])) {
					targetRole = roles[i];
					break;
				}
			}
			if (!targetRole) return user.say("Invalid role.");
			this.reveals.push([targetPlayer, targetRole]);
			this.playerActions.set(player, targetPlayer);
			return user.say("You have revealed the role of **" + targetPlayer.name + "** to be **" + targetRole + "**!");
		} else if (role === "Private Eye") {
			if (this.playerActions.has(player)) {
				return user.say("You've already used your action.");
			}
			let targetPlayer = this.players[Tools.toId(target)];
			if (!targetPlayer) return user.say("That player is not in the game!");
			if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
			this.playerActions.set(player, targetPlayer);
			this.reveals.push([targetPlayer, this.playerRoles.get(targetPlayer)]);
			return user.say("You have revealed the role of **" + targetPlayer.name + "**!");
		} else if (role === "The Medium") {
			if (this.playerActions.has(player)) {
				return user.say("You've already used your action.");
			} else if (this.round !== 1) {
				return user.say("You can only use your action on the first round");
			} else {
				let attackedPlayer = this.players[Tools.toId(target)];
				if (!attackedPlayer) return user.say("That player is not in the game!");
				if (attackedPlayer.eliminated) return user.say("That player has already been eliminated");
				this.playerActions.set(player, attackedPlayer);
				return user.say("You have used your action on **" + attackedPlayer.name + "**!");
			}
		} else {
			return user.say("Your character does not have a role that can play an action.");
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Bounty;
exports.commands = {
	actions: "actions",
	action: "action",
	destroy: "destroy",
}
exports.pmCommands = {
	actions: true,
	action: true,
	destroy: true,
}
