const themeRepository = require('../classes/ThemeRepository.js').themesRepository;
const themeAliasRepository = require('../classes/ThemeRepository.js').themeAliasRepository;
const themesDbHtml = require('../classes/HTMLPage.js').ThemesDB; 

//TODO: rework all these functions to incorporate theme difficulty
module.exports = {
    addtheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [name, url, desc, difficulty] = target.split(',').map(part => part.trim());
        if (!name || !url || !desc || !difficulty) {
            return user.say("Example:.addtheme [name], [url], [description], [difficulty]");
        }

        const themeRepo = new themeRepository();
        const theme = { name, url, desc, difficulty };

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

        const [arg, newName] = target.split(',').map(part => part.trim());  // arg can be theme id, name, or alias
        if (!arg|| !newName) {
            return user.say("Example: .editthemename [themeID_or_themeName_or_themeAlias], [NewName]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .editthemename [ID or Name or Alias], [NewName]");
            theme.name = newName;
            await themeRepo.update(theme);
            user.say(`Theme name updated to "${newName}".`);
        } catch (error) {
            user.say("Error updating theme name: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }
    },
    editthemeurl: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [arg, newUrl] = target.split(',').map(part => part.trim());  // arg can be theme id, name, or alias
        if (!arg || !newUrl) {
            return user.say("Example: .editthemeurl [ID or Name or Alias], [NewUrl]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .editthemeurl [ID or Name or Alias], [NewUrl]");
            theme.url = newUrl;
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" updated with a new url: ${newUrl}.`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }
    },
    editthemedesc: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [arg, newDesc] = target.split(',').map(part => part.trim()); // arg can be theme id, name, or alias
        if (!arg || !newDesc) {
            return user.say("Example: .editthemedesc [ID or Name or Alias], [NewDescription]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .editthemeurl [ID or Name or Alias], [NewDescription]");
            theme.desc = newDesc;
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" updated updated with a new description: ${newDesc}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }
    },
    editthemediff: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [arg, newDiff] = target.split(',').map(part => part.trim());
        if (!arg || !newDiff) {
            return user.say("Example: .editthemediff [ID or Name or Alias], [NewDifficulty]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .editthemediff [ID or Name or Alias], [NewDifficulty]");
            theme.difficulty = newDiff;
            await themeRepo.update(theme);
            user.say(`Theme "${theme.name}" updated updated with a new diffculty: ${newDiff}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }
    },
    edittheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [arg, newName, newUrl, newDesc, newDiff] = target.split(',').map(part => part.trim()); // arg can be theme id, name, alias
        if (!arg || !newName || !newUrl || !newDesc) {
            return user.say("Example: .edittheme [ID or Name or Alias], [NewName], [NewUrl], [NewDesc], [NewDifficulty]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let themeBefore = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!themeBefore) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .edittheme [ID or Name or Alias], [NewName], [NewUrl], [NewDesc], [NewDifficulty]");

            let theme = { id: themeBefore.id, name: newName, url: newUrl, desc: newDesc, difficulty: newDiff};
            await themeRepo.update(theme);
            user.say(`Theme updated! | **Name**: ${theme.name} | **URL**: ${theme.url} | **Description**: ${theme.desc} | **Difficulty**: ${theme.difficulty}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    //TODO: Deleting a theme should delete delete the corresponding theme aliases where theme.id = theme_alias.theme_id
    deletetheme: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const [arg] = target.split(',').map(part => part.trim());
        if (!arg) {
            return user.say("Example: .deletetheme [ID or Name or Alias]");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .deletetheme [ID or Name or Alias]");
            
            await themeRepo.delete(theme.id);
            await themeAliasRepo.deleteByThemeId(theme.id); // delete theme's aliases from database

            user.say(`The theme **${theme.name}** has been sucessfully deleted!`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }
    },
    addthemealias: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;

        const parts = target.split(',').map(part => part.trim());
        const arg = parts.shift(); // this variable can be a theme name or theme id
        const aliases = parts;


        if (!arg || aliases.length === 0) {
            return user.say("Example: .addthemealias [ID or Name or Alias], [alias1], [alias2], ...");
        }

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        try {
            let theme = await getTheme(themeRepo, themeAliasRepo, arg);
            if (!theme) return user.say("Theme not found. Make sure that the correct theme id, name, or alias has been entered. Example: .addthemealias [ID or Name or Alias], [alias1], [alias2], ...");

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

        const aliasArgs = target.split(',').map(part => part.trim()); // aliasArgs can be alias name or ID
        if (aliasArgs.length === 0) {
            return user.say("Example: .deletethemealias [aliasName1 or AliasID1], [aliasName2 or AliasID2], [aliasName3 or AliasID3], ...");
        }

        const themeAliasRepo = new themeAliasRepository();

        try {

            for (const arg of aliasArgs) {
                if (await themeAliasRepo.themeAliasExists(arg)) {
                    themeAliasId = (await themeAliasRepo.getByAlias(arg)).id;
                }
                else if (await themeAliasRepo.themeAliasIdExists(arg)) {
                    themeAliasId = arg;
                }
                else {
                    return user.say("Theme alias not found. Make sure that the correct theme alias id or name has been entered. Example: .deletethemealias [aliasName1 or AliasID1], [alias1], [alias2], ...");
                }
                await themeAliasRepo.delete(themeAliasId);
            }
            user.say(`Theme alias(es) succesfully deleted!`);
        } catch (error) {
            user.say("Error deleting alias: " + error.message);
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
    randtheme: async function (arg, user, room) {
		let target = !user.hasRank(room.id, '+') && !(Games.host && Games.host.id === user.id) ? user : room;
		let avail = [];
        let themes;

        const themeRepo = new themeRepository();
        const themeAliasRepo = new themeAliasRepository();

        arg = toId(arg);

        try {
            if(arg == "easy" || arg == "medium" || arg == "hard") themes = await themeRepo.getAllByDifficulty(arg);
            else themes = await themeRepo.getAllWithAliases();
        } catch (error) {
            return target.say("Error retrieving theme: " + error.message);
        } finally {
            themeRepo.db.close();
            themeAliasRepo.db.close();
        }
        let theme = themes[Math.floor(Math.random() * themes.length)]

        let text = '**' + theme.name + '**: __' + theme.desc + '__ Game rules: ' + theme.url;
        target.say(text);
	},

    themedb: async function (arg, user, room) {
        if (!user.hasRank('survivor', '+')) return;
        let themes;
        const themesDBHtml = new themesDbHtml();
        const themeRepo = new themeRepository();

         try {
            themes = await themeRepo.getAllWithAliases();
        } catch (error) {
            return console.log("Error retrieving theme: " + error.message);
        } finally {
            themeRepo.db.close();
        }

        let html = themesDBHtml.generateHTML(themes);

        PL_Menu.sendPage(user.id, "ThemeDB", html, room);

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

