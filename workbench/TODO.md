# 📋 TODO — work on this package

**Open work on the workbench tool itself.** Distinct from the operator's `.memory/todo_list.md`, which tracks *tickets and projects*; this tracks **changes to this package**. An item here is something that would alter what the tool is or what it can do.

**Opened 2026-09-17**, from a reading of `tac8_app1__agent_layer_primitives` — a tutorial repository whose README describes a **target** architecture rather than its own state. Items marked *(tac8)* come from comparing this package against that target.

## 🔴 Defects — things that are wrong today

- **`record.ts` hard-derives its repository root, so runs write their history into the wrong repository.** `REPO` is `import.meta.dir/../..`, which means run directories, `adw_data/history.jsonl` and `config/observed.json` all land beside the *workflow*, not beside the *subject*. **A run about `sunspear` writes its history into the onboarding repo.** The fix is a workspace parameter rather than a derived constant. **It is the thing blocking ADW placement**: a workflow cannot move to the workbench home while its record layer assumes it sits inside the repository it operates on. Touches `adw_assess` and `adw_route`, so it is a shared-layer change, not a per-workflow one.
- *(tac8)* **No `--working-dir` on any workflow.** The target architecture makes it first class — *"always specify `--working-dir` when operating on different projects"* — because **the agentic layer wraps an application layer and therefore has to be told which application.** Same root cause as the item above.

## 🧱 Missing components — the gap against the target architecture

*(tac8)* The target names a **Minimum Viable** and a **Scaled** agentic layer. This package's discipline is complete; the scaffolding is at the minimum-viable tier.

| Component | State | Note |
|---|---|---|
| `adw_modules/` | ✅ `actions`, `harness`, `profile`, `record`, `guidance` | the shared layer exists |
| `worktree_ops` | ❌ | **isolation is a property of every scaled workflow**, carried as an `_iso` suffix — not a feature of some |
| classifier | ❌ | see below |
| `adw_triggers/` | ❌ | hooks exist at the *harness* level; nothing triggers an ADW |
| `adw_tests/` | ❌ | nothing validates agent behaviour |
| per-run metrics | ❌ | target has `workflow_metrics.json` beside `adw_state.json` |
| `trees/` | declared, never used | named in the ADW README as "if isolation is ever needed" |
| `_iso` variants | ❌ | the target's entire scaled tier is isolated by construction |

## 🏭 The largest gap: blueprints without a scaffolder

**`primitives/` specifies exactly what a phase, module, gate, trigger, record and observation must contain — and nothing emits one.** Every file is hand-written against a blueprint and checked by a human reading both.

**That is the difference between having a standard and having a factory.** The tool should be able to generate a conformant skeleton *from* its own blueprint, so building an agentic layer is generation against a spec rather than transcription of one. It would also make the six-case proof at the consuming interface a generated default rather than a thing each author remembers.

## 🔀 Classification and routing

**The answer is already in `06_ADW_COMPOSITION.md` and should be promoted, not invented:** *"Classification needs an agent only when meaning is ambiguous; validate its output against an allowed set."* The allowed set is the switch's cases.

What is missing is the **component**: a classifier that reads a subject, names its class, and routes to the workflow for that class — possibly a different flow entirely, not merely a different phase implementation. *(tac8)* names it directly in the scaled output tree as `issue_classifier/`, sitting **before** the planner.

**The `higher order prompt` is how its cases get written.** Each recorded election — candidates, choice, discriminator — is a case body accumulated from real work. **Do not author the switch before the observations exist**; that is extracting an abstraction from zero occurrences.

## 🪶 Clean up and slim down everything that is not `foundations/`

**Operator instruction, 2026-09-17:** *"foundations is great for deep dive explanation, but everything else in the tool should probably be slim and modular."* That assigns the two halves of the documentation split to concrete places: **`foundations/` is the deep, human-facing half**, and `handbook/`, `primitives/`, `templates/`, `harnesses/`, `config/` and `defaults/` are the slim, agent-facing half.

**Do it one item at a time, not as a sweep.** Each pass takes one file, reduces it to what changes behaviour, moves the argument into `foundations/` if it is worth keeping, and leaves a citation behind. A single large reflow would be unreviewable and would silently rewrite claims while appearing to only reformat.

**Both words are load-bearing.** *Slim* means the file carries only what a reader acts on. *Modular* means it is one responsibility, loadable on its own, so a decision pulls one piece rather than a document covering several topics. A short file mixing three subjects satisfies the first and fails the second.

