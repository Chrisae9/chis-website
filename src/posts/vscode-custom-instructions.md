---
title: VS Code Custom Instructions and Docker Security
date: 2025-07-05
summary: How to safely use GitHub Copilot custom instructions with Docker containerization, including the terminal allowlist setting that's only available in VS Code Insiders.
category: Docs
tags: [VSCode, AI, Copilot, Docker, Security]
---

# VS Code Custom Instructions and Docker Security

GitHub Copilot's custom instructions are powerful, but giving AI access to your terminal is risky. Here's how I solve this with Docker and some VS Code Insiders features that aren't well documented.

## The Security Problem

I don't trust AI to run commands directly on my system. But clicking "confirm" on every single command gets tedious. The solution? **Dockerize everything** and only allow the AI to run safe, containerized commands.

## The Terminal Allowlist (VS Code Insiders Only)

VS Code Insiders has a setting that lets you pre-approve specific terminal commands. This is experimental and referenced in [GitHub issue #252496](https://github.com/microsoft/vscode/issues/252496).

Add this to your `.vscode/settings.json`:

```json
{
  "github.copilot.chat.agent.terminal.allowList": [
    "docker compose --profile dev up",
    "docker compose --profile test up"
  ]
}
```

**Key points:**
- Only works in VS Code Insiders (as of 2025)
- Commands must match **exactly** - no wildcards
- This setting will likely change before hitting stable release
- Works best with **Claude Sonnet 4** in my experience

## Self-Updating Instructions

The magic trick: tell the AI how to update its own instructions. Here are the key snippets I use:

### The Critical Self-Maintenance Rules

```markdown
## Instructions Maintenance
- Always keep this Copilot instructions file up to date with user requests and project conventions.
- Any time the user asks to 'remember' a workflow, rule, or best practice, add it here immediately.
- If the user says 'remember' or 'remember this', you must immediately add the instruction, workflow, or rule to this file without exception.
- When adding new terminal commands to the project workflow, also add them to `.vscode/settings.json` in the `github.copilot.chat.agent.terminal.allowList` array for VS Code integration.
```

### Communication Shortcuts

```markdown
## User Communication Shortcuts
- If the user types 'y', it means 'yes, go, or do what you think is best.' Continue with the task or workflow without stopping for further confirmation, unless the system or user instructions explicitly require otherwise.
```

### Docker Workflow Commands

```markdown
## Workflow Commands
- Always use the command `docker compose --profile dev up app-dev` to start the dev server in this project in a containerized environment.
- Always use the command `docker compose --profile test up app-test` to run the test suite in this project in a containerized environment.
```