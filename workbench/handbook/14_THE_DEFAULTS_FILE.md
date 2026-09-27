# ⚙️ `defaults.json` -- the schema, and how to add to it

[`../defaults/defaults.json`](../defaults/defaults.json) is the parameterisation of a bench: where the stores live, where workflow output goes, what has to be installed, and what an installer substitutes. **A JSON file with no schema document is a file people guess at**, so this is that document -- what each field means, what an installer does with it, and how a new value gets added without collapsing the one distinction the file exists to hold.

## Why it has a folder of its own, and is not in `templates/` or `config/`

Those two folders have **opposite correctness conditions**, stated in their own READMEs: [`templates/`](../templates/README.md) is right when every personal value is a placeholder, [`config/`](../config/README.md) is right when every one of them is the real thing. `defaults.json` deliberately carries **both halves at once, labelled** -- which satisfies neither invariant, and would quietly break whichever folder it was filed under. It is what both of those folders parameterise against, which is why it is filed beside them rather than inside either.

It is also the only file here that a future team installer reads as input, and a named folder is findable without knowing which half of the bench you are in.

**It sat at the package root until 2026-09-16** and moved into [`defaults/`](../defaults/README.md) so the answers could carry a README of their own. That README holds the argument this section compresses: 🧭 [**the four layers**](../defaults/README.md) -- the live bench, the filled form, the blank form and the answers -- what each one is correct when, and which one you edit for a given change. Read it before deciding a value belongs in one of the others.

## The one distinction the file exists to hold

Every value carries a `scope`, and **collapsing it is how the file stops being shareable**.

| `scope` | Means | A teammate adopting this |
|---|---|---|
| `default` | The shipped value is sensible for anyone | inherits it unchanged |
| `instance` | The shipped value is **this operator's current answer**, tokenised | replaces it with their own |

A third field, `ask`, is present and `true` only where **there is no sensible default at all**. A `null` value with `ask: true` is an honest gap, not an omission -- the installer has to put a question to a human. Everything in that class is also listed once more in the `unanswerable` section, with the reason no default is possible and where the real value comes from.

**Getting the split wrong in the safe direction is expensive and getting it wrong in the unsafe direction is a leak.** Marking a genuine default as `instance` costs a teammate an unnecessary question. Marking one operator's answer as `default` installs this engineer's opinions on someone else's machine without either of them noticing.

## Format -- indented JSON, deliberately

The record-format rule says anything not meant for a person to read is compact JSONL. **That rule is scoped to machine-read, append-only records**, and this file is neither: a person opens it, reads the reasons, and edits the `instance` column. Indentation is correct here for exactly the reason it is wrong there. It is `.json` rather than `.jsonl` because it is one document, not a log.

The [structural check](03_STRUCTURAL_CHECK.md) parses every `.json` in the package, so a malformed edit fails there rather than at install time. Until this file existed, that half of the check passed vacuously -- it now has a subject.

## The sections, and what an installer does with each

| Section | Holds | The installer |
|---|---|---|
| `tokens` | every substitutable value, its spelling, and whether it must be asked for | collects answers for every `ask: true` token, then substitutes all of them in one pass |
| `token_spellings` | the two placeholder conventions and the rule binding them | never runs one file's substitution over the other's files |
| `stores` | the three locations, what each holds, and its visibility | clones the public package, creates environment-owned state only when absent, and installs the harness |
| `local_folders` | where `.memory/`, `.workgroup/` and `.profile/` physically live and how each is materialised | two are **direct directories** at the local state root; the third is **generated locally** at the package root |
| `split_warning` | a known unresolved consequence of the arrangement | reads it before repointing any path |
| `adw_output` | the three levels a workflow library can sit at, and how the level is decided | places a new library; does not move an existing one |
| `tooling` | every tool, what breaks without it, and its version constraint | probes for each, reports what is missing, installs nothing without saying so |
| `harness` | what must be placed in the harness home, keyed by capability | places it, then runs `harness.verification` |
| `installer` | the ordered procedure, with each step marked deterministic or not | executes it in order |
| `unanswerable` | every value with no sensible default | asks |

### `stores` and `local_folders`

The arrangement is three locations with different visibilities, and the folder-level rules are what make it work:

- **`.memory/` and `.workgroup/` are real directories in the workbench home** (`~/.workbench`, the `__WORKBENCH__` token), under the organization slice at `__WORKBENCH__/<org>/`. Every reader names that path directly: **they are not symlinked back to the package root, and symlinks were rejected outright** rather than simply not built yet. The cost of that choice is that the path is spelled in roughly forty files instead of one, so a future move is a prose sweep rather than a single `ln -s`.
- **`.profile/` is generated locally** at the package root from templates plus answers. The package therefore never contains one operator's values, and **a fork cannot leak by someone forgetting to strip a directory** -- there is nothing there to strip. No external profile repository or backup source is prescribed.

