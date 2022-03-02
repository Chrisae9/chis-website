---
title: Automatically View SD Card Over Network
date: 2021-09-08 14:08:64
category: tutorials
draft: false
---

![DJI Drone Picture](images/dji.png)

I just bought a DJI Drone that takes wonderful pictures in the sky. It uses an Mirco SD to save the videos to be viewed later. Since my server is headless, I needed a way to plug in the SD card and have the videos and pictures show up in my network folder.

## Create mountpoint

In a shared location create a folder that will be the home for all the data located on the SD card `mkdir /hdd/share/ssd/`.

## Automount Entry

1. Find the UUID of the SD card, this will be used to identify the device when it is plugged into the server.

2. Open the fstab to create the entry. `sudo vim /etc/fstab`

3. Create the automount entry:

```
UUID=14D82C19D82BF81E /data auto nosuid,nodev,nofail,x-gvfs-show 0 0
```

Breaking that line down, we have:

- `UUID=14D82C19D82BF81E` - is the UUID of the drive. You don't have to use the UUID here. You could just use /dev/sdj, but it's always safer to use the UUID as that will never change (whereas the device name could).
- `/data` - is the mount point for the device.
- `auto` - automatically determine the file system
- `nosuid` - specifies that the filesystem cannot contain set userid files. This prevents root escalation and other security issues.
- `nodev` - specifies that the filesystem cannot contain special devices (to prevent access to random device hardware).
- `nofail` - removes the errorcheck.
- `x-gvfs-show` - show the mount option in the file manager. If this is on a GUI-less server, this option won't be necessary.
- `0` - determines which filesystems need to be dumped (0 is the default).
- `0` - determine the order in which filesystem checks are done at boot time (0 is the default).

## Testing the entry

Before you reboot the machine, you need to test your new fstab entry. To do this, issue the command:

`sudo mount -a`

If you see no errors, the fstab entry is correct and you're safe to reboot.

Congratulations, you've just created a proper fstab entry for your connected drive. Your drive will automatically mount every time the machine boots.

[Reference article by Jack Wallen](https://www.techrepublic.com/article/how-to-properly-automount-a-drive-in-ubuntu-linux/)
