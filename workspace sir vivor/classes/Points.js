'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 1000;

class DD {
	constructor() {
		this.dd = {};
		this.modlog = {};
		this.eventlog = {};
		this.authbattle = {};
		this.numSkips = 0;
		this.currentCycle = 0;
	}
	
	importData() {
		const readJSONOrDefault = function(path) {
			try {
				return JSON.parse(fs.readFileSync(path));
			}
			catch (e) {}

			return {};
		}

		this.dd = readJSONOrDefault('./databases/dd.json');
		this.modlog = readJSONOrDefault('./databases/modlog.json');
		this.authbattle = readJSONOrDefault('./databases/authbattle.json');
		this.eventlog = readJSONOrDefault('./databases/eventlog.json');
		this.currentCycle = readJSONOrDefault('./databases/currentcycle.json');

		if (!("data" in this.modlog)) {
			this.modlog.data = [];
		}
	}
	
	exportData() {
		fs.writeFileSync('./databases/dd.json', JSON.stringify(this.dd));
		fs.writeFileSync('./databases/modlog.json', JSON.stringify(this.modlog));
		fs.writeFileSync('./databases/authbattle.json', JSON.stringify(this.authbattle));
		fs.writeFileSync('./databases/eventlog.json', JSON.stringify(this.eventlog));
	}

	updateEventLog(message) {
		this.modlog.data.push(message);
		this.exportData();
	}

	isInLB(name) {
		let id = Tools.toId(name);
		return (id in this.dd);
    }

