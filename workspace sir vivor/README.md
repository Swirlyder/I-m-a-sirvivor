Sir Vivor Commands Guide!
=========================

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

`.subhost [user]` - If the current host leaves, this is can be used to sub in another [user] as the host (without re-hling everybody)
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

`.theme [name]` - List more details about theme name. 
Requires: + % @ # or current host.

`.spotlight` - Displays the rules for spotlight games. 
Requires: + % @ # or current host.

`.sw `- Displays the rules for Second Wind Modification.
Requires: + % @ # or current host

`.ai` - Displays rules for Attack's Immunity Modification.
Requires: + % @ # or current host.

`.golf` - Displays rules for Golf Modification.
Requires: + % @ # or current host.

 `.rs` - Displays rules for Roll Switch Modification.
Requires: + % @ # or current host.

`.timer [seconds]` - Starts a timer for `[seconds]` seconds. When the timer ends, it will alert the user who started it.
Requires: + % @ # or current host.


Daily Deathmatch Commands (Roomauth):
------------------------------------
`.first [user]` - Adds first place points (aka 10 points) to `[user]` in the DD leaderboard.
Requires: + % @ #

`.second [user]` - Adds second place points (aka 5 points) to `[user]` in the DD leaderboard.
Requires: + % @ #

`.part [user1], [user2], …` - Adds participations points (aka 2 points) to the specified users in the DD leaderboard.
Requires: + % @ #

`.hostpoints [user]` - Adds host points (aka 3 points) to `[user]` in the dd leaderboard.
Requires: + % @ #

`.rmfirst [user]` - Removes a first place from `[user]` on the dd leaderboard, if possible.
Requires: + % @ #

`.rmsecond [user]` - Removes a second place from `[user]` on the dd leaderboard, if possible.
Requires: + % @ #

`.rmhost [user]` - Removes a host from `[user]` on the dd leaderboard, if possible.
Requires: + % @ #

`.rmparts [user1], [user2], …` - Removes participations from `[user1], [user2], ....`, if possible.
Requires: + % @ #

`.lastgame` - Checks when the leaderboard was last updated.
Requires: + % @ #

`.addpoints [host], [first], [second], [user1], [user2], …` - Adds all the dd points in one command.
Requires: + % @ #

`.rename [old-name], [new-name]` - Removes DD points from `[old-name]` and gives them to `[new-name]`.
Requires: + % @ #

Daily Deathmatch Commands (All Users):
-------------------------------------
`.top [number]`  - Displays ranks `[number]`-4 to n on the dd leaderboard. If `[number]` is omitted or invalid, defaults to displaying the top 5.
Requires: Nothing

`.points [user]` - Displays `[user]`’s points and ranking on the DD leaderboard.
Requires: Nothing

Other Commands:
---------------
NOTE: All of these commands (except `.agif`, `.roast` and `.reloadvoices`) will work in PMs for regular users 

`.rof` - Displays the Roll of Fame page. 
Requires: + % @ # or current host

`.intro` - Displays a welcome page for new users.
Requires:  + % @ #

`.plug` - Displays the Survivor plug.dj room.
Requires: + % @ #

 `.nbt` - Displays information on Next Big Theme.
Requires: + % @ #

`.howtohost` - Displays hosting information.
Requires: + % @ #

`.summary` - Displays summary of Survivor.
Requires: + % @ #

`.howtoplay` - Displays playing information.
Requires: + % @ #

`.submit` - Sends a link where users can submit jokes, roasts, agifs, gifs and more.
Requires: + % @ #

`.meme` - Displays a button. Clicking it will lead to a rickroll.
Requires: + % @ #

`.joke` - Displays a random joke.
Requires: + % @ #

`.gift [user]` - Gives `[user]` a gift.
Requires: + % @ #

`.agif` - Displays a random anime gif.
Requires: #

`.roast [user]` - Roasts the given `[user]`.
Requires: % @ #

`.reloadvoices` -  If Sir Vivor isn’t responding to commands from Voices (+) in chat, this command can be used to reset his list of voices.
Requires: + % @ #

`.chatlines [user], [days]` - Get the number of lines spoken in chat by `[user]` over the past `[days]` days. NOTE: This command will incapacitate Sir Vivor until it is done, so try not to use a large number of days while there is something happening in the room.
Requires: % @ #

`.git` - Sends a link to Sir Vivor's github repository in PMs. All pull requests are welcome!

`.guide` - Sends a link to this guide.

Roomauth and former roomauth have their own custom commands which can be seen by doing `.[username]`. These commands display a message as so desired by the user.
