# 🧩 Compose Agentic Developer Workflows

An **ADW (Agentic Developer Workflow)** is executable orchestration combining deterministic code, bounded agent judgment, and deferrals to workflows it does not own, to deliver a defined outcome. A prompt is an instruction; a phase is a contracted unit of work; an ADW can contain one or several phases; a composition reuses contracted phase entry points. Calling an owned ADW as a typed child workflow is a separate, not-yet-established contract; calling an external workflow is a deferral. A skill makes the workflow discoverable and operable--it is not the controller.

Select primitives by kind, and name them consistently within a workflow. These are portable design conventions, not installed commands or claims that every workflow needs every component.

This file is the shape of a composition and the order in which one is authored. The gate namespace every composition draws from, and what a gate must validate before it may decide `pass`, are in [gates](08_GATES.md). What a composition must survive before anything runs it unattended is in [control-plane tests](09_CONTROL_PLANE_TESTS.md).

## Authoring process

1. **Define the outcome before the technology.** Preserve the original request; specify trigger, input, target, criteria, non-goals, acceptance owner, and side effects. Decide whether one focused prompt is sufficient.
2. **Inspect existing primitives.** Locate relevant instructions, prompt/command templates, scripts, tools, types, checks, state and workspace helpers. Trace implementations, not just descriptions. Reuse before scaffolding.
3. **Draw the sequence and failure routes.** Label every node human judgment, agent judgment, deterministic code, or a deferral to something the workflow does not own. Known commands, IDs, counters, routing enums, and receipts belong in code. Classification needs an agent only when meaning is ambiguous; validate its output against an allowed set.
4. **Salvage before contracting.** Before contracting the chosen design, enumerate the **mechanisms** in every rejected design and classify each one **promote / defer / drop**, with a reason. Record the classification in the design artifact; "nothing to salvage" is a claim that requires justification, not a default.
5. **Contract each phase.** Define required predecessor artifacts, actor and, for an agentic step, its [semantic role](14_SEMANTIC_AGENT_ROLES.md); specify Core Four requirements, cwd, allowed mutations, output schema, limits, checks, and next transitions. Concrete provider/model and reasoning effort come from operator routing policy or a recorded nonportable exact override, not from a portable role. Build uses the approved plan; review uses the original criteria AND actual diff/evidence.
6. **Design gates before prompts.** Define the expected check set and real commands/cwd/timeouts. Assign each gate an ID from the `G0`-`G7` namespace in [gates](08_GATES.md). Specify success, failure, missing-output and interruption cases. Make independent code check artifacts and claims before advancing; agent confidence cannot approve its own transition.
7. **Persist the design.** Record it in a durable design document rather than leaving it in a conversation. Obtain approval for the scoped implementation and side effects. Scaffolding, dependency installation, hooks, tracker updates, and worktree creation are mutations--even if a phase is called "plan."
8. **Build the smallest vertical slice.** Implement typed contracts, the agent adapter, one useful phase, real quality checks and state/evidence storage. Use focused, bounded prompts, and author any missing primitive deliberately rather than inlining it. Do not generate an entire platform for a one-off task.
9. **Compose thinly.** Reuse phase entry points; keep sequencing separate from prompts and model selection. Pass one run identity, explicit workspace and validated artifact references. Do not duplicate phase internals inside a composite script.
10. **Walk through and test.** First use mocked agents/tools and disposable workspaces; then a human-supervised real task within authority. Exercise the [control-plane matrix](09_CONTROL_PLANE_TESTS.md). Document exact invocation, prerequisites, artifacts, safe resume and cancellation before unattended use.
11. **Record the wrong turns, not only the outcomes.** An agent replaying a workflow repeats whatever mistakes are not written down, because nothing in the artifact warns it off. A workflow that carries its own history of failures -- what was tried, what it cost, why it was abandoned -- is the highest-value part of the document, and the part that is always omitted first because it reads as an admission rather than as a control.
12. **Make it discoverable and improve deliberately.** Add an entry recipe/skill and conditional context links. Record effective config, measured cost/time/interventions and outcomes. Extract only what a second real use has already proven; see the area README on reuse being earned.

### Salvage before contracting

Selecting a design answers one question -- which scope ships now. It does not answer a second -- which mechanisms are correct. Those judgments are independent, and rejecting a design silently decides the second by discarding the first.

For each rejected design, list its mechanisms and classify:

| Classification | Meaning | Required with it |
|---|---|---|
| `promote` | Move the mechanism into the chosen design now | A concrete failing scenario it prevents |
| `defer` | Correct but out of scope for this delivery | The condition under which it becomes required |
| `drop` | Wrong, unnecessary, or superseded | Why the chosen design does not need it |

Rules a conformant salvage pass can be checked against:

