# ⚙️ `defaults/` -- the answers layer

**What a sensible value *is*, and why.** Not the shape of a thing, and not one person's copy of it: the answer somebody arriving with an empty machine would otherwise have to guess at, with the reason attached and a statement of what breaks without it.

Tooling that has to be installed, where the stores live, where workflow output goes, what an installer substitutes -- each one recorded once, marked as either *right for anyone* or *this operator's current answer*, and justified. A folder full of values with no justification is a folder of somebody's habits; the justification is the artifact.

## What is here

One file. Saying so plainly is the point -- a README describing a structure that does not exist yet is the first thing in a package to become false.

| | Holds |
|---|---|
| [`defaults.json`](defaults.json) | The parameterisation of a bench -- tokens, stores, local folders, ADW output levels, tooling, harness pieces, the ordered install, and the values that cannot be defaulted at all |
| [`../handbook/14_THE_DEFAULTS_FILE.md`](../handbook/14_THE_DEFAULTS_FILE.md) | Its schema doc: what every field means, what an installer does with each, and the procedure for adding a value. **Read it before extending the file** |

## 🧭 The four layers, and why they are not one thing

**This is the part to read.** Four things in this setup look interchangeable, and confusing any two of them produces either a template that leaks or a backup that cannot restore. They have been confused more than once, by people who had read all four READMEs.

| | Where | What it is | Correct when |
|---|---|---|---|
| 🔧 **The live bench** | `~/.claude/` | Real files with real values -- **what actually executes.** Deliberately not a git repository, so no clone, checkout or wipe can reach it. Nothing backs it up | it runs |
| 📋 **The filled form** | [`../config/`](../config/README.md) | The operator's real values, committed so they survive the machine, tokenised **only** where publication forces it. `restore.sh --check` verifies it against live, file by file | **none** of the personal values is a placeholder |
| 🧱 **The blank form** | [`../templates/claude_home/`](../templates/claude_home/README.md) | The same machinery with every personal value punched out, for anyone adopting it. `install.sh` fills it in | **every** personal value is a placeholder |
| 💡 **The answers** | `defaults/` (here) | What a sensible value is for each field, the reason, and what breaks without it. Feeds the other two | every entry carries a **justification** rather than a value someone guessed |

**The correctness conditions are the whole argument, because each one is exactly what makes that layer wrong in another's place.** Put the operator's values in the template and it is a leak that installs one engineer's habits on a stranger's machine. Put placeholders in `config/` and it is no longer a backup -- a restore that requires you to remember what the values were is not a restore. Merge `defaults/` into either and the reasons go with it, leaving values nobody can evaluate and nobody dares change. And the live bench is not a substitute for any of them: it is correct when it runs, which is a condition it satisfies just as well after somebody has broken the thing that made it reproducible.

### Which one you edit depends on what you are changing

| You are changing | Edit | Then |
|---|---|---|
| What a sensible value **is**, for anyone -- a new tool, a new store, a changed arrangement | `defaults/defaults.json` | write the `why` / `breaks_without` in the same edit; run the [structural check](../handbook/03_STRUCTURAL_CHECK.md) |
| **Your own** value, so a restore reproduces it | `../config/claude/...` | `./restore.sh --check` -- every row should read `SAME` |
| The shape **others** fill in | `../templates/claude_home/...` | grep the kit for your own username before committing |
| Something that has to work **right now** | `~/.claude/` directly | mirror it back into `config/` deliberately, by hand. See the warning below |

A change is often two edits, and that is normal rather than duplication: adding a tool means a row here saying what breaks without it, and a line in the kit that installs it. What is *not* normal is the same value living in two layers with no reason recorded in either.

### ⚠️ `config/` is a restore source, not a byte mirror

The tempting move -- copy the live bench over the committed one and call it a refresh -- has already destroyed the tokenisation once, and **the check does not catch it.** `restore.sh --check` substitutes the tokens into the committed copy *before* diffing, so a raw copy of live values reports `SAME` on every row. The repository is now publishing a username and an employer identifier, and the one instrument pointed at the problem says everything is fine.

