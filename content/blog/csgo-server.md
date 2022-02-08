---
title: Counter-Strike Global Offensive Server
date: 2021-02-23 05:02:43
category: server
draft: false
---

![csgo](images/csgo.png)

Mechanics in competitive video games have always been a selling point for me. The ability to master a mechanic and use it strategically in gameplay is what makes a game beautiful. In order to learn such precise movements many players look to custom training alternatives to accelerate the learning process.

But...

Sometimes players get so hooked on the mechanics that they no longer play the game how the creators originally intended it to be played. They start communties and create niche mods to feed their addiction.

![bhop](images/bhop.png)

Bunny hopping refers to the act of jumping again while you're just about the land from an initial jump. If you successfully keep up your movement while doing so, you'll start bunny hopping. If done correctly a player can strafe left and right to add more velocity to reach ridiculous speeds.

Here is the process I went through to setup a mini-bhop server so I could play some of my favorite bhop maps and really feel the nostalgia.

## Installing SteamCMD

Make sure that SteamCMD is installed on the linux server.

[Link to SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

I chose to install SteamCMD here:

`/hdd/steam`

## Installing CS:GO

To install Couter Strike on our linux server we need to launch SteamCMD:

`/hdd/steam/steamcmd.sh`

Make sure you are logged into Steam

```bash
login anonymous
```

Set an installation directory:

```bash
force_install_dir csgo_server
```

Install the CSGO Dedicated Server application using its app_id:

```bash
app_update 740
```

## Generating the Steam API Tokens

Visit this [link](https://steamcommunity.com/dev/managegameservers) to generate a game server token.

This will be passed as a parameter in the script to tie the game server to a specific steam account.

Visit this [link](https://steamcommunity.com/dev/apikey) to generate a web API token. This is necessary to download community maps from the steam workshop.

## Editing the Server Config Files

`/hdd/steam/csgo_server/csgo/cfg/server.cfg`

```bash
sv_cheats 1
sv_maxrate 0
sv_minrate 80000
sv_mincmdrate 100
sv_minupdaterate 100

sv_autobunnyhopping 1
sv_enablebunnyhopping 1
sv_staminamax 0;
sv_staminajumpcost 0;
sv_staminalandcost 0;
sv_staminarecoveryrate 0;
sv_airaccelerate 2000;
sv_accelerate_use_weapon_speed 0;
sv_maxvelocity 3500;
sv_falldamage_scale 0
sv_clamp_unsafe_velocities 0
```

`/hdd/steam/csgo_server/csgo/cfg/gamemode_deathmatch.cfg`

```bash
mp_roundtime										60
mp_warmuptime										5
```

Copy the default gamemode config to the custom server config and change the map groups to reflect the community maps:

`cp /hdd/steam/csgo_server/csgo/gamemode.txt gamemode_server.txt`

Under the `"deathmatch"` section, change the multiplayer maps section to reflect the community map collection ID:

```
	// Map groups for online modes
	"mapgroupsMP"
	{
		//Other Maps Groups
		"2405267676"	""
	}
```

Once, the community maps are loaded, append the community maps to the `maplist.txt` and `mapcycle.txt` in the top level directory:

EXAMPLE (`/hdd/steam/csgo_server_csgo/mapcycle.txt`):

```
workshop\542674577\bhop_aztec
workshop\817372600\bhop_arcane_classic
workshop\271411841\bhop_kiwi_cwfx_csgo_fix
workshop\269112877\bhop_clarity_csgo_fix
workshop\271318976\bhop_mp_stairs_hq_csgo_b1
workshop\270797012\bhop_speedrun_valley_csgo_b2
```

## Install SourceMod and Knife Plugin

Follow this [link](https://www.sourcemod.net/downloads.php?branch=stable) to Download Sourcemod.

Follow this [link](https://www.sourcemm.net/downloads.php?branch=stable) to Download MetaMod:Source.

Once downloaded extract the `addons` and `cfg` folders into:

`/hdd/steam/csgo_server/csgo/`

Add yourself as an Admin under `/hdd/steam/csgo_server/csgo/addons/sourcemod/configs/admins_simple.ini`:

```bash
"STEAM_ID" "99:z" // Username
```

_To find your Steam ID follow this [link](https://steamidfinder.com/)._

Disable guidelines under by setting this paramater to 'no' under `/hdd/steam/csgo_server/csgo/addons/sourcemod/configs/core.cfg`:

```bash
	"FollowCSGOServerGuidelines"	"no"
```

> Players should now be able to change the current knife, skin, and map by typing `!knife`, `!ws`, and `!map`.

## Generating a Run Script

```bash
touch /hdd/steam/csgo.sh
chmod +x /hdd/steam/csgo.sh
```

`/hdd/steam/csgo.sh`

```bash
#!/bin/bash

/hdd/steam/csgo_server/srcds_run -game csgo -console -usercon -authkey YOURAUTHKEYHERE -ip YOUR.IP.ADDR.HERE -tickrate 100 -nobots +game_type 0 +game_mode 1 +host_workshop_collection 2405267676 +workshop_start_map 817372600 +sv_setsteamaccount YOUR.TOKEN.HERE -net_port_try
```

> Run by exec `/hdd/steam/csgo.sh`
