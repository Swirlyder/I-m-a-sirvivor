'use strict';

const name = 'Axew\'s Battle Cards';
const id = Tools.toId(name);
const description = "Players play cards that are super-effective! More info here: http://s15.zetaboards.com/PS_Game_Corner/topic/10044766/1/#new";
const descriptions = {
	"Soak": 'Turn top to water',
	"Trick-or-Treat": 'Add ghost type',
	"Forest's Curse": 'Add grass type',
	"Explosion": "Play at any time",
	"Recycle": "Get two cards back",
	"Conversion": "Turn top to any type",
	"Conversion2": "Turn top to any 2 types",
	"Transform": "Turn top to any mon",
	"Baton Pass": "Pair with any other pokemon",
	"Ally Switch": "Pair with any other pokemon, get top back",
};

const shortdescription = {
	"Soak": "Turn water",
	"Trick-or-Treat": "Add ghost",
	"Forest's Curse": "Add grass",
	"Explosion": "Play always",
	"Recycle": "Get two cards back",
	"Conversion": "Turn any type",
	"Conversion2": "Turn any 2 types",
	"Transform": "Turn into any mon",
	"Baton Pass": "Pair, get top back",
	"Ally Switch": "Pair with any other"
}
class Axew extends Games.Game {
	constructor(room) {
		super(room);
		this.id = id;
		this.name = name;
		this.description = description;
		this.cards = new Map();
		this.specialCards = ['Soak', 'Trick-or-Treat', "Forest's Curse", "Explosion", 'Baton Pass', 'Ally Switch',
							 'Conversion', 'Conversion2', 'Transform', 'Recycle'];
		let mons = Tools.shuffle(Object.keys(Tools.data.pokedex));
		this.mons = [];
		for (let i in mons) {
			this.mons.push(Tools.data.pokedex[mons[i]].species);
		}
		this.numCards = 1;
		this.battleRound = 0;
		this.curPlayer = null;
		this.types = null;
		this.num = 0;
	}

	convertMult(num) {
		if (num === 0) {
			return 1;
		} else if (num === 1) {
			return 2;
		} else if (num === 2) {
			return 0.5;
		} else if (num === 3) {
			return 0;
		}
	}

	getRandomOrdering() {
		let remainPlayers = this.getRemainingPlayers();
		let order = Tools.shuffle(Object.keys(remainPlayers));
		let realOrder = [];
		for (let i = 0; i < order.length; i++) {
			realOrder.push(remainPlayers[order[i]]);
		}
		return realOrder;
	}

	onLeave(user) {
		if (user.id === this.curPlayer.id) {
			clearTimeout(this.timeout);
			this.curPlayer = null;
			this.nextRound();
		}
	}

	getCard() {
		let card;
		if (Math.random() < 0.07) {
			card = Tools.sample(this.specialCards);
		} else {
			card = this.mons.shift();
		}
		return card;
	}

	sayTopCard() {
		if (!this.topcard) return;
		if (this.room.id === 'gamecorner') {
			let htmlstr = '<div class="infobox"><center><img src="//play.pokemonshowdown.com/sprites/xyani/"' + Tools.toId(this.topcard) + '.gif" width="62" height="68" /><br><b><u>' + this.topcard + '</u></b><br>' + this.types.join("/") + '<br></center></div>';
			this.say("The top card is:");
			this.say("/addhtmlbox " + htmlstr);
		} else {
			this.say("**The top card is: " + this.topcard + " (" + this.types.join("/") + ").**");
		}
	}

