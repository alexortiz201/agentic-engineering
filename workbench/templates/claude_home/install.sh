#!/bin/bash
# install.sh -- reproduce this bench in a harness configuration directory.
#
# Copies the kit into place, substitutes the placeholders, and sets the executable
# bits that a copy-paste loses. It does NOT merge settings.json for you -- that file
# usually already exists and merging JSON blind is how a working bench gets broken.
#
# Usage:
#   STATE_ROOT=/abs/path/to/local-state-root ./install.sh [--dest DIR] [--force]
#
# Safe by default: refuses to overwrite an existing file unless --force is given,
# and backs up anything it does overwrite.

set -euo pipefail

KIT="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/.claude"
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dest) DEST="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

: "${STATE_ROOT:?set STATE_ROOT to the absolute path of the local root holding .memory/ and .workgroup/ -- NOT .profile/, which these scripts never read and which lives at the package root}"
SOLUTION="${SOLUTION:-solution}"
STAMP="$(date +%Y%m%d%H%M%S)"

subst() { sed -e "s#__HOME__#${HOME}#g" -e "s#__STATE_ROOT__#${STATE_ROOT}#g" -e "s#__SOLUTION__#${SOLUTION}#g"; }

place() {
  src="$1"; rel="$2"; mode="${3:-644}"
  dst="$DEST/$rel"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && [ "$FORCE" -eq 0 ]; then
    echo "SKIP  $rel (exists; re-run with --force to replace)"
    return 0
  fi
  # `command cp` bypasses any `cp -i` alias. An aliased copy waits for a confirmation
  # that never arrives in a non-interactive run, so the backup silently does not happen
  # and the install then overwrites a file with no recoverable copy behind it.
  [ -e "$dst" ] && command cp "$dst" "$dst.bak.$STAMP" && echo "      backed up -> $rel.bak.$STAMP"
  subst < "$src" > "$dst"
  chmod "$mode" "$dst"
  echo "WROTE $rel"
}

place "$KIT/CRITICAL_RULES.md"        "CRITICAL_RULES.md"
place "$KIT/SHORTCUTS.md"             "SHORTCUTS.md"
place "$KIT/settings.local.json"      "settings.local.json"
place "$KIT/hooks/README.md"          "hooks/README.md"
place "$KIT/hooks/stopping_phrases.txt" "hooks/stopping_phrases.txt"
for s in "$KIT"/hooks/*.sh; do
  place "$s" "hooks/$(basename "$s")" 755
done
if [ -d "$KIT/skills" ]; then
  find "$KIT/skills" -type f | while read -r f; do
    place "$f" "skills/${f#"$KIT/skills/"}"
  done
fi
mkdir -p "$DEST/hooks/state"

echo
echo "Hook scripts installed and made executable. Two things are deliberately NOT done:"
echo
echo "  1. settings.json -- merge the \`hooks\` key from settings.hooks.json by hand:"
echo "       sed \"s#__HOME__#\$HOME#g\" \"$KIT/settings.hooks.json\""
echo "     A fresh bench with no settings.json can instead start from settings.example.json."
echo
echo "  2. The global instruction file -- see ../TEMPLATE_CLAUDE.md, and the README's"
echo "     ordered procedure. It is the one file that must be read before it is installed."
echo
echo "Then run the verification steps in README.md. An unverified bench is not an installed one."
