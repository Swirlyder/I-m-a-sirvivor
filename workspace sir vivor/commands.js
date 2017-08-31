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
 
let millisToTime = function(millis){
	let seconds = millis/1000;
	let hours = Math.floor(seconds/3600);
	let minutes = Math.floor((seconds-hours*3600)/60);
	let response;
	if(hours>0){
		response = hours + " hour" + (hours === 1 ? "" : "s") + " and " + minutes + " minute" + (minutes === 1 ? "" : "s");
	}else{
		response = minutes + " minute" + (minutes === 1 ? "" : "s");
	}
	return response;
};
if (Config.serverid === 'showdown')
{
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

for (let i in Config.groups)
{
	if (i !== ' ') CONFIGURABLE_COMMAND_LEVELS[i] = i;
}
var host = '';
var hostId = '';

function isPM(roomid, userid)
{
	if (roomid === userid) return true;
	else return false;
}

function lbuild()
{}
let gameTypes = {
			trump: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 9],
			trumps: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 9],
			toptrumps: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 9],
			ttp: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 9],
			toptrumpspokebattle: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 9],
			dualtype: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 9],
			dual: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 9],
			htdt: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 9],
			htdual: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 9],
			ht: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 9],
			hidden: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 9],
			risk: ['Risk', 'http://survivor-ps.weebly.com/risk.html', 'Pssh, who needs an army when you have a hulk?', 12],
			classic: ['Classic', 'http://survivor-ps.weebly.com/classic.html', 'Classic Survivor. This is the main game.', 9],
			hg: ['Hunger Games', 'http://survivor-ps.weebly.com/hunger-games.html', 'Classic but with a twist: No alliances.', 6],
			hungergames: ['Hunger Games', 'http://survivor-ps.weebly.com/hunger-games.html', 'Classic but with a twist: No alliances.', 6],
			hgs: ['Hunger Games Spotlight', 'http://survivor-ps.weebly.com/hunger-games.html', 'Hunger games but with the spotlight variant (.spotlight for more info)', 6],
			hga: ['Hunger Games Anon', 'http://survivor-ps.weebly.com/hunger-games-anon.html', 'Hunger Games but you don\'t know who is who...', 6],
			hiddentype: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 9],
			hungergamesanonymous: ['Hunger Games Anon', 'http://survivor-ps.weebly.com/hunger-games-anon.html', 'Hunger Games but you don\'t know who is who...', 6],
			towerdefense: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 9],
			tower: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 9],
			td: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 9],
			gearup: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 9],
			gear: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 9],
			gu: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 9],
			pokemonsurvivor: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 6],
			pokemon: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 6],
			pokesurvivor: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 6],
			pokesurv: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 6],
			poke: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 6],
			dexterity: ['Dexterity', 'http://survivor-ps.weebly.com/dexterity.html', 'Where accuracy can give you the advantage or just make you fail...', 9],
			dex: ['Dexterity', 'http://survivor-ps.weebly.com/dexterity.html', 'Where accuracy can give you the advantage or just make you fail...', 9],
			bounty: ['Bounty', 'http://survivor-ps.weebly.com/bounty.html', 'Who is the bounty? Thats your mission to find out and capture them to win this game mode!', 12],
			bountie: ['Bounty', 'http://survivor-ps.weebly.com/bounty.html', 'Who is the bounty? Thats your mission to find out and capture them to win this game mode!', 12],
			pole: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 12],
			poles: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 12],
			pol: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 12],
			killerinthedark: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 12],
			kitd: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 12],
			kill: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 12],
			killer: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 12],
			rockpaperscissors: ['Rock, Paper, Scissors', 'http://survivor-ps.weebly.com/rock-paper-scissors.html', 'Winner of NBT #2!', 9],
			rps: ['Rock, Paper, Scissors', 'http://survivor-ps.weebly.com/rock-paper-scissors.html', 'Winner of NBT #2!', 9],
			eclipse: ['Eclipse Survivor', 'http://survivor-ps.weebly.com/eclipse-survivor.html', 'Winner of NBT #5!', 9],
			es: ['Eclipse Survivor', 'http://survivor-ps.weebly.com/eclipse-survivor.html', 'Winner of NBT #5!', 9],
			eeveelutions: ['Eeveelutions', 'http://survivor-ps.weebly.com/eeveelutions.html', 'More than one kind? I can\'t beleevee this!', 9],
			eevee: ['Eeveelutions', 'http://survivor-ps.weebly.com/eeveelutions.html', 'More than one kind? I can\'t beleevee this!', 9],
			exclusions: ['Exclusions', 'http://survivor-ps.weebly.com/exclusions.html', 'The theme where even you don\'t wanna know who you are...', 12],
			ex: ['Exclusions', 'http://survivor-ps.weebly.com/exclusions.html', 'The theme where even you don\'t wanna know who you are...', 12],
			ssb: ['Super Survivor Bros', 'http://survivor-ps.weebly.com/super-survivor-bros.html', 'Destroy your hated roomauth with your favourite roomauth!', 12],
			dotw: ['Day of the Week', 'http://survivor-ps.weebly.com/day-of-the-week.html', 'When "it\'s not my day" becomes literal.'],
			dayoftheweek: ['Day of the Week', 'http://survivor-ps.weebly.com/day-of-the-week.html', 'When "it\'s not my day" becomes literal.'],
			outlaws: ['Outlaws', 'http://survivor-ps.weebly.com/outlaws.html', '[Insert "high noon" meme here]'],
			outlaw: ['Outlaws', 'http://survivor-ps.weebly.com/outlaws.html', '[Insert "high noon" meme here]'],
			russianroulette: ['Russian Roulette', 'http://survivor-ps.weebly.com/russian_roulette.html', 'Pass like a puss or Pull like a pro.'],
			rr: ['Russian Roulette', 'http://survivor-ps.weebly.com/russian_roulette.html', 'Pass like a puss or Pull like a pro.'],
			hideandseektag: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.'],
			hst: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.'],
			hs: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.'],
			fishing: ['Fishing', 'https://docs.google.com/document/d/1Uv8fQhwFIRsqqZ_QAE1ZXh3fgDXYZ4Y4ncMyA9RGdUI/edit', 'Regardless what the score system says, magikarp is still special in our hearts'],
			cakeboss: ['Cake Boss', 'https://docs.google.com/document/d/1UyftfOUi9y09lR7M3MPWfadYa4ZT_qoi4oGacWVd_00/edit', 'Kill your opposition, take their ingredients, and be the first to make the Ultimate Cake!'],
			dragonorbs: ['Dragon Orbs', 'https://docs.google.com/document/d/1-uS0usAS8KMqL8HIFQMG873aqhoeEM0O2r2jUrbNFNQ/edit', 'Summon Shenron with the incredibly powerful Dragon Orbs!'],
			evolve: ['Evolve', 'https://docs.google.com/document/d/1CRDCidN_Y7TJl3pUuuQ2mRZBBWIyTOT4LU4QFCXnBiU/edit', 'Take your fully evolved Pokemon and prove why you\'re the best of the final evolutions!'],
			freeze: ['Freeze', 'https://docs.google.com/document/d/1APlwueeUBT39zlK1jyyq_YE02SgFqb3_v8ntpw4OWy8/edit', 'Freeze... and find out who you can trust in this winter wonderland'],
			ichooseyou: ['I Choose you', 'https://docs.google.com/document/d/1OmQbXKx2M1oqFx9srp-1OFq1TE93COFvKqjdMspRxjY/edit', 'In the words of Ash, I choose you, pik- what do you mean I chose HP and got shedinja?!'],
			icy: ['I Choose you', 'https://docs.google.com/document/d/1OmQbXKx2M1oqFx9srp-1OFq1TE93COFvKqjdMspRxjY/edit', 'In the words of Ash, I choose you, pik- what do you mean I chose HP and got shedinja?!'],
			jenga: ['Jenga', 'https://docs.google.com/document/d/1D1XX8KVKH0Za0xWjN7oasLdRiBqTPYmDTRjuyuNwvJw/edit', 'No you can\'t steady the rest of the tower with your other hand.'],
			menorahsurvivor: ['Menorah Survivor', 'https://docs.google.com/document/d/1Qdt9Xzkgm_FYiZQikPkNyfrpueq176tV0gvS7w4Bww0/edit', 'Just because the number of candles increases every night, doesn\'t mean your roll will'],
			ms: ['Menorah Survivor', 'https://docs.google.com/document/d/1Qdt9Xzkgm_FYiZQikPkNyfrpueq176tV0gvS7w4Bww0/edit', 'Just because the number of candles increases every night, doesn\'t mean your roll will'],
			naughtyornice: ['Naughty or Nice', 'https://docs.google.com/document/d/1MyvJzYmD5X569MD5XWc3VHaBdc2qFH9K17GXebsl3g4/edit', 'We\'re gonna .pick out who\'s naughty or nice!'],
			non: ['Naughty or Nice', 'https://docs.google.com/document/d/1MyvJzYmD5X569MD5XWc3VHaBdc2qFH9K17GXebsl3g4/edit', 'We\'re gonna .pick out who\'s naughty or nice!'],
			pickoffortune: ['Pick Of Fortune', 'https://pastebin.com/AhPvGE5Y', 'It\'s time for... PICK! OF! FORTUNE!!'],
			pof: ['Pick Of Fortune', 'https://pastebin.com/AhPvGE5Y', 'It\'s time for... PICK! OF! FORTUNE!!'],
			risk20: ['Risk 2.0', 'https://docs.google.com/document/d/1zXo4plg_ZEW3otsyWHa98BzyveCozTZViUsWr0i6D2w/edit', 'Pssh, who needs Russia when you have an Atomic Wasteland?'],
			rollboost: ['Roll Boost', 'https://docs.google.com/document/d/1YtaXzy8PtPG-vPmwNAtLBq10qcm1pBt8YVMoiZA3A_U/edit', 'Use your power boosts and planning to outwit and roll your opponents in Roll Boosts!'],
			santasautomatedworkshop: ['Santa\'s Automated Workshop', 'https://docs.google.com/document/d/1e-nO4aLdlSP5lCq-FfReTlkzDIOjrKhiaN5-rTtr3dI/edit', 'Try to be Santa\'s perfect little helper in this fun game!'],
			saw: ['Santa\'s Automated Workshop', 'https://docs.google.com/document/d/1e-nO4aLdlSP5lCq-FfReTlkzDIOjrKhiaN5-rTtr3dI/edit', 'Try to be Santa\'s perfect little helper in this fun game!'],
			santassurvivor: ['Santa\'s Survivor', 'https://docs.google.com/document/d/1pZng8tS2r4Vp2V--rDhXeCnxtkmfbYF_6VmWgoH8YX8/edit', 'Help Santa save Christmas from the Grinch in this fun Christmas themed game!'],
			secretsanta: ['Secret Santa', 'https://docs.google.com/document/d/1MXEH5x3sjyKtLOp0ivX_Cx6OKUrXKQGjrUnJyLsPqFY/edit?usp=sharing', 'Show your Christmas spirit or lack of, in this fun Christmas themed game!'],
			sherlock: ['Sherlock', 'https://docs.google.com/document/d/1t0iPscipIepYi5IMoV9iJW3ED0W6ZatnQz62tvEZkOw/edit', 'You haven\'t got a Clue what\'s in store in this mystery filled game!'],
			snowballfight: ['Snowball Fight', 'https://docs.google.com/document/d/1sYmUUR7vWAtKaW4UyHMCsLcyFvftDUFKO7d1Z4fgnQg/edit', 'For when you really just want to hurl balls at each other.'],
			staringcontest: ['Staring Contest', 'https://docs.google.com/document/d/1SVy4h9UgD003iQbw00OeWPPyvEdapFNuISL9DIE9MRg/edit', 'Did you know when googling the longest time withot blinking it says that Michael Thomas kept his eyes open without blinking for one hour, 5.61 seconds'],
			statusconditionsurvivor: ['Status Condition Survivor', 'https://pastebin.com/e66b12Jp', 'Try to take on some major status conditions without a full heal!'],
			scs: ['Status Condition Survivor', 'https://pastebin.com/e66b12Jp', 'Try to take on some major status conditions without a full heal!'],
			streetrace: ['Street Race', 'https://docs.google.com/document/d/1pLDCjXXPLH3Gem1Udqo_qWkbPKyl4XW6wXNlXCqOPLE/edit?usp=sharing', 'Because honestly, who didn\'t want to drive the Mach 5 as a kid?'],
			sunandmoonsurvivor: ['Sun and Moon Survivor', 'https://docs.google.com/document/d/13_EYkAcli9Q9Ph2DThtE4lIEcEMscSwWh52kNCJmg5E/mobilebasic', 'They say that Light and Dark will always be too opposing forces, yet the two forces can’t survive without each other. One will always vie for power from the other.'],
			smsurv: ['Sun and Moon Survivor', 'https://docs.google.com/document/d/13_EYkAcli9Q9Ph2DThtE4lIEcEMscSwWh52kNCJmg5E/mobilebasic', 'They say that Light and Dark will always be too opposing forces, yet the two forces can’t survive without each other. One will always vie for power from the other.'],
			survivethelabyrinth: ['Survive the Labyrinth', 'https://docs.google.com/document/d/1DLZzpZXbThHZg4wHWZk70SMcaNy5fpMSJFkm4-30H24/edit?usp=sharing', 'Beware of the minotaur... or just other players, your choice..'],
			stl: ['Survive the Labyrinth', 'https://docs.google.com/document/d/1DLZzpZXbThHZg4wHWZk70SMcaNy5fpMSJFkm4-30H24/edit?usp=sharing', 'Beware of the minotaur... or just other players, your choice..'],
			survivorparty: ['Survivor Party', 'https://docs.google.com/document/d/1PmcCQUxo_3x9s8S9AOLP-kYiiQguCVXkdAHjHWoR8Xw/edit?usp=sharing', 'Remember playing Mario Party and getting mad with friends? Well feel free to play Survivor Party and just get mad at baloor.'],
			swords: ['Swords', 'https://docs.google.com/document/d/17p0KJEQhr8h13MYfp8bQoNcpQDe7Gh9i6MVvKzU7ut8/edit', 'A game of strategy and finding out who the best swordsman of all is!'],
			tagteamsurvivor: ['Tag Team Survivor', 'https://docs.google.com/document/d/1vSviKmHege4ltPlGJCRHI0OKS-kdB3S3XB13es9fP_c/edit', 'For when you\'re alone enough that you make a theme to be with someone else'],
			tts: ['Tag Team Survivor', 'https://docs.google.com/document/d/1vSviKmHege4ltPlGJCRHI0OKS-kdB3S3XB13es9fP_c/edit', 'For when you\'re alone enough that you make a theme to be with someone else'],
			thegreatescape: ['The Great Escape', 'https://docs.google.com/document/d/1Sr7KPpr9dxRMjQ7-eYAs8OXKX2XO4UCFHfc9DP7v1gQ/edit', 'In a game of wits, and jail, who can you really trust?'],
			tge: ['The Great Escape', 'https://docs.google.com/document/d/1Sr7KPpr9dxRMjQ7-eYAs8OXKX2XO4UCFHfc9DP7v1gQ/edit', 'In a game of wits, and jail, who can you really trust?'],
			vivorsfeast: ['Vivor\'s Feast', 'https://docs.google.com/document/d/1CRKg7wF8ZqmLtzOSXl47_1U_i1Ka0n42D4P_EKWnHJw/edit?ts=5933515a', 'Sir Vivor\'s hungry and looking for a snack... and you look mighty appetizing today!'],
			welcometoourchatjpg: ['Welcome to Our Chat.jpg', 'https://docs.google.com/document/d/1bY8P-wvzPyR0RzrzAQtkjWqT5tYAHGr8YXunVDN4uFE/edit#heading=h.ki085dc7yzxn', 'Are you ever curious what it\'s like to just be yourself, or even one of those around you?'],
			wtoc: ['Welcome to Our Chat.jpg', 'https://docs.google.com/document/d/1bY8P-wvzPyR0RzrzAQtkjWqT5tYAHGr8YXunVDN4uFE/edit#heading=h.ki085dc7yzxn', 'Are you ever curious what it\'s like to just be yourself, or even one of those around you?'],
			winterwonderland: ['Winter Wonderland', 'https://pastebin.com/VzMKLCUy', 'Trapped in a snowstorm only the strong can survive, let\'s hope it\'s you'],
			followtheleader: ['Follow The Leader', 'http://survivor-ps.weebly.com/follow-the-leader.html', 'A bitter civil war ensues with noble deeds and treacherous backstabbing galore, but only the strongest and fittest will rise up and become The True Survivor. Do you have what it takes to keep the crown?'],
			ftl: ['Follow The Leader', 'http://survivor-ps.weebly.com/follow-the-leader.html', 'A bitter civil war ensues with noble deeds and treacherous backstabbing galore, but only the strongest and fittest will rise up and become The True Survivor. Do you have what it takes to keep the crown?'],
};
exports.commands = {
	/**
	 * Help commands
	 *
	 * These commands are here to provide information about the bot.
	 */


	eval: function(arg, user, room)
	{
		if (user !== 'Hawkie') return false;
		try
		{
			var result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		}
		catch (e)
		{
			this.say(room, e.name + ": " + e.message);
		}
	},
	git: function(arg, user, room)
	{
		var text = (room === user || user.hasRank(room, '+')) ? '' : '/pm ' + user.id + ', ';
		text += '**Sir Vivor Bot** source code: ' + Config.fork;
		this.say(room, text);
	},
	help: 'guide',
	guide: function(arg, user, room)
	{
		var text = (room === user || user.hasRank(room.id, '#')) ? '' : '/pm ' + user.id + ', ';
		if (Config.botguide)
		{
			text += 'A guide on how to use this bot can be found here: ' + Config.botguide;
		}
		else
		{
			text += 'There is no guide for this bot. PM the owner with any questions.';
		}
		this.say(room, text);
	},
    reconnect: 'off',
    disconnect: 'off',
    crash: 'off',
    off: function(arg, user, room) {
        if (!user.hasRank('survivor', '%')) return false;
	    //room.say("/logout");
	    //connect();
	},
	/**
	 * Dev commands
	 *
	 * These commands are here for highly ranked users (or the creator) to use
	 * to perform arbitrary actions that can't be done through any other commands
	 * or to help with upkeep of the bot.
	 */

	reload: function(arg, user, room)
	{
		if (!user.isExcepted()) return false;
		delete require.cache[require.resolve('./commands.js')];
		global.Commands = require('./commands.js').commands;
		this.say(room, 'Commands reloaded.');
	},
	reloadvoice: 'reloadvoices',
	reloadvoices: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		Rooms.get('survivor').say("/roomauth surv");
		user.say("Voices have been reloaded.");
	},

	reloadgames: function (arg,user,room) {
		if (!user.isExcepted()) return false;
		delete require.cache[require.resolve('./games.js')];
		global.Games = require('./games.js');
		Games.loadGames();
		this.say(room, 'Games reloaded.');
	},
	shutdownmode: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		Config.allowGames = false;
		room.say("Shutdown mode enabled");
	},
	join: function (arg, user, room) {
		this.say(room, '/join ' + arg);
	},
	custom: function(arg, user, room)
	{
		if (!user.isExcepted()) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobuser,
		// the command would be ".custom [lobuser] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0)
		{
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
	},

	js: function(arg, user, room)
	{
		if (!user.isExcepted()) return false;
		try
		{
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		}
		catch (e)
		{
			this.say(room, e.name + ": " + e.message);
		}
	},
	uptime: function(arg, user, room)
	{
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

		switch (buffer.length)
		{
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

		this.say(room, text);
	},


	/**
	 * Room Owner commands
	 *
	 * These commands allow room owners to personalise settings for moderation and command use.
	 */

	settings: 'set',
	set: function(arg, user, room)
	{
		if (room === user || !user.hasRank(room.id, '#')) return false;

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		var roomid = room.id;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding')
		{
			let modOpt;
			if (!opts[1] || !CONFIGURABLE_MODERATION_OPTIONS[(modOpt = toId(opts[1]))])
			{
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}
			if (!opts[2]) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding && this.settings.modding[roomid] && modOpt in this.settings.modding[roomid] ? 'OFF' : 'ON') + '.');

			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};

			let setting = toId(opts[2]);
			if (setting === 'on')
			{
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			}
			else if (setting === 'off')
			{
				this.settings.modding[roomid][modOpt] = 0;
			}
			else
			{
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, Config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true)
		{
			if (typeof Commands[cmd] === 'string')
			{
				cmd = Commands[cmd];
			}
			else if (typeof Commands[cmd] === 'function')
			{
				if (cmd in CONFIGURABLE_COMMANDS) break;
				return this.say(room, 'The settings for ' + Config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			}
			else
			{
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + Config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		if (!opts[1])
		{
			let msg = '' + Config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd])))
			{
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank) + ' and above.';
			}
			else if (this.settings[cmd][roomid] in CONFIGURABLE_COMMAND_LEVELS)
			{
				msg += 'available for users of rank ' + this.settings[cmd][roomid] + ' and above.';
			}
			else
			{
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
		autoban: function(arg, user, room)
		{
			if (room === user || !user.canUse('autoban', room.id)) return false;
			if (!toId(arg)) return this.say(room, 'You must specify at least one user to blacklist.');

			arg = arg.split(',');
			var added = [];
			var illegalNick = [];
			var alreadyAdded = [];
			var roomid = room.id;
			for (let u of arg)
			{
				let tarUser = toId(u);
				if (!tarUser || tarUser.length > 18)
				{
					illegalNick.push(tarUser);
				}
				else if (!this.blacklistUser(tarUser, roomid))
				{
					alreadyAdded.push(tarUser);
				}
				else
				{
					added.push(tarUser);
					this.say(room, '/roomban ' + tarUser + ', Blacklisted user');
				}
			}

			var text = '';
			if (added.length)
			{
				text += 'user' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist';
				this.say(room, '/modnote ' + text + ' by ' + user.name + '.');
				this.writeSettings();
			}
			if (alreadyAdded.length)
			{
				text += ' user' + (alreadyAdded.length > 1 ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') + ' already present in the blacklist.';
			}
			if (illegalNick.length) text += (text ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
			this.say(room, text);
		},
		unblacklist: 'unautoban',
		unban: 'unautoban',
		unab: 'unautoban',
		unautoban: function(arg, user, room)
		{
			if (room === user || !user.canUse('autoban', room.id)) return false;
			if (!toId(arg)) return this.say(room, 'You must specify at least one user to unblacklist.');

			arg = arg.split(',');
			var removed = [];
			var notRemoved = [];
			var roomid = room.id;
			for (let u of arg)
			{
				let taruser = toId(u);
				if (!taruser || taruser.length > 18)
				{
					notRemoved.push(taruser);
				}
				else if (!this.unblacklistUser(taruser, roomid))
				{
					notRemoved.push(taruser);
				}
				else
				{
					removed.push(taruser);
					this.say(room, '/roomunban ' + taruser);
				}
			}

			var text = '';
			if (removed.length)
			{
				text += ' user' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
				this.say(room, '/modnote ' + text + ' user by ' + user.name + '.');
				this.writeSettings();
			}
			if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
			this.say(room, text);
		},
		rab: 'regexautoban',
		regexautoban: function(arg, user, room)
		{
			if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
			if (!users.self.hasRank(room.id, '@')) return this.say(room, users.self.name + ' requires rank of @ or higher to (un)blacklist.');
			if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

			try
			{
				new RegExp(arg, 'i');
			}
			catch (e)
			{
				return this.say(room, e.message);
			}

			if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg))
			{
				return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Don\'t be Machiavellian!');
			}

			var regex = '/' + arg + '/i';
			if (!this.blacklistuser(regex, room.id)) return this.say(room, '/' + regex + ' is already present in the blacklist.');

			var regexObj = new RegExp(arg, 'i');
			var users = room.users.entries();
			var groups = Config.groups;
			var selfid = users.self.id;
			var selfidx = groups[room.users.get(selfid)];
			for (let u of users)
			{
				let userid = u[0];
				if (userid !== selfid && regexObj.test(userid) && groups[u[1]] < selfidx)
				{
					this.say(room, '/roomban ' + userid + ', Blacklisted user');
				}
			}

			this.writeSettings();
			this.say(room, '/modnote Regular expression ' + regex + ' was added to the blacklist user user ' + user.name + '.');
			this.say(room, 'Regular expression ' + regex + ' was added to the blacklist.');
		},
		unrab: 'unregexautoban',
		unregexautoban: function(arg, user, room)
		{
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
	viewblacklist: function(arg, user, room)
	{
		if (room === user || !user.canUse('autoban', room.id)) return false;

		var text = '/pm ' + user.id + ', ';
		if (!this.settings.blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		var roomid = room.id;
		var blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		if (!arg.length)
		{
			let userlist = Object.keys(blacklist);
			if (!userlist.length) return this.say(room, text + 'No users are blacklisted in this room.');
			return this.uploadToHastebin('The following users are banned from ' + roomid + ':\n\n' + userlist.join('\n'), function(link)
			{
				if (link.startsWith('Error')) return this.say(room, text + link);
				this.say(room, text + 'Blacklist for room ' + roomid + ': ' + link);
			}.bind(this));
		}

		var nick = toId(arg);
		if (!nick || nick.length > 18)
		{
			text += 'Invalid username: "' + nick + '".';
		}
		else
		{
			text += 'user "' + nick + '" is currently ' + (blacklist[nick] || 'not ') + 'blacklisted in ' + roomid + '.';
		}
		this.say(room, text);
	},
	/*
		banphrase: 'banword',
		banword: function(arg, user, room)
		{
			arg = arg.trim().toLowerCase();
			if (!arg) return false;

			var tarRoom = room.id;
			if (room === user)
			{
				if (!user.isExcepted()) return false;
				tarRoom = 'global';
			}
			else if (user.canUse('banword', room.id))
			{
				tarRoom = room.id;
			}
			else
			{
				return false;
			}

			var bannedPhrases = this.settings.bannedphrases ? this.settings.bannedphrases[tarRoom] : null;
			if (!bannedPhrases)
			{
				if (bannedPhrases === null) this.settings.bannedphrases = {};
				bannedPhrases = (this.settings.bannedphrases[tarRoom] = {});
			}
			else if (bannedPhrases[arg])
			{
				return this.say(room, 'Phrase "' + arg + '" is already banned.');
			}
			bannedPhrases[arg] = 1;

			this.writeSettings();
			this.say(room, 'Phrase "' + arg + '" is now banned.');
		},
		unbanphrase: 'unbanword',
		unbanword: function(arg, user, room)
		{
			var tarRoom;
			if (room === user)
			{
				if (!user.isExcepted()) return false;
				tarRoom = 'global';
			}
			else if (user.canUse('banword', room.id))
			{
				tarRoom = room.id;
			}
			else
			{
				return false;
			}

			arg = arg.trim().toLowerCase();
			if (!arg) return false;
			if (!this.settings.bannedphrases) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

			var bannedPhrases = this.settings.bannedphrases[tarRoom];
			if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

			delete bannedPhrases[arg];
			if (Object.isEmpty(bannedPhrases))
			{
				delete this.settings.bannedphrases[tarRoom];
				if (Object.isEmpty(this.settings.bannedphrases)) delete this.settings.bannedphrases;
			}

			this.writeSettings();
			this.say(room, 'Phrase "' + arg + '" is no longer banned.');
		},
		viewbannedphrases: 'viewbannedwords',
		vbw: 'viewbannedwords',
		viewbannedwords: function(arg, user, room)
		{
			var tarRoom = room.id;
			var text = '';
			var bannedFrom = '';
			if (room === user)
			{
				if (!user.isExcepted()) return false;
				tarRoom = 'global';
				bannedFrom += 'globally';
			}
			else if (user.canUse('banword', room.id))
			{
				text += '/pm ' + user.id + ', ';
				bannedFrom += 'in ' + room.id;
			}
			else
			{
				return false;
			}

			if (!this.settings.bannedphrases) return this.say(room, text + 'No phrases are banned in this room.');
			var bannedPhrases = this.settings.bannedphrases[tarRoom];
			if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

			if (arg.length)
			{
				text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] || 'not ') + 'banned ' + bannedFrom + '.';
				return this.say(room, text);
			}

			var banList = Object.keys(bannedPhrases);
			if (!banList.length) return this.say(room, text + 'No phrases are banned in this room.');

			this.uploadToHastebin('The following phrases are banned ' + bannedFrom + ':\n\n' + banList.join('\n'), function(link)
			{
				if (link.startsWith('Error')) return this.say(room, link);
				this.say(room, text + 'Banned phrases ' + bannedFrom + ': ' + link);
			}.bind(this));
		}, */

	/**
	 * General commands
	 *
	 * Add custom commands here.
	 */

	seen: function(arg, user, room)
	{ // this command is still a bit buggy
		var text = (room === user ? '' : '/pm ' + user.id + ', ');
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id)
		{
			text += 'Have you looked in the mirror lately?';
		}
		else if (toId(arg) === user)
		{
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		}
		else if (!this.chatData[arg] || !this.chatData[arg].seenAt)
		{
			text += 'The user ' + arg + ' has never been seen.';
		}
		else
		{
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(room, text);
	},

	leave: function (target, user, room) {
		if (!user.isExcepted()) return;
		room.say("/part");
	},

	// Survivor Commands:
	// Host commands:
	roompromote: 'roomvoice',
	roomvoice: 'host',
	host: function(target, user, room)
	{
		if ((!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) || room === user) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		let split = target.split(",");
		let realuser = Users.get(split[0]);
		if (!realuser) return this.say(room, "You can only host somebody currently in the room.");
		if (realuser.id in Games.hostbans) return user.say("That user is currently hostbanned.");
		let targTheme = "";
		if (split.length > 1) {
			let targThemeID = Tools.toId(split[1]);
			if (!(targThemeID in gameTypes)) {
				return room.say("Invalid game type. The game types can be found here: http://survivor-ps.weebly.com/themes-and-more.html");
			} else {
				targTheme = gameTypes[targThemeID][0];
			}
		}
		if (Games.host || room.game) {
			target = Tools.toId(realuser.name);
			let i = 0, len = Games.hosts.length;
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
			this.say(room, "/modnote " + info[0] + " hosted");
			Games.host = Users.get(info[0]);
			Games.addHost(Games.host);
			Games.exportData();
		} else {
			Games.host = realuser;
			this.say(room, "survgame! " + realuser.name + " is hosting" + (targTheme.length ? " **" + targTheme + "**" : "")+ "! Do ``/me in`` to join!");
			this.say(room, "/modnote " + realuser.name + " hosted");
			Games.addHost(realuser);
			Games.exportData();
		}
	},

	theme: 'themes',
	themes: function(arg, user, room)
	{
		if (!Games.canTheme) return;
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			var text = '';
		}
		else
		{
			var text = '/pm ' + user.id + ', ';
		}

		arg = toId(arg);
		if (arg)
		{
			if (!(arg in gameTypes))
			{
				text += "Invalid game type. The game types can be found here: http://survivor-ps.weebly.com/themes-and-more.html";
			}
			else
			{
				var data = gameTypes[arg];
				text += '**' + data[0] + '**: __' + data[2] + '__ Game rules: ' + data[1];
				if (Games.host) {
					Games.points = data[3];
				}
			}
		}
		else
		{
			text += "The list of game types can be found here: http://survivor-ps.weebly.com/themes-and-more.html";
		}
		this.say(room, text);
		Games.canTheme = false;
		var t = setTimeout(function () {
			Games.canTheme = true;
		}, 5 * 1000);
	},

	sethost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && Config.canHost.indexOf(user.id) === -1) return;
		if (Games.host) return room.say("__" + Games.host.name + "__ is currently hosting");
		let targUser = Users.get(Tools.toId(target));
		if (!targUser) return room.say("**" + target + "** is not currently in the room");
		Games.host = targUser;
		room.say("**" + targUser.name + "** has been as set as the host.");
	},

	hostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
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
		return room.say(Games.hostBan(targUser, numDays));
	},

	hostbanned: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		return room.say("Hostbanned users: " + Object.keys(Games.hostbans).map(t => Games.hostbans[t].name).join(", "));
	},

	unhostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		return room.say(Games.unHostBan(target));
	},

	bantime: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		return room.say(Games.banTime(target));
	},
	subhost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Games.host) return room.say("No host is currently active.");
		user = Users.get(Tools.toId(target));
		if (!user) return room.say("You can only host somebody currently in the room.");
		Games.host = user;
		room.say("**" + Games.host.name + "** has subbed in as the host!");
	},
	cyclotic: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text = '/pm ' + user.id + ', ';
		text += '/me runs in circles endlessly';
		this.say(room, text);
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
			data.push(mon.species);
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
		room.say("!dt " + Tools.data.pokedex[Tools.sample(Object.keys(Tools.data.pokedex))].species);
	},

	autostart: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (room.game && typeof room.game.autostart === 'function') room.game.autostart(target);
	},

	dq: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (room.game && typeof room.game.dq === 'function') room.game.dq(target);
	},

	pl: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (room.game && typeof room.game.pl === 'function') room.game.pl();
	},

	done: function(arg, user, room)
	{
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
		let i = 0, len = Games.hosts.length;
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
	tester: function(arg, user, room)
	{
		this.say(room, room.id)
		this.say(room, user.id)
	},
	rof: 'rolls',
	rolls: 'rollsoffame',
	rollsoffame: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += 'Be sure to check out our **Rolls of Fame** page here!: http://survivor-ps.weebly.com/rolls-of-fame.html And don\'t forget to submit your own here!: https://docs.google.com/forms/d/1n_C8wctsFXDQLkPXPqCj4UfBjxh6d7CPvSfTBw59tuw/viewform?c=0&w=1';
		this.say(room, text);
	},

	win: function (arg, user, room) {
		if (!Games.host || Games.host.id !== user.id) return;
		this.say(room, 'The winner is ' + arg + '! Thanks for playing!');
		Games.host = null;
	},

	intro: function(arg, user, room)
	{
		if (!Games.canIntro) return;
		var text = '';
		if (user.hasRank(room.id, '+')) {
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += 'Hello, welcome to Survivor! I\'m the room bot. "Survivor" is a luck-based game that uses Pokémon Showdown\'s /roll feature. For more info, go to: http://survivor-ps.weebly.com/';
		this.say(room, text);
		Games.canIntro = false;
		var t = setTimeout(function () {
			Games.canIntro = true;
		}, 5 * 1000);
	},
	plug: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += 'Join us and listen to some tunes :J https://plug.dj/survivoranimeclub';
		this.say(room, text);
	},

	nbt: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}

		text += '**Next Big Theme** is live! More info here: https://docs.google.com/document/d/13jmZ3cTs6ekiyAk89GRT__OMQduj4cmUhGnRw0aZKFw/edit';
		this.say(room, text);
	},
	rankings: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'This has been discontinued but what\'s left of the **Survivor Rankings** can be found here: http://goo.gl/jAucyT';
		this.say(room, text);
	},
	howtohost: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'How To Host: http://survivor-ps.weebly.com/how-to-host.html';
		this.say(room, text);
	},
	summary: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '%'))
		  		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Hello, welcome to Survivor. Here we play a series of Survivor games. Survivor is a game based on dice rolls,  some games require less luck than others. Example attack: http://i.imgur.com/lKDjvWi.png';
		this.say(room, text);
	},
	htp: 'howtoplay',
	howtoplay: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Survivor Themes and How to Play Them: http://survivor-ps.weebly.com/themes-and-more.html';
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
		console.log(info);
		if (Users.get(info[0])) {
			this.say(room, "survgame! " + info[0] + " is hosting" + (info[1].length ? " **" + info[1] + "**" : "") + "! Do ``/me in`` to join!");
			this.say(room, "/modnote " + info[0] + " hosted");
			Games.host = Users.get(info[0]);
			Games.addHost(info[0]);
			Games.points = null;
			Games.exportData();
		} else {
			this.say(room, "Nobody in the hostqueue could be hosted!");
		}
	},


	shame: 'shamethat',
	shamethat: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Aussie man of mystery who always beats Beo at RNG';
		this.say(room, text);
	},
	wishes: 'unfixable',
	unfixable: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'The best eyebrows on PS! and Smogon bar none~';
		this.say(room, text);
	},

	usainbot: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Inferior consumer model';
		this.say(room, text);
	},

	bon: 'bondance',
	bondance: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Lol, more like can\'t dance';
		this.say(room, text);
	},
	akno: 'aknolan',
	aknolan: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += ' "I have to go, night!"';
		this.say(room, text);
	},
	woof: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'woof!';
		this.say(room, text);
	},
	
	deetah: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += '/me can confirm that deetah is a cheetah';
		this.say(room, text);
	},
	swirl: 'swirlyder',
	swirlyder: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += 'I swear, he\'s not my real dad';
		this.say(room, text);
	},

	snapeasy: 'snap',
	snap: function (target, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += '/me snaps fingers';
		this.say(room, text);
	},
	kaz: 'azuuli',
	azu: 'azuuli',
	azuuli: function (target, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += '/me explodes';
		this.say(room, text);
	},

	baloor: function (target, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += '__You must be...DELETED!__';
		this.say(room, text);
	},

	pq: 'ppq',
	ppq: 'penquin',
	penquin: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'S-S-Senpai!';
		this.say(room, text);
	},
	cheese: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Muffinss';
		this.say(room, text);
	},
	jh: 'teal',
	seal: 'teal',
	teal: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'teal teal teaal! >~<';
		this.say(room, text);
	},
	lunar: 'lunarixis',
	lunarixis: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '/me sips tea';
		this.say(room, text);
	},
	spieky: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Global Roomowner, Administrator and all around Good Guy!';
		this.say(room, text);
		
	},
	zeo: 'zeonth',
	zeonth: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'A friendly reminder that Zeonth shamelessly advertises the <<cap>> metagame here';
		this.say(room, text);
	},
	dontlose: 'dl',
	dl: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'dont lose? HA! More like dont win :^)';
		this.say(room, text);
	},
	zyx14: 'zyx',
	zyx: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Famous for .woof and needs to update his number by 3 years';
		this.say(room, text);
	},
	random: 'hawkie',
	hawkie: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Which random username will he switch to now?';
		this.say(room, text);
	},
	tikitik: 'tiki',
	tiki: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Survivor\'s Resident Russian Spy';
		this.say(room, text);
	},
	soccer: 'soccerz12',
	soccerz12: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Hey, what\'s up guys it\'s Soccer here';
		this.say(room, text);
	},
	
	paradise: 'para',
	para: function(arg, user, room)
	{
		let text1 = "I'm Paradise and this is my Anime club. I work here with my friends and fellow weebs: Bon Dance, Aknolan, PenQuin, Swirlyder, Aknolan, Cheese, Hawkie, Henka, OM room, phable";
		let text2 = "Soccer, Zeonth, SnapEasy, blink182, Deathbywobbuffet, Cyclotic, Zyg-Ten%, and Zyx14; and in 23 years, I've learned one thing. You never know WHAT anime is going to be good.";
		if (room !== user && !user.hasRank(room, '+')) {
			user.say(text1);
			user.say(text2);
		} else {
			room.say(text1);
			room.say(text2);
		}
	},
	anime: 'weeb',
	weeb: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Anime was a mistake';
		this.say(room, text);
	},
	chapterseven: 'c7',
	c7: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Survivor\'s most toxic presence';
		this.say(room, text);
	},
	deathbywobbuffet: 'dbw',
	dbw: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Death by Deez nuts';
		this.say(room, text);
	},
	electra: 'electrasheart',
	electrasheart: 'summmer',
	summer: 'moq',
	moq: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Don\'t moq me for all my name changes ;_;';
		this.say(room, text);
	},
	morgantactician: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'Emma☯Femcario: Wind Waker, Amiibo Hunter, and  the 5 time Survivor Champion!';
		this.say(room, text);
	},
	pipeitup: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '/ME dabs';
		this.say(room, text);
	},
	sanjay: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '/ME resigns';
		this.say(room, text);
	},
	micro: 'microwavable',
	microwavable: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '*GGGHHHH*....beep beep bepp....beep beep beep...beep bee-';
		this.say(room, text);
	},
	henka: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'H E N K A B O Y S';
		this.say(room, text);
	},
	zygten: 'zyg',
	zyg: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '/me sighs... what is there to say?';
		this.say(room, text);
	},
	omroom: 'om',
	om: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '"OM Goodness! Leave OM Room alone..." ;~;';
		this.say(room, text);
	},
	meow: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += 'meow!';
		this.say(room, text);
	},
	attackerimmunity: 'ai',
	ai: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '**Attacker Immunity:** __The attacker doesnt die if they lose the dice battle. Only the defender can die if they lose the dice battle.__';
		this.say(room, text);
	},
	spotlight: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '**Spotlight:** __an attacker is randomly chosen by using the !pick command, rather than sending a message to the host. The chosen user then gets to choose who they want to attack. Spotlight can be used for most themes, but not all themes.__';
		this.say(room, text);
	},

	golf: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id+ ', ';
		}
		text += '**Golf:** __Lower rolls win. Opposite of normal survivor__';
		this.say(room, text);
	},
	counterattack: 'ca',
	ca: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id+ ', ';
		}
		text += '**Counter Attack:** __If an attacker fails to kill their defending target, then their defending target will attack them right back.__';
		this.say(room, text);
	},
	rollswitch: 'rs',
	rs: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user.id + ', ';
		}
		text += '**Roll Switch:** __Randomly pick between Golf and Normal rules before each attack__';
		this.say(room, text);
	},


	joke: function(arg, user, room)
	{
		var text = '';
		var jokes = ['What does a nosey pepper do? Get jalapeño business.', 'What is Bruce Lee’s favorite drink? Wataaaaah!', 'How does NASA organize their company parties? They planet.', 'Why does Snoop Dogg carry an umbrella? Fo’ drizzle.', 'What time is it when you have to go to the dentist? Tooth-hurtie.', 'There’s two fish in a tank. One turns to the other and says "You man the guns, I’ll drive"', 'Why can’t a bike stand on its own? It’s two tired.', 'How do you make Holy water? Boil the hell out of it.', 'What did one ocean say to the other ocean? Nothing, they just waved.', 'A bear walks into a bar and he asks the bartender "I\'d like some peanuts............. and a glass of milk. The bartender says "Why the big pause?"', 'Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!', 'What did the traffic light say when it stayed on red? ”You would be red too if you had to change in front of everyone!”', 'Two hats are on a hat rack. Hat #1 to hat #2 “you stay here. I’ll go on a head.”', 'Why did the tomato blush? ... it saw the salad dressing.', 'What did the football coach say to the broken vending machine? “Give me my quarterback!”', 'What did the digital clock say to the grandfather clock? Look grandpa, no hands!', 'What happens to a frog\'s car when it breaks down? It gets toad away.', 'What did the blanket say when it fell of the bed? "Oh sheet!"', 'What lights up a soccer stadium? A soccer match', 'Why shouldn\'t you write with a broken pencil? Because it\'s pointless.', 'What do you call a fake noodle? An impasta', 'Why is Peter Pan always flying? He neverlands!', 'How many tickles does it take to make an octopus laugh? Ten-Tickles', 'Why did the stadium get hot after the game? All of the fans left.', 'What did Barack Obama say to Michelle when he proposed? Obama: I don\'t wanna be obama self.', 'Why did the picture go to jail? Because it was framed!', 'What if soy milk is just regular milk introducing itself in Spanish?', 'Why couldn\'t the sesame seed leave the gambling casino? Because he was on a roll.', 'Why did the chicken cross the playground? To get to the other slide.', 'What does a cell phone give his girlfriend? A RING!', 'How did the italian chef die? He pasta away.', 'Why didn\'t the skeleton go to the party? He had no-body to dance with!', 'How does Moses make his tea? Hebrews it.', 'What do you call a sleeping bull? A bull-dozer.', 'Why didn\'t the koala get the job? He didn\'t have the koalafictions', 'What do you call a fairy that hasn\'t bathed in a year? Stinkerbell', 'What do you call two Mexicans playing basketball? Juan on Juan.', 'What do you call a guy who never farts in public? A private tutor', 'Why did the can crusher quit hit job? It was soda pressing!', 'A blonde went into a doctors office and said "doctor help I\'m terribly sick" doc replies "flu?" "no, I drove here."', 'What do you comb a rabbit with? A hare brush!', 'Why did the deer need braces? Because he had buck teeth!', 'What did the blanket say when it fell off the bed? Oh sheet!', 'Why shouldn\'t you write with an unsharpened pencil? It\'s pointless', 'What did one plate say to the other? Dinner\'s on me!', 'How do you make a tissue dance? You put a little boogey in it!', 'Want to hear a joke about paper? Never mind it\'s tearable.', 'What\'s the difference between a guitar and a fish? You can tune a guitar but you can\'t tuna fish!', 'What kind of key opens a banana? A mon-key!', 'What do you call a line of rabbits walking backwards? A receding hare line.', 'Why did the Fungi leave the party? There wasn\'t mushroom.', 'Why did the algae and the fungus get married? They took a lichen to each other.', 'Why do Toadstools grow so close together? They don\'t need Mushroom. ', 'What would a mushroom car say? Shroom shroom!', 'What room has no doors, no walls, no floor and no ceiling? A mushroom.', 'What do you get if you cross a toadstool and a full suitcase? Not mushroom for your holiday clothes!', 'Did you hear the joke about the fungus? I could tell it to you, but it might need time to grow on you.', 'What do mushrooms eat when they sit around the campfire? S\'pores.', 'What did the mushroom say when it was locked out of the house? E no ki.', 'Why wouldn\'t the teenage mushroom skip school? He didn\'t want to get in truffle', 'Why did the mushroom go to the party? It didn\'t. Mushrooms are non-sentient organic matter, so they generally don\'t get invited to parties.', 'Why did the Mushroom get invited to all the RAVE parties? \'Cuz he\'s a fungi!', 'Yo mama so poor your family ate cereal with a fork to save milk', 'Yo mama so fat, I took a picture of her last Christmas and it\'s still printing', 'What did the first cannibal say to the other while they were eating a clown? Does this taste funny to you?', 'One night Chuck Norris had a pissing contest outside of a bar. He won when his opponents drowned', 'My Dad used to say always fight fire with fire, which is probably why he got kicked out of the fire brigade', 'I like to stop the microwave at 1 second just to feel like a bomb defuser', 'I should change my facebook username to NOBODY so that way when people post crappy posts, and i press the like button it will say NOBODY likes this', 'It\'s so cold outside, I actually saw a gangster pull his pants up.', 'A gift card is a great way to say, Go buy your own fucking present', 'Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ships kitchen', 'Lazy People Fact #5812672793, You were too lazy to read that number', 'My favourite exercise is a cross between a lunge and a crunch. Its called Lunch.', 'I have the heart of a lion. And a lifetime ban from the zoo.', 'Old ladies in wheelchairs with blankets over their legs? I don’t think so… retired mermaids.', 'Years ago I used to supply filing cabinets for the mafia. Yes, I was involved in very organised crime', 'If you are being chased by a police dog, try not to go through a tunnel, then on to a little see-saw, then jump through a hoop of fire. They are trained for that', 'I named my hard drive "dat ass" so once a month my computer asks if I want to back dat ass up', 'Relationships are a lot like algebra. Have you ever looked at your X and wondered Y?', 'I swear to drunk Im not God, but seriously, stay in drugs, eat school, and dont do vegetables.', 'You haven\'t experienced awkward until you try to tickle someone who isn\'t ticklish', '"No, thanks. I\'m a vegetarian." Is a fun thing to say when someone hands you their baby', 'Maybe if we all emailed the constitution to each other, the NSA will finally read it', 'If a quiz is quizzical, then what does that make a test?', 'Whatever you do in life, always give 100%. Unless you are donating blood...', 'It is all shits and giggles until someone giggles and shits!', 'I wonder if anyone has watched Storage Wars and said "hey thats my shit!"', 'I am naming my TV remote Waldo for obvious reasons', 'I hate when I am about to hug someone really sexy and my face hits the mirror', 'Telling a girl to calm down works about as well as trying to baptize a cat', 'Dating a single mother is like continuing from somebody else\'s saved game', 'If only God can judge us than Santa has some explaining to do', 'My vacuum cleaner broke. I put a Dallas Cowboys sticker on it, and now it sucks again', 'When the zombie apocalypse finally happens, I\'m moving to Washington D.C. I figure the lack of brains there will keep the undead masses away', 'Everyone\'s middle name should be "Goddamn". Try it. Doesnt it sound so great?', 'Before Instagram, I used to waste so much time sitting around having to imagine what my friends food looked like', 'The sad moment when you return to your shitty life after watching an awesome movie', 'A big shout out to sidewalks... Thanks for keeping me off the streets', 'Buying an electric car seems like a good idea until you hit a squirrel and flip over a few times', 'I named my dog "5 miles" so I can tell people I walk 5 miles every day', 'Your future depends on your dreams, so go to sleep', 'Yawning is your bodies way of saying 20% battery remaining', 'Dont you hate it when someone answers their own questions? I do', 'Paradise.'];
		text += jokes[Math.floor(Math.random() * jokes.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id)
		{
			this.say(room, text);
			return;
		}

		if (!user.hasRank(room.id, '+'))
		{
			this.say(room, '/w ' + user.id + ', ' + text);
		}
	},

	gif: function(arg, user, room)
	{
		var text = '';
		var gifs = ['/addhtmlbox <center><img src="http://media2.giphy.com/media/u7hjTwuewz3Gw/giphy.gif" width=225 height=175/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/31c91db0b76d312b966c6adfe1c3940a/tumblr_nz57a2TvRC1u17v9ro1_540.gif" width=270 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/1gyIAEh.gif" width=380 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/RDtW8Gr.gif" width=222 height=200/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/qR77BXg.gif" width=250 height=225/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/2PZ8XUR.gif" width=385 height=216/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/451d21ddbde24e207a6f7ddd92206445/tumblr_inline_nt0ujvAJ8P1qjzu7m_500.gif" width=238 height=223/></center>', '/addhtmlbox <center><img src="http://www.keysmashblog.com/wp-content/uploads/2013/02/wig-snatching.gif" width=333 height=217/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/5f2015d7ba3f93f6c258e039d377287d/tumblr_inline_nn2r5c94m11qbxex9_500.gif" width=382 height=215/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/IFOqV6m.gif" width=387 height=218/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/hSv7KYd.gif" width=267 height=219/></center>'];
		text += gifs[Math.floor(Math.random() * gifs.length)];
		if (user.hasRank(room.id, '#'))
		{
			this.say(room, text);
		}
	},

	agif: 'animegif',
	animegif: function(arg, user, room)
	{
		{
			var text = '';
			var gifs = ['/addhtmlbox <center><img src="http://i.imgur.com/BzaMLzD.gif" width=345 height=194/> <br> Source: Fairy Tail</center>', '/addhtmlbox <center><img src="http://i.imgur.com/2qzxwG4.gif" width=345 height=195/> <br> Source: Toradora</center>', '/addhtmlbox <center><img src="http://i.imgur.com/BjAbTzB.gif" width=222 height=192/> <br> Source: Daily Lives of High School Boys</center>', '/addhtmlbox <center><img src="http://i.imgur.com/ys6IrQs.gif" width=267 height=191/> <br> Source:The World God Only Knows</center>', '/addhtmlbox <center><img src="http://i.imgur.com/IK4fVLX.gif" width=345 height=190/> <br> Source: Soul Eater</center>', '/addhtmlbox <center><img src="http://i.imgur.com/UE6AEZs.gif" width=353 height=196/> <br> Source: Gintama</center>', '/addhtmlbox <center><img src="http://i.imgur.com/sy6202O.gif" width=286 height=194/> <br> Source: YuriYuri</center>', '/addhtmlbox <center><img src="http://i.imgur.com/Bo1SjJX.gif" width=296 height=194/> <br> Source: Deadman Wonderland</center>', '/addhtmlbox <center><img src="http://i.imgur.com/KjTewQ7.gif" width=341 height=192/> <br> Source: Carnival Phantasm</center>', '/addhtmlbox <center><img src="http://i.imgur.com/RYaPwBT.gif" width=345 height=192/> <br> Source: Space Brothers</center>', '/addhtmlbox <center><img src="http://i.imgur.com/82lBuUf.gif" width=345 height=194/> <br> Source: Full Metal Alchemist: Brotherhood</center>', '/addhtmlbox <center><img src="http://media3.giphy.com/media/12dO0uYqeMVOy4/giphy.gif" width=260 height=195/> <br> Source: FLCL</center>', '/addhtmlbox <center><img src="https://66.media.tumblr.com/9f5d4e129f998f0c4358bf26a6d12a13/tumblr_nf0jxhnU9p1tyak95o1_500.gif" width=357 height=192/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://i.imgur.com/bYYRBiu.gif" width=286 height=194/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://pa1.narvii.com/5649/565e7d8046bd4b6223d153ce308086c42d06b773_hq.gif" width=385 height=190/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/14jigRRwHoGSo8/giphy.gif" width=342 height=192/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/LbvSbAz7CMmg8/giphy.gif" width=325 height=195/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="http://67.media.tumblr.com/ad16541d6ef3ee701c3308204574e0af/tumblr_nmd1mskOr91qam6y9o9_500.gif" width=450 height=195/> <br> Source: Kekkai Sensen</center>'];

			text += gifs[Math.floor(Math.random() * gifs.length)];
			if (user.hasRank(room.id, '#'))
			{
				this.say(room, text);
			}
		}
	},
    gift: 'present',
    present: function(arg, user, room)
	{
		var text = '';
        var presents = [' A nice rubber red ball', ' 5 dolla, now beat it kid', ' a carton of eggnog!', '**Error 404:** You\'ve been vewy naughty :c', ' a Stonehenge! WHAT DOES IT MEAN?!', ' is another present!', ' not even a kiss', ' You thought I was going to get you something? LMAO', ' 1 trillion billion kazillion dollars! :o', ' my heart c: ', ' coal', ' The Sheep Lord\'s life supply of wool :0', ' *dies', ' Transmuter\'s beard!', ' lifetime supply of hoopla', ' a hug c:', ' Jingle Bjorn\'s password :OOOO', ' Randy ( ͡° ͜ʖ ͡°)', ' some waffles (>\'.\')>#', ' a box of CHOCOLATES!', ' the key to the underworld that gives you the chance to rule the world! muahahaha', ' a brand spanking new girlfriend... for 5 easy payments of $59.99 plusshippingandhandling', '. https://www.youtube.com/watch?v=lrAkb9AZ8Xg&feature=youtu.be', ' juan penny. :J', ' JOHN CENA *horns sound*', ' Lunarixis\' bottomless teapot', ' The magical mario mushroom!', ' The hammer of Tho', ' A bag full of sweg that belongs to... PPQ?', ' A banana (for scale)', ' A subsription to WWE SUUUPEEER SLAAAAM', ' a giant SHAD!', ' Phable\'s mixtape (Caution. May be hot.)', ' a [[jar of hearts]]', '  a terrifying creature appearing to be a blend of a cockroach and a mouse was found by a nuclear testing site. Have fun! :D', '  Shame That\'s secret manga collection', ' Imagi\'s mmm... mmm.. good Tiramisu', ' a fistbump from Saitama! (Caution: You\'ll prolly die)', ' Spieky\'s homemade razor candy', ' a Lunarixis x Don\'t Lose fanfic', ' a copy of The Rick Ross **Certified Boss** Crossfit program', ' a Sir Vivor Fedora and fake moustache!', ' a copy of the Bon Dance audition tape for High School Musical', ' __urkerab__ serenading you with a lullaby u_u', ' DEEZ NUTCRACKERS', ' a picture of Oprah Winfrey', ' is... a paper hat', ' a signed copy of __Muting Zarzel__', ' some rubbing bacon', ' a rotten pancake... it looks... pink?', ' a CAP flyer from Zeonth', ' a single M&M', ' a Nintendo SIXTY FOOOUR', ' a Hawkie egg', ' an onion', ' a bowl of soup', ' two tickets to the Nuclear War Crazed Autocracy', ' a motivational poster featuring rssp1', ' a cheetah', ' a badly photoshopped picture of PPQ with huge muscles', ' a rigged dice', ' a breadstick', ' a pina colada caught in the rain, I hope you like it', ' a scooby snack', ' a WiiStation one', ' a Swirlyder action figure', ' a Gatorade', ' Don\'t Lose\'s Rae Sremmurd Christmas & Holiday Playlist', ' a Ditto that can only transform into a Castform', ' a life', ' the copy of Pokemon Sun and Pokemon Moon that you wish you had', ' an invitation to join Paradise\'s anime club. Sugio Kawaii Desu Desu!! (◕‿◕✿)', ' Sanjay\'s resignation letter', ' a half-eaten microwavable dinner', ' The self-destroying feeling of loneliness on christmas'];
        text += 'Inside ' + arg + '\'s present is...' + presents[Math.floor(Math.random() * presents.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id)
		{
			this.say(room, text);
			return;
		}
		if (!user.hasRank(room.id, '+'))
		{
			this.say(room, '/w ' + user.id + ', ' + text);
		}
    },

	mods: function (arg,user, room) {
		var text = 'Host it your way, with these custom mods: http://survivor-ps.weebly.com/custommodifications.html';
		if (user.hasRank(room.id, '+')) {
			this.say(room, text);
		} else {
			user.say(text);
		}
	},

	hostqueue: 'queue',
	que: 'queue',
	q: 'queue',
    queue: function(arg, user, room) {
		if (!Games.canQueue) return;
        if (user.hasRank(room.id, '%') || (Config.canHost.indexOf(user.id) !== -1)) {
            if (Games.hosts.length === 0) {
				this.say(room, 'There are no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					queueText += '**' + (i + 1) + '.** __' + Games.hosts[i][0] + '__' + (Games.hosts[i][1].length ? ", " + Games.hosts[i][1] : "") + " "; //add formatting here, down there just adds on to the end whoops
				}
				this.say(room, '/announce **Queue:** ' + queueText);
			}
        } else {
            if (Games.hosts.length === 0 && room.id.charAt(0) !== ',') {
				this.say(room, '/w ' + user.id + ', There are currently no users in the queue.');
			} else {
				var queueText = '';
				for (var i = 0; i < Games.hosts.length; i++) {
					queueText += '**' + (i + 1) + '.** __' + Games.hosts[i] + '__ ';
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
		let str = "<em>We randomly picked:</em> " + Tools.sample(stuff);	
		if (room.id === 'survivor') {
			this.say(room, "/addhtmlbox " + str);
		} else {
			this.say(room, "!htmlbox " + str);
		}
	},

	timer: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		if (target === "end") {
			if (Games.isTimer ) {
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
		Games.timeout = setTimeout(() => Games.timer(room), x * 1000);
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

	next: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return;
		let d = new Date();
		let n = d.getHours();
		let m = d.getMinutes();
		let millis = (60 - m) * 60 * 1000
		if (n < 6) {
			millis += (5 - n) * 60 * 60 * 1000;
		} else if (n < 16) {
			millis += (15 - n) * 60 * 60 * 1000;
		} else if (n < 22) {
			millis += (21 - n) * 60 * 60 * 1000;
		} else {
			millis += (29 - n) * 60 * 60 * 1000;
		}
		room.say("The next Daily Deathmatch is in " + millisToTime(millis) + ".")
	},
	
	allowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1) && (!Games.host || Games.host.id !== user.id)) return;
		if (!target) return;
		let split = target.split(",");
		let goodnames = [], badnames = [], alreadynames = [];
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
			if (!user) ;
			badnames.push(user.name);
		}
		if (goodnames.length > 0 && badnames.length > 0) {
			this.say(room, goodnames.join(", ") + " were allowed a roll! Unfortunately, " + badnames.join(", ") + " could not be added, since only 2 users can be allowed at a time.");
		} else if (goodnames.length > 0) {
			this.say(room, goodnames.join(", ") + " were allowed a roll!");
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
	roll: 'dice',
	dice: function (target, user, room) {
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
			if (!roll) return;	
		} else {
			roll = parseInt(target);
			if (!roll) return;
		}
		let rolls = [];
		let sum = adder || 0;
		for (let i = 0; i < numDice; i++) {
			rolls.push(Tools.random(roll) + 1);
			sum += rolls[i];
		}
		if (numDice === 1) {
			let str = "Roll (1 - " + roll + ")" + (adder ? "+" + adder : "") +": " + sum;
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
		if (id === 'ftl' || id === 'followtheleader') return room.say("Follow the Leader is currently down for repairs.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
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
		while (id === 'eclipse' || id === 'eclipsesurvivor' || id === Games.lastGame || id === 'ftl' || id === 'followtheleader') {
			id = Tools.sample(goodids);
		}
		Games.createGame(id, room);
		room.game.signups();
	},

	endgame: 'end',
	end: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!room.game) {
			if (Games.host) {
				Games.host = null;
				this.say(room, 'The game was forcibly ended.');
			}
			return;
		}
		room.game.forceEnd();
	},

	submit: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return;
		this.say(room, 'Visit https://docs.google.com/forms/d/e/1FAIpQLSeY2Ndt-wC3iUXsY4yKVnGarHTBa1a4C75UYYLHpHH1qzsCrQ/viewform#responses to submit roasts, jokes, and replies!');
	},

	moo: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		this.say(room, '/me MOOs');
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

	bomb: function (target, user, room) {
		let text = "A bomb is a player that, when eliminated, \"explodes\" and eliminates the player that eliminated them.";
		if (user.hasRank(room.id, '+')) {
			room.say(text);
		} else {
			user.say(text);
		}
	},
	dq: function (target, user, room) {
		if (!user.hasRank(room.id, '%') || !room.game) return;
		room.game.dq(target);
	},
	
	roast: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let roasts = ["If i wanted to die, I would climb to the top of " + target + "'s ego and jump to their IQ", target + ", I was going to give you a nasty look but I see that you’ve already got one.", "Earth is full. Go home " + target, target + ", you always bring me so much joy. As soon as you leave the room.", target + ", remember that time I said I thought you were cool? I lied.", target + ", some day you'll go far - and i really hope you stay there.", "To call " + target + " a donkey would be an insult to the donkey.", target + ", You're the reason the gene pool needs a lifeguard", target + "'s breath is so bad, their dentist treats them over the phone.", "I tried making " + target + " my password but my computer said it was too weak.", "If laughter is the best medicine, " + target + "'s face must be curing the world.", target + ", you remind me of Kurt Angle. You suck!", target + ', your presence here is as bad as __OM Room__\'s theme', target + ', your presence here is bad as Sanjay\'s resignations', target + " is as bad as Sanjay's music taste.", target + "'s personality is so flat, even flat tires want to run.", target + ", you remind me of gold. You weigh a fuck ton.", target + ", your body looks like a kindergartners attempt to make a person out of playdoh", target + "'s jokes are like Magcargo; horrible in competitions.", target + ", my mom asked me to take out the trash so what time should I pick you up?", "No, those __pants__ don't make " + target + " look fatter - how could they?", "If " + target + " is gonna be two-faced, why can't at least one of them be attractive?", "Accidents happen. LIKE YOU!"];
		this.say(room, Tools.sample(roasts));
	},

	use: function (target, user, room) {
	    if (!room.game) return;
	    if (typeof room.game.use === 'function') room.game.use(target, user);
    },

	apts: 'addpoints',
	apt: 'addpoints',
	addpoints: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
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
	dd: function(arg, user, room)
	{
		var text = '';
		if (user.hasRank(room.id, '+'))
		{
			text = '';
		}
		else if (room.id !== user.id)
		{
			text = '/pm ' + user + ', ';
		}
		text += "Daily Deathmatch (DD) is Survivor's system for official games, in which three games are hosted daily at 2AM, 12PM and 6PM EDT. For every DD you participate in, you earn points, and the person with the most points at the end of the month is champion!";
		this.say(room, text);
	},

	firsts: 'first',
	first: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addFirst(target);
		user.say("First place points awarded to: **" + target + "**.");
		dd.updateModlog(user.name + " did .first " + target);
		dd.updateModlog("First place points awarded to: **" + target + "**.");
	},
	seconds: 'second',
	second: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addSecond(target);
		user.say("Second place points awarded to: **" + target + "**.");	
		dd.updateModlog(user.name + " did .second " + target);
		dd.updateModlog("Second place points awarded to: **" + target + "**.");
	},
	hp: 'hostpoints',
	hostpoints: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addHost(target);
		user.say("Host points awarded to: **" + target + "**.");
		dd.updateModlog(user.name + " did .hostpoints " + target);
		dd.updateModlog("Host points awarded to: **" + target + "**.");
	},
	part: 'participation',
	parts: 'participation',
	participation: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		for (let i = 0; i < split.length; i++) {
			split[i] = split[i].trim();
		}
		for (let i = 0; i < split.length; i++) {
			dd.addPart(split[i]);
		}
		let msg = "Participation points awarded to: **" + split.join(", ") + "**.";
		if (msg.length > 300) {
			let len = split.length;
			let firstHalf = split.slice(0, Math.floor(len / 2.0));
			let secondHalf = split.slice(Math.floor(len / 2.0));
			user.say("Participations points awarded to: **" + firstHalf.join(", ") + "**.");
			user.say("and **" + secondHalf.join(", ") + "**.");
		} else {
			user.say(msg);
		}
		dd.updateModlog(user.name + " did .parts " + target);
		dd.updateModlog(msg);
	},

	rmfirst: 'removefirst',
	removefirst: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg;
		if (dd.removeFirst(target)) {
			msg = "First place removed from: **" + target + "**."
		} else {
			msg = "**" + target + "** has never won a game!";
		}
		user.say(msg);
		dd.updateModlog(user.name + " did .rmfirst " + target);
		dd.updateModlog(msg);
	},
	
	rmsecond: 'removesecond',
	removesecond: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg;
		if (dd.removeSecond(target)) {
			msg = "Second place removed from: **" + target + "**.";
		} else {
			msg = "**" + target + "** has never placed second!";
		}
		user.say(msg);
		dd.updateModlog(user.name + " did .rmsecond " + target);
		dd.updateModlog(msg);
	},

	rmhost: 'removehost',
	rmhosts: 'removehost',
	removehost: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg = "";
		if (dd.removeHost(target)) {
			msg = "Host removed from: **" + target + "**."
		} else {
			msg = "**" + target + "** has never hosted dd!";
		}
		user.say(msg);
		dd.updateModlog(user.name + " did .rmhost " + target);
		dd.updateModlog(msg);
	},
	removeparts: 'removepart',
	removeparticipation: 'removepart',
	rmpart: 'removepart',
	rmparts: 'removepart',
	removepart: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let split = target.split(",");
		let good = [];
		let bad = [];
		for (let i = 0; i < split.length; i++) {
			let name = split[i];
			if (dd.removePart(name)) {
				good.push(name);
			} else {
				bad.push(name);
			}
		}
		let msg = "";
		if (good.length > 0 && bad.length > 0) {
			msg = "Participations removed from: **" + good.join(", ") + "**. I was unable to remove participation from **" + bad.join(", ") + "**.";
		} else if (good.length > 0) {
			msg = "Participations removed from: **" + good.join(", ") + "**.";
		} else {
			msg = "I was unable to remove participations from **" + bad.join(", ") + "**.";
		}
		user.say(msg);
		dd.updateModlog(user.name + " did .rmparts " + target);
		dd.updateModlog(msg);
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
		Rooms.get('survivor').say("/makegroupchat testing");
		Rooms.get('survivor').say("/join groupchat-" + Tools.toId(Config.nick) + "-testing");
		room.say("<<groupchat-" + Tools.toId(Config.nick) + "-testing>> to test stuff!");
	},
	ddoverall: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		let sorted = dd.getSorted();
		let longestLength = 0;
		let numTabsSpaces = 8.0;
		for (let i = 0; i < sorted.length; i++) {
			let length = sorted[i][4].length;
			if (length > longestLength) longestLength = length;
		}
		let numTabs = Math.ceil(longestLength / numTabsSpaces);
		let sep = "";
		for (let i = 0; i < longestLength; i += numTabsSpaces) {
			sep += "\t";
		}
		let buffer = "Rank\tName" + sep + "Firsts\tSeconds\tParts\tHosts\tPoints\t\n";
		let real = [4,1,2,3,0];
		for (let i = 0; i < sorted.length; i++) {
			for (let j = 0; j < 7; j++) {
				let stuff;
				if (j === 0) stuff = i + 1;
				else if (j === 6) stuff = dd.getPoints(sorted[i]);
				else stuff = sorted[i][real[j - 1]];
				buffer += stuff;
				if (j === 1) {
					let numCursTabs = numTabs - Math.ceil(sorted[i][real[j - 1]].length / numTabsSpaces);
					for (let l = 0; l < numCursTabs + (sorted[i][4].length %8 === 0 ? 0 : 1) ; l++) {
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
			else user.say('Error connecting to pastebin.');
        });
	},
	toppoints: 'top',
	top: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		let sorted = dd.getSorted();
		let num = parseInt(target);
		if (!num || num < 1) num = 50;
		if (num > sorted.length) num = sorted.length;
		if (room.id === user.id) {
			let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><tr>";
			let indices = ["Rank", "Name", "Points"];
			for (let i = 0; i < 3; i++) {
				str +=  "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
			}
			str += "</tr>"
			let strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < 3; j++) {
					let stuff;
					if (j === 0) stuff = i + 1;
					else if (j === 1) stuff = sorted[i][4];
					else stuff = dd.getPoints(sorted[i]);
					strx += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + stuff + "</font></b></td>";
				}
				strs.push(strx + "</tr>");
			}
			str += strs.join("");
			str += "</table></body></html></div></div>";	
			Parse.say(Rooms.get('survivor'), '/pminfobox ' + user.id + ", " + str);
		} else {
			let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><tr>";
			let indices = ["Rank", "Name", "Firsts", "Seconds", "Parts", "Hosts", "Points"];
			for (let i = 0; i < 7; i++) {
				str +=  "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
			}
			str += "</tr>"
			let real = [4,1,2,3,0];
			let strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < 7; j++) {
					let stuff;
					if (j === 0) {
						stuff = i+1;
					} else if (j === 6) {
						stuff = dd.getPoints(sorted[i]);
					} else {
						stuff = sorted[i][real[j - 1]];
					}
					strx += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + stuff + "</font></b></td>";
				}
				strs.push(strx + "</tr>");
			}
			str += strs.join("");
			str += "</table></body></html></div></div>";

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
		let month = new Date().getMonth();
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if (numFirsts === 0) {
			return room.say("No games have been updated yet this month!");
		}
		let times = ['6pm EST', '2am EST', '12pm EST']
		return room.say("The last Daily Deathmatch updated was the " + times[numFirsts%3] + " game on " + months[month] + " " + (Math.floor((numFirsts + 2)/3)) + ".");	
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
			if (Tools.toId(stuff[4]) === target) {
				return user.say("**" + stuff[4] + "** is #" + (i + 1) + " on the leaderboard with " + dd.getPoints(stuff) + " points, consisting of " + stuff[0] + " hosts, " + stuff[1] + " first places, " + stuff[2] + " second places, and " + stuff[3] + " participations.");
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
		let times = ['6pm EST', '2am EST', '12pm EST']
		return room.say("The last Daily Deathmatch to be updated was the " + times[numFirsts%3] + " game on " + months[month] + " " + (Math.floor((numFirsts + 1)/3)) + ".");	
	},
};

/* globals toId */