	getString(cards) {
		let height = Math.floor((cards.length + 1) / 2) * 80;
		let start = '<div class="infobox"><div style="height: ' + height + 'px">';
		let strs = [];
		for (let i = 0, len = cards.length; i < len; i++) {
			let card = cards[i];
			let mon = Tools.data.pokedex[Tools.toId(card)];
			if (mon) {
				let num;
				if (mon.num < 10) {
					num = '00' + mon.num.toString();
				} else if (mon.num < 100) {
					num = '0' + mon.num.toString();
				} else {
					num = mon.num.toString();
				}
				strs.push('<div style="float: left; width: 50%"><img src="http://www.serebii.net/pokedex-sm/icon/' + num + '.png" width="32" height="32" /><b><u>' + mon.species + "</u></b><br>" + mon.types.join("/") + "<br></div>"); 
			} else {
				strs.push('<div style="float: left; width: 50%"><img src="http://play.pokemonshowdown.com/sprites/bwicons/0.png" width="32" height="32" /><b><u>' + card + '</u></b><br>' + shortdescription[card] + "<br><br><br></div>");
			}
			//<div class="infobox"><div style="height: 80px"><div style="float: left; width: 50%"><img src="http://www.serebii.net/pokedex-sm/icon/422.png" width="32" height="32" /><b><u>Shellos</u></b><br>Water<br></div></div></div>
			//<div class="infobox"><div style="height: 240px"><div style="float: left; width: 50%"><img src="http://www.serebii.net/pokedex-sm/icon/207.png" width="32" height="32" /><b><u>Gligar</u></b><br>Purple<br>Ground/Flying<br><br></div>
		}
		return (start + strs.join("") + "</div></div>");
	}

	sayDrawCards(cards, player) {
		if (Users.self.hasRank(this.room.id, '+')) {
			let str = this.getString(this.cards.get(player));
			player.say("You drew:");
			this.say("/pminfobox " + player.id + ", " + str);
		} else {
			let strs = [];
			for (let i = 0, len = cards.length; i < len; i++) {
				let card = cards[i];
				let mon = Tools.data.pokedex[Tools.toId(card)];
				if (mon) {
					strs.push(mon.species + " (" + mon.types.join("/") + ")");
				} else {
					strs.push(card + " (" + descriptions[card] + ")");
				}
			}
			player.say("You drew: " + strs.join(", "));
		}
	}

	sayCards(player, isStart) {
		if (Users.self.hasRank(this.room.id, '+')) {
			let str = this.getString(this.cards.get(player));
			player.say((isStart ? "Starting" : "Current") + " hand: ");
			console.log('/n' + str + '/n');
			this.say("/pminfobox " + player.id + ", " + str);
		} else {
			let cards = this.cards.get(player);
			if (!cards) return;
			let strs = []
			for (let i = 0, len = cards.length; i < len; i++) {
				let card = cards[i];
				let mon = Tools.data.pokedex[Tools.toId(card)];
				let str = card;
				if (mon) {
					str += "(" + mon.types.join("/") + ")";
				} else {
					str += " (" + descriptions[card] + ")";
				}
				strs.push(str);
			}
			player.say((isStart ? "Starting" : "Current") + " hand: " + strs.join(", "));
		}
		
	}

