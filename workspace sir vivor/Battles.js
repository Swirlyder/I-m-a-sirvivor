class Battle {
	constructor(name) {
		this.name = name;
		this.data = [];
	} 
	handleMessages(spl) {
		for (let i = 0; i < spl.length; i++) {
			this.handleMessage(spl[i]);
		}
		
	}
	handleMessage(message) {
		let split = message.split("|");
		split.shift();
		this.data.push(message);
		if (split[0] === "win") {
			let data = this.data;
			Rooms.rooms.forEach(function (room) {
				if (room.game && typeof room.game.handleBattleEnd === 'function') room.game.handleBattleEnd(data);
			});
			this.data = [];
			Rooms.get('survivor').say("/leave " + this.name);
		}
		
	}
}

class Battles {
	constructor() {
		this.battles = {};
	}
	addBattle(battlename) {
		if (battlename in this.battles) return this.battles[battlename];
		this.battles[battlename] = new Battle(battlename);
		return this.battles[battlename];
	}
}

module.exports = new Battles();

