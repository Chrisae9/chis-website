---
title: All-in-one Bootable USB with Ventoy
date: 2023-12-14
summary: All-in-one bootable solution for multiple ISOs.
tags: [Engineering, OS]
---

## Bootable USBs

My main ISOs are GParted, Memtest, Arch, and Windows 10/11. To do this, I must have a separate USB for each iso. This makes no sense when the primary USB I carry is 128 GB, and the ISOs don’t even fill up a third of the drive.

## Ventoy As A Solution

[https://www.ventoy.net/en/doc_start.html](https://www.ventoy.net/en/doc_start.html)

Using Ventoy, you can use a single USB stick to boot multiple ISOs; here is how to do it on Windows.

### Download the Installer

[https://www.ventoy.net/en/download.html](https://www.ventoy.net/en/download.html)

Format a USB and select it within the program.

## Adding ISOs

Once the formatting is complete, view the USB in the folder Explorer. Create a `boot` folder and drop all ISOs in there. 

### Secure Boot Fix

[https://www.ventoy.net/en/doc_secure.html](https://www.ventoy.net/en/doc_secure.html)
