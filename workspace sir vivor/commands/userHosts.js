	/***********************************************
	 *                USER HOSTING                 *
	 ***********************************************/

const gameTypes = require('../data/themes.js');
const modTypes = require('../data/theme_mods.js');
const Games = require('../games.js');

module.exports = {
	r: 'dice',
	roll: 'dice',
	dice: function (arg, user, room) {
		// Permission check
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) {
			let index = Games.excepted.indexOf(user.id);
			if (index === -1) return;
			Games.excepted.splice(index, 1);
		}
		let roll = arg.toString().split("//")[0]; // text after // is ignored

		if (!roll) roll = "100"; // blank .r gives d100

		// Find the index of the first addition or subtraction
		let add = roll.indexOf("+");
		let sub = roll.indexOf("-");
		let index = -1;
		if (add > sub) {
			if (sub !== -1) index = sub;
			else index = add;
		}
		if (sub > add) {
			if (add !== -1) index = add;
			else index = sub;
		}

		// Split between rolls and flat number additions
		let addition = index == -1 ? false : roll.substring(index);
		if (index !== -1) roll = roll.substring(0, index);

		// Split and check for XdY format
		roll = roll.split("d");
		if (roll.length > 2) return room.say("Invalid dice format.");
		let dice = roll[0];
		let faces = roll[1];
		if (roll.length === 1) { // No "d" is found so the roll is just a single number
			faces = roll[0];
			dice = "1";
		} else { // Fills in XdY with defaults if only X or Y is given
			if (!dice) dice = "1";
			if (!faces) faces = "100";
		}

		dice = parseInt(dice);
		faces = parseInt(faces);
		if (isNaN(dice) || isNaN(faces)) return room.say("Invalid dice format."); // X and Y in XdY must be numbers
		if (dice > 40) return room.say("The number of dice rolled must be a natural number up to 40."); // Too many dice is bad
		if (faces > 1000000000) return room.say("The maximum roll is allowed is 1000000000."); // Too big a dice is bad
		let rolls = [];
		let total = 0;
		for (let i = 0; i < dice; i++) { // Do rolls
			let roll = Math.floor(Math.random() * faces) + 1;
			rolls.push(roll);
			total += roll;
		}
		let addit = 0;
		if (addition) { // This adds all additions together so 1d100+1+2+6+3 is parsed as 1d100+12
			addition = addition.split(''); // Char by char split
			let cur = addition.shift();
			let cv = ""; // cv is where we store the current number
			for (let ch of addition) {
				if (ch === "+" || ch === "-") { // there shouldn't be 2 +/- in sequence. eg 1d100++12 is a bad format
					if (!cv) return room.say("Invalid dice format.");
					cv = parseInt(cv);
					if (isNaN(cv)) return room.say("Invalid dice format.");
					if (cur === "+") addit += cv;
					else addit -= cv;
					cv = "";
					cur = ch;
					continue;
				}
				if ("0123456789".indexOf(ch) !== -1) { // if the character is a number, add it to the current value
					cv += ch;
					continue;
				}
				if (ch === " ") continue; // ignore spaces
				return room.say("Invalid dice format."); // It's not a number, +/-, or a space, so it's wrong
			}

			if (!cv) return room.say("Invalid dice format."); // Don't end additions with + or -
			cv = parseInt(cv);
			if (isNaN(cv)) return room.say("Invalid dice format.");
			if (cur === "+") addit += cv;
			else addit -= cv;
			total += addit; // add the whole thing to the total
		}
		let ret = `Roll (1 - ${faces})${addit !== 0 ? (addit < 0 ? " -" : " +") + " " + Math.abs(addit) : ""}: ${total}`;
		if (dice > 1) {
			ret = `${dice} Rolls (1 - ${faces}): ${rolls.join(', ')}<br>Sum${addit !== 0 ? (addit < 0 ? " - " : " + ") + Math.abs(addit) : ""}: ${total}`;
		}
		this.say(room, `/addhtmlbox ${ret}`);
	},


	dt: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		var data = [];
		for (let i in Tools.data.pokedex) {
			let mon = Tools.data.pokedex[i];
			data.push(mon.name);
		}
		target = toId(target);
		for (let i = 0; i < data.length; i++) {
			if (target === toId(data[i])) {
				return this.say(room, "!dt " + data[i]);
			}
		}
		this.say(room, "No pokemon named " + target + " was found.");
	},

	randpoke: 'poke',
	poke: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		room.say("!dt " + Tools.data.pokedex[Tools.sample(Object.keys(Tools.data.pokedex))].name);
	},

	/*randtheme: function (arg, user, room) {
		let target = !user.hasRank(room.id, '+') && !(Games.host && Games.host.id === user.id) ? user : room;
		let avail = [];
		for (let i in gameTypes) {
			if (typeof gameTypes[i] === "string") continue;
			let name = gameTypes[i][0];
			if (avail.includes(name) || gameTypes[i][4]) {
				continue;
			}
			avail.push(name);
		}
		let theme = Tools.sample(avail);
		for (let i in gameTypes) {
			if (gameTypes[i][0] == theme) {
				var data = gameTypes[i];
				return target.say('**' + data[0] + '**: __' + data[2] + '__ Game rules: ' + data[1]);
			}
		}

	},
*/
	randmod: function (arg, user, room) {
		let target = !user.hasRank(room.id, '+') && !(Games.host && Games.host.id === user.id) ? user : room;
		let avail = [];
		for (let i in modTypes) {
			if (typeof modTypes[i] === "string") continue;
			let name = modTypes[i][0];
			if (avail.includes(name) || modTypes[i][4]) {
				continue;
			}
			avail.push(name);
		}
		let mod = Tools.sample(avail);
		for (let i in modTypes) {
			if (modTypes[i][0] == mod) {
				var data = modTypes[i];
				return target.say('**' + data[0] + '**: __' + data[1] + '__');
			}
		}

	},

	done: function (arg, user, room) {
		if (!Games.host || Games.host.id !== user.id) return;
		Games.host = null;
		Games.resetPLData();
		this.say(room, "Thanks for playing!");
	},

	win: function (target, user, room) {
		if (!Games.host || Games.host.id !== user.id || room === user) return;
		/*let split = target.split(",");
		if (split.length !== 2) {
			return room.say("You must specify the playercount and the username that won, in the format: ``.win playercount, winner``");
		}
		let numPlayers = parseInt(split[0]);
		if (!numPlayers || numPlayers < 1) return room.say("The number of players must be a number greater than 0.");
		if (!Games.hosttype && Games.hosttype !== 0) {
			if (user.hasRank(room.id, '+')) {
				room.say("The winner is **" + split[1].trim() + "**, but I could not award host points since you never selected a theme!");
			} else {
				return room.say("Please select a theme before winning the player!");
			}
		} else {
			if (!user.hasRank(room.id, '+')) {
				room.say(".win " + target);
			}
			let types = ["easy", "medium", "hard"];
			room.say("." + types[Games.hosttype] + "host " + numPlayers + ", " + Games.host.name);
			room.say("The winner is **" + split[1].trim() + "**! Thanks for playing.");
		}
		Games.hosttype = null;
		Games.host = null;*/
		room.say("Thanks for playing!");
		Games.host = null;
		Games.resetPLData();
		Games.hosttype = null;
	},

	timer: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		if (target === "end") {
			if (Games.isTimer) {
				clearTimeout(Games.timeout);
				this.say(room, "The timer has been ended.");
				Games.isTimer = false;
			} else {
				this.say(room, "There is no timer running!");
			}
			return;
		}
		let x = parseFloat(target);
		if (!x || x > 300 || (x < 10 && x > 5) || x <= 0) return this.say(room, "The timer must be between 10 seconds and 5 minutes.");
		if (x < 10) x *= 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		clearTimeout(Games.timeout);
		this.say(room, "Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		Games.timeout = setTimeout(() => Games.timer(room, user), x * 1000);
		Games.isTimer = true;
	},

	pick: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let stuff = target.split(",");
		let str = "<em>We randomly picked:</em> " + Tools.sample(stuff).replace(/>/g, "&gt;").replace(/</g, "&lt;").trim();
		if (room.id === 'survivor') {
			this.say(room, "/addhtmlbox " + str);
		} else {
			this.say(room, "!htmlbox " + str);
		}
	},

	shuffle: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;

		function shuffle(array) {
			for (let i = array.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
				[array[i], array[j]] = [array[j], array[i]]; // swap elements
			}
		}
		let stuff = target.split(",");
		shuffle(stuff)
		let str = "<i>" + stuff.join(', ').replace(/>/g, "&gt;").replace(/</g, "&lt;").trim() + "</i>";
		if (room.id === 'survivor') {
			this.say(room, "/addhtmlbox " + str);
		} else {
			this.say(room, "!htmlbox " + str);
		}
	},

	weak: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let types = ["normal", "fire", "water", "grass", "steel", "psychic", "ghost", "dark", "bug", "poison", "ground", "rock", "dragon", "ice", "fairy", "fighting", "flying", "electric"];
		if (target.endsWith('type')) {
			target = target.substr(0, target.length - 4);
		}
		if (types.indexOf(target) !== -1) {e
			this.say(room, "!weak " + target);
		} else {
			this.say(room, "Please enter a valid type.");
		}
	},
	plmenu: function (target, user, room) {
		if ((!Games.host || (Games.host.id !== user.id)) && !user.isExcepted() && !user.hasRank('survivor', '+')) return;
		if (user.id == Games.host.id) Games.enablePlTool();
		const split = target.split(","), arg = split[0], playerID = split[1];
		switch (arg) {
			case "expanduser":
				Games.expandedUser = Games.expandedUser == playerID ? "none" : split[1];
				break;
			case "remove":
				Games.removePlayer(Games.players[playerID], false);
				break;
			case "revive":
				Games.players[playerID].eliminated = false;
				Games.playerCount++;
				break;
			case "rename":
				const newName = split[2];
				Games.players[playerID].name = newName;
				break;
			case "ts":
				Games.toggleSignups();
				const msg = Games.signupsOpen ? "Signups are open!" : "Signups are closed!";
				room.say("/msgroom survivor, " + msg);
				break;
			case "elim":
				const player = Games.players[Tools.toId(split[1])];
				Games.eliminatePlayer(player);
				break;
			case 'timer':
				const arg = split[1].trim();
				if (arg === "end") {
					if (Games.isTimer) {
						clearTimeout(Games.timeout);
						room.say("/msgroom survivor, The signup timer has been ended.");
						Games.isTimer = false;
						Games.isSignupTimer = false;
					} else {
						room.say("/msgroom survivor, There is no signup timer running!");
					}
					return;
				}
				let x = parseFloat(arg);
				if (!x || x > 300 || (x < 10 && x > 5) || x <= 0) return room.say("/msgroom survivor, The timer must be between 10 seconds and 5 minutes.");
				if (x < 10) x *= 60;
				let minutes = Math.floor(x / 60);
				let seconds = x % 60;
				clearTimeout(Games.timeout);
				room.say("/msgroom survivor, Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
				Games.timeout = setTimeout(() => Games.handleSignupsTimer(room, user), x * 1000);
				Games.isTimer = true;
				Games.isSignupTimer = true;
				break;
			case 'exit':
				Games.handlePlayerListExit(room, user);
				if (user.id == Games.host.id) Games.disablePlTool();
				return;
		}

		const html = PL_Menu.generatePLAssistantHTML();
		PL_Menu.sendPage(user.id, "Playerlist-Assistant", html, room);
	},
	randcard: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;

		const cardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const cardSuits = ['♠️', '♣️', '♥️', '♦️'];

		//get random suit and rank
		const cardRank = cardRanks[Math.floor(Math.random() * cardRanks.length)];
		const cardSuit = cardSuits[Math.floor(Math.random() * cardSuits.length)];

		//insert the card info into html template
		const cardHTML = Games.getCardHTML(cardRank, cardSuit);

		//display card in chat
		this.say(room, "/addhtmlbox " + cardHTML);
	}
}
