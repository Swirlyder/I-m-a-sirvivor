'use strict';

const name = "Pokemon Survivor";
const id = "pokesurvivor";
const description = "__Let the dice decide your partner! A true test of battling skill!__ Game rules: http://survivor-ps.weebly.com/pokemon-survivor.html";

class Poke extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.attacks = new Map();
		this.order = [];
		this.realAttacks = new Map();
		this.mons = new Map();
		this.hasAdvanced = new Map();
		this.finals = false;
	} 

	onStart() {
		this.say("Now handing out mons!");
		this.order = Object.keys(this.players);
		this.num = 0;
		this.handoutmon();
	}

	handoutmon() {
		if (this.order.length === 0) {
			this.say("/wall You have 1 minute to make your teams!");
			this.timeout = setTimeout(() => this.nextRound(), 1 * 60 * 1000);
		} else {
			let player = this.players[Tools.toId(this.order.shift())];
			let mon = Tools.data.pokedex[Tools.sample(Object.keys(Tools.data.pokedex))];
			while (mon.evos) {
				mon = Tools.data.pokedex[mon.evos[0]];
			}
			if (mon.baseSpecies) {
				mon = Tools.data.pokedex[Tools.toId(mon.baseSpecies)];
			}
			player.say("Your pokemon is **" + mon.species + "**!");
			this.mons.set(player, mon);
			this.hasAdvanced.set(player, true);
			this.timeout = setTimeout(() => this.handoutmon(), 2 * 1000);
		}
	}

	onNextRound() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated) continue;
			if (!this.hasAdvanced.has(player)) {
				player.say("You never did your battle!");
				player.eliminated = true;
			}
		}
		this.hasAdvanced.clear();
		this.attacks.clear();
		this.realAttacks.clear();
		if (this.getRemainingPlayerCount() === 2) {
			this.finals = true;
			this.makeBracket();
		} else {
			this.canAttack = true;
			this.numAttacks = 0;
			this.say("**Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + ".");
			this.say("Please pm me your attacks now with ``" + Config.commandCharacter + "destroy [user]``!");
			this.timeout = setTimeout(() => this.makeBracket(), 90 * 1000);
		}
	}

	makeBracket() {
		this.order = Tools.shuffle(this.order);
		this.matchups = [];
		while (this.order.length) {
			let player = this.order.shift();
			let attackedPlayer = this.attacks.get(player);
			if (this.realAttacks.has(player) || this.realAttacks.has(attackedPlayer)) continue;
			this.realAttacks.set(player, attackedPlayer);
			this.realAttacks.set(attackedPlayer, player);
			this.matchups.push([player, attackedPlayer]);
		}
		let nomatchups = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.eliminated || this.realAttacks.has(player)) continue;
			nomatchups.push(player);
		}
		nomatchups = Tools.shuffle(nomatchups);
		while (nomatchups.length > 1) {
			let player1 = nomatchups.shift(), player2 = nomatchups.shift();
			this.realAttacks.set(player1, player2);
			this.realAttacks.set(player2, player1);
			this.matchups.push([player1, player2]);
		}
		this.say("/wall " + (this.finals ? "Final round " : "Round " + this.round) + " matchups! " + this.matchups.map(v => v[0].name + " vs. " + v[1].name).join(", ") + "." + (nomatchups.length > 0 ? (" Bye: " + nomatchups[0].name + ".") : ""))
		this.say("/wall Use " + Config.commandCharacter + "check [link] during your battle, and make sure the tier is Gen 7 Anything Goes! If .check isn't working, you can do ``/invite Sir Vivor`` as well");
		this.say("/wall To prevent scouting, you can use ``/modjoin +`` followed by ``/roomvoice Sir Vivor`` (before inviting).");
		this.numMatches = 0;
		this.numTotal = this.matchups.length;
		if (nomatchups.length > 0) {
			this.hasAdvanced.set(nomatchups[0], true);
		}
		this.timeout = setTimeout(() => this.nextRound(), 5 * 60 * 1000);
	}

	check(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (!target.startsWith("http://play.pokemonshowdown.com")) return;
		target = target.substr(target.lastIndexOf("/") + 1);
		let split = target.split("-");
		if (split.length !== 3) return;
		if (split[1] !== "gen7anythinggoes") return user.say("The tier required is Gen 7 Anything Goes");
		this.say("/join " + target);
	}

	isValidMon(mon, player) {
		let playerMon = this.mons.get(player);
		if (playerMon.species === mon.species) return true;
		if (!playerMon.otherFormes) return false;
		for (let i = 0; i < playerMon.otherFormes.length; i++) {
			let curMon = Tools.data.pokedex[playerMon.otherFormes[i]];
			if (curMon.species === mon.species) return true;
		}
		return false;
	}

	handleBattleEnd(battledata) {
		let p1, p2, winp;
		let mon1,mon2;
		console.log(battledata);
		for (let i = 0; i < battledata.length; i++) {
			let data = battledata[i];
			let split = data.split("|");
			split.shift();
			console.log(split)
			switch (split[0]) {
				case 'player':
					if (split.length < 3) continue;
					if (split[1] === 'p1') {
						p1 = this.players[Tools.toId(split[2])];
						if (!p1) {
							console.log("rip p1");
							return;
						}
					} else {
						p2 = this.players[Tools.toId(split[2])];
						if (!p2) {
							console.log("rip p2");
							return;
						}
					}
					break;
				case 'poke':
					if (split.length < 3) continue;
					let mon = Tools.data.pokedex[Tools.toId(split[2].split(",")[0])];
					console.log(mon);
					if (split[1] === 'p1') {
						if (mon1) {
							console.log("rip mon1");
							return;
						};
						mon1 = mon;
					} else {
						if (mon2) {
							console.log("rip mon2");
							return;
						}
						mon2 = mon;
					}
					break;
				case 'win':
					if (split.length < 2) continue;
					winp = this.players[Tools.toId(split[1])];
					if (!winp) return;
					break;
			}
		}
		console.log(p1.name + "," + p2.name + "," + winp.name);
		if (!this.isValidMon(mon1,p1) || !this.isValidMon(mon2, p2)) {
			console.log('rip mons');
			return;
		}
		console.log("made it here!");
		if (this.realAttacks.get(p1) !== p2) return;
		console.log("made it here!1");
		let losep;
		if (winp === p1) losep = p2;
		else losep = p1;
		console.log("made it here!2");
		this.say("/w " + winp.id + ", You have eliminated **" + losep.name + "**!");
		console.log("Said first thing.");
		this.say("/w " + losep.id + ", You have been eliminated by **" + winp.name + "**.");
		this.say("RIP **" + losep.name + "** and their");
		this.say("!dt " + this.mons.get(losep).species);
		losep.eliminated = true;
		this.hasAdvanced.set(winp, true);
		this.numMatches++;
		if (this.numMatches === this.numTotal) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		console.log(player);
		if (!player || player.eliminated) return;
		let targetPlayer = this.players[Tools.toId(target)];
		if (!targetPlayer) return user.say("That player is not in the game!");
		if (targetPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (this.attacks.has(player)) return user.say("You have already attacked someone this round!");
		return user.say("You have attacked **" + targetPlayer.name + "**!");
		this.numAttacks++;
		this.attacks.set(player, targetPlayer);
		this.order.push(player);
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.makeBracket();
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Poke;
exports.aliases = ['poke'];
exports.commands = {
	"check": "check",
};
exports.pmCommands = {
	"check": true
};