const themeRepository = require('../classes/ThemeRepository.js').themesRepository;
const themeAliasRepository = require('../classes/ThemeRepository.js').themeAliasRepository;

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
        if (!themeId || !newName) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
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
        if (!themeId || !newUrl) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewUrl]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
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
        if (!themeId || !newDesc) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewDescription]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
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
        if (!themeId || !newName || !newUrl || !newDesc) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName], [NewUrl], [NewDesc]");
        }

        const themeRepo = new themeRepository();

        try {
            let theme = { id: themeId, name: newName, url: newUrl, desc: newDesc };
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" succesfully updated!`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    //TODO: Deleting a theme should delete delete the corresponding theme aliases where theme.id = theme_alias.theme_id
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
    addthemealias: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const parts = target.split(',').map(part => part.trim());
        const themeIdOrName = parts.shift(); // this variable can be a theme name or theme id
        const aliases = parts;


        if (!themeIdOrName || aliases.length === 0) {
            return user.say("Usage: .addthemealias [theme_id], [alias1], [alias2], ...");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, themeIdOrName);
            if (!theme) return user.say("Theme not found.");

            for (const name of aliases) {
                const alias = { name, theme_id: theme.id };
                await themeAliasRepo.add(alias);
            }
            user.say(`Theme aliases [${aliases.join(', ')}] added for theme ID ${theme.id}.`);
        } catch (error) {
            user.say("Error adding theme: " + error.message);
        } finally {
            themeAliasRepo.db.close();
            themeRepo.db.close();
        }
    },

    deletethemealias: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;
        let themeAliasId;

        const [arg] = target.split(',').map(part => part.trim()); // arg can be theme_alias id or name
        if (!arg) {
            return user.say("To use this command, follow the following format: .editthemename [id], [NewName], [NewUrl], [NewDesc]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            if (await themeAliasRepo.themeAliasExists(arg)) {
                themeAliasId = (await themeAliasRepo.getByAlias(arg)).id;
            }
            else if (await themeAliasRepo.themeAliasIdExists(arg)) {
                themeAliasId = arg;
            }
            else {
                return user.say("Theme alias not found.");
            }

            await themeAliasRepo.delete(themeAliasId);
            user.say(`Theme succesfully deleted!`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeAliasRepo.db.close();
        }
    },

    theme: 'themes',
    themes: async function (arg, user, room) {
        if (!Games.canTheme) return;
        let target = user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id) ? room : user;
        let theme;

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        arg = toId(arg);

        try {
            theme = await getTheme(themeRepo, themeAliasRepo, arg);
        } catch (error) {
            return target.say("Error retrieving theme: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }

        if (!theme) return target.say("Invalid game type. The game types can be found here: https://sites.google.com/view/survivor-ps/themes");

        let text = '**' + theme.name + '**: __' + theme.desc + '__ Game rules: ' + theme.url;
        target.say(text);

        if (room == user) return;

        //5 second timeout between uses
        Games.canTheme = false;
        var t = setTimeout(function () {
            Games.canTheme = true;
        }, 5 * 1000);
    },
};

// helper functions

async function getTheme(themeRepo, themeAliasRepo, arg) {
    // arg is theme id
    if ((!isNaN(arg)) && (await themeRepo.themeIdExists(arg))) {
        return await themeRepo.getById(arg);
    }

    // arg is theme name
    if (await themeRepo.themeNameExists(arg)) {
        return await themeRepo.getByName(arg);
    }

    // arg is theme alias
    if (await themeAliasRepo.themeAliasExists(arg)) {
        return await themeRepo.getByAlias(arg);
    }

    return null;
}

