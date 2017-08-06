'use strict';

const name = "Follow the Leader";
const id = Tools.toId(name);
const description = "https://docs.google.com/document/d/1qxWxauszszocyGgncJx2CghnI6ydnXz0SyJZfZ-OexQ/edit";

class FTL extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.votes = new Map();
		this.actions = new Map();
		this.suspected = new Map();
		this.immunities = new Map();
		this.rolls = new Map();
		this.numActions = 0;
		this.voting = false;
		this.canAction = false;
		this.canSuspect = false;
		this.rollingLeader = false;
		this.playerRoll = false;
		this.canScapegoat = false;
		this.scapeBattle = false;
		this.chooseNewLeader = false;
		this.leaderid = "";
		this.leaderroll = 0;
		this.rolla = null;
		this.rollb = null;
	}

	onStart() {
		this.say("/wall Remaining Players: " + Object.values(this.getRemainingPlayers()).map(pl => pl.name).join(", "));
		this.say("Vote for who you would like the leader to be with ``" + Config.commandCharacter + "vote [user]``");
		this.timeout = setTimeout(() => this.listVotesWaiting(), 60 * 1000);
		this.voting = true;
	}

	listVotesWaiting() {
		this.say("Waiting on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.votes.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimPlayers(), 30 * 1000);
	}

	elimPlayers() {
		for (let userID in this.players) {
			let pl = this.players[userID];
			if (!pl.eliminated && !this.votes.has(pl)) {
				pl.eliminated = true;
				pl.say("You didn't vote for the leader, and are eliminated!");
			}
		}
		this.selectLeader();
	}
	
	selectLeader() {
		this.voting = false;
		let votes = {};
		for (let userID in this.getRemainingPlayers()) {
			let vote = this.votes.get(this.players[userID]);
			if (!(vote.id in votes)) votes[vote.id] = 0;
			votes[vote.id]++;
		}
		let maxVotes = [];
		let maxNumVotes = 0;
		for (let userID in this.players) {
			let numVotes = votes[userID] || 0;
			if (numVotes > maxNumVotes) {
				maxVotes = [this.players[userID]];
				maxNumVotes = numVotes;
			} else if (numVotes === maxNumVotes) {
				maxVotes.push(this.players[userID]);
			}
		}
		if (maxVotes.length > 1) {
			this.say("**" + maxVotes.map(pl => pl.name).join(", ") + "** tied in votes for the leader! A roll battle will happen to determine the leader.");
			this.voteOrder = maxVotes;
			this.timeout = setTimeout(() => this.rollBattle(), 5 * 1000);
		} else {
			this.leaderid = maxVotes[0].id;
			this.say("**" + maxVotes[0].name + "** was voted to be the leader!");
			this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
	}

	rollBattle() {
		this.say("!roll " + this.voteOrder.length + "d100");
	}

	handleRolls(rolls) {
		let maxRoll = Math.max(...rolls);
		let bestPlayers = [];
		for (let i = 0; i < rolls.length; i++) {
			if (rolls[i] === maxRoll) {
				bestPlayers.push(this.voteOrder[i]);
			}
		}
		if (bestPlayers.length > 1) {
			this.say("**" + bestPlayers.map(pl => pl.name).join(", ") + "** tied in the roll battle, so we will have another roll battle!");
			this.voteOrder = bestPlayers;
			this.timeout = setTimeout(() => this.rollBattle(), 5 * 1000);
		} else {
			this.leaderid = bestPlayers[0].id;
			this.say("**" + bestPlayers[0].name + "** won the roll battle to become the leader!");
			this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		}
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 2) {
			this.finals = true;
			this.say("/wall Finals! " + Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name).join(" vs. ") + "!");
			this.say("!pick " + this.getPlayerNames(this.getRemainingPlayers()));
		} else {
			this.say("/wall Players: " + Object.values(this.players).filter(pl => !pl.eliminated && pl.id !== this.leaderid).map(pl => pl.name).join(", ") + " | Leader: " + this.players[this.leaderid].name + ".");
			this.say("/wall If you are not the leader, pm me whether you would like to revolt or follow the leader with ``" + Config.commandCharacter + "revolt`` and ``" + Config.commandCharacter + "follow``, respectively.");
			this.actions.clear();
			this.canAction = true;
			this.numActions = 0;
			this.timeout = setTimeout(() => this.listActionsWaiting(), 60 * 1000);
		}
	}

	listActionsWaiting() {
		this.say("Waiting on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.actions.has(pl) && pl.id !== this.leaderid).map(pl => pl.name).join(", "))
		this.timeout = setTimeout(() => this.elimActions(), 30 * 1000);
	}

	elimActions() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.actions.has(player) && player.id !== this.leaderid) {
				player.eliminated = true;
				player.say("You didn't choose an action this round and are eliminated!");
			}
		}
		this.leaderSuspect();
	}

	leaderSuspect() {
		this.suspected.clear();
		this.canAction = false;
		this.say("/wall " + this.players[this.leaderid].name + ", select a player to suspect with ``" + Config.commandCharacter + "suspect [player]``");
		this.canSuspect = true;
		this.timeout = setTimeout(() => this.noSuspect(), 90 * 1000);
	}

	noSuspect() {
		this.say("The leader did not suspect anybody!");
		this.leaderRoll();
	}

	leaderRoll() {
		this.rollingLeader = true;
		this.say("Rolling for the leader for the round!");
		this.say("!roll 150");
	}

	nextPick() {
		let remainingPlayers = Object.values(this.players).filter(pl => !pl.eliminated && !this.immunities.has(pl) && !this.rolls.has(pl) && pl.id !== this.leaderid);
		if (remainingPlayers.length === 0) {
			this.selectNewLeader();
		} else if (remainingPlayers.length === 1) {
			this.curPlayer = remainingPlayers[0];
			this.nextRoll();
		} else {
			this.say("!pick " + remainingPlayers.map(pl => pl.name).join(", "));
		}
	}

	selectNewLeader() {
		if (this.getRemainingPlayerCount() === 1) {
			this.nextRound();
			return;
		}
		let hasRevolt = false;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (this.actions.get(player) === "revolt") {
				hasRevolt = true;
				break;
			}
		}
		if (hasRevolt) {
			let leaderElimmed = true;
			for (let userID in this.players) {
				let player = this.players[userID];
				if (this.actions.get(player) === "revolt" && player.eliminated) {
					leaderElimmed = false;
					break;
				}
			}
			if (leaderElimmed) {
				this.players[this.leaderid].eliminated = true;
				this.say("The revolters were successfully in killing the leader!");
			}
			let rolls = Object.values(this.players).filter(pl => !pl.eliminated && this.rolls.has(pl)).map(pl => this.rolls.get(pl));
			let maxroll = Math.max(...rolls);
			let maxPlayers = Object.values(this.players).filter(pl => this.rolls.get(pl) === maxroll);
			if (maxPlayers.length > 1) {
				this.say("The rolls results in a tie between **" + maxPlayers.map(pl => pl.name).join(", ") + "**!");
				this.chooseNewLeader = true;
				this.say("!pick " + maxPlayer.map(pl => pl.name).join(", "));
			} else {
				this.leaderid = maxPlayers[0].id;
				this.say("The new Leader is **" + maxPlayers[0].name + "**!");
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			}
		} else {
			let rolls = Object.values(this.players).filter(pl => !pl.eliminated && this.rolls.has(pl)).map(pl => this.rolls.get(pl));
			let minroll = Math.min(...rolls);
			let minPlayers = Object.values(this.players).filter(pl => this.rolls.get(pl) === minroll);
			if (minPlayers.length > 1) {
				this.say("The rolls results in a tie between **" + maxPlayers.map(pl => pl.name).join(", ") + "**!");
				this.chooseNewLeader = true;
				this.say("!pick " + minPlayers.map(pl => pl.name).join(", "));
			} else {
				this.leaderid = minPlayers[0].id;
				this.say("The new Leader is **" + minPlayers[0].name + "**!");
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			}
		}
	}

	finalRollBattle() {
		this.rolla = null;
		this.rollb = null;
		this.say("!roll 100");
		this.say("!roll 100");
	}

	handlePick(message) {
		this.curPlayer = this.getPlayer(message);
		if (this.finals) {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (player !== this.curPlayer && !player.eliminated) this.oplayer = player;
			}
			this.say("**" + this.curPlayer.name + "** is attacking **" + this.oplayer.name + "**!");
			this.timeout = setTimeout(() => this.finalRollBattle(), 5 * 1000);
		} else if (this.chooseNewLeader) {
			this.say("The new leader is **" + this.curPlayer.name + "**!");
			this.leaderid = this.curPlayer.id;
			this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
		} else {
			this.nextRoll();
		}
	}

	nextRoll() {
		this.playerRoll = true;
		this.say("Rolling for **" + this.curPlayer.name + "**!");
		if (this.suspected.has(this.curPlayer)) {
			this.say("!roll 120");
		} else {
			this.say("!roll 150");
		}
	}

	elimScape() {
		this.curPlayer.eliminated = true;
		this.say("**" + this.curPlayer.name + "** failed to select their scapegoat!");
		this.canScapegoat = false;
		this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
	}

	handleRoll(roll) {
		if (this.rollingLeader) {
			if (roll <= 20 || roll >= 130) {
				this.say("The leader's roll must be between 20 and 130, rerolling...");
				this.say("!roll 150");
				return;
			}
			this.leaderroll = roll;
			this.rollingLeader = false;
			this.say("The leader's roll for the round is **" + roll + "**!");
			this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
		} else if (this.playerRoll) {
			this.playerRoll = false;
			this.rolls.set(this.curPlayer, roll);
			let action = this.actions.get(this.curPlayer);
			if ((roll < this.leaderroll && action === "follow") || (roll > this.leaderroll && action === "revolt")) {
				this.say("**" + this.curPlayer.name + "** successfully " + action + "ed " + (action === "revolt" ? "against " : "") + "the leader!");
			} else if (roll === this.leaderroll) {
				this.immunities.set(this.curPlayer, 2);
				this.say("**" + this.curPlayer.name + "** rolled the same as the leader, and is immune for the current and next rounds.");
			} else {
				if (this.suspected.has(this.curPlayer) && this.getRemainingPlayerCount() > 2) {
					this.canScapegoat = true;
					this.say("**" + this.curPlayer.name + "** failed to " + action + (action === "revolt" ? " against": "") + " the leader! As they were suspected this round, they can attempt to have another player take their place with ``" + Config.commandCharacter + "scapegoat [user]``");
					this.timeout = setTimeout(() => this.elimScape(), 90 * 1000);
					return;
				} else {
					this.say("**" + this.curPlayer.name + "** failed to " + action + (action === "revolt" ? " against": "") + " the leader!");
					this.curPlayer.eliminated = true;
				}
			}
			this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
		} else if (!this.rolla) {
			this.rolla = roll;
		} else {
			this.rollb = roll;
			let winPlayer, losePlayer;
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same! Rerolling...");
				if (this.scapeBattle) {
					this.timeout = setTimeout(() => this.scapeGoatBattle(), 5 * 1000);
				}
				return;
			} else if (this.rolla > this.rollb) {
				 winPlayer = this.curPlayer;
				 losePlayer = this.oplayer;
			} else {
				winPlayer = this.oplayer;
				losePlayer = this.curPlayer;
			}
			this.say("**" + winPlayer.name + "** wins the roll battle against **" + losePlayer.name + "**!");
			losePlayer.eliminated = true;
			if (this.scapeBattle) {
				this.scapeBattle = false;
				this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
			} else {
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
			}
		}
	}

	scapeGoatBattle() {
		this.scapeBattle = true;
		this.rolla = null;
		this.rollb = null;
		this.say("!roll 70");
		this.say("!roll 100");
	}

	scapegoat(target, user) {
		if (!this.canScapegoat || this.curPlayer.id !== user.id) return;
		let targPlayer = this.players[Tools.toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (targPlayer.id === this.leaderid) return user.say("You cannot try to use the leader as the scapegoat.");
		if (this.immunities.has(targPlayer)) return user.say("That player is currently immune.");
		this.oplayer = targPlayer;
		this.canScapegoat = false;
		this.say("**" + this.curPlayer.name + "** has attempted to use **" + this.oplayer.name + "** as their scapegoat!");
		this.timeout = setTimeout(() => this.scapeGoatBattle(), 5 * 1000);
	}

	vote(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.voting) return;
		let targPlayer = this.players[Tools.toId(target)];
		if (!targPlayer) return user.say("That player is not in the game!");
		if (targPlayer.eliminated) return user.say("That player has already been eliminated!");
		if (targPlayer === player) return user.say("You cannot vote for yourself to be the leader.");
		if (this.votes.has(player)) return user.say("You have already voted for the leader.");
		this.votes.set(player, targPlayer);
		user.say("You have voted for **" + targPlayer.name + "** to be the Leader!");
		this.numActions++;
		if (this.numActions === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.selectLeader();
		}
	}

	suspect(target, user) {
		if (!this.canSuspect || user.id !== this.leaderid) return;
		let suspected = this.players[Tools.toId(target)];
		if (!suspected) return user.say("That player is not in the game!");
		if (suspected.eliminated) return user.say("That player has already been eliminated!");
		this.suspected.set(suspected, true);
		clearTimeout(this.timeout);
		this.say("/wall " + this.players[this.leaderid].name + " has chosen to suspect " + suspected.name + "!");
		this.leaderRoll();
	}

	revolt(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.canAction || player.id === this.leaderid) return;
		if (this.actions.has(player)) return player.say("You have already chosen your action this round.");
		this.actions.set(player, "revolt");
		user.say("You have chosen to revolt against the leader!");
		this.handleAction();
	}

	follow(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.canAction || player.id === this.leaderid) return;
		if (this.actions.has(player)) return player.say("You have already chosen your action this round.");
		this.actions.set(player, "follow");
		user.say("You have chosen to follow the leader!");
		this.handleAction();
	}

	handleAction() {
		this.numActions++;
		if (this.numActions === (this.getRemainingPlayerCount() - 1)) {
			clearTimeout(this.timeout);
			this.leaderSuspect();
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = FTL;
exports.commands = {
	"vote": "vote",
	"revolt": "revolt",
	"follow": "follow",
	"suspect": "suspect",
	"scapegoat": "scapegoat",
}
exports.pmCommands = {
	vote: true,
	revolt: true,
	follow: true,
}
exports.aliases = ["ftl"];