'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 1000;

class DD {
	constructor() {
		this.dd = {};
	}

	importData() {
		let file = '{}';
		try {
			file  = fs.readFileSync('./databases/dd.json').toString();
		} catch (e) {}
		this.dd = JSON.parse(file);
	}

	exportData() {
		fs.writeFileSync('./databases/dd.json', JSON.stringify(this.dd));
	}

	addHost(user) {
		let name = user;
		let id = Tools.toId(name);
		if (!(id in this.dd)) {
			this.dd[id] = {
				hosts: 1,
				firsts: 0,
				seconds: 0,
				parts: 0,
				name: user,
			}
		} else {
			this.dd[id].hosts++;
		}
	}

	addFirst(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd)) {
			this.dd[id] = {
				hosts: 0,
				firsts: 1,
				seconds: 0,
				parts: 0,
				name: user,
			}
		} else {
			this.dd[id].firsts++;
		}
	}

	addSecond(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd)) {
			this.dd[id] = {
				hosts: 0,
				firsts: 0,
				seconds: 1,
				parts: 0,
				name: user,
			}
		} else {
			this.dd[id].seconds++;
		}
	}

	addPart(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd)) {
			this.dd[id] = {
				hosts: 0,
				firsts: 0,
				seconds: 0,
				parts: 1,
				name: user,
			}
		} else {
			this.dd[id].parts++;
		}
	}

	removeHost(user) {
		let id = Tools.toId(user);
		if (!(id in this.dd) || this.dd[id].hosts === 0) {
			return false
		} else {
			this.dd[id].hosts--;
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

	getSorted() {
		let items = [];
		for (let id in this.dd) {
			let item = this.dd[id];
			items.push([item.hosts, item.firsts, item.seconds, item.parts, item.name]);
		}
		items.sort(function(first,second) {
			let points1 = 4*first[0] + 10*first[1] + 5*first[2] + 2*first[3];
			let points2 = 4*second[0] + 10*second[1] + 5*second[2] + 2*second[3];
			if (points1 !== points2) return points2 - points1;
			if (first[1] !== second[1]) return second[1] - first[1];
			if (first[2] !== second[2]) return second[2] - first[2];
			if (first[3] !== second[3]) return second[3] - first[3];
			return second[4] > first[4];
		});
		return items;
	}
}

let dd = new DD();
dd.backupInterval = setInterval(() => dd.exportData(), BACKUP_INTERVAL);

module.exports = dd;