/**
 * This is where joined rooms are stored.
 * 
 * On startup, the Pokemon Showdown Bot joins the configured rooms here,
 * and tracks their userlists. Room command and modding settings are
 * loaded on room join, if present.
 */

var Rooms = Object.create(null);
var rooms = Rooms.rooms = new Map();

Rooms.join = function () {
	for (let i = 0; i < Config.rooms.length; i++) {
		let room = toId(Config.rooms[i]);
		if (room === 'lobby' && Config.serverid === 'showdown') continue;
		send('|/join ' + room);
	}
	for (let i = 0; i < Config.privaterooms.length; i++) {
		let room = toId(Config.privaterooms[i]);
		if (room === 'lobby' && Config.serverid === 'showdown') continue;
		send('|/join ' + room);
	}
};

class Room {
	constructor(roomid, type) {
		this.id = roomid;
		this.isPrivate = type;
		this.users = new Map();
	}

	onUserlist(users) {
		if (users === '0') return false; // no users in room
		users = users.split(',');
		for (let i = 1; i < users.length; i++) {
			let username = users[i];
			let group = username.charAt(0);
			let user = Users.get(username);
			if (!user) user = Users.add(username, this.id);
			user.rooms.set(this.id, group);
			this.users.set(user.id, group);
		}
	}

	onJoin(username, group) {
		var user = Users.get(username);
		if (!user) user = Users.add(username);
		this.users.set(user.id, group);
		user.rooms.set(this.id, group);
		return user;
	}

	onRename(username, oldid) {
		var user = Users.get(oldid);
		var group = username.charAt(0);
		this.users.delete(oldid);
		if (!user) { // already changed nick
			user = Users.get(username); 
		} else if (username.substr(1) !== user.name) { // changing nick
			user = user.rename(username);
		}
		this.users.set(user.id, group);
		user.rooms.set(this.id, group);
		return user;
	}

	onLeave(username) {
		var user = Users.get(username);
		this.users.delete(user.id);
		user.rooms.delete(this.id);
		if (user.rooms.size) return user;
		user.destroy();
		return null;
	}

	destroy() {
		this.users.forEach(function (group, userid) {
			var user = Users.get(userid);
			user.rooms.delete(this.id);
			if (!user.rooms.size) user.destroy();
		});
		rooms.delete(this.id);
	}
}

var getRoom = Rooms.get = function (name) {
	return rooms.get(name);
};

Rooms.add = function (roomid, type) {
	var room = getRoom(roomid);
	if (room) return room;
	room = new Room(roomid, type);
	rooms.set(roomid, room);
	return room;
};

module.exports = Rooms;
