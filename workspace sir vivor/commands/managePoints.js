const hostcount = require('../modules/hostcount.js');
hostcount.load();

module.exports = {
	addspecial: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of points and the user to add them to.");
		let username = split[0].trim();
		let numPoints = parseInt(split[1]);
		if (!numPoints) return user.say("'" + split[1] + "' is not a valid number of points to add.");
		dd.addpoints(username, numPoints);
		let modlogEntry = {
			command: "addspecial",
			user: user.id,
			points: [numPoints, username],
			first: false,
			second: false,
			host: false,
			part: false,
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + numPoints + "** have been added to **" + username.trim() + "** on the leaderboard.");
	},

	addpointsbot: 'addbot',
	addbot: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length < 2) return user.say("You must specify the number of players, followed by the winner and runner-up.");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length != numPlayers + 1 && !user.hasRank('survivor', '#')) return user.say("You must supply all players as arguments. ROs can bypass this if it's really necessary");
		if (split.length < 3 && numPlayers > 6) return user.say("Please also specify the runner up for games with 7+ players.");
		let first = split[1].trim();
		let firstpoints = 0;
		let secondpoints = 0;
		if (numPlayers < 7) {
			return user.say("Bot hosted games with at least 7 players are worth points.");
		} else if (numPlayers < 10) {
			firstpoints = 7;
			secondpoints = 2;
		} else if (numPlayers >= 10) {
			firstpoints = 9;
			secondpoints = 4;
		}
		dd.addpoints(first, firstpoints);
		let second = split[2].trim();
		dd.addpoints(second, secondpoints);
		for (let i = 0; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addbot",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: false,
			part: false,
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		return user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
	},

	revertpoints: 'rpoints',
	undopoints: 'rpoints',
	rpoints: function (arg, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		let last = dd.modlog.data.pop();
		if (last.first) {
			dd.remPoints(last.first[1], last.first[0]);
			gamecount.add(last.first[1], -1);
		}
		if (last.second) {
			dd.remPoints(last.second[1], last.second[0]);
			gamecount.add(last.second[1], -1);
		}
		if (last.host) {
			dd.remPoints(last.host[1], last.host[0]);
			hostcount.add(last.host[1], -1);
			gamecount.add(last.host[1], -1);
		}
		if (last.part) {
			let points = last.part.shift();
			for (let i of last.part) {
				dd.remPoints(i, points);
				gamecount.add(i, -1);
			}
		}
		if (last.special) dd.remPoints(last.special[1], last.special[0]);
		user.say('Point award reverted.');
	},

	remspecial: 'removespecial',
	remspec: 'removespecial',
	removespecial: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of points and the user to remove them from.");
		let username = split[0];
		let numPoints = parseInt(split[1]);
		if (!numPoints) return user.say("'" + split[1] + "' is not a valid number of points to remove.");
		dd.remPoints(username, numPoints);
		return user.say("**" + numPoints + "** have been removed from **" + username.trim() + "** on the leaderboard.");
	},

	addgame: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of games and the user to add them to.");
		let username = split[0];
		let numGames = parseInt(split[1]);
		if (!numGames) return user.say("'" + split[1] + "' is not a valid number of games to add.");
		gamecount.add(username, numGames);
		return user.say("**" + numGames + "** games have been added to **" + username.trim() + "** on the leaderboard.");
	},

	removegame: 'remgame',
	remgame: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of games and the user to remove them from.");
		let username = split[0];
		let numGames = parseInt(split[1]);
		if (!numGames) return user.say("'" + split[1] + "' is not a valid number of games to remove.");
		gamecount.add(username, -numGames);
		return user.say("**" + numGames + "** games have been removed from **" + username.trim() + "** on the leaderboard.");
	},

	addhostlb: 'addhostcount',
	addhostcount: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of hosts and the user to add them to.");
		let username = split[0];
		let numHosts = parseInt(split[1]);
		if (!numHosts) return user.say("'" + split[1] + "' is not a valid number of hosts to add.");
		hostcount.add(username, numHosts);
		gamecount.add(username, numHosts);
		return user.say("**" + numHosts + "** hosts have been added to **" + username.trim() + "** on the leaderboard.");
	},

	removehostcount: 'remhostcount',
	removehostlb: 'remhostcount',
	remhostcount: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of hosts and the user to remove them from.");
		let username = split[0];
		let numHosts = parseInt(split[1]);
		if (!numHosts) return user.say("'" + split[1] + "' is not a valid number of hosts to remove.");
		hostcount.add(username, -numHosts);
		gamecount.add(username, -numHosts);
		return user.say("**" + numHosts + "** hosts have been removed from **" + username.trim() + "** on the leaderboard.");
	},

	addpointsuser: 'adduser',
	addpoints: 'adduser',
	adduser: function (target, user, room) {
		if (!target) return; //user.say("No target found :" + target);
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the rest of the players.");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length < 4 && numPlayers >= 6) return user.say("Please specify the runner-up and participants.");
		if (split.length < 5 && numPlayers >= 6) return user.say("Please specify all players who took part.")
		if (numPlayers >= 4 && split.length != numPlayers + 2) return user.say("Please check the number of players.");
		if (split.length != numPlayers + 2 && !user.hasRank('survivor', '#')) return user.say("You must supply all players as arguments. ROs can bypass this if it's really necessary");
		let host = split[1].trim();
		if (numPlayers >= 4) hostcount.add(host, 1);
		let first = split[2].trim();
		let hostpoints = 0;
		let firstpoints = 0;
		let secondpoints = 0;
		let partpoints = 0;

		if (numPlayers < 4) {
			return user.say("User hosted games with at least 4 players are worth points.");
		} else {

			partpoints = numPlayers - 3;
			hostpoints = partpoints * 3;

			let probOfLosing = (numPlayers - 2) / numPlayers;
			let sumFirstAndSecond = (hostpoints - partpoints * probOfLosing) * numPlayers;

			if (numPlayers < 6) {
				secondpoints = partpoints;
				firstpoints = sumFirstAndSecond - secondpoints;
			} else {
				firstpoints = (sumFirstAndSecond + numPlayers * 4) / 2;
				secondpoints = Math.round(sumFirstAndSecond - firstpoints);
			}

		}

		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		let second = split[3].trim();
		dd.addpoints(second, secondpoints);
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				//if (numPlayers < 6) partlist = second.trim() + ", " + part.trim(); else
				partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "adduser",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		if (partpoints !== 0) return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},

	addpointsofficial: 'addfish',
	addfish: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the remaining players");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (numPlayers >= 6 && split.length != numPlayers + 2) return user.say("Please check the number of players.");
		if (split.length != numPlayers + 2 && !user.hasRank('survivor', '#')) return user.say("You must supply all players as arguments. ROs can bypass this if it's really necessary");
		let host = split[1].trim();
		if (numPlayers >= 6) hostcount.add(host, 1);
		let first = split[2].trim();
		let second = split[3].trim();
		let hostpoints = 0;
		let firstpoints = 0;
		let secondpoints = 0;
		let partpoints = 0;

		if (numPlayers < 6) {
			return user.say("Official games with at least 6 players are worth points.");
		} else {
			//dummy variables!!!
			let minus = numPlayers - 1;
			let partpointsUserMinus = minus - 3;
			let hostpointsUserMinus = partpointsUserMinus * 3;

			let probOfLosingUserMinus = (minus - 2) / minus;
			let sumFirstAndSecondUserMinus = (hostpointsUserMinus - partpointsUserMinus * probOfLosingUserMinus) * minus;

			let secondpointsUserMinus = 0;
			let firstpointsUserMinus = 0;
			if (numPlayers < 6) {
				secondpointsUserMinus = partpointsUserMinus;
				firstpointsUserMinus = sumFirstAndSecondUserMinus - secondpointsUserMinus;
			} else {
				firstpointsUserMinus = (sumFirstAndSecondUserMinus + minus * 4) / 2;
				secondpointsUserMinus = sumFirstAndSecondUserMinus - firstpointsUserMinus;
			}
			//above calculates for numPlayers-1 (minus)

			let partpointsUser = numPlayers - 3;
			let hostpointsUser = partpointsUser * 3;

			let probOfLosingUser = (numPlayers - 2) / numPlayers;
			let sumFirstAndSecondUser = (hostpointsUser - partpointsUser * probOfLosingUser) * numPlayers;

			let secondpointsUser = 0;
			let firstpointsUser = 0;
			if (numPlayers < 6) {
				secondpointsUser = partpointsUser;
				firstpointsUser = sumFirstAndSecondUser - secondpointsUser;
			} else {
				firstpointsUser = (sumFirstAndSecondUser + numPlayers * 4) / 2;
				secondpointsUser = sumFirstAndSecondUser - firstpointsUser;
			}

			//above calculates for numPlayers

			firstpoints = firstpointsUserMinus * 2;

			secondpoints = firstpointsUser;

			partpoints = Math.ceil(partpointsUser * 1.5);

			/*set hostpoints to expected points on average based on the above values */
			hostpoints = Math.ceil(firstpoints / numPlayers + secondpoints / numPlayers + partpoints * ((numPlayers - 2) / numPlayers));
		}

		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		dd.addpoints(second, secondpoints);
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				if (numPlayers < 6) partlist = second.trim() + ", " + part.trim();
				else partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		if (numPlayers >= 6) user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addfish",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},

	addpointssurvivorshowdown: 'addss',
	addss: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '+')) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the remaining players");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length != numPlayers + 2) return user.say("Please check the number of players.");
		let host = split[1].trim();
		hostcount.add(host, 1);
		let first = split[2].trim();
		let second = split[3].trim();
		let hostpoints = 8;
		let firstpoints = 15;
		let secondpoints = 10;
		let partpoints = 3;

		//Calculating for deathmatch points......

		//dummy variables!!!
		let minus = numPlayers - 1;
		let partpointsUserMinus = minus - 3;
		let hostpointsUserMinus = partpointsUserMinus * 3;

		let probOfLosingUserMinus = (minus - 2) / minus;
		let sumFirstAndSecondUserMinus = (hostpointsUserMinus - partpointsUserMinus * probOfLosingUserMinus) * minus;

		let secondpointsUserMinus = 0;
		let firstpointsUserMinus = 0;
		if (numPlayers < 6) {
			secondpointsUserMinus = partpointsUserMinus;
			firstpointsUserMinus = sumFirstAndSecondUserMinus - secondpointsUserMinus;
		} else {
			firstpointsUserMinus = (sumFirstAndSecondUserMinus + minus * 4) / 2;
			secondpointsUserMinus = sumFirstAndSecondUserMinus - firstpointsUserMinus;
		}
		//above calculates for numPlayers-1 (minus)

		let partpointsUser = numPlayers - 3;
		let hostpointsUser = partpointsUser * 3;

		let probOfLosingUser = (numPlayers - 2) / numPlayers;
		let sumFirstAndSecondUser = (hostpointsUser - partpointsUser * probOfLosingUser) * numPlayers;

		let secondpointsUser = 0;
		let firstpointsUser = 0;
		if (numPlayers < 6) {
			secondpointsUser = partpointsUser;
			firstpointsUser = sumFirstAndSecondUser - secondpointsUser;
		} else {
			firstpointsUser = (sumFirstAndSecondUser + numPlayers * 4) / 2;
			secondpointsUser = sumFirstAndSecondUser - firstpointsUser;
		}

		//above calculates for numPlayers

		firstpoints = firstpointsUserMinus * 2;

		secondpoints = firstpointsUser;

		partpoints = Math.ceil(partpointsUser * 1.5);

		/*set hostpoints to expected points on average based on the above values */
		hostpoints = Math.ceil(firstpoints / numPlayers + secondpoints / numPlayers + partpoints * ((numPlayers - 2) / numPlayers));

		//Deathmatch points calculated. 

		firstpoints = Math.floor(firstpoints * 1.25);
		secondpoints = Math.floor(secondpoints * 1.25);
		partpoints = Math.floor(partpoints * 1.25);
		hostpoints = Math.floor(hostpoints * 1.25);

		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		dd.addpoints(second, secondpoints);
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				// if (numPlayers < 6) partlist = second.trim() + ", " + part.trim(); else
				partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addss",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},

	pointlog: function (arg, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		let data = dd.modlog.data.reverse();
		if (!data.length) return user.say("There are no recorded point log actions.");
		let args = arg.split(',');
		let full = toId(args[0]) === "full";
		if (!full && args.length > 1) full = toId(args[1]) === "full";
		let search = false;
		if (args[0] && args[0] !== "full") search = args.map(x => toId(x));
		else if (args[1] && args[1] !== "full") search = args.slice(1).map(x => toId(x));
		let units = [];
		let conv = {
			"adduser": "User",
			"addbot": "Bot",
			"addspecial": "Special",
			"addfish": "Official"
		}
		let ret = [''];
		let n = 0;
		if (!full && data.length > 100) ret[n] += "Only showing the last 100 results. To view the full point log use <code>.pointlog full</code>";
		for (let i of data) {
			if (units.length === 100 && !full) break;
			let searchstr = `${toId(i.command)} ${toId(conv[i.command])} ${toId(i.user)}`;
			if (i.command === "addspecial") {
				searchstr += ` ${i.points[1]}`;
			} else {
				if (i.host) searchstr += ` ${toId(i.host[1])}`;
				if (i.first) searchstr += ` ${toId(i.first[1])}`;
				if (i.second) searchstr += ` ${toId(i.second[1])}`;
				if (i.part)
					for (let nom of i.part.slice(1)) searchstr += ` ${toId(nom)}`;
			}
			if (search) {
				let found = false;
				for (let cue of search) {
					if (!searchstr.includes(cue)) found = true;
				}
				if (found) continue;
			}

			let date = new Date(i.date);
			date = `[${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}]`;

			let unit = `<details><summary><b>${conv[i.command]}</b> by ${i.user}</summary>`;
			unit += `${date}<br>`;
			if (i.command === "addspecial") {
				unit += `User (${i.points[0]}): <i>${i.points[1]}</i>`;
			} else {
				if (i.host) unit += `Host (${i.host[0]}): <i>${i.host[1]}</i><br>`;
				if (i.first) unit += `First (${i.first[0]}): <i>${i.first[1]}</i><br>`;
				if (i.second) unit += `Second (${i.second[0]}): <i>${i.second[1]}</i><br>`;
				if (i.part) unit += `Participation (${i.part[0]}): <i>${i.part.slice(1).join(', ')}</i><br>`;
			}
			unit += `</details>`
			units.push(unit);
		}
		dd.modlog.data.reverse();
		for (let i of units) {
			if (ret[n].length + i.length <= 100000) ret[n] += i;
			else {
				n += 1;
				ret[n] = '';
				ret[n] += i;
			}
		}
		for (let i of ret) Rooms.get('survivor').say(`/pminfobox ${user.id}, ${i}`);
	},

	points: function (target, user, room) {
		if (room.id !== user.id) return;
		target = Tools.toId(target);
		if (!target) target = user.id;
		if (!(target in dd.dd)) {
			return user.say("**" + target + "** does not have any points.");
		}
		let sorted = dd.getSorted();

		for (let i = 0; i < sorted.length; i++) {
			let stuff = sorted[i];
			if (Tools.toId(stuff[1]) === target) {
				return user.say("**" + stuff[1].trim() + "** is #" + (i + 1) + " on the leaderboard with " + (dd.getPoints(stuff)) + " points");
			}
		}
	},

	hostcount: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let points = [];

		for (let i in hostcount.count) {
			points.push([
				i,
				hostcount.count[i]
			]);
		}

		points.sort((a, b) => {
			return b[1] - a[1];
		});

		let ret = `<center><div style="padding:80px"><b>Host count</b>`;
		for (let i in points) {
			let place = Number(i) + 1;
			let username = points[i][0];
			let count = points[i][1]

			ret += "<br>" + place + ". " + username + ": " + count;
		}
		ret += "</div>"

		return this.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, hostcount, ${ret} </center>`);
	}
};