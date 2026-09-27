# 🧱 Templates

Starting points, copied into a target and then owned by it. **Nothing here is imported at runtime** — a template is markdown or data you take a copy of, not a dependency you link against. A copy that drifts from its template is the copy being right about its own situation.

Only what the package already states a use case for gets a template. A template for something nobody has needed twice is a guess with a folder.

| Group or file | Holds | Status |
|---|---|---|
| [`layout/`](layout/) | The three local folders an adopter would otherwise receive empty | present |
| [`workflow/`](workflow/) | A phase, and the prompt payload it hands an agent | present — earned by writing both twice, on a deterministic phase and an agentic one |
| [`record/`](record/) | The phase result, the history entry, the action line | present — same reason |
| [`TEMPLATE_CLAUDE.md`](TEMPLATE_CLAUDE.md) | The global instruction file a harness loads at the top of every session | present — earned by the second writing of it, and by what that writing had to cut |
| [`harness_manifest.md`](harness_manifest.md) | What is actually installed and running on one bench, keyed by capability so it ports | present -- earned by argument, below. Filled in once |
| [`claude_home/`](claude_home/README.md) | A copy-and-fill kit reproducing a harness configuration directory on a new machine | present -- earned by the hook set existing in exactly one place, with no restore path |
| `document/` | Design and spec skeletons | **not yet.** A design document has been written once and a spec not at all. Earned by the second of either |

**Not a template, and filed outside this folder for that reason:** [`../config/`](../config/README.md) holds the maintainer's own bench with its real values, for restoring it rather than for adopting it. It is the one thing here that would be *wrong* to copy — a template is right when every personal value is a placeholder, and that folder is right when none of them is. Keeping it out of `templates/` is what stops it being picked up by someone reaching for a starting point.

**Also not a template, for a different reason:** [`../defaults/`](../defaults/README.md) holds *the answers* -- what a sensible value is for each field a template asks for, and why. A template is the shape somebody fills in; the answers are what they would otherwise have to guess. 🧭 [**The four layers**](../defaults/README.md) in that README separates all of it -- the live bench, `config/`, this folder's [`claude_home/`](claude_home/README.md) kit, and the answers -- and says which one to edit for a given change.

## Why `layout/` exists at all

`.profile/` is **never committed**, which is correct for what it holds and means a fresh clone of this package arrives without it. It is load-bearing: the operating workflow may read it. So the default ships here and is copied in, rather than each adopter inventing a folder from a description. `.memory/` and `.workgroup/` are seeded here too, but since 2026-09-16 they are **not** materialised into this package — their runtime location is the workbench-home local state root at `~/.workbench/<org>/`. These seeds initialize a new environment; they are not a way to copy, restore, or share another environment's context.

## Why `TEMPLATE_CLAUDE.md` is earned

The global instruction file has now been authored twice — once as it accumulated, and once as a deliberate rewrite against a survey of the whole setup. That second writing is what earns the template, and specifically what it had to **cut**: the survey found one rule stated four times across the setup and another three times, and found a state-traversal section that was a weaker copy of one living closer to the work and winning only because it loaded first.

So the reusable part is not the list of preferences — those are one operator's. It is the **shape**: which rules belong in a file that loads every session, which get a pointer instead, and the fact that every line is paid for in every session. That is a judgment an adopter would otherwise have to make by accumulating the same duplication first.

It is a single file rather than a group because there is exactly one of it. If a second harness needs a differently-shaped global file, that is the point it becomes a folder.

## Why `harness_manifest.md` is earned, and the honest weakness in the argument

**It has been filled in once, not twice.** State that first, because the rule at the top of this file is a real rule and this is the row most likely to be waved through.

The argument that it qualifies anyway is that the package **already states the use case twice, in documents that cannot execute without it.** [`harnesses/porting.md`](../harnesses/porting.md) gives a mechanism-by-mechanism translation procedure whose input -- a list of the mechanisms in use -- does not exist anywhere. [`foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md`](../foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md) requires saying out loud which triggers are conveniences and which are load-bearing, and there was no place to say it. The template is the missing input to two procedures already written down, which is a stronger basis than a second instance would be on its own -- **a second filling proves the shape is reusable; an existing consumer proves it is needed.**

The reusable part is one design decision, and it is the whole of the template: **key every entry by the capability it depends on, not by the product feature it currently uses.** A manifest written the obvious way is one product's inventory and ports to nothing. Written this way, the port is a lookup per row against [`harnesses/equivalents.md`](../harnesses/equivalents.md), and the rows with no lookup are the port's actual cost -- which is the output a conformance report cannot give you, because it describes a product rather than an installation.

## Why `claude_home/` is earned

Not by a second writing. By a **counted absence**: the four hook scripts, the critical-rules file and the shortcut vocabulary existed in exactly one directory, that directory is not under version control, and the only other copy lived in a repository being deleted. A kit that reproduces them is the first restore path that exists at all, which is a different kind of earning than reuse and a better one.

**It is a sibling of the manifest, not a duplicate of it.** The manifest moves a bench to a different **harness**; the kit moves it to a different **machine**. Each one's README says which is which, because the two get confused precisely when someone is in a hurry.

Two constraints shaped it and are worth knowing before adding anything to it. **This repository is public**, so every machine-, account- or employer-specific value is a documented placeholder rather than a value -- grep the kit for your own username before committing to it. And **a symlink cannot be copied**: a copied link is a dangling link on the new machine, and a dangling link reads as *absent* rather than as an error, so links ship as instructions and never as artifacts.
