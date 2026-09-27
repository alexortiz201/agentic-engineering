# 🔁 Restoring the bench on a new machine

From a fresh `~/.claude/` to a working bench. Read [`EXCLUDED.md`](EXCLUDED.md) first — it names what this procedure **cannot** give you, and one of those items changes how safe the result is.

**Every failure mode in this procedure is silent.** A dangling skill reads as absent. A missing global instruction file produces no error, just an agent behaving like a default one. A hook with an unsubstituted path exits 0 and does nothing. That is why the last section is not optional: **an unverified bench is not a restored one.**

## Before you start

| Need | Why |
|---|---|
| `jq` on `PATH` | every hook that parses its payload needs it, and each one degrades to *silently doing nothing* without it — the quietest failure here |
| the harness installed, having run once | so `~/.claude/` exists with its own files before this writes into it |
| this repository cloned | the templates and configuration it holds are the public contract; local state is initialized separately |
| the three token values (below) | `restore.sh` refuses to run without them, on purpose |

The three values, which live nowhere in this repository:

```sh
export WORK_ROOT='~/<employer-solution-root>'  # QUOTED -- it lands in prose, not in a command
export SOLUTION=<name-of-that-grouping>        # used in .workgroup/<SOLUTION>/MAP.md
export STACK_BOOT_CMD='<cmd> --headless'       # the one command that boots the local stack
```

`WORK_ROOT` is quoted on purpose: it is substituted into a sentence in `SHORTCUTS.md`, so it should read as `~/acme` and not as an expanded absolute path. Getting this wrong is harmless but makes verification check 6 report a spurious `DIFFERS`.

## The procedure

### 1. Restore the state folders first

A fresh clone contains **none** of the three local overlays/state directories. `.profile/` is local to the package root. `.memory/` and `.workgroup/` belong to the workbench-home state root at `~/.workbench/__SOLUTION__/`, which the hooks read directly.

```sh
# Initialize this environment only; do not copy another environment's local state.
cp -R templates/layout/.profile .
mkdir -p ~/.workbench/__SOLUTION__
cp -R templates/layout/.memory templates/layout/.workgroup ~/.workbench/__SOLUTION__/
```

Those are sanitized defaults, not a restore of personal, employer, repository, or machine context. If context must be recovered, use only the owning environment's approved process; this public package and personal dotfiles are not fallback backup locations.

### 2. Run the restore

```sh
cd config
./restore.sh          # add --force only if you mean to overwrite an existing bench
```

Writes `CRITICAL_RULES.md`, `SHORTCUTS.md`, `settings.local.json`, `hooks/` (executable) and the two locally-authored skills. Backs up anything it replaces. It does **not** touch `settings.json` or `CLAUDE.md` — the next two steps are manual because merging JSON blind breaks working benches, and because the harness refuses agent writes to `CLAUDE.md`.

### 3. Merge `settings.json` by hand

```sh
sed "s#__HOME__#$HOME#g" config/claude/settings.safe.json
```

On a **fresh** bench with no `settings.json`, that output is a complete file — write it and fill `__MARKETPLACE_NAME__` / `__MARKETPLACE_REPO__`. On an **existing** bench, merge the `hooks` key into what is already there.

Then restore what `settings.safe.json` does not carry, from [`EXCLUDED.md`](EXCLUDED.md): `autoMode.environment` and the second `soft_deny` entry. **Do this before running anything unattended**, not after.

### 4. Install the global instruction file

```sh
cp templates/TEMPLATE_CLAUDE.md ~/.claude/CLAUDE.md
```

Then fill its seven tokens — the table at the top of that file lists them, with a `sed` line for the two longest. Three of them (`<WORK_ROOT>`, `<EMPLOYER>`, `<STACK_BOOT_CMD>`) are the employer values this repository deliberately does not record.

### 5. Re-create the symlinked skills

Copying them is not an option: a copied symlink is a dangling symlink, and a dangling skill directory reads as *absent*. Re-clone the upstream rule library and the agent-skill store, then link each one into `~/.claude/skills/`. `EXCLUDED.md` lists which are links and which two are real directories already restored in step 2.

---

## Verification

Run all six. Each targets one silent failure.

**1. The hooks fire, and emit the right shape.**

```sh
echo '{"hook_event_name":"SessionStart","source":"startup"}' | ~/.claude/hooks/guard_claude_md.sh
echo '{"hook_event_name":"SessionStart","source":"startup"}' | ~/.claude/hooks/boot_memory.sh
echo '{"hook_event_name":"PostToolUse","tool_name":"Bash","tool_input":{"command":"git commit -m x"}}' | ~/.claude/hooks/cleanup_on_git.sh
echo '{"hook_event_name":"UserPromptSubmit","prompt":"end of the day"}' | ~/.claude/hooks/cleanup_on_stop_phrase.sh
```

- PASS: the first two print text, the third prints **JSON** with `additionalContext` nested under `hookSpecificOutput`, the fourth prints the stopping-point sweep.
- The third printing plain text is the specific bug worth catching: plain stdout from `PostToolUse` is never added to the model's context, so the hook appears to work and silently does nothing.

**2. No token survived substitution.**

```sh
rg -n '__HOME__|__SOLUTION__|__WORK_ROOT__|__STACK_BOOT_CMD__|__STATE_ROOT__' ~/.claude/
```

- PASS: no output. An unsubstituted script runs, exits 0, and emits a path that does not exist.

**3. Every path the hooks name actually exists.**

```sh
echo '{"hook_event_name":"SessionStart","source":"startup"}' | ~/.claude/hooks/boot_memory.sh \
  | rg -o '/[^ ]*/\.(memory|profile|workgroup)[^ ]*' | sort -u | while read -r p; do
      [ -e "${p%%<*}" ] && echo "OK      $p" || echo "MISSING $p"
    done
```

- PASS: no `MISSING`. This is what step 1 of the procedure is for — the hook cannot tell you a state folder is absent, it just names it and exits 0.
- `.workgroup/<repo>/README.md` is a pattern rather than a path; the check tests the directory above it.

**4. The global instruction file loads.** Start a **fresh** session and ask: *"what is the canary phrase?"*

- PASS: it answers with the canary from your `CLAUDE.md`.
- FAIL means the file is missing, empty or unreadable — and the only symptom otherwise is an agent quietly behaving like a default one.

**5. The critical rules are actually injected.** In that same fresh session, ask: *"what does CRITICAL_RULES say about attribution trailers?"*

- PASS: it answers without reading a file. This is distinct from check 4 — the hook injects these whether or not `CLAUDE.md` was found, which is the entire reason they live in a hook.

**6. The backup matches the bench.**

```sh
cd config && ./restore.sh --check
```

- PASS: `SAME` on every line. A `DIFFERS` is drift between the live bench and this snapshot; a `MISSING` is a step that did not happen.

---

## What you are left with, honestly

**Functionally complete; not safety-equivalent.** Hooks fire, rules inject, shortcuts resolve, both locally-authored skills load.

**What is still missing** is `autoMode.environment` — the policy naming the protected branches, the sensitive file paths and the protected infrastructure scopes. It is not reconstructible from memory, and its absence does not announce itself: autonomous mode does not report that it is running without an environment definition, it simply treats a protected branch like any other. Re-run the harness's auto-mode environment setup against the employer repository before working unattended.

**The fix for next time** is a **private** repository holding exactly that key, restored as step 3.5 above. Everything else in this procedure survives a public repository; that one item is the whole reason the boundary exists.
