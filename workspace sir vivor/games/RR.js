/*'use strict';

const name = "Russian Roulette";
const id = Tools.toId(name);
const description = '__"Pass like a puss or Pull like a pro."__ Game rules: https://sites.google.com/view/survivor-ps/themes/russian_roulette';
class RR extends Games.Game {
    constructor(room) {
        super(room);
        this.name = name;
        this.id = id;
        this.description = description;
        this.chamber = 6;
        this.passed = new Map();
        this.stole = new Map();
        this.moved = new Map();
        this.rollBattle = false;
        this.turner = 0;
    }
    onStart() {
        this.say("**Signups are now closed.** The gun is loaded with a chamber of six, good luck! **Commands:** ``.pull``, ``.pass``, ``.steal [user]``");
        this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
    }
    nextPick() {
        clearTimeout(this.timeout);
        let picks = [];
        for (let userID in this.players) {
            let player = this.players[userID];
            if (player.eliminated || this.moved.has(player)) continue;
            picks.push(player.name);
        }
        if (this.getRemainingPlayerCount() === 2) {
            if (this.finals) {
                let player = this.curPlayer;
                this.curPlayer = this.oplayer;
                this.oplayer = player;
                this.handlePick(this.curPlayer.name);
                return;
            }
            else {
                this.finals = true;
                this.num = Math.floor(Math.random() * 2);
                let lastPlayers = this.shufflePlayers(this.getRemainingPlayers());
                this.say("**" + lastPlayers[0].name + " and " + lastPlayers[1].name + " advance to the finals!** Steals can no longer be used. **The chamber has been reset.**");
                this.chamber = 6;
                this.say("!pick " + lastPlayers[0].name + ", " + lastPlayers[1].name);
                this.stole.set(lastPlayers[0], true);
                this.stole.set(lastPlayers[1], true);
                clearTimeout(this.timeout);
                return;
            }
        }
        if (this.round === 0) {
            this.round++;
            this.say("**Round " + this.round + "!**");
        }
        if (picks.length === 0) return this.nextRound();
        let PL = [];
        for (let userID in this.players) {
            let player = this.players[userID];
            if (player.eliminated) continue;
            let string = player.name;
            if (this.passed.has(player)) {
                string += '[X]';
            }
            PL.push(string);
        }
        if (picks.length === 1) {
            this.handlePick(picks[0]);
            return;
        }
        this.turner++;
        if (this.turner === 3 || this.round === 1) {
            this.say("/wall Players(" + this.getRemainingPlayerCount() + "): " + PL.join(", "));
            this.turner = 0;
        }
        this.say("!pick " + picks.join(", "));
    }

    eliminatePlayer() {
        let player = this.curPlayer;
        player.eliminated = true;
        this.say("**" + player.name + " was eliminated for not providing an action!**");
        if (this.finals) {
            this.say("**" + this.oplayer.name + " is the Survivor! GG**");
            this.end();
            return;
        }
        this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
    }

    handlePick(message) {
        this.curPlayer = this.players[Tools.toId(message)];
        let opponent;
        if (this.finals) {
            for (let userID in this.players) {
                let player = this.players[userID];
                if (player.eliminated || player === this.curPlayer) continue;
                opponent = player;
            }
        }
        this.oplayer = opponent;
        if (this.chamber > 1) {
            if (this.finals) {
                if (this.passed.has(this.curPlayer)) {
                    this.say("Rolling for **" + this.curPlayer.name + "**!");
                    return this.say("!roll " + this.chamber);
                }
                this.say("**" + this.curPlayer.name + "**, you're up! **Chamber:** (" + this.chamber + ") || Please choose whether to pull or pass.");
                this.timeout = setTimeout(() => this.eliminatePlayer(), 60 * 1000);
            }
            else {
                this.say("**" + this.curPlayer.name + "**, you're up! **Chamber:** (" + this.chamber + ") || Please choose whether to pull, pass or steal.");
                this.timeout = setTimeout(() => this.eliminatePlayer(), 60 * 1000);
            }
        }
        else if (this.passed.has(this.curPlayer)) {
            if (this.finals) {
                this.say("**" + this.curPlayer.name + " has used both their pass and the chamber is 1, therefore is eliminated. RIP!**");
                this.curPlayer.eliminated = true;
                return this.end();
            }
            else if (this.stole.has(this.curPlayer)) {
                this.say("**" + this.curPlayer.name + " has used both their pass and their steal, therefore is eliminated. RIP!**");
                this.curPlayer.eliminated = true;
                if (this.finals) {
                    return this.end();
                }
				this.chamber = 6;
                this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
                return;
            }
            else {
                let stealAvailable = false;
                for (let userID in this.players) {
                    let player = this.players[userID];
                    if (this.passed.has(player) || player.eliminated) continue;
                    stealAvailable = true;
                }
                if (stealAvailable) {
                    this.say("**" + this.curPlayer.name + ", you're up! You must attempt to steal a pass from another player.**");
                    this.timeout = setTimeout(() => this.eliminatePlayer(), 60 * 1000);
                    return;
                }
                else {
                    this.say("**There is no one to steal from!**");
                    this.say("!roll " + this.chamber);
                    return;
                }
            }
        }
        else {
            this.say("**" + this.curPlayer.name + " is forced to pass!**");
			this.moved.set(this.curPlayer, true);
            this.passed.set(this.curPlayer, true);
            this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
        }
    }

    handleRoll(roll) {
        if (this.rollBattle) {
            if (!this.rolla) this.rolla = roll;
            else {
                this.rollb = roll;
                if (this.rolla === this.rollb) {
                    this.say("The rolls were the same. Rerolling...");
                    this.timeout = setTimeout(() => this.sayPlayerRolls(), 5 * 1000);
                }
                else {
                    let winPlayer, losePlayer;
                    if (this.rolla > this.rollb) {
                        winPlayer = this.curPlayer;
                        losePlayer = this.oplayer;
                    }
                    else {
                        winPlayer = this.oplayer;
                        losePlayer = this.curPlayer;
                    }
                    this.handleWinner(winPlayer, losePlayer);
                }
            }
        }
        else {
            if (roll === this.chamber) {
                this.curPlayer.eliminated = true;
                this.say("**BOOOM! " + this.curPlayer.name + " was shot. RIP!**");
                if (this.finals) {
                    this.say("**" + this.oplayer.name + " is the Survivor! GG**");
                    clearTimeout(this.timeout);
                    this.end();
                    return;
                }
                this.chamber = 6;
                this.say("**The chamber has been reset!**");
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
                return;
            }
            else {
                if (this.finals) {
                    this.say("**" + this.curPlayer.name + " lives!**");
                }
                else {
                    this.say("**" + this.curPlayer.name + " lives and is safe until the next round!**");
                }
                this.chamber--;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
            }
        }
    }

    handleWinner(winPlayer, losePlayer) {
        this.rollBattle = false;
        if (winPlayer === this.curPlayer) {
            this.oplayer.eliminated = true;
            this.say("**RIP " + this.oplayer.name + "!** Their pass is used by " + this.curPlayer.name + " who is safe until the next round!");
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
        }
        else {
            this.curPlayer.eliminated = true;
            this.say("**" + this.curPlayer.name + " fails to steal from " + this.oplayer.name + ". RIP!**");
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
        }
    }

    onNextRound() {
        this.moved.clear();
        this.say("**Round " + this.round + "!**");
        clearTimeout(this.timeout);
        this.nextPick();
    }

    pull(target, user) {
        let player = this.players[user.id];
        if (player !== this.curPlayer) return;
        if (this.chamber === 1) return;
        if (this.moved.has(player) && !this.finals) return;
        this.moved.set(player, true);
        clearTimeout(this.timeout);
        this.say("!roll " + this.chamber);
    }

    pass(target, user) {
        let player = this.players[user.id];
        if (player !== this.curPlayer) return;
        if (this.passed.has(player)) return;
        if (this.moved.has(player) && !this.finals) return;
        this.moved.set(player, true);
        this.passed.set(player, true);
        clearTimeout(this.timeout);
        this.say("**" + this.curPlayer.name + " has chosen to pass and is safe until the next round!**");
        this.timeout = setTimeout(() => this.nextPick(), 5 * 1000);
    }

    steal(target, user) {
        let player = this.players[user.id];
        if (player !== this.curPlayer) return;
        if (this.moved.has(player)) return;
        if (!this.passed.has(player)) return;
        let opponent = this.players[Tools.toId(target)];
		if (Tools.toId(target) === "constructor") return user.say("You cannot steal from 'constructor'");
        if (!opponent || opponent.eliminated || this.passed.has(opponent)) return;
        this.oplayer = opponent;
        this.say("**" + this.curPlayer.name + " attempts to steal from " + this.oplayer.name + "!**");
        this.moved.set(player, true);
        this.stole.set(player, true);
        this.roll1 = 100;
        this.roll2 = 100;
        this.rollBattle = true;
        clearTimeout(this.timeout);
        this.sayPlayerRolls();
    }
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = RR;
exports.aliases = ['rr'];
exports.commands = {
    pull: "pull",
    pass: "pass",
    steal: "steal"
};
*/
