'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 1000;

class DD {
	constructor() {
		this.dd = {};
		this.modlog = {};
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
		if (!("data" in this.modlog)) {
			this.modlog.data = [];
		}
	}

	exportData() {
		fs.writeFileSync('./databases/dd.json', JSON.stringify(this.dd));
		fs.writeFileSync('./databases/modlog.json', JSON.stringify(this.modlog));
	}

	addpoints (user, numPoints) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				points: numPoints,
				name: user,
			}
		} else {
			if (this.dd[id].points) {
				this.dd[id].points += numPoints;
			} else {
				this.dd[id].points = numPoints;
			}
		}
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
	}

	getPoints(item) {
		return item[0];
	}

	getSorted() {
		let items = [];
		for (let id in this.dd) {
			let item = this.dd[id];
			items.push([item.points || 0, item.name]);
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

	updateModlog(message) {
		this.modlog.data.push(message);
		this.exportData();
	}
}

let dd = new DD();
dd.backupInterval = setInterval(() => dd.exportData(), BACKUP_INTERVAL);

module.exports = dd;
