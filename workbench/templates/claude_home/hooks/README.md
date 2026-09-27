# `~/.claude/hooks/` — runtime-fired behaviours

These run because **the harness runs them**, not because an assistant remembered to. That is the whole point: a rule that depends on a model noticing a trigger is a rule that fails exactly when the session is busy, which is when it matters.

Wired in `~/.claude/settings.json` under the `hooks` key. Every script here **always exits 0** — a hook that errors must never block work. Exit 2 would block an action; nothing here ever uses it.

**None of these files may be a symlink.** They are what is supposed to survive when a symlink target goes away.

| Script | Event | Fires when | Emits |
|---|---|---|---|
| `guard_claude_md.sh` | `SessionStart` (`startup\|resume\|clear\|compact`) | every session, and again after compaction | `~/.claude/CRITICAL_RULES.md`, unconditionally — plus a loud banner if `~/.claude/CLAUDE.md` is dangling, empty or missing |
| `boot_memory.sh` | `SessionStart` (`startup\|clear`) | a fresh session only, not on resume/compact | the `boot memory` read order and the in-flight / blocked / next report format |
| `cleanup_on_stop_phrase.sh` | `UserPromptSubmit` | a prompt matches `stopping_phrases.txt` | the `clean_up_hook` sweep, **stopping-point** flavour — record where things stopped, do not delete |
| `cleanup_on_git.sh` | `PostToolUse` on `Bash`, narrowed by `if: "Bash(git *)"` | a `git commit` or `git push` just ran | the `clean_up_hook` sweep, **completion** flavour — update, clean, delete |
| `reconcile_on_task_done.sh` | `PostToolUse` on `TaskUpdate` | a session task is set to `completed` | the `clean_up_hook` sweep aimed at **one entry** of `.memory/todo_list.md` — close it against its source, then **delete** it |

## The session task list is a view, not a second todo list

`boot_memory.sh` and `reconcile_on_task_done.sh` are the two halves of one mechanism, and the framing matters more than either script.

**It is a load-and-reconcile, not a sync.** `.memory/todo_list.md` is the durable master. The TUI task list is **session-scoped** — the task tools say "for your current coding session", and the per-session store holds only a counter and a lock, so anything created there is gone at session end unless it was written back. Treating the two as peers that sync would put the durable record at the mercy of the ephemeral one.

So: import at session start, remind on completion.

- **Only the priority queue is imported.** That is not a detail. The three queues exist *precisely* so the work queue and the dead letter do not compete for attention; importing all ~36 open items would undo the thing the structure was built for. Today the priority queue is one ticket and its ordered steps, which is the right size for a TUI list.
- **The hook cannot call `TaskCreate`** — hooks inject context, they do not call tools. So it emits the items in a numbered, task-shaped form and says plainly to create them.
- **The queue is parsed, never hardcoded.** The file's *shape* is stable (a top-level `# … Priority queue` heading, `## ` item headings, `- [ ]` steps); its *content* changes constantly.
- **Grouping rule:** a `## ` heading **with** open steps contributes its steps as the tasks, prefixed with its ticket id. A heading with **no** open steps is itself the task.
- **Ticked `[x]` boxes are skipped and counted.** In that list a closed item is *deleted*, not ticked, so a ticked box is residue — the hook reports how many it saw rather than silently dropping them.
- **An empty priority queue is reported as empty**, and explicitly says not to backfill from the work queue. Distinguishing "heading present, nothing in it" from "heading missing" was a real bug caught in the test matrix — the two need different responses, since the second means the parser has gone stale and should be reported.
- **`reconcile_on_task_done.sh` never rewrites `todo_list.md`.** A shell script cannot reliably tell which markdown item a task id maps to, and a bad write to an unversioned store is unrecoverable. It makes the reconciliation unmissable; the judgement stays with the session — the same division every other hook here uses.

### Why this one dedupes by identity instead of debouncing on a timer

`cleanup_on_git.sh` debounces for 60 seconds because a shell command has **no stable identity**, and that timer was observed swallowing a genuine second trigger.

A task completion *does* have an identity: a task id. So `reconcile_on_task_done.sh` records the `(session, taskId)` pair under `state/` and fires once per pair. That suppresses only what is genuinely one event — the same task set completed twice — and **can never suppress a different item's closure**, which a timer would do whenever two tasks close inside the same minute.

The failure modes are asymmetric and that is the whole argument: a duplicate reminder is cheap noise, a suppressed one is silent staleness in a store the next session reads as current. Keyed by session because task ids restart at `1` in every session; files older than 7 days are pruned on each run.

### Payload shape it filters on

`TaskUpdate`'s `tool_input` carries a `taskId` and, *optionally*, a `status`. An update that only renames a task or edits its description carries no status at all — so the hook requires `status` to be exactly `completed`, and stays silent on `pending`, on `in_progress`, and on status-free updates. A `subject` appears when the same call renames the task, and is used to name the task in the reminder; it is free text, so the JSON envelope is built with `jq` rather than by hand.

### The fixture override

`boot_memory.sh` now takes its state-store root from an environment variable, falling back to the same absolute path it always used. The default is unchanged — the variable exists so the queue parser can be exercised against fixture files instead of only against the live store.

