# 📓 Handbook -- how to actually do a piece of work here

`foundations/` holds what is true. **This holds what to do about it.**

When a task arrives -- a bug ticket, a feature, a chore, a workflow to build -- start here. Each entry below says where to begin, which parts of the discipline apply, what has to exist before you start, and what you produce. The discipline files are referenced rather than repeated: this tells you *which* to read and *why*, and they tell you what the rule is.

## Start from the work

| You have | Start at | The discipline it leans on |
|---|---|---|
| **A bug ticket** | [Working a defect](#working-a-defect) | 🏗️ [SDLC](../foundations/Software_Engineering/01_SDLC_SOFTWARE_DEVELOPMENT_LIFECYCLE.md) for the shape; 🔬 [verification](../foundations/Agentic_Engineering/04_VERIFICATION.md) for what counts as proof it is fixed |
| **A bug that will not reproduce, or a cause nobody can locate** | 🧵 [`12_TRACING_A_DEFECT.md`](12_TRACING_A_DEFECT.md) | 🔬 [verification](../foundations/Agentic_Engineering/04_VERIFICATION.md) for predicting before observing; ⚖️ [testing and evidence](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md) for what a degraded environment does to a result |
| **A feature or chore** | The same lifecycle, sized down; if it introduces or materially changes a substantial subsystem, use 🏛️ [`16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md`](16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md) | 🔄 [workflow](../foundations/Agentic_Engineering/02_WORKFLOW.md) -- the flow-sizing table is the first thing to read |
| **A workflow to build** | 🛠️ [`06_BUILDING_AN_ADW.md`](06_BUILDING_AN_ADW.md) | 🧩 [composition](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) and 🧱 [the primitive you are creating](../foundations/Agentic_Engineering/primitives/README.md) |
| **A workflow to trust** | 🧪 [`07_VALIDATING_A_WORKFLOW.md`](07_VALIDATING_A_WORKFLOW.md) | 🔬 [verification](../foundations/Agentic_Engineering/04_VERIFICATION.md), and ⚖️ [testing and evidence](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md) |
| **A workflow you already trust** | 📋 [`08_GATE_ENFORCEMENT_CENSUS.md`](08_GATE_ENFORCEMENT_CENSUS.md) | 🛡️ [gates](../foundations/Agentic_Engineering/08_GATES.md) and 📒 [run history](../foundations/Agentic_Engineering/primitives/run_history.md) |
| **A subject too large for one actor to read, where the change is broad and partly irreversible** | 🛰️ [`13_ORCHESTRATING_A_SURVEY.md`](13_ORCHESTRATING_A_SURVEY.md) | 🧩 [composition](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) § *Several agents against one question*; 🔄 [workflow](../foundations/Agentic_Engineering/02_WORKFLOW.md) § *Parallel work* for the claim rules |
| **Something that failed** | 🛟 [recovery and handoff](../foundations/Agentic_Engineering/05_RECOVERY_AND_HANDOFF.md) | Repair returns to the phase that *caused* the defect, not the one that found it |
| **Somewhere to put a file** | 🏗️ [`05_AGENTIC_LAYER_LAYOUT.md`](05_AGENTIC_LAYER_LAYOUT.md) | -- |
| **A specialized agent responsibility or its model/tool routing** | 🎭 [semantic agent roles](../foundations/Agentic_Engineering/14_SEMANTIC_AGENT_ROLES.md) | 🧩 [composition](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) for phase ownership; 🎛️ [`15_THE_AGENT_INVOCATION_MODULE.md`](15_THE_AGENT_INVOCATION_MODULE.md) for the resolved runtime boundary |
| **The code that calls an agent -- writing it, or judging one that exists** | 🎛️ [`15_THE_AGENT_INVOCATION_MODULE.md`](15_THE_AGENT_INVOCATION_MODULE.md) | 📦 [module](../foundations/Agentic_Engineering/primitives/module.md) for whether it earns a place at all; 🧱 [primitives](../foundations/Agentic_Engineering/primitives/README.md) for the six cases it is proved with |
| **A bench to install, or a default to add** | ⚙️ [`14_THE_DEFAULTS_FILE.md`](14_THE_DEFAULTS_FILE.md) | 🧭 [`defaults/README.md`](../defaults/README.md) for **the four layers** -- the live bench, `config/`, `templates/claude_home/` and `defaults/`, and which one a given change belongs in |
| **A concept and no idea where it is defined** | 🗺️ [`04_ARTIFACT_MAP.md`](04_ARTIFACT_MAP.md) | -- |

## Working a defect

The worked example, because it is the most common arrival and every other kind of work is a variation on it.

1. **Reproduce it before proposing a cause.** A defect whose reproduction is unknown is not scoped yet, and a fix aimed at an unreproduced failure is a guess with a diff attached. If it cannot be reproduced, say so and name the evidence that would settle it.
2. **Declare the engagement mode and the entry operating level**, and open a run state record. See 🔄 [workflow](../foundations/Agentic_Engineering/02_WORKFLOW.md) for the states and 💾 [state](../foundations/Agentic_Engineering/primitives/state.md) for what the record holds.
3. **Discover within scope.** Read only from the approved root; 🔐 [authority and safety](../foundations/Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md) has the bounded-discovery rule and the commands.
4. **Write the failing check first**, so the fix has something to satisfy that is not your own opinion of it.
5. **Make the smallest coherent change.** If it grows past the scope that was approved, stop and ask rather than widening -- a plan that quietly grew is a plan nobody approved.
6. **Verify, and record the evidence with its provenance.** ⚖️ [testing and evidence](../foundations/Software_Engineering/02_TESTING_AND_EVIDENCE.md) covers the check ladder and the evidence record; 🔬 [verification](../foundations/Agentic_Engineering/04_VERIFICATION.md) has the rule that a required check is satisfied only by having actually run.
7. **Review separately from building**, then hand off. Acceptance is not permission to ship; that is a further explicit decision.

**Where an agent collaborates rather than executes:** steps 1 and 4 are where judgment is genuinely needed and a conversation is worth having -- what actually reproduces this, and what would prove it fixed. Steps 3, 6 and 7 have deterministic parts that should be code rather than judgement. Ask of each step: *would two people given this step produce the same result?* If yes, it is code.

## What is in here

| File | Covers |
|---|---|
| 🗒️ [`01_LOCAL_MEMORY.md`](01_LOCAL_MEMORY.md) | The three local folders -- what goes in each, and what is never committed |
| 🗂️ [`02_RUN_ARTIFACTS.md`](02_RUN_ARTIFACTS.md) | `runs/<run_id>/` -- what a run writes, and the rules for writing it |
| 🩺 [`03_STRUCTURAL_CHECK.md`](03_STRUCTURAL_CHECK.md) | The one executable check: internal links resolve |
| 🗺️ [`04_ARTIFACT_MAP.md`](04_ARTIFACT_MAP.md) | Which file here plays each role the discipline names |
| 🏗️ [`05_AGENTIC_LAYER_LAYOUT.md`](05_AGENTIC_LAYER_LAYOUT.md) | Where things go in a target project, and our naming |
| 🛠️ [`06_BUILDING_AN_ADW.md`](06_BUILDING_AN_ADW.md) | Building a workflow, start to finish |
| 🧪 [`07_VALIDATING_A_WORKFLOW.md`](07_VALIDATING_A_WORKFLOW.md) | Checking a workflow does what it claims, before trusting it |
| 📋 [`08_GATE_ENFORCEMENT_CENSUS.md`](08_GATE_ENFORCEMENT_CENSUS.md) | Counting what actually holds each gate shut, so enforcement can be watched over time |
| 🚪 [`09_ADOPTING_A_REPOSITORY.md`](09_ADOPTING_A_REPOSITORY.md) | Arriving somewhere new: observe, scaffold, wrangle, replace, factory — and where to stop |
| [`10_OBSERVING_A_PROCESS.md`](10_OBSERVING_A_PROCESS.md) | Record work as it happens, so a workflow can be derived from what occurred rather than from what was recalled |
| [`11_VERIFYING_IN_A_BROWSER.md`](11_VERIFYING_IN_A_BROWSER.md) | Check a change in the running application — why the browser phase serialises, what to capture, and how to leave nothing behind |
| 🧵 [`12_TRACING_A_DEFECT.md`](12_TRACING_A_DEFECT.md) | Trace a write from the system of record to the rendered output and name the first boundary that disagrees — for defects that will not reproduce, or whose cause nobody can locate |
| 🛰️ [`13_ORCHESTRATING_A_SURVEY.md`](13_ORCHESTRATING_A_SURVEY.md) | Several actors survey one subject in parallel, an orchestrator assembles a plan, the operator approves, execution actors act — the stages, the approval gate, and the failures that produced it |
| ⚙️ [`14_THE_DEFAULTS_FILE.md`](14_THE_DEFAULTS_FILE.md) | [`defaults/defaults.json`](../defaults/README.md) -- the schema for store locations, ADW output levels, required tooling and harness pieces; what an installer does with each field, and how a new value is added without collapsing the default-versus-instance split |
| 🎛️ [`15_THE_AGENT_INVOCATION_MODULE.md`](15_THE_AGENT_INVOCATION_MODULE.md) | The adapter between a controller and an agent runtime -- identity, typed request and response, environment allowlist, preflight, input capture, streaming sink, result extraction, error taxonomy, retry policy, tolerant parse, truncation and a run logger; what the module must not decide, and three failures found by reading |
| 🏛️ [`16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md`](16_SUBSTANTIAL_SUBSYSTEM_LIFECYCLE.md) | The complete Architecture-Gated lifecycle for implementing or materially changing a substantial subsystem, including classification, review, documentation, feedback, and completion evidence |

## The split with `foundations/`

| | Answers | Shape |
|---|---|---|
| 🏛️ [`foundations/`](../foundations/README.md) | What is **true** -- what engineering is, and what agentic engineering adds | Rules, each standing on its own |
| `handbook/` | What to **do** about it | Procedures, in order, that reference those rules |

**The split is rules against procedures, not portable against local.** A procedure here may well hold for any agentic-engineering effort -- building a workflow is not specific to this package -- and that is fine. What decides placement is the form: a statement of what is true belongs in `foundations/`, and an ordered sequence of what to do belongs here.

That keeps `foundations/` standalone, because a rule is liftable in a way a procedure is not: the procedure names files, tools and an order, and every one of those is an adopter's choice.

**When a file here explains a rule rather than pointing at one, that is a leak.** The rule moves to `foundations/` and this file keeps the pointer.
