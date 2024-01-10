	/***********************************************
	 *              DEVELOPER COMMANDS             *
	 ***********************************************
	 * These commands are here for highly ranked   *
	 * users (or the creator) to use to perform    *
	 * arbitrary actions that can't be done        *
	 * through any other commands or to help with  *
	 * upkeep of the bot.                          *
	 ***********************************************/

module.exports = {
	encrypt: function (target, user, room) {
		if (!user.isExcepted()) return false;
		return user.say("Encrypted message: " + Tools.encrypt(target));
	},

	decrypt: function (target, user, room) {
		if (!user.isExcepted()) return false;
		return user.say("Decrypted message: " + Tools.decrypt(target));
	},

	/*
	reload: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		try {
			delete require.cache[require.resolve('./commands.js')];
			Commands = require('./commands.js').commands;
			room.say('Commands reloaded.');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},
	*/

	reloadvoice: 'reloadvoices',
	reloadvoices: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		Rooms.get('survivor').say("/roomauth surv");
		user.say("Voices have been reloaded.");
	},

	reloadgames: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		delete require.cache[require.resolve('./games.js')];
		global.Games = require('./games.js');
		Games.loadGames();
		room.say('Games reloaded.');
	},

	shutdownmode: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		Config.allowGames = false;
		room.say("Shutdown mode enabled");
	},

	join: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		send('|/join ' + arg);
	},

	custom: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobuser,
		// the command would be ".custom [lobuser] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0) {
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
	},

	eval: 'js',
	js: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		try {
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},

	uptime: function (arg, user, room) {
		const target = user.can('+') ? room : user;
		let text = "**Uptime:** ";
		const divisors = [60, 60, 24, 7, 52]; // Reversed order
		const units = ["second", "minute", "hour", "day", "week"]; // Reversed order
		let buffer = [];
		let uptime = ~~process.uptime();

		for (let i = 0; i < divisors.length; i++) {
			const divisor = divisors[i];
			const unit = uptime % divisor;
			uptime = ~~(uptime / divisor);

			if (unit !== 0) {
				const unitText = unit > 1 ? unit + " " + units[i] + "s" : unit + " " + units[i];
				buffer.push(unitText);
			}
		}

		text += buffer.join(', ');
		this.say(target, text);
	},

	testroomdev: function (target, user, room) {
		if (!user.hasRank('survivorworkshop', '#')) return;
		Rooms.get('survivorworkshop').say("/join groupchat-survivorworkshop-testing");
		Rooms.get('survivorworkshop').say("/leave");
	},

	tester: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		this.say(room, room.id)
		this.say(room, user.id)
	},

	join: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		this.say(room, '/join ' + arg);
	},

	leave: function (target, user, room) {
		if (!user.isExcepted()) return;
		room.say("/part");
	}
};