**The test per sentence:** would an agent about to perform this action behave differently for having read it? If not, it is prose, and prose belongs in `foundations/`.

**Candidates, largest first** -- to be confirmed by measurement when the work is picked up, not assumed from this list.

### Part of the slimming is diagrams instead of words

**Where a document describes a flow, a sequence or a set of layers, a diagram replaces more words than any edit can.** Several things written here as prose or tables are really pictures: the seven-layer stack a running workflow forms, the task-state machine and its `return_to` routing, the trigger's select-claim-dispatch loop with its failure paths, the three step kinds and what each returns, and the four-layer bench arrangement in `defaults/`.

**Constraints on doing it:** the diagram has to be **text-source** so it diffs and cannot go stale silently against a binary; it replaces the prose rather than sitting beside it, or the slimming is not achieved and a second statement is created to drift; and anything a consumer validates stays written as a canonical value in `LANGUAGE.md`, because a picture is not a schema.

## ✂️ Split agent-facing documentation from human-facing documentation

**Proposed by the operator 2026-09-17.** The two are different artifacts read at different moments, and the package currently mixes them everywhere except `primitives/`.

**The distinction is *when* the document is read.** A human-facing document is read **once, linearly, to build a model** — it argues and justifies, and its length is spent earning agreement. An agent-facing document is loaded **at a decision point, repeatedly, to determine an action** — it needs the constraint, the discriminator and the allowed values, and every word of justification in it is paid for again on every load while changing nothing about the output.

**`primitives/README.md` already states this split for its own directory** — *"requirements, not tutorials — the reasoning lives in the rest of `foundations/`"*, and *"if a blueprint needs a paragraph to justify a line, the justification belongs elsewhere."* It arrived by instinct for one directory. The work is making it a design principle across the package so the agent-facing layer is a first-class thing rather than a property of how blueprints happened to be written.

**The hazard that governs the design: duplicating a rule into both halves guarantees drift**, and a reader cannot tell which copy is authoritative. So **the constraint is canonical in exactly one place — the agent-facing one, because it is what gets enforced — and the prose cites it rather than restating it.** The reasoning is never deleted; it stays *addressable*, because an agent facing an ambiguous or conflicting requirement needs to reach the argument that settles it.

**A test for which half a sentence belongs in:** would an agent about to perform this action behave differently for having read it? If yes it is a constraint. If it only makes the constraint feel justified, it is prose.

**Candidate forms for the agent-facing half**, none of which is "a shorter version of the prose": decision tables keyed on the situation, allowed-value enums the code can actually validate against, trigger-indexed entries (*when you are about to do X, this applies*), and machine-readable contracts rather than prose a model must interpret. **A summary is the wrong answer** — it inherits the prose's shape and loses the constraint's precision.

**Three cost profiles to design against, since this is measurable rather than a matter of taste:** injected at every session start, loaded per decision, and read once per category. `LANGUAGE.md` and the critical rules are the first kind; `primitives/` is the second; `foundations/` is the third. They should not share a format.

## ✅ Naming and the join key — DOCUMENTED 2026-09-17

Written into [`handbook/05_AGENTIC_LAYER_LAYOUT.md`](handbook/05_AGENTIC_LAYER_LAYOUT.md): **the run id is the join key and the filesystem is the index** (spec filename, `runs/<run_id>/`, `trees/<run_id>/` — the repetition is the mechanism); **a spec carries its id twice**, in the name and in its metadata, so the link survives a rename; **properties stack onto a composition's name as suffixes** (`_iso`, `_zte`) so the name carries how as well as what; and **the naming rule for an artifact belongs inside the command that produces it**, not in a conventions document. Also in [`handbook/02_RUN_ARTIFACTS.md`](handbook/02_RUN_ARTIFACTS.md): subdivide run artifacts by producing agent once there is more than one, and keep the raw stream alongside the parsed form, because only the raw stream distinguishes a bad response from a bad parser.

**Still open from that reading:** the package uses the run id consistently but **has never stated whether the canonical key is the run or the subject** — both are defensible and the choice has to be the same in every tree or the join silently stops working. `record.ts` keys on the run; Dealpath's specs key on the ticket.

**Nothing was stolen for `primitives/spec.md` — it is already ahead of the source.** It requires Metadata carrying the run identifier *and the originating request verbatim*, and **"Validation commands — literal commands, each annotated with what passing proves"**, plus *"the last step always validates."* The tutorial's spec has a Validation Commands heading and no such requirements on it.

