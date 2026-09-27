# 🗒️ Local folders

Three local overlays/state folders, none committed. **Create an absent folder only at its documented local location** -- they are environment-owned, ignored, and additive; they are not portable content.

| | Holds | Lives as long as |
|---|---|---|
| `.memory/` | What is worth carrying to the next session | Until acted on or stale |
| `.profile/` | Who is operating this package -- preferences, growth direction | As long as that person does |
| `.workgroup/` | A folder per workgroup this discipline is applied to, plus run scratch | The workgroup, and the run |

**Where a session reads them is not where they live, and since 2026-09-16 they do not share a root.** `.memory/` and `.workgroup/` are real directories in the **workbench home** at `~/.workbench/<org>/`, named directly by every reader — **no symlink**, which was decided explicitly and replaces the earlier plan to surface them at the package root. `.profile/` remains a real, local private overlay at the package root. No backup or provisioning source is prescribed: another environment's context must not be copied here merely for convenience. [`../defaults/defaults.json`](../defaults/defaults.json) carries the arrangement and its `status` fields say which half of each row is built. The conventions below hold either way -- they are about the contents, not the backing store.

`.profile/` is what keeps `foundations/` standalone: anything true of one person goes there rather than into doctrine. `.workgroup/` is distinguished from `.memory/` by subject -- `.memory/` is about this package, a folder in `.workgroup/` is about something this package is applied to, and loose scratch at its root belongs to neither and is cleared when the run ends. The rest of this file is about `.memory/`, which has the most structure.

## `.memory/`

It is **the agent's scratchpad**. It is never committed. The current runtime location is the workbench-home state root, not this package root; the package's `.gitignore` also guards against accidentally creating and tracking a root-local instance.

Because it is never shared, the *conventions* for it live here, in a committed file, rather than inside it.

## How it is organised

`.memory/` holds whatever is worth keeping track of and later clearing out. Two things it is specifically for:

- **Carrying a thread across a deliberately restarted session.** When context grows unwieldy the right move is to start a clean session, and this folder is what survives that boundary. A cold-start note here is load-bearing, not a courtesy.
- **Making proposals and half-formed ideas visible.** Something does not have to be finished to be written down here.

It is a staging area, not an archive.

**Folders are topics.** A folder name says what the thinking inside it is about, so someone can follow a line of thought, or come back to something discovered earlier and decide it has earned a permanent home. Promotion out of `.memory/` into the package is the expected end state for anything that proves important; most items will never get there, and that is fine.

```
.memory/
  <topic>.md              a single note -- a topic that has not needed more than one file yet
  <topic>/                a topic with more than one file
    <kind>_<short_description>.md
```

- **A topic gets a folder once it has a second file.** One file does not need one; a folder per file is noise, and noise is what makes a staging area stop being read.
- **Filenames carry a kind prefix** -- `proposal_`, `adw_` -- even inside a folder that already implies it. The redundancy is deliberate: these files are meant to be **promoted out**, and a name that survives the move is worth a repeated word.
- **Everything here is plain `.md`.** The folder is already ignored as a whole, so the `*.memory.md` suffix adds nothing inside it.

## Current topics

This table drifts the moment a file is added without updating it. If it disagrees with the folder listing, the listing wins.

| Path | Thinking about |
|---|---|
| `tool_purpose.md` | What this package is for, and the boundary it must not cross |
| `sdlc_plugin.md` | The de-facto delivery workflow that generated workflows compose around |
| `adws/` | Where ADWs are today versus where they are going |
| `proposals/` | Proposed changes to this package, each promotable to a spec |
| `package_cleanup.md` | The in-progress cleanup -- what is settled, what is still open |
| `running_context.md` | What is true about this package right now -- shape, standing rules, gates. Outlives a run |
| `todo_list.md` | The run in progress. Wiped at the end of every run |
| `engineer_growth.md`, `engineer_preferences.md` | Who this package is being operated by, and what they have asked for |
| `foundations_audit.md` | `foundations/` measured against the external manual it answers to |
| `reference_apps/` | Implementations studied for prior art |

