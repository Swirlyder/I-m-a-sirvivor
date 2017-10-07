'use strict';

const ssbchars = {
	ceterisparibus: {
		name: "Ceteris Paribus",
		desc: "Once per round, Ceteris can trap someone in the PARTYBUS, blocking that person from attacking. If that person dies, do .roll 100, and if the roll is above 50, Ceteris gets +20 attack, whilst if it's under 50, Ceteris gets +20 Defense.​",
		special: {
			atkroll: 100,
			defroll: 100,
			hasActioned: false,
			targAuth: null,
			myAction: Config.commandcharacter + "action  [auth-name]",
			onAction: function (target, player, game) {
				if (ssbchars.ceterisparibus.special.hasActioned) return player.say("You have already used your action!");
				let targAuth = Tools.toId(target);
				if (!(targAuth in ssbchars)) return player.say("Invalid auth name.");
				if (!ssbchars[targAuth].owner) return player.say("That auth name is not in use in this game!");
				if (ssbchars[targAuth].owner.eliminated) return player.say("That auth has already been eliminated!");
				if (targAuth === "ceterisparibus") return player.say("You can't trap yourself in the partybus -.-");
				ssbchars.ceterisparibus.special.hasActioned = true;
				ssbchars.ceterisparibus.special.targAuth = targAuth;
				player.say("You have trapped **" + ssbchars[targAuth].name + "** in the PARTYBUS!");
			},
			onEndRound: function() {
				ssbchars.ceterisparibus.special.hasActioned = false;
				ssbchars.ceterisparibus.special.targAuth = null;
			},
			onEndGame: function() {
				ssbchars.ceterisparibus.special.hasActioned = false;
				ssbchars.ceterisparibus.special.targAuth = null;
				ssbchars.ceterisparibus.special.atkroll = 100;
				ssbchars.ceterisparibus.special.defroll = 100;
			},
		},
	},
	sirvivor: {
		name: "Sir Vivor",
		desc: "Can either mute another player [take away their attack] or host another player [+15 to max roll] before each round of attacks.",
		special: {
			targAction: "",
			targAuth: null,
			hasActioned: false,
			myAction: Config.commandcharacter + "action  mute/host, [auth-name]",
			onAction: function (target, player, game) {
				if (ssbchars.sirvivor.special.hasActioned) return player.say("You have already used your action for the round!");
				let split = target.split(",");
				if (split.length !== 2) return player.say("Usage: ``" + Config.commandCharacter + "action mute/host, [auth]``");
				let targAction = Tools.toId(split[0]);
				if (["host", "mute"].indexOf(targAction) === -1) return player.say("Usage: ``" + Config.commandCharacter + "action mute/host, [auth-name]``");
				let targAuth = Tools.toId(split[1]);
				if (!(targAuth in ssbchars)) return player.say("Invalid auth name.");
				if (!ssbchars[targAuth].owner) return player.say("That auth name is not in use in this game!");
				if (ssbchars[targAuth].owner.eliminated) return player.say("That auth has already been eliminated!");
				if (targAuth === 'sirvivor') return player.say("You can't use your action on yourself -.-");
				ssbchars.sirvivor.special.targAction = targAction;
				ssbchars.sirvivor.special.targAuth = targAuth;
				ssbchars.sirvivor.special.hasActioned = true;
				if (targAction === "host") {
					let atkroll = ssbchars[targAuth].special.atkroll;
					if (!atkroll) atkroll = 100;
					ssbchars[targAuth].special.atkroll = atkroll + 15;
				}
				player.say("You have **" + (targAction == "host" ? "hosted" : "muted") + " " + ssbchars[targAuth].name + "**!");
			},
			onEndRound: function () {
				if (ssbchars.sirvivor.special.targAuth && ssbchars.sirvivor.special.targAction === "host") {
					ssbchars[ssbchars.sirvivor.special.targAuth].special.atkroll -= 15;
				}
				ssbchars.sirvivor.special.targAction = "";
				ssbchars.sirvivor.special.hasActioned = false;
				ssbchars.sirvivor.special.targAuth = null;
			},
			onEndGame: function() {
				ssbchars.sirvivor.special.targAction = "";
				ssbchars.sirvivor.special.hasActioned = false;
				ssbchars.sirvivor.special.targAuth = null;
			},
		}
	},
	soccer: {
		name: "Soccer",
		desc: "when attacking, .pick goal, miss. goal= attacking roll of 150, miss= no attack.",
		special: {
			isSoccer: true,
		},
	},
	aknolan: {
		name: "Aknolan",
		desc: "Can go to sleep and dodge all attacks, misses their attack turn. (Cooldown: 2 Rounds)",
		special: {
			numSinceLast: 0,
			isImmune: false,
			cantAttack: false,
			myAction: Config.commandcharacter + "action",
			onAction: function(target, player, game) {
				if (ssbchars.aknolan.special.numSinceLast !== 0) {
					if (ssbchars.aknolan.special.numSinceLast === 3) {
						return player.say("You have already used your action this round!");
					} else {
						return player.say("You must wait **" + ssbchars.aknolan.special.numSinceLast + "** turn's before using your action again!");
					}
				}
				ssbchars.aknolan.special.numSinceLast = 3;
				ssbchars.aknolan.special.isImmune = true;
				ssbchars.aknolan.special.cantAttack = true;
				if (!game.attacks.has(ssbchars.aknolan.owner)) {
					game.numAttacks++;
				}
				return player.say("You have gone to sleep for the round!");
			},
			onEndRound: function() {
				if (ssbchars.aknolan.special.numSinceLast > 0) {
					ssbchars.aknolan.special.numSinceLast--;
				}
				ssbchars.aknolan.special.cantAttack = false;
				ssbchars.aknolan.special.isImmune = false;
			},
			onEndGame: function() {
				ssbchars.aknolan.special.numSinceLast = 0;
				ssbchars.aknolan.special.isImmune = false;
				ssbchars.aknolan.special.cantAttack = false;
			},
		},
	},
	hawkie: {
		name: "Hawkie",
		desc: "If Hawkie and another user decide to attack each other in a round, Hawkie rolls 130 when attacking and defending.",
		special: {
			atkroll: 100,
			defroll: 100,
			onEndRound: function() {
				ssbchars.hawkie.special.atkroll = 100;
				ssbchars.hawkie.special.atkroll = 100;
			},
			onEndGame: function() {
				ssbchars.hawkie.special.atkroll = 100;
				ssbchars.hawkie.special.atkroll = 100;
			},
		},
	},
	lunar: {
		name: "Lunar",
		desc: "Do .pick Sun, Moon before each round of attacks. Sun= a defense roll of 130 but no attack. Moon= attack roll of 130 and a defense roll of 80.",
		special: {
			atkroll: 100,
			defroll: 100,
			onEndRound: function() {
				ssbchars.lunar.special.atkroll = 100;
				ssbchars.lunar.special.defroll = 100;
			},
			onEndGame: function() {
				ssbchars.lunar.special.atkroll = 100;
				ssbchars.lunar.special.defroll = 100;
			},
		},
	},
	ryyjyywyy: {
		name: "ryyjyywyy",
		desc: "decides between a boost of 20 between defense and attack each turn.",
		special: {
			atkroll: 100,
			defroll: 100,
			hasActioned: false,
			myAction: Config.commandcharacter + "action attack/defense",
			onAction: function(target, player, game) {
				if (ssbchars.ryyjyywyy.special.hasActioned) {
					return player.say("You have already used your action for this round!");
				}
				target = Tools.toId(target);
				if (target === "attack") {
					ssbchars.ryyjyywyy.special.hasActioned = true;
					ssbchars.ryyjyywyy.special.atkroll += 20;
					player.say("You have boosted your **Attack** for this round!");
				} else if (target === "defense") {
					ssbchars.ryyjyywyy.special.hasActioned = true;
					ssbchars.ryyjyywyy.special.defroll += 20;
					player.say("You have boosted your **Defense** for this round!");
				} else {
					player.say("You must specify either your **Attack** or **Defense** to boost.");
				}
			},
			onEndRound: function() {
				ssbchars.ryyjyywyy.special.hasActioned = false;
				ssbchars.ryyjyywyy.special.atkroll = 100;
				ssbchars.ryyjyywyy.special.defroll = 100;
			},
			onEndGame: function() {
				ssbchars.ryyjyywyy.special.hasActioned = false;
				ssbchars.ryyjyywyy.special.atkroll = 100;
				ssbchars.ryyjyywyy.special.defroll = 100;
			},
		},
	},
	hurl: {
		name: "Hurl",
		desc: "If hurl rolls either a 21 or 69, they have a 1 round immunity to attacks. [Immunity applies to the round after]",
		special: {
			immuneTurns: 0,
			onOwnRoll: function (roll) {
				if (roll === 21 || roll === 69) {
					ssbchars.hurl.special.immuneTurns = 2;
				}
				return roll;
			},
			onEndRound: function() {
				ssbchars.hurl.special.immuneTurns--;
				if (ssbchars.hurl.special.immuneTurns === 1) {
					ssbchars.hurl.special.isImmune = true;
				} else if (ssbchars.hurl.special.immuneTurns === 0) {
					ssbchars.hurl.special.isImmune = false;
				}
			},
			onEndGame: function() {
				ssbchars.hurl.special.immuneTurns = 0;
			},
		}
	},
	zyx14: {
		name: "Zyx14",
		desc: ".roll 300 then subtract .roll 200 from that roll to get the final roll for Zyx14",
		special: {
			atkroll: 300,
			defroll: 300,
		},
	},
	baloor: {
		name: "Baloor",
		desc: "Hits his oppenent with the Righteous Kill, Does !roll 3 to determine what will be rolled (1=100, 2=115, 3=130)",
		special: {
			isBaloor: true,
		},
	},
	gallantspear: {
		name: "Gallant's pear",
		desc: "User announces left or right, roll 2d100, roll is taken according to choice (Left roll if Left, Right roll if Right.)",
		special: {
			isGallant: true,
		},
	},
	plasmaan: {
		name: "Plasmaan",
		desc: "rerolls a 75 roll upon loss, 50 upon 2nd loss and then loses.",
		special: {
			isPlasmaan: true,
		},
	},
	azuuli: {
		desc: "Summons the power of Anime and can get a 135 roll for one round",
		name: "Azu~uli",
		special: {
			atkroll: 100,
			defroll: 100,
			hasActioned: false,
			myAction: Config.commandcharacter + "action",
			onAction: function (target, player, game) {
				if (ssbchars.azuuli.special.hasActioned) return player.say("You have already used your action!");
				ssbchars.azuuli.special.atkroll = 135;
				ssbchars.azuuli.special.defroll = 135;
				player.say("You have summoned the power of ANIME");
				ssbchars.azuuli.special.hasActioned = true;
			},
			onEndRound: function () {
				ssbchars.azuuli.special.atkroll = 100;
				ssbchars.azuuli.special.defroll = 100;
			},
			onEndGame: function() {
				ssbchars.azuuli.special.atkroll = 100;
				ssbchars.azuuli.special.defroll = 100;
				ssbchars.azuuli.special.hasActioned =false;
			},
		},
	},
	mmm: {
		desc: "If attacked more than once during a round, immune to rest of the attacks for that round. 2 Round Cooldown",
		name: "MMM",
		special: {
			numAttacks: 0,
			isImmune: false,
			onAttack: function () {
				ssbchars.mmm.special.numAttacks++;
				if (ssbchars.mmm.special.numAttacks > 2) {
					ssbchars.numAttacks.special.isImmune = true;
				}
			},
			onEndRound: function() {
				ssbchars.mmm.special.numAttacks = 0;
				ssbchars.mmm.special.isImmune = false;
			},
			onEndGame: function() {
				ssbchars.mmm.special.numAttacks = 0;
				ssbchars.mmm.special.isImmune = false;
			},
		},
	},
	ruby: {
		desc: "has a 108 dice for attacking and defending in the beginning of the game. (your roll - opponent's roll) is added to the dice per each kill. Caps at 180.",
		name: "ruby",
		special: {
			atkroll: 108,
			defroll: 108,
			onWin: function (roll1, roll2, loser) {
				let diff = Math.abs(roll1 - roll2);
				ssbchars.ruby.special.atkroll += diff;
				ssbchars.ruby.special.defroll += diff;
			},
			onEndGame: function () {
				ssbchars.ruby.special.atkroll = 108;
				ssbchars.ruby.special.defroll = 108;
			},
		},
	},
	emmafemcario: {
		desc: "Emma(Femcario): Can check the role of anyone on the PL before each turn",
		name: "Emma(Femcario)",
		special: {
			action: null,
			myAction: Config.commandcharacter + "action [username]",
			onAction: function (target, player, game) {
				let targPlayer = game.players[Tools.toId(target)];
				if (!targPlayer) return player.say("That player is not in the game!");
				if (ssbchars.emmafemcario.special.action) return player.say("You have already checked somebody's role!");
				ssbchars.emmafemcario.special.action = targPlayer;
				player.say("**" + targPlayer.name + "**'s role is **" + game.auth.get(targPlayer).name + "**!");
			},
			onEndRound: function() {
				ssbchars.emmafemcario.special.action = null;
			},
			onEndGame: function() {
				ssbchars.emmafemcario.special.action = null;
			}
		},
	},
	todredrob: {
		desc: "Steals the role of the user they're attacking or being attacked by and causes the attacker/defender to have a normal roll of 100",
		name: "Todredrob",
		special: {
			nullopp: true,
			stealopp: true,
		},
	},
	victoriqueflake: {
		desc: "!roll 3d35 for each one of victorique's rolls​",
		name: "VictoriqueFlake",
		special: {
			atkroll: "3d35",
			defroll: "3d35",
		},
	},
	bondance: {
		desc: "Can use Quiver Dance to raise his attacking and defending rolls by 10 every time he uses it! 1 turn cooldown, resets at 5 turns. Misses attacking turn when using QD.",
		name: "Bon Dance",
		special: {
			atkroll: 100,
			defroll: 100,
			actionTurns: 0,
			myAction: Config.commandcharacter + "action",
			onAction: function (target, player, room) {
				if (ssbchars.bondance.special.actionTurns !== 0) return player.say("You have already used your action!");
				ssbchars.bondance.special.actionTurns = 2;
				ssbchars.bondance.atkroll += 10;
				ssbchars.bondance.defroll += 10;
			},
			onEndRound: function() {
				if (ssbchars.bondance.special.actionTurns > 0) {
					ssbchars.bondance.special.actionTurns--;
				}
			},
			onEndGame: function() {
				ssbchars.bondance.special.actionTurns = 0;
			}
		},
	},
	cheese: {
		desc: "Cheese has Thick Fat, and if Cheese's opponent rolls above 85, their roll is halved (Applies to rolls when Cheese is defending)",
		name: "Cheese",
		special: {
			onModifyOpponentsRoll: function (roll, game, isAttacking) {
				if (roll > 85 && !isAttacking) {
					game.say("Since __Cheese__'s opponent rolled above 85, their roll is halved!");
					roll *= 0.5;
				}
				return roll;
			},
		},
	},
	henka: {
		desc: "Must attack and has no AI, but rolls 130 in every roll.",
		name: "Henka",
		special: {
			atkroll: 130,
			defroll: 130,
			noAI: true,
		},
	},
	penquin: {
		desc: ".roll 2d 75 for attacking rolls; .roll 2d 45 for defensive rolls, The sum of either is used as the final roll. Re-rolls if rolls under 30.",
		name: "PenQuin",
		special: {
			atkroll: "2d75",
			defroll: "2d45",
		},
	},
	zeonth: {
		desc: "Once per game, becomes immune to attacks and does not attack during a round. Every user attacking Zeonth during immunity boosts Zeonth's attacking roll by 15 for the rest of the game (defense remains the same)",
		name: "Zeonth",
		special: {
			atkroll: 100,
			hasActioned: false,
			isImmune: false,
			myAction: Config.commandcharacter + "action",
			onAction: function(target, player, game) {
				if (ssbchars.zeonth.special.hasActioned) return player.say("You have already used your action!");
				ssbchars.zeonth.special.hasActioned = true;
				ssbchars.zeonth.special.isImmune = true;
			},
			onEndRound: function() {
				ssbchars.zeonth.special.isImmune = false;
			},
			onEndGame: function() {
				ssbchars.zeonth.special.hasActioned = false;
				ssbchars.zeonth.special.isImmune = false;
				ssbchars.zeonth.special.atkroll = 100;
			},
			onAttack: function () {
				if (ssbchars.zeonth.special.isImmune) {
					ssbchars.zeonth.special.atkroll += 15;
				}
			},
		},
	},
	aphantom: {
		desc: "is already dead inside, so rolls 65+35 at all times",
		name: "A Phantom",
		special: {
			atkroll: "65+35",
			defroll: "65+35",
		}
	},
	stratospheres: {
		desc: "When he rolls under 50, he gains +25 to his maximum roll. Resets every round",
		name: "Stratospheres",
		special: {
			atkroll: 100,
			defroll: 100,
			onOwnRoll: function (roll, game, isAttacking) {
				if (roll < 50) {
					ssbchars.stratospheres.special.atkroll += 25;
					ssbchars.stratospheres.special.defroll += 25;
				}
				return roll;
			},
			onEndRound: function() {
				ssbchars.stratospheres.special.atkroll = 100;
				ssbchars.stratospheres.special.defroll = 100;
			},
			onEndGame: function() {
				ssbchars.stratospheres.special.atkroll = 100;
				ssbchars.stratospheres.special.defroll = 100;
			},
		},
	},
	deetah: {
		desc: "Has a roll of 110, and survives the first attack that would kill her.",
		name: "deetah",
		special: {
			lives: 2,
			atkroll: 110,
			defroll: 110,
		}
	},
	elbowskinn: {
		desc: "Has a +10 roll boost for both attack and defense rolls.",
		name: "Elbowskinn",
		special: {
			atkroll: 110,
			defroll: 110,
		},
	},
	inactive: {
		desc: "Any roll battle involving Inactive is done under the Golf Ruleset",
		name: "inactive",
		special: {
			isGolf: true,
		},
	},
	jh3828teal: {
		desc: "gains +5 to his roll for every player that dies. Once per game, the player can become immune to attacks for one round. [Can choose whether or not to attack during immunity]",
		name: "jh3828 (teal)",
		special: {
			atkroll: 100,
			defroll: 100,
			hasActioned: false,
			isImmune: false,
			onDeath: function (player) {
				ssbchars.jh3828teal.special.atkroll += 5;
				ssbchars.jh3828teal.special.defroll += 5;
			},
			myAction: Config.commandcharacter + "action",
			onAction: function (target, player, game) {
				if (ssbchars.jh3828teal.special.hasActioned) return player.say("You have already used your action!");
				ssbchars.jh3828teal.special.hasActioned = true;
				ssbchars.jh3828teal.special.isImmune = true;
				player.say("You are immune to attacks for this round!");
			},
			onEndRound: function() {
				ssbchars.jh3828teal.special.isImmune = false;
			},
			onEndGame: function() {
				ssbchars.jh3828teal.special.isImmune = false;
			},
		},
	},
	shadecession: {
		desc: "All roll battles are done 100 vs 100, no AI. All other roles don't have their modifiers applied.",
		name: "Shadecession",
		special: {
			nullopp: true,
			noAI: true,
			noOppAI: true,
		},
	},
};

