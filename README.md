Sir. Vivor
====================

A chat bot for the Survivor Room on [Pokémon Showdown][1]. This bot has a number of commands, some helpful and some less so, as well as the capability to moderate, and play games. 


Installation
------------

Sir. Vivor requires [node.js][2] to run.
This bot has not been tested on every `node.js` version possible, but has the same version requirements as [Pokémon Showdown][3]: either v0.6.3 through v0.8.22, or v0.10.2 and up.
Install `node.js` if you don't have it yet, try the last stable version.

Next up is cloning this bot. This can be done in two ways: cloning it via `git` or downloading as ZIP.
Downloading it as ZIP is the easy and lazy way, but is a lot less handy to update than cloning this repository.

To install dependencies, run:

    npm install

Copy `config-example.js` to `config.js` and edit the needed variables.
To change the commands that the bot responds to, edit `commands.js`.
To create a new game, add a file to the `games` directory

Now, to start the bot, use:

    node main.js

Some information will be shown, and will automatically join the room(s) you specified if no error occurs.

  [2]: http://nodejs.org/
  [3]: https://github.com/Zarel/Pokemon-Showdown

If any of your commands rely on information normally sent to the Pokémon Showdown Client (e.g. functions that execute based on PM that aren't directly related to normal commands), you will need to make changes to the message method in parser.js under the appropriate case.

Development
-----------
Everyone is more than welcome to contribute to the bot. 
If you would like to help, contact on of the developers listed below!
However, please refrain from adding more example commands.

Credits
-------
Current Developers:
- Swirlyder (Bot Owner, Repo Owner, Major Development, Maintainer)
- inactive (Bot Owner, Maintainer)
     
 Past Developers:
- Felucia (Bot Owner, Major Development, Maintainer)
- Hawkie (First customization for survivor, Major Development)
- CheeseMuffin/Cheese/Moo (Major Development, Bot Owner and Former Maintainer)
- marillvibes (Maintainer)
- Shadecession (Major Development)
- Tushavi (Created and Updated current Leaderboard system, Major Development)
- Rainshaft (Development)
   
 Sir. Vivor is based on the original BoTTT devloped by Morfent/TalkTakesTime/Quinella/Rival Nick

License
-------

Sir Vivor is distributed under the terms of the [MIT License][5].

  [5]: https://github.com/Swirlyder/I-m-a-sirvivor/blob/master/workspace%20sir%20vivor/README.md
