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

```bash
/hdd/steam
```
## Installing CS:GO

To install Couter Strike on our linux server we need to launch SteamCMD:

```bash
/hdd/steam/steamcmd.sh
```

Make sure you are logged into Steam

```bash
login anonymous
```

Set an installation directory:

```bash
force_install_dir csgo_server
```
Install the  Valheim Dedicated Server appllication using its app_id:

```bash
app_update 740
```

## Generating the Steam API Tokens

Visit this [link](https://steamcommunity.com/dev/managegameservers) to generate a game server token.

This will be passed as a parameter in the script to tie the game server to a specific steam account.

Visit this [link](https://steamcommunity.com/dev/apikey) to generate a web API token. This is necessary to download community maps from the steam workshop.


## Editing the Server Config

`/hdd/steam/csgo_server/csgo/cfg/server.cfg`

```bash
sv_maxrate 0
sv_minrate 80000
sv_mincmdrate 100
sv_minupdaterate 100

sv_cheats 1
sv_vote_issue_restart_game_allowed 1
sv_vote_allow_in_warmup 1

sv_autobunnyhopping 1
sv_enablebunnyhopping 1
sv_clamp_unsafe_velocities 0
sv_staminamax 0;
sv_staminajumpcost 0;
sv_staminalandcost 0;
sv_staminarecoveryrate 0;
sv_airaccelerate 2000;
sv_accelerate_use_weapon_speed 0;
sv_maxvelocity 3500;
sv_falldamage_scale 0

mp_match_restart_delay 20
//mp_endmatch_votenextmap_keepcurrent 0
mp_endmatch_votenextmap 1
mp_endmatch_votenextleveltime 20

mp_warmuptime 0
mp_restartgame 1
```

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

>Run by exec `/hdd/steam/csgo.sh
