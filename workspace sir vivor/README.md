Sir Vivor Commands Guide!
=========================


Administrative Commands
---------------------

`.kill` - Makes Sir Vivor log off. He will ask for confirmation before doing so.
Requires: % @ #

`.custom [text]` OR `.custom {[room]} [text]` - Forces Sir Vivor to execute a command or say a message. If `{[room]}` is provided, Sir Vivor will perform the task in the target room. Room name must be in `[brackets]`. For example: `.custom [survivor] hi`, `.custom [survivor] /modchat ac` Can be dangerous if misused.
Requires: user excepted

`.js [string]` - Forces Sir Vivor to execute a javascript string. If no string is provided, returns `undefined`
Requires: user excepted

`.reload` - Reloads Sir Vivor's `commands.js` file without having to manually restart him. NOTE: This command is currently bugged and will cause Sir Vivor to no longer to respond to any commands unless he is manually restarted. Be careful!
Requires: user excepted

`.uptime` - Says how long Sir Vivor has been currently online.
Requires: #

`.seen [user]` - Says the last time `[user]` was seen in the same rooms Sir Vivor. Works in PMs only. NOTE: This will also reveal `[user]`'s alternate accounts. Be careful!
Requires: Nothing

`.reloadvoices` -  If Sir Vivor isn’t responding to commands from Voices (+) in chat, this command can be used to reset his list of voices.
Requires: + % @ #

`.crash` - Forces Sir Vivor to restart if he starts breaking.
Requires: % @ #

`.chatlines [user], [days]` - Get the number of lines spoken in chat by `[user]` over the past `[days]` days. NOTE: This command will incapacitate Sir Vivor until it is done, so try not to use a large number of days while there is something happening in the room.
Requires: % @ #


Hosting Commands 
---------------------------

`.host [user]` - if there is no game going on, `[user]` will be hosted! If there is a game, they are added to the hostqueue. 
Requires: + % @ #

`.dehost [user]` - Ends the current userhosted game. If there is a game, it removes `[user]` from the hostqueue. 
Requires: + % @ #

`.nexthost` - Hosts the next user in the hostqueue. 
Requires: + % @ #

`.queue` - Displays the current hostqueue. 
Requires: + % @ # (broadcasts it in the chat, sends a PM to regular users)

`.subhost [user]` - If the current host leaves, this is can be used to sub in another `[user]` as the host (without re-hling everybody)
Requires: + % @ #

`.sethost [user]` - Set the host to `[user]`, when there is no host, without using the hightlight word. Typically only used when Sir Vivor disconnects.
Requires: + % @ #


Hostbanning Commands
---------------------------------
`.hostban [user], [days]` - Hostbans `[user]` for the given number of `[days]`.
Requires: % @ #

`.hostbanned`  - List all users currently hostbanned.
Requires: % @ #

`.bantime [user]` - List the amount of time until `[user]` is unhostbanned.
Requires: % @ #

`.unhostban [user]` - Unhostbans `[user]`
Requires: % @ #


Bothosted Games Commands:
-------------------------

`.signups [game]` - Requests signups for a bothosted game of `[game]`. Current themes allowed are every official theme except Classic and Super Survivor Bros.
Requires: + % @ #

`.start` - Starts a bothosted game, only works after signups have been announced. 
Requires: + % @ #

`.end` - Forcibly ends a bothosted game that is in progress. 
Requires: + % @ #

`.autostart [seconds]` - Automatically starts a bothosted game in `[seconds]` seconds.
Requires: + % @ #

`.pl` - Lists the players in the current bothosted game.
Requires: + % @ #


Hosting Commands
------------------

`.roll [number]` - Rolls a random number between 1 and `[number]`. You can also specify multiple die, or a number to add, with something like .roll 3d100+50
Requires: + % @ # or current host.

`.pick [a,b,c,...]` - Picks a random item from the comma separated list.
Requires: + % @ # or current host.

`.shuffle [a,b,c,...]` - Shuffles the items in the comma separated list.
Requires: + % @ # or current host.

`.dt [mon]` - Displays the information for `[mon]`.
Requires: + % @ # or current host.

`.weak [type]` - Displays the coverage chart for `[type]`.
Requires: + % @ # or current host.

`.done` - Ends the current host.
Requires: current host.