	onStart() {
		this.say("Now handing out cards!");
		for (let userID in this.players) {
			let cards = [];
			for (let i = 0; i < this.numCards; i++) {
				cards.push(this.getCard());
			}
			let player = this.players[userID];
			this.cards.set(player, cards);
			this.sayCards(player, true);
		}
		this.topcard = this.mons.shift();
		this.types = Tools.data.pokedex[Tools.toId(this.topcard)].types;
		this.sayTopCard();
		this.order = this.getRandomOrdering();
		this.num = this.order.length;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	canPlay(player) {
		let cards = this.cards.get(player);
		if (!cards) return false;
		for (let i = 0, len = cards.length; i < len; i++) {
			let card = cards[i];
			for (let j = 0; j < this.specialCards.length; j++) {
				if (Tools.toId(this.specialCards[j]) === Tools.toId(card)) {
					return true;
				}
			}
			if (this.hasSuperEffective(card)) return true;
		}
		return false;
	}

	onNextRound() {
		if (this.curPlayer) {
			this.say(this.curPlayer.name + " didn't play a card and is eliminated!");
			this.curPlayer.eliminated = true;
		}
		if (this.getRemainingPlayerCount() === 1) {
			let pleft = this.getRemainingPlayers();
			let lastPlayer = pleft[Object.keys(pleft)[0]];
			this.say("**Winner**: " + lastPlayer.name);
			this.end();
			return;
		}
		this.curPlayer = null;
		while ((!this.curPlayer || this.curPlayer.eliminated) && this.num < this.order.length) {
			this.curPlayer = this.order[this.num];
			this.num++;
		}
		if (!this.curPlayer || this.curPlayer.eliminated) {
			this.battleRound++;
			this.say("**Round " + this.battleRound + "**! " + this.getPlayerNames(this.getRemainingPlayers()));
			this.num = 0;
		}
		while ((!this.curPlayer || this.curPlayer.eliminated) && this.num < this.order.length) {
			this.curPlayer = this.order[this.num];
			this.num++;
		}
		if (!this.canPlay(this.curPlayer)) {
			this.say(this.curPlayer.name + " couldn't play any cards and is eliminated!");
			this.curPlayer.eliminated = true;
			this.curPlayer = null;
			this.nextRound();
		} else {
			this.say(this.curPlayer.name + "'s turn!");
			this.timeout = setTimeout(() => this.nextRound(), 30 * 1000);
		}
	}

	isSuperEffective(type) {
		let mult = 1;
		for (let i = 0, len = this.types.length; i < len; i++) {
			mult *= this.convertMult(Tools.data.typechart[this.types[i]].damageTaken[type]);
		}
		return (mult > 1);
	}

	hasSuperEffective(card) {
		let mon = Tools.data.pokedex[Tools.toId(card)];
		if (!mon) return;
		for (let i = 0, len = mon.types.length; i < len; i++) {
			if (this.isSuperEffective(mon.types[i])) return true;
		}
		return false;
	}

	turnFirstUpper(str) {
		return str[0].toUpperCase() + str.substr(1);
	}

	sayIllegal(target, player) {
		let actual;
		for (let i = 0, len = this.specialCards.length; i < len; i++) {
			let card = this.specialCards[i];
			if (Tools.toId(card) === target) {
				actual = card;
				break;
			}
		}
		if (target in Tools.data.pokedex) {
			actual = Tools.data.pokedex[target].species;
		}
		if (actual) {
			return player.say("You don't have [" + actual + "].");
		} else {
			return player.say("Please play a valid card.");
		}
	}

	play(target, user) {
		if (!this.curPlayer) return;
		let player = this.players[user.id];
		if (!player || player !== this.curPlayer) return;
		let cards = this.cards.get(player);
		let used, index;
		let split = target.split(",");
		target = Tools.toId(split[0]);
		for (let i = 0, len = cards.length; i < len; i++) {
			let card = cards[i];
			if (Tools.toId(card) === target) {
				used = card;
				index = i;
				break;
			}
		}
		if (!used) {
			return this.sayIllegal(target, player);
		}
		let isSpecial = false;
		for (let i = 0, len = this.specialCards.length; i < len; i++) {
			let card = this.specialCards[i];
			if (Tools.toId(card) === target) {
				isSpecial = true;
				break;
			}
		}
		let indices = [index];
		if (isSpecial) {
			let numCards = 1;
			if (target === 'soak') {
				this.types = ['Water'];
			} else if (target === 'conversion') {
				if (split.length !== 2) {
					return this.say("Usage: ``" + Config.commandCharacter + "play Conversion, [type]``");
				}
				let type = this.turnFirstUpper(Tools.toId(split[1]));
				if (!(type in Tools.data.typechart)) {
					return this.say("Invalid type.");
				}
				this.types = [this.turnFirstUpper(type)];
			} else if (target === 'conversion2') {
				if (split.length !== 3) {
					return this.say("Usage: ``" + Config.commandCharacter + "play Conversion2, [type1], [type2]``");
				}
				let type1 = this.turnFirstUpper(Tools.toId(split[1])), type2 = this.turnFirstUpper(Tools.toId(split[2]));
				if (!(type1 in Tools.data.convertType && type2 in Tools.data.convertType)) {
					return this.say("Invalid type.");
				}
				this.types = [this.turnFirstUpper(type1), this.turnFirstUpper(type2)];
			} else if (target === 'trickortreat') {
				if (this.types.indexOf('Ghost') === -1) {
					this.types.push("Ghost");
				}
			} else if (target === 'forestscurse') {
				if (this.types.indexOf("Grass") === -1) {
					this.types.push("Grass");
				}
			} else if (target === 'explosion') {
				numCards = 0;
			} else if (target === 'recycle') {
				numCards = 2;
			} else if (target === 'transform') {
				if (split.length !== 2) {
					return this.say("Usage: ``" + Config.commandCharacter + "play Transform, [pokemon]``");
				}
				let mon = Tools.data.pokedex[Tools.toId(split[1])];
				if (!mon) {
					return user.say("Please play a valid pokemon.");
				}
				this.topcard = mon.species;
				this.types = mon.types;
			} else if (target === 'batonpass' || target === 'allyswitch') {
				if (split.length !== 2) {
					return this.say("Usage: ``" + Config.commandCharacter + "play " + Tools.data.moves[target].name + ", [pokemon]``");
				}
				let newtop = Tools.toId(split[1]);
				let i, len;
				for (i = 0, len = cards.length; i < len; i++) {
					if (Tools.toId(cards[i]) === newtop) {
						break;
					}
				}
				if (i === len) {
					return this.sayIllegal(Tools.toId(split[1]), player);
				} else {
					newtop = Tools.data.pokedex[newtop];
					if (!newtop) {
						return user.say("That is not a valid Pokemon!");
					}
					let card1 = this.getCard();
					let card2 = (target === 'batonpass' ? this.getCard() : this.topcard);
					this.topcard = newtop.species;
					this.types = Tools.data.pokedex[Tools.toId(this.topcard)].types;
					let newcards = [card1, card2];
					this.sayDrawCards(newcards, player);
					indices.sort();
					for (let i = indices.length - 1; i >= 0; i--) {
						cards.splice(indices[i], 1);
					}
					cards.push(card1);
					cards.push(card2);
					this.cards.set(player, cards);
				}
			}
			if (target !== 'allyswitch' && target !== 'batonpass') {
				indices.sort();
				for (let i = indices.length - 1; i >= 0; i--) {
					cards.splice(indices[i], 1);
				}
				let newcards = [];
				for (let i = 0; i < numCards; i++) {
					let card = this.getCard();
					newcards.push(card);
					cards.push(card);
				}
				if (newcards.length > 0) {
					this.sayDrawCards(newcards, player);
				}
				this.cards.set(player, cards);
			}
			this.sayCards(player, false);
			this.curPlayer = null;
			this.sayTopCard();
			clearTimeout(this.timeout);
			this.nextRound();
		} else {
			if (this.hasSuperEffective(used)) {
				cards.splice(index, 1);
				this.topcard = used;
				this.types = Tools.data.pokedex[Tools.toId(used)].types;
				let newCard = this.getCard();
				cards.push(newCard);
				this.cards.set(player, cards);
				this.sayDrawCards([newCard], player);
				this.sayCards(player, false);
				this.curPlayer = null;
				clearTimeout(this.timeout);
				this.sayTopCard();
				this.nextRound();
			} else {
				return user.say("That Pokemon does not have any super-effective STAB against the top card!");
			}
		}
	}
	hand(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		this.sayCards(player, false);
	}
}

exports.game = Axew;
exports.id = id;
exports.name = name;
exports.description = description;
exports.aliases = ['abc'];
exports.commands = {
	"play": "play",
	"hand": "hand",
};