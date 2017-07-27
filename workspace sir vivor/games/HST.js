'use strict';

const name = 'Hide & Seek Tag';
const description = '__Stop being so damn edgy and just play a childhood game for once.__ Game rules: http://survivor-ps.weebly.com/hide_and_seek.html';
const id = Tools.toId(name);
const locations = {
	bed: {name: "**Under the Bed**", roundname: "Under the Bed", aliases: ["bed", "utb", "underthebed"]},
	attic: {name: "in the **Attic**", roundname: "Attic", aliases: ["attic", "theattic"]},
	closet: {name: "in the **Closet**", roundname: "Closet", aliases: ["closet", "thecloset"]},
	basement: {name: "in the **Basement**", roundname: "Basement", aliases: ["basement", "thebasement"]},
}

class HST extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.needSeeker = false;
		this.seekerID = "";
		this.roles = new Map();
		this.actions = new Map();
		this.seekerLives = 4;
		this.numActions = 0;
		this.seekerRollVal = 150;
	}

	onStart() {
		this.locations = locations;
		this.say("/wall **Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + " | Each round use ``" + Config.commandCharacter + "choose [location]``");
		this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
	}

	handlePick(message) {
		let seeker = this.players[Tools.toId(message)];
		this.roles.set(seeker, 'seeker');
		if (this.needSeeker) {
			this.say("**" + seeker.name + "**, you are the new Seeker!");
			this.seekerID = seeker.id;
			this.needSeeker = false;
			return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
		this.say("**" + seeker.name + "**, you are the Seeker!");
		this.seekerID = seeker.id;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.id === seeker.id) continue;
			this.roles.set(player, 'hider');
		}
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			return this.end();
		}
		this.actions.clear();
		this.numActions = 0;
		if (this.seekerLives === 1) {
			this.locations = {};
			let newlocs = Tools.sample(Object.keys(locations), 3);
			for (let i = 0; i < newlocs.length; i++) {
				this.locations[newlocs[i]] = locations[newlocs[i]];
			}
		}
		this.say("/wall ``Hiders:`` " + Object.keys(this.players).filter(p => !this.players[p].eliminated && this.roles.get(this.players[p]) !== 'seeker').map(p => this.players[p].name).join(", ") + " | ``Seeker:`` " + this.players[this.seekerID].name + '[' + this.seekerLives + '] | ``Locations:`` ' + Object.keys(this.locations).map(loc => this.locations[loc].roundname).join(", "));
		this.acceptActions = true;
		this.timeout = setTimeout(() => this.prod(), 60 * 1000);
	}

	prod() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.actions.has(player)) continue;
			waitings.push(player.name);
		}
		if (waitings.length > 0) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.eliminations(), 30 * 1000);
	}

	eliminations() {
		let eliminated = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.actions.has(player)) continue;
			player.eliminated = true;
			eliminated.push(player.name);
			if (this.roles.get(player) === 'seeker') this.needSeeker = true;
		}
		eliminated = "**" + eliminated.join(", ") + "** were eliminated for not choosing a location!";
		if (this.getRemainingPlayerCount() < 2) {
			this.say(eliminated);
			return this.end();
		}
		if (this.needSeeker) {
			eliminated += " Choosing the new Seeker.";
			this.say(eliminated);
			return this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
		}
		else {
			this.say(eliminated);
			this.processActions();
		}
	}

	processActions() {
		this.acceptActions = false;
		let seeked = this.actions.get(this.players[this.seekerID]);
		let caught = [];
		let noCatch = true;
		let text = '**' + this.players[this.seekerID].name + '** decides to search ' + this.locations[seeked].name + ' and finds ';
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.roles.get(player) === 'seeker') continue;
			if (this.actions.get(player) === seeked) {
				caught.push(player.name);
				noCatch = false;
			}
		}
		if (noCatch) {
			text += 'no one!';
			this.seekerLives--;
			if (this.seekerLives === 0) {
				text += ' No lives remaining, the **Seeker loses!**';
				this.players[this.seekerID].eliminated = true;
				this.say(text);
				if (this.getRemainingPlayerCount() === 1) {
					return this.end();
				}
				this.say('Rolling for the winner out of **' + Object.keys(this.getRemainingPlayers()).map(p => this.players[p].name).join(", ") + "**!");
				this.hiderBattle = true;
				return this.say('!roll ' + this.getRemainingPlayerCount() + 'd100');
			}
			this.say(text);
			return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
		else {
			text += "**" + caught.join(", ") + "**";
		}
		text += '! Rolling for **' + this.players[this.seekerID].name + '**!';
		this.seekerRolling = true;
		this.say(text);
		this.opponents = caught;
		this.say('!roll ' + this.seekerRollVal);
	}

	handleRoll(roll) {
		if (this.seekerRolling) {
			this.seekerRolling = false;
			this.seekerRoll = roll;
			this.say("Rolling for **" + this.opponents.map(p => this.players[Tools.toId(p)].name).join(", ") + "**!");
			return this.say("!roll " + this.opponents.length + "d100");
		}
		return this.handleRolls([roll]);
	}

	handleRolls(rolls) {
		if (this.hiderBattle) {
			let highRoll = Math.max(...rolls);
			let names = [];
			let playerids = Object.keys(this.getRemainingPlayers());
			for (let i = 0; i < playerids.length; i++) {
				let player = this.players[playerids[i]];
				if (rolls[i] === highRoll) {
					names.push(player.name);
				} else {
					player.eliminated = true;
				}
			}
			this.say("**" + names.join(', ') + "** win " + (names.length === 1 ? "s" : "") + " the roll battle!");
			return this.end();
		}
		let tagged = [];
		let escaped = [];
		for (let i = 0; i < this.opponents.length; i++) {
			let userID = Tools.toId(this.opponents[i]);
			let player = this.players[userID];
			player.roll = rolls[i];
			if (player.roll >= this.seekerRoll) {
				escaped.push(player.name);
			}
			else {
				tagged.push(player.name);
				player.eliminated = true;
			}
		}
		let text = '';
		if (tagged.length) text += "**" + tagged.join(', ') + "** " + (tagged.length > 1 ? "are": "is") + " tagged! ";
		if (escaped.length) text += "**" + escaped.join(', ') + "** escaped!";
		if (!tagged.length) {
			this.seekerLives--;
			if (this.seekerLives === 0) {
				text += ' No lives remaining, the **Seeker loses!**';
				this.players[this.seekerID].eliminated = true;
				this.say(text);
				if (this.getRemainingPlayerCount() === 1) {
					return this.end();
				}
				this.say('Rolling for the winner out of **' + Object.keys(this.getRemainingPlayers()).map(p => this.players[p].name).join(", ") + "**!");
				this.hiderBattle = true;
				return this.say('!roll ' + this.getRemainingPlayerCount() + 'd100');
			}
		}
		if (this.variation === "Juggernaut" && tagged.length) {
			this.seekerRollVal += (tagged.length * 10);
		}
		this.say(text);
		return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	choose(target, user) {
		let player = this.players[user.id];
		if (player.eliminated || !this.acceptActions || this.actions.has(player)) return false;
		if (!target) return user.say("Please provide a location. ``" + Config.commandCharacter + " hide [location]``");
		let playerloc = Tools.toId(target);
		for (let i in this.locations) {
			if (this.locations[i].aliases.indexOf(playerloc) !== -1) {
				this.actions.set(player, i);
				break;
			}
		}
		if (!this.actions.has(player)) return user.say("Invalid location! ``Locations:`` Bed, Closet, Attic, Basement.");
		user.say("You have chosen to " + (this.roles.get(player) === "seeker" ? "seek" : "hide") + " " + this.locations[this.actions.get(player)].name + "!");
		this.numActions++;
		if (this.numActions === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			return this.processActions();
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = HST;
exports.aliases = ['hs', 'hideandseek', 'hideseek', 'hst'];
exports.commands = {
	choose: "choose"
};
exports.pmCommands = {
	choose: true
};
exports.variations = [
	{
		name: "Juggernaut Hide and Seek",
		aliases: ["juggernauthst", "jhst", "jhs"],
		variation: "Juggernaut",
		variationAliases: [],
	},
]
