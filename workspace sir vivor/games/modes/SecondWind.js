'use strict';

const name = "Second Wind";
const id = Tools.toId(name);
let secondWindMode = function() {
	this.name = name + " " + this.name;
	this.id = id + this.id;
	this.lives = new Map();
	
	this.start = () => {
		if (this.started) return;
		if (this.playerCount < 2) {
			this.say("The game needs at least two players to start!");
			return;
		}
		this.started = true;
		for (let userID in this.players) {
			let player = this.players[userID];
			this.lives.set(player, 2);
		}
		if (typeof this.onStart === 'function') this.onStart();
	}
	this.getPlayerNames = (players) => {
		if (!players) players = this.players;
		let names = [];
		for (let userID in players) {
			let player = players[userID];
			names.push(player.name + "(" + this.lives.get(player) + "♥)");
		}
		return names.join(", ");
	}

	this.elimPlayer = (player) => {
		let lives = this.lives.get(player);
		lives -= 1;
		if (lives <= 0) {
			player.eliminated = true;
			player.say("You ran out of lives and were eliminated!");
		} else {
			this.lives.set(player, lives);
			player.say("You have " + lives + (lives === 1 ? " life" : " lives") + " remaining!");
		}
	}

	this.getName = (player) => {
		return player.name + "(" + this.lives.get(player) + "♥)";
	}
}

exports.name = name;
exports.id = id;
exports.naming = 'prefix';
exports.requiredFunctions = [];
exports.mode = secondWindMode;
exports.aliases = ['sw'];