## Writing notes

One topic per file. Keep them short and current -- **correct a stale fact in place** rather than appending a correction beneath it, and delete a file whose topic is resolved. These are notes to act on, not a log.

**In place because this is a record store, and the discriminator is the artifact rather than the correction.** A record store holds what is true now, so a superseded fact here is noise. An **audit-bearing record** -- a ticket, a review, a pull request -- is the opposite artifact: it *is* the trail, so a correction there is **appended**, because deleting what was believed destroys what a reader needs in order to judge the current claim. Everything in `.memory/` is the first kind; nothing in it is the second. Getting this backwards is easy and quiet -- the same instinct has been applied in both directions in one session and been wrong both times -- so decide by asking which artifact is in front of you, not by which motion feels tidier.

What belongs: facts about the target environment that would otherwise be rediscovered -- its de-facto tooling, known limits of the current approach, gaps between where things are and where they are going -- plus the working state of the run in progress. What does not: anything that belongs in this package's tracked documentation, because a decision recorded only here is a decision nobody else can review.

**`running_context.md` carries what a fresh session needs and `todo_list.md` carries the run.** The first holds durable state -- the package's shape, the rules in force, where the gates stand -- and is corrected in place rather than appended to. Keep it to a screen; longer than that and it has become a log.

**`todo_list.md` is the run's working plan**, as bulleted actionable steps. It is written before the work starts, worked top to bottom, rewritten as the work reveals things, and **wiped clean at the end of every run**. The wipe is the part that matters: a list left behind is read by the next session as outstanding work, and a stale list is worse than no list because it looks authoritative. Finishing the work and clearing the list are one step.

A generated workflow running out of a target project keeps its own run state under its own run artifacts, not here.

## `clean_up_hook`

**Event: a declared stopping point.** The transition is the trigger, so the sweep happens while whoever caused it still knows what it touched. The trigger list is **open by design** -- an adopter names the scenarios that apply to their work, and each one is an entry rather than an exception.

Two families, and they sweep differently:

- **Completion** -- a todo item, a pull request or a tracker item entering a closed state. The question is *what did finishing this make stale?* Records that existed only to track the thing are now wrong or pointless, and retiring them is the work.
- **Discontinuity** -- the session ending, work being set down to resume later. The question is different: *what would mislead someone who reads this cold?* Nothing is finished, so deletion is usually wrong; the work is recording where things actually stopped -- what is half-done, what is still running, what was about to happen next.

Getting these the wrong way round is the failure to avoid. Sweeping a discontinuity as though it were a completion deletes in-flight state that nothing else records. Sweeping a completion as though it were a discontinuity leaves a finished thing described as pending, which is the stale-record defect this exists to prevent.

It is an [observing hook](../foundations/Agentic_Engineering/primitives/hook.md) and follows that primitive: it never raises, and a failure inside it must not take the run with it. It guards nothing and blocks nothing -- by the time it fires, the work is already done.

**It is executed, not observed.** Where the runtime has no hook to register, the actor performs it as part of its own lifecycle, in the same turn as the close. A sweep that exists only as a rule written somewhere is the failure this section is describing, committed one level up: the value is entirely in it running, and a policy nobody executes is indistinguishable from no policy.

**One batched pass, not a drip.** All stores reconciled against a single picture of what the completion changed. Editing them one at a time as each consequence occurs leaves two stores reconciled against different moments, and the difference between them is invisible afterwards.

### What it sweeps

Every local store, not only the one the work happened in:

- `.memory/` -- `running_context.md`, `todo_list.md`, and every topic note.
- `.profile/` -- where a completion changed what the operator's setup actually is.
- `.workgroup/<member>/` -- including `PRs/` and any todo list held there.

### The three motions

