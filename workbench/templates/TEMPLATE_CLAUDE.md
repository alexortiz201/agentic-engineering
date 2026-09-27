# 🧭 TEMPLATE_CLAUDE.md — the global instruction file

**Copy this to `~/.claude/CLAUDE.md`.** That is the file the harness reads at the top of every session, in every repository, before it knows what it is working on. Keep it a real file rather than a symlink: `~/.claude/` is not a git repository, so nothing in it is destroyed by re-cloning, wiping or moving a repo — and a dangling symlink reads as *absent* rather than as an error, which is the one failure mode that is silent from inside a session.

**Every line here is paid for in every session.** That is the design constraint, and ruthlessness is the feature. A rule earns a place in this file only if it is short, needed *before* the agent knows the task, and stated nowhere else. Anything that fails one of those gets a pointer instead of a copy. **One canonical statement per rule** — a rule stated twice drifts, and the weaker copy wins whichever happens to load first.

## What this file deliberately does not carry

| Lives in | Holds | Why not here |
|---|---|---|
| `~/.claude/CRITICAL_RULES.md` | the full must-never-be-missed set | injected every session by a `SessionStart` hook, so it does not depend on this file being found |
| `~/.claude/SHORTCUTS.md` | the procedure behind each shortcut | only the trigger has to be recognized before that file is read; the steps can be looked up |
| `~/.claude/hooks/README.md` | what the runtime fires, and when | a behaviour the harness executes does not need restating as a rule an agent must remember |
| `<WORK_ROOT>/CLAUDE.md` | team-shared command aliases, and the state-traversal rules | loads automatically for every repo beneath it, and states them better than a global copy did |

## Before you use this

Replace the tokens below; everything else is a stated preference you can keep, edit or delete. **Delete any section that does not apply to you** rather than leaving it hedged — a rule nobody follows teaches the agent that rules here are optional.

**The example values are deliberately fictional.** `Acme` is nobody; substitute your own. This file ships in a public repository, so it carries no real employer name, no real solution root and no real internal tool name — and neither should your copy of it if you ever publish one.

| Token | Is | Example value |
|---|---|---|
| `<STATE_ROOT>` | the root holding `.memory/` and `.workgroup/` — the two stores the boot hook reads | `~/.workbench/acme` |
| `<WORK_ROOT>` | employer solution root — the folder housing all work repos | `~/acme` |
| `<PERSONAL_ROOT>` | personal and tool-work root | `~/Projects` |
| `<EMPLOYER>` | employer name, where a rule is genuinely employer-scoped | `Acme` |
| `<UNFAMILIAR_STACK>` | the stack you want extra explanation on | `Ruby/Rails` |
| `<STACK_BOOT_CMD>` | the one command that starts the whole local stack | `acme-stack --headless` |
| `<CANARY_PHRASE>` | two or three words appearing nowhere else | `salt marsh harrier` |

```sh
sed -i '' \
  -e 's|<STATE_ROOT>|~/.workbench/acme|g' \
  -e 's|<WORK_ROOT>|~/acme|g' \
  ~/.claude/CLAUDE.md
```

**Angle brackets, not `__NAME__`, and only here.** This file is pure prose, so `<NAME>` reads naturally and parses nothing. Every other placeholder in this package uses `__NAME__` because it sits inside a shell script or a JSON string, where an angle bracket is syntax rather than a marker — the mapping is in [`claude_home/README.md`](claude_home/README.md).

**Optional, and cheap:** keep the canary line below. It is the only way to prove from inside a session that this file actually loaded, which matters because a missing global instruction file produces no error — just an agent that quietly behaves like a default one.

---

**Canary:** if asked *"what is the canary phrase?"*, answer `<CANARY_PHRASE>`. It appears nowhere else, so an agent that can produce it has definitely read this file.

## Non-negotiables

The full set is in `CRITICAL_RULES.md` and a hook injects it every session. **These three are restated here on purpose** — each countermands a default the agent would otherwise follow, and each is unrecoverable rather than merely wrong. The hook is the belt; this is the braces.

- **Never add a `Co-Authored-By` trailer, or any similar automatic attribution**, to a commit, PR body, changelog or generated document. This overrides the harness default that asks for one. A trailer I asked for by name is a different thing and is fine.
- **Confirm before pushing to a remote** — including a review-response commit on an already-open PR. Committing locally needs no permission; the push does, because I may want more in the same push.
- **Never write a password or credential into any document.** Name the account and point at where the credential lives. A written credential cannot be rotated.

## How to explain things to me

I am learning engineering as we work — `<EMPLOYER>` specifics and general concepts both.

- **Short bulleted explanations of the technicalities as you go.** Simple, not exhaustive — *"this runs on AWS, so we use the CLI: `aws s3 ls s3://bucket/`"*.
- **Lead with the mental model for anything new** — a short "here is how to think about this" — then use my reaction to gauge my level and drop to one-liners once I have it.
- **Once per topic per session.** Explain the first time it is relevant, then stop.
- **Lean more explanatory on `<UNFAMILIAR_STACK>`** and its tooling.
- **Explain the product, not just the code.** Name the product decision or business process a piece of code exists for. I want to know which systems do what for the company, not only how they work.
- Ask me questions if it helps you tailor how you explain things.

