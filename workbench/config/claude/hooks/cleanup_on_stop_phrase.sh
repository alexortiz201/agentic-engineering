#!/bin/bash
# cleanup_on_stop_phrase.sh -- UserPromptSubmit hook.
#
# Fires the clean_up_hook reminder when the prompt says the session is stopping.
# A stopping point sweeps differently from a completion: nothing is finished, so
# the work is recording WHERE THINGS STOPPED, not deleting.
#
# Triggers live in ./stopping_phrases.txt -- one ERE per line, extend it freely.
#
# Contract: reads the UserPromptSubmit payload on stdin, writes plain text on
# stdout (which the runtime injects into context), ALWAYS exits 0, and must be
# fast -- UserPromptSubmit gets a 30-second timeout, not the usual 10 minutes.

set -u

PATTERNS="$HOME/.claude/hooks/stopping_phrases.txt"

payload=$(cat 2>/dev/null) || exit 0
[ -n "$payload" ] || exit 0
[ -r "$PATTERNS" ] || exit 0
command -v jq >/dev/null 2>&1 || exit 0

prompt=$(printf '%s' "$payload" | jq -r '.prompt // ""' 2>/dev/null) || exit 0
[ -n "$prompt" ] || exit 0

# Long prompts are pasted material, not a sign-off. Cheap guard against noise.
[ "${#prompt}" -gt 600 ] && exit 0

live=$(grep -Ev '^[[:space:]]*(#|$)' "$PATTERNS" 2>/dev/null)
[ -n "$live" ] || exit 0

printf '%s' "$prompt" | grep -Eiqf <(printf '%s\n' "$live") 2>/dev/null || exit 0

cat <<'TXT'
RUNTIME TRIGGER -- clean_up_hook is now due (stopping point).

That prompt reads as the end of a working session. Run the sweep now, before
answering anything else, and fold the result into your reply.

A stopping point sweeps DIFFERENTLY from a completion. Nothing here is finished,
so deleting is usually wrong. The question is: what would mislead someone reading
these files cold tomorrow, given they are loaded at the start of the next session
and treated as current?

One batched pass over every ephemeral store, in this turn:
  - .memory/ -- running_context.md, todo_list.md, every topic note
  - .workgroup/<member>/ -- including PRs/<TICKET>.md and any todo list there
  - .profile/ -- only if the session changed what his setup actually is
  They live under TWO roots now: `.memory/` and `.workgroup/` in the workbench home at ~/.workbench/__SOLUTION__/, and `.profile/` at the package root as a local overlay.

Record, concretely and with identifiers:
  - what is half-done, and where exactly it stopped
  - what is still running or left up (servers, containers, worktrees, branches)
  - what was about to happen next
  - what is blocked, and on whom
  - anything believed but unverified, flagged as such rather than stated flat

Then say what you did in ONE line -- updated / cleaned / deleted.
TXT
exit 0
