# Shortcuts

My personal vocabulary — short phrases that mean "do this specific thing" so I don't have to
spell it out mid-flow. Agents should act on these immediately and carry on, not stop to
confirm.

Living document. Add and drop as the vocabulary settles.

---

## Capture — file it and keep moving

This exists so a thought gets recorded without derailing what I'm doing. **It is not a
request to go do the work described.**

### `park this <thing>`

Add it to the deferred-work list in the relevant repo's **`.memory/`** — `~/Notes/` is retired as of 2026-09-13.

- Dated batch, **newest at the top**, opened with one short line of context so the batch
  stands alone weeks later
- Every item states **what it is, why it's parked, and what unblocks it** — an item with no
  unblock condition sits forever
- **Don't rewrite history.** Strike through or move to a resolved section; don't delete
- Short and simple. This is a parking lot, not a write-up — detail belongs in the ticket

> **`adw this` / `adw - <description>` is retired.** Use **`adw distill observations`** instead:
> an observation recording captures a candidate workflow *as it happens*, which is what the
> note was trying to reconstruct afterwards. Its scratchpad was `~/agentic/scratchpad/` and is
> being wiped; the labels it used now live in `adw distill observations` below.

---

## Status

### `boot memory`

Gather the working context before doing anything else. **Run it at the start of a session**
without being asked, and again after any gap long enough that the stores may have moved.

Read in this order and stop there — each file links whatever else matters:

1. `.memory/running_context.md` — where things stand and which rules are in force
2. `.memory/todo_list.md` — the single master list of open work
3. `.workgroup/<repo>/README.md` for the repo the work is in, **plus each repo named in its
   `SERVICE_DEPS`**

All three of those live in the **workbench home** at `~/.workbench/__SOLUTION__/`, whichever repo the session started in — they will not auto-load from anywhere else. Note this is the read order, not the store list: the third store, `.profile/`, did **not** move to the workbench home and `boot memory` does not read it — it remains a local private overlay at the package root.

Then report in three buckets — **in flight / blocked / next** — every item carrying a concrete
identifier.

**The test of success:** state the **current urgent ticket**, the **branch it is cut from**,
and the **environment hazards** a cold session would trip over — without being prompted for
any of the three. If one cannot be answered from the files, say which, rather than filling the
gap with something plausible.

- **This is a gather, not a start-work instruction.** Report and wait for the go-ahead
- **Re-verify anything volatile** before reporting it as current — a PR state, a branch head,
  whether the stack is up
- **Name what looks stale** rather than relaying it. These files are read as current by
  default, which is exactly what makes a stale line expensive

> **Fired by the harness.** A `SessionStart` hook
> (`~/.claude/hooks/boot_memory.sh`) injects this at the top of every fresh session, so it
> does not depend on an agent remembering. Saying it out loud re-runs the gather.

### `where are we at`

A **bucketed status report of open state**, not a narrative recap. Group by what each item is
waiting on — *parked pending X* / *blocking Y* / *next* — and adapt the buckets to the work.

- Every item carries a **concrete identifier**: ticket id, PR number, commit SHA, file path,
  SLA date. "The approval is stale" is weak; "neilzo approved `560c5ce`, head is now
  `c03bb619e9`" is useful
- **Name the owner or blocker** so it's obvious what's mine to move and what isn't
- **State confidence honestly** — flag a finding as "hazard, unreproduced" rather than
  dressing it up as confirmed
- Close with **environment state** and a one-line tally of what the session produced
- Re-verify volatile facts (PR state, SLA dates, whether the stack is up) rather than
  replaying stale numbers — stale status in this format reads more confident than it deserves

### `brief me`

`/triage` view — prioritized list of what to pick up next.

---

## Maintenance

### `run clean up`

The `clean_up_hook`, invoked by hand. It normally fires on its own triggers — a closed todo, a
merged PR, a commit and a push, the end of a day — and this is the same pass asked for out
loud, for when a trigger was missed or several have stacked up.

**One batched pass over every ephemeral store**, in a single turn, against one picture of what
changed. Edits dripping out file-by-file are how two stores end up reconciled against
different moments.

1. **Name what actually changed** — a head, a count, a status, a file that now exists, a risk
   now retired, a question now answered
2. **Open every store**, not only the one you were working in: `.memory/`
   (`running_context.md`, `todo_list.md`, every topic note), `.workgroup/<member>/` including
   `PRs/<TICKET>.md`, and `.profile/` where the change altered the setup itself
3. **Apply all three motions** — **update** what is outdated, **clean** what is now
   misleading, **delete** what the change made pointless. The first happens by itself; the
   other two are the reason this exists
4. **Close each record against its own source, never against another record.** A ticket file
   retires against the tracker, a PR line against the forge, a "not built" against the tree.
   Reconciling two notes against each other propagates whichever one is wrong
5. **Say what you did in one line** — updated / cleaned / deleted — so the sweep is visible
   without opening anything

One line, not one per file. A per-file report is longer than the sweep it describes.

> **Two of its triggers are fired by the harness.** A `PostToolUse` hook
> (`~/.claude/hooks/cleanup_on_git.sh`) fires the **completion** flavour after a `git commit`
> or `git push`; a `UserPromptSubmit` hook (`~/.claude/hooks/cleanup_on_stop_phrase.sh`) fires
> the **stopping-point** flavour on sign-off language, whose triggers are listed in
> `~/.claude/hooks/stopping_phrases.txt` and are editable without touching JSON. A closed
> todo, PR or ticket still relies on the agent noticing — and this phrase is the remedy when
> it does not.