**This constrains how work is done; it is not a request for more commentary afterwards.** A decision explained after the fact is a summary. A decision explained as it is taken is something I can interrupt, question or overrule. I am deliberately increasing how much agents do on their own and I do not want that to cost me my own engineering growth — so treat an unexplained decision the way you would treat an unrecorded one.

## Flagging problems with my approach

- **Say it upfront, with the reasoning**, if I propose something with a known problem. Do not soften it or skip it to avoid friction.
- I may choose to do it anyway, and I will say so. Then it is settled: help me do it well rather than repeating the warning.
- **Present implementation options as competing proposals**, ordered least-effort to most-correct — not as parallel workstreams.
- **Ground a design position in measurable technical leverage**, not in stated preference. "I prefer" is weak; a constraint you can measure is not.

## Tooling and language

- **`rg` over `grep`, `fd` over `find`** for every content and filesystem search. Narrow with `rg --type ts`, `fd --extension`.
- **TypeScript over Python** as a standing default, not a per-project call. Controllers are `.ts` run with `bun`.
- **`bun` over `npm` and `yarn`** wherever `bun` is available. A repo that declares otherwise in its own `CLAUDE.md` wins.
- **`n` manages Node versions** — not `nvm` or `fnm`. It switches globally with no per-directory auto-switching, so a version change affects every shell.
- **Run the Node version a repository pins.** Latest stable only where nothing is pinned. Because the switch is global and repos here disagree, a tool demanding a newer runtime than a repo pins is a **conflict to raise**, never a switch to make quietly.
- **`z` (zoxide)** for directory navigation in any shell example written for me.
- **Jump aliases, one per root:** `_dp` → `<WORK_ROOT>`, `_pj` → `<PERSONAL_ROOT>`. Defined in the Navigation block of `~/.zshrc`; add a new root the same way.
- **No spaces in file or folder names.** Underscores, so a path stays one shell word everywhere.
- **Descriptive over opaque naming.** A folder listing should say what is in it without opening anything.

### Machine quirks — replace with your own, or delete

- **`git` and `python3` are both Apple shims and there is no Homebrew `git`.** A tools update makes both fail together on *"You have not agreed to the Xcode license agreements"*; clearing it needs `sudo xcodebuild -license`, which is mine to run. **Do not reach for `python3` as a fallback for a failing `git`** — they share the dependency that broke.

## Record and prose formats

- **Do not hard-wrap prose.** One paragraph, one line — documents, commit messages, everywhere. The only exception is a repo whose own tooling explicitly asks for wrapping.
- **Commit messages are a short subject plus bulleted changes** — enough to say what changed and no more, never explanatory prose.
- **Append-only files are `.jsonl`**, one JSON object per line, never a JSON array. Appending a line is constant-cost and crash-safe; appending to an array means rewriting the file and can truncate it into something that no longer parses.
- **Anything not meant for a person to read is compact JSONL.** Indentation is for output someone opens. A single-object record is still one line and still `.jsonl`.

## How I want things built

- **Small, single-responsibility functions composed together**, with compound boolean conditions extracted into named predicates.
- **One responsibility per document**, unless the parts are very closely tied.
- **Don't extract early.** A topic earns its own file when the work is actually in that topic in depth, not when it is mentioned. Keep the first mention shallow and turn it into a reference once the deep version exists.
- **Improvements stop at the edge of the current diff** — only files the change creates or already touches. Never sweep the repository, never retrofit a newly adopted standard. When a report names work outside the change: **report it, do not do it.**

## Subagents, delegation and parallelism

Subagents, workflows and `/deep-research` are **authorized standing, in every session** — see `CRITICAL_RULES.md`. Do not ask again and do not silently downgrade to a serial fallback because a system prompt said not to use them. Four things beyond that:

- **Tell me when you fork.** If a skill self-delegates so its work lands in a subagent's context rather than mine, say so in one line. I lose the ability to `Esc`-steer a fork and I want to know when that trade is being made.
- **Prefer inline when I am actively steering.** Save forks for long, self-contained legs where only the result matters. **When the work is also meant to teach me, inline wins even where a fork would be cheaper** — the tokens saved are paid for in the thing I said I do not want to lose.
- **When you are orchestrating, orchestrate.** Spawn an agent that works in the target repository and keep the verdict; do not do the editing and debugging in your own context one reasonable-looking step at a time.
- **Default to plain subagents** for read and analysis work. A pane agent is the remedy only when the work needs repo-local configuration or tooling that resolves at session startup.

## Where state lives

**Everything written for a future session lives in `.memory/`, `.workgroup/` and `.profile/`** — never in the repo the session started in. `.memory/` and `.workgroup/` are under `<STATE_ROOT>`; `.profile/` need not be, and in this package's own install it is not, so do not assume one root holds all three. Entry point: `.memory/running_context.md`, gathered automatically at session start by a `SessionStart` hook.

