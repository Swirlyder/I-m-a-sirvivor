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
			trump: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
			trumps: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
			toptrumps: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
			ttp: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
			toptrumpspokebattle: ['Top Trumps Pokebattle', 'http://survivor-ps.weebly.com/top-trumps-pokebattle.html', 'Where your partners\' lesser strengths can become their greatest assets. **Note: Hosts can !randpoke 3 to players in PMs.**', 1],
			dualtype: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 1],
			dual: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 1],
			htdt: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 1],
			htdual: ['Hidden type mod: Dual Type', 'http://survivor-ps.weebly.com/ht-dual-types.html', 'Wow, now they can have TWO different types? So cool', 1],
			ht: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 1],
			hidden: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 1],
			risk: ['Risk', 'http://survivor-ps.weebly.com/risk.html', 'Pssh, who needs an army when you have a hulk?', 2],
			classic: ['Classic', 'http://survivor-ps.weebly.com/classic.html', 'Classic Survivor. This is the main game.', 1],
			hg: ['Hunger Games', 'http://survivor-ps.weebly.com/hunger-games.html', 'Classic but with a twist: No alliances.', 0],
			hungergames: ['Hunger Games', 'http://survivor-ps.weebly.com/hunger-games.html', 'Classic but with a twist: No alliances.', 0],
			hgs: ['Hunger Games Spotlight', 'http://survivor-ps.weebly.com/hunger-games.html', 'Hunger games but with the spotlight variant (.spotlight for more info)', 0],
			hga: ['Hunger Games Anon', 'http://survivor-ps.weebly.com/hunger-games-anon.html', 'Hunger Games but you don\'t know who is who...', 0],
			hiddentype: ['Hidden Type', 'http://survivor-ps.weebly.com/hidden-type.html', 'The theme that won our April 2015\'s NBT!', 1],
			hotpotato: ['Hot Potato', 'https://survivor-ps.weebly.com/hot-potato.html', 'This be a real hot potato.', 0],
			hungergamesanonymous: ['Hunger Games Anon', 'http://survivor-ps.weebly.com/hunger-games-anon.html', 'Hunger Games but you don\'t know who is who...', 0],
			towerdefense: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 1],
			tower: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 1],
			td: ['Tower Defense', 'http://survivor-ps.weebly.com/tower-defense.html', 'Can you defend your tower? Who will be left standing when the dust settles? (Long Games)', 1],
			gearup: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 1],
			gear: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 1],
			gu: ['Gear Up', 'http://survivor-ps.weebly.com/gear-up.html', 'So you have items? You think you\'re cool? Pffft! You totally shouldn\'t click this link and learn about Gear Up (Long Games)', 1],
			pokemonsurvivor: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 0],
			pokemon: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 0],
			pokesurvivor: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 0],
			pokesurv: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 0],
			poke: ['Pokemon Survivor', 'http://survivor-ps.weebly.com/pokemon-survivor.html **Note: Players can use /modjoin + in their battles to avoid scouting. Hosts can !randpoke to players in PMs.**', 'Let the dice decide your partner! A true test of battling skill!', 0],
			prisonersdilemma: ['Prisoner\'s Dilemma', 'https://survivor-ps.weebly.com/prisoners-dilemma.html', 'Cooperate or Betray... which one benefits you more?', 1],
			pd: ['Prisoner\'s Dilemma', 'https://survivor-ps.weebly.com/prisoners-dilemma.html', 'Cooperate or Betray... which one benefits you more?', 1],
			dexterity: ['Dexterity', 'http://survivor-ps.weebly.com/dexterity.html', 'Where accuracy can give you the advantage or just make you fail...', 1],
			dex: ['Dexterity', 'http://survivor-ps.weebly.com/dexterity.html', 'Where accuracy can give you the advantage or just make you fail...', 1],
			bounty: ['Bounty', 'http://survivor-ps.weebly.com/bounty.html', 'Who is the bounty? Thats your mission to find out and capture them to win this game mode!', 2],
			bountie: ['Bounty', 'http://survivor-ps.weebly.com/bounty.html', 'Who is the bounty? Thats your mission to find out and capture them to win this game mode!', 2],
			pole: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 2],
			poles: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 2],
			pol: ['Poles', 'http://survivor-ps.weebly.com/poles.html', 'Your power is within the cards, can you use them wisely?', 2],
			killerinthedark: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 2],
			kitd: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 2],
			kill: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 2],
			killer: ['Killer in the Dark', 'http://survivor-ps.weebly.com/killer-in-the-dark.html', '"Local serial killer escapes again. Citizens riot as bodies pile up."', 2],
			rockpaperscissors: ['Rock, Paper, Scissors', 'http://survivor-ps.weebly.com/rock-paper-scissors.html', 'Winner of NBT #2!', 1],
			rps: ['Rock, Paper, Scissors', 'http://survivor-ps.weebly.com/rock-paper-scissors.html', 'Winner of NBT #2!', 1],
			chasetheace: ['Chase the Ace', 'https://survivor-ps.weebly.com/chase-the-ace.html', 'Can you catch the best card?', 1],
			cta: ['Chase the Ace', 'https://survivor-ps.weebly.com/chase-the-ace.html', 'Can you catch the best card?', 1],
			eclipse: ['Eclipse Survivor', 'http://survivor-ps.weebly.com/eclipse-survivor.html', 'Winner of NBT #5!', 1],
			es: ['Eclipse Survivor', 'http://survivor-ps.weebly.com/eclipse-survivor.html', 'Winner of NBT #5!', 1],
			eeveelutions: ['Eeveelutions', 'http://survivor-ps.weebly.com/eeveelutions.html', 'More than one kind? I can\'t beleevee this!', 1],
			eevee: ['Eeveelutions', 'http://survivor-ps.weebly.com/eeveelutions.html', 'More than one kind? I can\'t beleevee this!', 1],
			exclusions: ['Exclusions', 'http://survivor-ps.weebly.com/exclusions.html', 'The theme where even you don\'t wanna know who you are...', 1],
			ex: ['Exclusions', 'http://survivor-ps.weebly.com/exclusions.html', 'The theme where even you don\'t wanna know who you are...', 1],
			ssb: ['Super Survivor Bros', 'http://survivor-ps.weebly.com/super-survivor-bros.html', 'Destroy your hated roomauth with your favourite roomauth!', 2],
			dotw: ['Day of the Week', 'http://survivor-ps.weebly.com/day-of-the-week.html', 'When "it\'s not my day" becomes literal.', 2],
			dayoftheweek: ['Day of the Week', 'http://survivor-ps.weebly.com/day-of-the-week.html', 'When "it\'s not my day" becomes literal.', 2],
			outlaws: ['Outlaws', 'http://survivor-ps.weebly.com/outlaws.html', '[Insert "high noon" meme here]', 0],
			outlaw: ['Outlaws', 'http://survivor-ps.weebly.com/outlaws.html', '[Insert "high noon" meme here]', 0],
			russianroulette: ['Russian Roulette', 'http://survivor-ps.weebly.com/russian_roulette.html', 'Pass like a puss or Pull like a pro.', 1],
			rr: ['Russian Roulette', 'http://survivor-ps.weebly.com/russian_roulette.html', 'Pass like a puss or Pull like a pro.', 1],
			hideandseektag: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.', 1],
			hst: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.', 1],
			hs: ['Hide and Seek Tag', 'http://survivor-ps.weebly.com/hide_and_seek.html', 'Stop being so damn edgy and just play a childhood game for once.', 1],
			fishing: ['Fishing', 'https://docs.google.com/document/d/1Uv8fQhwFIRsqqZ_QAE1ZXh3fgDXYZ4Y4ncMyA9RGdUI/edit', 'Regardless what the score system says, magikarp is still special in our hearts', 1],
			cakeboss: ['Cake Boss', 'https://docs.google.com/document/d/1UyftfOUi9y09lR7M3MPWfadYa4ZT_qoi4oGacWVd_00/edit', 'Kill your opposition, take their ingredients, and be the first to make the Ultimate Cake!', 1],
			dragonorbs: ['Dragon Orbs', 'https://docs.google.com/document/d/1-uS0usAS8KMqL8HIFQMG873aqhoeEM0O2r2jUrbNFNQ/edit', 'Summon Shenron with the incredibly powerful Dragon Orbs!', 1],
			evolve: ['Evolve', 'https://docs.google.com/document/d/1CRDCidN_Y7TJl3pUuuQ2mRZBBWIyTOT4LU4QFCXnBiU/edit', 'Take your fully evolved Pokemon and prove why you\'re the best of the final evolutions!', 1],
			freeze: ['Freeze', 'https://docs.google.com/document/d/1APlwueeUBT39zlK1jyyq_YE02SgFqb3_v8ntpw4OWy8/edit', 'Freeze... and find out who you can trust in this winter wonderland', 1],
			ichooseyou: ['I Choose you', 'https://docs.google.com/document/d/1OmQbXKx2M1oqFx9srp-1OFq1TE93COFvKqjdMspRxjY/edit', 'In the words of Ash, I choose you, pik- what do you mean I chose HP and got shedinja?!', 1],
			icy: ['I Choose you', 'https://docs.google.com/document/d/1OmQbXKx2M1oqFx9srp-1OFq1TE93COFvKqjdMspRxjY/edit', 'In the words of Ash, I choose you, pik- what do you mean I chose HP and got shedinja?!', 1],
			jenga: ['Jenga', 'https://docs.google.com/document/d/1D1XX8KVKH0Za0xWjN7oasLdRiBqTPYmDTRjuyuNwvJw/edit', 'No you can\'t steady the rest of the tower with your other hand.', 1],
			menorahsurvivor: ['Menorah Survivor', 'https://docs.google.com/document/d/1Qdt9Xzkgm_FYiZQikPkNyfrpueq176tV0gvS7w4Bww0/edit', 'Just because the number of candles increases every night, doesn\'t mean your roll will', 1],
			ms: ['Menorah Survivor', 'https://docs.google.com/document/d/1Qdt9Xzkgm_FYiZQikPkNyfrpueq176tV0gvS7w4Bww0/edit', 'Just because the number of candles increases every night, doesn\'t mean your roll will', 1],
			naughtyornice: ['Naughty or Nice', 'https://docs.google.com/document/d/1MyvJzYmD5X569MD5XWc3VHaBdc2qFH9K17GXebsl3g4/edit', 'We\'re gonna .pick out who\'s naughty or nice!', 1],
			non: ['Naughty or Nice', 'https://docs.google.com/document/d/1MyvJzYmD5X569MD5XWc3VHaBdc2qFH9K17GXebsl3g4/edit', 'We\'re gonna .pick out who\'s naughty or nice!', 1],
			pickoffortune: ['Pick Of Fortune', 'https://pastebin.com/AhPvGE5Y', 'It\'s time for... PICK! OF! FORTUNE!!', 1],
			pof: ['Pick Of Fortune', 'https://pastebin.com/AhPvGE5Y', 'It\'s time for... PICK! OF! FORTUNE!!', 1],
			risk20: ['Risk 2.0', 'https://docs.google.com/document/d/1zXo4plg_ZEW3otsyWHa98BzyveCozTZViUsWr0i6D2w/edit', 'Pssh, who needs Russia when you have an Atomic Wasteland?', 1],
			rollboost: ['Roll Boost', 'https://docs.google.com/document/d/1YtaXzy8PtPG-vPmwNAtLBq10qcm1pBt8YVMoiZA3A_U/edit', 'Use your power boosts and planning to outwit and roll your opponents in Roll Boosts!', 1],
			santasautomatedworkshop: ['Santa\'s Automated Workshop', 'https://docs.google.com/document/d/1e-nO4aLdlSP5lCq-FfReTlkzDIOjrKhiaN5-rTtr3dI/edit', 'Try to be Santa\'s perfect little helper in this fun game!', 1],
			saw: ['Santa\'s Automated Workshop', 'https://docs.google.com/document/d/1e-nO4aLdlSP5lCq-FfReTlkzDIOjrKhiaN5-rTtr3dI/edit', 'Try to be Santa\'s perfect little helper in this fun game!', 1],
			santassurvivor: ['Santa\'s Survivor', 'https://docs.google.com/document/d/1pZng8tS2r4Vp2V--rDhXeCnxtkmfbYF_6VmWgoH8YX8/edit', 'Help Santa save Christmas from the Grinch in this fun Christmas themed game!', 1],
			secretsanta: ['Secret Santa', 'https://docs.google.com/document/d/1MXEH5x3sjyKtLOp0ivX_Cx6OKUrXKQGjrUnJyLsPqFY/edit?usp=sharing', 'Show your Christmas spirit or lack of, in this fun Christmas themed game!', 1],
			sherlock: ['Sherlock', 'https://docs.google.com/document/d/1t0iPscipIepYi5IMoV9iJW3ED0W6ZatnQz62tvEZkOw/edit', 'You haven\'t got a Clue what\'s in store in this mystery filled game!', 1],
			snowballfight: ['Snowball Fight', 'https://docs.google.com/document/d/1sYmUUR7vWAtKaW4UyHMCsLcyFvftDUFKO7d1Z4fgnQg/edit', 'For when you really just want to hurl balls at each other.', 1],
			staringcontest: ['Staring Contest', 'https://docs.google.com/document/d/1SVy4h9UgD003iQbw00OeWPPyvEdapFNuISL9DIE9MRg/edit', 'Did you know when googling the longest time withot blinking it says that Michael Thomas kept his eyes open without blinking for one hour, 5.61 seconds', 1],
			statusconditionsurvivor: ['Status Condition Survivor', 'https://docs.google.com/document/d/1LeSBo7SSkRJG8PqUKk8MflKSdTuF2nl-rkFstjQJ9iQ/edit?usp=sharing', 'Try to take on some major status conditions without a full heal!', 1],
			scs: ['Status Condition Survivor', 'https://docs.google.com/document/d/1LeSBo7SSkRJG8PqUKk8MflKSdTuF2nl-rkFstjQJ9iQ/edit?usp=sharing', 'Try to take on some major status conditions without a full heal!', 1],
			streetrace: ['Street Race', 'https://docs.google.com/document/d/1pLDCjXXPLH3Gem1Udqo_qWkbPKyl4XW6wXNlXCqOPLE/edit?usp=sharing', 'Because honestly, who didn\'t want to drive the Mach 5 as a kid?', 1],
			sunandmoonsurvivor: ['Sun and Moon Survivor', 'https://docs.google.com/document/d/13_EYkAcli9Q9Ph2DThtE4lIEcEMscSwWh52kNCJmg5E/mobilebasic', 'They say that Light and Dark will always be too opposing forces, yet the two forces can’t survive without each other. One will always vie for power from the other.', 1],
			smsurv: ['Sun and Moon Survivor', 'https://docs.google.com/document/d/13_EYkAcli9Q9Ph2DThtE4lIEcEMscSwWh52kNCJmg5E/mobilebasic', 'They say that Light and Dark will always be too opposing forces, yet the two forces can’t survive without each other. One will always vie for power from the other.', 1],
			survivethelabyrinth: ['Survive the Labyrinth', 'https://docs.google.com/document/d/1DLZzpZXbThHZg4wHWZk70SMcaNy5fpMSJFkm4-30H24/edit?usp=sharing', 'Beware of the minotaur... or just other players, your choice..', 1],
			stl: ['Survive the Labyrinth', 'https://docs.google.com/document/d/1DLZzpZXbThHZg4wHWZk70SMcaNy5fpMSJFkm4-30H24/edit?usp=sharing', 'Beware of the minotaur... or just other players, your choice..', 1],
			survivorparty: ['Survivor Party', 'https://docs.google.com/document/d/1PmcCQUxo_3x9s8S9AOLP-kYiiQguCVXkdAHjHWoR8Xw/edit?usp=sharing', 'Remember playing Mario Party and getting mad with friends? Well feel free to play Survivor Party and just get mad at baloor.', 1],
			swords: ['Swords', 'https://docs.google.com/document/d/17p0KJEQhr8h13MYfp8bQoNcpQDe7Gh9i6MVvKzU7ut8/edit', 'A game of strategy and finding out who the best swordsman of all is!', 1],
			tagteamsurvivor: ['Tag Team Survivor', 'https://docs.google.com/document/d/1vSviKmHege4ltPlGJCRHI0OKS-kdB3S3XB13es9fP_c/edit', 'For when you\'re alone enough that you make a theme to be with someone else', 1],
			tts: ['Tag Team Survivor', 'https://docs.google.com/document/d/1vSviKmHege4ltPlGJCRHI0OKS-kdB3S3XB13es9fP_c/edit', 'For when you\'re alone enough that you make a theme to be with someone else', 1],
			thegreatescape: ['The Great Escape', 'https://docs.google.com/document/d/1Sr7KPpr9dxRMjQ7-eYAs8OXKX2XO4UCFHfc9DP7v1gQ/edit', 'In a game of wits, and jail, who can you really trust?', 1],
			tge: ['The Great Escape', 'https://docs.google.com/document/d/1Sr7KPpr9dxRMjQ7-eYAs8OXKX2XO4UCFHfc9DP7v1gQ/edit', 'In a game of wits, and jail, who can you really trust?', 1],
			vivorsfeast: ['Vivor\'s Feast', 'https://docs.google.com/document/d/1CRKg7wF8ZqmLtzOSXl47_1U_i1Ka0n42D4P_EKWnHJw/edit?ts=5933515a', 'Sir Vivor\'s hungry and looking for a snack... and you look mighty appetizing today!', 1],
			welcometoourchatjpg: ['Welcome to Our Chat.jpg', 'https://docs.google.com/document/d/1bY8P-wvzPyR0RzrzAQtkjWqT5tYAHGr8YXunVDN4uFE/edit#heading=h.ki085dc7yzxn', 'Are you ever curious what it\'s like to just be yourself, or even one of those around you?', 1],
			wtoc: ['Welcome to Our Chat.jpg', 'https://docs.google.com/document/d/1bY8P-wvzPyR0RzrzAQtkjWqT5tYAHGr8YXunVDN4uFE/edit#heading=h.ki085dc7yzxn', 'Are you ever curious what it\'s like to just be yourself, or even one of those around you?', 1],
			winterwonderland: ['Winter Wonderland', 'https://pastebin.com/VzMKLCUy', 'Trapped in a snowstorm only the strong can survive, let\'s hope it\'s you', 1],
			followtheleader: ['Follow The Leader', 'http://survivor-ps.weebly.com/follow-the-leader.html', 'A bitter civil war ensues with noble deeds and treacherous backstabbing galore, but only the strongest and fittest will rise up and become The True Survivor. Do you have what it takes to keep the crown?', 1],
			ftl: ['Follow The Leader', 'http://survivor-ps.weebly.com/follow-the-leader.html', 'A bitter civil war ensues with noble deeds and treacherous backstabbing galore, but only the strongest and fittest will rise up and become The True Survivor. Do you have what it takes to keep the crown?', 1],
};
exports.commands = {
	/**
	 * Help commands
	 *
	 * These commands are here to provide information about the bot.
	 */

	git: function(arg, user, room)
	{
		let text = (room === user || user.hasRank(room, '+')) ? '' : '/pm ' + user.id + ', ';
		text += '**Sir Vivor Bot** source code: ' + Config.fork;
		this.say(room, text);
	},
	help: 'guide',
	guide: function(arg, user, room)
	{
		let text = (room === user || user.hasRank(room.id, '#')) ? '' : '/pm ' + user.id + ', ';
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
	restart: 'off',
	off: function(arg, user, room) {
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
        	if (!user.isExcepted()) return;
        	return user.say(`Encrypted message: ${Tools.encrypt(target)}`);
	},
	decrypt: function (target, user, room) {
		if (!user.isExcepted()) return;
		return user.say(`Decrypted message: ${Tools.decrypt(target)}`);
	},
	reload: function(target, user, room) {
		if (!user.isExcepted()) return;
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
	reloadgames: function (target, user, room) {
		if (!user.isExcepted()) return;
		delete require.cache[require.resolve('./games.js')];
		global.Games = require('./games.js');
		Games.loadGames();
		this.say(room, 'Games reloaded.');
	},
	shutdownmode: function (target, user, room) {
		if (!user.isExcepted()) return;
		Config.allowGames = false;
		room.say("Shutdown mode enabled");
	},
	join: function (target, user, room) {
		if (!user.isExcepted()) return;
		this.say(room, `/join ${target}`);
	},
	custom: function(target, user, room) {
		if (!user.isExcepted()) return;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobuser,
		// the command would be ".custom [lobuser] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (target.indexOf('[') !== 0 || target.indexOf(']') < 0) return this.say(room, target);
		const tarRoomid = target.slice(1, target.indexOf(']'));
		const tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, `I'm is not in room the ${tarRoomid}!`);
		target = target.substr(target.indexOf(']') + 1).trim();
		this.say(tarRoom, target);
	},

	js: function(target, user, room) {
		if (!user.isExcepted()) return false;
		try {
			let result = eval(target.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, `${e.name}: ${e.message}`);
		}
	},
	uptime: function(target, user, room) {
		let text = (room === user || user.isExcepted() ? '' : `/pm ${user.id}, `);
		text +=  '**Uptime:** ';
		const divisors = [52, 7, 24, 60, 60];
		const units = ['week', 'day', 'hour', 'minute', 'second'];
		const buffer = [];
		let uptime = ~~(process.uptime());
		do {
			const divisor = divisors.pop();
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

		room.say(text);
	},


	/**
	 * Room Owner commands
	 *
	 * These commands allow room owners to personalise settings for moderation and command use.
	 */

	settings: 'set',
	set: function(target, user, room) {
		if (room === user || !user.hasRank(room.id, '#')) return false;

		const opts = target.split(',');
		const cmd = toId(opts[0]);
		const roomid = room.id;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			if (!opts[1] || !CONFIGURABLE_MODERATION_OPTIONS[toId(opts[1])]) {
				const modOpts = Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/');
				return this.say(room, `Incorrect command: correct syntax is ${Config.commandcharacter}set mod, [${modOpts}](, [on/off])`);
			}
			if (!opts[2]) {
				const modOpt = (this.settings.modding && this.settings.modding[roomid] && modOpt in this.settings.modding[roomid] ? 'OFF' : 'ON')
				return this.say(room, `Moderation for ${opts[1]}' in this room is currently ${modOpt}.`);
			}

			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};

			const setting = toId(opts[2]);
			if (setting === 'on') {
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			}
			else if (setting === 'off') {
				this.settings.modding[roomid][modOpt] = 0;
			}
			else {
				const modOpts = Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/');
				return this.say(room, `Incorrect command: correct syntax is ${Config.commandcharacter}set mod, [${modOpts}], ([on/off])`);
			}

			this.writeSettings();
			return this.say(room, `Moderation for ${modOpt} in this room is now ${setting.toUpperCase()}.`);
		}

		if (!(cmd in Commands)) return this.say(room, `${Config.commandcharacter}${opts[0]} is not a valid command.`);

		let failsafe = 0;
		while (true)
		{
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			}
			else if (typeof Commands[cmd] === 'function') {
				if (cmd in CONFIGURABLE_COMMANDS) break;
				return this.say(room, `The settings for ${Config.commandcharacter}${opts[0]} cannot be changed.`);
			}
			if (++failsafe > 5) return this.say(room, `The command "${Config.commandcharacter}${opts[0]}" could not be found.`);
		}

		if (!opts[1]) {
			let msg = `${Config.commandcharacter}${cmd} is `;
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd]))) {
				msg += `available for users of rank ${(cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank} and above.`;
			}
			else if (this.settings[cmd][roomid] in CONFIGURABLE_COMMAND_LEVELS) {
				msg += `available for users of rank ${this.settings[cmd][roomid]} and above.`;
			}
			else {
				msg += this.settings[cmd][roomid] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		let setting = opts[1].trim();
		if (!(setting in CONFIGURABLE_COMMAND_LEVELS)) return this.say(room, `Unknown option: "${setting}". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.`);
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][roomid] = CONFIGURABLE_COMMAND_LEVELS[setting];

		this.writeSettings();
		this.say(room, `The command ${Config.commandcharacter}${cmd} is now ${(CONFIGURABLE_COMMAND_LEVELS[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
		(this.settings[cmd][roomid] ? 'available for all users in this room.' : 'unavailable for use in this room.'))}`);
	},
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function(target, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!toId(target)) return this.say(room, 'You must specify at least one user to blacklist.');

		const args = target.split(',');
		const added = [];
		const illegalNick = [];
		const alreadyAdded = [];
		const roomid = room.id;
		for (let u of args) {
			const tarUser = toId(u);
			if (!tarUser || tarUser.length > 18) {
				illegalNick.push(tarUser);
			} else if (!this.blacklistUser(tarUser, roomid)) {
				alreadyAdded.push(tarUser);
			} else {
				added.push(tarUser);
				this.say(room, `roomban ${tarUser} Blacklisted user`);
			}
		}
		let text = '';
		if (added.length) {
			text += 'user' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist';
			this.say(room, `/modnote ${text} by ${user.name}.`);
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
	unautoban: function(target, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!toId(target)) return this.say(room, 'You must specify at least one user to unblacklist.');

		const args = target.split(',');
		const removed = [];
		const notRemoved = [];
		const roomid = room.id;
		for (let u of args) {
			const taruser = toId(u);
			if (!taruser || taruser.length > 18) {
				notRemoved.push(taruser);
			} else if (!this.unblacklistUser(taruser, roomid)) {
				notRemoved.push(taruser);
			} else {
				removed.push(taruser);
				this.say(room, `/roomunban ${taruser}`);
			}
		}

		let text = '';
		if (removed.length)
		{
			text += ' user' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, `/modnote ${text} by ${user.name}.`);
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	rab: 'regexautoban',
	regexautoban: function(target, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!users.self.hasRank(room.id, '@')) return this.say(room, 'I require rank of @ or higher to blacklist or unblacklist.');
		if (!target) return this.say(room, 'You must specify a regular expression to blacklist or unblacklist.');

		try {
			new RegExp(target, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(target)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Don\'t be Machiavellian!');
		}

		const regex = `/${target}/i`;
		if (!this.blacklistuser(regex, room.id)) return this.say(room, `${regex} is already present in the blacklist.`);

		const regexObj = new RegExp(target, 'i');
		const users = room.users.entries();
		const groups = Config.groups;
		const selfid = users.self.id;
		const selfidx = groups[room.users.get(selfid)];
		for (let u of users) {
			let userid = u[0];
			if (userid !== selfid && regexObj.test(userid) && groups[u[1]] < selfidx) {
					this.say(room, `/roomban ${userid}, Blacklisted user`);
			}
		}

		this.writeSettings();
		this.say(room, `/modnote Regular expression ${regex} was added to the blacklist user user ${user.name}.`);
		this.say(room, `Regular expression ${regex} was added to the blacklist.`);
	},
	unrab: 'unregexautoban',
	unregexautoban: function(target, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!users.self.hasRank(room.id, '@')) return this.say(room, 'I require rank of @ or higher to blacklist or unblacklist.');
		if (!target) return this.say(room, 'You must specify a regular expression to blacklist or unblacklist.');

		target = `/${target.replace(/\\\\/g, '\\')}/i`;
		if (!this.unblacklistuser(target, room.id)) return this.say(room, `${target} is not present in the blacklist.`);

		this.writeSettings();
		this.say(room, '/modnote Regular expression ${target} was removed from the blacklist user user ${user.name}.');
		this.say(room, 'Regular expression ${target} was removed from the blacklist.');
	}, 
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function(target, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!this.settings.blacklist) return user.say('No users are blacklisted in this room.');

		const roomid = room.id;
		const blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return user.say('No users are blacklisted in this room.');

		if (!target.length) {
			const userlist = Object.keys(blacklist);
			if (!userlist.length) return user.say('No users are blacklisted in this room.');
			return this.uploadToHastebin(`The following users are banned from ${roomid}:\n\n${userlist.join('\n')}`, link => {
				if (link.startsWith('Error')) return user.say(link);
				user.say(`Blacklist for room ${roomid}: ${link}`);
			}.bind(this));
		}
		let text = '';
		const nick = toId(arg);
		if (!nick || nick.length > 18) return user.say(`Invalid username: "${nick}".`);
		user.say(`User "${nick}" is currently ${(blacklist[nick] || 'not ')} blacklisted in ${roomid}.`);
	},

	/**
	 * General commands
	 *
	 * Add custom commands here.
	 */

	seen: function(target, user, room) {
		let text = (room === user ? '' : `/pm ${user.id}, `);
		target = toId(target);
		if (!target || target.length > 18) return this.say(room, text + 'Invalid username.');
		if (target === user.id) {
			text += 'Have you looked in the mirror lately?';
		} else if (toId(target) === user) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[target] || !this.chatData[target].seenAt) {
			text += `The user ${target} has never been seen.`;
		} else {
			text += `${Users.add(target).name} was last seen ${this.getTimeAgo(this.chatData[target].seenAt)} ago${(
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.')}`);
		}
		this.say(room, text);
	},

	leave: function (target, user, room) {
		if (!user.isExcepted() || !user.hasRank(room, '#')) return;
		room.say("/part");
	},

	// Survivor Commands:
	// Host commands:
	host: function(target, user, room) {
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
			const len = Games.hosts.length;
			for (let i = 0; i < len; i++) {
				if (target === Tools.toId(Games.hosts[i][0])) break;
			}
			if (Games.host && Games.host.id === realuser.id) {
				return room.say(`${realuser.name} is already hosting somebody probably sniped you haha`);
			} else if (i !== len) {
				room.say(`${realuser.name} is already on the hostqueue.`);
			} else {
				room.say(`${realuser.name} was added to the hostqueue${(targTheme.length ? " for " + targTheme : "")}!`);
				Games.hosts.push([realuser.name, targTheme]);
			}
			return;
		}
		if (Games.hosts.length > 0) {
			const info = Games.hosts.shift();
			Games.hosts.push([realuser.name, targTheme]);
			this.say(room, `${realuser.name} was added to the hostqueue${(targTheme.length ? " for " + targTheme : "")}!`);
			this.say(room, `survgame! ${info[0]} is hosting${(info[1].length ? " **" + info[1] + "**" : "")}! Do ``/me in`` to join!`);
			this.say(room, `/modnote ${info[0]} hosted`);
			Games.host = Users.get(info[0]);
			Games.addHost(Games.host);
			Games.exportData();
		} else {
			Games.host = realuser;
			this.say(room, `survgame! ${realuser.name} is hosting${(targTheme.length ? " **" + targTheme + "**" : "")}! Do ``/me in`` to join!`);
			this.say(room, `/modnote ${realuser.name} hosted`);
			Games.addHost(realuser);
			Games.exportData();
		}
	},

	theme: 'themes',
	themes: function(target, user, room) {
		if (!Games.canTheme) return;
		let text = '';
		if (!(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text = '/pm ${user.id}, ';
		let arg = toId(target);
		if (arg) {
			if (!(arg in gameTypes)) {
				text += "Invalid game type. The game types can be found here: http://survivor-ps.weebly.com/themes-and-more.html";
			} else {
				const data = gameTypes[arg];
				text += `**${data[0]}**: __${data[2]}__ Game rules: ${data[1]}`;
				if (Games.host) Games.hosttype = data[3];
			}
		} else {
			text += "The list of game types can be found here: http://survivor-ps.weebly.com/themes-and-more.html";
		}
		this.say(room, text);
		Games.canTheme = false;
		setTimeout(() => Games.canTheme = true, 5000);
	},

	sethost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && Config.canHost.indexOf(user.id) === -1) return;
		if (Games.host) return room.say(`__${Games.host.name}__ is currently hosting`);
		let targUser = Users.get(Tools.toId(target));
		if (!targUser) return room.say(`**${target}** is not currently in the room`);
		Games.host = targUser;
		room.say(`**${targUser.name}** has been set as the host.`);
	},

	hostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		if (!target) return room.say("Please provide a username.");
		let split = target.split(",");
		let targUser = Users.get(split[0]);
		if (!targUser) {
			targUser = {
				id: Tools.toId(split[0]),
				name: split[0]
			}
		}
		let numDays = parseInt(split[1]);
		if (!numDays) numDays = 7;
		room.say(Games.hostBan(targUser, numDays));
	},

	hostbanned: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
        	if (Object.keys(Games.hostbans).length === 0) return user.say("No users are currently hostbanned");
            	let msg = '<div style="overflow-y: scroll; max-height: 250px;"><div class = "infobox"><html><body><table align="center" border="2"><th>Name</th><th>Ban time</th>';
           	msg += Object.keys(Games.hostbans).map(key => {
               		return `<tr><td>${Games.hostbans[key].name}</td><td>${Games.banTime(key)}</td></tr>`; 
            	}).join('');
            	Rooms.get('survivor').say(`/pminfobox ${user.id}, ${msg}</table></body></html></div></div>`);
	},

	unhostban: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		room.say(Games.unHostBan(target));
	},

	bantime: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		room.say(Games.banTime(target));
	},
	subhost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Games.host) return room.say("No host is currently active.");
		user = Users.get(toId(target));
		if (!user) return room.say("You can only host somebody currently in the room.");
		Games.host = user;
		room.say(`**${Games.host.name}** has subbed in as the host!`);
	},
	pants: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text = `/pm ${user.id}, `;
		text += '.done with life';
		room.say(text);
	},

	userhosts: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return;
		if (!target) return user.say("Please specify a user.");
		let split = target.split(",");
		let realuser = split[0];
		let numDays = 7;
		if (split.length > 1) numDays = Math.floor(toId(split[1]));
		if (!numDays) numDays = 7;
		user.say(Games.getHosts(realuser, numDays));
	},

	removehost: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room !== user) return;
		if (!target) return user.say("Please specify a user.");
		if (Games.removeHost(target)) {
			user.say(`One host has been removed from ${target}`);
			this.say(Rooms.get('survivor'), `/modnote ${user.name} removed a host from ${target}`);
		} else {
			user.say("That user hasn't hosted recently.");
		}
	},

	dt: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		const data = [];
		for (let i in Tools.data.pokedex) {
			const mon = Tools.data.pokedex[i];
			data.push(mon.species);
		}
		target = toId(target);
		for (let i = 0; i < data.length; i++) {
			if (target === toId(data[i])) return this.say(room, `!dt ${data[i]}`);
		}
		room.say(`No pokemon named '${target}' was found.`);
	},

	randpoke: 'poke',
	poke: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		room.say(`!dt ${Tools.data.pokedex[Tools.sample(Object.keys(Tools.data.pokedex))].species}`);
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

	done: function(arg, user, room) {
		if (!Games.host || Games.host.id !== user.id) return;
		Games.host = null;
		room.say("Thanks for playing!");
	},
	// Informational Commands:

	dehost: function (target, user, room) {
	    if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		target = toId(target);
		if (!target) {
			if (Games.host) room.say("The game was forcibly ended.");
			return Games.host = null;
		}
		if (Games.host && Games.host.id === target) {
			room.say("The game was forcibly ended.");
			return Games.host = null;
		}
		let len = Games.hosts.length;
		for (let i = 0; i < len; i++) {
			if (target === toId(Games.hosts[i][0])) break;
		}
		if (i !== len) {
			Games.hosts.splice(i, 1);
			return this.say(room, `${Users.add(target).name} was removed from the hosting queue.`);
		}
		if (room.game) return room.game.forceEnd();
	},

	game: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room !== user) return;
		if (Games.host) return room.say(`__${Games.host.name}__ is currently hosting.`);
		if (room.game) return room.say(`A game of **${room.game.name}** is in progress.`);
		room.say("No game is in progress.");
	},
	tester: function(target, user, room) {
		if (!user.isExcepted()) return;
		this.say(room, room.id);
		this.say(room, user.id);
	},
	rof: 'rolls',
	rolls: 'rollsoffame',
	rollsoffame: function(target, user, room) {
		let text = '';
		if (!(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id) && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'rof was deleted because of losers like you who think statistically average things are cool';
		room.say(text);
	},

	win: function (target, user, room) {
		if (!Games.host || Games.host.id !== user.id || room === user) return;
		/** This is the code for UGM **/
		/*let split = target.split(",");
		if (split.length !== 2) {
			return room.say("You must specify the playercount and the username that won, in the format: ``.win playercount, winner``");
		}
		let numPlayers = parseInt(split[0]);
		if (!numPlayers || numPlayers < 1) return room.say("The number of players must be a number greater than 0.");
		if (!Games.hosttype && Games.hosttype !== 0) {
			if (user.hasRank(room.id, '+')) return room.say(`The winner is **${split[1].trim()}**, but I could not award host points since you never selected a theme!`);
			room.say("Please select a theme before winning the player!");
		} else {
			if (!user.hasRank(room.id, '+')) room.say(`.win ${target}`);
			const types = ["easy", "medium", "hard"];
			room.say(`.${types[Games.hosttype]}host ${numPlayers}, ${Games.host.name}`);
			room.say(`The winner is **${split[1].trim()}**! Thanks for playing.`);
		}
		Games.hosttype = null;
		Games.host = null;*/

		room.say(`The winner is **${Users.add(target).name}**! Thanks for playing.`);
		Games.host = null;
		Games.hosttype = null;
	},

	intro: function(target, user, room) {
		if (!Games.canIntro) return;
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Hello, welcome to Survivor! I\'m the room bot. "Survivor" is a luck-based game that uses Pokémon Showdown\'s /roll feature. For more info, go to: http://survivor-ps.weebly.com/';
		room.say(text);
		Games.canIntro = false;
		setTimeout(() => Games.canIntro = true, 5000);
	},
	plug: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Join us and listen to some tunes :J https://plug.dj/survivoranimeclub';
		room.say(text);
	},

	nbt: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '**Next Big Theme** is live! More info here: https://docs.google.com/document/d/1GU-Zmil6oGBUSlpYqhHaNpNeLjO4RraxnlS3TaEL3pE/edit';
		room.say(text);
	},
	rankings: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'This has been discontinued but what\'s left of the **Survivor Rankings** can be found here: http://goo.gl/jAucyT';
		room.say(text);
	},
	howtohost: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'How To Host: http://survivor-ps.weebly.com/how-to-host.html';
		room.say(text);
	},
	summary: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Hello, welcome to Survivor. Here we play a series of Survivor games. Survivor is a game based on dice rolls,  some games require less luck than others. Example attack: http://i.imgur.com/lKDjvWi.png';
		room.say(text);
	},

	day: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		let day = new Date().getDay();
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		text += `Today is currently **${days[day]}**!`;
		room.say(text);
	},
	htp: 'howtoplay',
	howtoplay: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Survivor Themes and How to Play Them: http://survivor-ps.weebly.com/themes-and-more.html';
		room.say(text);
	},

	nexthost: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say("A game is currently in progress!");
		if (Games.hosts.length === 0) return room.say("The hostqueue is empty.");
		let info = ["", ""];
		while (Games.hosts.length > 0) {
			info = Games.hosts.shift();
			if (Users.get(info[0])) break;
			room.say(`**${info[0]}** is not online and could not be hosted!`);
		}
		if (Users.get(info[0])) {
			room.say(`survgame! ${info[0]} is hosting${(info[1].length ? " **" + info[1] + "**" : "")}! Do ``/me in`` to join!`);
			room.say(`/modnote ${info[0]} hosted`);
			Games.host = Users.get(info[0]);
			Games.addHost(info[0]);
			Games.points = null;
			Games.exportData();
		} else {
			room.say("Nobody in the hostqueue could be hosted!");
		}
	},

	shame: 'shamethat',
	shamethat: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Aussie man of mystery who always beats Beo at RNG';
		room.say(text);
	},
	wishes: 'unfixable',
	unfixable: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'The best eyebrows on PS! and Smogon bar none~';
		room.say(text);
	},
	usainbot: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Inferior consumer model';
		room.say(text);
	},
	bon: 'bondance',
	bondance: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Lol, more like can\'t dance';
		room.say(text);
	},
	akno: 'aknolan',
	aknolan: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += ' "I have to go, night!"';
		room.say(text);
	},
	deetah: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me can confirm that deetah is a cheetah';
		room.say(text);
	},
	swirl: 'swirlyder',
	swirlyder: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'I swear, he\'s not my real dad';
		room.say(text);
	}, 
	mitsuki: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'isso significa algo em português';
		room.say(text);
	}, 	
	hirl123: 'hurl',
	hurl: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'received their first promotion in 2016 when a dyslexic staff member misread their name as Girl123';
		room.say(text);
	},
	snapeasy: 'snap',
	snap: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me snaps fingers';
		room.say(text);
	},
	kaz: 'azuuli',
	azu: 'azuuli',
	azuuli: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me explodes';
		room.say(text);
	},
	guishark: 'gui',
	gui: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += `Hi ${target}, I'm Gui♥Shark!`;
		room.say(text);
	},
	baloor: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '__You must be...DELETED!__';
		room.say(text);
	},
	cet: 'pak',
	ceterisparibus: 'pak',
	pak: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'CHOO CHOO ALL ABOARD THE PARTYBUS TRAIN';
		room.say(text);
	},
	shadecession: 'shade',
	shade: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Better put on my Shadecessions ⌐■_■';
		room.say(text);
	},
	pq: 'ppq',
	ppq: 'penquin',
	penquin: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'S-S-Senpai!';
		room.say(text);
	},
	cheese: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Muffinss';
		room.say(text);
	},
	jh: 'teal',
	seal: 'teal',
	teal: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'teal teal teaal! >~<';
		room.say(text);
	},
	lunar: 'lunarixis',
	lunarixis: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me sips tea';
		room.say(text);
	},
	spieky: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Global Roomowner, Administrator and all around Good Guy!';
		room.say(text);
		
	},
	zeo: 'zeonth',
	zeonth: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'A friendly reminder that Zeonth shamelessly advertises the <<cap>> metagame here';
		room.say(text);
	},
	dontlose: 'dl',
	dl: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'dont lose? HA! More like dont win :^)';
		room.say(text);
	},
	zyx14: 'zyx',
	zyx: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Famous for .woof and needs to update his number by 3 years';
		room.say(text);
	},
	random: 'hawkie',
	hawkie: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Which random username will he switch to now?';
		room.say(text);
	},
	tikitik: 'tiki',
	tiki: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Survivor\'s Resident Russian Spy';
		room.say(text);
	},
	soccer: 'soccerz12',
	soccerz12: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Hey, what\'s up guys it\'s Soccer here';
		room.say(text);
	},
	paradise: 'para',
	para: function(target, user, room) {
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
	weeb: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Anime was a mistake';
		room.say(text);
	},
	chapterseven: 'c7',
	c7: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Survivor\'s most toxic presence';
		room.say(text);
	},
	deathbywobbuffet: 'dbw',
	wob: 'dbw',
	dbw: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me wobs';
		room.say(text);
	},
	electra: 'electrasheart',
	electrasheart: 'summmer',
	summer: 'moq',
	moq: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Don\'t moq me for all my name changes ;_;';
		room.say(text);
	},
	emmafemcario: 'morgantactician',
	morgantactician: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'Emma☯Femcario: Wind Waker, Amiibo Hunter, and  the 5 time Survivor Champion!';
		room.say(text);
	},
	pipeitup: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/ME dabs';
		room.say(text);
	},
	sanjay: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/ME resigns';
		room.say(text);
	},
	micro: 'microwavable',
	microwavable: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '*GGGHHHH*....beep beep bepp....beep beep beep...beep bee-';
		room.say(text);
	},
	henka: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += 'H E N K A B O Y S';
		room.say(text);
	},
	zygten: 'zyg',
	zyg: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '/me sighs... what is there to say?';
		room.say(text);
	},
	omroom: 'om',
	om: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '"OM Goodness! Leave OM Room alone..." ;~;';
		room.say(text);
	},
	tush: 'tushavi',
	tushavi: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text += `/pm ${user.id}, `;
		text += '>noob luck';
		room.say(text);
	},
	attackerimmunity: 'ai',
	ai: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += '**Attacker Immunity:** __The attacker doesnt die if they lose the dice battle. Only the defender can die if they lose the dice battle.__';
		this.say(room, text);
	},
	spotlight: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += '**Spotlight:** __an attacker is randomly chosen by using the !pick command, rather than sending a message to the host. The chosen user then gets to choose who they want to attack. Spotlight can be used for most themes, but not all themes.__';
		room.say(text);
	},
	secondwind: 'sw',
	sw: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += 'In the **Second Wind** game mode, every player has 2 lives';
		room.say(text);
	},
	golf: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += '**Golf:** __Lower rolls win. Opposite of normal survivor__';
		room.say(text);
	},
	counterattack: 'ca',
	ca: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += '**Counter Attack:** __If an attacker fails to kill their defending target, then their defending target will attack them right back.__';
		room.say(text);
	},
	rollswitch: 'rs',
	rs: function(target, user, room) {
		let text = '';
		if (user !== room && !(user.hasRank(room.id, '+') || Games.host && Games.host.id === user.id)) text += `/pm ${user.id}, `;
		text += '**Roll Switch:** __Randomly pick between Golf and Normal rules before each attack__';
		room.say(text);
	},
	joke: function(target, user, room) {
		let text = '';
		const jokes = ['What does a nosey pepper do? Get jalapeño business.', 'What is Bruce Lee’s favorite drink? Wataaaaah!', 'How does NASA organize their company parties? They planet.', 'Why does Snoop Dogg carry an umbrella? Fo’ drizzle.', 'What time is it when you have to go to the dentist? Tooth-hurtie.', 'There’s two fish in a tank. One turns to the other and says "You man the guns, I’ll drive"', 'Why can’t a bike stand on its own? It’s two tired.', 'How do you make Holy water? Boil the hell out of it.', 'What did one ocean say to the other ocean? Nothing, they just waved.', 'A bear walks into a bar and he asks the bartender "I\'d like some peanuts............. and a glass of milk. The bartender says "Why the big pause?"', 'Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!', 'What did the traffic light say when it stayed on red? ”You would be red too if you had to change in front of everyone!”', 'Two hats are on a hat rack. Hat #1 to hat #2 “you stay here. I’ll go on a head.”', 'Why did the tomato blush? ... it saw the salad dressing.', 'What did the football coach say to the broken vending machine? “Give me my quarterback!”', 'What did the digital clock say to the grandfather clock? Look grandpa, no hands!', 'What happens to a frog\'s car when it breaks down? It gets toad away.', 'What did the blanket say when it fell of the bed? "Oh sheet!"', 'What lights up a soccer stadium? A soccer match', 'Why shouldn\'t you write with a broken pencil? Because it\'s pointless.', 'What do you call a fake noodle? An impasta', 'Why is Peter Pan always flying? He neverlands!', 'How many tickles does it take to make an octopus laugh? Ten-Tickles', 'Why did the stadium get hot after the game? All of the fans left.', 'What did Barack Obama say to Michelle when he proposed? Obama: I don\'t wanna be obama self.', 'Why did the picture go to jail? Because it was framed!', 'What if soy milk is just regular milk introducing itself in Spanish?', 'Why couldn\'t the sesame seed leave the gambling casino? Because he was on a roll.', 'Why did the chicken cross the playground? To get to the other slide.', 'What does a cell phone give his girlfriend? A RING!', 'How did the italian chef die? He pasta away.', 'Why didn\'t the skeleton go to the party? He had no-body to dance with!', 'How does Moses make his tea? Hebrews it.', 'What do you call a sleeping bull? A bull-dozer.', 'Why didn\'t the koala get the job? He didn\'t have the koalafictions', 'What do you call a fairy that hasn\'t bathed in a year? Stinkerbell', 'What do you call two Mexicans playing basketball? Juan on Juan.', 'What do you call a guy who never farts in public? A private tutor', 'Why did the can crusher quit hit job? It was soda pressing!', 'A blonde went into a doctors office and said "doctor help I\'m terribly sick" doc replies "flu?" "no, I drove here."', 'What do you comb a rabbit with? A hare brush!', 'Why did the deer need braces? Because he had buck teeth!', 'What did the blanket say when it fell off the bed? Oh sheet!', 'Why shouldn\'t you write with an unsharpened pencil? It\'s pointless', 'What did one plate say to the other? Dinner\'s on me!', 'How do you make a tissue dance? You put a little boogey in it!', 'Want to hear a joke about paper? Never mind it\'s tearable.', 'What\'s the difference between a guitar and a fish? You can tune a guitar but you can\'t tuna fish!', 'What kind of key opens a banana? A mon-key!', 'What do you call a line of rabbits walking backwards? A receding hare line.', 'Why did the Fungi leave the party? There wasn\'t mushroom.', 'Why did the algae and the fungus get married? They took a lichen to each other.', 'Why do Toadstools grow so close together? They don\'t need Mushroom. ', 'What would a mushroom car say? Shroom shroom!', 'What room has no doors, no walls, no floor and no ceiling? A mushroom.', 'What do you get if you cross a toadstool and a full suitcase? Not mushroom for your holiday clothes!', 'Did you hear the joke about the fungus? I could tell it to you, but it might need time to grow on you.', 'What do mushrooms eat when they sit around the campfire? S\'pores.', 'What did the mushroom say when it was locked out of the house? E no ki.', 'Why wouldn\'t the teenage mushroom skip school? He didn\'t want to get in truffle', 'Why did the mushroom go to the party? It didn\'t. Mushrooms are non-sentient organic matter, so they generally don\'t get invited to parties.', 'Why did the Mushroom get invited to all the RAVE parties? \'Cuz he\'s a fungi!', 'Yo mama so poor your family ate cereal with a fork to save milk', 'Yo mama so fat, I took a picture of her last Christmas and it\'s still printing', 'What did the first cannibal say to the other while they were eating a clown? Does this taste funny to you?', 'One night Chuck Norris had a pissing contest outside of a bar. He won when his opponents drowned', 'My Dad used to say always fight fire with fire, which is probably why he got kicked out of the fire brigade', 'I like to stop the microwave at 1 second just to feel like a bomb defuser', 'I should change my facebook username to NOBODY so that way when people post crappy posts, and i press the like button it will say NOBODY likes this', 'It\'s so cold outside, I actually saw a gangster pull his pants up.', 'A gift card is a great way to say, Go buy your own fucking present', 'Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ships kitchen', 'Lazy People Fact #5812672793, You were too lazy to read that number', 'My favourite exercise is a cross between a lunge and a crunch. Its called Lunch.', 'I have the heart of a lion. And a lifetime ban from the zoo.', 'Old ladies in wheelchairs with blankets over their legs? I don’t think so… retired mermaids.', 'Years ago I used to supply filing cabinets for the mafia. Yes, I was involved in very organised crime', 'If you are being chased by a police dog, try not to go through a tunnel, then on to a little see-saw, then jump through a hoop of fire. They are trained for that', 'I named my hard drive "dat ass" so once a month my computer asks if I want to back dat ass up', 'Relationships are a lot like algebra. Have you ever looked at your X and wondered Y?', 'I swear to drunk Im not God, but seriously, stay in drugs, eat school, and dont do vegetables.', 'You haven\'t experienced awkward until you try to tickle someone who isn\'t ticklish', '"No, thanks. I\'m a vegetarian." Is a fun thing to say when someone hands you their baby', 'Maybe if we all emailed the constitution to each other, the NSA will finally read it', 'If a quiz is quizzical, then what does that make a test?', 'Whatever you do in life, always give 100%. Unless you are donating blood...', 'It is all shits and giggles until someone giggles and shits!', 'I wonder if anyone has watched Storage Wars and said "hey thats my shit!"', 'I am naming my TV remote Waldo for obvious reasons', 'I hate when I am about to hug someone really sexy and my face hits the mirror', 'Telling a girl to calm down works about as well as trying to baptize a cat', 'Dating a single mother is like continuing from somebody else\'s saved game', 'If only God can judge us than Santa has some explaining to do', 'My vacuum cleaner broke. I put a Dallas Cowboys sticker on it, and now it sucks again', 'When the zombie apocalypse finally happens, I\'m moving to Washington D.C. I figure the lack of brains there will keep the undead masses away', 'Everyone\'s middle name should be "Goddamn". Try it. Doesnt it sound so great?', 'Before Instagram, I used to waste so much time sitting around having to imagine what my friends food looked like', 'The sad moment when you return to your shitty life after watching an awesome movie', 'A big shout out to sidewalks... Thanks for keeping me off the streets', 'Buying an electric car seems like a good idea until you hit a squirrel and flip over a few times', 'I named my dog "5 miles" so I can tell people I walk 5 miles every day', 'Your future depends on your dreams, so go to sleep', 'Yawning is your bodies way of saying 20% battery remaining', 'Dont you hate it when someone answers their own questions? I do', 'Paradise.'];
		text += jokes[Math.floor(Math.random() * jokes.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) return this.say(room, text);
		user.say(text);
	},
	gif: function(target, user, room) {
		if (!user.hasRank(room.id, '#')) return;
		let text = '';
		const gifs = ['/addhtmlbox <center><img src="http://media2.giphy.com/media/u7hjTwuewz3Gw/giphy.gif" width=225 height=175/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/31c91db0b76d312b966c6adfe1c3940a/tumblr_nz57a2TvRC1u17v9ro1_540.gif" width=270 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/1gyIAEh.gif" width=380 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/RDtW8Gr.gif" width=222 height=200/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/qR77BXg.gif" width=250 height=225/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/2PZ8XUR.gif" width=385 height=216/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/451d21ddbde24e207a6f7ddd92206445/tumblr_inline_nt0ujvAJ8P1qjzu7m_500.gif" width=238 height=223/></center>', '/addhtmlbox <center><img src="http://www.keysmashblog.com/wp-content/uploads/2013/02/wig-snatching.gif" width=333 height=217/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/5f2015d7ba3f93f6c258e039d377287d/tumblr_inline_nn2r5c94m11qbxex9_500.gif" width=382 height=215/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/IFOqV6m.gif" width=387 height=218/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/hSv7KYd.gif" width=267 height=219/></center>'];
		text += gifs[Math.floor(Math.random() * gifs.length)];
		room.say(text);
	},
	agif: 'animegif',
	animegif: function(arg, user, room) {
		if (!user.hasRank(room.id, '#')) return;
		let text = '';
		const gifs = ['/addhtmlbox <center><img src="http://i.imgur.com/BzaMLzD.gif" width=345 height=194/> <br> Source: Fairy Tail</center>', '/addhtmlbox <center><img src="http://i.imgur.com/2qzxwG4.gif" width=345 height=195/> <br> Source: Toradora</center>', '/addhtmlbox <center><img src="http://i.imgur.com/BjAbTzB.gif" width=222 height=192/> <br> Source: Daily Lives of High School Boys</center>', '/addhtmlbox <center><img src="http://i.imgur.com/ys6IrQs.gif" width=267 height=191/> <br> Source:The World God Only Knows</center>', '/addhtmlbox <center><img src="http://i.imgur.com/IK4fVLX.gif" width=345 height=190/> <br> Source: Soul Eater</center>', '/addhtmlbox <center><img src="http://i.imgur.com/UE6AEZs.gif" width=353 height=196/> <br> Source: Gintama</center>', '/addhtmlbox <center><img src="http://i.imgur.com/sy6202O.gif" width=286 height=194/> <br> Source: YuriYuri</center>', '/addhtmlbox <center><img src="http://i.imgur.com/Bo1SjJX.gif" width=296 height=194/> <br> Source: Deadman Wonderland</center>', '/addhtmlbox <center><img src="http://i.imgur.com/KjTewQ7.gif" width=341 height=192/> <br> Source: Carnival Phantasm</center>', '/addhtmlbox <center><img src="http://i.imgur.com/RYaPwBT.gif" width=345 height=192/> <br> Source: Space Brothers</center>', '/addhtmlbox <center><img src="http://i.imgur.com/82lBuUf.gif" width=345 height=194/> <br> Source: Full Metal Alchemist: Brotherhood</center>', '/addhtmlbox <center><img src="http://media3.giphy.com/media/12dO0uYqeMVOy4/giphy.gif" width=260 height=195/> <br> Source: FLCL</center>', '/addhtmlbox <center><img src="https://66.media.tumblr.com/9f5d4e129f998f0c4358bf26a6d12a13/tumblr_nf0jxhnU9p1tyak95o1_500.gif" width=357 height=192/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://i.imgur.com/bYYRBiu.gif" width=286 height=194/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://pa1.narvii.com/5649/565e7d8046bd4b6223d153ce308086c42d06b773_hq.gif" width=385 height=190/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/14jigRRwHoGSo8/giphy.gif" width=342 height=192/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/LbvSbAz7CMmg8/giphy.gif" width=325 height=195/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="http://67.media.tumblr.com/ad16541d6ef3ee701c3308204574e0af/tumblr_nmd1mskOr91qam6y9o9_500.gif" width=450 height=195/> <br> Source: Kekkai Sensen</center>'];

		text += gifs[Math.floor(Math.random() * gifs.length)];
		room.say(text);
	},
	gift: 'present',
	present: function(arg, user, room) {
		let text = '';
        	const presents = [' A nice rubber red ball', ' 5 dolla, now beat it kid', ' a carton of eggnog!', '**Error 404:** You\'ve been vewy naughty :c', ' a Stonehenge! WHAT DOES IT MEAN?!', ' is another present!', ' not even a kiss', ' You thought I was going to get you something? LMAO', ' 1 trillion billion kazillion dollars! :o', ' my heart c: ', ' coal', ' The Sheep Lord\'s life supply of wool :0', ' *dies', ' Transmuter\'s beard!', ' lifetime supply of hoopla', ' a hug c:', ' Jingle Bjorn\'s password :OOOO', ' Randy ( ͡° ͜ʖ ͡°)', ' some waffles (>\'.\')>#', ' a box of CHOCOLATES!', ' the key to the underworld that gives you the chance to rule the world! muahahaha', ' a brand spanking new girlfriend... for 5 easy payments of $59.99 plusshippingandhandling', '. https://www.youtube.com/watch?v=lrAkb9AZ8Xg&feature=youtu.be', ' juan penny. :J', ' JOHN CENA *horns sound*', ' Lunarixis\' bottomless teapot', ' The magical mario mushroom!', ' The hammer of Tho', ' A bag full of sweg that belongs to... PPQ?', ' A banana (for scale)', ' A subsription to WWE SUUUPEEER SLAAAAM', ' a giant SHAD!', ' Phable\'s mixtape (Caution. May be hot.)', ' a [[jar of hearts]]', '  a terrifying creature appearing to be a blend of a cockroach and a mouse was found by a nuclear testing site. Have fun! :D', '  Shame That\'s secret manga collection', ' Imagi\'s mmm... mmm.. good Tiramisu', ' a fistbump from Saitama! (Caution: You\'ll prolly die)', ' Spieky\'s homemade razor candy', ' a Lunarixis x Don\'t Lose fanfic', ' a copy of The Rick Ross **Certified Boss** Crossfit program', ' a Sir Vivor Fedora and fake moustache!', ' a copy of the Bon Dance audition tape for High School Musical', ' __urkerab__ serenading you with a lullaby u_u', ' DEEZ NUTCRACKERS', ' a picture of Oprah Winfrey', ' is... a paper hat', ' a signed copy of __Muting Zarzel__', ' some rubbing bacon', ' a rotten pancake... it looks... pink?', ' a CAP flyer from Zeonth', ' a single M&M', ' a Nintendo SIXTY FOOOUR', ' a Hawkie egg', ' an onion', ' a bowl of soup', ' two tickets to the Nuclear War Crazed Autocracy', ' a motivational poster featuring rssp1', ' a cheetah', ' a badly photoshopped picture of PPQ with huge muscles', ' a rigged dice', ' a breadstick', ' a pina colada caught in the rain, I hope you like it', ' a scooby snack', ' a WiiStation one', ' a Swirlyder action figure', ' a Gatorade', ' Don\'t Lose\'s Rae Sremmurd Christmas & Holiday Playlist', ' a Ditto that can only transform into a Castform', ' a life', ' the copy of Pokemon Sun and Pokemon Moon that you wish you had', ' an invitation to join Paradise\'s anime club. Sugio Kawaii Desu Desu!! (◕‿◕✿)', ' Sanjay\'s resignation letter', ' a half-eaten microwavable dinner', ' The self-destroying feeling of loneliness on christmas'];
        	text += 'Inside ' + arg + '\'s present is...' + presents[Math.floor(Math.random() * presents.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) return this.say(room, text);
		user.say(text);
	},
	mods: function (target, user, room) {
		let text = 'Host it your way, with these custom mods: http://survivor-ps.weebly.com/custommodifications.html';
		if (user.hasRank(room.id, '+')) return this.say(room, text);
		user.say(text);
	},

	hostqueue: 'queue',
	que: 'queue',
	q: 'queue',
	queue: function(arg, user, room) {
		if (!Games.canQueue) return;
        	if (user.hasRank(room.id, '%') || (Config.canHost.indexOf(user.id) !== -1)) {
            		if (Games.hosts.length === 0) return this.say(room, 'There are no users in the queue.');
			let queueText = '';
			for (let i = 0; i < Games.hosts.length; i++) {
				queueText += `**${(i + 1)}.** __${Games.hosts[i][0]}__${(Games.hosts[i][1].length ? ", " + Games.hosts[i][1] : "")} `; //add formatting here, down there just adds on to the end whoops
			}
			return room.say(`/announce **Queue:** ${queueText}`);
        	} else {
			if (Games.hosts.length === 0 && room.id.charAt(0) !== ',') return user.say('There are currently no users in the queue.');
			let queueText = '';
			for (let i = 0; i < Games.hosts.length; i++) {
				queueText += `**${(i + 1)}.** __${Games.hosts[i]}__ `;
			}
			if (room.id.charAt(0) === ',') return room.say(`/announce **Queue:** ${queueText}`);
			user.say(`/announce **Queue:** ${queueText}`);
        	}
		Games.canQueue = false;
		setTimeout(() => Games.canQueue = true, 5000);
	},

	pick: function (target, user, room) {
		const stuff = target.split(",");
		const str = `<i>We randomly picked:</i> ${Tools.sample(stuff)}`;	
		if ((user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) && room.id === 'survivor') {
			room.say(`/pminfobox ${user.id}, ${str}`);
		} else if (user.id === room.id) {
			Rooms.get('survivor').say(`/pminfobox ${user.id}, ${str}`);
		} else {
			room.say(`!htmlbox ${str}`);
		}
	},

	timer: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		if (toId(target) === "end") {
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
		const minutes = Math.floor(x / 60);
		const seconds = x % 60;
		clearTimeout(Games.timeout);
		this.say(room, "Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
		Games.timeout = setTimeout(() => Games.timer(room), x * 1000);
		Games.isTimer = true;
	},

	weak: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && (!Games.host || Games.host.id !== user.id)) return;
		let types = ["normal", "fire", "water", "grass", "steel", "psychic", "ghost", "dark", "bug", "poison", "ground", "rock", "dragon", "ice", "fairy", "fighting", "flying", "electric"];
		if (target.endsWith('type')) target = target.substr(0, target.length - 4);
		if (types.indexOf(target) !== -1) return room.say(`!weak ${target}`);
		room.say("Please enter a valid type.");
	},

	next: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return;
		const d = new Date();
		let n = d.getHours();
		let m = d.getMinutes();
		let millis = (60 - m) * 60 * 1000;
		if (n < 15) {
			millis += (14 - n) * 60 * 60 * 1000;
		} else if (n < 22) {
			millis += (21 - n) * 60 * 60 * 1000;
		} else {
			millis += (27 - n) * 60 * 60 * 1000;
		}
		room.say(`The next Daily Deathmatch is in ${millisToTime(millis)}.`)
	},
	
	allowroll: function (target, user, room) {
		if (!user.hasRank(room.id, '%') && (Config.canHost.indexOf(user.id) === -1) && (!Games.host || Games.host.id !== user.id)) return;
		if (!target) return;
		let split = target.split(",");
		const goodnames = [], badnames = [], alreadynames = [];
		for (let i = 0; i < split.length && Games.excepted.length < 2; i++) {
			let user = Users.get(toId(split[i]));
			if (!user) continue;
			if (user.hasRank(room.id, '+')) {
				alreadynames.push(user.name);
				continue;
			}
			goodnames.push(user.name);
			Games.excepted.push(user.id);
		}
		for (let i = 0; i < split.length; i++) {
			let user = Users.get(toId(split[i]));
			if (!user) continue;
			badnames.push(user.name);
		}
		if (goodnames.length > 0 && badnames.length > 0) {
			room.say(`${goodnames.join(", ")} ${(goodnames.length > 1 ? 'were' : 'was')} allowed a roll! Unfortunately, ${badnames.join(", ")} could not be added, since only 2 users can be allowed at a time.`);
		} else if (goodnames.length > 0) {
			room.say(`${goodnames.join(", ")} ${(goodnames.length > 1 ? 'were' : 'was')} allowed a roll!`);
		} else if (badnames.length > 0) {
			room.say(`Unfortunately, ${badnames.join(", ")} could not be added, since only 2 users can be allowed at a time.`);
		}
		if (alreadynames.length > 0) {
			room.say(`${alreadynames.join(", ")} could not be given a roll, since they already have access to the command.`);
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
			const str = `Roll (1 - ${roll}) ${(adder ? "+" + adder : "")}: ${sum}`;
			if ((user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) && room.id === 'survivor') {
				room.say(`/addhtmlbox ${str}`);
			} else if (user.id === room.id) {
				Rooms.get('survivor').say(`/pminfobox ${user.id}, ${str}`);
			} else {
				room.say(`!htmlbox ${str}`);
			}
		} else {
			const str = `${numDice} Rolls (1 - ${roll}): ${rolls.join(", ")} <br></br>Sum: ${sum}`;
			if ((user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) && room.id === 'survivor') {
				room.say(`/addhtmlbox ${str}`);
			} else if (user.id === room.id) {
				Rooms.get('survivor').say(`/pminfobox ${user.id}, ${str}`);
			} else {
				room.say(`!htmlbox ${str}`);
			}
		}
	},

	signups: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(`${Games.host.name} is hosting a game.`);
		if (room.game) return room.say(`A game of ${room.game.name} is in progress.`);
		if (!Games.createGame(target, room)) return;
		room.game.signups();
	},
	randgame: 'randomgame',
	randomgame: function (arg, user, room) {
	    if (!user.hasRank(room.id, '+')) return;
		if (!Config.allowGames) return room.say("I will be restarting soon, please refrain from beginning any games.");
		if (Games.host) return room.say(`${Games.host.name} is hosting a game.`);
		if (room.game) return room.say(`A game of ${room.game.name} is in progress.`);
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
	},
	endgame: 'end',
	end: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		if (!room.game && Games.host) {
			Games.host = null;
			room.say('The game was forcibly ended.');
			return;
		}
		room.game.forceEnd();
		room.say('The game was forcibly ended.');
	},

	submit: function (target, user, room) {
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return;
		room.say('Visit https://docs.google.com/forms/d/e/1FAIpQLSeY2Ndt-wC3iUXsY4yKVnGarHTBa1a4C75UYYLHpHH1qzsCrQ/viewform#responses to submit roasts, jokes, and replies!');
	},

	moo: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+')) text += `/pm ${user.id}, `;
		text += '/me MOOs';
		room.say(text);
	},

	startgame: 'start',
	start: function (target, user, room) {
	    if (!user.hasRank(room.id, '+') || !room.game) return;
	    if (typeof room.game.start === 'function') room.game.start();
	},

	mk: 'modkill',
	modkill: function (target, user, room) {
		const text = "A modkill (or mk) occurs when a player does not provide an action and so they are eliminated";
		if (user.hasRank(room.id, '+')) return room.say(text);
		user.say(text);
	},
	bomb: function (target, user, room) {
		const text = "A bomb is a player that, when eliminated, \"explodes\" and eliminates the player that eliminated them.";
		if (user.hasRank(room.id, '+')) return room.say(text);
		user.say(text);
	},

	roast: function (target, user, room) {
		if (!user.hasRank(room.id, '%') || Config.canHost.indexOf(user.id) !== -1) return;
		const roasts = [`If i wanted to die, I would climb to the top of ${target}'s ego and jump to their IQ`, `${target}, I was going to give you a nasty look but I see that you’ve already got one.`, `${target}, you always bring me so much joy. As soon as you leave the room.`, `${target}, some day you'll go far - and i really hope you stay there.`, `To call ${target} a donkey would be an insult to the donkey.`, `${target}, You're the reason the gene pool needs a lifeguard`, `${target}'s breath is so bad, their dentist treats them over the phone.`, `I tried making ${target} my password but my computer said it was too weak.`, `If laughter is the best medicine, ${target}'s face must be curing the world.`, `${target}, you remind me of Kurt Angle. You suck!`, `${target}, your presence here is as bad as __OM Room__\'s theme`, `${target}, you remind me of gold. You weigh a fuck ton.`, `${target}, your body looks like a kindergartners attempt to make a person out of playdoh`, `${target}, my mom asked me to take out the trash so what time should I pick you up?`, `No, those __pants__ don't make ${target} look fatter - how could they?`, `If ${target} is gonna be two-faced, why can't at least one of them be attractive?`, 'Accidents happen. LIKE YOU!', `${target} is proof god has a sense of humor`];
		room.say(Tools.sample(roasts));
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
		let names = [];
		for (const name of split) {
			dd.addPart(name);
			names.push(name.trim());
		}
		room.say(`First place awarded to: **${split[1].trim()}**. Second place awarded to: **${split[2].trim()}**. Host points awarded to: **${split[0].trim()}**.`);
		room.say(`Participation points awarded to: **${names.join(", ")}**.`);
		dd.updateModlog(`${user.name} did .addpoints ${target}`);
		dd.updateModlog(`First place awarded to: **${split[1].trim()}**. Second place awarded to: **${split[2].trim()}**. Host points awarded to: **${split[0].trim()}**.`);
		dd.updateModlog(`Participation points awarded to: **${names.join(", ")}**.`);
	},
	dd: function(target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) return text += `/pm ${user.id}, `;
		text += "Daily Deathmatch (DD) is Survivor's system for official games, in which two games are hosted daily at 11AM and 6PM EST. For every DD you participate in, you earn points, and the person with the most points at the end of the month is champion!";
		room.say(text);
	},

	firsts: 'first',
	first: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addFirst(target);
		user.say(`First place points awarded to: **${target}**.`);
		dd.updateModlog(`${user.name} did .first ${target}`);
		dd.updateModlog(`First place points awarded to: **${target}**.`);
	},
	skipdd: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		dd.numSkips++;
		user.say(`1 dd skip added, there are ${dd.numSkips} remaining.`);
	},
	removeskipdd: 'rmskipdd',
	rmskipdd: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		if (dd.numSkips === 0) return user.say("No dds have been skipped this month.");
		dd.numSkips--;
		user.say(`1 dd skip removed, there are ${dd.numSkips} remaining.`);
	},
	seconds: 'second',
	second: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addSecond(target);
		user.say(`Second place points awarded to: **${target}**.`);	
		dd.updateModlog(`${user.name} did .second ${target}`);
		dd.updateModlog(`Second place points awarded to: **${target}**.`);
	},
	hp: 'hostpoints',
	hostpoints: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		dd.addHost(target);
		user.say(`Host points awarded to: **${target}**.`);
		dd.updateModlog(`${user.name} did .hostpoints ${target}`);
		dd.updateModlog(`Host points awarded to: **${target}**.`);
	},
	addspecial: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		const split = target.split(",");
		if (split.length !== 2) return user.say("You must specify number of points and the user to add them to.");
		const username = split[0];
		const numPoints = parseInt(split[1]);
		if (!numPoints) return user.say(`'${split[1]}' is not a valid number of points to add.`);
		dd.addSpecial(username, numPoints);
		user.say(`**${numPoints}** have been added to **${username.trim()}** on the dd leaderboard.`);
	},
	part: 'participation',
	parts: 'participation',
	participation: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		const split = target.split(",");
		split.map(s => dd.addPart(s.trim()));
		const msg = `Participation points awarded to: **${split.join(", ")}**.`;
		if (msg.length > 300) {
			const len = split.length;
			const firstHalf = split.slice(0, Math.floor(len / 2.0));
			const secondHalf = split.slice(Math.floor(len / 2.0));
			user.say(`Participations points awarded to: **${firstHalf.join(", ")}**.`);
			user.say(`and **${secondHalf.join(", ")}**.`);
		} else {
			user.say(msg);
		}
		dd.updateModlog(`${user.name} did .parts ${target}`);
		dd.updateModlog(msg);
	},

	rmfirst: 'removefirst',
	removefirst: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg;
		if (dd.removeFirst(target)) {
			msg = `First place removed from: **${target}**.`;
		} else {
			msg = `**${target}** has never won a game!`;
		}
		user.say(msg);
		dd.updateModlog(`${user.name} did .removefirst ${target}`);
		dd.updateModlog(msg);
	},
	
	rmsecond: 'removesecond',
	removesecond: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg;
		if (dd.removeSecond(target)) {
			msg = `Second place removed from: **${target}**.`;
		} else {
			msg = `**${target}** has never placed second!`;
		}
		user.say(msg);
		dd.updateModlog(`${user.name} did .removesecond ${target}`);
		dd.updateModlog(msg);
	},

	rmhost: 'removehost',
	rmhosts: 'removehost',
	removehost: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let msg;
		if (dd.removeHost(target)) {
			msg = `Host removed from: **${target}**.`;
		} else {
			msg = `**${target}** has never hosted dd!`;
		}
		user.say(msg);
		dd.updateModlog(`${user.name} did .removehost ${target}`);
		dd.updateModlog(msg);
	},
	removeparts: 'removepart',
	removeparticipation: 'removepart',
	rmpart: 'removepart',
	rmparts: 'removepart',
	removepart: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		const split = target.split(",");
		const good = [];
		const bad = [];
		for (const name of split) {
			if (dd.removePart(name)) {
				good.push(name);
			} else {
				bad.push(name);
			}
		}
		let msg;
		if (good.length > 0 && bad.length > 0) {
			msg = `Participations removed from: **${good.join(", ")}**. I was unable to remove participation from **${bad.join(", ")}**.`;
		} else if (good.length > 0) {
			msg = `Participations removed from: **${good.join(", ")}**.`;
		} else {
			msg = `I was unable to remove participations from **${bad.join(", ")}**.`;
		}
		user.say(msg);
		dd.updateModlog(`${user.name} did .removeparts ${target}`);
		dd.updateModlog(msg);
	},
	
	ddlog: function (target, user, room) {
		if (!user.hasRank('survivor', '+')) return;
		if (!("data" in dd.modlog)) return;
		let buffer = '';
		for (const modData of dd.modlog.data) {
			buffer += `${modData}\n`;
		}
		Tools.uploadToHastebin(buffer, (success, link) => {
			if (success) return user.say(link);
			user.say('Error connecting to hastebin.');
        	});
	},

	testroom: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		Rooms.get('survivor').say("/subroomgroupchat testing");
		Rooms.get('survivor').say("/join groupchat-survivor-testing");
		this.say(room, "<<groupchat-survivor-testing>> to test stuff!");
	},
	ddoverall: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		const sorted = dd.getSorted();
		let longestLength = 0;
		const numTabsSpaces = 8.0;
		for (let i = 0; i < sorted.length; i++) {
			let length = sorted[i][5].length;
			if (length > longestLength) longestLength = length;
		}
		let numTabs = Math.ceil(longestLength / numTabsSpaces);
		let sep = "";
		for (let i = 0; i < longestLength; i += numTabsSpaces) {
			sep += "\t";
		}
		let buffer = `Rank\tName${sep}Firsts\tSeconds\tParts\tHosts\tSpecial\tPoints\t\n`;
		const real = [5,1,2,3,0,4];
		for (let i = 0; i < sorted.length; i++) {
			for (let j = 0; j < 8; j++) {
				let stuff;
				if (j === 0) stuff = i + 1;
				else if (j === 7) stuff = dd.getPoints(sorted[i]);
				else stuff = sorted[i][real[j - 1]];
				buffer += stuff;
				if (j === 1) {
					let numCursTabs = numTabs - Math.ceil(sorted[i][real[j - 1]].length / numTabsSpaces);
					const till = numCursTabs + (sorted[i][5].length %8 === 0 ? 0 : 1);
					for (let l = 0; l < till; l++) {
						buffer += "\t";
					}
				} else {
					buffer += "\t";
				}
			}
			buffer += "\n";
		}
		Tools.uploadToHastebin(buffer, (success, link) => {
			if (success) return room.say(link);
			user.say('Error connecting to hastebin.');
        	});
	},

	chatlines: function (target, user, room) {
		if (!user.hasRank('survivor', '%')) return;
		const split = target.split(',');
		let numDays = parseInt(split[1]);
		if (!numDays) numDays = 7;
		let targetID = toId(split[0]);
		if (!(targetID in chatmes)) return user.say(`**${split[0]}** has never said anything in chat.`);
		const messages = chatmes[targetID].messages;
		const targetName = chatmes[targetID].name;
		const lines = {};
		function getDayInfo(daysPrevious) {
			const today = new Date();
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
		let overallstr = `${targetName} Chat Lines:\n`;
		for (let i = numDays; i >= 0; i--) {
			let dayInfo = getDayInfo(i);
			const str = (dayInfo[1] >= 9 ? "" : "0") + (dayInfo[1] + 1) + "-" + (dayInfo[0] > 9 ? "" : "0") + (dayInfo[0]) + "-" + dayInfo[2];
			lines[str] = 0;
			for (const message of messages) {
				if (message.day === dayInfo[0] && message.month === dayInfo[1] && message.year === dayInfo[2]) lines[str]++;
			}
			overallstr += `${str}: ${lines[str]}\n`;
		}
		Tools.uploadToHastebin(overallstr, (success, link) => {
			if (success) return room.say(`**${targetName}**'s chat line count: ${link}`);
			user.say('Error connecting to hastebin.');
        	});
	},
	toppoints: 'top',
	top: function (target, user, room) {
		if (room.id !== user.id && !user.hasRank(room.id, '+')) return;
		const sorted = dd.getSorted();
		let num = parseInt(target);
		if (!num || num < 1) num = 50;
		if (num > sorted.length) num = sorted.length;
		if (room.id === user.id) {
			let str = '<div style="overflow-y: scroll; max-height: 250px;"><div class="infobox"><html><body><table align="center" border="2"><tr>';
			let indices = ["Rank", "Name", "Points"];
			for (let i = 0; i < 3; i++) {
				str +=  `<td style=background-color:#FFFFFF; height="30px"; align="center"><b><font color="black"> ${indices[i]} </font></b></td>`;
			}
			str += "</tr>"
			let strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < 3; j++) {
					let stuff;
					if (j === 0) stuff = i + 1;
					else if (j === 1) stuff = sorted[i][5];
					else stuff = dd.getPoints(sorted[i]);
					strx += `<td style=background-color:#FFFFFF; height="30px"; align="center"><b><font color="black">${stuff}</font></b></td>`;
				}
				strs.push(`${strx}</tr>`);
			}
			str += strs.join("");
			str += "</table></body></html></div></div>";	
			this.say(Rooms.get('survivor'), `/pminfobox ${user.id}, ${str}`);
		} else {
			let str = '<div style="overflow-y: scroll; max-height: 250px;"><div class="infobox"><html><body><table align="center" border="2"><tr>';
			const indices = ["Rank", "Name", "Firsts", "Seconds", "Parts", "Hosts", "Special", "Points"];
			for (let i = 0; i < indices.length; i++) {
				str +=  `<td style=background-color:#FFFFFF; height="30px"; align="center"><b><font color="black">${indices[i]}</font></b></td>`;
			}
			str += "</tr>";
			const real = [5, 1, 2, 3, 0, 4];
			const strs = [];
			for (let i = Math.max(0, num - 50); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < indices.length; j++) {
					let stuff;
					if (j === 0) {
						stuff = i+1;
					} else if (j === (indices.length - 1)) {
						stuff = dd.getPoints(sorted[i]);
					} else {
						stuff = sorted[i][real[j - 1]];
					}
					strx += `<td style=background-color:#FFFFFF; height="30px"; align="center"><b><font color="black">${stuff}</font></b></td>`;
				}
				strs.push(`${strx}</tr>`);
			}
			str += strs.join("");
			str += "</table></body></html></div></div>";
			if (room.id === 'survivor') {
				room.say(`/addhtmlbox ${str}`);
			} else {
				room.say(`!htmlbox ${str}`);
			}
		}
		let numFirsts = 0;
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
		}
		numFirsts += dd.numSkips;
		const month = new Date().getMonth();
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if (numFirsts === 0) return room.say("No games have been updated yet this month!");
		const times = ['6pm EST', '11am EST'];
		room.say(`The last Daily Deathmatch updated was the ${times[numFirsts%2]} game on ${months[month]} ${(Math.floor((numFirsts + 1)/2))}.`);	
	},

	rename: function (target, user, room) {
		if (!target) return;
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		const split = target.split(",");
		if (split.length < 2) return user.say("You must specify an old and new username");
		let realt = toId(split[0])
		if (!(realt in dd.dd)) return user.say(`**${split[0]}** is not on the dd leaderboard.`);
		const newid = toId(split[1]);
		const newdata = (newid in dd.dd ? dd.dd[newid] : {});
		const oldname = dd.dd[realt].name;
		dd.dd[newid] = dd.dd[realt];
		if (realt !== newid) {
			for (let i in newdata) {
				dd.dd[newid][i] += newdata[i];
			}
		}
		dd.dd[newid].name = split[1].trim();
		if (realt !== newid) delete dd.dd[realt];
		user.say(`**${oldname}** has been renamed to **${split[1].trim()}**.`);
	},

	clearlb: function (target, user, room) {
		if (!user.hasRank('survivor', '#')) return;
		if (user.lastcmd !== 'clearlb') return room.say("Are you sure you want to clear the dd leaderboard? If so, type the command again.");
		dd.dd = {};
		dd.numSkips = 0;
		room.say("The dd leaderboard has been reset.");
	},
	points: function (target, user, room) {
		if (room.id !== user.id) return;
		target = toId(target);
		if (!target) target = user.id;
		if (!(target in dd.dd)) return user.say(`**${target}** does not have any points.`);
		const sorted = dd.getSorted();
		for (let i = 0; i < sorted.length; i++) {
			let stuff = sorted[i];
			if (toId(stuff[5]) === target) {
				return user.say(`**${stuff[5]}** is #${(i + 1)} on the leaderboard with ${dd.getPoints(stuff)} points, consisting of ${stuff[0]} hosts, ${stuff[1]} first places, ${stuff[2]} second places, and ${stuff[3]} participations.`);
			}
		}
	},

	lastgame: function (target, user, room) {
		if (!user.hasRank('survivor', '%') && (Config.canHost.indexOf(user.id) === -1)) return;
		let numFirsts = 0;
		const sorted = dd.getSorted();
		for (let i = 0; i < sorted.length; i++) {
			numFirsts += sorted[i][1];
		}
		let month = new Date().getMonth();
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if (numFirsts === 0) return room.say("No games have been updated yet this month!");
		const times = ['6pm EST', '2am EST', '12pm EST'];
		room.say(`The last Daily Deathmatch to be updated was the ${times[numFirsts%3]} game on ${months[month]} ${(Math.floor((numFirsts + 1)/3))}.`);	
	},

	repeat: function (target, user, room) {
		if (!user.hasRank('survivor', '%') || room === user) return;
		room.trySetRepeat(target, user);
	}
};

/* globals toId */
