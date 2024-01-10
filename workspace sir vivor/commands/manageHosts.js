/**********************************************************************************************************************************
 * HOST MANAGEMENT COMMANDS
 *		- MANAGE USER HOSTS
 *		- MANAGE HOST BANS
 **********************************************************************************************************************************/

module.exports = {

	/* MANAGE USER HOSTS -------------------------------------------------------------------------------------------------------------*/

	host: function (target, user, room) {
		if ((!user.hasRank(room.id, '+') && (Config.canHost.indexOf(user.id) === -1)) || room === user) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		let split = target.split(",");
		let realuser = Users.get(split[0]);
		if (!realuser) return this.say(room, "You can only host somebody currently in the room.");
		if (realuser.id in Games.hostbans) return user.say("That user is currently hostbanned.");
		let targTheme = "";
		if (split.length > 1) {
			let targThemeID = Tools.toId(split[1]);
			if (!(targThemeID in gameTypes)) {
				return room.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");
			} else {
				if (typeof gameTypes[targThemeID] === 'string') targThemeID = gameTypes[targThemeID];
				targTheme = gameTypes[targThemeID][0];
			}
		}
		if (Games.host || room.game) {
			target = Tools.toId(realuser.name);
			let i = 0,
				len = Games.hosts.length;
			for (; i < len; i++) {
				if (target === Tools.toId(Games.hosts[i][0])) {
					break;
				}
			}
			if (Games.host && Games.host.id === realuser.id) {
				return room.say(realuser.name + " is already hosting. Somebody probably sniped you haha~");
			} else if (i !== len) {
				this.say(room, realuser.name + " is already on the hostqueue.");
			} else {
				this.say(room, realuser.name + " was added to the hostqueue" + (targTheme.length ? " for " + targTheme : "") + ".");
				Games.hosts.push([realuser.name, targTheme]);
			}
			return;
		}
		if (Games.hosts.length > 0) {
			let info = Games.hosts.shift();
			Games.hosts.push([realuser.name, targTheme]);
			this.say(room, realuser.name + " was added to the hostqueue" + (targTheme.length ? " for " + targTheme : "") + ".");
			this.say(room, "/wall **Survgame.** " + info[0] + " is hosting" + (info[1].length ? " **" + info[1] + "**" : "") + ". Type ``/me in`` to join. NOW");
			this.say(room, "/modnote HOST: [" + info[0] + "] hosted.");
			Games.host = Users.get(info[0]);
			Games.addHost(Games.host);
			Games.exportData();
		} else {
			Games.host = realuser;
			this.say(room, "/wall **Survgame.** " + realuser.name + " is hosting" + (targTheme.length ? " **" + targTheme + "**" : "") + ". Type ``/me in`` to join. NOW");
			this.say(room, "/modnote HOST: [" + realuser.name + "] hosted.");
			Games.addHost(realuser);
			Games.exportData();
		}
	},

	sethost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && Config.canHost.indexOf(user.id) === -1) return;
		if (Games.host) return room.say("__" + Games.host.name + "__ is currently hosting");
		let targUser = Users.get(Tools.toId(target));
		if (!targUser) return room.say("**" + target + "** is not currently in the room");
		Games.host = targUser;
		room.say("**" + targUser.name + "** has been set as the host.");
		room.say("/modnote " + targUser.name + " has been set as the host by " + user.name + ".");
	},

	dehost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		target = Tools.toId(target);
		if (target === "") {
			if (Games.host) {
				this.say(room, "The game was forcibly ended.");
			}
			Games.host = null;
			return;
		}
		if (Games.host && Games.host.id === target) {
			this.say(room, "The game was forcibly ended.");
			Games.host = null;
			return;
		}
		let i = 0,
			len = Games.hosts.length;
		for (; i < len; i++) {
			if (target === Tools.toId(Games.hosts[i][0])) {
				break;
			}
		}
		if (i !== len) {
			Games.hosts.splice(i, 1);
			return this.say(room, target + " was removed from the hosting queue.");
		}
		if (room.game) {
			room.game.forceEnd();
			return;
		}
	},

	subhost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Games.host) return room.say("No host is currently active.");
		user = Users.get(Tools.toId(target));
		if (!user) return room.say("You can only host somebody currently in the room.");
		Games.host = user;
		room.say("**" + Games.host.name + "** has subbed in as the host!");
		room.say("/modnote " + Games.host.name + " has subhosted");
	},

	userhosts: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return;
		if (!target) return user.say("Please specify a user.");
		let split = target.split(",");
		let realuser = split[0];
		let numDays = 7;
		if (split.length > 1) {
			numDays = Math.floor(Tools.toId(split[1]));
		}
		if (!numDays) {
			numDays = 7;
		}
		user.say(Games.getHosts(realuser, numDays));
	},

	nexthost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) {
			return this.say(room, "A game is currently in progress!");
		}
		if (Games.hosts.length === 0) {
			return this.say(room, "The hostqueue is empty.");
		}
		let info = ["", ""];
		while (Games.hosts.length > 0) {
			info = Games.hosts.shift();
			if (Users.get(info[0])) {
				break;
			} else {
				this.say(room, "**" + info[0] + "** is not online and could not be hosted!");
			}
		}
		if (Users.get(info[0])) {
			this.say(room, "survgame! " + info[0] + " is hosting" + (info[1].length ? " **" + info[1] + "**" : "") + "! Do ``/me in`` to join!");
			this.say(room, "/modnote HOST: " + info[0] + " hosted");
			Games.host = Users.get(info[0]);
			Games.addHost(info[0]);
			Games.points = null;
			Games.exportData();
		} else {
			this.say(room, "Nobody in the hostqueue could be hosted!");
		}
	},

	hostqueue: 'queue',
	que: 'queue',
	q: 'queue',
	queue: function (arg, user, room) {
		if (!Games.canQueue) return;
		if (user.hasRank(room.id, '%') || (Config.canHost.indexOf(user.id) !== -1)) {
			if (Games.hosts.length === 0) {
				this.say(room, 'There are no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					let it = i == 0 ? '' : '__'
					queueText += '**' + (i + 1) + '.** ' + it + Games.hosts[i][0] + it + (Games.hosts[i][1].length ? ", " + Games.hosts[i][1] : "") + " "; //add formatting here, down there just adds on to the end whoops
				}
				this.say(room, '/announce **Queue:** ' + queueText);
			}
		} else {
			if (Games.hosts.length === 0 && room.id.charAt(0) !== ',') {
				this.say(room, '/w ' + user.id + ', There are currently no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					let it = i == 0 ? '' : '__'
					queueText += '**' + (i + 1) + '.** ' + it + Games.hosts[i] + it + ' ';
				}
				if (room.id.charAt(0) === ',') this.say(room, '/announce **Queue:** ' + queueText);
				if (room.id.charAt(0) !== ',') this.say(room, '/w ' + user.id + ', /announce **Queue:** ' + queueText);
			}
		}
		Games.canQueue = false;
		var t = setTimeout(function () {
			Games.canQueue = true;
		}, 5 * 1000);
	},

	game: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room !== user) return;
		let survRoom = Rooms.get('survivor');
		if (Games.host) {
			return room.say("__" + Games.host.name + "__ is currently hosting.");
		} else if (survRoom.game) {
			return room.say("A game of **" + survRoom.game.name + "** is in progress.");
		} else {
			return room.say("No game is in progress.");
		}
	},

	/* MANAGE HOST BANS ---------------------------------------------------------------------------------------------------------------------*/

	hostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		if (!target) return room.say("Please provide a username.");
		let split = target.split(",");
		let targUser = Users.get(split[0]);
		if (!targUser) {
			targUser = {
				id: Tools.toId(split[0]),
				name: split[0],
			}
		}
		let numDays = parseInt(split[1]);
		if (!numDays) numDays = 3;
		Rooms.get('survivor').say("/modnote [" + targUser.id + "] has been hostbanned for " + numDays + " days by " + user.name + ".");
		return room.say(Games.hostBan(targUser, numDays));
	},

	hostbanned: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		if (Object.keys(Games.hostbans).length === 0) {
			return user.say("No users are currently hostbanned");
		} else {
			let msg = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><table align=\"center\" border=\"2\"><th>Name</th><th>Ban time</th>";
			msg += Object.keys(Games.hostbans).map(key => {
				return "<tr><td>" + Games.hostbans[key].name + "</td><td>" + Games.banTime(key) + "</td></tr>";
			}).join("");
			return Rooms.get('survivor').say("/pminfobox " + user.id + ", " + msg + "</table></div></div>");
		}

		//return room.say("Hostbanned users: " + Object.keys(Games.hostbans).map(t => Games.hostbans[t].name).join(", "));
	},

	unhostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		Rooms.get('survivor').say("/modnote [" + target + "] has been unhostbanned by " + user.name + ".");
		return room.say(Games.unHostBan(target));
	},

	bantime: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		return room.say(Games.banTime(target));
	}

};