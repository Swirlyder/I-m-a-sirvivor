/**
 * This is where joined rooms are stored.
 * 
 * On startup, the Pokemon Showdown Bot joins the configured rooms here,
 * and tracks their userlists. Room command and modding settings are
 * loaded on room join, if present.
 */
'use strict';
var Rooms = Object.create(null);
var rooms = Rooms.rooms = new Map();

Rooms.join = function () {
	for (let i = 0; i < Config.rooms.length; i++) {
		let room = Config.rooms[i];
		if (room === 'lobby' && Config.serverid === 'showdown') continue;
		send('|/join ' + room);
	}
	for (let i = 0; i < Config.privaterooms.length; i++) {
		let room = Config.privaterooms[i];
		if (room === 'lobby' && Config.serverid === 'showdown') continue;
		send('|/join ' + room);
	}
};

class Room {
	constructor(roomid, type) {
		this.id = roomid;
		this.isPrivate = type;
		this.users = new Map();
		this.repeatMessage = "";
		this.numTimesLeft = 0;
		this.repeatTimeMinutes = 0;
	}

	say(message) {
		Parse.say(this, message);
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
		try {
			let user = Users.get(oldid);
			const newId = toId(username);
			const group = username.charAt(0);

			if (!user) { // already changed nick
				user = Users.get(newId) || Users.add(username);
			} else if (username.substr(1) !== user.name) { // changing nick
				user = user.rename(username);
			}
			if (Games.host && user && Games.host.id === user.id) {
				Games.host = user;
			}
			// May seem redundant to add if(!user) but there is a bug where 
			// the bot will get this far when user.id = null, and the 
			// bot will crash
			if (!user) {
				user = { id: newId, name: username, rooms: new Map() }; // Fallback user with initialized rooms
				send('|/w Swirlyder, I HAD TO RESORT TO SECOND IF(!USER))');
			} else if (!user.rooms) { // Ensure rooms is always a Map
				user.rooms = new Map();
			}

			this.users.set(user.id, group);
			user.rooms.set(this.id, group);
			if (this.game) this.game.renamePlayer(user, oldid);
			this.users.delete(oldid);
			return user;
		} catch (e) {
			console.error("Error in onRename:", error);
			send('|/w Swirlyder, ERROR IN ROOM.JS ONRENAME');
			return user;
		}
	}

		onLeave(username) {
			var user = Users.get(username);
			if (!user) return;
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

		sayRepeatMessage() {
			this.say(this.repeatMessage);
			this.numTimesLeft--;
			if (this.numTimesLeft > 0) {
				this.repeatTimeout = setTimeout(() => this.sayRepeatMessage(), this.repeatTimeMinutes * 60 * 1000);
			}
		}

		tryClearRepeat() {
			if (!this.hasRepeatMessage()) {
				this.say("There is no repeat running!");
			}
			if (this.repeatTimeout) clearTimeout(this.repeatTimeout);
			this.numTimesLeft = 0;
			this.repeatMessage = "";
		}

		hasRepeatMessage() {
			return this.numTimesLeft > 0;
		}

		trySetRepeat(message, user) {
			let targetID = Tools.toId(message);
			if (targetID === 'stop' || targetID === 'end') {
				return this.tryClearRepeat();
			}

			if (this.hasRepeatMessage()) {
				return this.say("There is already a repeat message running! If you would like to clear it, please do ``" + Config.commandCharacter + "repeat end`` first");
			}

			let split = message.split(",");
			if (split.length < 3) {
				return this.say("You must specify the message, duration, and number of times for the repeat to run, in the form ``" + Config.commandCharacter + "repeat [message], [frequency], [amount]``");
			}

			let repeatmessage = split.slice(0, -2).join(",");
			let frequency = parseInt(split[1]);
			let amount = parseInt(split[2]);

			if (!repeatmessage) {
				return this.say("You must specify a message to repeat!");
			}

			if (!frequency || frequency < 1) {
				return this.say("Invalid amount of time between repeated messages.");
			}

			if (!amount || amount < 1) {
				return this.say("Invalid amount of times to repeat the message.");
			}

			this.repeatMessage = repeatmessage;
			this.numTimesLeft = amount;
			this.repeatTimeMinutes = frequency;

			this.say("Your message will be repeated " + amount + " times at " + frequency + " minute intervals.");
			this.say("/modnote " + user.name + " added a repeat for " + message + " to be repeated " + amount + " times at " + frequency + " minute intervals.");
			this.repeatTimeout = setTimeout(() => this.sayRepeatMessage(), this.repeatTimeMinutes * 60 * 1000);
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
