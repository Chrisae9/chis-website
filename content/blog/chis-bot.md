---
title: Discord Bot
date: 2020-08-17 17:02:75
category: projects
draft: false
---

[![chisbot](images/chisbot.png)](https://discord.com/api/oauth2/authorize?client_id=724657775652634795&permissions=8&scope=bot)

A Discord bot that provides users with a simple interface to plan pickup Valorant games.

## Usage

_For additional information, run `$help` bot comand_

| Command                                                                  | Description                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [\$plan \<#\> \<title\>](#creating-a-plan)                               | Takes in a number of players, creates a new game.                                 |
| \$rename \<title\>                                                       | Renames the current plan.                                                         |
| \$show                                                                   | Display plan, useful for switching text channels.                                 |
| [\$add \<@Name, Name, "Name With Spaces"\>](#adding-players-to-the-plan) | Add users by @tag or by typing the display name.                                  |
| \$addall                                                                 | Add all users in the current voice channel.                                       |
| \$delete \<@Name, Name, "Name With Spaces"\>                             | Delete users by @tag or by typing the display name.                               |
| [\$team \<@Name, Name, "Name With Spaces"\>](#team-selection)            | Give a list of valid captains to start team selection.                            |
| [\$play](#starting-the-match)                                            | Click on the letter corresponding to the correct voice channel to move each team. |
| \$side                                                                   | Randomly picks a side, (Attackers, Defenders).                                    |
| \$map                                                                    | Randomly selects a Valorant map.                                                  |
| [\$move](#ending-the-game)                                               | Move all players to the same voice channel, useful after match ends.              |

_Please give support to [zacharied](https://github.com/zacharied) for the wonderful [Discord React-Prompt library](https://github.com/zacharied/discord-eprompt)._

[![github](images/github.svg) Link to repository](https://github.com/Chrisae9/chis-bot)

## Bot Examples

### Creating a plan

`$plan 10 Valorant Match @ 10`

This will create a plan named "Valorant Match @ 10" with 10 available spots.

![Creating a Plan](images/creating-a-plan.png)

### Adding Players to the Plan

`$add @Chis Unholydog106 "Neko's pet dog"`

This will add 3 players to the current plan.

The bot is able to add people by using thier @Name and by matching with the closest Discord username.

**It is important to note that players are seperated by a space, so anyone with spaces in their name should be enclosed with quotation marks " ".**

![Adding Players](images/adding-players.png)

## Team Selection

`$team chis Unholydog106`

Start the team selection by entering two or more players to be captains. Captains can be selected using the same method as add and delete.

Once the team selection begins, the captain can select the emoji letter corresponding to the player they want to have on their team.

![Team Selection](images/team-selection.png)

## Starting the Match

`$play`

After the teams have been selected, run the play command to move the teams to different voice channels.

![Starting Match](images/starting-match.png)

![Play command](images/play-command.png)

## Ending the game

`$move`

After the match has completed, the move command can be used to return everyone to the selected voice channel.

![Move Command](images/move-command.png)