### `run defrag`

An orchestrated consolidation of the stores. **Distinct from `run clean up`:** clean up
reconciles records against reality and is cheap enough to fire on every trigger; defrag
reorganizes for legibility and removes redundancy. It changes the **shape** of the stores
rather than their truth, which is why it is gated and clean up is not.

Four phases, in order, and the gate is real:

1. **Survey** `[agentic, parallel]` — one agent per store, **read-only**. Each writes findings
   to `.memory/group_think/session_<date>_defrag/<agent>.md`; concurrent writes to one file
   clobber each other, which is what the folder is for
2. **Propose** — the orchestrator merges the surveys into the session's single plan file,
   stating for every item what moves where and what is deleted
3. **Approve** — **nothing executes before the operator says so.** None of the stores is
   version controlled, so a wrong deletion is unrecoverable. That is the whole reason for the
   gate, and it is not a formality to be optimized away
4. **Execute** `[agentic, parallel]` — agents apply the approved plan with full autonomy, one
   per store, each reporting what it changed

- **Deletions are named individually in the proposal**, never summarized as a count. "Removed
  11 stale entries" is not something anyone can approve
- **Redundancy is resolved by choosing a canonical home and pointing at it** — not by keeping
  the better copy and trusting that nobody reads the other one
- **Something true but filed in the wrong store is moved, not deleted.** Defrag is a filing
  pass; losing content to it is its failure mode

> **Invocation only — no hook.** Deliberately: a pass that reshapes unversioned stores must
> never start on its own.

### `adw distill observations`

Turn the raw observation corpus into reusable pieces, and **only then** retire the recordings.
Recordings are bulky, disposable and full of workspace paths; what outlives one is what was
distilled out of it.

1. **Distill** each recording into candidates, **labelled with the piece each could become**,
   so the decomposition work is visible up front. One candidate can carry several labels; mark
   a guess with `?` — a label is a hint for the decomposition pass, not a commitment

   | Label | Becomes |
   |---|---|
   | `prompt` | a finished, quoted prompt for an agentic step |
   | `command` | a literal package script or CLI call for a deterministic step |
   | `deferral` | a hand-off to a workflow you do not own, plus the continuation that resumes the run |
   | `tool` | a script that needs writing |
   | `skill` | a reusable multi-step markdown workflow |
   | `template` | a reusable output shape |
   | `context asset` | standing constraints, loaded not executed |
   | `adw` | a whole workflow in its own right |

2. **Dedupe and consolidate across the corpus before anything is shown.** A technique
   appearing in four recordings is one candidate with four pieces of evidence, not four
   candidates
3. **Present for approval**, one question per candidate: **is it fundamentally sound, and is
   it worth keeping?** Those are two judgments and a candidate can fail either
4. **Suggest improvements** beside each — what the recording did awkwardly, and what the
   extracted piece should do instead
5. **Retire the raw recordings last**, after approval, and only those whose content is now
   held somewhere else

- **Cite the recording each candidate came from**, so a decision can be checked against what
  actually happened rather than against the summary of it
- **A candidate with a single occurrence is reported as such.** Reuse must be earned — a piece
  is extracted once a second consumer exists, not in anticipation of one
- **Nothing is retired on the strength of having been distilled.** The test is that the
  distilled piece is approved and filed, not that a pass ran over the recording

> **Invocation only — no hook.** It ends in deletions that need approval.

---

## Execution

### `safe ship`

`/deliver` — run **all** gates, hold at the PR for my review, **do not auto-merge**.

### `dry run` · `show me first`

Do the work but **do not commit or open a PR**. Show the diff or plan and wait.

### `wip`

Commit to the current branch with a `wip:` message. No PR.

### `boot the local`

Start the **whole** local stack, not just the service in question — via `__STACK_BOOT_CMD__`
wherever a repo has a `Procfile`, registering additional repos into the same instance rather
than starting a second supervisor.

### `yolo X` · `ship X autonomously`

`/fsd X --yolo` — hands-off, low-risk auto-merge after code-review approval.

---

## Notes

- Shortcuts marked with a `/command` depend on the **ABL / SDLC plugin** being installed;
  without it, treat them as descriptions of intent rather than literal invocations.
- Team-shared aliases (the `/design`, `/fix`, `/develop` routing table) live in
  `__WORK_ROOT__/CLAUDE.md` and apply to everyone on the team — these here are mine alone.
- **This file's home is `~/.claude/SHORTCUTS.md`.** It used to live in `~/agentic/`, which is
  being wiped; `~/.claude/` is not a git repo, so nothing there is destroyed by re-cloning,
  wiping or moving any repository.
- The global instruction file — `~/.claude/CLAUDE.md` — keeps a compact trigger index pointing
  here, so an agent recognizes a shortcut even before reading this file. See
  `~/.claude/CONFIG_SETUP.md` for how the two fit together.
- **Some shortcuts now have a harness hook behind them**, so the behaviour fires from the
  runtime rather than depending on an agent noticing a trigger. `boot memory` fires on
  `SessionStart`; `run clean up` fires on a `git commit`/`git push` and on sign-off language.
  `run defrag` and `adw distill observations` are invocation-only on purpose — both end in
  deletions from unversioned stores. The scripts and their notes are in
  `~/.claude/hooks/README.md`.
