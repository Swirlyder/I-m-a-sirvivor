
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

global.eventcount = {
    count: {},
    load: function() {
        let obj = JSON.parse(FS.readFileSync('./databases/eventcount.json'));
        if (obj) this.count = obj;
    },
    save: function() {
        FS.writeFileSync('./databases/eventcount.json', JSON.stringify(this.count, null, 2));
    },
    add(user, amount) {
        if (user.id) user = user.id;
        user = toId(user);
        if (!this.count[user]) this.count[user] = 0;
        this.count[user] += amount;
        this.save();
    }
};

eventcount.load();

exports.commands = {
    hostcount: function (arg, user, room) {
		if (!user.hasRank('survivor', '%')) return;
        let points = [];
        for (let i in hostcount.count) {
            points.push([
                i,
                hostcount.count[i]
            ]);
        }
        points.sort((a, b) => {
           return b[1] - a[1]; 
        });
        let ret = `<center><div style="padding:80px"><b>Host count</b>`;
        for (let i in points) {
            ret += "<br>" + (i+1) + ". " + points[i][0] + ": " + points[i][1];
        }
        ret += "</div>"
        return this.say(Rooms.get('survivor'), `/sendhtmlpage ${user.id}, hostcount, ${ret}`);
    }
}
