#!/bin/bash
# boot_memory.sh -- SessionStart hook.
#
# Runs the `boot memory` shortcut as the session opens, so the read order does not
# depend on an assistant remembering it. The stores live in one fixed home while sessions
# start in many repos, so nothing auto-loads them by proximity -- that is why this exists
# as a hook rather than as an instruction in a CLAUDE.md.
#
# Contract: plain text on stdout (the runtime injects it), ALWAYS exits 0.

set -u

# ONE variable is still enough after the 2026-09-16 split. `.memory/` and `.workgroup/` live in
# the workbench-home local state root under ~/.workbench/__SOLUTION__/; `.profile/` is a separate
# package-root local overlay. This script resolves ONLY the first two -- it has never referenced
# `.profile/` -- so a second variable would name a root nothing here reads. Anything that does touch
# `.profile/` spells that path itself.
#
# Overridable ONLY so this script can be exercised against fixtures.
ROOT="${AGENT_STATE_ROOT:-$HOME/.workbench/__SOLUTION__}"

echo "RUNTIME TRIGGER -- boot memory. Do this before anything else, including before answering the first prompt."
echo
echo "Read in this order and stop there. Each file links whatever else matters, so do not traverse further unless a link says to."
echo
echo "  1. $ROOT/.memory/running_context.md"
echo "     Where things stand, which rules are in force, and a link to any handoff note the last session left."
echo "  2. $ROOT/.memory/todo_list.md"
echo "     The single master list of open work, grouped by what owns it. There is no second todo list anywhere."
echo "  3. $ROOT/.workgroup/<repo>/README.md"
echo "     For the repo this session is working in -- runtime, ports, service and tooling dependencies, branch, tracker."
echo "     PLUS each repo named in its SERVICE_DEPS. Do NOT read every member's file."
echo "     For topology questions rather than repo questions, read .workgroup/__SOLUTION__/MAP.md instead."

if [ ! -d "$ROOT/.memory" ]; then
  echo
  echo "!!! $ROOT/.memory does not exist. These stores are gitignored, so this is what a fresh clone looks like. Say so rather than proceeding as if there were no carried-forward state."
fi

cat <<'TXT'

Then report in three buckets, and wait:

  IN FLIGHT / BLOCKED / NEXT

  - Every item carries a concrete identifier -- ticket id, PR number, commit SHA, file path, SLA date. "The approval is stale" is weak; "neilzo approved 560c5ce, head is now c03bb619e9" is useful.
  - Name the owner or blocker, so what is his to move is obvious.
  - Re-verify anything volatile before reporting it as current -- a PR state, a branch head, whether the stack is up. These files are read as current by default, which is exactly what makes a stale line expensive.
  - Name what looks stale rather than relaying it.
  - State confidence honestly: "hazard, unreproduced" rather than dressing it up as confirmed.

The test of success: state the current urgent ticket, the branch it is cut from, and the environment hazards a cold session would trip over -- without being prompted for any of the three. If one cannot be answered from the files, say WHICH, rather than filling the gap with something plausible.

This is a gather, not a start-work instruction. Report and wait for the go-ahead.
TXT

# --- Priority queue -> session task list ---------------------------------------
# The durable list is todo_list.md; the session task list is a VIEW of it, and the
# view is rebuilt each session because the task tools are session-scoped -- anything
# created in the TUI is gone when the session ends unless it was written back.
#
# ONLY the priority queue is mirrored. The three-queue structure exists so the work
# queue and the dead letter do not compete for attention; importing all of it would
# undo the thing the structure was built for.
#
# Parsed, never hardcoded: the file's SHAPE is stable (a "# ... Priority queue"
# heading, "## " item headings, "- [ ]" steps), its CONTENT changes constantly.
TODO="$ROOT/.memory/todo_list.md"

