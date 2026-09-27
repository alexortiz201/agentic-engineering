#!/bin/bash
# restore.sh -- put this operator's real harness configuration back on a machine.
#
# This is a RESTORE, not an install. The values here are the operator's own, captured
# from a working bench; four tokens are substituted because a public repository cannot
# carry them. Anyone who is not that operator wants ../templates/claude_home/install.sh
# instead -- that one is parameterised for a stranger, this one is not.
#
# Usage:
#   WORK_ROOT=~/work SOLUTION=work STACK_BOOT_CMD='foo --headless' ./restore.sh [--dest DIR] [--force]
#   ./restore.sh --check          # diff what is committed against what is live, substitute nothing
#
# Refuses to overwrite without --force, and backs up anything it does overwrite.

set -euo pipefail

KIT="$(cd "$(dirname "$0")" && pwd)"
SRC="$KIT/claude"
DEST="$HOME/.claude"
FORCE=0
CHECK=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dest) DEST="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --check) CHECK=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

# The four tokens, and only these four. Each one is forced by publication, never by
# portability -- see README.md, "Why exactly four tokens".
# WORK_ROOT appears in PROSE, not in a command, so set it the way you would write it --
# quoted '~/acme', not an expanded absolute path. Substituting the expanded form is the
# one thing that makes --check report a spurious DIFFERS.
: "${WORK_ROOT:?set WORK_ROOT -- the solution root housing the work repos, quoted, e.g. '~/acme'}"
: "${SOLUTION:?set SOLUTION -- the name of that multi-repo grouping, e.g. acme}"
: "${STACK_BOOT_CMD:?set STACK_BOOT_CMD -- the one command that boots the whole local stack}"

STAMP="$(date +%Y%m%d%H%M%S)"

subst() {
  sed -e "s#__HOME__#${HOME}#g" \
      -e "s#__WORK_ROOT__#${WORK_ROOT}#g" \
      -e "s#__SOLUTION__#${SOLUTION}#g" \
      -e "s#__STACK_BOOT_CMD__#${STACK_BOOT_CMD}#g"
}

place() {
  rel="$1"; mode="${2:-644}"
  src="$SRC/$rel"; dst="$DEST/$rel"

  if [ "$CHECK" -eq 1 ]; then
    if [ ! -e "$dst" ]; then echo "MISSING  $rel"; return 0; fi
    if subst < "$src" | diff -q - "$dst" >/dev/null; then echo "SAME     $rel"
    else echo "DIFFERS  $rel"; fi
    return 0
  fi

  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && [ "$FORCE" -eq 0 ]; then
    echo "SKIP  $rel (exists; re-run with --force to replace)"
    return 0
  fi
  if [ -e "$dst" ]; then cp "$dst" "$dst.bak.$STAMP"; echo "      backed up -> $rel.bak.$STAMP"; fi
  subst < "$src" > "$dst"
  chmod "$mode" "$dst"
  echo "WROTE $rel"
}

place "CRITICAL_RULES.md"
place "SHORTCUTS.md"
place "settings.local.json"
place "hooks/README.md"
place "hooks/stopping_phrases.txt"
for s in "$SRC"/hooks/*.sh; do place "hooks/$(basename "$s")" 755; done
while IFS= read -r f; do place "skills/${f#"$SRC/skills/"}"; done < <(find "$SRC/skills" -type f)

[ "$CHECK" -eq 1 ] && exit 0

mkdir -p "$DEST/hooks/state"

cat <<'EOF'

Hooks and skills are in place. FOUR things this script deliberately did not do:

  1. settings.json -- merge claude/settings.safe.json by hand. It is the publishable
     SUBSET of the real file. The autoMode key is not in it and the bench is not
     equivalent until that is restored. Read EXCLUDED.md now, not later.
  2. ~/.claude/CLAUDE.md -- fill ../templates/TEMPLATE_CLAUDE.md and move it into place.
     The harness refuses agent writes to that path; it is a manual step by design.
  3. The symlinked skills. A copied symlink is a dangling symlink, and a dangling skill
     reads as absent rather than as an error. Re-create them -- see EXCLUDED.md.
  4. Verification. Run the checks at the end of RESTORE.md. An unverified bench is not
     a restored one, and every failure mode here is silent.
EOF
