/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL



// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

var http = require('http');
var cb = require('origindb')('lb');
var _ = require('lodash');
var hostQueue = [];
var queueText = '';
var ids = [];
let roasts = JSON.parse(require('fs').readFileSync('./commands/roasts.json'));
let millisToTime = function (millis) {
	let seconds = millis / 1000;
	let hours = Math.floor(seconds / 3600);
	let minutes = Math.floor((seconds - hours * 3600) / 60);
	let response;
	if (hours > 0) {
		response = hours + " hour" + (hours === 1 ? "" : "s") + " and " + minutes + " minute" + (minutes === 1 ? "" : "s");
	} else {
		response = minutes + " minute" + (minutes === 1 ? "" : "s");
	}
	return response;
};
if (Config.serverid === 'showdown') {
	var https = require('https');
	var csv = require('csv-parse');
}

// .set constants
const CONFIGURABLE_COMMANDS = {
	autoban: true,
	banword: true,
	say: true,
	guia: true,
};

const CONFIGURABLE_MODERATION_OPTIONS = {
	flooding: true,
	caps: true,
	stretching: true,
	bannedwords: true
};

const CONFIGURABLE_COMMAND_LEVELS = {
	off: false,
	disable: false,
	'false': false,
	on: true,
	enable: true,
	'true': true
};

for (let i in Config.groups) {
	if (i !== ' ') CONFIGURABLE_COMMAND_LEVELS[i] = i;
}
var host = '';
var hostId = '';

function isPM(roomid, userid) {
	if (roomid === userid) return true;
	else return false;
}