const name = "Super Survivor Bros";
const description = "__Destroy your hated roomauth with your favourite roomauth!__ Game rules: http://survivor-ps.weebly.com/super-survivor-bros.html";
const id = Tools.toId(name);

class SSB extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.auth = new Map();
		this.order = [];
		this.attacks = new Map();
		this.skipAttacks = new Map();
		this.canAttack = false;
		this.canAuth = false;
		this.expectingLeft = false;
		this.expectingPak = false;
		this.numAttacks = 0;
		this.numAuth = 0;
	}

	onSignups() {
		this.say("This currently does not have __SnapEasy__, __Swirlyder__, or __Spaceworm__ in it");
	}

	onStart() {
		for (let i in ssbchars) {
			let auth = ssbchars[i];
			auth.owner = null;
			if (auth.special.onEndGame) {
				auth.special.onEndGame();
			}
		}
		this.canAuth = true;
		this.say("**Players (" + this.getRemainingPlayerCount() + ")**: " + this.getPlayerNames(this.getRemainingPlayers()) + ". Select your auth with ``" + Config.commandCharacter + "select [auth]``! If you would like to see the list of auth, pm me ``" + Config.commandCharacter + "auths``");
		this.timeout = setTimeout(() => this.listAuthWaiting(), 60 * 1000);
	}

	listAuthWaiting() {
		this.say("Waiting for auth on: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.auth.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimAuth(), 30 * 1000);
	}

	elimAuth() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.eliminated && !this.auth.has(player)) {
				player.eliminated = true;
				player.say("You didn't select an auth and are eliminated!");
			}
		}
		this.nextRound();
	}

	onNextRound() {
		this.canAuth = false;
		this.order = [];
		this.canAttack = true;
		this.numAttacks = 0;
		this.attacks.clear();
		this.skipAttacks.clear();
		if (this.getRemainingPlayerCount() > 1) {
			this.say("Auth list: __" + Object.values(this.players).filter(pl => !pl.eliminated).map(pl => this.auth.get(pl).name).join("__, __") + "__");
			this.say("Players: **" + Tools.shuffle(Object.values(this.players).filter(pl => !pl.eliminated).map(pl => pl.name)).join(", ") + "**");
			this.say("PM me your attacks now with ``" + Config.commandCharacter + "destroy [auth-name]``! You can also pm me ``" + Config.commandCharacter + "myaction`` to see how to use your characters action!");
			this.timeout = setTimeout(() => this.listAttacksWaiting(), 60 * 1000);
		} else {
			this.finals = true;
			let lastPlayers = Tools.shuffle(Object.values(this.getRemainingPlayers()));
			this.curPlayer = lastPlayers[0];
			this.oplayer = lastPlayers[1];
			this.say("**" + this.curPlayer.name + "** (aka __" + this.auth.get(this.curPlayer).name + "__) is attacking **" + this.oplayer.name + "** (aka __" + this.auth.get(this.oplayer).name + "__)");
			this.timeout = setTimeout(() => this.doRolls(100, 100), 5 * 1000);
		}
	}

	listAttacksWaiting() {
		this.say("Waiting for attacks from: " + Object.values(this.players).filter(pl => !pl.eliminated && !this.attacks.has(pl)).map(pl => pl.name).join(", "));
		this.timeout = setTimeout(() => this.elimAttacksPlayers(), 30 * 1000);
	}

	elimAttacksPlayers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			let auth = this.auth.get(player);
			if (!player.eliminated && !this.attacks.has(player) && !auth.special.cantAttack) {
				player.eliminated = true;
				player.say("You didn't select an auth and are eliminated!");
			}
		}
		this.beforeAttacks();
	}

	beforeNextRound() {
		for (let userID in this.players) {
			let auth = this.auth.get(this.players[userID]);
			if (typeof auth.special.onEndRound === 'function') {
				auth.special.onEndRound();
			}
		}
		if (ssbchars.ceterisparibus.owner && !ssbchars.ceterisparibus.owner.eliminated && ssbchars.ceterisparibus.special.targAuth && ssbchars[ssbchars.ceterisparibus.special.targAuth].owner.eliminated) {
			this.say("Since __Ceteris Paribus__'s opponent died during this round, I will roll 100 to determine their boost!");
			this.expectingPak = true;
			this.say("!roll 100");
		} else {
			this.nextRound();
		}
	}

	beforeAttacks() {
		if (ssbchars.hawkie.owner && !ssbchars.hawkie.owner.eliminated) {
			let attackee = this.attacks.get(ssbchars.hawkie.owner);
			if (this.attacks.get(attackee) === ssbchars.hawkie.owner) {
				ssbchars.hawkie.special.atkroll = 130;
				ssbchars.hawkie.special.defroll = 130;
			}
		}
		if (ssbchars.lunar.owner && !ssbchars.lunar.owner.eliminated) {
			this.say("Picking for __Lunar__ for the round!");
			this.say("!pick Sun, Moon");
		} else {
			this.handleAttacks();
		}
	}

	handleAttacks() {
		this.canAttack = false;
		if (this.order.length === 0) {
			return this.beforeNextRound();
		}
		this.curPlayer = this.order.shift();
		this.oplayer = this.attacks.get(this.curPlayer);
		if (this.curPlayer.eliminated || this.oplayer.eliminated) {
			return this.handleAttacks();
		}
		this.say("__" + this.auth.get(this.curPlayer).name + "__ is attacking __" + this.auth.get(this.oplayer).name + "__!");
		this.handleAttack(this.auth.get(this.curPlayer), this.auth.get(this.oplayer));
	}

	handleAttack(auth1, auth2) {
		this.rolla = null;
		this.rollb = null;
		this.auth1 = auth1;
		this.auth2 = auth2;
		if (ssbchars.sirvivor.special.targAuth === Tools.toId(this.auth1.name) && ssbchars.sirvivor.special.targAction === "mute") {
			this.say("But __" + this.auth1.name + "__ was muted by Sir Vivor, and cannot attack!");
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			return;
		}
		if (ssbchars.ceterisparibus.special.targAuth === Tools.toId(this.auth1.name)) {
			this.say("But __" + this.auth1.name + "__ was put in the PARTYBUS by __Ceteris Paribus__!");
			this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
			return;
		}
        let auth1null = this.auth1.special.nullopp, auth2null = this.auth2.special.nullopp;
		if (this.auth2.special.stealopp) {
			this.auth2.realspecial = JSON.parse(JSON.stringify(this.auth2.special));
			this.auth2.special = this.auth1.special;
		}
		if (this.auth1.special.stealopp) {
			this.auth1.realspecial = JSON.parse(JSON.stringify(this.auth2.special));
			this.auth1.special = this.auth2.special;
		}
		if (auth1null) {
			this.auth2.realspecial = JSON.parse(JSON.stringify(this.auth2.special));
			this.auth2.special = {};
		}
		if (auth2null) {
			this.auth1.realspecial = JSON.parse(JSON.stringify(this.auth1.special));
			this.auth1.special = {};
		}
		if (this.auth2.special.onAttack) {
			this.auth2.special.onAttack();
		}
		if (this.auth2.special.isImmune) {
			this.say("__" + this.auth2.name + "__ is immune to attacks!");
			this.afterAttack();
			return;
		}
		if (this.auth1.name === "Lunar" && this.auth1.special.defroll === 130) {
			this.say("But __Lunar__ cannot attack this round!");
			this.afterAttack();
			return;
		}
		if (this.auth1.special.atkroll) {
			this.roll1 = this.auth1.special.atkroll;
		} else {
			this.roll1 = 100;
		}
		if (this.auth2.special.defroll) {
			this.roll2 = this.auth2.special.defroll;
		} else {
			this.roll2 = 100;
		}
		if (this.auth1.special.isSoccer) {
			this.say("!pick goal, miss");
		} else if (this.auth1.special.isGallant) {
			this.say("__" + this.auth1.name + "__, choose left or right with ``" + Config.commandCharacter + "choose left/right``, in pms.");
			this.authplayer = this.auth1.owner;
			this.expectingLeft = true;
			this.timeout = setTimeout(() => this.remindGallant(), 60 * 1000);
		} else if (this.auth1.special.isZyx) {
			this.doRoll(300);
		} else if (this.auth1.special.isBaloor) {
			this.doRoll(3);
		} else {
			this.doRolls(this.roll1, this.roll2);
		}
	}

	remindGallant() {
		this.say("__" + this.auth1.name + "__, you're up!");
		this.timeout = setTimeout(() => this.elimGallant(), 60 * 1000);
	}

	elimGallant() {
		this.authplayer.eliminated = true;
        this.expectingLeft = false;
		this.say("__Gallant's Spear__ (aka**" + this.authplayer.name + "** didn't select left or right, and is eliminated!");
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	doRolls(roll1, roll2) {
		this.roll1 = roll1;
		this.roll2 = roll2;
		this.rolla = null;
		this.rollb = null;
		this.doRoll(roll1);
	}

	doRoll(roll) {
		this.rollVal = roll;
		this.say("!roll " + roll);
	}

	handleRoll(roll) {
		if (this.expectingPak) {
			this.expectingPak = false;
			if (roll > 50) {
				this.say("__Ceteris Paribus__ gains 20 to their attack!");
				ssbchars.ceterisparibus.special.atkroll += 20;
			} else {
				this.say("__Ceteris Paribus__ gains 20 to their defense!");
				ssbchars.ceterisparibus.special.defroll += 20;
			}
			this.nextRound();
		} else if (!this.rolla) {
			if (this.rollVal === 3) {
				this.doRolls(100 + (roll - 1) * 15, this.roll2);
			} else if (this.rollVal === 300) {
				this.firstRoll = roll;
				this.doRoll(200);
			} else if (this.rollVal === 200) {
				let num = this.firstRoll - roll;
				this.say("__Zyx14__'s roll for the round is **" + num + "**!");
				this.rolla = num;
				this.doRoll(this.roll2);
			} else {
				this.rolla = roll;
				this.doRoll(this.roll2);
			}
		} else {
			if (this.finals) {
				this.rollb = roll;
				let winPlayer, losePlayer;
				if (this.rolla === this.rollb) {
					this.say("The rolls were the same, rerolling...");
					this.timeout = setTimeout(() => this.doRolls(100, 100), 5 * 1000);
					return;
				} else if (this.rolla > this.rollb) {
					winPlayer = this.curPlayer;
					losePlayer = this.oplayer;
				} else {
					winPlayer = this.oplayer;
					losePlayer = this.curPlayer;
				}
				this.say("**" + winPlayer.name + "** destroys **" + losePlayer.name + "**!");
				losePlayer.eliminated = true;
				this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
				return;
			}
			if (this.rollVal === 300) {
				this.firstRoll = roll;
				this.doRoll(200);
				return;
			} else if (this.rollVal === 200) {
				this.rollb = this.firstRoll - roll;
				this.say("__Zyx14__'s roll for the round is **" + this.rollb + "**!");
			} else {
				this.rollb = roll;
			}
			if (this.auth1.special.onOwnRoll) {
				this.rolla = this.auth1.special.onOwnRoll(this.rolla, this, true);
			}
			if (this.auth2.special.onOwnRoll) {
				this.rollb = this.auth2.special.onOwnRoll(this.rollb, this, false);
			}
			if (this.auth1.special.onModifyOpponentsRoll) {
				this.rollb = this.auth1.special.onModifyOpponentsRoll(this.rollb, this, true);
			}
			if (this.auth2.special.onModifyOpponentsRoll) {
				this.rolla = this.auth2.special.onModifyOpponentsRoll(this.rolla, this, false);
			}
			let isGolf = this.auth1.special.isGolf || this.auth2.special.isGolf;
			if (this.rolla === this.rollb) {
				this.say("The rolls were the same! Rerolling...");
				this.timeout = setTimeout(() => this.handleAttack(this.auth.get(this.curPlayer), this.auth.get(this.oplayer)), 5 * 1000);
				return; 
			} else if ((this.rolla > this.rollb) === (!isGolf)) {
				this.say("__" + this.auth.get(this.curPlayer).name + "__ destroys __" + this.auth.get(this.oplayer).name + "__!");
				if (this.auth1.special.onWin) {
					this.auth1.special.onWin(this.rolla, this.rollb);
				}
				if (this.auth2.special.isPlasmaan) {
					if (this.rollVal === 100) {
						this.say("Since __Plasmaan__ lost, they will redo the attack, with 75 defense!");
						ssbchars.plasmaan.special.defroll = 75;
						this.timeout = setTimeout(() => this.handleAttack(this.auth1, this.auth2), 5 * 1000);
						return;
					} else if (this.rollVal == 75) {
						this.say("Since __Plasmaan__ lost again, they will redo the attack with 50 defense!");
						ssbchars.plasmaan.special.defroll = 50;
						this.timeout = setTimeout(() => this.handleAttack(this.auth1, this.auth2), 5 * 1000);
						return;
					} else {
						this.say("Since __Plasmaan__ lost 3 times, they are eliminated");
						this.elimPlayer(this.oplayer);
					}
				} else {
					this.elimPlayer(this.oplayer);
				}
			} else {
				if (this.auth1.special.noAI || this.auth2.special.noOppAI) {
					this.say("__" + this.auth.get(this.oplayer).name + "__ destroys __" + this.auth.get(this.curPlayer).name + "__!");
					this.elimPlayer(this.curPlayer);
					if (this.curPlayer.eliminated && ssbchars.jh3828teal.owner) {
						ssbchars.jh3828teal.defroll += 5;
						ssbchars.jh3828teal.atkroll += 5;
					}
					if (this.auth2.special.onWin) {
						this.auth2.special.onWin(this.rollb, this.rolla);
					}
				} else {
					this.say("__" + this.auth.get(this.oplayer).name + "__ defends successfully!");
					if (this.auth2.special.isPlasmaan) {
						this.auth2.special.defroll = 100;
					}
				}
			}
			this.afterAttack();
		}
	}

	handleRolls(rolls) {
		if (this.action === "left") {
			this.handleRoll(rolls[0]);
		} else if (this.action === "right") {
			 this.handleRoll(rolls[1]);
		}
	}

	handlePick(message) {
		message = Tools.toId(message);
		if (message === "sun") {
			this.say("__Lunar__'s attack for the round is **130**, and defense is **80**!");
			ssbchars.lunar.special.atkroll = 130;
			ssbchars.lunar.special.defroll = 100;
			this.timeout = setTimeout(() => this.handleAttacks(), 10 * 100);
		} else if (message === "moon") {
			this.say("__Lunar__'s defense for the round is **130**, but no attack!");
			ssbchars.lunar.special.defroll = 130;
			this.timeout = setTimeout(() => this.handleAttacks(), 10 * 100);
		} else if (message === "goal") {
			this.say("GOAAAAAAL!");
			this.auth1.special.atkroll = 150;
			this.timeout = setTimeout(() => this.doRoll(150), 10 * 1000);
		} else if (message === "miss") {
			this.say("Misssss");
			this.timeout = setTimeout(() => this.afterAttack(), 10 * 1000);
		}
	}

    say(message) {
        if (message.startsWith("!")) {
            return super.say(message)
        } else {
            super.say("/wall " + message);
        }
    }

	elimPlayer(player) {
		let auth = this.auth.get(player);
		if (auth.special.lives && auth.special.lives > 1) {
			auth.special.lives--;
		} else {
			player.eliminated = true;
			this.say("__" + this.auth.get(player).name + "__ was actually **" + player.name + "**!");
		}
	}

	afterAttack() {
		if (this.auth1.special.isSoccer) {
			this.auth1.special.atkroll = 100;
		}
		for (let userID in this.players) {
            let player = this.players[userID];
            if (!player.eliminated) {
                let auth = this.auth.get(this.players[userID]);
                if (auth && auth.realspecial) {
                    auth.special = auth.realspecial;
                    auth.realspecial = null;
                }
            }
		}
		this.timeout = setTimeout(() => this.handleAttacks(), 5 * 1000);
	}

	destroy(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (this.attacks.has(player)) return player.say("You have already attacked somebody!");
		let targetID = Tools.toId(target);
		if (!(targetID in ssbchars)) return player.say("**" + target + "** is not a valid SSB character.");
		let targAuth = ssbchars[targetID];
		if (!targAuth.owner) return player.say("**" + targAuth.name + "** was not selected in this game.");
		if (targAuth.owner.eliminated) return player.say("**" + targAuth.name + "** has already been eliminated");
        if (targAuth.owner === player) return player.say("Are you sure you want to attack yourself...");
		let ownAuth = this.auth.get(player);
		if (ownAuth.special.cantAttack) return player.say("You cannot attack this round!");
		this.attacks.set(player, targAuth.owner);
		player.say("You have attacked **" + targAuth.name + "**!");
		this.numAttacks++;
		this.order.push(player);
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.beforeAttacks();
		}
	}

	action(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let auth = this.auth.get(player);
		if (!auth.special.onAction) {
			return player.say("Your auth does not have a per-round action.");
		}
		auth.special.onAction(target, player, this);
		if (this.numAttacks === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.beforeAttacks();
		}
	}

	select(target, user) {
		if (!this.canAuth) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		if (this.auth.has(player)) return player.say("You have already selected your auth!");
		let targetID = Tools.toId(target);
		if (!(targetID in ssbchars)) return player.say("**" + target + "** is not a valid SSB character.");
		if (ssbchars[targetID].owner) return player.say("**" + ssbchars[targetID].name + "** has already been picked.");
		this.auth.set(player, ssbchars[targetID]);
		ssbchars[targetID].owner = player;
        let msg = "You have selected your auth as **" + ssbchars[targetID].name + "**, who's ability is **" + ssbchars[targetID].desc + "**!";
        if (msg.length > 300) {
            msg = "You have selected your auth as **" + ssbchars[targetID].name + "**!";
        }
		player.say(msg);
		this.numAuth++;
		if (this.numAuth === this.getRemainingPlayerCount()) {
			clearTimeout(this.timeout);
			this.nextRound();
		}
	}

	myaction(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
	}

	auths(target, user) {
		let player = this.players[user.id];
		if (!player) return;
		let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><html><body><ul>";
		for (let i in ssbchars) {
			let auth = ssbchars[i];
			str += "<li><b>" + auth.name + "</b>: " + auth.desc + "</li>";
		}
		str += "</ul></body></html></div></div>";
		Rooms.get('survivor').say("/pminfobox " + user.id + ", " + str);
	}

	choose(target, user) {
		if (!this.expectingLeft) return;
		let player = this.players[user.id];
		if (player !== this.authplayer) return;
		target = Tools.toId(target);
		this.action = "";
		if (target === "left") {
			this.action = "left";
		} else if (target === "right") {
			this.action = "right";
		} else {
			return player.say("You must specify **left** or **right**");
		}
		clearTimeout(this.timeout);
		this.expectingLeft = false;
		this.say("__" + this.auth.get(this.authplayer).name + "__ chooses to go **" + this.action + "**!");
		this.doRoll("2d100");
	}
	myaction(target, user) {
		if (!this.canAttack) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		let auth = this.auth.get(player);
		if (auth.special.myAction) {
			return user.say("``" + auth.special.myAction + "``");
		} else {
			return user.say("Your character does not have an action to be used at this time.");
		}
	}
}

exports.game = SSB;
exports.name = name;
exports.description = description;
exports.id = id;
exports.aliases = ['ssb'];
exports.commands = {
	destroy: "destroy",
	action: "action",
	select: "select",
	myaction: "myaction",
	auths: "auths",
	choose: "choose",
	myaction: "myaction",
};
exports.pmCommands = {
	destroy: true,
	action: true,
	select: true,
	myaction: true,
	auths: true,
	choose: true,
	myaction: true,
};