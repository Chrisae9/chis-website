---
title: Discord Bot
date: 2020-08-17 17:02:75
category: projects
draft: false
---

[![chisbot](images/chisbot.png)](https://discord.com/api/oauth2/authorize?client_id=724657775652634795&permissions=8&scope=bot)

A Discord bot that provides users with a simple interface to plan pick up Valorant games.

## Usage

_For additional information, run `$help` bot comand_

| Command                                      | Description                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| \$plan \<# spots\> \<title\>                 | Takes in a number of players, creates a new game.                                 |
| \$rename \<title\>                           | Renames the current plan.                                                         |
| \$show                                       | Display match, useful for switching text channels.                                |
| \$add \<@Name, Name, "Name With Spaces"\>    | Add users by @tag or by typing the display name.                                  |
| \$addall                                     | Add all users in the current voice channel.                                       |
| \$delete \<@Name, Name, "Name With Spaces"\> | Delete users by @tag or by typing the display name.                               |
| \$team \<@Name, Name, "Name With Spaces"\>   | Give a list of valid captains to start team selection.                            |
| \$play                                       | Click on the letter corresponding to the correct voice channel to move each team. |
| \$side                                       | Randomly picks a side, (Attackers, Defenders).                                    |
| \$map                                        | Randomly selects a Valorant map.                                                  |
| \$move                                       | Move all players to the same voice channel, useful after match ends.              |

_Please give support to [zacharied](https://github.com/zacharied) for the wonderful [Discord React-Prompt library](https://github.com/zacharied/discord-eprompt)._

[![github](images/github.svg) Link to repository](https://github.com/Chrisae9/chis-bot)