## 📖 The worked example is now satisfiable, and was not before

**`.memory/proposals/proposal_worked_example.md` has been open since 2026-09-12** on the grounds that *"the package is strong on contracts and deliberately light on instances — there is no place to see one real task travel through one composition with its actual artifacts."* Nothing had travelled the full distance, so it could not be written.

**2026-09-17 produced the instance.** One defect went discovery → measurement with a proof shown to fail → fix → red-then-green spec → gates → approval → a PR held at review, and the run itself produced a workflow. Every artifact the proposal asks for exists.

**The constraint the proposal puts on itself must hold:** *"a worked example drawn from one company's tooling is how project specifics leak into a package that is meant to be portable."* So it is **de-identified** — no team ids, view ids, customer-shaped row counts or hostnames — and it lives **outside `foundations/`**, which is standalone by rule.

**The tension to settle first.** `templates/` earns each entry by *"writing both twice"*; one instance does not earn a template. **But a worked example is not a template — it is an instance, and the complaint is that there are zero.** One is strictly better than none in a way that one occurrence of a *pattern* is not. **The alternative is to wait for `T4-80`**, so the example can show which parts vary rather than implying the first run's shape is the shape.

## 📐 Contract deviations to resolve

- **`composition.md` says phases are separate processes; `adw_ticket.ts` implements seven phases as functions in one file.** What the rule protects was recovered — `--only`/`--from` make each phase independently runnable, and each re-loads its inputs from disk — but one run still shares one address space. **Decide whether the rule means what it says**, and either split the file or soften the blueprint with the reason.
- **`changed_files` and `attempt_kind` are in the phase result contract and are not emitted** by `adw_ticket`. Nothing there retries and no phase mutates the workspace, so both would be constants. Either the contract admits "not applicable" or the fields are wrong for read-only phases.

## 📚 Documentation

- ✅ **Done 2026-09-17:** `higher order prompt` defined in `LANGUAGE.md`; the `primitive` row completed from 12 entries to the 14 that `primitives/` actually contains (`run history` and `observation` were missing). Extended in `1bc95e2`: a clause separating it from a `command` parameterized over another command's output (the discriminator is where the uncertainty sits), the **admission rule** for candidate terms drawn from outside material, the `primitive` row pointing at the blueprints and the artifact map, and `command.md` / `composition.md` now citing each other -- the run id and the declared report are the only things crossing a phase boundary.
- **`README.md` still contradicts the package on two counts** — it claims one bundled executable where `tools/observe/observe.ts` is a second, and says four areas where the file it routes to says five. Seven files appear in no routing row.
- **`README.md:54` points at `.memory/package_cleanup.md`, which was deleted** when it merged into `package_status.md`. **A cold session's first instruction is a dangling reference.** One-line fix, but it edits a committed claim.
- **`AGENTS.md` restates six of seven commit rules and drops "never append authorship"** — which is precisely the rule a harness default works against.
- ~~`handbook/08` forks the canonical enums~~ — **confirmed and enlarged by the 2026-09-17 audit; see §A and §D below.** It forks *two* canonical enums, and reports a census in two vocabularies at once.
- ~~The observation contract disagrees across three files~~ — **worse than recorded: four ways, plus a missing axis and a precedence line that is actively wrong. See §B below.**

## Method note, worth keeping

**`rg -r` is `--replace`.** A short-flag cluster like `-rln` silently becomes *"replace every match with `ln`"*, and the output then reads as though the files are corrupted. This produced a confident, entirely false finding that the tool's own documentation had been mangled by a bad find-and-replace. **A positive result can be an artifact of the instrument just as an empty one can** — the fix is the same, exercise the instrument against a case whose answer you already know.

---

# 🔍 Documentation audit, 2026-09-17 — findings, not fixes

**A full pass over 107 `.md` files plus the hook scripts and JSON that determine injection**, against the human-facing / agent-facing principle above. **Nothing was edited.** Ordered by leverage; items 1-4 are producing wrong answers today, item 5 is not.

## What is actually injected — established empirically

