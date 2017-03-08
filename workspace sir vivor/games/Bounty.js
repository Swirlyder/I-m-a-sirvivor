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
		this.hasUseActions = new Map();
	}

	onStart() {
		if (this.getRemainingPlayerCount() > 9) {
			this.roles.push('Decoy');
		}
		for (let userID in this.players) {
			this.hasBeenAttacked.set(this.players[userID], false);
		}
		this.playerOrder = this.shufflePlayers();
		this.playerRoles.set(this.playerOrder[0], 'Bounty');
		this.playerOrder[0].say("You were chosen as the bounty!");
		this.playerOrder.shift();
		this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
	}

	handoutRoles() {
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
	}

	onNextRound() {
		this.blocked.clear();
		this.attacks.clear();
		this.playerActions.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.order = [];
		this.say("**Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
		this.say("Please pm me your actions (if applicable) and attacks now with ``" + Config.commandCharacter + " destroy [user]``, ``" + Config.commandCharacter + "action [action-name], effect``. You can also pm me ``" + Config.commandCharacter + "actions`` to see the actions");
		this.timeout = setTimeout(() => this.listRemaining(), 30 * 1000);
	}

	listRemaining() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.attacks.has(player)) continue;
			waitings.push(player.name);
		}
		if (waitings.length > 0) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	doPlayerAttack() {
		this.roll1 = this.rolls.get(this.curPlayer);
		this.roll2 = this.rolls.get(this.oplayer);
		this.sayPlayerRolls();
	}
	
	handleWinner(winPlayer, losePlayer) {
		if (winPlayer === this.curPlayer) {
			let start = ("**" + this.curPlayer.name + "** "+ Tools.sample(Games.destroyMsg) + " **" + this.oplayer.name + "**");
			let role1 = this.playerRoles.get(this.curPlayer), role2 = this.playerRoles.get(this.oplayer);
			this.oplayer.eliminated = true;
			if (role2 === "Bomb") {
				this.say(start + ", but **" + this.oplayer.name + "** was also a bomb! RIP them both");
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
			}
		} else {
			this.say("**" + winPlayer.name + "** defended successfully!");
		}
	}

	handleAttacks() {
		if (this.order.length === 0) {
			this.nextRound();
		} else {
			let pair = this.order.shift();
			this.curPlayer = pair[0];
			this.oplayer = pair[1];
			let role1 = this.playerRoles.get(this.curPlayer);
			if (role1 === 'Heavy' && this.order.length !== 0) {
				this.order.push(pair);
			} else {
				if (this.curPlayer.eliminated || this.oplayer.eliminated) {
					this.handleAttacks();
				} else {
					if (role1 === 'Sleeping' && !this.hasBeenAttacked(this.curPlayer)) {
						this.handleAttacks();
					} else {
						this.hasBeenAttacked.set(this.oplayer, true);
						this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
						this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
					}
				}
			}
		}
	}
	
	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) continue;
		let targetPlayer = this.player[Tools.toId(target)];
		if (!targetPlayer) return user.say("That player is not in the game!");
		if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.attacks.has(player)) return user.say("You have already attacked someone this round!");
		this.attacks.set(player, targetPlayer);
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
		
	}
}


exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Bounty;