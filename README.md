Sir Vivor
====================

A chat bot for the Survivor Room on [Pokémon Showdown][1]. This bot has a number of commands, some helpful and some less so, as well as the capability to moderate, and play games. 

Currently used in
  [1]: http://www.pokemonshowdown.com/survivor
  [2]: http://www.pokemonshowdown.com/chinese
  [3]: http://www.pokemonshowdown.com/videogames


Installation
------------

Sir Vivor requires [node.js][2] to run.
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
However, please refrain from adding more example commands.

Credits:
 - Morfent/TalkTakesTime/Quinella/Rival Nick (Original Bot)
 - Swirlyder (Bot Owner and Repo Owner)
 - CheeseMuffin (Major Development, Bot Owner and Maintainer)
 - Hawkie (First customization for survivor, Major Development)
 - inactive (Development, Maintainer)
 - UnleashOurPassion (Development)
 

License
-------

Sir Vivor is distributed under the terms of the [MIT License][5].

  [5]: https://github.com/Swirlyder/I-m-a-sirvivor/blob/master/workspace%20sir%20vivor/README.md