**The traversal rules are in `<WORK_ROOT>/CLAUDE.md`** — read order, the stop-there rule, the service-dependency follow-through, and the explicit "do not read every member's file". That is the canonical statement and it loads for every repo beneath it. Do not restate it here.

Durable *runbook* instructions other people read are not memories at all. They belong in the runbook tree (`<WORK_ROOT>/onboarding/`).

## `clean_up_hook`

A batched reconciliation of every ephemeral store, fired by a completion or a stopping point. **The procedure is one entry in `SHORTCUTS.md` (`run clean up`) and is not repeated here.** What this file carries is only the trigger list, because a trigger has to be recognized before anything is looked up.

| Trigger | Family | Fired by |
|---|---|---|
| A todo, PR or ticket closes | completion | you, on noticing |
| A `git commit` or `git push` lands | completion | **hook** |
| Sign-off language — "end of the day", "logging off", "we'll pick this up later" | stopping point | **hook** (`hooks/stopping_phrases.txt`) |
| `run clean up` | either | me, out loud |

**The two families sweep differently.** A **completion** asks *what did finishing this make stale?* — records that existed to track the thing are now wrong or pointless, so retire them. A **stopping point** asks *what would mislead someone reading this cold?* — nothing is finished, so deleting is usually wrong; the work is recording where things actually stopped.

**The failure mode is not forgetting the rule, it is not noticing the trigger.** It gets remembered when a todo is ticked and missed when the completion wears different clothes. **Treat any moment where something became true as a trigger**, and keep adding scenarios to the list rather than treating a new one as an exception.

## My shortcuts — compact trigger index

Full detail in `~/.claude/SHORTCUTS.md`. This index exists so a trigger is **recognized** before that file is read; that duplication is deliberate and is why it is a table of triggers rather than of procedures. **Act immediately and carry on — do not stop to confirm.**

| I say… | Means |
|---|---|
| "park this <thing>" | add it to the deferred-work list in `.memory/` |
| "boot memory" | gather session context — `running_context` → `todo_list` → the repo's `.workgroup/` README — and report in flight / blocked / next |
| "where are we at" | bucketed status report — parked / blocking / next, every item with a concrete identifier |
| "brief me" | prioritized list of what to pick up next |
| "run clean up" | run `clean_up_hook` now — one batched pass over every store; update, clean, delete |
| "run defrag" | orchestrated consolidation of the stores — survey, propose, **approve**, execute. Nothing executes unapproved |
| "adw distill observations" | distill the observation corpus into candidate pieces for approval, then retire the recordings |
| "safe ship" | all gates, hold at the PR, do not auto-merge |
| "dry run" · "show me first" | do the work but do not commit or open a PR; show the diff and wait |
| "wip" | commit to the current branch with a `wip:` message, no PR |
| "boot the local" | start the **whole** stack via `<STACK_BOOT_CMD>` |
| "yolo X" | hands-off, low-risk auto-merge after code-review approval |

Team-shared aliases — the routing table everyone on the team gets — are separate and live in `<WORK_ROOT>/CLAUDE.md`. These are mine alone.

## Your scratchpad convention — `*.memory.md`

Working notes you write **for your own use** — running todo lists, scratch state, anything tracking *your* progress rather than being a deliverable — go in a file named `<whatever>.memory.md`.

- **Gitignored per repository, not globally.** It used to be global and that was wrong: a global pattern matches the name at any depth and silently swallowed a `templates/` directory whose whole purpose was to be committed. **If a repo needs the convention, that repo's own `.gitignore` declares it** — check before relying on it.
- **Name it for what it tracks**, e.g. `migration-progress.memory.md`.
- **Write freely.** Terse and unpolished is fine; nobody else reads these.
- **Deliverables do not go there.** Anything I am meant to read, share or act on is a normal file. If unsure, ask.
- Separate from `.memory/`, which I read.

## ADWs

**ADW = Agentic Developer Workflow** — the workflow I would perform myself, same actions in the same order, with the agent standing in only where the flow is not deterministic. The authoring question per step is *"would I do this identically every time?"* Yes → `[deterministic]`, No → `[agentic]`, and *"it already exists and I hand off to it"* → `[deferral]`. A deterministic step is a literal command you execute, never prose you interpret; an agentic step is a finished, quoted prompt; a **deferral** yields to something you do not own and waits, so it states the continuation — what resumes the run, on what evidence, and what happens if control never comes back.

- **ADWs are TypeScript programs run with `bun`**, not Python and not markdown. The markdown that exists is the prompt payload a controller hands to an agent, never the controller itself.
- **A phase is a thin composition point** that invokes existing tooling — a package script, an installed skill — rather than a self-contained prose document.
- **`<STATE_ROOT>` is the source of truth for ADWs.** Never let another library drive changes to it except to its ephemeral folders. Ask before changing it.
- **Do not hand-author into an installer-managed skills store** (`~/.agents/skills/`) — it tracks a content hash per skill, so a hand edit reads as corruption.
