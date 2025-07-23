const jokeRepository = require('../classes/TextRepository.js').jokesRepository;
const jokesHTML = require('../classes/HTMLPage.js').JokesHtml;
const giftRepository = require('../classes/TextRepository.js').giftsRepository;
const giftsHTML = require('../classes/HTMLPage.js').GiftsHtml;

module.exports = {
    addjoke: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;
        if (!target) return user.say("Example:.addjoke [joke]");

        const jokeRepo = new jokeRepository();
        const info = { text: target, added_by: user.id }

        try {
            await jokeRepo.add(info);
            this.say(room, `/msgroom survivor, /modnote ADDJOKE: by ${info.added_by}: ${info.text}`);
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT" && error.message.includes("UNIQUE")) {
                user.say(`"${info.text}" is already in Survivor's joke list.`);
            }
            else {
                user.say("Error adding theme: " + error.message);
            }
        } finally {
            jokeRepo.db.close();
        }
    },
    removejoke: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;
        const id = Number(target);
        if (!target || !id.isInteger() || id < 0) {
            return user.say("Example: .removejoke [ID]. ID must be a postive integer.");
        }

        const jokeRepo = new jokeRepository();

        try {
            let joke = await jokeRepo.getById(id);
            await jokeRepo.delete(joke.id);
            this.say(room, `/msgroom survivor, /modnote REMOVEJOKE: by ${user.id}: ${joke.text}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            jokeRepo.db.close();
        }
    },
    jokes: 'jokedb',
    jokedb: async function (arg, user, room) {
        if (!user.hasRank('survivor', '+')) return;

        let jokes;
        const jokesHtml = new jokesHTML();
        const jokeRepo = new jokeRepository();

        try {
            jokes = await jokeRepo.getAll();
        } catch (error) {
            return console.log("Error retrieving jokes: " + error.message);
        } finally {
            jokeRepo.db.close();
        }

        let html = jokesHtml.generateTableHTML(jokes);

        PL_Menu.sendPage(user.id, "JokesDB", html, room);

    },
    joke: async function (arg, user, room) {
        let target = !user.hasRank(room.id, '+') ? user : room;
        let [id, showAuthor] = arg.split(',').map(part => part.trim());
        const jokesHtml = new jokesHTML();
        const jokeRepo = new jokeRepository();
        let jokes;
        let joke;

        try {
            if (!id && !showAuthor) {
                jokes = await jokeRepo.getAll();
                id = jokes[Math.floor(Math.random() * jokes.length)].id;
            }
            else if (id && Number(id).isInteger() && Number(id) > 0 && showAuthor === "showauthor") {
                joke = await jokeRepo.getById(Number(id));
            }

            joke = await jokeRepo.getById(id);
            const text = (showAuthor === "showauthor") ? `/addhtmlbox ${jokesHtml.generateShowAuthorRow(joke)}` : joke.text;
            target.say(text);
        } catch (error) {
            return console.log("Error retrieving theme: " + error.message);
        } finally {
            jokeRepo.db.close();
        }
    },
    addgift: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;
        if (!target) return user.say("Example:.addgift [gift]");

        const giftRepo = new giftRepository();
        const info = { text: target, added_by: user.id }

        try {
            await giftRepo.add(info);
            this.say(room, `/msgroom survivor, /modnote ADDGIFT: by ${info.added_by}: ${info.text}`);
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT" && error.message.includes("UNIQUE")) {
                user.say(`"${info.text}" is already in Survivor's gift list.`);
            }
            else {
                user.say("Error adding theme: " + error.message);
            }
        } finally {
            giftRepo.db.close();
        }
    },
    removegift: async function (target, user, room) {
        if (!user.hasRank('survivor', '%')) return;
        const id = Number(target);
        if (!target || !id.isInteger() || id < 0) {
            return user.say("Example: .removegift [ID]. ID must be a postive integer.");
        }

        const giftRepo = new giftRepository();

        try {
            let gift = await giftRepo.getById(id);
            await giftRepo.delete(gift.id);
            this.say(room, `/msgroom survivor, /modnote REMOVEGIFT: by ${user.id}: ${gift.text}`);
        } catch (error) {
            user.say("Error updating theme: " + error.message);
        } finally {
            giftRepo.db.close();
        }
    },
    presents:'gifts',
    gifts: 'giftdb',
    giftdb: async function (arg, user, room) {
        if (!user.hasRank('survivor', '+')) return;

        let gifts;
        const giftsHtml = new giftsHTML();
        const giftRepo = new giftRepository();

        try {
            gifts = await giftRepo.getAll();
        } catch (error) {
            return console.log("Error retrieving gifts: " + error.message);
        } finally {
            giftRepo.db.close();
        }

        let html = giftsHtml.generateTableHTML(gifts);

        PL_Menu.sendPage(user.id, "giftsDB", html, room);

    },
    present:'gift',
    gift: async function (arg, user, room) {
        let target = !user.hasRank(room.id, '+') ? user : room;
        let [targetUser, id, showAuthor] = arg.split(',').map(part => part.trim());
        if (!targetUser) return room.say("Usage: .gift [user], [giftId(optional)], [showauthor(optional)]");

        let gifts;
        let gift;
        const giftsHtml = new giftsHTML();
        const giftRepo = new giftRepository();

        try {
            if (!id && !showAuthor) {
                //since ID's in the database arent labeled from index 0 to # of gifts, put all gifts into an array, 
                //then get a random element from the array, and then store that elements database ID into 'id'
                gifts = await giftRepo.getAll();
                id = gifts[Math.floor(Math.random() * gifts.length)].id;
            }

            gift = await giftRepo.getById(id);

            const giftText = 'Inside ' + targetUser + '\'s present is...' + gift.text;
            const text = (showAuthor === "showauthor") ? `/addhtmlbox ${giftsHtml.generateShowAuthorRow(gift)}` : giftText;
            target.say(text);
        } catch (error) {
            return console.log("Error retrieving theme: " + error.message);
        } finally {
            giftRepo.db.close();
        }
    }
}