#!/bin/bash
# guard_claude_md.sh -- SessionStart hook.
#
# Two jobs, and the first is the important one:
#
#   1. UNCONDITIONALLY emit ~/.claude/CRITICAL_RULES.md into context. The rules that
#      matter most are the ones that countermand a harness default; losing them is
#      silent. Injecting them every session means no detection logic has to be
#      correct for them to hold.
#   2. Warn loudly if ~/.claude/CLAUDE.md is a dangling symlink or is empty --
#      converting the one failure mode that is currently invisible (an agent with no
#      global instructions cannot know it is missing any) into one that announces
#      itself in the first message of the session.
#
# This file must stay a REAL FILE in ~/.claude/, never a symlink -- it is what is
# supposed to survive when a symlink target goes away.
#
# Contract: plain text on stdout (the runtime injects it), ALWAYS exits 0.

set -u

RULES="$HOME/.claude/CRITICAL_RULES.md"
GLOBAL="$HOME/.claude/CLAUDE.md"

# Symlinks in ~/.claude that point outside it, and would therefore break silently if
# their target repo is moved, re-cloned or wiped. Add one per line.
WATCHED_LINKS="$HOME/.claude/adws"

if [ -r "$RULES" ]; then
  cat "$RULES" 2>/dev/null
else
  echo "WARNING: ~/.claude/CRITICAL_RULES.md is missing. The standing overrides (no attribution trailers, confirm before pushing, never write a credential into a document) are NOT loaded. Say so before doing anything that touches git or a document."
fi

# --- jq presence -------------------------------------------------------------
# Both clean-up hooks parse stdin with jq and exit 0 when it is absent, so a missing
# tool never blocks work. The cost is that they then fail SILENTLY -- the sweep simply
# stops being demanded and nothing says so. This is the one place that can announce it:
# it runs at session start and does not itself need jq to do so.
if ! command -v jq >/dev/null 2>&1; then
  echo "WARNING: jq is not installed. The clean_up_hook triggers (cleanup_on_git, cleanup_on_stop_phrase) parse stdin with jq and exit quietly without it, so the record sweep will NOT be demanded after a commit, a push, or a stopping-point phrase. Install jq to restore them."
fi

# Dangling or empty global instructions -- the silent failure this guard exists for.
if [ -L "$GLOBAL" ] && [ ! -e "$GLOBAL" ]; then
  echo
  echo "!!! ~/.claude/CLAUDE.md IS A DANGLING SYMLINK. Its target does not exist, so THIS SESSION HAS NO GLOBAL INSTRUCTIONS beyond the critical rules above. Tell the operator in your first message, name the broken target, and do not proceed as though the rest of his preferences are in force."
  printf '    target: %s\n' "$(readlink "$GLOBAL" 2>/dev/null)"
elif [ -e "$GLOBAL" ] && [ ! -s "$GLOBAL" ]; then
  echo
  echo "!!! ~/.claude/CLAUDE.md EXISTS BUT IS EMPTY. This session has no global instructions beyond the critical rules above. Tell the operator in your first message."
elif [ ! -e "$GLOBAL" ]; then
  echo
  echo "!!! ~/.claude/CLAUDE.md IS MISSING. This session has no global instructions beyond the critical rules above. Tell the operator in your first message."
fi

# Symlinks out of ~/.claude whose target has gone away. Same silent-failure class as a
# dangling CLAUDE.md: the link reads as absent rather than as an error.
for link in $WATCHED_LINKS; do
  if [ -L "$link" ] && [ ! -e "$link" ]; then
    echo
    printf 'NOTE: %s is a dangling symlink -- its target (%s) no longer exists. Anything that reaches through it will silently find nothing. Tell the operator.\n' "$link" "$(readlink "$link" 2>/dev/null)"
  fi
done

exit 0
