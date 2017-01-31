'use strict';

const name = 'Top Trumps Pokebattle';
const description = '**Top Trumps Pokebattle**: __Where your partners\' lesser strengths can become their greatest assets.__ Game rules: http://survivor-ps.weebly.com/top-trumps-pokebattle.html';
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
	}

	onStart() {
		this.data = Tools.shuffle(Object.keys(Tools.data.pokedex));
		this.index = 0;
		for (let userID in this.players) {
			let mon1 = Tools.data.pokedex[this.data[this.index]];
			let mon2 = Tools.data.pokedex[this.data[this.index + 1]];
			let mon3 = Tools.data.pokedex[this.data[this.index + 2]];
			let mons = [mon1, mon2, mon3];
			this.index += 3;
			this.mons.set(this.players[userID], mons);
		}
		this.order = Object.keys(this.players);
		this.handoutMon();
	}

	handoutMon() {
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
			player.say("Starting hand: " + names.join(", "));
			this.timeout = setTimeout(() => this.handoutMon(), 2 * 1000);
		}
	}

	onNextRound() {
		this.attackMons.clear();
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
			this.say(names.join(" and ") + (names.length > 1 ?  "were" : " was") + " mked for not playing a mon!");
		} else if (this.statPlayer) {
			this.say("**" + this.statPlayer.name + "** didn't choose a stat!");
			this.statPlayer.eliminated = true;
		} else if (this.curPlayer) {
			this.say("**" + this.curPlayer.name + "** didn't choose anyone to attack and is eliminated!");
			this.curPlayer.eliminated = true;
		}
		if (this.getRemainingPlayerCount() === 0) {
			this.say("Everyone was mked!");
			this.end();
			return;
		}
		if (this.getRemainingPlayerCount() === 1) {
			this.end();
			return;
		} else if (this.getRemainingPlayerCount() === 2) {
			let playersLeft = this.getRemainingPlayers();
			this.curPlayer = playersLeft[Object.keys(playersLeft)[0]];
			this.oplayer = playersLeft[Object.keys(playersLeft)[1]];
			this.say("Only **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** are left! Moving directly to attacks.");
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
				names.push(player.name);
			}
			this.say("!pick " + names.join(", "));
		}
	}

	handlePick(message) {
		if (!this.curPlayer) {
			this.curPlayer = this.players[Tools.toId(message)];
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [user]``.");
			this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
		} else {
			this.statPlayer = this.players[Tools.toId(message)];
			this.say("**" + this.statPlayer.name + "** please choose a stat with ``" + Config.commandCharacter + "choose [stat]``");
			this.timeout = setTimeout(() => this.nextRound(), 90 * 1000);
		}
	}

	handleAttack() {
		this.say("!pick " + this.curPlayer.name + ", " + this.oplayer.name);
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

	doPlayerAttack() {
		let mon1 = this.attackMons.get(this.curPlayer);
		let mon2 = this.attackMons.get(this.oplayer);
		this.say("!dt " + mon1.species);
		this.say("vs");
		this.say("!dt " + mon2.species);
		this.timeout = setTimeout(() => this.doRolls(), 10 * 1000);
	}

	doRolls() {
		let mon1 = this.attackMons.get(this.curPlayer);
		let mon2 = this.attackMons.get(this.oplayer);
		this.rolla = null;
		this.rollb = null;
		this.say("!roll " + mon1.baseStats[this.stat]);
		this.say("!roll " + mon2.baseStats[this.stat]);
	}

	handleRoll(roll) {
		if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.rolla !== this.rollb) {
				let winPlayer, losePlayer;
				if (this.rolla > this.rollb) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
				} else {
					winPlayer = this.oplayer;
					losePlayer = this.curPlayer;
				}
				this.say("**" + winPlayer.name + "** " + Tools.sample(Games.destroyMsg) + " **" + losePlayer.name + "**!")
				losePlayer.eliminated = true;
				let mons = this.mons.get(winPlayer);
				if (mons.length === 1) {
					let names = [];
					for (let i = 0; i < 2; i++) {
						mons.push(Tools.data.pokedex[this.data[this.index + i]]);
						names.push("**" + mons[i + 1].species + "**");
					}
					this.mons.set(winPlayer, mons);
					winPlayer.say("You were awarded " + names.join(", ") + " for surviving!");
					this.index += 2;
				}
				this.stat = null;
				this.curPlayer = null;
				this.statPlayer = null;
				this.oplayer = null;
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			} else {
				this.say("The rolls were the same! rerolling...");
				this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
			}
		}
	}

	listWaiting() {
		let names = [];
		if (!this.attackMons.get(this.curPlayer)) names.push(this.curPlayer.name);
		if (!this.attackMons.get(this.oplayer)) names.push(this.oplayer.name);
		this.say("Waiting on: " + names.join(", "));
		this.timeout = setTimeout(() => this.nextRound(), 30 * 1000);
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
		mons.splice(index - 1, 1);
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
		let mons = this.mons.get(player);
		let names = [];
		for (let i = 0; i < mons.length; i++) {
			names.push("**" + mons[i].species + "**");
		}
		user.say("Current hand: " + names.join(", "));
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.aliases = ['ttp'];
exports.game = TTP;