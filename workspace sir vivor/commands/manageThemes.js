const themeRepository = require('../classes/ThemeRepository.js');

module.exports = {
    addtheme: async function (target, user, room) {
        if (!user.isExcepted()) return false;

        const [name, url, desc] = target.split(',').map(part => part.trim());
        if (!name || !url || !desc) {
            return user.say("Usage: .addtheme [name], [url], [description]");
        }

        const themeRepo = new themeRepository();
        const theme = { name, url, desc };

        try {
            await themeRepo.add(theme);
            user.say(`Theme "${name}" added successfully.`);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                user.say(`Theme "${name}" already exists.`);
            } else {
                user.say("Error adding theme: " + error.message);
            }
        } finally {
            themeRepo.db.close();
        }
    },
    theme: 'themes',
	themes: async function (arg, user, room) {
		if (!Games.canTheme) return;
		let target = user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id) ? room : user;
        let theme;
        const themeRepo = new themeRepository();
		arg = toId(arg);
		if (!arg) return target.say("The list of game types can be found here: https://sites.google.com/view/survivor-ps/themes");
		//if (!gameTypes[arg]) return target.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");
        try {
			theme = await themeRepo.getById(arg); // theme = [name: 'name', url: 'url', desc: 'desc']
		} catch (error) {
			return target.say("Error retrieving theme: " + error.message);
		} finally {
            themeRepo.db.close();
        }
		//if (typeof data === 'string') data = gameTypes[data];

		let text = '**' + theme.name + '**: __' + theme.desc + '__ Game rules: ' + theme.url;
		//if (Games.host) {
		//	Games.hosttype = data[3];
		//}
		target.say(text);
		if (room == user) return;
		Games.canTheme = false;
		var t = setTimeout(function () {
			Games.canTheme = true;
		}, 5 * 1000);
	},

};