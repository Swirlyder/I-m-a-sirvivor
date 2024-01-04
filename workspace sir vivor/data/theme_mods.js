const modTypes = {
	/**
	 * Modification list
	 *
	 * These key-value pairs represent themes that can be accessed 
	 * using the .mod command.
	 */

	advantage: ['Advantage', 'When a player is successful with an attack, they gain an extra roll when attacking and defending. Host takes the higher roll.'],
	anonymous: ['Anonymous', 'The host will ask players for nicknames before the game begins and players will attack nicknames rather than usernames.'],
	anon: 'anonymous',
	ai: ['Attacker\'s Immunity (AI)', 'If the attacker loses the roll, they are not eliminated.'],
	attackersimmunity: 'ai',
	bomb: ['Bomb', 'The host picks one or more players to be a bomb. A player who kills a bomb dies too.'],
	counterattack: ['Counter Attack', 'If an attacker fails to kill their defending target, then their defending target will attack them right back.'],
	counter: 'counterattack',
	ca: 'counterattack',
	disadvantage: ['Disadvantage', 'When a player is successful with an attack, they gain an extra roll when attacking and defending. Host takes the lower roll.'],
	dissolve: ['Dissolve', 'Any time the attacker fails to do damage or eliminate their opponent, the attacker loses -10 to their roll for the remainder of the game.'],
	empire: ['Empire', 'Before the game starts, players pick between two empires. The host then makes two PLs based on the players\' choices, and carries out the game as if it were two games, one per empire. The winners of each empire make it to finals.'],
	golf: ['Golf', 'The lower roll wins.'],
	hp: ['Hit Points (HP)', 'Players start the game with HP. The loser of an attack loses HP equal to the higher roll minus the lower roll. A player is eliminated when their HP reaches 0 or below.'],
	hitpoints: 'hp',
	berserk: ['Berserk (HP)', 'As you lose HP, your roll increases for every hit point you lose. (use with HP modification)'],
	sturdy: ['Sturdy (HP)', 'If a player is one-shot by an opponent while they are at full HP, instead of dying, they remain alive with 1 HP remaining. (use with HP modification)'],
	killstreak: ['Kill Streak', 'Players are not eliminated when they lose a roll battle, but players must win by getting a certain number of roll battle victories or having the most victories in a certain number of rounds.'],
	ks: 'killstreak',
	minefield: ['Minefield', 'The host does .roll 10 followed by .pick beginning, end to decide the mines. If a player rolls a mine, they automatically die.'],
	overkill: ['Overkill', 'If a player wins a roll by 50 or more, they get to attack another player with a roll bonus of +25.'],
	resistance: ['Resistance', 'Host rolls a number which becomes the resistance number. The winner of any roll battle must beat their opponent by the resistance number or higher in order for their attack to be successful.'],
	res: 'resistance',
	rollswitch: ['Roll Switch', 'Hosts use .pick golf, reg before rolling each attack.'],
	rs: 'rollswitch',
	secondwind: ['Second Wind', 'Players have 2 lives each.'],
	sw: 'secondwind',
	spotlight: ['Spotlight', 'Instead of sending the host your attacks in PMs the host uses !pick or .pick to choose a person who shall attack and say it in the chat.'],
	tagteam: ['Tag Team', 'Players are in teams of 2, one member represents the team in battle. Each round, teams can switch their representative by tagging, and they attack a member of an opposing team, whichever member they believe will be tagged in for the attack.'],
	tag: 'tagteam',
	weardown: ['Wear Down', 'Whatever the player rolls last will become their new max roll. If they get to 1, they are eliminated.'],
	wd: 'weardown',
};

module.exports = modTypes;