`.profile/` is populated **by observation rather than by interview**, which is the point [`templates/layout/README.md`](../templates/layout/README.md) argues at length: an installer checking whether a step is done is already probing the machine, and that probing *is* the data collection. Preferences are the one thing that cannot be observed and are asked once.

**`status` on a store row is load-bearing.** A row describes an arrangement, not permission to copy local context between machines or repositories. The `workbench` row is intentionally local environment state: its value is the current runtime location and initialization rule, not a backup plan.

**The `workbench` state root is organization-scoped**, at `__WORKBENCH__/<org>/`, because the runtime readers need a stable local path. That path does not make its contents portable, shared, or version-controlled; decisions that must outlive the local environment belong in reviewed tracked documentation under the authority that owns them.

### `adw_output`

Three levels, decided by what the workflow's subject spans rather than by which project prompted it. **The member dependency headers are what make the level decidable** -- a workflow reaching only inside one member is repo-level, one crossing a `SERVICE_DEPS` or `TOOLING_DEPS` edge is workgroup-level.

The workgroup row carries a caveat worth reading before placing anything: **a solution root is a plain folder holding repositories, not a repository itself**, so a library placed literally there is not version controlled. The live example is in the workgroup's documentation member for that reason. Record which member carries it; do not assume the bare root.

### `tooling`

Each row is **a consequence, not a name**. `breaks_without` is the field that does the work -- a list of names is a list someone skips, and a list of consequences is one they act on. Three fields beyond it matter:

- **`trap`** -- the failure this tool produces when installed slightly wrong, and specifically when that failure is *silent or misattributed*. The database client's trap presents as the local database misbehaving rather than as a port conflict; the search tool's trap is a shell function that makes `command -v` pass while the binary is absent. These are the rows that cost a day.
- **`version_reason`** -- why the pin exists. A pin with no reason gets bumped by the next person who sees a newer version available.
- **`tier`** -- `required`, `recommended`, `optional`, or `conditional`. A `conditional` row carries a `condition` saying when it applies; it is not a weaker `required`.

**`jq` is flagged as the most dangerous absence in the list**, and not because it is the most important tool. The hooks check for it and exit 0 without it -- they degrade to silence by design. Every other missing tool announces itself.

### `harness`

Keyed by **capability** (`trigger:session-opened`, `gate:autonomous-mode-policy`, `tool:browser-control`) rather than by product feature, so a row survives a change of harness -- the same decision [`templates/harness_manifest.md`](../templates/harness_manifest.md) is built on. `requirement` separates what the bench needs to function as designed (`required`) from one operator's discipline (`preference`), so an adopter can take the machinery without the opinions.

`manual: true` marks a step an installer **must not** automate, with the reason attached. Two exist: merging `settings.json` by hand, because blind JSON merging breaks a working bench, and placing the global instruction file, because the harness refuses agent writes to that path.

## Adding a value

1. **Decide the section.** If it does not fit one, that is a signal the section list is wrong, not that the value should be forced into the nearest fit.
2. **Write `scope` first, before the value.** Ask: *would a stranger adopting this want this exact value?* Yes is `default`. No is `instance`, and the value becomes a `__TOKEN__`.
3. **If there is no sensible value at all, set `ask: true`, leave the value `null`, and add a row to `unanswerable`** naming why no default is possible and where the real value comes from. This is a better answer than an invented default and should never be talked out of.
4. **Write the consequence, not the description.** `breaks_without` for a tool, `why` for everything else. A field whose `why` is "because we do it that way" is a field that will be deleted by someone who does not know why it is there.
5. **If the value is identifying** -- an organisation, a customer, a person, a host, an account -- it is a token in `tokens`, never a literal anywhere in this file. This package is public and a literal here is a leak.
6. **Run the [structural check](03_STRUCTURAL_CHECK.md).** It parses the file; a trailing comma fails there rather than at install time.

## What this file is not

**It is not a runtime configuration and nothing reads it yet.** No installer exists; the ordered procedure in `installer` is written against what [`templates/claude_home/install.sh`](../templates/claude_home/install.sh) already does plus the manual steps around it. Stating that plainly is the point -- a data file that looks like it is being consumed, and is not, is the kind of record that goes stale without anyone noticing it has.

It also does not replace the [harness manifest](../templates/harness_manifest.md). The manifest answers *what is running and what capability does each piece depend on* -- the input to a **port**. This file answers *what should be placed and where* -- the input to an **install**. The two are complements and are easy to mistake for each other.