emit_priority_queue() {
  [ -r "$TODO" ] || { echo "MISSING"; return 0; }
  awk '
    # A top-level "# " heading (not "##") opens or closes the section.
    /^#[^#]/ {
      if (inq) { exit }                       # next top-level heading ends it
      if (tolower($0) ~ /priority queue/) { inq = 1; seen = 1 }
      next
    }
    !inq { next }
    # Item heading: "## 1. `TICKET-1` -- title"
    /^##[[:space:]]/ {
      h = $0
      sub(/^##[[:space:]]*/, "", h)
      sub(/^[0-9]+\.[[:space:]]*/, "", h)
      gsub(/\*\*/, "", h)
      if (h != "") { print "H\t" h; emitted = 1 }
      next
    }
    # Ticked boxes are residue: this list DELETES closed items rather than ticking them,
    # so their presence is itself worth reporting.
    /^[[:space:]]*[-*][[:space:]]*\[[xX]\]/ { ticked++; next }
    # Unchecked step: "- [ ] ...". Checked ones are skipped -- the list deletes
    # rather than ticks, so a "[x]" is residue, not work.
    /^[[:space:]]*[-*][[:space:]]*\[[[:space:]]\]/ {
      s = $0
      sub(/^[[:space:]]*[-*][[:space:]]*\[[[:space:]]\][[:space:]]*/, "", s)
      gsub(/\*\*/, "", s)
      gsub(/[[:space:]]+/, " ", s)
      if (s != "") { print "S\t" s; emitted = 1 }
      next
    }
    END {
      if (!seen) { print "NOHEADING" }
      else if (!emitted) { print "EMPTY" }
      if (ticked) { print "T\t" ticked }
    }
  ' "$TODO" 2>/dev/null
}

queue=$(emit_priority_queue)
ticked=$(printf '%s\n' "$queue" | awk -F'\t' '$1=="T"{print $2}')
items=$(printf '%s\n' "$queue" | grep '^[HS]	' || true)

echo
echo "-----------------------------------------------------------------------"
echo "RUNTIME TRIGGER -- mirror the priority queue into the session task list."
echo

if printf '%s\n' "$queue" | grep -q '^MISSING$'; then
  echo "SKIP: $TODO is not readable. Do not invent a task list -- say the master list is missing when you report."
elif printf '%s\n' "$queue" | grep -q '^NOHEADING$'; then
  echo "SKIP: no 'Priority queue' heading found in $TODO -- the file's structure may have changed."
  echo "Read the file yourself, mirror the head of it by hand, and TELL THE OPERATOR the parser missed, so this hook gets fixed."
elif [ -z "$items" ]; then
  echo "SKIP: the priority queue is EMPTY -- nothing pre-empts the work queue right now."
  echo "Say so when you report, and do not create tasks from the work queue to fill the gap. The"
  echo "three-queue structure exists so the work queue does not compete for attention with what"
  echo "actually pre-empts; importing it here would undo that."
else
  echo "FIRST check what is already in the session task list, and create only what is MISSING."
  echo "This hook also fires on 'clear', which does not necessarily end the session -- so tasks from"
  echo "before the clear may still be there, and creating blindly would duplicate them."
  echo
  echo "Then create ONE task per numbered line below, in this order, with TaskCreate. Take the task"
  echo "subject from the leading phrase (up to the first full stop), keep it under ~60 characters,"
  echo "and put the whole line in the description. Do NOT mark any of them in_progress -- this is"
  echo "a gather, and it does not start work."
  echo
  n=0
  group=""
  pending=""
  # Second pass: a heading WITH steps contributes its steps; a heading with NO
  # open steps is itself the unit of work.
  while IFS=$'\t' read -r kind text; do
    case "$kind" in
      H)
        if [ -n "$pending" ]; then n=$((n + 1)); printf '  %d. %s\n' "$n" "$pending"; fi
        group="$text"; pending="$text"
        ;;
      S)
        pending=""
        n=$((n + 1))
        if [ -n "$group" ] && [ "${#group}" -gt 3 ]; then
          printf '  %d. [%s] %s\n' "$n" "${group%% --*}" "$text"
        else
          printf '  %d. %s\n' "$n" "$text"
        fi
        ;;
    esac
  done <<EOF
$items
EOF
  if [ -n "$pending" ]; then n=$((n + 1)); printf '  %d. %s\n' "$n" "$pending"; fi
  echo
  echo "This list is a VIEW. $TODO stays the record."
  echo "It is rebuilt every session, because the task tools are session-scoped: nothing in the TUI"
  echo "list survives this session unless it was written back to that file. When one of these tasks"
  echo "completes, reconcile the file -- the entry is DELETED, not ticked, and only once its own"
  echo "source says the work is done."
fi

if [ -n "$ticked" ] && [ "$ticked" != "0" ]; then
  echo
  echo "NOTE: $ticked ticked '[x]' item(s) in the priority queue were SKIPPED. That list deletes closed"
  echo "items rather than ticking them, so a ticked box is residue -- flag it when you report."
fi
exit 0
