
const FS = require('fs');
global.hostcount = {
    count: {},
    load: function() {
        let obj = JSON.parse(FS.readFileSync('./databases/hostcount.json'));
        if (obj) this.count = obj;
    },
    save: function() {
        FS.writeFileSync('./databases/hostcount.json', JSON.stringify(this.count, null, 2));
    },
    add(user, amount) {
        if (user.id) user = user.id;
        user = toId(user);
        if (!this.count[user]) this.count[user] = 0;
        this.count[user] += amount;
        this.save();
    }
};

hostcount.load();

global.gamecount = {
    count: {},
    load: function() {
        let obj = JSON.parse(FS.readFileSync('./databases/gamecount.json'));
        if (obj) this.count = obj;
    },
    save: function() {
        FS.writeFileSync('./databases/gamecount.json', JSON.stringify(this.count, null, 2));
    },
    add(user, amount) {
        if (user.id) user = user.id;
        user = toId(user);
        if (!this.count[user]) this.count[user] = 0;
        this.count[user] += amount;
        this.save();
    }
};

gamecount.load();


exports.commands = {
    
}