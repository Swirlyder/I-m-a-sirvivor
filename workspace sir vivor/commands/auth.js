	/***********************************************
	 *             OTHER AUTH COMMANDS             *
	 ***********************************************/

const ALLOW_ROLL_LIMIT = 2;

module.exports = {
	ar: 'allowroll',
	allowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id) || !target) return;

		const listOfUsers = target.split(",");
		const numOfUsers = listOfUsers.length;
		let goodnames = [], badnames = [];

		for (let i = 0; i < numOfUsers; i++) {
			let targetUser = Users.get(Tools.toId(listOfUsers[i]));
			let numOfAllowedUsers = Games.excepted.length;

			if (!targetUser) continue;

			if (numOfAllowedUsers < ALLOW_ROLL_LIMIT) {
				goodnames.push(targetUser.name);
				Games.excepted.push(targetUser.id);
			}
			else {
				badnames.push(targetUser.name);
			}
		}

		if (goodnames.length > 0 && badnames.length > 0) {
			this.say(room, goodnames.join(", ") + " " + (goodnames.length > 1 ? 'were' : 'was') + " allowed a roll! Unfortunately, " + badnames.join(", ") + " could not be added, since only 2 users can be allowed at a time.");
		}
		else if (goodnames.length > 0) {
			this.say(room, `${goodnames.join(", ")} ${goodnames.length > 1 ? 'were' : 'was'} allowed a roll!`);
		}
		else if (badnames.length > 0) {
			this.say(room, `Unfortunately, ${badnames.join(", ")} could not be added, since only 2 users can be allowed at a time.`);
		}
	},

	clearallowrolls: 'clearallowroll',
	clearallowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (!Games.host || Games.host.id !== user.id)) return;
		Games.excepted = [];
		room.say("Rolls have been cleared");
	},

	repeat: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room === user) return;
		room.trySetRepeat(target, user);
	},

	testroom: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		Rooms.get('survivor').say("/subroomgroupchat testing");
		Rooms.get('survivor').say("/join groupchat-survivor-testing");
		room.say("<<groupchat-survivor-testing>> to test stuff!");
	},

	psevent: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let args = arg.split(',');
		if (toId(args[0]) === "add") {
			Rooms.get('survivor').say('/events add ' + args.slice(1).join(','));
		} else if (toId(args[0]) === "remove") {
			Rooms.get('survivor').say('/events remove ' + args.slice(1).join(','));
		} else return room.say('Usage: ``.psevent [add/remove], [details]`` (check ``/events help`` for more info)');
	},

	//Broken, planned to fix
	/*
	reconnect: 'off',
	disconnect: 'off',
	crash: 'off',
	restart: 'off',
	off: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return false;
		room.say("/logout");
		connect();
	},
	*/

	kill: function (arg, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return false;
		if (user.lastcmd !== 'kill') return room.say("Are you sure you want to kill me? If you do, I will haunt you for the rest of your life. I dare you to type it again.");
		room.say("/logout");
		process.exit();
	},

	modchat: function (arg, user, room) {
		if (!user.hasRank('survivor', '+')) return false;
		room.say("/modchat +");
	},

	ac: 'autoconfirm',
	autoconfirm: function (arg, user, room) {
		if (!user.hasRank('survivor', '+')) return false;
		room.say("/modchat ac");
	}
};