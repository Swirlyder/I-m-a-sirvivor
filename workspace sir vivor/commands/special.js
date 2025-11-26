/***********************************************
	 *              SPECIAL COMMANDS               *
	 ***********************************************/

const roasts = JSON.parse(require('fs').readFileSync('./data/roasts.json'));
const presents = require('../data/presents.js');

module.exports = {
	paradise: 'para',
	para: function (arg, user, room) {
		let text1 = 'I\'m Paradise and this is my Anime club. I work here with my friends and fellow weebs: Spieky, Bon Dance, Don’t Lose, Aknolan, PenQuin, Swirlyder, Moo, Snap, Henka, OM, Zeonth, Zyx14, Shadecession, deetah, Hurl, zyg, Guishark, inactive, Mitsuki, Tushavi, cleo, ptoad, Rainshaft, pants, wob, Audiino, Ceteris, Gimmick, Harambeween, abd1710, TheBluestEye, BugBuzzing, EasyOnTheHills, Felucia, micromorphic, Megagr, Penguin D, ClaudioINK58, lfolfo, BreadLoeuf, beautifications, Gary The Savage, calmvibes, Opple, Le\'Depression, SaltiestCactus43, Sificon, crabachillable, yunino, NeonAlphaa, a helpful rayquaza, GuyGuard, pokemonvortex, Gian, Morgan Tactician, Chapter Seven, LJB14, Death of Mimikyu, Yoshman8, veriyi, Celeryyyy and in 31 years, I\'ve learned one thing. You never know WHAT anime is going to be good.';
		if (room !== user && !user.hasRank(room, '+')) {
			user.say(text1);
			user.say(text2);
			user.say(text3);
			user.say(text4);
			user.say(text5);

		} else {
			room.say(text1);
			room.say(text2);
			room.say(text3);
			room.say(text4);
			room.say(text5);
		}
	},

	hirl123: 'hurl',
	hurl: function (arg, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let text = '/addhtmlbox <img src="https://i.vgy.me/ip3Fc9.png" width="0" height="0" style="height:135px;width:auto">';
		this.say(room, text);
	},

	pants: function (target, user, room) {
		let text = '';
		if (!user.hasRank(room.id, '+') && room.id !== user.id) text = '/pm ' + user.id + ', ';
		text += '.done with life';
		this.say(room, text);
	},

	cheese: 'moo',
	moo: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		this.say(room, '/me MOOs');
	},

	dominate: function (arg, user, room) {
		let text = user.hasRank(room.id, '+') ? '' : '/pm ' + user + ', ';
		text += "/me T-Poses";
		if (arg) text += " on " + arg;
		this.say(room, text);
	},

	hug: function (arg, user, room) {
		let text = user.hasRank(room.id, '+') ? '' : '/pm ' + user + ', ';
		text += "/me hugs ";
		if (arg) text += arg;
		this.say(room, text);
	},
	clown: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) {
			text += '/addhtmlbox <center>T🤡🤡🤡</center>';
			this.say(room, text);
		}
	},

	meme: function (arg, user, room) {
		var text = '';
		if (user.hasRank(room.id, '+') || (Games.host && Games.host.id === user.id)) {
			text = '';
		}
		text += '/addhtmlbox <center><a href="https://youtu.be/DLzxrzFCyOs"><button title="Dot Not Click Me">Click Me</button></a></center>';
		this.say(room, text);
	},
	highfive: function (arg, user, room) {
		let prefix = user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		let text = toId(arg) ? '/me high-fives ' + arg.trim() : 'Usage: ``.highfive [name]``';
		room.say(prefix + text);
	},

	gif: function (arg, user, room) {
		var text = '';
		var gifs = ['/addhtmlbox <center><img src="http://media2.giphy.com/media/u7hjTwuewz3Gw/giphy.gif" width=225 height=175/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/31c91db0b76d312b966c6adfe1c3940a/tumblr_nz57a2TvRC1u17v9ro1_540.gif" width=270 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/1gyIAEh.gif" width=380 height=203/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/RDtW8Gr.gif" width=222 height=200/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/qR77BXg.gif" width=250 height=225/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/2PZ8XUR.gif" width=385 height=216/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/451d21ddbde24e207a6f7ddd92206445/tumblr_inline_nt0ujvAJ8P1qjzu7m_500.gif" width=238 height=223/></center>', '/addhtmlbox <center><img src="http://www.keysmashblog.com/wp-content/uploads/2013/02/wig-snatching.gif" width=333 height=217/></center>', '/addhtmlbox <center><img src="http://66.media.tumblr.com/5f2015d7ba3f93f6c258e039d377287d/tumblr_inline_nn2r5c94m11qbxex9_500.gif" width=382 height=215/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/IFOqV6m.gif" width=387 height=218/></center>', '/addhtmlbox <center><img src="http://i.imgur.com/hSv7KYd.gif" width=267 height=219/></center>'];
		text += gifs[Math.floor(Math.random() * gifs.length)];
		if (user.hasRank(room.id, '#')) {
			this.say(room, text);
		}
	},

	yuni: 'yuninokata',
	yuninokata: function (arg, user, room) {
		{
			var text = '';
			var gifs = ['/addhtmlbox <center><img src="https://media0.giphy.com/media/ND6xkVPaj8tHO/200.webp?c0id=ecf05e476u6njyeynen20n8zeq3vyf25c7vkmfpp3gfxigb3&ep=v1_gifs_search&rid=200.webp&ct=g" width=216 height=200/> <br>Yuni after playing yacht</center>',];

			text += gifs[Math.floor(Math.random() * gifs.length)];
			if (user.hasRank(room.id, '+')) {
				this.say(room, text);
			}
		}
	},

	agif: 'animegif',
	animegif: function (arg, user, room) {
		{
			var text = '';
			//Old anime gifs
			//var gifs = ['/addhtmlbox <center><img src="https://media.tenor.com/HhTxo9I6hyMAAAAC/natsu-dragneel-save-me.gif" width=345 height=194/> <br> Source: Fairy Tail</center>', '/addhtmlbox <center><img src="https://media.tenor.com/nMASInP2FzoAAAAC/anime-power.gif" width=345 height=195/> <br> Source: Toradora</center>', '/addhtmlbox <center><img src="https://i.kym-cdn.com/photos/images/newsfeed/000/522/271/8a4.gif" width=222 height=192/> <br> Source: Daily Lives of High School Boys</center>', '/addhtmlbox <center><img src="https://media.tenor.com/eh1Zchfmz4sAAAAC/anime-tears.gif" width=267 height=191/> <br> Source:The World God Only Knows</center>', '/addhtmlbox <center><img src="https://64.media.tumblr.com/4a404d616af6e8490624017169d33d58/tumblr_n030vfawgD1rbrys3o1_500.gifv" width=345 height=190/> <br> Source: Soul Eater</center>', '/addhtmlbox <center><img src="https://media.tenor.com/pl_gjRkbSLQAAAAd/gintama-gintoki.gif" width=353 height=196/> <br> Source: Gintama</center>', '/addhtmlbox <center><img src="https://thumbs.gfycat.com/AdmirableSeriousAndalusianhorse.webp" width=286 height=194/> <br> Source: YuriYuri</center>', '/addhtmlbox <center><img src="https://64.media.tumblr.com/tumblr_ln9grkHJEp1qbvovho1_400.gifv" width=296 height=194/> <br> Source: Deadman Wonderland</center>', '/addhtmlbox <center><img src="https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAg330tJpTlbV2Qo5vDtVj6Q" width=341 height=192/> <br> Source: Carnival Phantasm</center>', '/addhtmlbox <center><img src="https://i.kym-cdn.com/photos/images/newsfeed/000/480/191/829.gif" width=345 height=192/> <br> Source: Space Brothers</center>', '/addhtmlbox <center><img src="https://media.tenor.com/VNiJ983DsY0AAAAC/full-metal-alchemist-edward-elric.gif" width=345 height=194/> <br> Source: Full Metal Alchemist: Brotherhood</center>', '/addhtmlbox <center><img src="http://media3.giphy.com/media/12dO0uYqeMVOy4/giphy.gif" width=260 height=195/> <br> Source: FLCL</center>', '/addhtmlbox <center><img src="https://66.media.tumblr.com/9f5d4e129f998f0c4358bf26a6d12a13/tumblr_nf0jxhnU9p1tyak95o1_500.gif" width=357 height=192/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.tenor.com/BFxt8qYDwrAAAAAC/mushroom-samba-omw.gif" width=286 height=194/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="http://pa1.narvii.com/5649/565e7d8046bd4b6223d153ce308086c42d06b773_hq.gif" width=385 height=190/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/14jigRRwHoGSo8/giphy.gif" width=342 height=192/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/LbvSbAz7CMmg8/giphy.gif" width=325 height=195/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="http://67.media.tumblr.com/ad16541d6ef3ee701c3308204574e0af/tumblr_nmd1mskOr91qam6y9o9_500.gif" width=450 height=195/> <br> Source: Kekkai Sensen</center>'];

			var gifs = ['flcl', '/addhtmlbox <center><img src="https://66.media.tumblr.com/9f5d4e129f998f0c4358bf26a6d12a13/tumblr_nf0jxhnU9p1tyak95o1_500.gif" width=357 height=192/> <br> Source: Cowboy Bebop</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/14jigRRwHoGSo8/giphy.gif" width=342 height=192/> <br> Source: Durarara!!</center>', '/addhtmlbox <center><img src="https://media.giphy.com/media/LbvSbAz7CMmg8/giphy.gif" width=325 height=195/> <br> Source: Durarara!!</center>', 'kekkai sensen', 'Soul eater'];

			text += gifs[Math.floor(Math.random() * gifs.length)];
			if (user.hasRank(room.id, '#')) {
				this.say(room, text);
			}
		}

	},

	/* gift: 'present',
	present: function (arg, user, room) {
		var text = '';
		text += 'Inside ' + arg + '\'s present is...' + presents[Math.floor(Math.random() * presents.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) {
			this.say(room, text);
			return;
		}
		if (!user.hasRank(room.id, '+')) {
			this.say(room, '/w ' + user.id + ', ' + text);
		}
	}, */

	/*roast: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let msg = Tools.sample(roasts).replace(`[USER]`, target.trim());
		if (msg.startsWith("/")) {
			msg = "/" + msg;
		}
		if (msg.startsWith("!")) {
			msg = "[[]]" + msg;
		}
		this.say(room, msg);
	}*/
};
