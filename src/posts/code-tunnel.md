---
title: VSCode Tunnel Service on Arch Linux
date: 2024-01-30
summary: Guide on how to set up a VSCode tunnel service on your Arch Linux system, allowing you to connect to your remote development server seamlessly through the https://vscode.dev/ website.
tags: [Arch, Chromebook, VSCode]
---

The purpose of this guide is to create a VSCode tunnel using the code CLI, creating a service that optionally runs on boot. This allows you to connect to your remote development server over the [vscode.dev](https://vscode.dev/) website. This setup is particularly useful if you're working on a machine with limited resources, like an old Pixelbook, where the local Linux development version of VSCode might be too choppy and slow.

## Why Use a VSCode Tunnel?

Running VSCode directly on an older machine like a Pixelbook can be inefficient. The Linux development version of VSCode may run too slowly, making coding a frustrating experience. By using a VSCode tunnel, you can offload the heavy lifting to a remote server and access a smooth, responsive development environment via the [vscode.dev](https://vscode.dev/) website.

## Step 1: Grab the Code Executable

First, grab the code executable using the following command:

```bash
curl -Lk '<https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64>' --output vscode_cli.tar.gz
```

Extract the downloaded tarball:

```bash
tar -xf vscode_cli.tar.gz
```

> Note: I extracted it to my home folder for simplicity.
> 

## Step 2: Test Out That It Works

Navigate to the extracted folder and test the VSCode tunnel:

```bash
./code tunnel
```

You will be prompted to log in using Microsoft or GitHub. I chose GitHub. Enter the code that you get in the terminal and test the connection by logging into:

```
<https://vscode.dev/tunnel/[your-pc]>
```

Replace `[your-pc]` with your actual PC name provided during the setup.

## Step 3: Register the Code Tunnel as a Service

To register the code tunnel as a service, you are supposed to use the command:

```bash
./code tunnel service install
```

This doesn't work for me, so I had to create the service manually.

### Create the Systemd Unit File

Create a file called `code-tunnel.service` in `/etc/systemd/system/` with the following content:

```
[Unit]
Description=Visual Studio Code Tunnel
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=chis
Group=chis
Restart=always
RestartSec=10
ExecStart=/home/chis/code "--verbose" "--cli-data-dir" "/home/chis/.vscode-cli" "tunnel" "service" "internal-run"

[Install]
WantedBy=multi-user.target
```

> Note: Ensure you replace /home/chis with your actual home directory and username.
> 

## Step 4: Manage the Service

I do not want this service running all the time, but I do want it as a service in case I lose connection on my device and the code tunnel shuts down in the SSH session. You could probably circumvent this with `tmux`, but this is more elegant to me.

### Create Aliases for Convenience

Add the following aliases to your `.zshrc` for quick service management:

```bash
alias start-code='sudo systemctl start code-tunnel.service'
alias stop-code='sudo systemctl stop code-tunnel.service'
alias status-code='sudo systemctl status code-tunnel.service'
```

To activate these aliases, run:

```bash
source ~/.zshrc
```

### Start the Service

The first time you start the service, you might need to use the status command to get the auth code for GitHub:

```bash
start-code
```

Then, check the status to retrieve the auth code:

```bash
status-code
```

## Additional Helpful Aliases

For other helpful things, I alias:

```bash
alias c='code -r .'
```

When you are in the VSCode terminal, you can type `c` to open the current working directory into the VSCode editor.