So refreshing `config/` is a deliberate, per-file act: bring the change across, re-apply the four substitutions, re-read [`../config/EXCLUDED.md`](../config/EXCLUDED.md), and only then run the check. **A green check proves the backup matches live; it proves nothing about whether the backup is publishable.**

## The schema, at a level you can extend

The full field-by-field account is in [`../handbook/14_THE_DEFAULTS_FILE.md`](../handbook/14_THE_DEFAULTS_FILE.md). Three things are worth knowing before opening the file at all, because they are what an extension gets wrong.

**Every value carries a `scope`, and collapsing it is how the file stops being shareable.** `default` means the shipped value is sensible for anyone and a teammate inherits it unchanged. `instance` means it is this operator's current answer, tokenised, and a teammate replaces it. Marking a real default as `instance` costs somebody an unnecessary question; marking one operator's answer as `default` installs their opinions on a stranger's machine without either of them noticing.

**`ask: true` with a `null` value is an honest answer, not a gap.** Some values have no sensible default at all -- an employer's tracker, a canary phrase that must be unique per machine, or a local workgroup name. Recording `null` and making the installer ask a human is better than inventing something plausible, and every such value is listed once more in `unanswerable` with the reason and where the real value comes from. Nobody should be talked out of this.

**Write the consequence, not the description.** A tool row's load-bearing field is `breaks_without`, not its name -- a list of names is a list people skip, and a list of consequences is one they act on. The same rule gives every other entry a `why`. A field whose justification is "because we do it that way" is a field the next person deletes, correctly.

And one constraint that overrides all three: **this package is public.** Anything identifying -- an organisation, a customer, a person, a host, an account -- is a `__TOKEN__` declared in `tokens`, never a literal anywhere in this folder.

## What belongs here, and what does not

| Belongs | Does not |
|---|---|
| A value that is **right for anyone**, with the reason it is right | One person's real path, key or account -- that is [`../config/`](../config/README.md) |
| A value that is **this operator's answer**, tokenised and labelled `instance` | A file that gets copied and filled in -- that is [`../templates/`](../templates/README.md) |
| What **breaks without** a given tool, and the trap it sets when installed slightly wrong | A rule that would be true with agents removed -- that is [`../foundations/`](../foundations/README.md) |
| An arrangement that has been **decided**, marked with whether it has been built | An ordered procedure for doing a piece of work -- that is [`../handbook/`](../handbook/README.md) |
| A value with **no sensible default**, recorded as `ask` with the reason | Anything read at runtime. Nothing here executes, and nothing consumes it yet |

**`status` on an entry is load-bearing.** Several rows in `defaults.json` say `decided, not yet built` -- the arrangement is agreed and the directories do not exist. Reading one of those as a description of the machine is the specific mistake the field exists to prevent. The `workbench` store row is the sharp case: it is **partially** built, so its status names which half is which.

**One store is not a layer, and the distinction matters here.** The **workbench home** (`__WORKBENCH__`, `~/.workbench` by default) is the environment-owned local state root for `.memory/` and `.workgroup/`. It is not a fifth row in the table above, because the four layers are four *forms of the same harness configuration* and this is a different axis entirely: **local state.** This package is public; the workbench home is deliberately absent from it, has no prescribed backup destination, and is initialized only from sanitized templates. `defaults.json` carries the runtime arrangement in `stores`.

## Room to grow

It is one file today. These would earn a place, and none of them has yet:

- **A second bench's answers**, if a value turns out to differ by harness rather than by person. That is the point `defaults.json` stops being one document and the folder starts carrying a file per harness.
- **An installer that actually reads this.** The `installer` section is currently an ordered procedure written against what [`../templates/claude_home/install.sh`](../templates/claude_home/README.md) already does plus the manual steps around it. When something consumes the file, the consumer's contract belongs here beside it.
- **A machine probe** -- the script that answers "is this tool present, at the pinned version, and not shadowed by a shell function". The `trap` fields describe exactly what such a probe would have to test, which is most of the work of writing one.
- **Resolved discrepancies.** The file records at least one place where two sources disagree about the same tool. When one is settled, the settled answer is a default; the record of the disagreement is not, and goes to the runbook it came from.

**What would not earn a place** is a folder structure invented ahead of a second file. This README describes one file because there is one file.
