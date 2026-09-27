#!/bin/bash
# reconcile_on_task_done.sh -- PostToolUse hook on TaskUpdate.
#
# The session task list is a session-scoped VIEW of .memory/todo_list.md (boot_memory.sh
# builds it at session start). Marking a task completed in the TUI therefore changes
# NOTHING durable -- the view is discarded when the session ends. This hook makes the
# write-back unmissable at the moment the closure happens.
#
# IT DELIBERATELY DOES NOT EDIT todo_list.md. A shell script cannot reliably tell which
# markdown item a task id corresponds to, and a wrong edit to an unversioned store is
# unrecoverable. The hook's job is to make the reconciliation impossible to miss; the
# judgement stays with the session. Same division as the other clean-up hooks.
#
# Payload shape (verified from session transcripts):
#   .tool_input = {"taskId":"3","status":"completed"}   -- status is optional; subject
#   and description also appear when the same call renames or annotates the task.
#
# Contract: reads the PostToolUse payload on stdin, writes JSON on stdout, ALWAYS exits 0.

set -u

STATE_DIR="$HOME/.claude/hooks/state"

payload=$(cat 2>/dev/null) || exit 0
[ -n "$payload" ] || exit 0

command -v jq >/dev/null 2>&1 || exit 0

status=$(printf '%s' "$payload" | jq -r '.tool_input.status // ""' 2>/dev/null) || exit 0
# Only a COMPLETION triggers the sweep. pending/in_progress are not closures, and a
# TaskUpdate that only edits a subject or description carries no status at all.
[ "$status" = "completed" ] || exit 0

task_id=$(printf '%s' "$payload" | jq -r '.tool_input.taskId // ""' 2>/dev/null)
subject=$(printf '%s' "$payload" | jq -r '.tool_input.subject // ""' 2>/dev/null)
session=$(printf '%s' "$payload" | jq -r '.session_id // "nosession"' 2>/dev/null)
# The session id becomes part of a filename, so refuse anything that is not id-shaped.
case "$session" in ''|*[!A-Za-z0-9._-]*) session="nosession" ;; esac

# --- Dedupe by IDENTITY, not by time ------------------------------------------
# cleanup_on_git.sh debounces on a 60-second timer because a shell command has no stable
# identity -- and that timer was observed swallowing a genuine second trigger.
#
# Here the identity IS available: a task id. So this dedupes on (session, taskId). That
# suppresses only what is genuinely one event -- the same task set completed twice -- and
# can NEVER suppress a different item's closure, which a timer would do whenever two tasks
# close inside the same minute. The failure modes are asymmetric: a duplicate reminder is
# cheap noise, a suppressed one is silent staleness in a store the next session reads as
# current. So: no timer.
#
# Keyed by session because task ids restart at 1 in every session.
if [ -n "$task_id" ]; then
  mkdir -p "$STATE_DIR" 2>/dev/null
  seen_file="$STATE_DIR/tasks_reconciled_$session"
  if [ -f "$seen_file" ] && grep -qxF "$task_id" "$seen_file" 2>/dev/null; then
    exit 0
  fi
  printf '%s\n' "$task_id" >> "$seen_file" 2>/dev/null
  # Prune abandoned session files. Cheap, and stops the directory growing without bound.
  find "$STATE_DIR" -maxdepth 1 -name 'tasks_reconciled_*' -mtime +7 -delete 2>/dev/null
fi

# Build the label through jq rather than by hand: a task subject is free text and can
# carry quotes, backslashes or newlines, any of which would produce invalid JSON.
label=$(TID="$task_id" SUBJ="$subject" jq -rn '
  ( env.TID | if . == "" then "an unnamed task" else "task " + . end ) as $t
  | if env.SUBJ == "" then $t else $t + " (" + env.SUBJ + ")" end
' 2>/dev/null) || label="a task"
[ -n "$label" ] || label="a task"

MSG="RUNTIME TRIGGER -- clean_up_hook is now due (completion): ${label} was marked completed.

The session task list is a SESSION-SCOPED VIEW of .memory/todo_list.md. Completing a task there changes nothing durable -- the view is discarded when this session ends. The durable list still says this work is open, and the next session will read it as current.

Reconcile now, in this turn, without being asked:

1. Find the entry in __STATE_ROOT__/.memory/todo_list.md that this task came from. If it came from nowhere -- an ad-hoc task for this session's own steps -- say so in one line and stop. Not every task has a durable counterpart.
2. CLOSE IT AGAINST ITS OWN SOURCE, never against the belief that the work finished: the tracker for a ticket, the forge for a PR, the tree for a \"not built\". If the source does not confirm it, the item is NOT closed -- leave it, and say what is still outstanding.
3. DELETE the entry. Do not tick it. That list's own rule is that a ticked box is a changelog, and completed_work.md is where a changelog belongs. If a priority-queue item is now empty of open steps, remove the item, and say what should be promoted in its place -- or that nothing should.
4. Same batched pass over the OTHER stores, against one picture of what just changed: .memory/running_context.md and any topic note, .workgroup/<member>/ including PRs/<TICKET>.md, and .profile/ only where the change altered what his setup actually is.
5. Say what you did in ONE line -- updated / cleaned / deleted. One line total, not one per file.

If nothing durable is affected, say so in one line and move on."

# jq builds the envelope so the message never has to be hand-escaped. If jq fails for any
# reason, emit nothing rather than malformed JSON -- failing quiet, never failing loud.
MSG="$MSG" jq -nc '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:env.MSG}}' 2>/dev/null
exit 0