function lbuild() {}
let gameTypes = {
	
	avoidance: ['Avoidance', 'https://sites.google.com/view/survivor-ps/themes/avoidance', 'The trick is to pick the number that makes you not lose.', 0],
	bounty: ['Bounty', 'https://sites.google.com/view/survivor-ps/themes/bounty', 'Who is the bounty? Thats your mission to find out and capture them to win this game mode!', 2],
	casino: ['Casino', 'https://sites.google.com/view/survivor-ps/themes/casino', 'Place your bets and hope for the best!', 2],
	bank: ['Bank', 'https://sites.google.com/view/survivor-ps/themes/casino/bank', 'Sometimes greed is good... but only sometimes.', 2, 1],
	blackjack: ['Blackjack', 'https://sites.google.com/view/survivor-ps/themes/casino/blackjack', 'A Survivor themed game of blackjack.', 2, 1],
	highlow: ['High Low', 'https://sites.google.com/view/survivor-ps/themes/casino/high-low', 'Above and beyond or low and below?', 2, 1],
	lucky7: ['Lucky 7', 'https://sites.google.com/view/survivor-ps/themes/casino/lucky-7', 'You think you are lucky? Sir Vivor thinks otherwise.', 2, 1],
	roulette: ['Roulette', 'https://sites.google.com/view/survivor-ps/themes/casino/roulette', 'The roulette wheel is spinning, place your bets now!', 2, 1],
	slots: ['Slots', 'https://sites.google.com/view/survivor-ps/themes/casino/slots', 'Insert X coin(s) to play!', 2, 1],
	yahtzee: ['Yahtzee', 'https://sites.google.com/view/survivor-ps/themes/casino/yahtzee', 'A classic game of 5 dice with a Survivor twist!', 2, 1],
	chasetheace: ['Chase the Ace', 'https://sites.google.com/view/survivor-ps/themes/cta', 'Can you catch the best card?... Winner of NBT #8!', 1],
	cta: 'chasetheace',
	chooseyourroll: ['Choose Your Roll', 'https://sites.google.com/view/survivor-ps/themes/cyr', 'Will you reap the rewards of taking the path less traveled by?', 0],
	cyr: 'chooseyourroll',
	dexterity: ['Dexterity', 'https://sites.google.com/view/survivor-ps/themes/dexterity', 'Where accuracy can give you the advantage or just make you fail...', 1],
	dex: 'dexterity',
	dodgeball: ['Dodgeball', 'https://sites.google.com/view/survivor-ps/themes/dodgeball', 'When gym class gets a little too real.', 2],
	dragonorbs: ['Dragon Orbs', 'https://sites.google.com/view/survivor-ps/themes/dragon-orbs', 'Get your power level over 9000 by collecting getting the right balls or whatever.', 0],
	do: 'dragonorbs',
	exclusions: ['Exclusions', 'https://sites.google.com/view/survivor-ps/themes/exclusions', 'The theme where even you don\'t wanna know who you are...', 2],
	ex: 'exclusions',
	evolve: ['Evolve', 'https://sites.google.com/view/survivor-ps/themes/evolve', 'This isn\'t even my final form!', 2],
	evo: 'evolve',
	followtheleader: ['Follow the Leader', 'https://sites.google.com/view/survivor-ps/themes/ftl', 'Be with or against. Your choice... Winner of NBT #7!', 1],
	ftl: 'followtheleader',
	gottacatchemall: ['Gotta Catch \'Em All', 'https://sites.google.com/view/survivor-ps/themes/gcea', 'Are you the greatest there ever was? Prove it!', 1],
	gcea: 'gottacatchemall',
	hiddentype: ['Hidden Type', 'https://sites.google.com/view/survivor-ps/themes/hidden-type', 'Where everyone can pretend that they\'re not a steel type... Winner of NBT #1!', 1],
	hidden: 'hiddentype',
	ht: 'hiddentype',
	dualhiddentype: ['Dual Hidden Type', 'https://sites.google.com/view/survivor-ps/themes/hidden-type/dual-ht', 'Modification of Hidden Type. Wow, now they can have TWO different types? So cool.', 1, 2],
	dualtype: 'dualhiddentype',
	dual: 'dualhiddentype',
	htdt: 'dualhiddentype',
	htdual: 'dualhiddentype',
	dualht: 'dualhiddentype',
	eeveelutions: ['Eeveelutions', 'https://sites.google.com/view/survivor-ps/themes/hidden-type/eeveelutions', 'More than one kind? I can\'t beleevee this!', 1, 1],
	eevee: 'eeveelutions',
	hideandseektag: ['Hide and Seek Tag', 'https://sites.google.com/view/survivor-ps/themes/hst', 'Stop being so damn edgy and just play a childhood game for once.', 2],
	hst: 'hideandseektag',
	hideandseek: 'hideandseektag',
	holeinone: ['Hole in One', 'https://sites.google.com/view/survivor-ps/themes/hole-in-one', 'It\'s golf, but the sport, not Survivor\'s golf.', 1],
	hio: 'holeinone',
	hotpotato: ['Hot Potato', 'https://sites.google.com/view/survivor-ps/themes/hot-potato', 'This be a real hot potato.', 0],
	hungergames: ['Hunger Games', 'https://sites.google.com/view/survivor-ps/themes/hunger-games', 'Classic but with a twist: No alliances.', 0],
	hg: 'hungergames',
	hungergamesanonymous: ['Hunger Games Anonymous', 'https://sites.google.com/view/survivor-ps/themes/hunger-games', 'Hunger Games but you don\'t know who is who...', 0],
	hungergamesanon: 'hungergamesanonymous',
	hga: 'hungergamesanonymous',
	hungergamesspotlight: ['Hunger Games Spotlight', 'https://sites.google.com/view/survivor-ps/themes/hunger-games', 'Hunger games but with the spotlight variant (.spotlight for more info)', 0],
	hgs: 'hungergamesspotlight',
	jenga: ['Jenga', 'https://sites.google.com/view/survivor-ps/themes/jenga', 'The classic game! But it\'s... Survivor...?', 2],
	kabaddi: ['Kabaddi', 'https://sites.google.com/view/survivor-ps/themes/kabaddi', 'Captain, we have received contact.', 1],
	keysarekey: ['Keys Are Key', 'https://sites.google.com/view/survivor-ps/themes/keys-are-key', 'I got the keys keys keys.', 2],
	keys: 'keysarekey',
	key: 'keysarekey',
	kak: 'keysarekey',
	killerinthedark: ['Killer in the Dark', 'https://sites.google.com/view/survivor-ps/themes/kitd', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 2],
	kitd: 'killerinthedark',
	killer: 'killerinthedark',
	legotowerdefense: ['Lego Tower Defense', 'https://sites.google.com/view/survivor-ps/themes/lego-td', 'Now defending your tower is fun for the whole family!', 1],
	legotd: 'legotowerdefense',
	lego: 'legotowerdefense',
	towerdefense: 'legotowerdefense',
	td: 'legotowerdefense',
	poles: ['Poles', 'https://sites.google.com/view/survivor-ps/themes/poles', 'Your power is within the cards, can you use them wisely?', 2],
	pole: 'poles',
	prisonersdilemma: ['Prisoner\'s Dilemma', 'https://sites.google.com/view/survivor-ps/themes/prisoners-dilemma', 'Cooperate or Betray... which one benefits you more?', 1],
	pd: 'prisonersdilemma',
	risk: ['Risk', 'https://sites.google.com/view/survivor-ps/themes/risk', 'Pssh, who needs an army when you have a hulk?', 1],
	fishing: ['Fishing', 'https://sites.google.com/view/survivor-ps/themes/risk/fishing', 'Only the greatest fishermen win after catching two Poké Balls. Are you one of them?', 2, 2],
	fish: 'fishing',
	rockpaperscissors: ['Rock, Paper, Scissors', 'https://sites.google.com/view/survivor-ps/themes/rps', 'Sorry, no Lizard or Spock involved... Winner of NBT #2!', 0],
	rps: 'rockpaperscissors',
	rockpaperscissorslizardspock: ['Rock, Paper, Scissors, Lizard, Spock', 'https://sites.google.com/view/survivor-ps/themes/rps/rpsls', 'Modification of Rock, Paper, Scissors. Includes Lizard and Spock!', 0, 1],
	rpsls: 'rockpaperscissorslizardspock',
	rpslsp: 'rockpaperscissorslizardspock',
	russianroulette: ['Russian Roulette', 'https://sites.google.com/view/survivor-ps/themes/russian-roulette', 'Pass like a puss or Pull like a pro.', 1],
	rr: 'russianroulette',
	supersurvivorbros: ['Super Survivor Bros', 'https://sites.google.com/view/survivor-ps/themes/ssb', 'Destroy your hated roomauth with your favourite roomauth!... Winner of NBT #4!', 2],
	ssb: 'supersurvivorbros',
	thebridge: ['The Bridge', 'https://sites.google.com/view/survivor-ps/themes/the-bridge', 'Why burn the bridge when it will crumble on its own?', 1],
	bridge: 'thebridge',
	tokensoflife: ['Tokens of Life', 'https://sites.google.com/view/survivor-ps/themes/tokens-of-life', 'Who needs a Circle when you have Tokens?... Winner of NBT #11!', 0],
	tokens: 'tokensoflife',
	tol: 'tokensoflife',
	toptrumpspokebattle: ['Top Trumps Pokebattle', 'https://sites.google.com/view/survivor-ps/themes/ttp', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
	ttp: 'toptrumpspokebattle',
	trumps: 'toptrumpspokebattle',
	toptrumps: 'toptrumpspokebattle',
	longtoptrumpspokebattle: ['Long Top Trumps Pokebattle', 'https://sites.google.com/view/survivor-ps/themes/ttp', 'Where your partners\' lesser strengths can become their **greatest heroes.**', 1],
	longttp: 'longtoptrumpspokebattle',
	tribalcouncil: ['Tribal Council', 'https://sites.google.com/view/survivor-ps/themes/tribal-council', 'Unlike most elections, you don\'t want to be voted in this one.', 1],
	tc: 'tribalcouncil',

};

let eventTypes = {
	
	twentyfourhoursurvivor: ['24 Hour Survivor', 'https://sites.google.com/view/survivor-ps/events/24-hour-survivor', 'ALL DAY ROLL BATTLES EVERY DAY.'],
	twentyfour: 'twentyfourhoursurvivor',
	tfhs: 'twentyfourhoursurvivor',
	achievements: ['Achievements', 'https://sites.google.com/view/survivor-ps/events/achievements', 'Try to do more than just win the game!'],
	chieves: 'achievements',
	authhunt: ['Auth Hunt', 'https://sites.google.com/view/survivor-ps/events/auth-hunt', 'You\'ve played their games, but now they play yours... hunt them down.'],
	authbattle: 'authhunt',
	freeforall: ['Free for All', 'https://sites.google.com/view/survivor-ps/events/ffa', 'Take out as many opponents as you can!'],
	ffa: 'freeforall',
	gamblingroyale: ['Gambling Royale', 'https://sites.google.com/view/survivor-ps/events/gambling-royale', 'Weekend gambling, lifetime debt.'],
	gr: 'gamblingroyale',
	royale: 'gamblingroyale',
	minigames: ['Minigames', 'https://sites.google.com/view/survivor-ps/events/minigames', 'A mini spin on Survivor games.'],
	minigame: 'minigames',
	missingalias: ['Missing Alias', 'https://sites.google.com/view/survivor-ps/events/missing-alias', 'True identities are not given.'],
	survivorolympics: ['Survivor Olympics', 'https://sites.google.com/view/survivor-ps/events/survivor-olympics', 'Use your points wisely.'],
	olympics: 'survivorolympics',
	survlympics: 'survivorolympics',
	survivorshowdown: ['Survivor Showdown', 'https://sites.google.com/view/survivor-ps/events/survivor-showdown', 'Use your points wisely.'],
	ss: 'survivorshowdown',

};

let modTypes = {
	
	advantage: ['Advantage', 'When a player is successful with an attack, they gain an extra roll when attacking and defending. Host takes the higher roll.'],
	alliance: ['Alliance', 'Players can team up with other players and when attacking, they all roll at the same time.'],
	anonymous: ['Anonymous', 'The host will ask players for nicknames before the game begins and players will attack nicknames rather than usernames.'],
	anon: 'anonymous',
	ai: ['AI', 'Attacker\'s Immunity, if the attacker loses the roll, they are not eliminated.'],
	attackersimmunity: 'ai',
	bomb: ['Bomb', 'The host picks one or more players to be a bomb. A player who kills a bomb dies too.'],
	counterattack: ['Counter Attack', 'If an attacker fails to kill their defending target, then their defending target will attack them right back.'],
	counter: 'counterattack',
	ca: 'counterattack',
	disadvantage: ['Disadvantage', 'When a player is successful with an attack, they gain an extra roll when attacking and defending. Host takes the lower roll.'],
	dissolve: ['Dissolve', 'Any time the attacker fails to do damage or eliminate their opponent, the attacker loses -10 to their roll for the remainder of the game.'],
	empire: ['Empire', 'Before the game starts, players pick between two empires. The host then makes two PLs based on the players\' choices, and carries out the game as if it were two games, one per empire. The winners of each empire make it to finals.'],
	golf: ['Golf', 'The lower roll wins.'],
	hp: ['HP', 'Hit Points, players start the game with HP. The loser of an attack loses HP equal to the higher roll minus the lower roll. A player is eliminated when their HP reaches 0 or below.'],
	hitpoints: 'hp',
	berserk: ['Berserk (HP)', 'As you lose HP, your roll increases for every hit point you lose. (use with HP modification)'],
	sturdy: ['Sturdy (HP)', 'If a player is one-shot by an opponent while they are at full HP, instead of dying, they remain alive with 1 HP remaining. (use with HP modification)'],
	killstreak: ['Kill Streak', 'Players are not eliminated when they lose a roll battle, but players must win by getting a certain number of roll battle victories or having the most victories in a certain number of rounds.'],
	ks: 'killstreak',
	minefield: ['Minefield', 'The host does .roll 10 followed by .pick beginning, end to decide the mines. If a player rolls a mine, they automatically die.'],
	overkill: ['Overkill', 'If a player wins a roll by 50 or more, they get to attack another player with a roll bonus of +25.'],
	pileon: ['Pile On', 'The player who was attacked the most times in a given round must roll against extra attacks if they are still alive at the end of the round.'],
	po: 'pileon',
	resistance: ['Resistance', 'Host rolls a number which becomes the resistance number. The winner of any roll battle must beat their opponent by the resistance number or higher in order for their attack to be successful.'],
	res: 'resistance',
	rollboost: ['Roll Boost', 'Players have points that they can distribute throughout the game to raise their max roll for a round.'],
	rb: 'rollboost',
	rollswitch: ['Roll Switch', 'Hosts use .pick golf, reg before rolling each attack.'],
	rs: 'rollswitch',
	secondwind: ['Second Wind', 'Players have 2 lives each.'],
	sw: 'secondwind',
	simultaneous: ['Simultaneous', 'When a player is attacked by multiple people in the same round, the attacks are carried out at the same time and the player rolls once to defend against all attacks.'],
	soullink: ['Soul Link', 'At the beginning of the game, you\'re paired up with another player. You know who they are, and they know who you are. When one of you dies, the other one dies as well. (even amount of players required)'],
	sl: 'soullink',
	spotlight: ['Spotlight', 'Instead of sending the host your attacks in PMs the host uses !pick or .pick to choose a person who shall attack and say it in the chat.'],
	triplethreat: ['Triple Threat (Spotlight)', 'When selected, players will attack 2 other players instead of just 1, and all 3 players will roll, with the player that rolls the lowest being eliminated, and the other 2 being safe. (use with Spotlight modification)'],
	tagteam: ['Tag Team', 'Players are in teams of 2, one member represents the team in battle. Each round, teams can switch their representative by tagging, and they attack a member of an opposing team, whichever member they believe will be tagged in for the attack.'],
	tag: 'tagteam',
	weardown: ['Wear Down', 'Whatever the player rolls last will become their new max roll. If they get to 1, they are eliminated.'],
	wd: 'weardown',
	
};


let commands = {
	/**
	 * Help commands
	 *
	 * These commands are here to provide information about the bot.
	 */

	git: function (arg, user, room) {
		let prefix = user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		let text = !Config.fork ? "No source code link found." : "The source code for this bot can be found here: " + Config.fork;
		room.say(prefix + text);
	},
	
	credits: 'about',
	about: function (arg, user, room) {
		user.say(`I am a bot made for the Survivor room. Please contact Survivor room auth for any questions regarding me!`)
	},
	
	site: function (arg, user, room) {
		let prefix = user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		let text = "https://sites.google.com/view/survivor-ps/home";
		room.say(prefix + text);
	},
	
	help: 'guide',
	guide: function (arg, user, room) {
		let prefix = user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		let text = !Config.botguide ? "There is no guide for this bot. PM the owner with any questions." : "A guide on how to use this bot can be found here: " + Config.botguide;
		room.say(prefix + text);
	},
	
	reconnect: 'off',
	disconnect: 'off',
	crash: 'off',
	restart: 'off',
	off: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return false;
		room.say("/logout");
		connect();
	},
	
	kill: function (arg, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return false;
		if (user.lastcmd !== 'kill') return room.say("Are you sure you want to restart the bot? If so, type the command again.");
		room.say("/logout");
		process.exit();
	},
	
	/**
	 * Dev commands
	 *
	 * These commands are here for highly ranked users (or the creator) to use
	 * to perform arbitrary actions that can't be done through any other commands
	 * or to help with upkeep of the bot.
	 */
	encrypt: function (target, user, room) {
		if (!user.isExcepted()) return false;
		return user.say("Encrypted message: " + Tools.encrypt(target));
	},
	
	decrypt: function (target, user, room) {
		if (!user.isExcepted()) return false;
		return user.say("Decrypted message: " + Tools.decrypt(target));
	},
	
	reload: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		try {
			delete require.cache[require.resolve('./commands.js')];
			Commands = require('./commands.js').commands;
			room.say('Commands reloaded.');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},
	
	reloadvoice: 'reloadvoices',
	reloadvoices: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		Rooms.get('survivor').say("/roomauth surv");
		user.say("Voices have been reloaded.");
	},

	reloadgames: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		delete require.cache[require.resolve('./games.js')];
		global.Games = require('./games.js');
		Games.loadGames();
		room.say('Games reloaded.');
	},
	
	shutdownmode: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		Config.allowGames = false;
		room.say("Shutdown mode enabled");
	},
	
	join: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		send('|/join ' + arg);
	},
	
	custom: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobuser,
		// the command would be ".custom [lobuser] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0) {
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
	},

	eval: 'js',
	js: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		try {
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},
	
	uptime: function (arg, user, room) {
		var text = ((room === user || user.isExcepted()) ? '' : '/pm ' + user.id + ', ') + '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			let divisor = divisors.pop();
			let unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
			case 5:
				text += buffer[4] + ', ';
				/* falls through */
			case 4:
				text += buffer[3] + ', ';
				/* falls through */
			case 3:
				text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
				break;
			case 2:
				text += buffer[1] + ' and ' + buffer[0];
				break;
			case 1:
				text += buffer[0];
				break;
		}

		room.say(text);
	},


	/**
	 * Room Owner commands
	 *
	 * These commands allow room owners to personalise settings for moderation and command use.
	 */

	settings: 'set',
	set: function (arg, user, room) {
		if (room === user || !user.hasRank(room.id, '#')) return false;

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		var roomid = room.id;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			let modOpt;
			if (!opts[1] || !CONFIGURABLE_MODERATION_OPTIONS[(modOpt = toId(opts[1]))]) {
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}
			if (!opts[2]) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding && this.settings.modding[roomid] && modOpt in this.settings.modding[roomid] ? 'OFF' : 'ON') + '.');

			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};

			let setting = toId(opts[2]);
			if (setting === 'on') {
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			} else if (setting === 'off') {
				this.settings.modding[roomid][modOpt] = 0;
			} else {
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, Config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true) {
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			} else if (typeof Commands[cmd] === 'function') {
				if (cmd in CONFIGURABLE_COMMANDS) break;
				return this.say(room, 'The settings for ' + Config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			} else {
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + Config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		if (!opts[1]) {
			let msg = '' + Config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd]))) {
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank) + ' and above.';
			} else if (this.settings[cmd][roomid] in CONFIGURABLE_COMMAND_LEVELS) {
				msg += 'available for users of rank ' + this.settings[cmd][roomid] + ' and above.';
			} else {
				msg += this.settings[cmd][roomid] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		let setting = opts[1].trim();
		if (!(setting in CONFIGURABLE_COMMAND_LEVELS)) return this.say(room, 'Unknown option: "' + setting + '". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.');
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][roomid] = CONFIGURABLE_COMMAND_LEVELS[setting];

		this.writeSettings();
		this.say(room, 'The command ' + Config.commandcharacter + '' + cmd + ' is now ' +
			(CONFIGURABLE_COMMAND_LEVELS[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
				(this.settings[cmd][roomid] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
	},
	
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to blacklist.');

		arg = arg.split(',');
		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];
		var roomid = room.id;
		for (let u of arg) {
			let tarUser = toId(u);
			if (!tarUser || tarUser.length > 18) {
				illegalNick.push(tarUser);
			} else if (!this.blacklistUser(tarUser, roomid)) {
				alreadyAdded.push(tarUser);
			} else {
				added.push(tarUser);
				this.say(room, '/roomban ' + tarUser + ', Blacklisted user');
			}
		}

		var text = '';
		if (added.length) {
			text += 'user' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist';
			this.say(room, '/modnote ' + text + ' by ' + user.name + '.');
			this.writeSettings();
		}
		if (alreadyAdded.length) {
			text += ' user' + (alreadyAdded.length > 1 ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') + ' already present in the blacklist.';
		}
		if (illegalNick.length) text += (text ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
		this.say(room, text);
	},
	
	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to unblacklist.');

		arg = arg.split(',');
		var removed = [];
		var notRemoved = [];
		var roomid = room.id;
		for (let u of arg) {
			let taruser = toId(u);
			if (!taruser || taruser.length > 18) {
				notRemoved.push(taruser);
			} else if (!this.unblacklistUser(taruser, roomid)) {
				notRemoved.push(taruser);
			} else {
				removed.push(taruser);
				this.say(room, '/roomunban ' + taruser);
			}
		}

		var text = '';
		if (removed.length) {
			text += ' user' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, '/modnote ' + text + ' user by ' + user.name + '.');
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	
	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!users.self.hasRank(room.id, '@')) return this.say(room, users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Don\'t be Machiavellian!');
		}

		var regex = '/' + arg + '/i';
		if (!this.blacklistuser(regex, room.id)) return this.say(room, '/' + regex + ' is already present in the blacklist.');

		var regexObj = new RegExp(arg, 'i');
		var users = room.users.entries();
		var groups = Config.groups;
		var selfid = users.self.id;
		var selfidx = groups[room.users.get(selfid)];
		for (let u of users) {
			let userid = u[0];
			if (userid !== selfid && regexObj.test(userid) && groups[u[1]] < selfidx) {
				this.say(room, '/roomban ' + userid + ', Blacklisted user');
			}
		}

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + regex + ' was added to the blacklist user user ' + user.name + '.');
		this.say(room, 'Regular expression ' + regex + ' was added to the blacklist.');
	},
	
	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!users.self.hasRank(room.id, '@')) return this.say(room, users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!this.unblacklistuser(arg, room.id)) return this.say(room, '/' + arg + ' is not present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist user user ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},
	
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;

		var text = '/pm ' + user.id + ', ';
		if (!this.settings.blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		var roomid = room.id;
		var blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		if (!arg.length) {
			let userlist = Object.keys(blacklist);
			if (!userlist.length) return this.say(room, text + 'No users are blacklisted in this room.');
			return this.uploadToHastebin('The following users are banned from ' + roomid + ':\n\n' + userlist.join('\n'), function (link) {
				if (link.startsWith('Error')) return this.say(room, text + link);
				this.say(room, text + 'Blacklist for room ' + roomid + ': ' + link);
			}.bind(this));
		}

		var nick = toId(arg);
		if (!nick || nick.length > 18) {
			text += 'Invalid username: "' + nick + '".';
		} else {
			text += 'user "' + nick + '" is currently ' + (blacklist[nick] || 'not ') + 'blacklisted in ' + roomid + '.';
		}
		this.say(room, text);
	},
	
	
	/**
	 * General commands
	 *
	 * Add custom commands here.
	 */

	seen: function (arg, user, room) { // this command is still a bit buggy
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id) {
			return user.say('Have you looked in the mirror lately?');
		} else if (toId(arg) === user) {
			return user.say('You might be either blind or illiterate. Might want to get that checked out.');
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			return user.say('The user ' + arg + ' has never been seen.');
		}
		return user.say(arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.'));
	},

	leave: function (target, user, room) {
		if (!user.isExcepted()) return;
		room.say("/part");
	},

	// Survivor Commands:
	// Host commands:
	host: function (target, user, room) {
		if ((!user.hasRank(room.id, '+') && (Config.canHost.indexOf(user.id) === -1)) || room === user) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		let split = target.split(",");
		let realuser = Users.get(split[0]);
		if (!realuser) return this.say(room, "You can only host somebody currently in the room.");
		if (realuser.id in Games.hostbans) return user.say("That user is currently hostbanned.");
		let targTheme = "";
		if (split.length > 1) {
			let targThemeID = Tools.toId(split[1]);
			if (!(targThemeID in gameTypes)) {
				return room.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");
			} else {
				if (typeof gameTypes[targThemeID] === 'string') targThemeID = gameTypes[targThemeID];
				targTheme = gameTypes[targThemeID][0];
			}
		}
		if (Games.host || room.game) {
			target = Tools.toId(realuser.name);
			let i = 0,
				len = Games.hosts.length;
			for (; i < len; i++) {
				if (target === Tools.toId(Games.hosts[i][0])) {
					break;
				}
			}
			if (Games.host && Games.host.id === realuser.id) {
				return room.say(realuser.name + " is already hosting somebody probably sniped you haha");
			} else if (i !== len) {
				this.say(room, realuser.name + " is already on the hostqueue.");
			} else {
				this.say(room, realuser.name + " was added to the hostqueue" + (targTheme.length ? " for " + targTheme : "") + "!");
				Games.hosts.push([realuser.name, targTheme]);
			}
			return;
		}
		if (Games.hosts.length > 0) {
			let info = Games.hosts.shift();
			Games.hosts.push([realuser.name, targTheme]);
			this.say(room, realuser.name + " was added to the hostqueue" + (targTheme.length ? " for " + targTheme : "") + "!");
			this.say(room, "survgame! " + info[0] + " is hosting" + (info[1].length ? " **" + info[1] + "**" : "") + "! Do ``/me in`` to join!");
			this.say(room, "/modnote HOST: " + info[0] + " hosted");
			Games.host = Users.get(info[0]);
			Games.addHost(Games.host);
			Games.exportData();
		} else {
			Games.host = realuser;
			this.say(room, "survgame! " + realuser.name + " is hosting" + (targTheme.length ? " **" + targTheme + "**" : "") + "! Do ``/me in`` to join!");
			this.say(room, "/modnote HOST: " + realuser.name + " hosted");
			Games.addHost(realuser);
			Games.exportData();
		}
	},

	randtheme: function (arg, user, room) {
		let target = !user.hasRank(room.id, '+') && !(Games.host && Games.host.id === user.id) ? user : room;
		let avail = [];
		for (let i in gameTypes) {
			if (typeof gameTypes[i] === "string") continue;
			let name = gameTypes[i][0];
			if (avail.includes(name) || gameTypes[i][4]) {
				continue;
			}
			avail.push(name);
		}
		let theme = Tools.sample(avail);
		for (let i in gameTypes) {
			if (gameTypes[i][0] == theme) {
				var data = gameTypes[i];
				return target.say('**' + data[0] + '**: __' + data[2] + '__ Game rules: ' + data[1]);
			}
		}

	},

	theme: 'themes',
	themes: function (arg, user, room) {
		if (!Games.canTheme) return;
		let target = user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id) ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("The list of game types can be found here: https://sites.google.com/view/survivor-ps/themes");
		if (!gameTypes[arg]) return target.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");
		let data = gameTypes[arg];
		if (typeof data === 'string') data = gameTypes[data];

		let text = '**' + data[0] + '**: __' + data[2] + '__ Game rules: ' + data[1];
		if (Games.host) {
			Games.hosttype = data[3];
		}
		target.say(text);
		if (room == user) return;
		Games.canTheme = false;
		var t = setTimeout(function () {
			Games.canTheme = true;
		}, 5 * 1000);
	},

	events: 'event',
	event: function (arg, user, room) {
		let target = user.hasRank(room.id, '+') ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("Link to the Survivor events page: https://sites.google.com/view/survivor-ps/events");
		if (!eventTypes[arg]) return target.say("Invalid event type. The events can be found here: https://sites.google.com/view/survivor-ps/events");
		let data = eventTypes[arg];
		if (typeof data === 'string') data = eventTypes[data];

		let text = '**' + data[0] + '**: __' + data[2] + '__ Event rules: ' + data[1];
		target.say(text);
	},
	
	modifications: 'mod',
	modification: 'mod',
	mods: 'mod',
	mod: function (arg, user, room) {
		let target = user.hasRank(room.id, '+') ? room : user;
		arg = toId(arg);
		if (!arg) return target.say("Link to the Survivor theme modifications: https://sites.google.com/view/survivor-ps/themes/modifications");
		if (!eventTypes[arg]) return target.say("Invalid modification type. The modifications can be found here: https://sites.google.com/view/survivor-ps/themes/modifications");
		let data = modTypes[arg];
		if (typeof data === 'string') data = modTypes[data];

		let text = '**' + data[0] + '**: __' + data[1] + '__';
		target.say(text);
	},
	
	sethost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && Config.canHost.indexOf(user.id) === -1) return;
		if (Games.host) return room.say("__" + Games.host.name + "__ is currently hosting");
		let targUser = Users.get(Tools.toId(target));
		if (!targUser) return room.say("**" + target + "** is not currently in the room");
		Games.host = targUser;
		room.say("**" + targUser.name + "** has been set as the host.");
		room.say("/modnote " + targUser.name + " has been set as the host by " + user.name + ".");
	},

	hostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		if (!target) return room.say("Please provide a username.");
		let split = target.split(",");
		let targUser = Users.get(split[0]);
		if (!targUser) {
			targUser = {
				id: Tools.toId(split[0]),
				name: split[0],
			}
		}
		let numDays = parseInt(split[1]);
		if (!numDays) numDays = 7;
		Rooms.get('survivor').say("/modnote " + target + " has been hostbanned for " + numDays + " days by " + user.name + ".");
		return room.say(Games.hostBan(targUser, numDays));
	},



	hostbanned: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		if (Object.keys(Games.hostbans).length === 0) {
			return user.say("No users are currently hostbanned");
		} else {
			let msg = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><th>Name</th><th>Ban time</th>";
			msg += Object.keys(Games.hostbans).map(key => {
				return "<tr><td>" + Games.hostbans[key].name + "</td><td>" + Games.banTime(key) + "</td></tr>";
			}).join("");
			return Rooms.get('survivor').say("/pminfobox " + user.id + ", " + msg + "</table></body></html></div></div>");
		}

		//return room.say("Hostbanned users: " + Object.keys(Games.hostbans).map(t => Games.hostbans[t].name).join(", "));
	},

	unhostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		Rooms.get('survivor').say("/modnote " + target + " has been unhostbanned by " + user.name + ".");
		return room.say(Games.unHostBan(target));
	},

	bantime: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		return room.say(Games.banTime(target));
	},
	
	subhost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Games.host) return room.say("No host is currently active.");
		user = Users.get(Tools.toId(target));
		if (!user) return room.say("You can only host somebody currently in the room.");
		Games.host = user;
		room.say("**" + Games.host.name + "** has subbed in as the host!");
		room.say("/modnote " + Games.host.name + " has subhosted");
	},

	userhosts: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return;
		if (!target) return user.say("Please specify a user.");
		let split = target.split(",");
		let realuser = split[0];
		let numDays = 7;
		if (split.length > 1) {
			numDays = Math.floor(Tools.toId(split[1]));
		}
		if (!numDays) {
			numDays = 7;
		}
		user.say(Games.getHosts(realuser, numDays));
	},

	removehost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return;
		if (!target) return user.say("Please specify a user.");
		if (Games.removeHost(target)) {
			user.say("One host has been removed from " + target);
			this.say(Rooms.get('survivor'), '/modnote ' + user.name + " removed a host from " + target);
		} else {
			user.say("That user hasn't hosted recently.");
		}
	},

	dt: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		var data = [];
		for (let i in Tools.data.pokedex) {
			let mon = Tools.data.pokedex[i];
			data.push(mon.name);
		}
		target = toId(target);
		for (let i = 0; i < data.length; i++) {
			if (target === toId(data[i])) {
				return this.say(room, "!dt " + data[i]);
			}
		}
		this.say(room, "No pokemon named " + target + " was found.");
	},

	randpoke: 'poke',
	poke: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		room.say("!dt " + Tools.data.pokedex[Tools.sample(Object.keys(Tools.data.pokedex))].name);
	},

	autostart: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (room.game && typeof room.game.autostart === 'function') room.game.autostart(target);
	},

	dq: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (room.game && typeof room.game.dq === 'function') room.game.dq(target);
	},
	
	pl: 'players',
	players: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (room.game && typeof room.game.pl === 'function') room.game.pl();
	},

	done: function (arg, user, room) {
		if (!Games.host || Games.host.id !== user.id) return;
		Games.host = null;
		this.say(room, "Thanks for playing!");
	},
	
	
	// Informational Commands:

	dehost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		target = Tools.toId(target);
		if (target === "") {
			if (Games.host) {
				this.say(room, "The game was forcibly ended.");
			}
			Games.host = null;
			return;
		}
		if (Games.host && Games.host.id === target) {
			this.say(room, "The game was forcibly ended.");
			Games.host = null;
			return;
		}
		let i = 0,
			len = Games.hosts.length;
		for (; i < len; i++) {
			if (target === Tools.toId(Games.hosts[i][0])) {
				break;
			}
		}
		if (i !== len) {
			Games.hosts.splice(i, 1);
			return this.say(room, target + " was removed from the hosting queue.");
		}
		if (room.game) {
			room.game.forceEnd();
			return;
		}
	},

	game: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room !== user) return;
		let survRoom = Rooms.get('survivor');
		if (Games.host) {
			return room.say("__" + Games.host.name + "__ is currently hosting.");
		} else if (survRoom.game) {
			return room.say("A game of **" + survRoom.game.name + "** is in progress.");
		} else {
			return room.say("No game is in progress.");
		}
	},
	
	tester: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		this.say(room, room.id)
		this.say(room, user.id)
	},
	
	win: function (target, user, room) {
		if (!Games.host || Games.host.id !== user.id || room === user) return;
		/*let split = target.split(",");
		if (split.length !== 2) {
			return room.say("You must specify the playercount and the username that won, in the format: ``.win playercount, winner``");
		}
		let numPlayers = parseInt(split[0]);
		if (!numPlayers || numPlayers < 1) return room.say("The number of players must be a number greater than 0.");
		if (!Games.hosttype && Games.hosttype !== 0) {
			if (user.hasRank(room.id, '+')) {
				room.say("The winner is **" + split[1].trim() + "**, but I could not award host points since you never selected a theme!");
			} else {
				return room.say("Please select a theme before winning the player!");
			}
		} else {
			if (!user.hasRank(room.id, '+')) {
				room.say(".win " + target);
			}
			let types = ["easy", "medium", "hard"];
			room.say("." + types[Games.hosttype] + "host " + numPlayers + ", " + Games.host.name);
			room.say("The winner is **" + split[1].trim() + "**! Thanks for playing.");
		}
		Games.hosttype = null;
		Games.host = null;*/
		room.say("The winner is **" + target + "**! Thanks for playing.");
		Games.host = null;
		Games.hosttype = null;
	},

	intro: function (arg, user, room) {
		if (!Games.canIntro) return;
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user + ', ';
		}
		text += 'Hello, welcome to Survivor! I\'m the room bot. "Survivor" is a luck-based game that uses Pokémon Showdown\'s /roll feature. For more info, go to: https://sites.google.com/view/survivor-ps/home';
		this.say(room, text);
		Games.canIntro = false;
		var t = setTimeout(function () {
			Games.canIntro = true;
		}, 5 * 1000);
	},
	
	plug: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user + ', ';
		}
		text += 'Join us and listen to some tunes :J https://plug.dj/survivoranimeclub';
		this.say(room, text);
	},
	
	smogon: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user + ', ';
		}
		text += 'Survivor\'s DD records can be found on Smogon! https://www.smogon.com/forums/threads/daily-deathmatch-2019-survivor-leaderboards.3645594/';
		this.say(room, text);
	},
	
	nbt: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}

		text += '**Next Big Theme** is not currently in session. More info on NBT here: https://sites.google.com/view/survivor-ps/about/nbt';
		this.say(room, text);
	},
	
	nbtsubmissions: 'nbtsubs',
	nbtsubs: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}

		text += '**NBT XII** is currently in session through July 2020! Check out previous NBT winners here: https://sites.google.com/view/survivor-ps/hof/nbt-hof';
		this.say(room, text);
	},
	
	rankings: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'This has been discontinued but what\'s left of the **Survivor Rankings** can be found here: http://goo.gl/jAucyT';
		this.say(room, text);
	},
	
	howtohost: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'How To Host: https://sites.google.com/view/survivor-ps/guides/how-to-host';
		this.say(room, text);
	},
	
	summary: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '%')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'Hello, welcome to Survivor. Here we play a series of Survivor games. Survivor is a game based on dice rolls,  some games require less luck than others. Example attack: http://i.imgur.com/lKDjvWi.png';
		this.say(room, text);
	},

	day: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		let day = new Date().getDay();
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		text += 'Today is currently **' + days[day] + "**!";
		this.say(room, text);
	},
	
	htp: 'howtoplay',
	howtoplay: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'Survivor Themes and How to Play Them: https://sites.google.com/view/survivor-ps/themes';
		this.say(room, text);
	},

	nexthost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) {
			return this.say(room, "A game is currently in progress!");
		}
		if (Games.hosts.length === 0) {
			return this.say(room, "The hostqueue is empty.");
		}
		let info = ["", ""];
		while (Games.hosts.length > 0) {
			info = Games.hosts.shift();
			if (Users.get(info[0])) {
				break;
			} else {
				this.say(room, "**" + info[0] + "** is not online and could not be hosted!");
			}
		}
		if (Users.get(info[0])) {
			this.say(room, "survgame! " + info[0] + " is hosting" + (info[1].length ? " **" + info[1] + "**" : "") + "! Do ``/me in`` to join!");
			this.say(room, "/modnote HOST: " + info[0] + " hosted");
			Games.host = Users.get(info[0]);
			Games.addHost(info[0]);
			Games.points = null;
			Games.exportData();
		} else {
			this.say(room, "Nobody in the hostqueue could be hosted!");
		}
	},

	// Special staff commands (all the other staff commands are in commands/text.js)
	paradise: 'para',
	para: function (arg, user, room) {
		let text1 = 'I\'m Paradise and this is my Anime club. I work here with my friends and fellow weebs: Spieky, Bon Dance, Don’t Lose, Aknolan, PenQuin, Swirlyder, Aknolan, Moo, Snap, Hawkie';
		let text2 = 'Toni XY, Henka, OM, Zeonth, Zyx14, phable, deetah, Hurl, Abd1710, cleo, Ls\'s Ghost, ptoad, Rainshaft, pants, wob, Ceteris, Gimmick, Shadecession, Rach, Harambeween';
		let text3 = 'geene, inactive, mitsuki, Tushavi, Zyg, Santa Vivor, Guishark, TheBluestEye, ProfSapling, hasumi kisaragi, Megagr, iDybalaJRenYT!~, and Calem DPU; and in 23 years, I\'ve learned one thing. You never know WHAT anime is going to be good.';
		if (room !== user && !user.hasRank(room, '+')) {
			user.say(text1);
			user.say(text2);
			user.say(text3);

		} else {
			room.say(text1);
			room.say(text2);
			room.say(text3);
		}
	},
	
	hirl123: 'hurl',
	hurl: function (arg, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let text = '/addhtmlbox <img src="https://i.vgy.me/ip3Fc9.png" width="0" height="0" style="height:135px;width:auto">';
		this.say(room, text);
	},

	deetah: function (arg, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let text = '/addhtmlbox <img src="https://media1.tenor.com/images/c446b973ea91717531d747b17d48ad99/tenor.gif?itemid=4884715" height="225" width="400">';
		this.say(room, text);
	},
	
	pants: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text = '/pm ' + user.id + ', ';
		text += '.done with life';
		this.say(room, text);
	},
	
	moo: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		this.say(room, '/me MOOs');
	},
	
	dominate: function (arg, user, room) {
		let text = user.hasRank(room.id, '+') ? '' : '/pm ' + user + ', ';
		text += "/me T-Poses";
		if (arg) text += " on " + arg;
		this.say(room, text);
	},
	
	hug: function (arg, user, room) {
		let text = user.hasRank(room.id, '+') ? '' : '/pm ' + user + ', ';
		text += "/me hugs ";
		if (arg) text += arg;
		this.say(room, text);
	},
	
	interviews: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) {
			text = '';
		} else if (room.id !== user.id) {
			text = '/pm ' + user.id + ', ';
		}
		text += 'Current Poll: https://docs.google.com/forms/d/e/1FAIpQLSejXxHn2ycTXn8nKYRRmYEJZMqX1rNb43A1u2ePdxjysVeMZw/viewform || Interviews: https://sites.google.com/view/survivor-ps/extras/current-auth';
		this.say(room, text);
	},
	
	meme: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) {
			text = '';
		}
		text += '/addhtmlbox <center><a href="https://youtu.be/DLzxrzFCyOs"><button title="Dot Not Click Me">Click Me</button></a></center>';
		this.say(room, text);
	},

	highfive: function (arg, user, room) {
		let prefix = user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		let text = toId(arg) ? '/me high-fives ' + arg.trim() : 'Usage: ``.highfive [name]``';
		room.say(prefix + text);
	},

	joke: function (arg, user, room) {
		var text = '';
		var jokes = ['What does a nosey pepper do? Get jalapeño business.', 'What is Bruce Lee’s favorite drink? Wataaaaah!', 'How does NASA organize their company parties? They planet.', 'Why does Snoop Dogg carry an umbrella? Fo’ drizzle.', 'What time is it when you have to go to the dentist? Tooth-hurtie.', 'There’s two fish in a tank. One turns to the other and says "You man the guns, I’ll drive"', 'Why can’t a bike stand on its own? It’s two tired.', 'How do you make Holy water? Boil the hell out of it.', 'What did one ocean say to the other ocean? Nothing, they just waved.', 'A bear walks into a bar and he asks the bartender "I\'d like some peanuts............. and a glass of milk. The bartender says "Why the big pause?"', 'Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!', 'What did the traffic light say when it stayed on red? ”You would be red too if you had to change in front of everyone!”', 'Two hats are on a hat rack. Hat #1 to hat #2 “you stay here. I’ll go on a head.”', 'Why did the tomato blush? ... it saw the salad dressing.', 'What did the football coach say to the broken vending machine? “Give me my quarterback!”', 'What did the digital clock say to the grandfather clock? Look grandpa, no hands!', 'What happens to a frog\'s car when it breaks down? It gets toad away.', 'What did the blanket say when it fell of the bed? "Oh sheet!"', 'What lights up a soccer stadium? A soccer match', 'Why shouldn\'t you write with a broken pencil? Because it\'s pointless.', 'What do you call a fake noodle? An impasta', 'Why is Peter Pan always flying? He neverlands!', 'How many tickles does it take to make an octopus laugh? Ten-Tickles', 'Why did the stadium get hot after the game? All of the fans left.', 'What did Barack Obama say to Michelle when he proposed? Obama: I don\'t wanna be obama self.', 'Why did the picture go to jail? Because it was framed!', 'What if soy milk is just regular milk introducing itself in Spanish?', 'Why couldn\'t the sesame seed leave the gambling casino? Because he was on a roll.', 'Why did the chicken cross the playground? To get to the other slide.', 'What does a cell phone give his girlfriend? A RING!', 'How did the italian chef die? He pasta away.', 'Why didn\'t the skeleton go to the party? He had no-body to dance with!', 'How does Moses make his tea? Hebrews it.', 'What do you call a sleeping bull? A bull-dozer.', 'Why didn\'t the koala get the job? He didn\'t have the koalafictions', 'What do you call a fairy that hasn\'t bathed in a year? Stinkerbell', 'What do you call two Mexicans playing basketball? Juan on Juan.', 'What do you call a guy who never farts in public? A private tutor', 'Why did the can crusher quit hit job? It was soda pressing!', 'A blonde went into a doctors office and said "doctor help I\'m terribly sick" doc replies "flu?" "no, I drove here."', 'What do you comb a rabbit with? A hare brush!', 'Why did the deer need braces? Because he had buck teeth!', 'What did the blanket say when it fell off the bed? Oh sheet!', 'Why shouldn\'t you write with an unsharpened pencil? It\'s pointless', 'What did one plate say to the other? Dinner\'s on me!', 'How do you make a tissue dance? You put a little boogey in it!', 'Want to hear a joke about paper? Never mind it\'s tearable.', 'What\'s the difference between a guitar and a fish? You can tune a guitar but you can\'t tuna fish!', 'What kind of key opens a banana? A mon-key!', 'What do you call a line of rabbits walking backwards? A receding hare line.', 'Why did the Fungi leave the party? There wasn\'t mushroom.', 'Why did the algae and the fungus get married? They took a lichen to each other.', 'Why do Toadstools grow so close together? They don\'t need Mushroom. ', 'What would a mushroom car say? Shroom shroom!', 'What room has no doors, no walls, no floor and no ceiling? A mushroom.', 'What do you get if you cross a toadstool and a full suitcase? Not mushroom for your holiday clothes!', 'Did you hear the joke about the fungus? I could tell it to you, but it might need time to grow on you.', 'What do mushrooms eat when they sit around the campfire? S\'pores.', 'What did the mushroom say when it was locked out of the house? E no ki.', 'Why wouldn\'t the teenage mushroom skip school? He didn\'t want to get in truffle', 'Why did the mushroom go to the party? It didn\'t. Mushrooms are non-sentient organic matter, so they generally don\'t get invited to parties.', 'Why did the Mushroom get invited to all the RAVE parties? \'Cuz he\'s a fungi!', 'Yo mama so poor your family ate cereal with a fork to save milk', 'Yo mama so fat, I took a picture of her last Christmas and it\'s still printing', 'What did the first cannibal say to the other while they were eating a clown? Does this taste funny to you?', 'My Dad used to say always fight fire with fire, which is probably why he got kicked out of the fire brigade', 'I like to stop the microwave at 1 second just to feel like a bomb defuser', 'I should change my facebook username to NOBODY so that way when people post crappy posts, and i press the like button it will say NOBODY likes this', 'It\'s so cold outside, I actually saw a gangster pull his pants up.', 'A gift card is a great way to say, Go buy your own fucking present', 'Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ships kitchen', 'Lazy People Fact #5812672793, You were too lazy to read that number', 'My favourite exercise is a cross between a lunge and a crunch. Its called Lunch.', 'I have the heart of a lion. And a lifetime ban from the zoo.', 'Old ladies in wheelchairs with blankets over their legs? I don’t think so… retired mermaids.', 'Years ago I used to supply filing cabinets for the mafia. Yes, I was involved in very organised crime', 'If you are being chased by a police dog, try not to go through a tunnel, then on to a little see-saw, then jump through a hoop of fire. They are trained for that', 'I named my hard drive "dat ass" so once a month my computer asks if I want to back dat ass up', 'Relationships are a lot like algebra. Have you ever looked at your X and wondered Y?', 'I swear to drunk Im not God, but seriously, stay in drugs, eat school, and dont do vegetables.', 'You haven\'t experienced awkward until you try to tickle someone who isn\'t ticklish', 'Maybe if we all emailed the constitution to each other, the NSA will finally read it', 'Whatever you do in life, always give 100%. Unless you are donating blood...', 'It is all shits and giggles until someone giggles and shits!', 'I wonder if anyone has watched Storage Wars and said "hey thats my shit!"', 'I am naming my TV remote Waldo for obvious reasons', 'I hate when I am about to hug someone really sexy and my face hits the mirror', 'Telling a girl to calm down works about as well as trying to baptize a cat', 'Dating a single mother is like continuing from somebody else\'s saved game', 'If only God can judge us than Santa has some explaining to do', 'My vacuum cleaner broke. I put a Dallas Cowboys sticker on it, and now it sucks again', 'When the zombie apocalypse finally happens, I\'m moving to Washington D.C. I figure the lack of brains there will keep the undead masses away', 'Everyone\'s middle name should be "Goddamn". Try it. Doesnt it sound so great?', 'Before Instagram, I used to waste so much time sitting around having to imagine what my friends food looked like', 'The sad moment when you return to your shitty life after watching an awesome movie', 'A big shout out to sidewalks... Thanks for keeping me off the streets', 'Buying an electric car seems like a good idea until you hit a squirrel and flip over a few times', 'I named my dog "5 miles" so I can tell people I walk 5 miles every day', 'Your future depends on your dreams, so go to sleep', 'Yawning is your bodies way of saying 20% battery remaining', 'Dont you hate it when someone answers their own questions? I do', 'Paradise.'];
		text += jokes[Math.floor(Math.random() * jokes.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) {
			this.say(room, text);
			return;
		}

		if (!user.hasRank(room.id, '+')) {
			this.say(room, '/w ' + user.id + ', ' + text);
		}
	},

	gif: function (arg, user, room) {
		var text = '';
		var gifs = ['/addhtmlbox <center><img src="http://media2.giphy.com/media/u7hjTwuewz3Gw/giphy.gif" width=225 height=175/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/31c91db0b76d312b966c6adfe1c3940a/tumblr_nz57a2TvRC1u17v9ro1_540.gif" width=270 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/1gyIAEh.gif" width=380 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/RDtW8Gr.gif" width=222 height=200/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/qR77BXg.gif" width=250 height=225/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/2PZ8XUR.gif" width=385 height=216/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/451d21ddbde24e207a6f7ddd92206445/tumblr_inline_nt0ujvAJ8P1qjzu7m_500.gif" width=238 height=223/></center>', '/addhtmlbox <center><img src="http://www.keysmashblog.com/wp-content/uploads/2013/02/wig-snatching.gif" width=333 height=217/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/5f2015d7ba3f93f6c258e039d377287d/tumblr_inline_nn2r5c94m11qbxex9_500.gif" width=382 height=215/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/IFOqV6m.gif" width=387 height=218/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/hSv7KYd.gif" width=267 height=219/></center>'];
		text += gifs[Math.floor(Math.random() * gifs.length)];
		if (user.hasRank(room.id, '#')) {
			this.say(room, text);
		}
	},

	agif: 'animegif',
	animegif: function (arg, user, room) {
		{
			var text = '';
			var gifs = ['/addhtmlbox <center><img src="http://i.imgur.com/BzaMLzD.gif" width=345 height=194/> <br> Source: Fairy Tail</center>', '/addhtmlbox <center><img src="http://i.imgur.com/2qzxwG4.gif" width=345 height=195/> <br> Source: Toradora</center>', '/addhtmlbox <center><img src="http://i.imgur.com/BjAbTzB.gif" width=222 height=192/> <br> Source: Daily Lives of High School Boys</center>', '/addhtmlbox <center><img src="http://i.imgur.com/ys6IrQs.gif" width=267 height=191/> <br> Source:The World God Only Knows</center>', '/addhtmlbox <center><img src="http://i.imgur.com/IK4fVLX.gif" width=345 height=190/> <br> Source: Soul Eater</center>', '/addhtmlbox <center><img src="http://i.imgur.com/UE6AEZs.gif" width=353 height=196/> <br> Source: Gintama</center>', '/addhtmlbox <center><img src="http://i.imgur.com/sy6202O.gif" width=286 height=194/> <br> Source: YuriYuri</center>', '/addhtmlbox <center><img src="http://i.imgur.com/Bo1SjJX.gif" width=296 height=194/> <br> Source: Deadman Wonderland</center>', '/addhtmlbox <center><img src="http://i.imgur.com/KjTewQ7.gif" width=341 height=192/> <br> Source: Carnival Phantasm</center>', '/addhtmlbox <center><img src="http://i.imgur.com/RYaPwBT.gif" width=345 height=192/> <br> Source: Space Brothers</center>', '/addhtmlbox <center><img src="http://i.imgur.com/82lBuUf.gif" width=345 height=194/> <br> Source: Full Metal Alchemist: Brotherhood</center>', '/addhtmlbox <center><img src="http://media3.giphy.com/media/12dO0uYqeMVOy4/giphy.gif" width=260 height=195/> <br> Source: FLCL</center>', '/addhtmlbox <center><img src="https://66.media.tumblr.com/9f5d4e129f998f0c4358bf26a6d12a13/tumblr_nf0jxhnU9p1tyak95o1_500.gif" width=357 height=192/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://i.imgur.com/bYYRBiu.gif" width=286 height=194/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://pa1.narvii.com/5649/565e7d8046bd4b6223d153ce308086c42d06b773_hq.gif" width=385 height=190/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/14jigRRwHoGSo8/giphy.gif" width=342 height=192/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/LbvSbAz7CMmg8/giphy.gif" width=325 height=195/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="http://67.media.tumblr.com/ad16541d6ef3ee701c3308204574e0af/tumblr_nmd1mskOr91qam6y9o9_500.gif" width=450 height=195/> <br> Source: Kekkai Sensen</center>'];

			text += gifs[Math.floor(Math.random() * gifs.length)];
			if (user.hasRank(room.id, '#')) {
				this.say(room, text);
			}
		}
	},
	
	gift: 'present',
	present: function (arg, user, room) {
		var text = '';
		var presents = [' f-wa', ' gumwaa', ' A nice rubber red ball', ' 5 dolla, now beat it kid', ' a carton of eggnog!', '**Error 404:** You\'ve been vewy naughty :c', ' a Stonehenge! WHAT DOES IT MEAN?!', ' is another present!', ' not even a kiss', ' You thought I was going to get you something? LMAO', ' 1 trillion billion kazillion dollars! :o', ' my heart c: ', ' coal', ' The Sheep Lord\'s life supply of wool :0', ' *dies', ' Transmuter\'s beard!', ' lifetime supply of hoopla', ' a hug c:', ' Jingle Bjorn\'s password :OOOO', ' Randy ( ͡° ͜ʖ ͡°)', ' some waffles (>\'.\')>#', ' a box of CHOCOLATES!', ' the key to the underworld that gives you the chance to rule the world! muahahaha', ' a brand spanking new girlfriend... for 5 easy payments of $59.99 plusshippingandhandling', '. https://www.youtube.com/watch?v=lrAkb9AZ8Xg&feature=youtu.be', ' juan penny. :J', ' JOHN CENA *horns sound*', ' Lunarixis\' bottomless teapot', ' The magical mario mushroom!', ' The hammer of Tho', ' A bag full of sweg that belongs to... PPQ?', ' A banana (for scale)', ' A subsription to WWE SUUUPEEER SLAAAAM', ' a giant SHAD!', ' Phable\'s mixtape (Caution. May be hot.)', ' a [[jar of hearts]]', '  a terrifying creature appearing to be a blend of a cockroach and a mouse that was found by a nuclear testing site. Have fun! :D', '  Shame That\'s secret manga collection', ' Imagi\'s mmm... mmm.. good Tiramisu', ' a fistbump from Saitama! (Caution: You\'ll prolly die)', ' Spieky\'s homemade razor candy', ' a Lunarixis x Don\'t Lose fanfic', ' a copy of The Rick Ross **Certified Boss** Crossfit program', ' a Sir Vivor Fedora and fake moustache!', ' a copy of the Bon Dance audition tape for High School Musical', ' __urkerab__ serenading you with a lullaby u_u', ' DEEZ NUTCRACKERS', ' a picture of Oprah Winfrey', ' a paper hat', ' a signed copy of __Muting Zarzel__', ' some rubbing bacon', ' a rotten pancake... it looks... pink?', ' a CAP flyer from Zeonth', ' a single M&M', ' a Nintendo SIXTY FOOOUR', ' a Hawkie egg', ' an onion', ' a bowl of soup', ' two tickets to the Nuclear War Crazed Autocracy', ' a motivational poster featuring rssp1', ' a cheetah', ' a badly photoshopped picture of PPQ with huge muscles', ' a rigged dice', ' a breadstick', ' a pina colada caught in the rain, I hope you like it', ' a scooby snack', ' a WiiStation one', ' a Swirlyder action figure', ' a Gatorade', ' Don\'t Lose\'s Rae Sremmurd Christmas & Holiday Playlist', ' a Ditto that can only transform into a Castform', ' a life', ' the copy of Pokemon Sun and Pokemon Moon that you wish you had', ' an invitation to join Paradise\'s anime club. Sugio Kawaii Desu Desu!! (◕‿◕✿)', ' Sanjay\'s resignation letter', ' a half-eaten microwavable dinner', ' The self-destroying feeling of loneliness on christmas', ' a Dragonite plushie!', ' a Pikachu plushie!', ' one of Rainshaft\'s classified hosting files... shh...', ' full access to the complete Survivor Themes directory. Congratulations! :D', ' a pillow with ":P" embroidered on it', ' a paperweight with ":P" printed on it', ' a never-before-seen unofficial Survivor theme!', ' a large roll of tissue paper', ' a stack of lined binder paper', ' a playlist of good Vocaloid music :3', ' a backpack with a magic compartment', ' a ticket for one hour of viewing at the Pokemon Showdown! Survivor Chat Simulator', ' a ticket for one hour of being in the Pokemon Showdown! Survivor Chat Simulator :P', ' a letter of admission to the ultraexclusive Survivor Academy. Congratulations! :D', ' a letter of rejection from the ultraexclusive Survivor Academy :(', ' the elusive .rainshaft command... :P', ' all-terrain hiking boots', ' a long piece of invisible string', ' a pamphlet advertising the next UGM', ' a letter of expulsion from the ultraexclusive Survivor Academy :O', ' a portable kitchen counter, complete with stovetop and sink', ' a 5000-piece puzzle with two pieces missing', ' ten Zimbabwean dollars', ' an unopenable bottle of your favorite beverage', ' an oddly thick set of utensils', ' a pot with both handles on the same side', ' open-toed rainboots', ' a pencil shaped like a rectangular prism', 'a pair of Shadecession\'s signature sunglasses!', 'a bottle of vodka.'];
		text += 'Inside ' + arg + '\'s present is...' + presents[Math.floor(Math.random() * presents.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) {
			this.say(room, text);
			return;
		}
		if (!user.hasRank(room.id, '+')) {
			this.say(room, '/w ' + user.id + ', ' + text);
		}
	},

	hostqueue: 'queue',
	que: 'queue',
	q: 'queue',
	queue: function (arg, user, room) {
		if (!Games.canQueue) return;
		if (user.hasRank(room.id, '%') || (Config.canHost.indexOf(user.id) !== -1)) {
			if (Games.hosts.length === 0) {
				this.say(room, 'There are no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					let it = i == 0 ? '' : '__'
					queueText += '**' + (i + 1) + '.** ' + it + Games.hosts[i][0] + it + (Games.hosts[i][1].length ? ", " + Games.hosts[i][1] : "") + " "; //add formatting here, down there just adds on to the end whoops
				}
				this.say(room, '/announce **Queue:** ' + queueText);
			}
		} else {
			if (Games.hosts.length === 0 && room.id.charAt(0) !== ',') {
				this.say(room, '/w ' + user.id + ', There are currently no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					let it = i == 0 ? '' : '__'
					queueText += '**' + (i + 1) + '.** ' + it + Games.hosts[i] + it + ' ';
				}
				if (room.id.charAt(0) === ',') this.say(room, '/announce **Queue:** ' + queueText);
				if (room.id.charAt(0) !== ',') this.say(room, '/w ' + user.id + ', /announce **Queue:** ' + queueText);
			}
		}
		Games.canQueue = false;
		var t = setTimeout(function () {
			Games.canQueue = true;
		}, 5 * 1000);
	},

	pick: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let stuff = target.split(",");
		let str = "<em>We randomly picked:</em> " + Tools.sample(stuff).replace(/>/g, "&gt;").replace(/</g, "&lt;").trim();
		if (room.id === 'survivor') {
			this.say(room, "/addhtmlbox " + str);
		} else {
			this.say(room, "!htmlbox " + str);
		}
	},

	shuffle: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;

		function shuffle(array) {
			for (let i = array.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
				[array[i], array[j]] = [array[j], array[i]]; // swap elements
			}
		}
		let stuff = target.split(",");
		shuffle(stuff)
		let str = "<i>" + stuff.join(', ').replace(/>/g, "&gt;").replace(/</g, "&lt;").trim() + "</i>";
		if (room.id === 'survivor') {
			this.say(room, "/addhtmlbox " + str);
		} else {
			this.say(room, "!htmlbox " + str);
		}
	},

	timer: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		if (target === "end") {
			if (Games.isTimer) {
				clearTimeout(Games.timeout);
				this.say(room, "The timer has been ended.");
				Games.isTimer = false;
			} else {
				this.say(room, "There is no timer running!");
			}
			return;
		}
		let x = parseFloat(target);
		if (!x || x > 300 || (x < 10 && x > 5) || x <= 0) return this.say(room, "The timer must be between 10 seconds and 5 minutes.");
		if (x < 10) x *= 60;
		let minutes = Math.floor(x / 60);
		let seconds = x % 60;
		clearTimeout(Games.timeout);
		this.say(room, "Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		Games.timeout = setTimeout(() => Games.timer(room, user), x * 1000);
		Games.isTimer = true;
	},

	weak: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let types = ["normal", "fire", "water", "grass", "steel", "psychic", "ghost", "dark", "bug", "poison", "ground", "rock", "dragon", "ice", "fairy", "fighting", "flying", "electric"];
		if (target.endsWith('type')) {
			target = target.substr(0, target.length - 4);
		}
		if (types.indexOf(target) !== -1) {
			this.say(room, "!weak " + target);
		} else {
			this.say(room, "Please enter a valid type.");
		}
	},

	ar: 'allowroll',
	allowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1) && (!Games.host || Games.host.id !== user.id)) return;
		if (!target) return;
		let split = target.split(",");
		let goodnames = [],
			badnames = [],
			alreadynames = [];
		let i;
		for (i = 0; i < split.length && Games.excepted.length < 2; i++) {
			let user = Users.get(Tools.toId(split[i]));
			if (!user) continue;
			if (user.hasRank(room.id, '+')) {
				alreadynames.push(user.name);
				continue;
			}
			goodnames.push(user.name);
			Games.excepted.push(user.id);
		}
		for (; i < split.length; i++) {
			let user = Users.get(Tools.toId(split[i]));
			if (!user);
			badnames.push(user.name);
		}
		if (goodnames.length > 0 && badnames.length > 0) {
			this.say(room, goodnames.join(", ") + " " + (goodnames.length > 1 ? 'were' : 'was') + " allowed a roll! Unfortunately, " + badnames.join(", ") + " could not be added, since only 2 users can be allowed at a time.");
		} else if (goodnames.length > 0) {
			this.say(room, goodnames.join(", ") + " " + (goodnames.length > 1 ? 'were' : 'was') + " allowed a roll!");
		} else if (badnames.length > 0) {
			this.say(room, "Unfortunately, " + badnames.join(", ") + " could not be added, since only 2 users can be allowed at a time.");
		}
		if (alreadynames.length > 0) {
			this.say(room, alreadynames.join(", ") + " could not be given a roll, since they already have access to the command.");
		}
	},
	
	clearallowrolls: 'clearallowroll',
	clearallowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (!Games.host || Games.host.id !== user.id)) return;
		Games.excepted = [];
		room.say("Rolls have been cleared");
	},
	
	oldroll: function (target, user, room) {
		let realtarget = target;
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) {
			let index = Games.excepted.indexOf(user.id);
			if (index === -1) return;
			Games.excepted.splice(index, 1);
		}
		let plusIndex = target.indexOf("+");
		let adder = 0;
		if (plusIndex !== -1) {
			adder = parseInt(target.substr(plusIndex + 1));
			let str = adder.toString();
			if (str.length !== (target.substr(plusIndex + 1)).length) return;
			if (!adder) return;
			target = target.substr(0, plusIndex);
		}
		let dIndex = target.indexOf("d");
		let numDice = 1;
		let roll;
		if (dIndex !== -1) {
			numDice = parseInt(target.substr(0, dIndex));;
			if (!numDice) return;
			roll = parseInt(target.substr(dIndex + 1));
			if (!roll) roll = 100;
		} else {
			roll = parseInt(target);
			if (!roll) roll = 100;
		}
		if (numDice > 40) this.say("The number of dice rolled must be a natural number up to 40.");
		if (roll > 1000000000) this.say("The maximum roll is allowed is 1000000000.");
		let rolls = [];
		let sum = adder || 0;
		for (let i = 0; i < numDice; i++) {
			rolls.push(Tools.random(roll) + 1);
			sum += rolls[i];
		}
		if (numDice === 1) {
			let str = "Roll (1 - " + roll + ")" + (adder ? "+" + adder : "") + ": " + sum;
			if (room.id === 'survivor') {
				this.say(room, "/addhtmlbox " + str);
			} else {
				this.say(room, "!htmlbox " + str);
			}
		} else {
			let str = numDice + " Rolls (1 - " + roll + "): " + rolls.join(", ") + "<br></br>" + "Sum: " + sum;
			if (room.id === 'survivor') {
				this.say(room, "/addhtmlbox " + str);
			} else {
				this.say(room, "!htmlbox " + str);
			}
		}
	},
	
	r: 'dice',
	roll: 'dice',
	dice: function (arg, user, room) {
		// Permission check
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) {
			let index = Games.excepted.indexOf(user.id);
			if (index === -1) return;
			Games.excepted.splice(index, 1);
		}
		let roll = arg.toString().split("//")[0]; // text after // is ignored

		if (!roll) roll = "100"; // blank .r gives d100

		// Find the index of the first addition or subtraction
		let add = roll.indexOf("+");
		let sub = roll.indexOf("-");
		let index = -1;
		if (add > sub) {
			if (sub !== -1) index = sub;
			else index = add;
		}
		if (sub > add) {
			if (add !== -1) index = add;
			else index = sub;
		}

		// Split between rolls and flat number additions
		let addition = index == -1 ? false : roll.substring(index);
		if (index !== -1) roll = roll.substring(0, index);

		// Split and check for XdY format
		roll = roll.split("d");
		if (roll.length > 2) return room.say("Invalid dice format.");
		let dice = roll[0];
		let faces = roll[1];
		if (roll.length === 1) { // No "d" is found so the roll is just a single number
			faces = roll[0];
			dice = "1";
		} else { // Fills in XdY with defaults if only X or Y is given
			if (!dice) dice = "1";
			if (!faces) faces = "100";
		}

		dice = parseInt(dice);
		faces = parseInt(faces);
		if (isNaN(dice) || isNaN(faces)) return room.say("Invalid dice format."); // X and Y in XdY must be numbers
		if (dice > 40) return room.say("The number of dice rolled must be a natural number up to 40."); // Too many dice is bad
		if (faces > 1000000000) return room.say("The maximum roll is allowed is 1000000000."); // Too big a dice is bad
		let rolls = [];
		let total = 0;
		for (let i = 0; i < dice; i++) { // Do rolls
			let roll = Math.floor(Math.random() * faces) + 1;
			rolls.push(roll);
			total += roll;
		}
		let addit = 0;
		if (addition) { // This adds all additions together so 1d100+1+2+6+3 is parsed as 1d100+12
			addition = addition.split(''); // Char by char split
			let cur = addition.shift();
			let cv = ""; // cv is where we store the current number
			for (let ch of addition) {
				if (ch === "+" || ch === "-") { // there shouldn't be 2 +/- in sequence. eg 1d100++12 is a bad format
					if (!cv) return room.say("Invalid dice format.");
					cv = parseInt(cv);
					if (isNaN(cv)) return room.say("Invalid dice format.");
					if (cur === "+") addit += cv;
					else addit -= cv;
					cv = "";
					cur = ch;
					continue;
				}
				if ("0123456789".indexOf(ch) !== -1) { // if the character is a number, add it to the current value
					cv += ch;
					continue;
				}
				if (ch === " ") continue; // ignore spaces
				return room.say("Invalid dice format."); // It's not a number, +/-, or a space, so it's wrong
			}

			if (!cv) return room.say("Invalid dice format."); // Don't end additions with + or -
			cv = parseInt(cv);
			if (isNaN(cv)) return room.say("Invalid dice format.");
			if (cur === "+") addit += cv;
			else addit -= cv;
			total += addit; // add the whole thing to the total
		}
		let ret = `Roll (1 - ${faces})${addit !== 0 ? (addit < 0 ? " -" : " +") + " " + Math.abs(addit) : ""}: ${total}`;
		if (dice > 1) {
			ret = `${dice} Rolls (1 - ${faces}): ${rolls.join(', ')}<br>Sum${addit !== 0 ? (addit < 0 ? " - " : " + ") + Math.abs(addit) : ""}: ${total}`;
		}
		this.say(room, `/addhtmlbox ${ret}`);
	},

	join: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		this.say(room, '/join ' + arg);
	},

	signups: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let id = Tools.toId(target);
		//if (id === 'ftl' || id === 'followtheleader') return room.say("Follow the Leader is currently down for repairs.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
		room.say("/modnote HOST: " + user.name + " started signups of " + room.game.name + ".");
	},
	
	forcesignups: function (target, user, room) {
		if (!user.hasRank(room.id, '#')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let id = Tools.toId(target);
		Games.lastGameTime = false;
		if (!Games.createGame(target, room)) return;
		room.game.signups();
		room.say("/modnote " + user.name + " forcibly started signups of " + room.game.name + ".");
	},
	
	randgame: "randomgame",
	randomgame: function (arg, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(Games.host.name + " is hosting a game.");
		if (room.game) return room.say("A game of " + room.game.name + " is in progress.");
		let goodids = Object.keys(Games.games).slice();
		goodids = goodids.concat(Object.keys(Games.aliases));
		let id = Tools.sample(goodids);
		Games.createGame(id, room);
		while (room.game.baseId === Games.lastGame || id === 'ssb' || id === 'supersurvivorbros') {
			id = Tools.sample(goodids);
			Games.createGame(id, room);
		}
		console.log(id);
		room.game.signups();
		room.say("/modnote HOST: " + user.name + " started a random game of " + room.game.name + ".");
	},

	endgame: 'end',
	end: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!room.game) {
			if (Games.host) {
				Games.host = null;
				this.say(room, 'The game was forcibly ended.');
				this.say(room, '/modnote ' + user.name + ' ended a game.');
			}
			return;
		}
		room.game.forceEnd();
	},

	submit: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return;
		this.say(room, 'Visit  https://goo.gl/forms/1hqFg6tR41VxVCSK2 to submit any gift, gifs, roasts or jokes! Add as many as you like!');
	},

	startgame: 'start',
	start: function (target, user, room) {
		if (!user.hasRank(room.id, '+') || !room.game) return;
		if (typeof room.game.start === 'function') room.game.start();
	},
	
	mk: 'modkill',
	modkill: function (target, user, room) {
		let text = "A modkill (or mk) occurs when a player does not provide an action and so they are eliminated";
		if (user.hasRank(room.id, '+')) {
			room.say(text);
		} else {
			user.say(text);
		}
	},

	roast: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let msg = Tools.sample(roasts).replace(`[USER]`, target.trim());
		if (msg.startsWith("/")) {
			msg = "/" + msg;
		}
		if (msg.startsWith("!")) {
			msg = "[[]]" + msg;
		}
		this.say(room, msg);
	},
	
	addroast: function (target, user, room) {
		if (!user.hasRank(room.id, '%')) return;
		if (!toId(target)) return this.say(user, "Usage: ``.addroast [text]``");
		if (roasts.includes(target.trim())) return this.say(user, "Roast already exists.");
		roasts.push(target.trim());
		require('fs').writeFileSync('./commands/roasts.json', JSON.stringify(roasts, null, 4));
		this.say(Rooms.get('survivor'), '/modnote roast added by ' + user.id + ': ' + target.trim());
		return this.say(user, 'Roast added.');
	},
	
	use: function (target, user, room) {
		if (!room.game) return;
		if (typeof room.game.use === 'function') room.game.use(target, user);
	},

	apts: 'addpoints',
	apt: 'addpoints',
	addpoints: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		return user.say('.addpoints is no longer used.');
		let split = (target.indexOf(',') === -1 ? target.split("|") : target.split(","));
		if (split.length < 4) return room.say("You have to specify the host, winner, second place, and at least one participant");
		dd.addHost(split[0]);
		dd.addFirst(split[1]);
		dd.addSecond(split[2]);
		let names = []
		for (let i = 3; i < split.length; i++) {
			dd.addPart(split[i]);
			names.push(split[i].trim());
		}
		room.say("First place awarded to: **" + split[1].trim() + "**. Second place awarded to: **" + split[2].trim() + "**. Host points awarded to: **" + split[0].trim() + "**.");
		room.say("Participation points awarded to: **" + names.join(", ") + "**.");
		dd.updateModlog(user.name + " did .addpoints " + target);
		dd.updateModlog("First place awarded to: **" + split[1].trim() + "**. Second place awarded to: **" + split[2].trim() + "**. Host points awarded to: **" + split[0].trim() + "**.");
		dd.updateModlog("Participation points awarded to: **" + names.join(", ") + "**.");
	},

	addspecial: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of points and the user to add them to.");
		let username = split[0].trim();
		let numPoints = parseInt(split[1]);
		if (!numPoints) return user.say("'" + split[1] + "' is not a valid number of points to add.");
		dd.addpoints(username, numPoints);
		let modlogEntry = {
			command: "addspecial",
			user: user.id,
			points: [numPoints, username],
			first: false,
			second: false,
			host: false,
			part: false,
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + numPoints + "** have been added to **" + username.trim() + "** on the leaderboard.");
	},

	addpointsbot: 'addbot',
	addbot: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 2) return user.say("You must specify the number of players, followed by the winner and runner-up.");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length < 3 && numPlayers > 6) return user.say("Please also specify the runner up for games with 7+ players.");
		let first = split[1].trim();
		let firstpoints = 0;
		let secondpoints = 0;
		if (numPlayers < 7) {
			return user.say("Bot hosted games with at least 7 players are worth points.");
		} else if (numPlayers < 10) {
			firstpoints = 3;
			secondpoints = 1;
		} else if (numPlayers >= 10) {
			firstpoints = 5;
			secondpoints = 2;
		}
		dd.addpoints(first, firstpoints);
		let second = split[2].trim();
		dd.addpoints(second, secondpoints);
		for (let i = 0; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addbot",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: false,
			part: false,
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		return user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
	},

	rpoints: function (arg, user, room) {
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let last = dd.modlog.data.pop();
		if (last.first) {
			dd.remPoints(last.first[1], last.first[0]);
			gamecount.add(last.first[1], -1);
		}
		if (last.second) {
			dd.remPoints(last.second[1], last.second[0]);
			gamecount.add(last.second[1], -1);
		}
		if (last.host) {
			dd.remPoints(last.host[1], last.host[0]);
			hostcount.add(last.host[1], -1);
			gamecount.add(last.host[1], -1);
		}
		if (last.part) {
			let points = last.part.shift();
			for (let i of last.part) {
				dd.remPoints(i, points);
				gamecount.add(i, -1);
			}
		}
		if (last.special) dd.remPoints(last.special[1], last.special[0]);
		user.say('Point award reverted.');
	},
	
	addpointsuser: 'adduser',
	adduser: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the rest of the players.");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length < 4 && numPlayers >= 6) return user.say("Please also specify the runner up and participants for games with 6+ players.");
		if (split.length < 5 && numPlayers >= 6) return user.say("Please mention all players who took part for games with 7+ players.")
		if (numPlayers >= 6 && split.length != numPlayers + 2) return user.say("Please check the number of players.")
		let host = split[1].trim();
		if (numPlayers >= 4) hostcount.add(host, 1);
		let first = split[2].trim();
		let hostpoints = 0;
		let firstpoints = 0;
		let secondpoints = 0;
		let partpoints = 0;
		if (numPlayers < 4) {
			return user.say("User hosted games with at least 4 players are worth points.");
		} else if (numPlayers < 6) {
			hostpoints = 2;
			firstpoints = 2;
			dd.addpoints(host, hostpoints);
			
			dd.addpoints(first, firstpoints);
			let modlogEntry = {
				command: "adduser",
				user: user.id,
				first: [firstpoints, first],
				second: false,
				host: [hostpoints, host],
				part: false,
				date: Date.now()
			};
			dd.updateModlog(modlogEntry);
			for (let i = 1; i < split.length; i++) {
				gamecount.add(split[i], 1);
			}
			user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
			return user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		} else if (numPlayers < 10) {
			hostpoints = 3;
			firstpoints = 5;
			secondpoints = 2;
			partpoints = 1;
		} else if (numPlayers < 13) {
			hostpoints = 6;
			firstpoints = 9;
			secondpoints = 5;
			partpoints = 2;
		} else if (numPlayers < 16) {
			hostpoints = 8;
			firstpoints = 12;
			secondpoints = 7;
			partpoints = 3;
		} else if (numPlayers >= 16) {
			hostpoints = 11;
			firstpoints = 15;
			secondpoints = 10;
			partpoints = 4;
		}
		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		let second = split[3].trim();
		dd.addpoints(second, secondpoints);
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				if (numPlayers < 6) partlist = second.trim() + ", " + part.trim();
				else partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "adduser",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		if (partpoints !== 0) return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},

	addpointsofficial: 'addfish',
	addfish: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the remaining players");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length != numPlayers + 2) return user.say("Please check the number of players.");
		let host = split[1].trim();
		if (numPlayers >= 6) hostcount.add(host, 1);
		let first = split[2].trim();
		let second = split[3].trim();
		let hostpoints = 0;
		let firstpoints = 0;
		let secondpoints = 0;
		let partpoints = 0;
		if (numPlayers < 6) {
			return user.say("Official games with at least 6 players are worth points.");
		} else if (numPlayers < 10) {
			hostpoints = 6;
			firstpoints = 10;
			secondpoints = 6;
			partpoints = 3;
		} else if (numPlayers < 13) {
			hostpoints = 8;
			firstpoints = 13;
			secondpoints = 8;
			partpoints = 4;
		} else if (numPlayers < 16) {
			hostpoints = 10;
			firstpoints = 16;
			secondpoints = 10;
			partpoints = 5;
		} else if (numPlayers >= 16) {
			hostpoints = 12;
			firstpoints = 20;
			secondpoints = 12;
			partpoints = 6;
		}
		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		dd.addpoints(second, secondpoints);
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				if (numPlayers < 6) partlist = second.trim() + ", " + part.trim();
				else partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		if (numPlayers >= 6) user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addfish",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},
	
	addpointssurvivorshowdown: 'addss',
	addss: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 3) return user.say("You must specify the number of players, followed by the host, the winner, the runner-up and the remaining players");
		let numPlayers = parseInt(split[0]);
		if (!numPlayers) return user.say("'" + split[0] + "' is not a valid number of players.");
		if (split.length != numPlayers + 2) return user.say("Please check the number of players.");
		let host = split[1].trim();
		hostcount.add(host, 1);
		let first = split[2].trim();
		let second = split[3].trim();
		let hostpoints = 8;
		let firstpoints = 15;
		let secondpoints = 10;
		let partpoints = 3;
		let partlist = '';
		dd.addpoints(host, hostpoints);
		dd.addpoints(first, firstpoints);
		dd.addpoints(second, secondpoints);
		for (let i = 4; i < split.length; i++) {
			let part = split[i];
			dd.addpoints(part, partpoints);
			if (i == 4) {
				if (numPlayers < 6) partlist = second.trim() + ", " + part.trim();
				else partlist = part.trim()
			} else if (i == split.length - 1) partlist += " and " + part.trim();
			else partlist += ", " + part.trim();
		}
		user.say("**" + hostpoints + "** have been added to **" + host.trim() + "** on the leaderboard.");
		user.say("**" + firstpoints + "** have been added to **" + first.trim() + "** on the leaderboard.");
		user.say("**" + secondpoints + "** have been added to **" + second.trim() + "** on the leaderboard.");
		for (let i = 1; i < split.length; i++) {
			gamecount.add(split[i], 1);
		}
		let modlogEntry = {
			command: "addss",
			user: user.id,
			first: [firstpoints, first],
			second: [secondpoints, second],
			host: [hostpoints, host],
			part: [partpoints].concat(split.slice(4)),
			date: Date.now()
		};
		dd.updateModlog(modlogEntry);
		return user.say("**" + partpoints + "** each have been added to **" + partlist + "** on the leaderboard.");
	},
	
	pointlog: function (arg, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		let data = dd.modlog.data.reverse();
		if (!data.length) return user.say("There are no recorded point log actions.");
		let args = arg.split(',');
		let full = toId(args[0]) === "full";
		if (!full && args.length > 1) full = toId(args[1]) === "full";
		let search = false;
		if (args[0] && args[0] !== "full") search = args.map(x => toId(x));
		else if (args[1] && args[1] !== "full") search = args.slice(1).map(x => toId(x));
		let units = [];
		let conv = {
			"adduser": "User",
			"addbot": "Bot",
			"addspecial": "Special",
			"addfish": "Official"
		}
		let ret = [''];
		let n = 0;
		if (!full && data.length > 100) ret[n] += "Only showing the last 100 results. To view the full point log use <code>.pointlog full</code>";
		for (let i of data) {
			if (units.length === 100 && !full) break;
			let searchstr = `${toId(i.command)} ${toId(conv[i.command])} ${toId(i.user)}`;
			if (i.command === "addspecial") {
				searchstr += ` ${i.points[1]}`;
			} else {
				if (i.host) searchstr += ` ${toId(i.host[1])}`;
				if (i.first) searchstr += ` ${toId(i.first[1])}`;
				if (i.second) searchstr += ` ${toId(i.second[1])}`;
				if (i.part)
					for (let nom of i.part.slice(1)) searchstr += ` ${toId(nom)}`;
			}
			if (search) {
				let found = false;
				for (let cue of search) {
					if (!searchstr.includes(cue)) found = true;
				}
				if (found) continue;
			}

			let date = new Date(i.date);
			date = `[${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}]`;

			let unit = `<details><summary><b>${conv[i.command]}</b> by ${i.user}</summary>`;
			unit += `${date}<br>`;
			if (i.command === "addspecial") {
				unit += `User (${i.points[0]}): <i>${i.points[1]}</i>`;
			} else {
				if (i.host) unit += `Host (${i.host[0]}): <i>${i.host[1]}</i><br>`;
				if (i.first) unit += `First (${i.first[0]}): <i>${i.first[1]}</i><br>`;
				if (i.second) unit += `Second (${i.second[0]}): <i>${i.second[1]}</i><br>`;
				if (i.part) unit += `Participation (${i.part[0]}): <i>${i.part.slice(1).join(', ')}</i><br>`;
			}
			unit += `</details>`
			units.push(unit);
		}
		dd.modlog.data.reverse();
		for (let i of units) {
			if (ret[n].length + i.length <= 100000) ret[n] += i;
			else {
				n += 1;
				ret[n] = '';
				ret[n] += i;
			}
		}
		for (let i of ret) Rooms.get('survivor').say(`/pminfobox ${user.id}, ${i}`);
	},

	settextcolor: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.settextcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the text color of **" + username.trim() + "**, on the leaderboard.");
	},

	setbgcolor: function (target, user, room) {
		if (!target) return user.say("No target found :" + target);
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must enter the user and the hex code of the colour you want.");
		let username = split[0];
		let hexcolor = split[1].trim();
		if (hexcolor.length !== 6 || isNaN(Number('0x' + hexcolor))) return user.say("'" + split[1] + "' is not a valid hex color code.");
		dd.setbgcolor(username, hexcolor);
		return user.say("**" + hexcolor + "** has been set as the background color of **" + username.trim() + "**, on the leaderboard.");
	},

	remspecial: 'removespecial',
	removespecial: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of points and the user to remove them from.");
		let username = split[0];
		let numPoints = parseInt(split[1]);
		if (!numPoints) return user.say("'" + split[1] + "' is not a valid number of points to remove.");
		dd.remPoints(username, numPoints);
		return user.say("**" + numPoints + "** have been removed from **" + username.trim() + "** on the leaderboard.");
	},

	authhunt: function (target, user, room) {
		let split = target.split(",");
		if (split[0].toLowerCase() == 'status') {
			// return status of past battles won/lost
			return user.say(dd.authhunt_status(user.id));
		}
		if (split[0].toLowerCase() == 'help') {
			// return available commands
			user.say("``.authhunt status``: See status of battles recorded");
			if (!user.hasRank('survivor', '+')) return user.say("and ``.authhunt help``:To see a list of available commands.");
			user.say("``.authhunt list``: List of challengers fought");
			if (user.hasRank('survivor', '@')) {
				user.say("``.authhunt clearallrecords``: To clear all records for a new event.");
				user.say("``.authhunt addpoints``: To add points to LB and clear the auth hunt records after adding them.")
			}
			return user.say("``.authhunt <challenger>, <winner>``: To record the result of a battle.");
		}
		if (!user.hasRank('survivor', '+')) return;
		if (split[0].toLowerCase() == 'list') {
			// return list of battle challenges completed
			return user.say(dd.authhunt_getlist(user.id));
		}
		if (split[0].toLowerCase() == 'clearallrecords' && user.hasRank('survivor', '@')) {
			// clear records for new authhunt event
			dd.clear_authhunt_records();
			return user.say('successful!');
		}
		if (split[0].toLowerCase() == 'addpoints' && user.hasRank('survivor', '@')) {
			// clear records for new authhunt event
			dd.add_authunt_points();
			dd.clear_authhunt_records();
			return user.say('successful!');
		}
		if (split.length < 2) return user.say("Use ``.authhunt help`` to see available commands.")
		if (split.length != 2) return user.say("Please use the command as: ``.authunt challenger, winner`` or use ``.authhunt help``");
		let challenger = Tools.toId(split[0]);
		let winner = Tools.toId(split[1]);
		if (challenger == user.id) return user.say("You can't challenge yourself!");
		if (winner != challenger && winner != user.id) return user.say("Winner must be either yourself or the challenger!");
		let success = dd.authhunt_battle(user.id, challenger, winner);
		if (success) return user.say("Recorded successfully!");
		else return user.say("Already recorded, can't overright");
	},

	ddlog: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		if (!("data" in dd.modlog)) return;
		let buffer = '';
		for (let i = 0; i < dd.modlog.data.length; i++) {
			buffer += dd.modlog.data[i] + '\n';
		}
		Tools.uploadToHastebin(buffer, (success, link) => {
			if (success) user.say(link);
			else user.say('Error connecting to hastebin.');
		});
	},

	testroom: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		Rooms.get('survivor').say("/subroomgroupchat testing");
		Rooms.get('survivor').say("/join groupchat-survivor-testing");
		room.say("<<groupchat-survivor-testing>> to test stuff!");
	},
	
	psevent: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let args = arg.split(',');
		if (toId(args[0]) === "add") {
			Rooms.get('survivor').say('/events add ' + args.slice(1).join(','));
		} else if (toId(args[0]) === "remove") {
			Rooms.get('survivor').say('/events remove ' + args.slice(1).join(','));
		} else return room.say('Usage: ``.psevent [add/remove], [details]`` (check ``/events help`` for more info)');
	},
	
	ddoverall: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let sorted = dd.getSorted();
		let longestLength = 0;
		let numTabsSpaces = 8.0;
		for (let i = 0; i < sorted.length; i++) {
			let length = sorted[i][5].length;
			if (length > longestLength) longestLength = length;
		}
		let numTabs = Math.ceil(longestLength / numTabsSpaces);
		let sep = "";
		for (let i = 0; i < longestLength; i += numTabsSpaces) {
			sep += "\t";
		}
		let buffer = "Rank\tName" + sep + "Firsts\tSeconds\tParts\tHosts\tSpecial\tPoints\t\n";
		let real = [5, 1, 2, 3, 0, 4];
		for (let i = 0; i < sorted.length; i++) {
			for (let j = 0; j < 8; j++) {
				let stuff;
				if (j === 0) stuff = i + 1;
				else if (j === 7) stuff = dd.getPoints(sorted[i]);
				else stuff = sorted[i][real[j - 1]];
				buffer += stuff;
				if (j === 1) {
					let numCursTabs = numTabs - Math.ceil(sorted[i][real[j - 1]].length / numTabsSpaces);
					for (let l = 0; l < numCursTabs + (sorted[i][5].length % 8 === 0 ? 0 : 1); l++) {
						buffer += "\t";
					}
				} else {
					buffer += "\t";
				}
			}
			buffer += "\n";
		}
		Tools.uploadToHastebin(buffer, (success, link) => {
			if (success) room.say(link);
			else user.say('Error connecting to hastebin.');
		});
	},

	chatlines: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let split = target.split(',');
		let numDays = parseInt(split[1]);
		if (!numDays) numDays = 7;
		let targetID = Tools.toId(split[0]);
		if (!(targetID in chatmes)) return user.say("**" + split[0] + "** has never said anything in chat.");
		let messages = chatmes[targetID].messages;
		let targetName = chatmes[targetID].name;
		let lines = {};

		function getDayInfo(daysPrevious) {
			let today = new Date();
			let curDay = today.getDate();
			let curYear = today.getFullYear();
			let curMonth = today.getMonth();
			let isLeapYear = (curYear % 4 === 0 && (curYear % 100 !== 0 || curYear % 400 === 0));
			let numMonthsDays = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			for (let i = 0; i < daysPrevious; i++) {
				curDay--;
				if (curDay === 0) {
					curMonth--;
					if (curMonth < 0) {
						curMonth = 11;
						curYear--;
					}
					curDay = numMonthsDays[curMonth];
				}
			}
			return [curDay, curMonth, curYear];
		}
		let overallstr = targetName + " Chat Lines:\n";
		for (let i = numDays; i >= 0; i--) {
			let dayInfo = getDayInfo(i);
			let str = (dayInfo[1] >= 9 ? "" : "0") + (dayInfo[1] + 1) + "-" + (dayInfo[0] > 9 ? "" : "0") + (dayInfo[0]) + "-" + dayInfo[2];
			lines[str] = 0;
			for (let i = 0; i < messages.length; i++) {
				let message = messages[i];
				if (message.day === dayInfo[0] && message.month === dayInfo[1] && message.year === dayInfo[2]) lines[str]++;
			}
			overallstr += str + ": " + lines[str] + "\n";
		}
		Tools.uploadToHastebin(overallstr, (success, link) => {
			if (success) room.say("**" + targetName + "'s** chat line count:" + link);
			else user.say('Error connecting to hastebin.');
		});
	},

	testlb: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		if (!user.hasRank('survivor', '%')) return user.say('Access denied for staff only command.');
		let isempty = true;
		let sorted = dd.getSorted();
		let num = parseInt(target);
		if (!num || num < 1) num = 50;
		if (num > sorted.length) num = sorted.length;
		let str = "<div><table align=\"center\" border=\"2\"><tr>";
		let indices = ["Rank", "Name", "Points", "Games", "Hosts"];
		for (let i = 0; i < indices.length; i++) {
			str += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
		}
		str += "</tr>";

		let res = [];
		for (let i = 0; i < sorted.length; i++) {
			let cur = sorted[i][1];
			let points = dd.getPoints(sorted[i]);
			if (points === 0) continue;
			let h = hostcount.count[toId(cur)] ? hostcount.count[toId(cur)] : 0;
			let n = gamecount.count[toId(cur)];
			if (!n) n = "Error";

			points = Math.floor(100 * (points/n) * ((n*n)/(n*n+30)) + ((h*h+300)/300));

			res.push([
				cur,
				points,
				n,
				h
			]);
		}

		res.sort((a, b) => {
			return b[1] - a[1];
		})

		let strs = [];
		for (let i = Math.max(0, num - 50); i < num; i++) {
			if (!res[i]) continue;
			let strx = "<tr>";
			strx += "<td height=\"30px\"; align=\"center\"><b>" + (i+1) + "</b></td>";
			for (let j of res[i]) {
				strx += "<td height=\"30px\"; align=\"center\"><b>" + j + "</b></td>";
			}
			strs.push(strx + "</tr>");
		}
		str += strs.join("");
		str += "</table></div>";
		if (room.id === user.id) {
			Parse.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, lb, ${str}`);
		}
		else {
			Parse.say(room, `/addhtmlbox ${str}`);
		}
		let numFirsts = 0;
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
		}
	},
	
	lb: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		let isempty = true;
		let sorted = dd.getSorted();
		let num = parseInt(target);
		if (!num || num < 1) num = 50;
		if (num > sorted.length) num = sorted.length;
		if (room.id === user.id) {
			let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div><table align=\"center\" border=\"2\"><tr>";
			let indices = ["Rank", "Name", "Points"];
			for (let i = 0; i < 3; i++) {
				str += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
			}
			str += "</tr>"
			let strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < 3; j++) {
					let stuff;
					if (j === 0) stuff = i + 1;
					else if (j === 1) stuff = sorted[i][1].replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
					else stuff = dd.getPoints(sorted[i]);
					strx += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + stuff + "</font></b></td>";
				}
				strs.push(strx + "</tr>");
			}
			str += strs.join("");
			str += "</table></div></div>";
			Parse.say(Rooms.get('survivor'), '/pminfobox ' + user.id + ", " + str);
		} else {
			let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div><table align=\"center\" border=\"2\"><tr>";
			let indices = ["Rank", "Name", "Points"];
			for (let i = 0; i < indices.length; i++) {
				str += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
			}
			str += "</tr>"
			let real = [1, 0];
			let strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				let bgcolor = dd.getBgColor(sorted[i]);
				let textcolor = dd.getTextColor(sorted[i]);
				for (let j = 0; j < indices.length; j++) {
					let stuff;
					if (j === 0) {
						stuff = i + 1;
					} else if (j === (indices.length - 1)) {
						stuff = dd.getPoints(sorted[i]);
					} else {
						console.log(sorted[i][j - 1]);
						stuff = sorted[i][real[j - 1]].replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
					}
					strx += "<td style=background-color:" + bgcolor + "; height=\"30px\"; align=\"center\"><b><font color=" + textcolor + ">" + stuff + "</font></b></td>";
				}
				strs.push(strx + "</tr>");
			}
			str += strs.join("");
			str += "</table></div></div>";
			if (room.id === 'survivor') {
				Parse.say(room, "/addhtmlbox " + str);
			} else {
				Parse.say(room, "!htmlbox " + str);
			}
		}
		let numFirsts = 0;
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
		}
	},

	rename: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		if (split.length < 2) return user.say("You must specify an old and new username");
		let realt = Tools.toId(split[0])
		if (!(realt in dd.dd)) {
			return user.say("**" + split[0] + "** is not on the dd leaderboard.");
		} else {
			let newid = Tools.toId(split[1]);
			let newdata = (newid in dd.dd ? dd.dd[newid] : {});
			let oldname = dd.dd[realt].name;
			dd.dd[newid] = dd.dd[realt];
			if (realt !== newid) {
				for (let i in newdata) {
					dd.dd[newid][i] += newdata[i];
				}
			}
			dd.dd[newid].name = split[1].trim();
			if (realt !== newid) delete dd.dd[realt];
			return user.say("**" + oldname + "** has been renamed to **" + split[1].trim() + "**.");
		}
	},

	clearlb: function (target, user, room) {
		if (!user.hasRank('survivor', '#')) return;
		if (user.lastcmd !== 'clearlb') return room.say("Are you sure you want to clear the dd leaderboard? If so, type the command again.");
		dd.dd = {};
		dd.numSkips = 0;
		dd.exportData();
		hostcount.count = {};
		gamecount.count = {};
		hostcount.save();
		gamecount.save();
		return room.say("The dd leaderboard has been reset.");
	},
	
	points: function (target, user, room) {
		if (room.id !== user.id) return;
		target = Tools.toId(target);
		if (!target) target = user.id;
		if (!(target in dd.dd)) {
			return user.say("**" + target + "** does not have any points.");
		}
		let sorted = dd.getSorted();

		for (let i = 0; i < sorted.length; i++) {
			let stuff = sorted[i];
			if (Tools.toId(stuff[1]) === target) {
				return user.say("**" + stuff[1].trim() + "** is #" + (i + 1) + " on the leaderboard with " + dd.getPoints(stuff) + " points");
			}

		}
	},

	lastgame: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let numFirsts = 0;
		let sorted = dd.getSorted();
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
		}
		let month = new Date().getMonth();
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if (numFirsts === 0) {
			return room.say("No games have been updated yet this month!");
		}
		let times = ['6pm EST', '12pm EST']
		return room.say("The last Daily Deathmatch to be updated was the " + times[numFirsts % 3] + " game on " + months[month] + " " + (Math.floor((numFirsts + 1) / 3)) + ".");
	},

	repeat: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room === user) return;
		room.trySetRepeat(target, user);
	}
};

require('fs').readdirSync('./modules').forEach(function (file) {
	console.log(file);
	if (file.substr(-3) === '.js') {
		try {
			let cmds = require('./modules/' + file).commands;
			for (let i in cmds) {
				commands[i] = cmds[i];
			}
		} catch (e) {
			error("Could not load commands file: ./modules/" + file + " | " + e.stack);
		}
	}
});

exports.commands = commands;
