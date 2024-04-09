/*******************************************************************************************************************************************************************
 * INFORMATIONAL COMMANDS 
 *		- GENERAL INFO
 *		- SURVIVOR INFO
 *******************************************************************************************************************************************************************/

const gameTypes = require('../data/themes.js');
const eventTypes = require('../data/events.js');
const modTypes = require('../data/theme_mods.js');

module.exports = {

	/* GENERAL INFO ---------------------------------------------------------------------------------------------------------------------------------------------------*/

	day: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		let day = new Date().getDay();
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		text += 'Today is currently **' + days[day] + "**!";
		this.say(room, text);
	},

	seen: function (arg, user, room) { // this command is still a bit buggy
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id) {
			return user.say('Have you looked in the mirror lately?');
		} else if (toId(arg) === user) {
			return user.say('You might be either blind or illiterate. Might want to get that checked out.');
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			return user.say('The user ' + arg + ' has never been seen.');
		}
		return user.say(arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.'));
	},

	/* SURVIVOR INFO --------------------------------------------------------------------------------------------------------------------------------------------------*/

	theme: 'themes',
	themes: function (arg, user, room) {
		if (!Games.canTheme) return;
		let target = user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id) ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("The list of game types can be found here: https://sites.google.com/view/survivor-ps/themes");
		if (!gameTypes[arg]) return target.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");
		let data = gameTypes[arg];
		if (typeof data === 'string') data = gameTypes[data];

		let text = '**' + data[0] + '**: __' + data[2] + '__ Game rules: ' + data[1];
		if (Games.host) {
			Games.hosttype = data[3];
		}
		target.say(text);
		if (room == user) return;
		Games.canTheme = false;
		var t = setTimeout(function () {
			Games.canTheme = true;
		}, 5 * 1000);
	},

	events: 'event',
	event: function (arg, user, room) {
		let target = user.hasRank(room.id, '+') ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("Link to the Survivor events page: https://sites.google.com/view/survivor-ps/events");
		if (!eventTypes[arg]) return target.say("Invalid event type. The events can be found here: https://sites.google.com/view/survivor-ps/events");
		let data = eventTypes[arg];
		if (typeof data === 'string') data = eventTypes[data];

		let text = '**' + data[0] + '**: __' + data[2] + '__ Event rules: ' + data[1];
		target.say(text);
	},

	modifications: 'mod',
	modification: 'mod',
	mods: 'mod',
	mod: function (arg, user, room) {
		let target = user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id) ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("Link to the Survivor theme modifications: https://sites.google.com/view/survivor-ps/themes/modifications");
		if (!modTypes[arg]) return target.say("Invalid modification type. The modifications can be found here: https://sites.google.com/view/survivor-ps/themes/modifications");
		let data = modTypes[arg];
		if (typeof data === 'string') data = modTypes[data];

		let text = '**' + data[0] + '**: __' + data[1] + '__';
		target.say(text);
	},

	intro: function (arg, user, room) {
		if (!Games.canIntro) return;
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user + ', ';
		}
		text += 'Hello, welcome to Survivor! I\'m the room bot. "Survivor" is a luck-based game' +
			'that uses Pokémon Showdown\'s /roll feature. For more info, go to:' +
			'https://sites.google.com/view/survivor-ps/home';
		this.say(room, text);
		Games.canIntro = false;
		var t = setTimeout(function () {
			Games.canIntro = true;
		}, 5 * 1000);
	},

	site: function (arg, user, room) {
		let target = user.hasRank(room, '+') ? room : user;
		let text = "https://sites.google.com/view/survivor-ps/home";
		target.say(text);
	},

	nbt: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}

		text += '**Next Big Theme** is currently in session! More info on NBT and the current themes in review here:' +
			'https://docs.google.com/document/d/17_5jkdhC3P1F073NiJeuUnX_NdgZsVgzxr8mFr_WQ8s/edit';
		this.say(room, text);
	},

	rankings: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'This has been discontinued but what\'s left of the **Survivor Rankings** can be found here:' +
			'http://goo.gl/jAucyT';
		this.say(room, text);
	},

	howtohost: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'How To Host: https://sites.google.com/view/survivor-ps/guides/how-to-host';
		this.say(room, text);
	},

	summary: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '%')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'Hello, welcome to Survivor. Here we play a series of Survivor games. Survivor is a game based ' +
			'on dice rolls,  some games require less luck than others. Example attack: http://i.imgur.com/lKDjvWi.png';
		this.say(room, text);
	},

	htp: 'howtoplay',
	howtoplay: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'Survivor Themes and How to Play Them: https://sites.google.com/view/survivor-ps/themes';
		this.say(room, text);
	},
	
	int: 'interviews',
	interviews: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}

		text += '**SURVIVOR STAFF INTERVIEWS**: https://sites.google.com/view/survivor-ps/extras/interviews?authuser=0 || **FINAL ROUND QUESTION SUBMISSIONS**: https://forms.gle/EhPsw9CaNtJD45QH8';
		this.say(room, text);
	},

	mk: 'modkill',
	modkill: function (target, user, room) {
		let text = "A modkill (or mk) occurs when a player does not provide an action and so they are eliminated";
		if (user.hasRank(room.id, '+')) {
			room.say(text);
		} else {
			user.say(text);
		}
	}
};
