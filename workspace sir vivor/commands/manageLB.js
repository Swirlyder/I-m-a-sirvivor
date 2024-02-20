   /***********************************************
	*          LEADERBOARD MANAGEMENT             *
	***********************************************/

module.exports = {

	settextcolor: function (target, user, room) {
		//input check
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();

		//the meat and potatoes
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.settextcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the text color of **" + username.trim() + "**, on the leaderboard.");
	},

	setbgcolor: function (target, user, room) {
		//input check
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();

		//the meat and potatoes
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.setbgcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the background color of **" + username.trim() + "**, on the leaderboard.");
	},

	setpoke: function (target, user, room) {
		//input check
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the Pokedex number they desire.");
		let username = split[0];
		let pokemonDexNum = split[1].trim();

		//the meat and potatoes
		if (pokemonDexNum > 0 && pokemonDexNum <= 1025) {
			dd.setDexNum(username, pokemonDexNum)
			user.say(username + "\'s LB sprite has been set to...");
			return user.say(`!dt ${pokemonDexNum}`);
		}
		else return user.say("Invalid Dex number: number must be between 1 and 1025.");

    },

	lb: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		const num = parseInt(target);

		// Process data
		let sorted = dd.getSorted();
		const processedData = dd.processLbData(sorted, num);

		// Construct HTML code
		const lb_HTML = dd.getLbHtml(processedData);

		// Dislplay LB
		if (room.id === user.id) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, lb, ${lb_HTML}`);
		}
		else {
			Parse.say(room, `/addhtmlbox <div style="max-height:300px;overflow:auto">${lb_HTML}</div>`);
		}
	},

	rename: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 2) return user.say("You must specify an old and new username");
		let realt = Tools.toId(split[0])
		if (!(realt in dd.dd)) {
			return user.say("**" + split[0] + "** is not on the dd leaderboard.");
		} else {
			let newid = Tools.toId(split[1]);
			let newdata = (newid in dd.dd ? dd.dd[newid] : {});
			let oldname = dd.dd[realt].name;
			dd.dd[newid] = dd.dd[realt];
			if (realt !== newid) {
				for (let i in newdata) {
					dd.dd[newid][i] += newdata[i];
				}
			}
			dd.dd[newid].name = split[1].trim();

			if (newid in dd.dd) {
				gamecount.count[newid] += gamecount.count[toId(realt)];
				let h = hostcount.count[toId(realt)] ? hostcount.count[toId(realt)] : 0;
				let e = eventcount.count[toId(realt)] ? eventcount.count[toId(realt)] : 0;
				hostcount.add(newid, h);
				eventcount.add(newid, e);
			} else {
				gamecount.count[newid] = gamecount.count[toId(realt)];
				hostcount.count[newid] = hostcount.count[toId(realt)];
				eventcount.count[newid] = eventcount.count[toId(realt)];
			}

			if (realt !== newid) {
				delete dd.dd[realt];
				delete hostcount.count[toId(realt)];
				delete gamecount.count[toId(realt)];
				delete eventcount.count[toId(realt)];
			}
			return user.say("**" + oldname + "** has been renamed to **" + split[1].trim() + "**.");
		}
	},

	removeuser: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let userToRemove = Tools.toId(target);
		if (!(userToRemove in dd.dd)) {
			return user.say("**" + split[0] + "** is not on the leaderboard.");
		} else {
			let name = dd.dd[userToRemove].name;
			delete dd.dd[userToRemove];
			delete hostcount.count[toId(userToRemove)];
			delete gamecount.count[toId(userToRemove)];
			delete eventcount.count[toId(userToRemove)];
			return user.say("**" + name + "** has been removed from the leaderboard.")
		}
	},

	clearlb: function (target, user, room) {
		if (!user.hasRank('survivor', '#')) return;
		if (user.lastcmd !== 'clearlb') return room.say("Are you sure you want to clear the dd leaderboard? If so, type the command again.");
		dd.dd = {};
		dd.numSkips = 0;
		dd.exportData();
		hostcount.count = {};
		gamecount.count = {};
		eventcount.count = {};
		eventcount.save();
		hostcount.save();
		gamecount.save();
		return room.say("The dd leaderboard has been reset.");
	},

//Ignore, work in progress
/*	eventlog: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let split = target.split(",");
		if (!target) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, eventlog, test`);
			//show eventlog in pm [eventlog formatting done here]
			// retreive event log
			// format text [date] Event: [Event] Winner: [User], use addhtml
		}
		else if (split.length == 2) {
			if (split[0] == '1day' || split[0] == '2day+' || split[0] == 'showdown' || split[0] == 'bossbattle' || split[0] == 'deathmatch') {
				parse.say(room, 'did');
			}
			else {
				parse.say(room, 'Event type not available. Here are the options for envents: "1day", "2day+", "showdown", "bossbattle", or "deathmatch"');
			}
		}
		//check for valid input
		//input is valid: add to event log [date] [event] [user]
		//eventLogEntry = {
		//	date: currentTime,
		//	eventType: target[0],
		//	user: target[1]
		//}
	}*/
}
