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
		this.playerRoles = new Map();
		this.attacks = new Map();
		this.playerActions = new Map();
		this.numAttacks = 0;
		this.hasBeenAttacked = new Map();
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
			this.playerOrder.shift();
			this.timeout = setTimeout(() => this.handoutRoles(), 2 * 1000);
		}
	}

	onNextRound() {
		this.attacks.clear();
		this.playerActions.clear();
		this.numAttacks = 0;
		this.canAttack = true;
		this.say("**Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()));
		this.say("Please pm me your actions (if applicable) and attacks now with ``" + Config.commandCharacter + " destroy [user]``, ``" + Config.commandCharacter + "action [action-name], effect``. You can also pm me ``" + Config.commandCharacter + "actions`` to see the actions");
	}

	destroy(target, user) {
		
	}

	actions(target, user) {
		let actions = {
			"Private Eye": "Once per game, at the beginning of a turn, they can choose a player and reveal his role in chat. Usage: <tt>" + Config.commandCharacter + "action [user]</tt>",
			"Trapper": "Chooses one person every turn and blocks their attack. Usage: <tt>" + Config.commandCharacter + "action [user]</tt>",
			"Misinformer": "Once per game, at the beginning of a turn, they can choose a player and a role to say in chat. Usage: <tt>" + Config.commandCharacter + "action [user], [role]</tt>",
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