| Mechanism | Injects |
|---|---|
| `SessionStart` hook (`settings.safe.json:18-28` → `guard_claude_md.sh:29-33`) | `config/claude/CRITICAL_RULES.md` — 14 lines, unconditionally |
| `SessionStart` hook (`:30-38` → `boot_memory.sh`) | **~60 lines of behavioural instruction that live inside a `.sh`**, in no `.md` |
| Harness auto-load | `CLAUDE.md` — 7 lines |
| **Instruction, not mechanism** (`CLAUDE.md:3` → `README.md:9-17`) | `AGENTS.md`, `LANGUAGE.md`, `foundations/README.md`, `Software_Engineering/01`, `01_PRINCIPLES.md` — **plus `README.md` itself to find the list** |

**Two findings fall straight out.** The *mechanically* injected surface is 21 lines of `.md` and is disciplined. The *instruction*-injected surface is **~646 lines read at the top of every session**, none of it written to that cost profile — and `README.md:11` calls it "Five files" when it is six, counting the README that names them. **The single largest injected document in the bench is not a documentation file at all**: `boot_memory.sh` emits ~60 lines every session, no structural check reads it (`handbook/03` globs only `.md`/`.json`), and it re-tells the state-root story that five `.md` files already carry.

## 🔴 A — Enforcement vocabulary is FORKED, and has produced a defective artifact

| Location | States |
|---|---|
| `LANGUAGE.md:58-68` | **3 values, hyphenated** — `code-enforced` / `human-approved` / `agent-checked`, under "Controls" |
| `handbook/08_GATE_ENFORCEMENT_CENSUS.md:17-26` | **5 values, underscored** — adds `harness_enforced`, `documented`, `absent` |
| `primitives/gate.md:9` | a third, unspelled paraphrase |
| `handbook/08:58` | **mixes both** — `27 agent_checked, 7 code_enforced, 2 human_approved`, two census tokens and one control token in one count |

`LANGUAGE.md:5` names this exact failure: *"Two documents that disagree about an enum produce a toolkit whose templates emit records its own policy rejects."* **Both sides are right** — three control values and five enforcement values are genuinely different axes, collapsed by accident. **Fix:** add the five-value set to `LANGUAGE.md` as its own named axis, reduce `handbook/08` to a citation, correct the mixed count.

## 🔴 B — The observation contract is forked FOUR ways, and its precedence line is actively harmful

| Location | Kinds |
|---|---|
| `primitives/observation.md:24-30` | **5** — `gap` and `meta_change` are prose, not listed kinds |
| `templates/record/observation_line.md:19-27` | **7**, `schema_version: 1` |
| `tools/observe/observe.ts:19` | **8** — adds `instrument_fault`, `SCHEMA_VERSION` 2 |
| `handbook/10:43-46` | **4** — silently drops `handoff`, and it is the file read when *reading a recording back* |

**Plus:** the gap `status` axis (5 values) exists in the tool and **nowhere in the blueprint**, which still describes `disposition` as carrying both — the exact collapse the tool documents itself as having fixed.

**🔴 And `tools/observe/README.md:5` says *"Where the two disagree, the primitive is right and this is behind."* It is backwards.** The tool is **ahead** on three contracts. **A reader following the stated precedence would revert three fixes.** Verified 2026-09-17. **One line, and it is the only finding that causes damage if obeyed today — fix it first.**

## 🔴 C — Execution status has five copies and no canonical home

`completed` / `failed` / `blocked` / `cancelled` at `08_GATES.md:12`, `primitives/phase.md:26`, `06_ADW_COMPOSITION.md:218`, `templates/workflow/phase.md:60`, `templates/record/phase_result.md:10`. **All five agree today** — zero drift, maximum future exposure. Absent from `LANGUAGE.md` entirely. `08_GATES.md:16` warns that `blocked` means different things on different axes, while `blocked` sits in this axis undefined. **~6 lines of insurance, and only cheap before the drift.**

## 🔴 D — Provenance forked, in the same file as §A

`LANGUAGE.md:165` = 4 values; `handbook/08:41` = **5**, adding `nothing`. `handbook/08` is the one file that has forked two separate canonical enums.

## 🔴 E — `CRITICAL_RULES` ↔ `TEMPLATE_CLAUDE` diverge, and the INJECTED copy is the weaker one

Verified 2026-09-17:

- **Attribution:** `CRITICAL_RULES.md:5` forbids `Generated-with`, signature lines and machine-authored emoji. `TEMPLATE_CLAUDE.md:51` drops those specifics and **adds an exception the injected copy does not have** — *"A trailer I asked for by name is a different thing and is fine."*
- **Push, edge-of-diff:** each copy carries a clause the other lacks.
- **The two files state opposite duplication policies about the same three rules** — `CRITICAL_RULES.md:3` says *"one canonical statement per rule"*; `TEMPLATE_CLAUDE.md:49` says *"these three are restated here on purpose."*
- **`OPERATOR.md`, the file the injected copy defends its canonicity against, does not exist** — confirmed by `fd` and an unnarrowed `rg`. INFERRED: it is the pre-rename name of `TEMPLATE_CLAUDE.md`.

