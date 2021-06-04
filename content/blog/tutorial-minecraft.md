---
title: Hosting a 24/7 Minecraft Server on Linux with Backups
date: 2021-02-01 05:02:38
category: tutorials
draft: false
---

![Minecraft MOTD](images/minecraft-motd.png)

Minecraft is a wonderful game and it should be played with friends! What's the point of building amazing cites and structures if no one is going to admire your craftsmanship? In order to play with friends a multiplayer server is required. This can be tedious because people play Minecraft all hours of the day and night. To keep these people building, we must make sure that our Minecraft server is accessible even when we are not awake. Here is my setup for a 24/7 modded Minecraft server.

## Installing Modded Minecraft

Download the BuildTools.jar file from the [SpigotMC Website](https://www.spigotmc.org/wiki/buildtools/)

```bash
mkdir minecraft-server
cd minecraft-server
curl -o BuildTools.jar https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
```

Run the BuildTools.jar file:

`java -jar BuildTools.jar`

_Note: this is the same command to use when the server needs to update to a newer version._

Bypass the EULA agreement:

`echo "eula=true" > eula.txt`

Rename the Spigot file:

`mv spigot-{version}.jar server.jar`

Create scripts directory with a start script:

```bash
mkdir scripts
cd scripts
touch start
chmod +x start
vim start
```

```bash
#!/bin/bash

#4gb server
cd /hdd/minecraft-server
java -Xmx4096M -Xms4096M -jar server.jar nogui
```

Run the server for the first time:

`/hdd/minecraft-server/scripts/start`

Edit the `server.properties` file to include the motd and server ip.

Add a server-icon by dropping a **64x64** image named `server-icon.png` into the root folder.

![Server Icon](images/server-icon.png)

Open minecraft port on firewall

`ufw allow 25565`

_Note: you should enable this on your routers firewall_

## Configuring the Plugins

Create a directory called mods inside the server folder:

`mkdir plugins`

Drop the desired mods into this folder. I believe that Vanilla Minecraft is good on its own so it isn't necessary to install heavy mods into the game. Currently I only have Advanced Teleport installed on my server. But feel free to lookup and install any mods that you like.

`cd plugins`

Download page for [AdvancedTeleport](https://www.spigotmc.org/resources/advanced-teleport.64139/?__cf_chl_jschl_tk__=c186a37a8451c11060100d0ae603750e7be656a9-1612559567-0-ATiV1ovTQtdQFnt6LTgoH9STP1nJB9iExRsBC0f-5_K4Pw_z7aA1B4vT5ZpRZ6DSLMwEdKGIUhyll8oZJON6zlIi71xzzhSBgyXg8RjsF_lG7_vuzPk7LoAoBjsn0d_cmaipaEVCATQ4Y34kOaTZkRWEbjiaYw-NA24WfmIqiKANr2gAqKPubA4t6duEVKraZD29XjWqsDfu-pW5PyzJdbGTLbyhGLla6_U25HHLwu85wfZ7VMHCUuXTW1PQ2362H23VYvijFpuRpJxeETdgH-i1bOr4845VsD3Ylb-ZZnRCXyWZu2NlK5DPFfjxbHYw5F0Apr8cnwIZXyWz86CNoq-4ZfvbIvqMcrw897qZSUFo)

Run the server again and let the mod create its configuration files.

Make any changes to the configuration file here `vim /hdd/minecraft-server/plugins/AdvancedTeleport/config.yml`.

## Creating a Minecraft Systemd Service

Install mcrcon, this will allow us to send commands to the minecraft server without having an interactive terminal session running.

```
git clone https://github.com/Tiiffi/mcrcon.git
cd mcrcon
make
sudo make install
```

Open rcon port on firewall

`ufw allow 25575`

_Note: you should enable this on your routers firewall_

Create a stop script in the Minecraft scripts folder:

```bash
cd /hdd/minecraft-server/scripts
touch stop
chmod +x stop
vim stop
```

```bash
#!/bin/sh

mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" stop

while kill -0 $MAINPID 2>/dev/null
do
  sleep 0.5
done
```

Make a minecraft-server service:

`sudo vim /lib/systemd/system/minecraft-server.service`

```bash
[Unit]
Description=minecraft-server
After=NetworkManager.service

[Service]
WorkingDirectory=/hdd/minecraft-server/
User=chris
Group=sambashare
Type=simple
KillMode=none
SuccessExitStatus=0 1
ExecStart=/hdd/minecraft-server/scripts/start
ExecStop=/hdd/minecraft-server/scripts/stop
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

`sudo systemctl start minecraft-server.service`

`sudo systemctl enable minecraft-server.service`

## Enabling Minecraft Server Backups

Create a backup folder:

`mkdir /hdd/minecraft-backup`

Add a save script to the Minecraft scripts folder:

```bash
cd /hdd/minecraft-server/scripts
touch save
chmod +x save
```

```bash
#!/bin/sh

/bin/echo "Starting backup..."

/usr/local/bin/mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" "say Backing up server."
/usr/local/bin/mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" save-off
/usr/local/bin/mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" save-all

latest=$(/bin/date '+%h-%d-%Y')

/bin/tar -cpzf /hdd/minecraft-backup/mc-backup-${latest}.tar.gz -P /hdd/minecraft-server

/bin/cp /hdd/minecraft-backup/mc-backup-${latest}.tar.gz /hdd/minecraft-backup/hourly/mc-backup-$(/bin/date '+%H').tar.gz

find /hdd/minecraft-backup -mtime +4 -name "*.gz"

/usr/local/bin/mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" save-on
/usr/local/bin/mcrcon -H server.chis.dev -P 25575 -p "your-very-own-password" "say Backup complete!"

/bin/echo "Backup complete!"
```

This script will use mcrcon to manually save the server. Once it is saved we will create a backup of the server and move it into a backup folder.

Make sure that the cron service is running:

`service cron status`

Turn this script into a cronjob:

`crontab -e`

Add this at the bottom of the file:

`@hourly /hdd/minecraft-server/scripts/save`

_Note: There are other ways to add this script as a cronjob but this is the least intrusive._

To view cron logs:

`grep CRON /var/log/syslog`

## Moving the Minecraft Server to a User Service

As less people play on the Minecraft server, there is not much of a reason to keep the server running 24/7. This being said, if anyone wants to play on the server I would like them to have the ability to start the service themselves. With the introduction of [Discord Slash Commands](https://discord.com/developers/docs/interactions/slash-commands) it is very easy to restrict commands to certain roles in a server. This is perfect for the Minecraft Server.

The main idea here is to give certain people the ability to start and stop the Minecraft Server using my Discord bot.

Make the Minecraft Server a user service so that the bot has permission to start and stop it as a service.

```bash
# enable the ‘linger‘ functionality so that the account can use systemd services without being logged in
loginctl enable-linger chris
sudo systemctl disable minecraft-server.service
mkdir -p ~/.config/systemd/user/
sudo mv /lib/systemd/system/minecraft-server.service ~/.config/systemd/user/
```

### I had a dbus error so I found this fix

So there's a long standing issue where the `XDG_RUNTIME_DIR` environment variable doesn't get set properly, or at all, when users log in, and therefore can't access the user D-Bus. This happens when the user logs in via some other method than the local graphical console.

You can work around this by adding to the user's `\$HOME/.bashrc`:

`export XDG_RUNTIME_DIR=/run/user/\$(id -u)`
Then log out and back in.

The bot can now run the command:

`systemctl --user start minecraft-server.service`
