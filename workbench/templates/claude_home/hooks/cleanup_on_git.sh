#!/bin/bash
# cleanup_on_git.sh -- PostToolUse hook.
#
# Fires the clean_up_hook reminder after a `git commit` or `git push` ran through
# the Bash tool. The operator's complaint was having to ask for the sweep out loud;
# this removes that by making the runtime fire it.
#
# Contract: reads the PostToolUse payload on stdin, writes JSON on stdout,
# ALWAYS exits 0. A hook that errors must never block his work.
#
# Note: settings.json also narrows this with an `if` rule, but the command check
# below is the guarantee -- if `if` is unsupported or changes shape, this still
# filters correctly and stays silent on every other Bash call.

set -u

DEBOUNCE_FILE="$HOME/.claude/hooks/state/last_cleanup_reminder"
DEBOUNCE_SECONDS=60

payload=$(cat 2>/dev/null) || exit 0
[ -n "$payload" ] || exit 0

command -v jq >/dev/null 2>&1 || exit 0
cmd=$(printf '%s' "$payload" | jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0
[ -n "$cmd" ] || exit 0

# `git` must sit in COMMAND POSITION -- start of the line, or straight after a
# separator -- and `commit`/`push` must appear as a bare word somewhere after it.
#
# Still leans toward firing on anything ambiguous: a spare reminder is cheap, a
# missed sweep is the failure the operator actually complained about.
# Comment lines are stripped first: grep is line-oriented, and a "#" line is never
# an executed command -- it is documentation that happens to mention git.
scan=$(printf '%s\n' "$cmd" | grep -v '^[[:space:]]*#')
[ -n "$scan" ] || exit 0

printf '%s' "$scan" | grep -Eq '(^|[;&|]|[[:space:]]&&[[:space:]]|\$\()[[:space:]]*(sudo[[:space:]]+)?git([[:space:]]|$)' || exit 0
printf '%s' "$scan" | grep -Eq '(^|[[:space:]])(commit|push)([[:space:]]|$)' || exit 0

# Debounce: `git commit && git push` is one landing, not two.
now=$(date +%s)
if [ -f "$DEBOUNCE_FILE" ]; then
  last=$(cat "$DEBOUNCE_FILE" 2>/dev/null)
  case "$last" in
    ''|*[!0-9]*) last=0 ;;
  esac
  if [ $((now - last)) -lt "$DEBOUNCE_SECONDS" ]; then exit 0; fi
fi
printf '%s' "$now" > "$DEBOUNCE_FILE" 2>/dev/null

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"RUNTIME TRIGGER -- clean_up_hook is now due.\n\nWork just landed (a git commit or push), which is a completion: it changed what is true about the tree and the remote, and made stale any record that described this work as pending. Run the sweep now, in this turn, without being asked.\n\nOne batched pass over EVERY ephemeral store, against a single picture of what just changed:\n1. Name what changed -- a head, a count, a status, a file that now exists, a risk now retired, a question now answered.\n2. Open every store, not only the one you were working in:\n   - .memory/ -- running_context.md, todo_list.md, every topic note\n   - .workgroup/<member>/ -- including PRs/<TICKET>.md and any todo list there\n   - .profile/ -- only where the change altered what his setup actually is\n   .memory/ and .workgroup/ are under __STATE_ROOT__/; .profile/ is the package-root local overlay.\n3. Apply all three motions: UPDATE what is outdated, CLEAN what is now misleading, DELETE what the change made pointless. The first happens by itself; the other two are the reason this exists.\n4. Close each record against its own source -- a ticket file against the tracker, a PR line against the forge, a \"not built\" against the tree. Never against another record.\n5. Say what you did in ONE line -- updated / cleaned / deleted. One line total, not one per file.\n\nIf nothing in the stores is affected, say so in one line and move on."}}
JSON
exit 0
