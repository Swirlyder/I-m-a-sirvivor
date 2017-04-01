'use strict';

const name = 'Top Trumps Pokebattle';
const description = '__Where your partners\' lesser strengths can become their greatest assets.__ Game rules: http://survivor-ps.weebly.com/top-trumps-pokebattle.html';
const id = Tools.toId(name);
const names = {
	'atk': 'Attack',
	'spd': 'Special Defense',
	'spe': 'Speed',
	'spa': 'Special Attack',
	'hp': 'Health',
	'def': 'Defense',
};
class TTP extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.mons = new Map();
		this.attackMons = new Map();
		this.indices = new Map();
	}

	onStart() {
		let data = Tools.shuffle(Object.keys(Tools.data.pokedex));
		this.data = [];
		for (let i = 0; i < data.length; i++) {
			let mon = Tools.data.pokedex[data[i]];
			if (mon.num > 0 && mon.species.length < 12) this.data.push(data[i]);
		}
		this.index = 0;
		for (let userID in this.players) {
			let mon1,mon2,mon3;
			if (!Games.aprilFools) {
				mon1 = Tools.data.pokedex[this.data[this.index]];
				mon2 = Tools.data.pokedex[this.data[this.index + 1]];
				mon3 = Tools.data.pokedex[this.data[this.index + 2]];
			} else {
				mon1 = Tools.data.pokedex['sunkern'];
				mon2 = Tools.data.pokedex['sunkern'];
				mon3 = Tools.data.pokedex['sunkern'];
			}
			let mons = [mon1, mon2, mon3];
			this.index += 3;
			this.mons.set(this.players[userID], mons);
		}
		this.order = Object.keys(this.players);
		this.handoutMon();
	}

	handoutMon() {
		try {
			if (this.order.length === 0) {
				this.nextRound();
			} else {
				let curUser = this.order.shift();
				let player = this.players[curUser];
				let mons = this.mons.get(player);
				let names = [];
				for (let i = 0; i < 3; i++) {
					names.push("**" + mons[i].species + "**");
				}
				this.sayHand(player);
				this.timeout = setTimeout(() => this.handoutMon(), 3 * 1000);
			}
		} catch (e) {
			this.mailbreak(e);
		}
	}

	onNextRound() {
		if (this.stat) {
			let names = [];
			if (!this.attackMons.get(this.curPlayer)) {
				this.curPlayer.eliminated = true;
				names.push("**" + this.curPlayer.name + "**");
			}
			if (!this.attackMons.get(this.oplayer)) {
				this.oplayer.eliminated = true;
				names.push("**" + this.oplayer.name + "**");
			}
			this.say(names.join(" and ") + (names.length > 1 ?  " were both" : " was") + " mked for not playing a mon!");
		} else if (this.statPlayer) {
			this.say("**" + this.statPlayer.name + "** didn't choose a stat and is eliminated!");
			this.statPlayer.eliminated = true;
		} else if (this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** didn't choose anyone to attack and is eliminated!");
			this.curPlayer.eliminated = true;
		}
		if (this.getRemainingPlayerCount() < 2) {
			this.end();
			return;
		}
		this.indices.clear();
		this.attackMons.clear();
		if (this.getRemainingPlayerCount() === 2) {
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			if (this.variation) {
				let curMons = this.mons.get(this.curPlayer);
				let omons = this.mons.get(this.oplayer);
				this.say("Only **" + this.curPlayer.name + "[" + curMons.length + "]** and **" + this.oplayer.name + "[" + omons.length + "]** are left! Moving directly to attacks.");
			} else {
				this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
			}
			this.statPlayer = null;
			this.timeout = setTimeout(() => this.handleAttack(), 5 * 1000);
		} else {
			let names = [];
			this.curPlayer = null;
			this.oplayer = null;
			this.stat = null;
			this.statPlayer = null;
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated) continue;
				if (this.variation) {
					let mons = this.mons.get(player);
					names.push(player.name + "[" + mons.length + "]");
				} else {
					names.push(player.name);
				}
			}
			this.say("!pick " + names.join(", "));
		}
	}

	handlePick(message) {
		if (!this.curPlayer) {
			if (this.variation) {
				let index = message.lastIndexOf("[");
				this.curPlayer = this.players[Tools.toId(message.substr(0, index))];
			} else {
				this.curPlayer = this.players[Tools.toId(message)];
			}
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [user]``.");
			this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
		} else {
			if (this.variation) {
				let index = message.lastIndexOf("[");
				this.statPlayer = this.players[Tools.toId(message.substr(0, index))];
			} else {
				this.statPlayer = this.players[Tools.toId(message)];
			}
			this.say("**" + this.statPlayer.name + "** please choose a stat with ``" + Config.commandCharacter + "choose [stat]``");
			this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
		}
	}

	sayHand(player) {
		let cards = this.mons.get(player);
		if (!cards) return;
		let height = Math.floor((cards.length + 1) / 2) * 150;
		let start = '<div class="infobox"><div style="height: ' + height + 'px">';
		let strs = [];
		for (let i = 0, len = cards.length; i < len; i++) {
			let card = cards[i];
			let mon = Tools.data.pokedex[Tools.toId(card.species)];
			let num;
			if (mon.num < 10) {
				num = '00' + mon.num.toString();
			} else if (mon.num < 100) {
				num = '0' + mon.num.toString();
			} else {
				num = mon.num.toString();
			}
			let str = '<div style="float: left; width: 50%"><img src="http://www.serebii.net/pokedex-sm/icon/' + num + '.png" width="32" height="32" /><b><u>' + mon.species + "</u></b><br><ul>";
			for (let j in mon.baseStats) {
				str += "<li><b>" + Tools.turnFirstUpper(j) + "</b>: " + mon.baseStats[j] + "</li>";
			}
			strs.push(str + "</ul></div>");
		}
		player.say("Current hand: ");
		Rooms.get('survivor').say("/pminfobox " + player.id + ", " + (start + strs.join("") + "</div></div>"));
	}

	handleAttack() {
		if (this.variation) {
			let curMons = this.mons.get(this.curPlayer);
			let omons = this.mons.get(this.oplayer);
			this.say("!pick " + this.curPlayer.name + "[" + curMons.length + "], " + this.oplayer.name + "[" + omons.length + "]");
		} else {
			this.say("!pick " + this.curPlayer.name + ", " + this.oplayer.name);
		}
	}

	doPlayerAttack() {
		let mon1 = this.attackMons.get(this.curPlayer);
		let mon2 = this.attackMons.get(this.oplayer);
		this.say("!dt " + mon1.species);
		this.say("vs");
		this.say("!dt " + mon2.species);
		this.timeout = setTimeout(() => this.doRolls(), 10 * 1000);
	}

	doRolls() {
		try {
			let mon1 = this.attackMons.get(this.curPlayer);
			let mon2 = this.attackMons.get(this.oplayer);
			this.rolla = null;
			this.rollb = null;
			this.roll1 = mon1.baseStats[this.stat];
			this.roll2 = mon2.baseStats[this.stat];
			this.sayPlayerRolls();
		} catch (e) {
			this.mailbreak(e);
		}
	}

	handleWinner(winPlayer, losePlayer) {
		if (!this.variation) {
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!");
			losePlayer.eliminated = true;
			let mons = this.mons.get(winPlayer);
			let index = this.indices.get(winPlayer);
			mons.splice(index, 1);
			this.mons.set(winPlayer, mons);
		} else {
			let mons = this.mons.get(losePlayer);
			let index = this.indices.get(losePlayer);
			this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "'s** " + mons[index].species + "!" + (mons.length === 1 ? " It was their last mon and they are eliminated!" : ""));
			if (mons.length === 1) {
				losePlayer.eliminated = true;
			} else {
				mons.splice(index, 1);
			}
		}
		let mons = this.mons.get(winPlayer);
		if (mons.length === 1 && !this.variation) {
			let names = [];
			for (let i = 0; i < 2; i++) {
				if (Games.aprilFools) {
					mons.push(Tools.data.pokedex['sunkern']);
				} else {
					mons.push(Tools.data.pokedex[this.data[this.index + i]]);
				}
				names.push("**" + mons[i + 1].species + "**");
			}
			this.mons.set(winPlayer, mons);
			this.sayHand(winPlayer);
			this.index += 2;
		}
		this.stat = null;
		this.curPlayer = null;
		this.statPlayer = null;
		this.oplayer = null;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);		
	}

	listWaiting() {
		try {
			let names = [];
			if (!this.attackMons.get(this.curPlayer)) names.push(this.curPlayer.name);
			if (!this.attackMons.get(this.oplayer)) names.push(this.oplayer.name);
			this.say("Waiting on: " + names.join(", "));
			this.timeout = setTimeout(() => this.nextRound(), 30 * 1000);
		} catch (e) {
			this.mailbreak(e);
		}
	}

	attack(target, user) {
		if (!this.curPlayer || this.oplayer) return;
		if (this.curPlayer.name !== user.name) return;
		let oplayer = this.players[Tools.toId(target)];
		if (!oplayer || oplayer.eliminated) return;
		if (oplayer.name === this.curPlayer.name) {
			this.say(">Attacking yourself.");
			return;
		}
		this.say("**" + this.curPlayer.name + "** has chosen to attack **" + oplayer.name + "**!");
		clearTimeout(this.timeout);
		this.oplayer = oplayer;
		this.timeout = setTimeout(() => this.handleAttack(), 5 * 1000);
	}
	
	choose(target, user) {
		if (!this.statPlayer || this.stat) return;
		if (this.statPlayer.name !== user.name) return;
		let stat = Tools.toId(target);
		let posStats = Object.keys(Tools.data.pokedex['bulbasaur'].baseStats);
		if (stat === 'attack') stat = 'atk';
		if (stat === 'specialattack') stat = 'spa';
		if (stat === 'specialdefense') stat = 'spd';
		if (stat === 'defense') stat = 'def';
		if (stat === 'health') stat = 'hp';
		if (stat === 'speed') stat = 'spe';
		if (posStats.indexOf(stat) === -1) return this.say("That is not a valid stat!");
		this.stat = stat;
		clearTimeout(this.timeout);
		this.say("The chosen stat is **" + names[this.stat] + "**! **" + this.curPlayer.name + "** and **" + this.oplayer.name + "**, please play your mons in chat with ``" + Config.commandCharacter + "play [mon]``");
		this.numPlayed = 0;
		this.timeout = setTimeout(() => this.listWaiting(), 60 * 1000);
	}

	play(target, user) {
		if (!this.stat) return;
		if (this.curPlayer.id !== user.id && this.oplayer.id !== user.id);
		let player = this.players[user.id];
		if (this.attackMons.get(player)) return;
		let mon = Tools.data.pokedex[Tools.toId(target)];
		if (!mon) return user.say("[" + target + "] is not a valid mon.");
		let index;
		let mons = this.mons.get(player);
		for (let i = 0; i < mons.length; i++) {
			let curMon = mons[i];
			if (Tools.toId(curMon.species) === Tools.toId(target)) {
				index = i + 1;
				break;
			}
		}
		if (!index) return user.say("You don't have [" + mon.species + "].");
		user.say("You have played **" + mon.species + "**!");
		this.attackMons.set(player, mon);
		this.indices.set(player, index - 1);
		this.mons.set(player, mons);
		this.numPlayed++;
		if (this.numPlayed === 2) {
			clearTimeout(this.timeout);
			this.doPlayerAttack();
		}
	}

	hand(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		this.sayHand(player);
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.aliases = ['ttp'];
exports.game = TTP;
exports.modes = ['Golf']
exports.variations = [
	{
		name: "Long Top Trumps Pokebattle",
		aliases: ["longttp, ttplong"],
		variation: "Long",
		variationAliases: ["long"],
	}
]
exports.commands = {
	hand: "hand",
	mons: "hand",
	attack: "attack",
	choose: "choose",
	play: "play",
}

exports.pmCommands = {
	hand: true,
}