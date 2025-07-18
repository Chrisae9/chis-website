---
title: Real-time Notifications for Claude Code with ntfy
date: 2025-07-18
summary: Setting up ntfy server with Docker and integrating Claude Code hooks for instant notifications when AI needs permission or completes tasks.
category: AI
tags: [Claude, ntfy, Docker, Notifications, Hooks]
---

## The Problem with AI Workflows

When working with Claude Code, you often need to step away from your computer while the AI processes complex tasks. Traditional workflows leave you checking back periodically to see if Claude needs permission for destructive operations or if tasks have completed. This creates inefficiency and breaks your flow.

## What is ntfy?

[ntfy](https://ntfy.sh/) is a simple HTTP-based pub-sub notification service that sends push notifications to your phone, desktop, or any device. It's perfect for getting real-time updates from automated systems without the complexity of traditional messaging platforms.

## Setting Up ntfy with Docker

### Docker Compose Configuration

First, let's set up ntfy as a Docker service with Traefik reverse proxy:

```yaml
services:
  ntfy:
    image: binwiederhier/ntfy
    container_name: ntfy
    command:
      - serve
    environment:
      - TZ=America/New_York
      - NTFY_BASE_URL=https://ntfy.chis.dev
      - NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
      - NTFY_AUTH_FILE=/var/lib/ntfy/auth.db
      - NTFY_AUTH_DEFAULT_ACCESS=deny-all
      - NTFY_BEHIND_PROXY=true
      - NTFY_ATTACHMENT_CACHE_DIR=/var/lib/ntfy/attachments
      - NTFY_ENABLE_LOGIN=true
      - NTFY_UPSTREAM_BASE_URL=https://ntfy.sh # needed for real-time updates on iOS
    user: 1000:1000
    volumes:
      - ./:/var/lib/ntfy
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ntfy.rule=Host(`ntfy.chis.dev`)"
      - "traefik.http.routers.ntfy.entrypoints=websecure"
      - "traefik.http.routers.ntfy.tls.certresolver=cloudflare"
      - "traefik.http.services.ntfy.loadbalancer.server.port=80"
      - "traefik.docker.network=public"
    networks:
      - public

networks:
  public:
    external: true
```

### Key Configuration Points

- **Authentication**: `NTFY_AUTH_DEFAULT_ACCESS=deny-all` ensures only authenticated users can access topics
- **Proxy Support**: `NTFY_BEHIND_PROXY=true` enables proper IP forwarding with Traefik
- **Persistence**: Data is stored in `./` (current directory) and mapped to `/var/lib/ntfy`
- **Security**: Running as user 1000:1000 prevents permission issues

## Creating User

To create an admin user:

```bash
docker exec -it ntfy /bin/sh
ntfy user add --role=admin chis
```

Enter a password when prompted. That's it!

## Integrating Claude Code Hooks

Claude Code supports hooks that trigger on specific events. We'll create a notification script that sends updates to ntfy when Claude needs attention.

### Creating the Notification Script

Create `~/.claude/hooks/ntfy-notify.sh`:

```bash
#!/bin/bash

NTFY_SERVER="https://ntfy.chis.dev"
TOPIC="claude"
ACCESS_TOKEN="your_access_token_here"

# Read JSON from stdin
JSON_INPUT=$(cat)

# Extract data from JSON
HOOK_EVENT=$(echo "$JSON_INPUT" | jq -r '.hook_event_name // "Unknown"')

# Only process Notification hooks
if [ "$HOOK_EVENT" = "Notification" ]; then
    # Extract the actual message and current working directory
    MESSAGE=$(echo "$JSON_INPUT" | jq -r '.message // "Claude needs your input"')
    CWD=$(echo "$JSON_INPUT" | jq -r '.cwd // ""')
    PROJECT_NAME=$(basename "$CWD")
    
    # Check if this is a permission request for a tool
    if [[ "$MESSAGE" == *"needs your permission to use"* ]]; then
        # Extract tool name from message like "Claude needs your permission to use Bash"
        TOOL_NAME=$(echo "$MESSAGE" | sed -n 's/.*needs your permission to use \([^.]*\).*/\1/p')
        MESSAGE="🔧 [$TOOL_NAME] tool request ($PROJECT_NAME)"
    elif [[ "$MESSAGE" == *"waiting for your input"* ]]; then
        MESSAGE="⏳ Waiting for input ($PROJECT_NAME)"
    fi
    
    # Send notification
    curl -H "Authorization: Bearer $ACCESS_TOKEN" \
         -H "Title: Claude Code" \
         -H "Priority: high" \
         -d "$MESSAGE" \
         "$NTFY_SERVER/$TOPIC"
fi
```

This streamlined script provides clear, concise notifications with project context:
- 🔧 **[Tool] tool request (project)** - When Claude needs permission to use a specific tool
- ⏳ **Waiting for input (project)** - When Claude is idle and waiting for your response
- Other notification messages are passed through as-is

The script automatically extracts the current working directory name to provide context about which project Claude is working on.

Make it executable:
```bash
chmod +x ~/.claude/hooks/ntfy-notify.sh
```

### Configuring Claude Code Hooks

Add this to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/ntfy-notify.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Types Explained

### Notification Hook
The Notification hook is the perfect balance for staying informed without notification spam. It triggers when:
- Claude needs permission to use a tool
- The prompt input has been idle for 60+ seconds (Claude is waiting for input)

This single hook covers all the essential scenarios where you need to be notified, making it the ideal choice for most workflows.

### Why Not Other Hooks?
- **PreToolUse**: Fires for every tool usage, creating notification spam for informational commands
- **Stop**: While useful, the Notification hook already covers the important scenarios when your attention is needed

The Notification hook strikes the perfect balance between staying informed and avoiding notification fatigue.

## Setting Up ntfy Client

### Mobile App
1. Download ntfy from [Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy), [F-Droid](https://f-droid.org/packages/io.heckel.ntfy/), or [App Store (iOS)](https://apps.apple.com/app/ntfy/id1625396347)
2. Add your server: `https://ntfy.chis.dev`
3. Subscribe to the `claude` topic
4. Configure authentication with your access token

## Testing the Setup

Once everything is configured, test with a simple command:

```bash
# This should trigger a notification
claude "run ls -la"
```

You should receive a notification when Claude requests permission to run the command.

## Conclusion

This setup creates a seamless workflow where you can step away from your computer while Claude Code works, knowing you'll be instantly notified when your attention is needed. The combination of ntfy's simplicity and Claude's powerful hooks creates an efficient development environment that keeps you informed without overwhelming you with unnecessary notifications.

The key is finding the right balance between staying informed and avoiding notification fatigue—which is why we focus on the Notification and Stop hooks rather than every tool usage.