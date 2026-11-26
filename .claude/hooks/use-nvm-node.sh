#!/usr/bin/env bash
# SessionStart hook (project-scoped): exposes nvm's default Node (>=22) to the
# Bash tool in Claude Code sessions for this repo. Needed because
# modern-web-guidance (`npx modern-web-guidance`) and `npx skills` require
# Node >= 22, while /usr/bin/node is 18.x. Never fails the session.
[ -n "${CLAUDE_ENV_FILE:-}" ] || exit 0
[ -s "$HOME/.nvm/nvm.sh" ] || exit 0
node_bin=$(bash -c '. "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 && nvm which default 2>/dev/null')
[ -x "$node_bin" ] || exit 0
printf 'export PATH="%s:$PATH"\n' "$(dirname "$node_bin")" >> "$CLAUDE_ENV_FILE"
exit 0
