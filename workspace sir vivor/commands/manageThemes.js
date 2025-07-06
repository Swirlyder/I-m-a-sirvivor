const themeRepository = require('../classes/ThemeRepository.js');

module.exports = {
    addtheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [name, url, desc] = target.split(',').map(part => part.trim());
        if (!name || !url || !desc) {
            return user.say("To use this command, follow the following format:.addtheme [name], [url], [description]");
        }

        const themeRepo = new themeRepository();
        const theme = { name, url, desc };

        try {
            await themeRepo.add(theme);
            user.say(`Theme "${name}" added successfully.`);
        } catch (error) {
                user.say("Error adding theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    editthemename: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [themeId, newName] = target.split(',').map(part => part.trim());
        if (!themeId || !newName ) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName]");
        }

        const themeRepo = new themeRepository();

        try {
            let theme = await themeRepo.getById(themeId);
            theme.name = newName;
            await themeRepo.update(theme);
            user.say(`Theme "${newName}" updated successfully.`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    editthemeurl: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [themeId, newUrl] = target.split(',').map(part => part.trim());
        if (!themeId || !newUrl ) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewUrl]");
        }

        const themeRepo = new themeRepository();

        try {
            let theme = await themeRepo.getById(themeId);
            theme.url = newUrl;
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" updated with a new url: ${newUrl}.`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    editthemedesc: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [themeId, newDesc] = target.split(',').map(part => part.trim());
        if (!themeId || !newDesc ) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewDescription]");
        }

        const themeRepo = new themeRepository();

        try {
            let theme = await themeRepo.getById(themeId);
            theme.desc = newDesc;
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" updated updated with a new description: ${newDesc}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    edittheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [themeId, newName, newUrl, newDesc] = target.split(',').map(part => part.trim());
        if (!themeId || !newName || !newUrl || !newDesc ) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName], [NewUrl], [NewDesc]");
        }

        const themeRepo = new themeRepository();
        try {
            let theme = {id:themeId, name:newName, url:newUrl, desc:newDesc};
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" succesfully updated!`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    deletetheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [themeId] = target.split(',').map(part => part.trim());
        if (!themeId) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName], [NewUrl], [NewDesc]");
        }

        const themeRepo = new themeRepository();
        try {
            await themeRepo.delete(themeId);
            user.say(`Theme succesfully deleted!`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
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