	addpoints (user, numPoints) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				points: numPoints,
				name: user,
				color: "000000",
				bgcolor: "ffffff",
				dexnum: 0,
				/*displaypoints: numPoints*/
				/*add extra displaypoints variable*/
			}
		} else {
			if (this.dd[id].points) {
				this.dd[id].points += numPoints;
			} else {
				this.dd[id].points = numPoints;
			}
		}
		this.exportData();
	}

  remPoints(user, numPoints) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				points: 0,
				name: user,
			}
		} else {
			if (this.dd[id].points) {
				this.dd[id].points -= numPoints;
			}
		}
		this.exportData();
	}

	getUserName(item) {
		return item[1];
    }

	getPoints(item) {
		return item[0];
	}

	getLogID(item) {
		return item[0];
	}

	getEventType(item) {
		return item[1];
	}

	getEventWinner(item) {
		return item[2];
	}

	createEventLogEntry(logID, eventType, username) {
		this.eventlog[logID] = {
			logid: logID,
			event: eventType,
			winner: username,
		}

		this.exportData();
	}

	addlog(logEntry) {
		this.eventlog[logEntry.logid] = logEntry;
	}

	removelog(logID) {
		try {
			delete this.eventlog[logID];
		}
		catch (Error) {
			user.say("Entry not found");
		}
	}

	getEventLogData() {
		let res = [];

		for (let id in this.eventlog) {
			let item = this.eventlog[id];
			res.push([item.logid, item.event, item.winner]);
		}
		return res; 
    }

	getEventLogHTML(eventLogData) {
		let str = ' ';
		for (let i=0 ; i < eventLogData.length ; i++) {
			str += eventLogData[i][0] + ' ' + eventLogData[i][1] + ' ' + eventLogData[i][2] + '<br>';
		}
		console.log("yo2");
		return str;
    }
	/*
	getDisplayPoints(item) {
		return item[4];
	}
	
	updateDisplayPoints(user, newvalue) {
		let name = user.trim();
		let id = Tools.toId(name);
		this.dd[id].displaypoints = newvalue;
	}
	*/
	settextcolor(user, hexcolor) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				points: 0,
				name: user,
				color: hexcolor,
			}
		} else {
			if (this.dd[id].color) {
				this.dd[id].color = hexcolor;
			} else {
				this.dd[id].color = hexcolor;
			}
		}
	}

	setbgcolor(user, hexcolor) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				points: 0,
				name: user,
				bgcolor: hexcolor,
			}
		} else {
			if (this.dd[id].color) {
				this.dd[id].bgcolor = hexcolor;
			} else {
				this.dd[id].bgcolor = hexcolor;
			}
		}
	}

	setDexNum(user, arg) {
		let name = user.trim();
		let id = Tools.toId(name);
		let dex = Number(arg.trim());

		if (!(id in this.dd)) {
			this.dd[id] = {
				points: 0,
				name: user,
				color: "000000",
				bgcolor: "ffffff",
				dexnum: dex,
			}
		} else {
				this.dd[id].dexnum = dex;
		}
    }


	getTextColor(item) {
		if (item[2])
			return '#' + item[2];
		else
			return '#000000'
	}

	getDexNum(item) {
		if (item[4]) {
			return item[4];
		}
		else return 0;
	}

	getBgColor(item) {
		if (item[3])
			return '#' + item[3];
		else
			return '#FFFFFF'
	}

	getSorted() {
		let items = [];
		for (let id in this.dd) {
			let item = this.dd[id];
			items.push([item.points || 0, item.name, item.color, item.bgcolor, item.dexnum]);
		}
		items.sort(function(first, second) {
			let points1 = dd.getPoints(first);
			let points2 = dd.getPoints(second);
			if (points1 !== points2) return points2 - points1;
			if (first[1] !== second[1]) return second[1] - first[1];
			if (first[2] !== second[2]) return second[2] - first[2];
			if (first[3] !== second[3]) return second[3] - first[3];
			return second[4] > first[4];
		});
		return items;
	}

	processLbData(items, num) {
		let res = [];
		let vanity = [];

		if (!num || num < 1) num = 50;
		if (num > items.length) num = items.length;

		//process data from ranks [num-50] to [num]
		for (let i = Math.max(0, num - 50); i < num; i++) {
			let rank = i+1;
			let cur = this.getUserName(items[i]);
			let points = this.getPoints(items[i]);
			let bgcolor = this.getBgColor(items[i]);
			let textcolor = this.getTextColor(items[i]);
			let dexNum = this.getDexNum(items[i]);
			let h = hostcount.count[toId(cur)] ? hostcount.count[toId(cur)] : 0;
			let n = gamecount.count[toId(cur)] ? gamecount.count[toId(cur)] : 0;

			//push everything into arrays
			res.push([rank,cur, points, n, h]);
			vanity.push([bgcolor, textcolor, dexNum]);
		}

		return [res, vanity];
	}

	getLbHtml(items) {
		const ROW_HEIGHT = 30;
		const DEFAULT_ALIGN = "center";
		const FONT_WEIGHT = 'bold';
		const LEFT_RIGHT_PADDING = 5;
		const POKE_SPRITE_COLS = 12;
		const POKEMON_SPRITE_WIDTH = 40;
		const POKEMON_SPRITE_HEIGHT = 30;

		let str, strx, strs = [];
		let sheet_pos_x, sheet_pos_y;
		let bgcolor, textcolor, dexNum;

		const lbData = items[0];
		const lbVanity = items[1];

		// Table styles
		str = '<div> ';
		str += `<table border="2" ; align="${DEFAULT_ALIGN}" ` +
			'style="background-color:#FFFFFF ; ' +
			`font-weight:${FONT_WEIGHT} ; text-align:${DEFAULT_ALIGN}; color: black"> `;

		str+= `<tr><th colspan="5" style="font-weight: bold ; font-size: 1.5em">Cycle ${dd.currentCycle}</th></tr>`;

		// Column labels
		str += ` <tr style="height:15px ; font-size:1.2em">` +
			`<td style="padding:0px ${LEFT_RIGHT_PADDING}px;"> Rank </td> ` +
			`<td style="padding:0px ${LEFT_RIGHT_PADDING}px ; text-align:left;"> Name </td> ` +
			`<td style="padding:0px ${LEFT_RIGHT_PADDING}px;"> Points </td> ` +
			`<td style="padding:0px ${LEFT_RIGHT_PADDING}px;"> Games </td> ` +
			`<td style="padding:0px ${LEFT_RIGHT_PADDING}px;"> Hosts </td> ` +
			`</tr> `;

		// The rest of the Table
		for (let i = 0; i < lbData.length; i++) {
			if (!lbData) continue;
			bgcolor = lbVanity[i]['0'];
			textcolor = lbVanity[i]['1'];
			dexNum = lbVanity[i]['2'];

			// add a row
			strx = `<tr style="background:${bgcolor} ; color:${textcolor} ; ` + `height: ${ROW_HEIGHT}px ;"> `;
			for (let ln in lbData[i]) {
				let j = lbData[i][ln];

				if (ln != '1') strx += '<td>' + j + '</td> ';																		//add data
				else if (ln == '1' && dexNum == "0") strx += '<td style="padding: 0px 5px ; text-align:left;"> ' + j + ' </td> ';		//special formatting for name column
				else if (dexNum != 0) {																								//special formatting for name w/ pokemon sprite
					sheet_pos_y = (Math.floor(dexNum / POKE_SPRITE_COLS)) * 30 * -1;
					sheet_pos_x = (dexNum % POKE_SPRITE_COLS * 40) * -1;
					strx += `<td style="position:relative ; text-align:left ; padding:0px ${LEFT_RIGHT_PADDING + POKEMON_SPRITE_WIDTH}px 0px ${LEFT_RIGHT_PADDING}px ;"> ` + j + ` <div style="display:inline-block ; position:absolute ; right:0px ; bottom:0px ; background-image: url(https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v16) ; background-repeat:no-repeat ; background-position:${sheet_pos_x}px ${sheet_pos_y}px; width:${POKEMON_SPRITE_WIDTH}px ; height:${POKEMON_SPRITE_HEIGHT}px ;"> </div> </td> `;
				}
			}
			strs.push(strx + "</tr> ");
		}
		str += strs.join("");
		str += "</table> </div>";

		return str;
	}
	
	updateModlog(message) {
		this.modlog.data.push(message);
		this.exportData();
	}
	
	
	authhunt_battle(user, challenger, winner) {
		if (!(challenger in this.authbattle)) {
			this.authbattle[challenger] = {}
		}
		if (!(user in this.authbattle[challenger])) {
			let result = winner == challenger;
			this.authbattle[challenger][user] = result;
		} else {
			return false;
		}
		this.exportData();
		return true;
	}

	wins_losses(user) {
		if (!(user in this.authbattle) || this.authbattle.length<1) {
			return [[],[]];
		}
		let di = this.authbattle[user];
		let wins = [];
		let losses = [];
		for (var key in di) {
			if (di[key] == true) wins.push(key);
			else losses.push(key)
		}
		return [wins,losses]
	}

	authhunt_status(user) {
		let battles = this.wins_losses(user)
		let wins = battles[0];
		let losses = battles[1];
		if (wins.length <1 && losses.length<1) return "You have 0 battles recorded.";
		let message = '';
		if (wins.length > 0) {
			message = '**Wins:**';
			for (var v of wins) message = message + ' ' + v;
			message = message + '\n';
		}
		if (losses.length > 0) {
			message = '**Losses:**'
			for (var v of losses) message = message + ' ' + v;
		}
		return message;
	}

	authhunt_getlist(auth) {
		let fights = [];
		for (var user in this.authbattle) {
			if (auth in this.authbattle[user]) fights.push(user);
		}
		if (fights.length<1) return "Empty :/";
		return "**LIST:** "+fights.join(', ');
	}

	add_authunt_points() {
		for (var user in this.authbattle) {
			let points_to_be_added = 5*(this.wins_losses(user)[0].length);
			this.addpoints(user,points_to_be_added);
		}
	}

	clear_authhunt_records() {
		this.authbattle = {};
		this.exportData();
	}

	set_current_cycle(cycle) {
		this.currentCycle = cycle;
		fs.writeFileSync('./databases/currentcycle.json', JSON.stringify(this.currentCycle));
	}
}

let dd = new DD();
dd.backupInterval = setInterval(() => dd.exportData(), BACKUP_INTERVAL);

module.exports = dd;
