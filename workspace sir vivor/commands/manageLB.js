   /***********************************************
	*          LEADERBOARD MANAGEMENT             *
	***********************************************/

module.exports = {

	settextcolor: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.settextcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the text color of **" + username.trim() + "**, on the leaderboard.");
	},

	setbgcolor: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.setbgcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the background color of **" + username.trim() + "**, on the leaderboard.");
	},

	lb: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		let isempty = true;
		let sorted = dd.getSorted();
		let num = parseInt(target);
		if (!num || num < 1) num = 50;
		if (num > sorted.length) num = sorted.length;
		let str = "<div><table align=\"center\" border=\"2\"><tr>";
		let indices = ["Rank", "Name", "Points", "Games", "Hosts"];
		for (let i = 0; i < indices.length; i++) {
			str += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
		}
		str += "</tr>";

		let res = [];
		for (let i = 0; i < sorted.length; i++) {
			let cur = sorted[i][1];
			let points = dd.getPoints(sorted[i]);
			let bgcolor = dd.getBgColor(sorted[i]);
			let textcolor = dd.getTextColor(sorted[i]);
			/*let displaypoints = dd.getDisplayPoints(sorted[i]);*/

			if (points === 0) continue;
			let h = hostcount.count[toId(cur)] ? hostcount.count[toId(cur)] : 0;
			let n = gamecount.count[toId(cur)] ? gamecount.count[toId(cur)] : 0;
			let e = eventcount.count[toId(cur)] ? eventcount.count[toId(cur)] : 0;
			if (!n) n = "Error";
			/*
			points = Math.floor((50 * (points/n) * ((1.1*n*n)/(n*n+80) + (n/225)) + ((h*h+100)/50)));
			
			if (displaypoints >= points) {
				points = displaypoints;	
			} else {
				dd.updateDisplayPoints(cur, points);
			}
			
			points += e;
			*/
			res.push([
				cur,
				points,
				n,
				h,
				bgcolor,
				textcolor
			]);
		}

		res.sort((a, b) => {
			return b[1] - a[1];
		})

		let colours = res.map(x => [x[4], x[5]]);
		for (let x of res) {
			x.splice(4, 1);
			x.splice(4, 1);
		}

		let strs = [];
		for (let i = Math.max(0, num - 50); i < num; i++) {
			if (!res[i]) continue;
			let strx = "<tr>";
			strx += `<td height="30px"; align="center" style="background:${colours[i][0]};color:${colours[i][1]}"><b>` + (i + 1) + "</b></td>";
			for (let ln in res[i]) {
				let j = res[i][ln];
				strx += `<td height="30px"; align="center" style="background:${colours[i][0]};color:${colours[i][1]}"><b>` + j + "</b></td>";
			}
			strs.push(strx + "</tr>");
		}
		str += strs.join("");
		str += "</table></div>";
		if (room.id === user.id) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, lb, ${str}`);
		}
		else {
			Parse.say(room, `/addhtmlbox <div style="max-height:300px;overflow:auto">${str}</div>`);
		}
		let numFirsts = 0;
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
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
	}
};