- **A mechanism that replaces an inferred signal with an explicit one is `promote` by default; `defer` or `drop` requires a stated reason.** Inference is sound in the happy case and wrong in exactly the error case nobody exercised. A busy flag going false infers success; it also goes false on failure. A token advanced only on real success cannot.
- **`drop` may not be justified by the rejected design's scope.** "That lane was too large" is a statement about the lane, not about the mechanism. If the only reason is scope, the classification is `defer`.
- **Read the rejected design's self-criticism section before discarding it.** The losing lane routinely names the real weakness of the winner, and that paragraph is the highest-value output of running divergent designs at all. Discarding it wastes the cost already paid for the divergence.
- A `promote` with no failing scenario is not a salvage decision; it is scope creep, and is rejected on the same terms.

## Single-phase contract

| Boundary | Minimum requirement |
|---|---|
| Input | Schema version, task/run/phase/attempt IDs, original intent, approved scope, engagement mode, operating level with any `descent_reason` / `return_condition`, predecessor manifest |
| Invocation | One purpose; semantic role and contract version; explicit cwd, bounded context, prompt version, tool/authority requirements and numeric limits; resolved provider/model/effort recorded in the typed request before launch, or permitted fallback provenance recorded explicitly |
| Execution | Controlled adapter; argv rather than interpolated shell strings; explicit timeout/cancellation; approved environment only |
| Output | Typed result envelope, concise summary, owned artifacts, changed paths, unresolved findings and proposed next action |
| Gate | Independent schema/domain/artifact/check validation tied to current revision, diff base, non-zero changed-file count and diff identity |
| Failure | Preserve result, partial effects and per-kind attempt accounting; set `return_to`; route to correction, repair, human decision, or blocked handoff |

A phase-result record and a gate-decision record are illustrative shapes, not schemas or validators. Implement consumer-tested types before machine use; reject placeholder records. Keep diagnostics off machine-consumed stdout; never parse the last plausible-looking path out of arbitrary prose. The four status-like vocabularies these records write are deliberately disjoint; [gates](08_GATES.md) holds them, alongside the validation a gate performs on the records that carry them.

### Bind a decided value once, and carry it

Some of a run's values are **decisions** rather than observations -- which base a change targets, which branch it is built on, which workspace is authoritative. A decision is made at one step, and every later step that re-derives it instead of reading it is silently answering a different question, because the environment moved in between. That is how a change ends up proposed against a base it was never cut from, and nothing errors: both derivations are locally correct.

So bind each such value once, at the step that decides it, record it in the run's state, and have every later step read it from there. **A value re-derived downstream is a second decision wearing the first one's name.**

The same rule at the boundary with anything the workflow calls: **pass every parameter the thing defaults**, and most of all its working directory and which runner or sub-command it invokes. A default resolved from the ambient environment is a value nobody set, it is invisible in the invocation, and it changes when the environment does -- so the failure it produces is both silent and intermittent. A variable read from the ambient environment and a variable never bound at all are indistinguishable at the call site, and the second is the more common of the two.

## Start minimal, grow on evidence

A first agentic layer is **three things**:

- **plans** -- the detail a task needs, written down
- **prompts** -- named, reusable, with a declared output
- **workflows** -- code that runs them in order

That is enough to do real work. When the workflow itself needs a reusable execution boundary, its minimum kernel is four existing responsibilities:

1. a **composition** owns run identity, declared phase order, and per-phase failure policy;
2. a **phase** owns one bounded unit of deterministic, agentic, or deferred work;
3. validated **state, records, and run history** provide the only phase-to-phase handoff and durable evidence;
4. an independent **gate** permits or blocks each material transition.

These are responsibilities, not a mandate for four files or a new workflow language. A command is an agent prompt/report contract, a module is shared code, and a semantic role is an invocation-requirements contract; none is another control-flow node. Validation is performed by checks and interpreted by a gate rather than promoted to a fourth step kind. Linear order, typed conditionals, and bounded failure routing remain ordinary composition code. Add a branch DSL, workflow AST, recursion, generic DAG engine, scheduler, or child-workflow primitive only after a real consumer demonstrates the missing boundary.

Everything else is added when something forces it:

| Add | When |
|---|---|
| Types | an output crosses a boundary and is parsed |
| State | a run has more than one phase, or must survive interruption |
| Isolation | two runs could touch the same files, ports or branch |
| Hooks | an event needs observing or guarding |
| Triggers | work should start without a person |
| Tests | a transition has broken once |
| Durable storage | a fact must outlive a single run |

**Read that table as a growth path, not a checklist.** Each row names the evidence that justifies the addition; adding a row without its evidence is building a platform before there is a project.

## How material becomes a workflow

A workflow is rarely authored from a blank page. It is usually a process that was already performed by hand and is being written down afterwards, and the path from the one to the other has three stages worth naming, because each fails differently.

