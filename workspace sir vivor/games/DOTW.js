'use strict';

const name = "Days of the Week";
const id = Tools.toId(name);
const description = "__When \"it's not my day\" becomes literal.__ Game rules: https://sites.google.com/view/survivor-ps/themes-and-events/survivor-themes/days-of-the-week";

class DOTW extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.attacks = new Map();
		this.predictions = new Map();
		this.canAttack = false;
		this.order = [];
		this.numAttacks = 0;
		this.hasBeenKilled = new Map();
		this.currentWins = new Map();
		this.rollBoosts = new Map();
		this.win3 = new Map();
		this.day = new Date().getDay();
		this.days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		this.playerDays = new Map();
		this.fp = false;
	}

	onStart() {
		this.nextRound();
	}

	onNextRound() {
		this.attacks.clear();
		this.predictions.clear();
		this.hasBeenKilled.clear();
		this.playerDays.clear();
		this.win3 = new Map();
		if (this.getRemainingPlayerCount() !== 2) {
			this.say("Today is currently **" + Tools.turnFirstUpper(this.days[this.day]) + "**!");
			let text = "**Remaining Players: (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + "! PM me your attacks now with ``" + Config.commandCharacter + "destroy [user]``";
			if (this.day === 2) {
				text += " You can also pm me ``" + Config.commandCharacter + "getpredictions`` to see the possible predictions";
			} else if (this.day === 0) {
				this.say("The theme is standard **Hunger Games**!");
			}
			this.say(text);
		} else {
			this.doFinals();
			return;
		}
		this.canAttack = true;
		this.numAttacks = 0;
		this.order = [];
		this.timeout = setTimeout(() => this.listWaiting(), 60 * 1000);
	}

	doFinals() {
		this.finals = true;
		let remainingPlayers = this.getRemainingPlayers();
		let index = Math.floor(Math.random() * 2);
		for (let i = 0; i < 2; i++) {
			if (i === index) {
				this.curPlayer = this.players[Object.keys(remainingPlayers)[i]];
			} else {
				this.oplayer = this.players[Object.keys(remainingPlayers)[i]];
			}
		}
		this.dayWaiting = true;
		this.say("**" + this.curPlayer.name + "** and **" + this.oplayer.name + "**, select the day you would like for finals with ``" + Config.commandCharacter + "selectday [day-name]``.");
		this.timeout = setTimeout(() => this.listDaysWaiting(), 60 * 1000);
	}

	listDaysWaiting() {
		let waitings = [];
		if (!this.playerDays.has(this.curPlayer)) waitings.push(this.curPlayer.name);
		if (!this.playerDays.has(this.oplayer)) waitings.push(this.oplayer.name);
		this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimDays(), 30 * 1000);
	}

	elimDays() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.playerDays.has(player)) {
				player.eliminated = true;
				player.say("You didn't choose a day and were eliminated!");
			}
		}
		this.nextRound();
	}

	listWaiting() {
		let waitings = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) waitings.push(player.name);
		}
		if (waitings.length) this.say("Waiting on: " + waitings.join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.attacks.has(player)) {
				player.eliminated = true;
				player.say("You didn't attack someone this round and are eliminated!");
			}
		}
		this.handleAttacks();
	}

	handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			this.beforeNextRound();
			return;
		}
		this.curPlayer = this.order.shift();
		this.oplayer = this.attacks.get(this.curPlayer);
		if (this.curPlayer.eliminated || this.oplayer.eliminated)  {
			this.handleAttacks();
			return;
		}
		this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
		if (this.day === 5) {
			this.currentWins.clear();
			this.hasWon = false;
		}
		this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
	}

	beforeNextRound() {
		this.rollBoosts.clear();
		if (this.day === 3) {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated || !this.win3.has(player)) continue;
				this.rollBoosts.set(player, this.win3.get(player) ? 20: -20);
			}
		} else if (this.day === 2) {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player.eliminated || !this.predictions.has(player)) continue;
				if (this.correctPrediction(player)) this.rollBoosts.set(player, 20);
			}
		}
		this.day++;
		if (this.day > 6) this.day = 0;
		this.nextRound();
	}

	correctPrediction(player) {
		let prediction = this.predictions.get(player);
		if (prediction[0] === "die") {
			return prediction[1].eliminated;
		} else if (prediction[1] === "survive") {
			return !(prediction[1].eliminated);
		} else {
			return this.attacks.get(prediction[1]) === player;
		}
	}
	doRolls() {
		if (this.day === 1) {
			this.roll1 = 75;
		} else {
			this.roll1 = 100;
		}
		this.roll2 = 100;
		if (this.rollBoosts.has(this.curPlayer)) this.roll1 += this.rollBoosts.get(this.curPlayer);
		if (this.rollBoosts.has(this.oplayer)) this.roll2 += this.rollBoosts.get(this.oplayer);
		this.sayPlayerRolls();
	}

	handleRoll(roll) {
		if (this.pikachuWaiting) {
			if (this.finals) {
				if (roll > 70) {
					if (this.fp) {
						this.say("Pikachu's Thunder hits **" + this.oplayer.name + "**!");
						this.oplayer.eliminated = true;
					} else {
						this.say("Pikachu's Thunder hits **" + this.curPlayer.name + "**!");
						this.curPlayer.eliminated = true;
					}
				} else {
					if (this.fp) {
						this.say("**" + this.oplayer.name + "** dodges Pikachu's Thunder!");
					} else {
						this.say("**" + this.curPlayer.name + "** dodges Pikachu's Thunder!");
					}
				}
				this.fp = !this.fp;
				if (!this.fp) {
					if (this.getRemainingPlayerCount() === 1) {
						this.end();
						return;
					} else {
						this.say("Since both players " + (this.curPlayer.eliminated ? "were hit by" : "dodged") + " Pikachu's Thunder, we will do regular hunger games battle");
						this.curPlayer.eliminated = false;
						this.oplayer.eliminated = false;
						this.finalsPikachu = true;
						this.day = 0;
						this.pikachuWaiting = false;
						this.say("!pick " + this.curPlayer.name + ", " + this.oplayer.name);
						return;
					}
				} else {
					this.say("Rolling for Pikachu's Thunder for **" + this.oplayer.name + "**!");
					this.say("!roll 100");
					return;
				}
			} else {
				if (roll > 70) {
					this.winPlayer.eliminated = true;
					this.say("Pikachu's Thunder hits **" + this.winPlayer.name + "**!");
				} else {
					this.say("**" + this.winPlayer.name + "** dodges Pikachu's Thunder!");
				}
			}
			this.pikachuWaiting = false;
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
		} else if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			if (this.rolla > this.rollb) {
				this.winPlayer = this.curPlayer;
				this.losePlayer = this.oplayer;
			} else if (this.rolla < this.rollb) {
				this.winPlayer = this.oplayer;
				this.losePlayer = this.curPlayer;
			} else {
				this.say("The rolls were the same! Rerolling...");
				this.sayPlayerRolls();
				return;
			}
			if (this.day === 5) {
				if (this.hasWon) {
					let numWins = this.currentWins.get(this.winPlayer) || 0;
					if (numWins === 2) {
						this.say("**" + this.winPlayer.name + "** sweeps and gains 20 to their roll on Saturday!");
						this.win3.set(this.winPlayer, true);
					} else {
						this.say("**" + this.losePlayer.name + "** loses the third matchup and loses 20 to their roll on Saturday!");
						this.win3.set(this.losePlayer, true);
					}
					this.hasWon = false;
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					return;
				}
				let numWins = this.currentWins.get(this.winPlayer) || 0;
				if (numWins === 1) {
					this.losePlayer.eliminated = true;
					let otherWins = this.currentWins.get(this.losePlayer) || 0;
					if (otherWins === 1 || this.finals) {
						this.say("**" + this.winPlayer.name + "** wins the bo3 matchup against **" + this.losePlayer.name + "**!");
						this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
					} else {
						this.hasWon = true;
						this.waitingAction = true;
						this.say("**" + this.winPlayer.name + "** wins the first two matchups against **" + this.losePlayer.name + "**! **" + this.winPlayer.name + "**, would you like to go for a sweep? Use ``" + Config.commandCharacter + "continue yes/no`` to decide");
						this.currentWins.set(this.winPlayer, 2);
						this.timeout = setTimeout(() => this.elimPlayer(this.winPlayer), 60 * 1000);
					}
				}  else {
					this.say("**" + this.winPlayer.name + "** wins the matchup!");
					this.currentWins.set(this.winPlayer, 1);
					this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
				}
			} else if (this.day === 1) {
				if (this.losePlayer === this.oplayer && [1, 21, 69].indexOf(this.rollb) !== -1) {
					this.say("**" + this.losePlayer.name + "** survives through the power of memes!");
				} else if (this.losePlayer === this.oplayer) {
					this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**!");
					this.losePlayer.eliminated = true;
				} else {
					this.say("**" + this.winPlayer.name + "** defends successfully!");
				}
				if (this.finals && this.getRemainingPlayerCount() > 1) {
					this.timeout = setTimeout(() => this.finalDay(), 5 * 1000);
				} else {
					this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
				}
			} else if (this.day === 0 || this.day === 2) {
				this.losePlayer.eliminated = true;
				this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**!");
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			} else if (this.day === 4) {
				this.losePlayer.eliminated = true;
				this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**! Rolling for Pikachu's Thunder: ");
				this.pikachuWaiting = true;
				this.say("!roll 100");
			} else if (this.day === 6) {
                if (this.losePlayer === this.curPlayer) {
                    this.say("**" + this.winPlayer.name + "** defended successfully!");
                } else {
                    if (this.hasBeenKilled.has(this.losePlayer)) {
                        this.losePlayer.eliminated = true;
                        this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**!**" + this.losePlayer.name + "** has already lost and is eliminated!");
                    } else {
                        this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**! It is **" + this.losePlayer.name + "**'s first time losing so they ain't dead yet");
                        this.hasBeenKilled.set(this.losePlayer, true);
                    }
                }
				this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			} else if (this.day === 3) {
				this.say("!pick Golf, Reroll, 25 to Lower Roll, Hump day");
			}
		}
	}

	handlePick(message) {
		message = Tools.toId(message);
		if (message in this.players) {
			if (message === this.oplayer.id) {
				let temp = this.curPlayer;
				this.curPlayer = this.oplayer;
				this.oplayer = temp;
			}
			this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
			this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
		} else if (this.days.indexOf(message) !== -1) {
			this.say("The days for finals is **" + Tools.turnFirstUpper(message) + "**!");
			this.day = this.days.indexOf(message);
			this.finalDay();
		} else {
			if (message === "reroll") {
				this.say("Reroll!");
				this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
				return;
			} else if (message === "golf") {
				if (this.rolla < this.rollb) {
					this.winPlayer = this.curPlayer;
					this.losePlayer = this.oplayer;
				} else {
					this.winPlayer = this.oplayer;
					this.losePlayer = this.curPlayer;
				}
				this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**!");
				this.losePlayer.eliminated = true;
			} else if (message === "25tolowerroll") {
				if (this.rolla < this.rollb) {
					this.rolla += 25;
				} else {
					this.rollb += 25;
				}
				if (this.rolla < this.rollb) {
					this.winPlayer = this.oplayer;
					this.losePlayer = this.curPlayer;
				} else {
					this.winPlayer = this.curPlayer;
					this.losePlayer = this.oplayer;
				}
				this.say("**" + this.winPlayer.name + "** defeats **" + this.losePlayer.name + "**!");
				this.losePlayer.eliminated = true;
			} else {
				this.say("Both players survive through the power of camel humps!");
			}
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
		}

	}

	finalDay() {
		if (this.day !== 4) {
			this.say("!pick " + this.curPlayer.name + ", " + this.oplayer.name);
		} else {
			this.say("Rolling for Pikachu's thunder for **" + this.curPlayer.name + "**!");
			this.pikachuWaiting = true;
			this.say("!roll 100");
		}
	}
	elimPlayer(player) {
		player.eliminated = true;
		this.say("**" + player.name + "** didn't choose an action!");
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let attackedPlayer = this.players[Tools.toId(target)];
		if (!attackedPlayer) return user.say("That player is not in the game!");
		if (attackedPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (attackedPlayer === player) return user.say(">attacking yourself");
		this.attacks.set(player, attackedPlayer);
		user.say("You have attacked **" + attackedPlayer.name + "**!");
		this.numAttacks++;
		this.order.push(player);
		if (this.numAttacks === this.getRemainingPlayerCount() && this.day !== 2) {
			clearTimeout(this.timeout);
			this.handleAttacks();
		}
	}

	getpredictions(target, user) {
		let messages = [
			{
				msg: Config.commandCharacter + "predict die, [user]",
				desc: "Predict the given user will die",
			},
			{
				msg: Config.commandCharacter + "predict survive, [user]",
				desc: "Predict the given user will survive",
			},
			{
				msg: Config.commandCharacter + "predict attack, [user]",
				desc: "Predict the given user will attack you",
			}
		]
		let str = "<div class = \"infobox\"><html>";
		for (let i = 0; i < messages.length; i++ ) {
			let msg = messages[i];
			str += "<b>" + msg.msg + "</b><ul><li>" + msg.desc + "</li></ul>";
		}
		str += "</html></div>";
		Rooms.get('survivor').say("/pminfobox " + user.id + ", " + str);
	}

	predict(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (!this.attacks.has(player)) return player.say("You must attack before you can predict");
		let split = target.split(",");
		if (split.length !== 2) {
			return user.say("You must specify the action and the who you think it will affect");
		}
		split = split.map(m => Tools.toId(m));
		if (["die", "survive", "attack"].indexOf(split[0]) === -1) {
			return user.say("You must specify either ``die``, ``survive``, or ``attack`` as your first parameter");
		}
		if (Tools.toId(split[0]) === "constructor") return user.say("You cannot attack 'constructor'");
		let targPlayer = this.players[split[1]];
		if (!targPlayer) {
			return user.say("The player you specified is not in the game!");
		}
		if (targPlayer.eliminated) {
			return user.say("That player has already been eliminated!");
		}
		if (targPlayer === player) {
			return user.say("You cannot predict yourself");
		}
		if (["die", "survive"].indexOf(split[0]) !== -1 && targPlayer === this.attacks.get(player)) {
			return user.say("You can't select your current target to " + split[0] + ".");
		}
		this.predictions.set(player, [split[0], targPlayer]);
		if (split[0] === "die") {
			return user.say("You have predicted that **" + targPlayer.name + "** will die!");
		} else if (split[0] === "survive") {
			return user.say("You have predicted that **" + targPlayer.name + "** will survive!");
		} else {
			return user.say("You have predicted that **" + targPlayer.name + "** will attack you!");
		}
	}

	continue(target, user) {
		if (!this.waitingAction) return;
		let player = this.players[user.id];
		if (!player || player.id !== this.winPlayer.id) return;
		target = Tools.toId(target);
		if (["yes", "no"].indexOf(target) === -1) return user.say("You must use **on** or **off** after ``continue``");
		clearTimeout(this.timeout);
		this.waitingAction = false;
		if (target === "yes") {
			this.say("**" + this.winPlayer.name + "** tries to sweep **" + this.losePlayer.name + "**!");
			this.timeout = setTimeout(() => this.doRolls(), 5 * 1000);
		} else {
			this.say("**" + this.winPlayer.name + "** does not go for the sweep.");
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
		}
	}

	selectday(target, user) {
		if (!this.dayWaiting) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		target = Tools.toId(target);
		if (this.days.indexOf(target) === -1) {
			return user.say("**" + target + "** is not a valid day");
		}
		if (target === "saturday") {
			return user.say("You cannot select **Saturday** for finals");
		}
		this.playerDays.set(player, Tools.turnFirstUpper(target));
		player.say("You have chosen **" + Tools.turnFirstUpper(target) + "**!");
		if (this.playerDays.has(this.curPlayer) && this.playerDays.has(this.oplayer)) {
			clearTimeout(this.timeout);
			this.dayWaiting = false;
			this.say("!pick " + this.playerDays.get(this.curPlayer) + ", " + this.playerDays.get(this.oplayer));
		}
	}
}
exports.id = id;
exports.name = name;
exports.description = description;
exports.game = DOTW;
exports.commands = {
	destroy: "destroy",
	getpredictions: "getpredictions",
	predict: "predict",
	continue: "continue",
	cont: "continue",
	selectday: "selectday",
}
exports.pmCommands = {
	destroy: true,
	getpredictions: true,
	predict: true,
	continue: true,
	cont: true,
	selectday: true,
}
exports.aliases = ["dotw", "dayoftheweek"]; 
