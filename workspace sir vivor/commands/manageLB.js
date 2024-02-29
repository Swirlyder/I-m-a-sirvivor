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
		if (pokemonDexNum >= 0 && pokemonDexNum <= 1579) {
			dd.setDexNum(username, pokemonDexNum);
			if (pokemonDexNum == 0) return user.say(username + "\'s LB sprite has been removed");
			if (pokemonDexNum > 1025) return user.say(username + "\'s LB sprite has been set to an alternate pokemon form or CAPmon.");
			user.say(username + "\'s LB sprite has been set to...");
			return user.say(`!dt ${pokemonDexNum}`);
		}
		else return user.say("Invalid Dex number: input 0 to remove, 1-1025 for pokemon base form, 1026-1579 for other forms.");

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

	//work in progress
	/*
	logevent: function (target, user, room) {
		if (!target) return;
		let args = target.split(",");
		let action = args[0].trim();
		let arg1 = args[1] ? args[1].trim() : null;
		let arg2 = args[2] ? args[2].trim() : null;

		if (action == 'add' && arg2) {
			let logID = Math.floor(Math.random() * 9999);
			const eventType = arg1;
			const name = arg2;

			dd.createEventLogEntry(logID, eventType, name);
			return user.say("YUUUP");
		}
		else return user.say("add Error: bad input");
		if (action == 'remove' & arg1) {
			let logID = arg1;
			dd.removelog(logID);
		}
		else return user.say("remove Error: bad input");
	},
	*/

	//work in progress
	/*
	eventlog: function (target, user, room) {
		const data = dd.getEventLogData();
		const eventLogHTML = dd.getEventLogHTML(data);
		if (room.id === user.id) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, lb, ${eventLogHTML}`);

		}
		else {
			console.log("yo4");
			Parse.say(room, `/addhtmlbox <div style="max-height:300px;overflow:auto">${eventLogHTML}</div>`);
		}
	},
	*/

	//work in progress, only calcs seasonal points of top ten of cycle
	calcseasonal(target, user, room) {
		//get top ten users
		const sorted = dd.getSorted();
		let res = [];
		let str = "<table>";
		for (let i = 0; i < 10 ; i++)
		{
			let item = sorted[i];
			let username = sorted[i][1];
			let seasonalPoints = Math.floor(item[0] / 10);
			str += '<tr><td>' + username + '</td>' + '<td>+' + seasonalPoints + "</td></tr>";
			res.push([username, seasonalPoints]);
		}
		str += '</table>';

		if (room.id === user.id) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, lb, ${str}`);

		}
		else {
			Parse.say(room, `/addhtmlbox <div style="max-height:300px;overflow:auto">${str}</div>`);
		}

		//get event winners

		//calc top ten seasonal
		//cal even winners seasonal
    }
}