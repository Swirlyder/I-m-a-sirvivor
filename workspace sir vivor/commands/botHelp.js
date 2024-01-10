	/***********************************************
	 *                HELP COMMANDS                *
	 ***********************************************
	 * These commands are here to provide          *
	 * information about the bot.                  *
	 ***********************************************/
module.exports = {

	git: function (arg, user, room) {
		let target = user.hasRank(room, '+') ? room : user;
		let text = !Config.fork ? "No source code link found." : "The source code for this bot can be found here: " + Config.fork;
		target.say(text);
	},

	credits: 'about',
	about: function (arg, user, room) {
		user.say(`I am a bot made for the Survivor room. Please contact Survivor room auth for any questions regarding me!`)
	},

	help: 'commands',
	guide: 'commands',
	commands: function (arg, user, room) {
		let target = user.hasRank(room, '+') ? room : user;
		let text = "The guide for my commands is here: https://docs.google.com/document/d/e/2PACX-1vSkPg4Wao_p7WB2q1FIrBZuRYydluHgg0OYoC3sDoooWvy6IqOdQ5zn3-SjrSfKz60RQm33M9Ekbqzj/pub";
		room.say(text);
	},
};