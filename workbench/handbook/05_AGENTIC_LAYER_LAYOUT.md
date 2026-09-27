# 🏗️ Agentic layer layout

Where the primitives go in a target project. [`foundations/Agentic_Engineering/primitives/`](../foundations/Agentic_Engineering/primitives/README.md) says what each must contain; this says where we put them. A project that already has a convention keeps it -- **record the mapping instead of imposing this one.**

## Start here

The first three directories. Do not generate more than this until something forces it -- [`foundations/Agentic_Engineering/06`](../foundations/Agentic_Engineering/06_ADW_COMPOSITION.md) has the table of what forces what.

```
.claude/commands/    named, reusable prompts
specs/               the detail a task needs
adws/                code that runs them in order
```

## The full layout, once grown into

```
.claude/
  commands/          one command per file, named for what it does
  hooks/             one file per lifecycle event, named for the event
  settings.json      which hooks are registered
adws/
  adw_<phases>.ts    a composition; the filename IS the sequence
  adw_<phase>.ts     a single phase
  adw_modules/       shared code -- adapters to foreign boundaries
  adw_triggers/      how runs start without a person
  adw_data/          durable storage for facts that outlive one run
specs/               machine-generated, one per task, short-lived
ai_docs/             pinned external references + their manifest
design/              durable design documents
runs/<run_id>/     per-run artifacts: state record, logs, prompts, raw agent output
trees/<run_id>/      isolated workspaces, one per run
```

The last two are **generated, not authored** -- and both belong in the ignore file. A run's artifacts are evidence; a workspace is disposable.

**The application lives elsewhere.** Whatever directory holds the product is the application layer and is not part of this. An agentic layer that cannot be deleted without taking the product with it has been built in the wrong place.

## This is one way, not the way

A target project may organise differently and still be correct. The criterion is not the directory names -- it is whether the layout produces an environment where:

- engineering patterns are **templated and reusable**
- agents have **clear instructions** for operating the codebase
- workflows are **composable**
- output is **observable and debuggable**

A layout that delivers those four is a good layout. Record whichever one the target uses.

## The run id is the join key, and the filesystem is the index

**Nothing above needs a database, because the run id appears in every tree that holds part of a run.** The spec is `<task-type>-<run_id>-<description>.md`, the artifacts are `runs/<run_id>/`, the workspace is `trees/<run_id>/`. **That repetition is the mechanism, not redundancy** -- it is what lets a plan, its evidence and the checkout it was built in be found from each other by pattern, with `ls` and a glob.

**A spec therefore carries its run id twice: in the filename and in its own metadata.** The filename makes it findable; the metadata makes the link survive the file being renamed or moved, which a filename alone does not. [`primitives/spec.md`](../foundations/Agentic_Engineering/primitives/spec.md) requires the metadata field for this reason.

**The consequence to design for: whatever the id keys must be minted once, at the entry phase.** A dependent phase that invents its own id produces artifacts nothing else in the run can find, which is why an entry phase mints and every other phase refuses to run without one.

**Choose the key deliberately, because there are two defensible answers and a package should state which it uses.** Keying on the **run** ties artifacts to one execution, so a second attempt at the same subject is cleanly separate. Keying on the **subject** -- a ticket, an issue -- ties every attempt together at the cost of telling two runs apart. **Whichever is chosen, it has to be the same key in every tree**, or the join silently stops working for the trees that disagree.

## Naming

- **A composition's filename is its phase sequence**, in execution order: `adw_plan_build_test.ts`. Reading the directory tells you what workflows exist without opening anything.
- **Properties stack onto the sequence as further suffixes**, in a fixed order, so a name carries both what runs and how: `adw_plan_build_iso.ts` is isolated, `adw_sdlc_zte_iso.ts` is the full lifecycle, zero-touch, isolated. **A property that is true of every scaled workflow is still written down** -- it costs three characters and it makes the exception visible, which is the whole point of putting it in the name.
- **A spec is `<task-type>-<run_id>-<description>.md`.** All three parts, because specs are found by pattern as often as by path.
- **A command is named for its single responsibility.** If the name needs "and", split it.

**The naming rule for an artifact belongs inside the command that produces it, not in a document about conventions.** A command that writes a spec states the filename pattern in its own text, so the convention is enforced at the point of use by the thing doing the writing. A convention documented only here is one every author has to remember; a convention stated in the producing command is one they cannot miss.

## What is ours

| | |
|---|---|
| Language | **TypeScript, run with `bun`** |
| Isolation | a worktree per run |
| Reserved resources | derived from the run id, written into the workspace as a file the agent reads |
| State | outside the worktree, so it survives the workspace being deleted |

The port-contract-in-a-file detail is worth keeping deliberately: the contract lives where the work happens, so anything operating in that workspace picks it up without being told.

## Where ADWs live for a given project

**This package describes how ADWs are built; it neither holds nor generates them.** What it describes is built in the adopting organization's own library, and lives there.
