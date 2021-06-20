'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 1000;

class DD {
	constructor() {
		this.dd = {};
		this.modlog = {};
		this.authbattle = {};
		this.numSkips = 0;
	}

	importData() {
		let file = '{}';
		try {
			file  = fs.readFileSync('./databases/dd.json').toString();
		} catch (e) {}
		this.dd = JSON.parse(file);
		file = '{}';
		try {
			file = fs.readFileSync('./databases/modlog.json').toString();
		} catch (e) {}
		this.modlog = JSON.parse(file);
		try {
			file = fs.readFileSync('./databases/authbattle.json').toString();
		} catch (e) {}
		this.authbattle = JSON.parse(file);
		if (!("data" in this.modlog)) {
			this.modlog.data = [];
		}
	}

	exportData() {
		fs.writeFileSync('./databases/dd.json', JSON.stringify(this.dd));
		fs.writeFileSync('./databases/modlog.json', JSON.stringify(this.modlog));
		fs.writeFileSync('./databases/authbattle.json', JSON.stringify(this.authbattle));
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
				displaypoints: numPoints
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

	getPoints(item) {
		return item[0];
	}
	
	getDisplayPoints(item) {
		return item[4];
	}
	
	updateDisplayPoints(user, newvalue) {
		let name = user.trim();
		let id = Tools.toId(name);
		this.dd[id].displaypoints = newvalue;
	}

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

	getTextColor(item) {
		if (item[2])
			return '#' + item[2];
		else
			return '#000000'
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
			items.push([item.points || 0, item.name, item.color, item.bgcolor]);
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
	
	getDisplaySorted() {
		let items = [];
		for (let id in this.dd) {
			let item = this.dd[id];
			items.push([item.points || 0, item.name, item.color, item.bgcolor]);
		}
		items.sort(function(first, second) {
			let points1 = dd.getDisplayPoints(first);
			let points2 = dd.getDisplayPoints(second);
			if (points1 !== points2) return points2 - points1;
			if (first[1] !== second[1]) return second[1] - first[1];
			if (first[2] !== second[2]) return second[2] - first[2];
			if (first[3] !== second[3]) return second[3] - first[3];
			return second[4] > first[4];
		});
		return items;
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
}

let dd = new DD();
dd.backupInterval = setInterval(() => dd.exportData(), BACKUP_INTERVAL);

module.exports = dd;
