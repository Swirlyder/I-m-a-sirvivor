'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 1000;

class DD {
	constructor() {
		this.dd = {};
		this.modlog = {};
		this.firstpoints = 10;
		this.secondpoints = 5;
		this.realhostpoints = 3;
		this.partpoints = 2;
	}

	importData() {
		let file = '{}';
		try {
			file  = fs.readFileSync('./databases/dd.json').toString();
		} catch (e) {}
		this.dd = JSON.parse(file);
		file = '{}';
		try {
			file = fs.readFileSync('/databases/modlog.json').toString();
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

	addHost(user) {
		let name = user.trim();
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				firsts: 0,
				seconds: 0,
				parts: 0,
				realhosts: 1,
				name: user,
			}
		} else {
			if (this.dd[id].realhosts) {
				this.dd[id].realhosts++;
			} else {
				this.dd[id].realhosts = 1;
			}
		}
	}

	addFirst(user) {
		let id = Tools.toId(user.trim());
		if (!(id in this.dd)) {
			this.dd[id] = {
				firsts: 1,
				seconds: 0,
				parts: 0,
				realhosts: 0,
				name: user.trim(),
			}
		} else {
			this.dd[id].firsts++;
		}
	}

	addSecond(user) {
		let id = Tools.toId(user.trim());
		if (!(id in this.dd)) {
			this.dd[id] = {
				firsts: 0,
				seconds: 1,
				parts: 0,
				realhosts: 0,
				name: user.trim(),
			}
		} else {
			this.dd[id].seconds++;
		}
	}

	addPart(user) {
		let id = Tools.toId(user.trim());
		if (!(id in this.dd)) {
			this.dd[id] = {
				firsts: 0,
				seconds: 0,
				parts: 1,
				realhosts: 0,
				name: user.trim(),
			}
		} else {
			this.dd[id].parts++;
		}
	}

	removeHost(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd) || this.dd[id].realhosts === 0) {
			return false;
		} else {
			this.dd[id].realhosts--;
			return true;
		}
	}

	removeFirst(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd) || this.dd[id].firsts === 0) {
			return false
		} else {
			this.dd[id].firsts--;
			return true;
		}
	}

	removeSecond(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd) || this.dd[id].seconds === 0) {
			return false
		} else {
			this.dd[id].hosts--;
			return true;
		}
	}

	removePart(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd) || this.dd[id].parts === 0) {
			return false
		} else {
			this.dd[id].parts--;
			return true;
		}
	}

	getPoints(item) {
		return this.realhostpoints * item[0] + this.firstpoints * item[1] + this.secondpoints * item[2] + this.partpoints * item[3];
	}

	getSorted() {
		let items = [];
		for (let id in this.dd) {
			let item = this.dd[id];
			items.push([item.realhosts, item.firsts, item.seconds, item.parts, item.name]);
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
	}
}

let dd = new DD();
dd.backupInterval = setInterval(() => dd.exportData(), BACKUP_INTERVAL);

module.exports = dd;