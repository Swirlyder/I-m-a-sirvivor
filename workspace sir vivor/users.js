/**
 * This is where users are stored.
 *
 * New users are processed when joining new rooms and on receiving join
 * messages from the server. User chat data is processed here for use
 * in command permissions and automatic moderation.
 */

var Users = Object.create(null);
var users = Users.users = Object.create(null);

class User {
	constructor (username, roomid) {
		this.name = username.substr(1);
		this.id = toId(this.name);
		this.rooms = new Map();
		if (roomid) this.rooms.set(roomid, username.charAt(0));
	}

	isExcepted () {
		return Config.excepts.includes(this.id);
	}

	isWhitelisted () {
		return Config.whitelist.includes(this.id);
	}

	isRegexWhitelisted () {
		return Config.regexautobanwhitelist.includes(this.id);
	}

	hasRank (roomid, tarGroup) {
		if (this.isExcepted()) return true;
		var group = this.rooms.get(roomid) || roomid; // PM messages use the roomid parameter as the user's group
		return Config.groups[group] >= Config.groups[tarGroup];
	}

	canUse (cmd, roomid) {
		if (this.isExcepted()) return true;
		var settings = Parse.settings[cmd];
		if (!settings || !settings[roomid]) {
			return this.hasRank(roomid, (cmd === 'autoban' || cmd === 'blacklist') ? '#' : Config.defaultrank);
		}

		var setting = settings[roomid];
		if (setting === true) return true;
		return this.hasRank(roomid, setting);
	}

	rename (username) {
		var oldid = this.id;
		delete users[oldid];
		this.id = toId(username);
		this.name = username.substr(1);
		users[this.id] = this;
		return this;
	}

	destroy () {
		this.rooms.forEach(function (group, roomid) {
			var room = Rooms.get(roomid);
			room.users.delete(this.id);
		});
		this.rooms.clear();
		delete users[this.id];
	}
}

var getUser = Users.get = function (username) {
	var userid = toId(username);
	return users[userid];
};

var addUser = Users.add = function (username, room) {
	var user = getUser(username);
	if (!user) {
		user = new User(username, room);
		users[user.id] = user;
	}
	return user;
};

var botId = ' ' + toId(Config.nick);
Users.self = getUser(botId) || addUser(botId);

module.exports = Users;