Only the first happens by itself, which is why the other two are named.

- **Update** what is still true but now says something outdated: a revision that moved, a count that changed, a status that advanced, a figure read before the thing it measured changed.
- **Clean** what has become misleading: a caveat that no longer applies, a "not built" beside something now built, a workaround for a problem since fixed, a risk that has been retired.
- **Delete** what the completion made pointless. A note whose entire purpose was to remember an unfinished thing has no purpose once it is finished, and leaving it makes true and false entries indistinguishable at a glance.

### Rules

- **Verify before retiring.** A record is closed against the source it describes -- the tracker, the forge, the working tree -- never against the belief that the work was finished. An item retired on an assumption is the same defect the sweep exists to prevent, committed by the thing meant to prevent it.
- **Say what was dropped and why**, in the store, when a reader might later go looking for it. A deletion nobody can account for reads as loss rather than as cleanup.
- **Do not let the sweep write new claims.** It reconciles existing records against what is now true; anything genuinely new belongs in a note of its own, authored deliberately.

### Why the trigger is the transition

Deferring it to the end of the run is what produces the stale file. By then the completions are recalled in the order they are memorable rather than the order they touched things, and the note nobody thinks of is exactly the one nothing else will correct.

The cost is paid on read rather than on write, which is what makes the interruption worth it. These folders are loaded at the start of the next session and treated as current, so a stale line is not clutter -- it is a false premise the next run reasons from before anyone thinks to check it against the repository. That is the same defect as [an inherited claim treated as an input](../foundations/Agentic_Engineering/04_VERIFICATION.md), arriving through your own notes instead of through a handoff.

## Per-ticket records live under `PRs/`

Work tied to a tracker item gets **its own file, addressed by the ticket**: `.workgroup/<member>/PRs/<TICKET>.md`.

The ticket identifier is the filename rather than the pull-request number, because the ticket is the stable identity -- one ticket may open several pull requests, a closed one may be reopened, and a ticket often exists before any PR does. Every PR is a row inside the file, each with the state it was last observed in.

**These sit at the workgroup level rather than under a member.** A ticket can span several members, and filing it under one forces a wrong choice the first time work touches two -- and hides it from whoever opens the other. The file names the members it touches; a member's own folder stays for facts about that component.

This is what makes `clean_up_hook` able to do its job. State buried inside one long running document cannot be retired by ticket, because nothing can find the boundary of what a given closure made obsolete. **A per-ticket file has an obvious end state: the ticket closes, the file is reconciled against the tracker and then removed.**

Each file holds what the next person needs before touching that work: the tracker and pull-request identifiers with the state each was last **observed** in and when, the branch or worktree, what actually changed, what review has said, and anything known to be wrong in the ticket's own write-up. Not a narrative of the work -- the diff and the tracker hold that.

## Artifacts

Anything longer than a note -- a proposal, a design, an investigation -- goes in a topic folder under the same rules, so nothing is lost and each piece stays promotable on its own:

1. **One item per file.** If it could become a spec by itself, it is its own file.
2. **Name it for what it is: `<kind>_<short_description>.md`.** The filename is the summary -- a listing of the folder should tell you what is in it without opening anything.
3. **When several items address the same subject**, number them in the order they should be read: `<kind>_<NN>_<short_description>.md`, `01` upward.
4. **Folder name plural where it holds many of one kind** (`proposals/`), singular-topic where it holds facets of one subject (`adws/`).
5. **First line is `# Title`**, followed by an italic line giving origin and status.
6. **No index file.** The folder listing is the index, which is why rule 2 is not optional -- an index maintained beside the files is one more thing that can drift from them.
7. **Record a cross-item constraint in every file it binds**, not in one of them. There is no index to carry it, and the person who opens the second file must not have to have read the first.

## Authority

Everything under `.memory/` is a **prior snapshot to verify against current sources**, never authority. A note that contradicts the repository loses.
