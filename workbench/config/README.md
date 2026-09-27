# ⚙️ `config/` — this operator's actual bench, backed up

**One person's real harness configuration, committed so it survives the machine.** Not a starting point, not an example. The values here are the values that were running on 2026-09-16, and the restore path puts them back exactly.

> **If you are not that operator, you want [`templates/claude_home/`](../templates/claude_home/README.md) instead.** That is the parameterised kit: the same machinery with every personal value punched out, designed for a stranger to fill in. This folder is the opposite — filled in, for one bench, and useless to anyone else.

## The two folders, and why they are not one

They have **opposite correctness conditions**, which is the whole argument.

| | `templates/claude_home/` | `config/` (here) |
|---|---|---|
| Audience | anyone adopting the machinery | one operator, on a new machine |
| Correct when | every personal value is a placeholder | every personal value is the real one |
| `SHORTCUTS.md` is | a stub explaining the contract | the actual vocabulary, all twelve entries |
| `CRITICAL_RULES.md` is | parameterised on the state root | the real path, hardcoded |
| Failure if wrong | an adopter inherits someone else's habits | a restore is not a restore |

**There are four of these, not two, and the other two are the ones people forget.** The live bench at `~/.claude/` is what actually executes -- deliberately not a git repository, and nothing backs it up except this folder. [`../defaults/`](../defaults/README.md) is the answers layer: what a sensible value *is* for each field, with the reason, feeding both the template and this backup. 🧭 [**The four layers**](../defaults/README.md) sets all of them out side by side, with the correctness condition that makes each one wrong in the others' place, and which one you edit for a given change. **Read it before deciding a value belongs here.**

Merging them forces a choice between the template carrying his values — which makes it a leak and a bad template — and the backup carrying placeholders, which makes it not a backup. **A restore that requires you to remember what the values were is not a restore.** Two folders, cross-referenced, is the only arrangement where both are right.

## What is here

```
config/
  README.md          this file -- the boundary and the argument for it
  EXCLUDED.md        every item deliberately NOT committed, and where the real value comes from
  RESTORE.md         the ordered procedure, ending in verification
  restore.sh         materialises claude/ into ~/.claude/; --check diffs it against live
  claude/
    CRITICAL_RULES.md        verbatim -- injected into every session by a SessionStart hook
    SHORTCUTS.md             the real personal vocabulary (two tokens; see below)
    settings.safe.json       the PUBLISHABLE SUBSET of settings.json -- incomplete on purpose
    settings.local.json      verbatim
    hooks/                   four scripts + their README + stopping_phrases.txt
    skills/
      ui-verify-manually/    locally authored; existed in exactly one unversioned directory
      aidd-typescript/       locally authored to fill a gap in a third-party set; same reason
```

## The public-repository constraint, which shapes everything above

**`agentic-engineering` is public.** A gitignored backup is not a backup — it does not clone, so it does not survive the machine it is on, which is the one thing a backup is for. So the boundary had to be drawn *inside* the config rather than around it: commit what is safe, quarantine what is not, and make the line explicit.

[`EXCLUDED.md`](EXCLUDED.md) is that line written down. It is not an appendix — **read it before trusting a bench restored from here.** The single largest excluded item is `autoMode.environment`, the policy telling autonomous mode which branches, paths and infrastructure scopes are dangerous. Its absence is silent.

## Why exactly four tokens

Everything here is **verbatim from the live bench except four substitutions, and every one of them is forced by publication rather than by portability.** That distinction is the design rule for this folder: a value that is merely machine-specific still gets committed as-is, because it is the value being backed up.

| Token | Replaces | Forced by |
|---|---|---|
| `__HOME__` | `/Users/<username>` in `settings.safe.json`, `hooks/README.md`, `ui-verify-manually/SKILL.md` | a username in a public repo, and wrong on any other account or OS |
| `__SOLUTION__` | the employer's name in `boot_memory.sh`'s topology-map pointer | employer identifier |
| `__WORK_ROOT__` | the employer solution root in `SHORTCUTS.md` | employer identifier |
| `__STACK_BOOT_CMD__` | the employer's internal stack-boot tool in `SHORTCUTS.md` | internal tool name |

`__NAME__` spelling matches `templates/claude_home/`, and for the same reason: angle brackets are shell and JSON syntax, so `<NAME>` inside a script or a JSON string is a parse hazard rather than a placeholder. `templates/TEMPLATE_CLAUDE.md` uses `<NAME>` because it is pure prose, and the mapping between the two conventions is in the kit README.

### The path question, decided

`CRITICAL_RULES.md` and the hook scripts name the state root as `$HOME/.workbench/__SOLUTION__` — **hardcoded, not tokenised**, unlike the kit's `__STATE_ROOT__`. That root covers `.memory/` and `.workgroup/` only; `.profile/` remains a local private overlay in the package-root `.profile/` directory and is named separately wherever it is needed.

That is deliberate and it is the difference between the two folders in miniature. The path carries no username (it is `$HOME`-relative already), names no employer, and reveals nothing; it is simply *where this operator's state lives*, and it is the thing the backup exists to remember. Tokenising it would produce a second copy of the template and no backup at all.

The corollary is a free integrity check that the kit cannot offer: with the three environment tokens set, `./restore.sh --check` must report `SAME` for every file. Any `DIFFERS` line is drift between the live bench and its backup, which is exactly what a backup silently accumulates and never reports on its own.

## Keeping it honest

**This folder is a snapshot, and a snapshot rots.** Refresh it deliberately — after changing a hook, adding a shortcut, or editing the critical rules — by re-running the capture and re-reading `EXCLUDED.md` against the live `settings.json`. `./restore.sh --check` tells you when it is due.
