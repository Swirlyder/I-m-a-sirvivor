'use strict';

const name = 'Hide & Seek Tag';
const description = '__Stop being so damn edgy and just play a childhood game for once.__ Game rules: http://survivor-ps.weebly.com/hide_and_seek.html';
const id = Tools.toId(name);
const locations = ['bed', 'closet', 'attic', 'basement'];

class HST extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.roles = new Map();
		this.actions = new Map();
		this.seekerLives = 4;
	}

	onStart() {
		this.say("/wall **Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + " | Each round use ``.choose [location]``");
		this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
	}

	handlePick(message) {
		let seeker = this.players[Tools.toId(message)];
		this.roles.set(seeker, 'seeker');
		if (this.needSeeker) {
			this.say("**" + seeker.name + "**, you are the new Seeker!");
			this.seekerID = seeker.id;
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
		this.actions.clear();
		if (this.getRemainingPlayerCount() === 1) {
			this.winners.set(this.getLastPlayer(), true);
			return this.end();
		}
		if (this.seekerLives === 1 && !this.set) {
			this.say("You can no longer hide in the basement!");
			this.set = true;
		}
		this.say("/wall " + this.getRoundSummary());
		this.acceptActions = true;
		this.timeout = setTimeout(() => this.prod(), 45 * 1000);
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
		let elimination = '';
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.actions.has(player)) continue;
			player.eliminated = true;
			if (elimination) {
				elimination += ', ' + player.name;
			}
			else {
				elimination = player.name;
			}
			if (this.roles.get(player) === 'seeker') this.needSeeker = true;
		}
		elimination += "** were eliminated for not choosing a location!";
		if (this.needSeeker) {
			elimination += " Choosing the new Seeker.";
			this.needSeeker = false;
			this.say(elimination);
			return this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
		}
		else {
			this.say(elimination);
			if (this.getRemainingPlayerCount === 1) {
				this.winners.set(this.getLastPlayer(), true);
				this.end();
			}
			return this.processActions();
		}
	}

	processActions() {
		clearTimeout(this.timeout);
		this.acceptActions = false;
		let seeked = this.actions.get(this.players[this.seekerID]);
		let caught = {};
		let noCatch = true;
		let text = '**' + this.players[this.seekerID].name + '** decides to search ' + this.getFormattedLocation(seeked) + 'and finds ';
		let i = 0;
		for (let userID in this.players) {
			let player = this.players[userID];
			i++;
			if (player.eliminated || this.roles.get(player) === 'seeker') continue;
			if (this.actions.get(player) === seeked) {
				caught[i] = player;
				noCatch = false;
			}
		}
		if (noCatch) {
			text += '**no one!** ';
			this.seekerLives--;
			if (this.seekerLives === 0) {
				text += 'No lives remaining, the **Seeker loses!**';
				this.players[this.seekerID].eliminated = true;
				this.say(text);
				if (this.getRemainingPlayerCount() === 1) {
					this.winners.set(this.getLastPlayer(), true);
					return this.end();
				}
				return this.rollBattle(this.getRemainingPlayers);
			}
			this.say(text);
			return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
		else {
			let first = true;
			for (let userID in caught) {
				if (first === true) {
					text += "**" + caught[userID].name;
					first = false;
					continue;
				}
				else {
					text += ', ' + caught[userID].name;
				}
			}
			text += "!**";
		}
		this.say(text);
		return this.rollBattle(caught, true);
	}

	rollBattle(opponents, caught) {
		let text = '';
		let names = [];
		let counter = 0;
		for (let userID in opponents) {
			let player = opponents[userID];
			names.push(player.name);
			counter++;
			if (counter === 1) this.firstOpp = player;
		}
		this.names = names;
		this.opponents = opponents;
		if (!caught) {
			text += 'Rolling for the winner out of **';
			names = this.getRemainingPlayers();
			let buf = [];
			for (let userID in names) {
				buf.push(names[userID].name);
			}
			this.names = buf;
			text += this.names.join(', ') + '!**';
			this.say(text);
			this.hiderBattle = true;
			return this.say('!roll ' + this.names.length + 'd100');
		}
		else {
			text += 'Rolling for **' + this.players[this.seekerID].name + '**!';
			this.seekerRolling = true;
			this.say(text);
			this.say('!roll 150');
			switch (counter) {
				case '1':
					text = 'Rolling for **' + this.firstOpp.name + '**!';
					this.say(text);
					this.say('!roll 100');
					break;
				default:
					text = 'Rolling for **' + names.join(', ') + '**!';
					this.say(text);
					this.say('!roll ' + counter + 'd100');
					break;
			}
			return;
		}
	}

	handleRoll(roll) {
		if (this.seekerRolling) {
			this.seekerRolling = false;
			this.seekerRoll = roll;
			return;
		}
		this.opponentRoll = roll;
		if (this.seekerRoll > this.opponentRoll) {
			this.players[this.firstOpp.id].eliminated = true;
			this.say("**" + this.firstOpp.name + "** was tagged!");
			return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
		else if (this.seekerRoll === this.opponentRoll) {
			this.say("The rolls were the same! Rerolling.");
			return this.rollBattle(this.opponents, true);
		}
		else {
			this.say("**" + this.firstOpp.name + "** escaped!");
			return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
	}

	handleRolls(rolls) {
		if (this.hiderBattle) {
			this.highRoll = false;
			for (let i = 0; i < this.names.length; i++) {
				let userID = Tools.toId(this.names[i]);
				let player = this.players[userID];
				this.players[player.id].roll = rolls[i];
				if (!this.highRoll) {
					this.highRoll = player.roll;
					continue;
				}
				else if (this.highRoll === player.roll || this.highRoll < player.roll) {
					this.highRoll = player.roll;
					continue;
				}
				else continue;
			}
			let names = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				if (this.players[player.id].roll === this.highRoll) {
					names.push(player.name);
				}
			}
			this.say("**" + names.join(', ') + "** wins!");
			return this.end();
		}
		let tagged = [];
		let escaped = [];
		for (let i = 0; i < this.names.length; i++) {
			let userID = Tools.toId(this.names[i]);
			let player = this.players[userID];
			player.roll = rolls[i];
			if (player.roll > this.seekerRoll || player.roll === this.seekerRoll) {
				escaped.push(player.name);
			}
			else if (player.roll < this.seekerRoll) {
				tagged.push(player.name);
				player.eliminated = true;
			}
		}
		let text = '';
		if (tagged.length) text += "**" + tagged.join(', ') + "** are tagged! ";
		if (escaped.length) text += "**" + escaped.join(', ') + "** escaped!";
		this.say(text);
		return this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	choose(target, user) {
		let player = this.players[user.id];
		if (player.eliminated || !this.acceptActions || this.actions.has(player)) return false;
		if (!target) return user.say("Please provide a location. ``.hide [location]``");
		let location = Tools.toId(target);
		if (location === 'underthebed') location = 'bed';
		for (let i = 0; i < locations.length; i++) {
			if (locations[i] === location) {
				if (this.set && location === 'basement') {
				    return user.say("You can't choose the basement!");
				    }
				this.actions.set(player, location);
				break;
			}
		}
		if (!this.actions.has(player)) return user.say("Invalid location! ``Locations:`` Bed, Closet, Attic, Basement.");
		let text = "You've chosen to ";
		if (this.roles.get(player) === 'hider') text += 'hide ';
		else text += 'seek ';
		if (location !== 'bed') {
			text += 'in the ';
		}
		text += this.getFormattedLocation(location) + '!';
		user.say(text);
		if (this.checkActions()) {
			clearTimeout(this.timeout);
			return this.processActions();
		}
	}
	checkActions() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.actions.has(player)) {
				return false;
			}
		}
		return true;
	}
	getFormattedLocation(location) {
		switch (location) {
			case 'bed':
				location = '**Under the Bed** ';
				break;
			case 'attic':
				location = '**Attic** ';
				break;
			case 'basement':
				location = '**Basement** ';
				break;
			case 'closet':
				location = '**Closet** ';
				break;
		}
		return location;
	}

	getRoundSummary() {
		let hiders = [];
		let basement = 'Basement';
		if (this.set) {
			basement = '';
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			if (this.roles.get(player) === 'seeker' || player.eliminated) continue;
			hiders.push(player.name);
		}
		if (hiders.length === 1) {
			hiders = hiders[0];
		}
		else {
			hiders = hiders.join(', ');
		}
		let summary = '``Hiders:`` ' + hiders + ' | ``Seeker:`` ' + this.players[this.seekerID].name + " [" + this.seekerLives + "]" + ' | ``Locations:`` Under the Bed, Closet, Attic, ' + basement;
		return summary;
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
