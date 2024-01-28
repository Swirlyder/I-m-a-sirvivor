/***********************************************
	 *              SPECIAL COMMANDS               *
	 ***********************************************/

const roasts = JSON.parse(require('fs').readFileSync('./data/roasts.json'));
const presents = require('../data/presents.js');

module.exports = {
	paradise: 'para',
	para: function (arg, user, room) {
		let text1 = 'I\'m Paradise and this is my Anime club. I work here with my friends and fellow weebs: Spieky, Bon Dance, Don’t Lose, Aknolan, PenQuin, Swirlyder, Aknolan, Moo,';
		let text2 = 'Snap, Hawkie, Henka, OM, Zeonth, Zyx14, Shadecession, deetah, Hurl, zyg, Guishark, Mitsuki, Tushavi, inactive, cleo, ptoad, Rainshaft, pants, wob, Audiino, Ceteris,';
		let text3 = 'Gimmick, Harambeween, abd1710, TheBluestEye, BugBuzzing, EasyOnTheHills, Felucia, micromorphic, Megagr, Penguin D, ClaudioINK58, lfolfo, BreadLoeuf,';
		let text4 = 'beautifications, 2guhde4u, Gary The Savage, marillvibes, Opple, Le\'Depression, SaltiestCactus43, Sificon, crabachillable,';
		let text5 = 'a helpful rayquaza and in 23 years, I\'ve learned one thing. You never know WHAT anime is going to be good.';
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

	joke: function (arg, user, room) {
		var text = '';
		var jokes = ['What does a nosey pepper do? Get jalapeño business.', 'What is Bruce Lee’s favorite drink? Wataaaaah!', 'How does NASA organize their company parties? They planet.', 'Why does Snoop Dogg carry an umbrella? Fo’ drizzle.', 'What time is it when you have to go to the dentist? Tooth-hurtie.', 'There’s two fish in a tank. One turns to the other and says "You man the guns, I’ll drive"', 'Why can’t a bike stand on its own? It’s two tired.', 'How do you make Holy water? Boil the hell out of it.', 'What did one ocean say to the other ocean? Nothing, they just waved.', 'A bear walks into a bar and he asks the bartender "I\'d like some peanuts............. and a glass of milk. The bartender says "Why the big pause?"', 'Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!', 'What did the traffic light say when it stayed on red? ”You would be red too if you had to change in front of everyone!”', 'Two hats are on a hat rack. Hat #1 to hat #2 “you stay here. I’ll go on a head.”', 'Why did the tomato blush? ... it saw the salad dressing.', 'What did the football coach say to the broken vending machine? “Give me my quarterback!”', 'What did the digital clock say to the grandfather clock? Look grandpa, no hands!', 'What happens to a frog\'s car when it breaks down? It gets toad away.', 'What did the blanket say when it fell of the bed? "Oh sheet!"', 'What lights up a soccer stadium? A soccer match', 'Why shouldn\'t you write with a broken pencil? Because it\'s pointless.', 'What do you call a fake noodle? An impasta', 'Why is Peter Pan always flying? He neverlands!', 'How many tickles does it take to make an octopus laugh? Ten-Tickles', 'Why did the stadium get hot after the game? All of the fans left.', 'What did Barack Obama say to Michelle when he proposed? Obama: I don\'t wanna be obama self.', 'Why did the picture go to jail? Because it was framed!', 'What if soy milk is just regular milk introducing itself in Spanish?', 'Why couldn\'t the sesame seed leave the gambling casino? Because he was on a roll.', 'Why did the chicken cross the playground? To get to the other slide.', 'What does a cell phone give his girlfriend? A RING!', 'How did the italian chef die? He pasta away.', 'Why didn\'t the skeleton go to the party? He had no-body to dance with!', 'How does Moses make his tea? Hebrews it.', 'What do you call a sleeping bull? A bull-dozer.', 'Why didn\'t the koala get the job? He didn\'t have the koalafictions', 'What do you call a fairy that hasn\'t bathed in a year? Stinkerbell', 'What do you call two Mexicans playing basketball? Juan on Juan.', 'What do you call a guy who never farts in public? A private tutor', 'Why did the can crusher quit hit job? It was soda pressing!', 'A blonde went into a doctors office and said "doctor help I\'m terribly sick" doc replies "flu?" "no, I drove here."', 'What do you comb a rabbit with? A hare brush!', 'Why did the deer need braces? Because he had buck teeth!', 'What did the blanket say when it fell off the bed? Oh sheet!', 'Why shouldn\'t you write with an unsharpened pencil? It\'s pointless', 'What did one plate say to the other? Dinner\'s on me!', 'How do you make a tissue dance? You put a little boogey in it!', 'Want to hear a joke about paper? Never mind it\'s tearable.', 'What\'s the difference between a guitar and a fish? You can tune a guitar but you can\'t tuna fish!', 'What kind of key opens a banana? A mon-key!', 'What do you call a line of rabbits walking backwards? A receding hare line.', 'Why did the Fungi leave the party? There wasn\'t mushroom.', 'Why did the algae and the fungus get married? They took a lichen to each other.', 'Why do Toadstools grow so close together? They don\'t need Mushroom. ', 'What would a mushroom car say? Shroom shroom!', 'What room has no doors, no walls, no floor and no ceiling? A mushroom.', 'What do you get if you cross a toadstool and a full suitcase? Not mushroom for your holiday clothes!', 'Did you hear the joke about the fungus? I could tell it to you, but it might need time to grow on you.', 'What do mushrooms eat when they sit around the campfire? S\'pores.', 'What did the mushroom say when it was locked out of the house? E no ki.', 'Why wouldn\'t the teenage mushroom skip school? He didn\'t want to get in truffle', 'Why did the mushroom go to the party? It didn\'t. Mushrooms are non-sentient organic matter, so they generally don\'t get invited to parties.', 'Why did the Mushroom get invited to all the RAVE parties? \'Cuz he\'s a fungi!', 'Yo mama so poor your family ate cereal with a fork to save milk', 'Yo mama so fat, I took a picture of her last Christmas and it\'s still printing', 'What did the first cannibal say to the other while they were eating a clown? Does this taste funny to you?', 'My Dad used to say always fight fire with fire, which is probably why he got kicked out of the fire brigade', 'I like to stop the microwave at 1 second just to feel like a bomb defuser', 'I should change my facebook username to NOBODY so that way when people post crappy posts, and i press the like button it will say NOBODY likes this', 'It\'s so cold outside, I actually saw a gangster pull his pants up.', 'A gift card is a great way to say, Go buy your own fucking present', 'Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ships kitchen', 'Lazy People Fact #5812672793, You were too lazy to read that number', 'My favourite exercise is a cross between a lunge and a crunch. Its called Lunch.', 'I have the heart of a lion. And a lifetime ban from the zoo.', 'Old ladies in wheelchairs with blankets over their legs? I don’t think so… retired mermaids.', 'Years ago I used to supply filing cabinets for the mafia. Yes, I was involved in very organised crime', 'If you are being chased by a police dog, try not to go through a tunnel, then on to a little see-saw, then jump through a hoop of fire. They are trained for that', 'I named my hard drive "dat ass" so once a month my computer asks if I want to back dat ass up', 'Relationships are a lot like algebra. Have you ever looked at your X and wondered Y?', 'I swear to drunk Im not God, but seriously, stay in drugs, eat school, and dont do vegetables.', 'You haven\'t experienced awkward until you try to tickle someone who isn\'t ticklish', 'Maybe if we all emailed the constitution to each other, the NSA will finally read it', 'Whatever you do in life, always give 100%. Unless you are donating blood...', 'It is all shits and giggles until someone giggles and shits!', 'I wonder if anyone has watched Storage Wars and said "hey thats my shit!"', 'I am naming my TV remote Waldo for obvious reasons', 'I hate when I am about to hug someone really sexy and my face hits the mirror', 'Telling a girl to calm down works about as well as trying to baptize a cat', 'Dating a single mother is like continuing from somebody else\'s saved game', 'If only God can judge us than Santa has some explaining to do', 'My vacuum cleaner broke. I put a Dallas Cowboys sticker on it, and now it sucks again', 'When the zombie apocalypse finally happens, I\'m moving to Washington D.C. I figure the lack of brains there will keep the undead masses away', 'Everyone\'s middle name should be "Goddamn". Try it. Doesnt it sound so great?', 'Before Instagram, I used to waste so much time sitting around having to imagine what my friends food looked like', 'The sad moment when you return to your shitty life after watching an awesome movie', 'A big shout out to sidewalks... Thanks for keeping me off the streets', 'Buying an electric car seems like a good idea until you hit a squirrel and flip over a few times', 'I named my dog "5 miles" so I can tell people I walk 5 miles every day', 'Your future depends on your dreams, so go to sleep', 'Yawning is your bodies way of saying 20% battery remaining', 'Dont you hate it when someone answers their own questions? I do', 'Paradise.'];
		text += jokes[Math.floor(Math.random() * jokes.length)];
		if (user.hasRank(room.id, '+') || room.id === user.id) {
			this.say(room, text);
			return;
		}

		if (!user.hasRank(room.id, '+')) {
			this.say(room, '/w ' + user.id + ', ' + text);
		}
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

	gift: 'present',
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
	},

	roast: function (target, user, room) {
		if (!user.hasRank(room.id, '+')) return;
		let msg = Tools.sample(roasts).replace(`[USER]`, target.trim());
		if (msg.startsWith("/")) {
			msg = "/" + msg;
		}
		if (msg.startsWith("!")) {
			msg = "[[]]" + msg;
		}
		this.say(room, msg);
	}
};