`.win [user]` - Wins the current user and ends the current game
Requires: current host.

`.themes` - Posts a link in chat displaying all the themes available in Survivor. 
Requires: + % @ # or current host.

`.theme [name]` - List more details about theme `[name]`. 
Requires: + % @ # or current host.

`.events` - Posts a link in chat displaying all the themes available in Survivor. 
Requires: + % @ # or current host.

`.event [name]` - List more details about event `[name]`. 
Requires: + % @ # or current host.

`.mods` - Posts a link in chat displaying all the events available in Survivor. 
Requires: + % @ # or current host.

`.mod [name]` - List more details about mod `[name]`. 
Requires: + % @ # or current host.

`.timer [seconds]` - Starts a timer for `[seconds]` seconds. When the timer ends, it will alert the user who started it.
Requires: + % @ # or current host.


Leaderboard Commands (Roomauth):
------------------------------------
`.adduser <numPlayers>, <Host>, <First>, [Second], [remaining players]` - Adds points for a user-hosted game.
Requires: + % @ #

`.addbot <numPlayers>, <First>, [Second]` - Adds points for a bot-hosted game.
Requires: + % @ #

`.addfish <numPlayers>, <Host>, <First>, [Second], <remaining players>` - Adds points for an official game.
Requires: + % @ #

`.addss <numPlayers>, <Host>, <First>, <Second>, <remaining players>` - Adds points for a Survivor Showdown game.
Requires: + % @ #

`.addspecial <Player>, <numPoints>` - Adds `<numPoints>` points to `<Player>` on the leaderboard.
Requires: + % @ #

`.remspecial <Player>, <numPoints>` - Removes `<numPoints>` points to `<Player>` on the leaderboard.
Requires: + % @ #

`.rename [old-name], [new-name]` - Removes points from `[old-name]` and gives them to `[new-name]`.
Requires: + % @ #

`.pointlog` - Displays the last 100 games hosted that were added to the leaderboard.
Requires: + % @ #

`.rpoints` - Removes all points from the last host that was added to the leaderboard. (Should only be used if mistake was made when adding points, handle with care)
Requires: % @ #

`.settextcolor [hexcode]` - Sets the text color for a user on the leaderboard to color `[hexcode]`.
Requires: % @ #

`.setbgcolor [hexcode]` - Sets the background color for a user on the leaderboard to color `[hexcode]`.
Requires: % @ #


Leaderboard Commands (All Users):
-------------------------------------
`.lb [number]`  - Displays ranks `[number]`-4 to n on the leaderboard. If `[number]` is omitted or invalid, defaults to displaying the top 50.
Requires: + % @ # (for chat only, can be performed by any user in PMs)

`.points [user]` - Displays `[user]`’s points and ranking on the leaderboard.
Requires: + % @ # (for chat only, can be performed by any user in PMs)


Other Commands:
---------------
NOTE: All of these commands (except `.agif`, `.roast`, `.repeat`) will work in PMs for regular users 

`.git` - Sends a link to Sir Vivor's github repository in PMs. All contributions are welcome!
Requires:  + % @ #

`.guide` - Sends a link to this guide.
Requires:  + % @ #

`.repeat [message], [time], [number of times]` - Makes Sir Vivor repeat a `[message]` every `[number of times]` every `[time]` minutes. 
e.g. `.repeat hello world, 60, 10` (10 times every 60 minutes)
Requires: % @ #

`.intro` - Displays a welcome page for new users.
Requires:  + % @ #

`.nbt` - Displays information on Next Big Theme.
Requires: + % @ #

`.howtohost` - Displays hosting information.
Requires: + % @ #

`.summary` - Displays summary of Survivor.
Requires: + % @ #

`.howtoplay` - Displays playing information.
Requires: + % @ #

`.meme` - Displays a button. Clicking it will lead to a rickroll.
Requires: + % @ #

`.joke` - Displays a random joke.
Requires: + % @ #

`.gift [user]` - Gives `[user]` a gift.
Requires: + % @ #

`.gif` - Displays a gif.
Requires: #

`.agif` - Displays a random anime gif.
Requires: #

`.roast [user]` - Roasts the given `[user]`.
Requires: % @ #

Roomauth and some former roomauth have their own custom commands which can be seen by doing `.[username]`. These commands display a message as so desired by the user.
