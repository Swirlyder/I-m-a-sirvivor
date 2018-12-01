'use strict';

const name = 'Weardown';
const description = '__Weardown__ Game rules: https://docs.google.com/document/d/1f_RGAU9ezc1zryJRtfB3ckGY98jIqnuaVLg3_LfrGJc/edit';
const id = Tools.toId(name);

class Weardown extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.hp = new Map();
	}

	onStart() {
        const playerCount = this.getRemainingPlayerCount();
        const hp = Math.floor((Math.random() * 0.5 + 1) * 200 / playerCount);
		for (let player of Object.values(this.players)) {
            this.hp.set(player, hp);
        }
        this.nextRound();
	}

	onNextRound() {
		try {
			this.oplayer = null;
			this.rolla = null;
			this.rollb = null;
			if (this.curPlayer) {
				this.say(this.curPlayer.name + " didn't attack anyone and is eliminated!");
				this.curPlayer.eliminated = true;
			}
			this.curPlayer = null;
			if (this.getRemainingPlayerCount() === 1) {
				this.end();
				return;
			} else if (this.getRemainingPlayerCount() === 2) {
                let playersLeft = this.getRemainingPlayers();
                let index = Math.floor(Math.random() * 2);
				this.curPlayer = playersLeft[Object.keys(playersLeft)[index]];
				this.oplayer = playersLeft[Object.keys(playersLeft)[1 - index]];
				this.say("Only **" + this.getName(this.curPlayer) + "(" + this.hp.get(this.curPlayer) + ")** and **" + this.getName(this.oplayer) + "(" + this.hp.get(this.oplayer) + ")** are left!");
				this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
			} else {
                let strs = [];
				for (let userID in this.players) {
					let player = this.players[userID];
					if (player.eliminated) continue;
					strs.push(player.name + "(" + this.hp.get(player) + ")");
				}
				this.say("!pick " + strs.join(", "));
			}
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

    doPlayerAttack() {
		try {

			this.roll1 = this.hp.get(this.curPlayer);
			this.roll2 = this.hp.get(this.oplayer);
			this.sayPlayerRolls();
		} catch (e) {
			this.say("I'm sorry, the game broke. Moo has been notified and will fix it as soon as he can.");
			this.mailbreak();
			this.end();
			return;
		}
	}

    handleRoll(roll) {
        if (!this.rolla) this.rolla = roll;
		else {
            this.rollb = roll;
            if (this.rolla < 1) this.rolla = 1;
            if (this.rollb < 1) this.rollb = 1;
            let curHP = this.hp.set(this.curPlayer);
            let otherHP = this.hp.get(this.oplayer);
            if (this.rolla > curHP) this.rolla = curHP;
            if (this.rollb > otherHP) this.rollb = otherHP;
            if (this.rolla == this.rollb && this.rolla !== 1) {
                if (curHP == otherHP) {
                    this.say("The rolls and hp are both a tie, so both **" + this.curPlayer.name + "** and **" + this.oplayer.name + "** were eliminated!");
                    this.curPlayer.eliminated = true;
                    this.oplayer.eliminated = true;
                } else if (curHP < otherHP) {
                    this.say("The rolls were the same, so **" + this.oplayer.name + "** is eliminated!");
                    this.oplayer.eliminated = true;
                } else {
                    this.say("The rolls were the same, so **" + this.curPlayer.name + "** is eliminated!");
                    this.curPlayer.eliminated = true;
                }
            }
            let doublePlayers = [];
            if (this.rolla === curHP && !this.curPlayer.eliminated) doublePlayers.add(this.curPlayer);
            if (this.rollb === otherHP && !this.oplayer.eliminated) doublePlayers.add(this.oplayer);
            for (const player of doublePlayers) {
                this.hp.set(player, this.hp.get(player) * 2);
            }
            if (doublePlayers.length) {
                this.say("**" + doublePlayers.map(player => player.name).join(", ") + "** doubled their health!");
            }
            if (doublePlayers.indexOf(this.curPlayer) === -1) {
                this.hp.set(this.curPlayer, this.rolla);
            }
            if (doublePlayers.indexOf(this.oplayer) === -1) {
                this.hp.set(this.oplayer, this.rollb);
            }
            let elimPlayers = [];
            if (this.rolla === 1 && !this.curPlayer.eliminated) {
                elimPlayers.add(this.curPlayer);
            }
            if (this.rollb === 1 && !this.oplayer.eliminated) {
                elimPlayers.add(this.oplayer);
            }
            for (const player of elimPlayers) {
                player.eliminated = true;
            }
            if (elimPlayers.length) {
                this.say("**" + elimPlayers.map(player => player.name).join(", ") + "** " + (elimPlayers.length == 2 ? "were" : "was") + " eliminated!");
            }
            this.curPlayer = null;
            this.nextRound();
        }
    }

	handlePick(message) {
		if (!this.curPlayer) {
			this.curPlayer = this.getPlayer(message);
			this.say("**" + this.curPlayer.name + "** you're up! Please choose another player to attack with ``" + Config.commandCharacter + "attack [player]``");
            this.timeout = setTimeout(() => this.sayReminding(), 60 * 1000);
        }
    }
    
    sayReminding() {
        this.say("**" + this.curPlayer.name + "**, you have 30 seconds to choose who to attack!");
        this.timeout = setTimeout(() => this.elimCurPlayer(), 30 * 1000);
    }

    elimCurPlayer() {
        this.say("**" + this.curPlayer.name + "** was eliminated for not attacking!");
        this.curPlayer.eliminated = true;
        this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
    }
    

	attack(target, user) {
		if (!this.curPlayer) return;
		if (this.curPlayer.name !== user.name) return;
		let otherUser = Users.get(target);
		if (!otherUser) return;
		let oplayer = this.players[otherUser.id];
		if (!oplayer || oplayer.eliminated) return;
		if (oplayer.name === this.curPlayer.name) {
			this.say(">Attacking yourself.");
			return;
		}
		this.attackPlayer = false;
		this.say("**" + this.curPlayer.name + "** has chosen to attack **" + oplayer.name + "**!");
		clearTimeout(this.timeout);
		this.oplayer = oplayer;
		this.timeout = setTimeout(() => this.doPlayerAttack(), 5 * 1000);
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Weardown;
exports.aliases = ["wd"];
exports.commands = {
	attack: "attack"
};