## F — Agreeing today, but the standing drift surface

Gate decision + the empty-diff rule: **8 copies**, all agreeing. Check status / `applicable`: 6 copies, agreeing except `05_RECOVERY_AND_HANDOFF.md:143`, which writes **`inapplicable`** — a token used nowhere else, in the one file that says inapplicability is never a status. State-root story: 7 copies, three of which re-tell the whole argument.

## G — Working correctly, and the pattern to copy

| Constraint | Canonical | Cited, not copied, by |
|---|---|---|
| Evidence ranks | `LANGUAGE.md:154-165` | `01_PRINCIPLES.md:85` — *"Six ranks, defined once in the canonical vocabulary"* |
| Control labels | `LANGUAGE.md:58-68` | `01_PRINCIPLES.md:91` |
| The six cases | `primitives/README.md:26-35` | `tools/observe/README.md:66` |
| The four layers | `defaults/README.md:20-27` | `config/README.md:22`, `templates/README.md:19` |

## H — Constraints reachable only through prose

Binding rules nothing enforceable can cite: the **claim-testing enum** `confirmed`/`refuted`/`partial` (`04_VERIFICATION.md:50`, called "the contract"); **`total_budget` default = 2** and cap-exhaustion sets `blocked` (`05_RECOVERY:22-27`); **seven handoff-validation requirements** (`08_GATES.md:80-86`, of which `primitives/gate.md` carries a four-line abstract); **"allocate exit codes once across the whole tool set and write it down where the tools are indexed"** (`08_GATES.md:64` — a requirement on `tools/README.md`, which has no such table); **"assume `agent-checked` unless a deterministic mechanism has been tested"** (`README.md:141`); **commit type semantics** (`Software_Engineering/05:18-32`, while `AGENTS.md:52` carries only the tokens).

## I — Prose inside files that are paid for every session

| File | Argument, not instruction |
|---|---|
| `CLAUDE.md` | ~0% — exemplary |
| `config/claude/CRITICAL_RULES.md` | ~9% |
| `AGENTS.md` | ~18% |
| `LANGUAGE.md` | **~30%** (≈60 of 197) — including five lines arguing why `deferral` is a third kind |
| `README.md` | **~40%** (≈60 of 153) — `:104-124` is a 20-line essay on a private directory's backup status |
| `TEMPLATE_CLAUDE.md` | **~26%** — `:1-45` is installer instruction, and **nothing tells the adopter to strip it**, in the file whose `:5` says *"every line here is paid for in every session… ruthlessness is the feature"* |

**`LANGUAGE.md` + `README.md` contribute ~120 lines of pure argument to every session start.**

## The handbook's systematic mismatch

`handbook/README.md:3-5` declares the charter *"when a task arrives… start here"* — per decision. **Nine of its fourteen files are authored as per-category essays**, including `06_ADW_COMPOSITION.md` at **322 lines behind a decision-point router row**. Correctly deferred: each is a large rewrite of a file other projects read, and **none is currently producing a wrong answer.**

## Order of work when this is picked up

1. **`tools/observe/README.md:5`** — one line, wrong today, misdirects a reader into reverting three fixes.
2. **§A**, the enforcement enum — the smallest complete demonstration of the whole principle, with a live defective artifact as the before-state.
3. **§B**, reconcile the observation contract across its four files.
4. **§C**, give execution status a home — cheap only while it still agrees.
5. **§E**, decide which attribution copy is canonical.
6. Structural mismatches last.

## Named gaps in the audit itself

- **The real `~/.claude/settings.json` was not readable** — `settings.safe.json:2` says it is deliberately incomplete and `config/EXCLUDED.md` lists `autoMode` as excluded. **There may be injection points this audit cannot see**; the findings are complete only against the published subset.
- **Whether the boot-set files are actually read each session is unobservable from the package** — the mechanism is instruction, not a hook. That is the `agent-checked` versus `code-enforced` distinction the package itself draws, applied to its own boot sequence.
- Cost profile could not be determined for `TODO.md`, the vendored `aidd-typescript` skill, and the `templates/layout/` seeds — nothing declares when any of them is read.