## Extending the stopping-point triggers

Edit **`stopping_phrases.txt`**. One extended regular expression per line, matched case-insensitively against the prompt; `#` comments and blank lines are ignored. No JSON to touch, no restart needed — the file is read on every prompt.

## Design notes worth knowing before changing anything

- **`cleanup_on_git.sh` matches on command position, not on mention.** The word must sit at the start of a line or straight after a separator, and comment lines are stripped before matching. Without that, any command that merely *talks about* committing — an `rg` for the phrase, a heredoc writing a script — fires it. This was caught live: the hook fired twice while being tested, on the test harness's own text. Verified against a 14-case matrix covering `-C <path>`, chained and piped forms, multi-line scripts, and the false-positive classes above.
- **`cleanup_on_git.sh` filters twice on purpose.** `settings.json` narrows with an `if` rule, and the script re-checks the command out of `tool_input.command` itself. The script's check is the guarantee: if `if` is ever unsupported or changes shape, the hook still stays silent on every non-git Bash call instead of firing on all of them.
- **`PostToolUse` must emit JSON.** Plain stdout from a `PostToolUse` hook is *not* added to the model's context — only `hookSpecificOutput.additionalContext` is, and it must be **nested** under `hookSpecificOutput`; a top-level `additionalContext` is silently ignored. `SessionStart` and `UserPromptSubmit` inject plain stdout directly, which is why those three scripts print text and this one prints JSON.
- **`UserPromptSubmit` has a 30-second timeout**, not the 10 minutes other events get. `cleanup_on_stop_phrase.sh` runs in ~25 ms and bails early on prompts over 600 characters, which are pasted material rather than a sign-off.
- **`cleanup_on_git.sh` debounces for 60 seconds** via `state/last_cleanup_reminder`, because `git commit && git push` is one landing and should produce one reminder. Delete the debounce block if a missed second sweep ever matters more than the duplicate.
- **`jq` is required** (`/usr/bin/jq`). Every script that needs it checks and exits 0 silently if it is absent, so a missing `jq` degrades to "hooks do nothing" rather than "everything breaks".

## Verifying a hook actually fires

```sh
# PostToolUse — should print JSON
echo '{"tool_input":{"command":"git commit -m x"}}' | ~/.claude/hooks/cleanup_on_git.sh
rm -f ~/.claude/hooks/state/last_cleanup_reminder   # clear the debounce between tries

# UserPromptSubmit — should print the stopping-point sweep
echo '{"prompt":"closing up shop"}' | ~/.claude/hooks/cleanup_on_stop_phrase.sh

# SessionStart
~/.claude/hooks/boot_memory.sh </dev/null
~/.claude/hooks/guard_claude_md.sh </dev/null

# PostToolUse on TaskUpdate — should print JSON; a second run with the SAME
# taskId prints nothing (identity dedupe), a different taskId prints again
echo '{"session_id":"T","tool_input":{"taskId":"1","status":"completed"}}' | ~/.claude/hooks/reconcile_on_task_done.sh
rm -f ~/.claude/hooks/state/tasks_reconciled_T   # clear the dedupe between tries

# SessionStart — the queue import can be run against a fixture instead of the live store
AGENT_STATE_ROOT=/path/to/fixture ~/.claude/hooks/boot_memory.sh </dev/null
```

In a live session, `/hooks` lists what is registered, and `claude --debug` shows each hook running.

**If `cleanup_on_git.sh` never fires in a real session** but works standalone, the `if` rule is the suspect. Remove the `"if": "Bash(git *)"` line from `settings.json`; the script's own command check then does all the filtering, at the cost of one ~25 ms process spawn per Bash call.

## Watched symlinks

`guard_claude_md.sh` warns each session about symlinks in `~/.claude/` whose target has gone away — the same silent-failure class as a dangling `CLAUDE.md`, since a broken link reads as *absent* rather than as an error. The watch list is the `WATCHED_LINKS` variable at the top of that script, one path per line. `~/.claude/adws` is on it because it points into `~/agentic/`, which is being wiped.

## Restore on a new machine

`~/.claude/` is not a git repository — which is exactly why it survives every repo operation, and exactly why it has no history of its own. Two tracked copies outside it close that gap:

| Copy | What it is | Placeholders |
|---|---|---|
| `<state-repo>/templates/claude_home/` | The **installable kit** — `install.sh` places every `hooks/*.sh`, sets the executable bit a copy loses, and substitutes the placeholders. `settings.hooks.json` holds the `hooks` key to merge by hand | `__HOME__`, `__STATE_ROOT__`, `__SOLUTION__` |
| `<state-repo>/config/claude/hooks/` | A plainer **restore source**, closer to the live bytes | `__SOLUTION__` only |

Neither is a byte mirror, and that is deliberate — a restore source with this machine's absolute paths baked in reproduces this machine, not the bench. **After changing a hook, update both**, and use `command cp`: plain `cp` is aliased to `cp -i` here and an aliased copy waits for a confirmation that never arrives in a script, so the copy silently does not happen.

Still open: a **drift check** in `guard_claude_md.sh` comparing the live scripts against the tracked copies, so an edit that never made it back announces itself. See `~/.claude/CONFIG_SETUP.md`.
