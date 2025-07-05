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
    }
};