**Capture.** An [observation recording](primitives/observation.md) opened before the work starts and closed with a reason, holding what was actually done in the order it happened -- including the wrong turns, which are the part that decays fastest and the part [step 11](#authoring-process) above says is worth the most.

**This used to be a note written afterwards, and the recording is strictly better evidence.** A note is made *about* the work; a recording is made *during* it. The difference is not thoroughness, it is availability: what the recording holds -- the order, the dead ends, the pauses, what was in front of a decision when it was taken, and what could not be seen at all -- stops existing the moment the work ends, so **a note cannot be made more complete by trying harder, only by having been a recording**. What a note reconstructs afterwards is a clean path that nobody walked. How to run one is [`handbook/10_OBSERVING_A_PROCESS.md`](../../handbook/10_OBSERVING_A_PROCESS.md).

A [scratchpad](../../LANGUAGE.md) remains the home for material that has been captured and not yet earned a place, and being provisional is its defining property rather than a defect in it. It is no longer where the capture *happens*.

**Decompose.** Identify the pieces the recording actually contains -- this one a tool, that one a context asset, that one a prompt -- and move each to where it belongs. Anything not yet placed goes to a scratchpad and stays visible as unfinished. The work here is *dissolving* the capture, not polishing it: a capture that survives decomposition intact was not decomposed, it was filed.

**Compose.** A workflow references those pieces in order, so each improves once and every caller inherits the improvement.

**Nothing in a scratchpad may be referenced by a workflow -- extract the piece first.** A rough note that acquires a caller becomes a dependency while still carrying the notice that it is provisional, and that notice is exactly what stops anyone from repairing it. The reference is what quietly converts "unfinished, and known to be" into "load-bearing, and still labelled unfinished".

## Fragment in response to an observed boundary, never in anticipation of one

Reuse being earned is stated in the area README as a rule about extraction. It has a sharper form that applies to **splitting** as well as to lifting, and the sharper form is the one that gets violated, because splitting a long document feels like hygiene rather than like a design decision.

Do not divide a workflow into files, or lift a prompt into its own asset, until the workflow has been executed and something has actually crossed the boundary being proposed. A seam introduced before the first run encodes a guess about where the joints are, and a wrong guess there is not merely untidy -- **a seam hides whatever spans it**, because the two sides are never read adjacently again.

**A worked case, and the defects are the argument.** A workflow covering one ticket type end to end was authored as four files -- a sequencer plus three phase documents -- before it had ever been run once. Nothing had crossed those seams, and merging the four back into a single document that reads top to bottom exposed four defects on the first adjacent read: a pull request created from a body file that a *later* phase wrote, so the ordering was impossible; six variables used but never bound anywhere; a failing test written into a checkout that the isolated workspace never sees; and an escalation declared in a header that no step performed. Each one is obvious when the two sides sit on the same page, and each one had survived every prior review of the individual files.

The same argument retired a directory of five prompt bodies in the same library. Each had exactly one caller, no executed run had ever quoted one, and the directory was asserting a category ahead of its members. **A piece is extracted once a second consumer genuinely exists, and a category is created once it has members** -- both of which are facts about what happened, not predictions about what will.

The counter-pressure is real and should be named rather than dismissed: a single long document is harder to load, and [context size is model selection](#context-size-is-model-selection) argues for smaller units. Both are true, and the ordering resolves them. Split on a boundary the run demonstrated, and the split serves both concerns at once; split on a boundary imagined in advance, and it serves neither, because the pieces are the wrong pieces and they still have to be loaded together.

## A document that sequences, binds and routes is a controller written in prose

The fragmentation rule above answers *where* to split a workflow. It does not answer a prior question, and mistaking the two sends the repair in the wrong direction: **some of what a workflow document contains is not documentation at all.** Sequencing, variable binding, gate evaluation and failure routing are things code owns. Written in prose they are still a controller -- just one that nothing can execute, type-check or fail.

**The diagnosis this corrects was wrong twice, in opposite directions.** A workflow document that had grown to 788 lines was first blamed on fragmentation and merged, which produced a longer document; the merge was the right move for the reason given above, but it did not fix what was actually wrong. **A single long prose document and four shorter prose documents are the same mistake at different granularities.** Neither is a program, and the axis that matters is not how many files there are but which parts of the content were never prose to begin with.

The test is mechanical. For each passage, ask what would have to be true for it to fail. A passage describing an outcome fails when the outcome is wrong, and that is documentation. A passage deciding what runs next, binding a value, or routing an error fails when a *step* misbehaves -- and a thing that fails when a step misbehaves belongs in the layer that can observe the step.

**The same conflation inflates a workflow with work it does not do.** Most of those 788 lines restated what a deferred-to workflow already performed. Describing a callee's behaviour in the caller's own document is not composition; it is duplication with drift built in, and the drift is one-directional and silent -- the callee changes, the description does not, and nothing fails. **Name the deferral and state what it is relied upon to produce; never restate how it does it.** What a caller legitimately owns about a deferral is the [side effect it gates on](08_GATES.md), which is a fact about the caller's requirements rather than a copy of the callee's implementation.

## The stack a running workflow forms

Seven layers, each knowing only its neighbours. **The run identity is the only thing that spans all of them**, which is what makes an artifact at the bottom traceable to the request at the top.

| Layer | Owns | Passes down | Returns |
|---|---|---|---|
| `trigger` | selection, the claim, dispatch | the run identity and the work item | nothing -- dispatch is detached, so the run outlives the trigger |
| `queue` | the work item, its state, and its routing | which workflow and which model | a terminal status carrying its evidence |
| `composition` | identity, order, failure policy | the run identity; the phase reloads validated configuration and predecessor evidence from state | a typed execution status used for routing |
| `phase` | one step, and whether a result ends the run | a typed request | a typed result |
| agent module | the runtime boundary -- argv, environment, working directory | the invocation | a typed response |
| `command` | the instruction, and its report contract | -- | the declared report |
| `run history` | what actually happened | -- | the evidence everything above claims |

**A layer reaching past its neighbour is the defect this table exists to make visible.** The common instances: a phase computing the workspace from its own location on disk rather than receiving it, a command writing to the queue directly, and a composition reading inside a phase instead of taking its result.

**Two of these layers are usually missing at the start, and that is correct.** A workflow begins as a composition over phases; the queue and the trigger are added when work must start without a person, and the growth table above says on what evidence. Adding them early buys a claim protocol for traffic that does not exist.

## Higher-order ADWs are not yet a portable primitive

Phase reuse, external-workflow deferral, and typed child-workflow invocation are three different boundaries.

- **Reuse a phase entry point** when the caller owns the work and the existing phase contract fits. This is the supported unit of recomposition.
- **Use a deferral** when yielding to an external workflow the caller does not own. Resume from an independently observed side effect, not from trust in the callee's report.
- **Do not treat an owned ADW as a child phase merely because both are called workflows.** The current contracts do not define child input/output schemas, parent/child run identity, state namespaces, authority and budget derivation, gate ownership, cancellation propagation, retry accounting, or evidence import.

Sharing the parent's run identifier would give two compositions apparent ownership of one run's order and failure policy. Minting a child identifier would require all of the missing parent/child semantics above. A future typed child-workflow invocation may be justified by a real consumer, but it is `PLANNED`, not implicit in today's composition contract. Until then, flatten owned orchestration to contracted phases rather than inventing recursion or hiding another controller behind a phase.

Parallel graphs and races do not change this conclusion. They additionally require isolation, claims, deterministic joins, cancellation, live accounting, and conflict policy, so they remain demand-driven patterns rather than minimum primitives.

## A step is exactly one of three kinds

Every step inside a phase resolves to one of three, and the phase says which:

| Kind | What runs | What the controller reads |
|---|---|---|
| **Deterministic** | a command or API call | the exit code |
| **Agentic** | a prompt handed to an agent through the agent module | the response, validated against a schema |
| **Deferral** | an existing workflow the author does not own, which the controller yields to and waits on | the side effect, read back independently -- never the report -- plus the declared continuation that resumes the run |

**The third is the one that gets missed, and it is frequently the majority.** Every earlier statement of this distinction here had two values, because deterministic-versus-agentic is the split that is visible while authoring a single step. Deferral only becomes visible when a workflow is assembled against an ecosystem it did not write, at which point a workflow built around existing tooling can be mostly deferrals with a few original phases threaded between them.

Stating the kind at the call site is the part that earns its keep. A reader of a phase should be able to see which work is the author's and which is borrowed without leaving the file, because the two carry different obligations: the author's steps are gated on what they assert, and a deferral is gated on a side effect precisely because its report is not a contract.

**Why a deferral is a third kind and not the second one wearing a different hat.** The other two are both things the controller *performs*: it executes a command and reads an exit code, or it calls an agent it owns and reads a response validated against a schema. A deferral is neither -- the controller **yields control and resumes afterwards** -- so the thing that has to be specified is **the run's continuation**: what resumes it, on what evidence, and what the run does if control never comes back. Collapsing a deferral into "a bounded agent call" hides the resumption problem, and the resumption problem is the whole reason someone bothered to write the kind down.

[`LANGUAGE.md`](../../LANGUAGE.md) carries the same three values, so there is no longer a two-value form standing anywhere against this one.

## One boundary resolves the model and harness, and it cannot be retrofitted

**Exactly one invocation-resolution boundary may introduce a concrete model and harness into a run.** Portable phases and [semantic roles](14_SEMANTIC_AGENT_ROLES.md) reach it through semantic requirements; operator policy or an authorized exact override supplies the concrete routing, and the typed invocation carries the resolved values to the harness adapter. The adapter translates rather than re-decides. This is the property that makes [swapping the model a measurement](01_PRINCIPLES.md) rather than a rewrite and lets the same workflow run under a different harness.

It belongs on the list of things established before demand, which is a short list and normally argued against here. The reason it qualifies is that **the property is not recoverable later.** A model named in one phase is a local edit; named across a dozen phases and prompts, it is a migration whose cost is paid exactly when comparison would otherwise have been cheap. Concrete mappings change in one operator-owned policy; role contracts, prompts, ADWs, and adapters do not move with them.

## A layer above other layers

A workgroup's layer owns only what it alone can know: which components are involved, what must be running, and the order across them. Everything specific to a component is **invoked** from that component's own layer and never restated above it. A higher layer that knows how to test a component has become a second definition of that component's tests, and two definitions drift -- this is the invoke-rather-than-restate rule at a different altitude, and it fails the same way.

Before acting across components, a run resolves which of them the work actually touches. Bringing everything up is waste; bringing the wrong subset up produces a reproduction that is not one. **The cheapest check on that resolution is usually the work itself** -- a reproduction that fails because the wrong components were running fails diagnostically, so no separate gate is needed to confirm the scope was chosen correctly.

## Context size is model selection

Decomposition is usually argued from maintainability and blast radius. There is a harder constraint underneath, and it decides things the other arguments cannot.

**What a step must load before it can run determines which models it can run on.** A step that needs forty thousand tokens of library in front of it can never run on a small fast model -- not because its reasoning is hard, but because its preamble is big. A monolithic context forces a monolithic model choice, and that choice is then made for every step in the composition by whichever step needs the most.

Cost does not scale smoothly with it either. Providers commonly price a long context at a higher rate past some threshold, so the same work can cost several times more for crossing a line nothing in the workflow mentions. A step sitting just under such a threshold is one careless addition to its preamble away from a step that costs double, and nothing will report the change except the bill.

It decides concurrency too. **Small-context steps fan out; large-context steps serialize**, whether or not the work is logically parallel, because the constraint is what each invocation has to carry rather than what it has to do.

So the question to ask of every step is: **what is the minimum an agent must load to perform this correctly?** That number is simultaneously the composition boundary and the model-tier boundary. Where it is large for a step whose work is mechanical, the boundary is drawn in the wrong place.

The corollary for shared material: **centralize the contract, decentralize the content.** A step declares the shape of the context it needs and the caller supplies it. What genuinely belongs in one place is anything whose cardinality is greater than one -- a thing that must agree across callers. Everything else is payload, and payload carried centrally is paid for by every step that did not need it.

A worked case, from a real in-house workflow library: roughly four hundred and forty markdown files totalling about three quarters of a million tokens, with single entry points pulling sixty to seventy thousand tokens before doing any work. Boundaries there had been drawn by topic -- one kind of ticket, one file -- rather than by what has to load together, and the effect was that the cheapest, most mechanical phases were priced at the same tier as the most demanding one.

## Several agents against one question

Parallelism in this package has meant independent work split across workers. The other kind runs **several agents against the same question** and treats the relationship between their answers as the output. Three shapes, in increasing cost and increasing power:

- **Independent opinion.** Each answers alone, seeing nothing from the others. Cheap, fully parallel, and the result is a spread rather than an answer. **Agreement between actors that could not influence each other is real evidence**; agreement between actors that saw each other's work is much weaker, and the difference is worth protecting deliberately.
- **Debate.** Each sees the others' positions and may revise, across rounds. More expensive, and the useful output is not the final answer but **what moved and what did not** -- a position held under challenge is a different claim from one asserted once.
- **Collaboration.** Each proposes a plan, one synthesizes them into an assigned sequence, then the work is executed against it. The most expensive and the only one that produces a build rather than a judgment.

**Put the strongest model on synthesis, not on production.** Where one actor reconciles several proposals, that seat decides what the whole exercise yields, and a weaker model there wastes everything spent on the proposals. The inverse is also true: strong models generating parallel drafts that a weak one then reconciles is the most expensive way to get a mediocre answer.

**A synthesis that emits only the merged answer has thrown away what it paid for.** The relationship between the answers *is* the output; collapsing it to one result spends the multiple and keeps the part a single run would have produced anyway. So the synthesizing seat records three things: the **consensus**, and whether it was reached independently or after exposure, because those are different strengths of evidence; the **divergence**, naming what was taken from each side; and what was **discarded**, with why.

The discard list is the one that disappears unless it is demanded, and it is the one that matters most. Without it, a synthesis that dropped the correct answer is indistinguishable from one that dropped a wrong one -- both emit a confident merged result, and nothing in the artifact says which happened. It is also what lets a later reader reopen the decision without re-running the exercise.

**These cost multiples of a single run.** Reserve them for decisions whose blast radius justifies it -- a choice that binds for months, an irreversible migration, an architecture that everything else will be built against. For everything else, one competent actor and a real check is the better trade.

### Disagreement can be a difference of depth rather than a contradiction

When two independent actors return opposite verdicts on the same question, the reflex is to decide which one is wrong. Often neither is. **Ask how deep each of them looked before treating the disagreement as an error**, because two actors can both be correct at different depths and still disagree at the surface: one confirms that a path exists and is reachable, the other traces what that path does on the failing input and finds that it cannot produce the result. Both answered honestly, and they answered different questions.

The practical consequence is that **reconciling the depths is the work, and it is what produces the answer** -- not picking a winner, and not averaging two verdicts into a hedge. A synthesis recording only that the actors disagreed has thrown away the finding, in the same way the discard list above disappears unless it is demanded.

It also gives the brief a lever. Where the question is whether a stated mechanism is real, **say at what depth each actor must work**, and require the evidence that proves it worked there -- a trace of the failing input along the path, rather than a reference to the symbol's existence. A depth left unspecified is chosen by whichever actor stopped first.

### The brief's own framing is part of what is under test

The independence argument above protects actors from each other. It does not protect them from the actor that briefed them, and that is the larger exposure: every actor in the exercise received the same framing, so a wrong premise in the brief is not one actor's error but a blind spot the whole spread shares. **Agreement reached under a false premise looks exactly like agreement reached under a true one**, and widening the spread does not separate them, because the premise was never the thing being sampled.

So the brief has to authorize contradicting itself, in terms specific enough to act on: name which instructions are assumptions rather than constraints, and say that returning *"the instruction was wrong, here is the evidence"* is a successful result rather than a refusal. **A survey that cannot overturn its own brief is an expensive echo** -- it can only return the framing it was given, elaborated. The signal that this is working is uncomfortable and should be read as success rather than as insubordination: on a real run of four actors briefed this way, three returned a refutation of an instruction they had been given, and each refutation held on the evidence.

The corresponding obligation on the synthesizing seat is that **an overturned instruction is a finding, not a loose end to tidy away.** It is carried into the assembled output with the evidence that overturned it, in the same way the discard list is, because otherwise the next run is briefed from the same wrong premise and the refutation has to be bought a second time.

### State only constraints you have verified

A brief carries two kinds of statement and they are easy to confuse: the **task**, which the actor is there to perform, and the **constraints**, which it is being told already hold. An actor cannot tell them apart by tone, so it treats both as ground truth and reasons from the constraints without re-deriving them. **A constraint asserted from memory or from a stale reading therefore does not produce a caught error; it produces confident work built on a false floor**, and the actor has no reason to check the one thing that was wrong.

The rule is narrow and mechanical: **anything stated as already-true in a brief is checked against the artifact before the brief is sent**, or it is stated as an open question instead. The failure it prevents is cheap to describe and expensive to hit -- on a real run an actor was told that a stated boundary forbade a class of change, when the tree already contained several instances of exactly that class; the constraint had to be retracted while the actor was working, and everything it had reasoned from it was suspect.

Which gives the second half: **a constraint discovered to be false is retracted to the actor still holding it, explicitly, and the retraction says what it invalidates.** An actor cannot notice that its ground has moved. Where it has already finished, the retraction is applied to its output by the synthesizing seat instead, and recorded -- silently keeping a result derived from a withdrawn premise is how a false premise outlives the run that discovered it.

## Racing several actors to one answer

A fourth arrangement runs several actors on the same question and keeps **whichever result arrives first and passes the check**. It is not a variant of the three above, and treating it as one is the mistake: those three treat the relationship between the answers as the output, and a race discards every answer but one. What a race buys is not a better answer, it is an earlier one.

**A race needs a mechanical acceptance check, or it is not a race.** Without one, "first" means first to *claim*, which selects for whichever actor was most willing to declare itself done rather than for the one that finished the work. The check is what converts arrival into acceptance, which makes it the precondition rather than a refinement: where success has no mechanical consequence, this shape does not apply and one of the three above does. This is the same limit that bounds authoring a gate in advance, arriving from the other direction.

**Vary the configuration, not only the instance.** Several copies of one context, model, prompt and tool set re-sample one distribution -- they share a blind spot, and what they buy is a faster draw from it rather than a wider one. Varying the Core Four across entrants is what makes the spread real, and it is the independence argument from [evaluations](12_EVALUATIONS.md) spent on latency instead of on corroboration.

**The losers are cancelled, and cancellation is an obligation rather than an outcome.** Every entrant still running when the race is decided holds a workspace, a process and a share of the budget. It is stopped, its partial effects are inspected rather than assumed absent, and it emits a phase result with execution status `cancelled` -- an entrant that was terminated having written nothing and one that half-applied an edit are indistinguishable until someone reads them. The retry accounting is unaffected: a race is one attempt made several ways, not several attempts.

**The currency is latency, and it is named before the race starts.** A race is worth what the waiting would otherwise have cost -- a stalled release, an open incident, a person idle on the result. Where nothing is waiting on it, a race spends the price of several runs to obtain the answer one run would have produced, and that same compute buys strictly more as a spread.

## Delegation depth is a context decision, and every tier costs fidelity

A composition may delegate through intermediate actors -- one actor directing leads, each lead directing workers -- and the reason to add a tier is the reason to draw any other boundary: what each actor has to load. A tier exists to hold the context its workers would otherwise each carry a copy of, and to spare the actor above it from carrying the workers' detail. That is the context-size argument above, applied to the shape of the delegation rather than to the split of the work.

**Each tier is also a summarization boundary, and summarization is where evidence rank is lost.** A worker's result summarized by its lead and summarized again above it arrives at the top as prose about prose -- an `asserted` claim twice removed, with exactly the detail a reader would need in order to doubt it deliberately stripped out. Depth therefore trades context economy against evidence fidelity, and the trade is one-way: no amount of re-reading the top-level account recovers what the middle discarded.

**A tier is affordable only where the layer beneath it can still be observed directly.** An actor reachable only through its parent's account of it cannot be checked, and therefore cannot be improved, because the defect and the report of the defect have the same author. Delegating into a surface that is observable only at its boundary is a reasonable place to start and a poor place to finish; what makes depth safe is a path to every level that does not run through the level above it.

**Contexts do not add up across actors.** Several actors each holding a large context hold several separate contexts, not one larger one. What crosses between them is whatever one of them chose to write down, bounded by the handoff rather than by either window -- so a tree of actors buys parallel attention and pays a summarization boundary for it. Reading it as aggregate capacity mistakes the sum of the windows for the size of the shared one, and the arithmetic flatters the design at precisely the point where the design is weakest.

## A stack of models, not a model

The question "which model is best" is the wrong question for a composition, and it gets less useful as the field moves. A workflow runs many phases with different demands, and the useful operator-owned object is a **stack**: a small roster of models held at distinct capability, cost and latency points, with each semantic role/phase requirement assigned the cheapest one that can do its work.

Three tiers are usually enough to reason with -- the frontier tier for work where being wrong is expensive, a workhorse tier that handles most of the volume, and a lightweight tier for mechanical steps. What matters is not the count but that **the assignment is per phase and recorded**, so a phase's model is a decision with a reason rather than an inheritance from whatever the composition was started with. The reason has to come from somewhere, and the only honest source is [measurement on your own work](12_EVALUATIONS.md) -- a published benchmark says something about a model in general and very little about whether it can carry one phase of one workflow.

**Effort is a second axis, and it does not behave like the first.** Where a model exposes a reasoning or deliberation setting, that setting is part of the per-phase assignment and is recorded alongside the model. Unlike the capability tier, **it is not monotonic**: a higher setting can consume several times the tokens and return a result that is no better, or worse, because extended deliberation on a problem that did not need it is the same failure as a person overthinking a simple decision. Assume nothing about the direction, and measure it the way the tier is measured -- on your own phases, against your own work.

This is the same constraint as context size approached from the other side. A step's minimum context decides which tiers it *can* run on; the stack decides which of those it *should*. A composition that names one model everywhere has either not made the decision or has made it once for steps that do not resemble each other.

## Staying in distribution

**Do not invent a language for your workflows to be written in.** A configuration format nobody has seen, a bespoke expression syntax, a custom directive vocabulary -- each one is a thing every agent and every reader must be taught before it can help, and the teaching is paid for on every run and every onboarding.

Ordinary code, ordinary configuration formats and ordinary prompt files are understood already. Staying inside what is widely known is not a stylistic preference; it is what makes the system legible to the actors operating it, and a workflow that requires a manual before an agent can modify it has traded away the agentic access it was built for.

## Choose the smallest sufficient set

Build the least that does the job. Each row's right-hand column is what to add **only when the situation demands it**, not what to add next.

| Situation | Needed | Add only if justified |
|---|---|---|
| One-off supervised task | Scoped prompt, observable criteria, checks, handoff | No workflow framework at all |
| Repeated plan/build | Task contract, phase prompts, a runner, state, a checked plan, gates | A domain template |
| Test and review repair | Exact evidence, a finding schema, separate passes, capped repair and revalidation | Browser scenarios, for interface work |
| Unattended or parallel | The above, plus claims, isolation, cancellation, identity, recovery and independent gates | A scheduler, tracker, or dashboard |
| Repeated expertise | A focused skill with verified reference and an update procedure | Self-updating expertise -- and never self-updating authority |

## Invocation

Every agent call resolves four choices: **context, model, prompt, tools.** A [semantic role](14_SEMANTIC_AGENT_ROLES.md) supplies reusable requirements; the controller bounds context and authority; operator policy selects the concrete model/effort; and the typed invocation records the result. Select by measured capability, cost, privacy and latency; do not hard-code a ranking that was true once.

**How a tool is surfaced is part of the tools choice.** The same capability reached through a tool protocol server -- MCP being the common one -- and reached as a command-line tool are not equivalent, and the difference is paid on every run. A protocol server's schemas load into context whether or not the step calls them, so the cost scales with what is *connected* rather than with what is *used*; its shape is its author's, so the available operations are the ones they chose to expose; and it cannot be wrapped, so local defaults must be restated in the prompt on every call. A command-line tool costs nothing until it is invoked, is described in whatever depth the step actually needs, and can be wrapped so the defaults that matter are applied once instead of requested each time.

This is not an argument against protocol servers. They are the right answer for a capability with no command-line surface, for one that must hold a session the caller cannot, and wherever the protocol is the only integration on offer. It is an argument about the **default**: reach for the command-line form first, and connect a protocol server where the capability genuinely needs one. Either way the cost belongs in the same accounting as context size, because **a connection is a standing charge against every step in the run, including every step that had no use for it.**

**A deferral carries the same standing charge, and it is easy to miss because it looks like a function call.** Invoking an existing external workflow loads that workflow's whole body before it does anything, and the load is paid on every invocation rather than once. Measured on a real one: a bare *help* invocation of a single wrapped workflow -- doing no work at all -- cost around fifty-four thousand tokens of context construction, roughly a third of a dollar, and five seconds. Chaining seven phases as seven separate invocations pays that seven times, and none of it is visible in the composition, which reads as seven ordinary steps.

Two consequences follow, and they point in different directions. In the short term, look for whether the harness can hold a session across calls rather than reconstructing one per call, and **measure it rather than assuming either shape is cheaper**. In the longer term this is the cost that makes a deferral transitional: it is recovered when the mechanism being wrapped is extracted into code the workflow calls directly, alongside the typed return and the caller-chosen model that extraction also recovers.

**Prompt shape:** purpose -> named variables -> constraints -> relevant files -> ordered workflow -> exact report. Add examples, delegation or loops only where they earn their place.

**Reduce and delegate.** Prime for the task at hand, give each actor one purpose, and return compact manifests. Reload authoritative state and the relevant files rather than copying a whole transcript forward.

**A context bundle is an index, not memory and not instructions.** Validate containment and freshness. Never capture secret values by default.

A higher-order prompt consumes a prompt or plan; a metaprompt produces one. **Neither authorizes running arbitrary supplied instructions.**

## Composition examples

Names describe phase order; omitted obligations still need an explicit reason. A composition is a sequence of phases, not a file -- the implementation language and file layout belong to whatever adopts it.

| Need | Composition | Conditional additions |
|---|---|---|
| Plan for human decision | **plan** | Readiness review; no implementation |
| Small understood change | **plan -> build** | Still require checks/review before acceptance, whether inline or later |
| Bug | **plan -> build -> test** | Reproduce first; regression check; bounded test repair; separate review |
| Feature/refactor | **plan -> build -> test -> review** | Review/revise -> affected tests -> review again |
| Full delivery | **plan -> build -> test -> review -> document** | The full software development life cycle. The document phase holds task state `documenting` and passes `G6`; explicit handoff, not automatic shipping |
| Prototype | plan for chosen stack -> scaffold/build -> checks -> review -> document | Stack template only when appropriate; installation approved separately |
| Parallel jobs | claim -> isolated workspace -> selected composition -> integrate/check | One active writer per workspace; resource reservations and live worker accounting |
| Tracker-driven work | authenticated trigger -> atomic claim -> workflow -> receipt/update | Tracker update is an adapter, not proof of acceptance |

A targeted repair receives the exact failing command/finding, spec, minimal relevant context and a capped budget. After a change, invalidate affected downstream gates; rerun the reproducer AND affected broader checks. A later review patch cannot reuse earlier test evidence as if the code were unchanged.

## Controller outline

This is pseudocode, not an installed runtime:

```text
validate task + effective config + authority
claim task/workspace if concurrent; record baseline
for phase in approved composition:
    validate prerequisites + current identity + remaining budgets
    run bounded code or agent adapter
    persist sanitized result and artifact manifest
    independently validate envelope, artifacts and required gates
    for each gate whose subject is a change:
        assert observed workspace == delegated workspace
        assert changed_file_count > 0 else decision = blocked
    if blocked: bounded correction/repair per retry kind, or explicit human decision; do not advance
                route repair to return_to, not unconditionally to verification
    persist transition with actor, evidence and next state
return handoff awaiting human acceptance
```

Prefer explicit phase calls over shell pipelines. If pipes are supported, reserve stdout for the contract and propagate every child's failure; the final child's zero exit must not hide an earlier failure. A "continue to collect evidence" mode may run independent diagnostics but cannot clear a failed gate or permit dependent mutation.

## Optional integration, not mandatory infrastructure

Add hooks only for an identified event need, and against a written contract. Add MCP/tools only for required capabilities with checked input/output contracts and least privilege. Add triggers only after the local workflow is proven, with authenticated/authorized inputs, allowed workflow routing, atomic claims, deduplication and cancellation. Add shipping only under separate human authority and current gates; commit, push, merge and deployment are distinct effects.
