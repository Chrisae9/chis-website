---
title: Valheim Server
date: 2021-02-24 05:02:43
category: server
draft: false
---

![valheim](images/valheim.png)

I just recently bought the game Valheim, it sparked my attention because I love games that allow the player to craft. After playing a couple of hours I decided that it was time to setup a dedicated server. 

Here is my process for transfering your already existing Valheim world to a home linux server.

## Installing SteamCMD

Make sure that SteamCMD is installed on the linux server.

[Link to SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

I chose to install SteamCMD here:

```bash
/hdd/steam
```

## Installing Valheim's Dedicated Server Application

Valheim's developers decided to put an application on the steam store to make running Valheim decicated servers easier.

To install this on our linux server we need to launch SteamCMD:

```bash
/hdd/steam/steamcmd.sh
```

Make sure you are logged into Steam

```bash
login anonymous
```

Set an installation directory:

```bash
force_install_dir valheim_server
```
Install the  Valheim Dedicated Server appllication using its app_id:

```bash
app_update 896660
```

## Locating the Pre-existing Save

The pre-existing save should be located in your %APPDATA%:

```bash
C:\Users\chris\AppData\LocalLow\IronGate\Valheim
```

Copy the worlds folder to the linux server. Make sure to store this outside of the valheim folder so that it doesn't get deleted on application update.

I decided to rename the folder and store it here:

```bash
/hdd/steam/valheim_data/worlds
```

## Starting the Valheim Server

Move the start script outside of the valheim folder so that it doesn't get overwritten on application update.

```bash
mv /hdd/steam/valheim_server/start_server.sh /hdd/steam/valheim.sh
chmod +x /hdd/steam/valheim.sh
```

Open port 2456-2458 on your router to make the server accessible to people outside of your network.

```bash
sudo ufw allow 2456
sudo ufw allow 2457
sudo ufw allow 2458

```

Edit the server script to match the correct settings:

```bash
export templdpath=$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/hdd/steam/valheim_server/linux64:$LD_LIBRARY_PATH
export SteamAppId=892970


echo "Starting server PRESS CTRL-C to exit"

# Tip: Make a local copy of this script to avoid it being overwritten by steam.
# NOTE: Minimum password length is 5 characters & Password cant be in the server name.
# NOTE: You need to make sure the ports 2456-2458 is being forwarded to your server through your local router & firewall.
/hdd/steam/valheim_server/valheim_server.x86_64 -name "SERVER_NAME" -port 2456 -world "WORLD_NAME" -password "PASSWORD" -savedir /hdd/steam/valheim_data

export LD_LIBRARY_PATH=$templdpath
