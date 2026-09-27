# 🏠 `claude_home/` -- reproduce a bench on a new machine

A copy-and-fill kit mirroring a harness configuration directory. **Copy it in, substitute the placeholders, run the verification, and the bench behaves as it did on the machine it came from.**

## This kit and the manifest answer different questions

They are complements and are easy to mistake for each other.

| Document | Answers | Used when |
|---|---|---|
| [`../harness_manifest.md`](../harness_manifest.md) | **What is running, and what capability does each piece depend on?** | Moving a bench to a **different harness**. Every row keys to a capability that [`harnesses/equivalents.md`](../../harnesses/equivalents.md) can look up |
| **This kit** | **How do I reproduce it?** | Moving a bench to a **different machine**, same harness |

**And a third thing, which is neither.** [`../../config/`](../../config/README.md) is this package maintainer's *own* bench, committed with its real values so it can be restored verbatim on a new machine. Same machinery, **opposite correctness condition**: this kit is right when every personal value is a placeholder, `config/` is right when every one of them is the real thing. If you are here to set up **your** bench, you are in the right file — `config/` would only install someone else's habits.

**And a fourth, which is where the values come from.** [`../../defaults/`](../../defaults/README.md) records what a sensible value *is* for each placeholder here -- the reason it is sensible, and what breaks without it -- so this kit can stay a shape and the answers can be argued about somewhere else. 🧭 [**The four layers**](../../defaults/README.md) is the one-screen version: the live bench, `config/`, this kit, and the answers, and which one a given change belongs in.

The manifest is the port plan; the kit is the install. **Fill in a manifest for your bench as well** -- the kit reproduces what is in this directory, and the manifest is where the rest of the bench gets recorded: the plugins, the external tools, the linked skills, the account-level integrations. A kit without a manifest reproduces the files and quietly loses everything that was configured somewhere else.

## What is in here

| Path | Status | Notes |
|---|---|---|
| `hooks/` | **ships** | Four scripts, the trigger patterns, and their README. The machinery |
| `CRITICAL_RULES.md` | **ships** | The rules injected unconditionally every session. Edit the content; keep the mechanism |
| `settings.hooks.json` | **ships** | The `hooks` key only, to merge into an existing settings file |
| `settings.example.json` | **ships** | A complete minimal settings file, for a bench with none |
| `settings.local.json` | **ships** | Empty personal-override scaffold |
| `SHORTCUTS.md` | **stub** | The file's contract, not one operator's vocabulary. Replace the body |
| `skills/` | **seed** | Authored skills that exist nowhere else. Live copies remain canonical |
| `install.sh` | **ships** | Does the copy, the substitution, and the executable bits |
| the global instruction file | **elsewhere** | [`../TEMPLATE_CLAUDE.md`](../TEMPLATE_CLAUDE.md) -- deliberately not duplicated here |

**The global instruction file is not in this directory on purpose.** It has its own template one level up, and two copies of the same file in the same repository is exactly the drift this package refuses elsewhere. The kit's job is to say *where it goes and how to verify it loaded*; the template's job is to say what is in it.

## Placeholders

Every one of these is substituted by `install.sh`. Substituting by hand is fine; **leaving one unsubstituted is the failure to watch for**, because a script with an unsubstituted path still runs, still exits 0, and simply points the model at a directory that does not exist.

| Placeholder | Means | Example shape |
|---|---|---|
| `__HOME__` | Absolute home directory. Used only in JSON, because hook command strings are not guaranteed to undergo shell expansion | `/home/you` |
| `__STATE_ROOT__` | Absolute path to the local root holding `.memory/` and `.workgroup/`. **Not** `.profile/` — no script in this kit reads it; `.profile/` is the package-root local overlay | `/home/you/.workbench/acme` |
| `__SOLUTION__` | Name of the multi-repo grouping whose topology map the boot instruction points at | `acme` |
| `__MODEL__` | Default model identifier | as your harness spells it |
| `__MARKETPLACE_NAME__` / `__MARKETPLACE_REPO__` / `__PLUGIN_NAME__` | Plugin source and the bundle enabled from it | an org's plugin repository |

**Two placeholder spellings exist in this package and they are not interchangeable.** This kit uses `__NAME__` because its files are shell scripts and JSON, where an angle bracket is either syntax or a redirect. [`../TEMPLATE_CLAUDE.md`](../TEMPLATE_CLAUDE.md) uses `<NAME>` because its file is prose. **They carry the same values** -- `__STATE_ROOT__` and `<STATE_ROOT>` are one setting -- so fill them in together, and do not run one file's substitution command over the other's files.

There is one more, and it is not in any file: **a canary phrase.** Put a short, distinctive string somewhere in the global instruction file that appears nowhere else on the machine. It is the load check in step 5, and it works because a model that produces it has demonstrably read the file rather than inferred what it probably said.

## Required, versus this operator's preference

Someone adopting this should be able to take the machinery without the opinions.

**Required for the bench to function as designed:**

- `hooks/guard_claude_md.sh` and the `SessionStart` wiring. This is what makes the critical rules independent of any file being found, and what converts a dangling link from a silent absence into a first-message warning.
- `CRITICAL_RULES.md` existing at all. Its *contents* are personal; the mechanism of having a small always-injected set is not.
- The `hooks` key in `settings.json`. Nothing fires without it.
- `jq`, or the scripts that need it degrade to silence.

**Preference, and safe to drop:**

- `boot_memory.sh` and the whole state-store read order. This assumes `.memory/` and `.workgroup/` sit together under one root. Drop it, or repoint `__STATE_ROOT__`.
- The two reconciliation-sweep hooks and `stopping_phrases.txt`. They mechanize one operator's discipline; the *pattern* is general, the sweep being reconciled is not.
- `SHORTCUTS.md` contents, the model choice, the plugin, and every skill.

## Install -- the ordered procedure

```sh
# 1. Read the global instruction template before installing it. It is the one file
#    that changes how every session behaves, and the one nobody should adopt blind.
$EDITOR templates/TEMPLATE_CLAUDE.md

# 2. Back up whatever is already there. There is usually no version control here.
cp -a ~/.claude ~/.claude.bak.$(date +%Y%m%d) 2>/dev/null || true

# 3. Install the kit. STATE_ROOT is required; SOLUTION defaults to "solution".
STATE_ROOT=/abs/path/to/local-state-root SOLUTION=acme ./install.sh

# 4. Merge the hooks wiring into settings.json by hand. If there is no settings.json,
#    start from settings.example.json instead. Blind JSON merging breaks working benches.
sed "s#__HOME__#$HOME#g" settings.hooks.json
```

Then, by hand and in this order:

5. **Put the global instruction file in place**, from `../TEMPLATE_CLAUDE.md`, with your canary phrase in it.
6. **Recreate the symlinks** -- see the next section. A copied symlink is a dangling symlink, so none of them are in this kit.
7. **Reinstall plugins and external tool integrations** through the harness's own commands, not by copying its cache directory. A copied cache carries a resolved version and a recorded install path that are both wrong on the new machine.
8. **Verify.** Next section but one.

## Symlinks -- instructions, never artifacts

**A symlink cannot be copy-pasted.** Copying the directory produces a link with the same target string on a machine where that target does not exist, and a broken link reads as *absent* rather than as an error -- so the thing it pointed at is simply, silently, not there.

For each link the bench needs, record three things and put them here: **what it points at, why it is a link rather than a copy, and the command to recreate it.**

| Link | Points at | Why a link | Recreate |
|---|---|---|---|
| `skills/<name>` | a skill inside a separate repository you also clone | the repository is the canonical source and updates independently | `ln -s /abs/path/to/repo/skills/<name> ~/.claude/skills/<name>` |
| `skills/<name>` | an installer-managed skill store elsewhere in the home directory | an installer owns it and tracks a content hash | reinstall through the installer; **do not link by hand** |
| `<name>` | a working directory in another repository | convenience alias | recreate only if that repository still exists |

**Add every link you create to `WATCHED_LINKS` in `guard_claude_md.sh` at the moment you create it.** That is what turns the next dangle into a first-message warning instead of a mystery, and the moment of creation is the only moment you reliably remember.

## What was excluded, and why

Stated explicitly, because **an unexplained absence reads as an oversight** and the next person re-adds it.

| Excluded | Why |
|---|---|
| Session transcripts, project directories, prompt history | Runtime record of work done. Large, machine-specific, and the single most sensitive thing in the directory |
| Caches of every kind -- plugin, image, paste, page, shell snapshots | Regenerated on demand. A copied cache is a stale cache with a wrong path inside it |
| Daemon state, locks, logs, status files, job and task directories | Process state belonging to a process that is not running |
| Account and subscription files -- auth status, policy limits, remote settings, integration auth caches | Provisioned by an account, not by a file. They do not transfer and would be a credential leak if they did |
| `hooks/state/` contents | Debounce timestamps. The directory is created empty; its contents are meaningless elsewhere |
| Plugin install cache and marketplace checkouts | Reinstall through the harness. The install record names an absolute path and a resolved version |
| Backup and staging files (`*.bak`, `*.proposed`) | Artifacts of one machine's edit history |
| Operating-system metadata files | Noise |
| **External tool integrations** | Where these are provisioned by an account rather than a local config file, **there is nothing on disk to copy.** Record them in the manifest and re-authorise them by hand. This is the exclusion most likely to be mistaken for completeness |

**Nothing in this kit contains a credential, a token, a hostname, or an organisation-internal identifier.** That is a property to re-check, not to assume, whenever a file is added: grep the kit for your own username and for your employer's name before committing it.

## Verify -- an unverified bench is not an installed one

A bench that looks installed and is not is worse than one that obviously failed, because the failures here are silent by construction: a missing instruction file reads as *no preferences*, a mis-shaped hook output is discarded without a message, and an unsubstituted path is a valid string.

Run all of these in a **fresh session**, not the one you installed from.

```sh
# A. No placeholder survived.
grep -rn "__[A-Z_]*__" ~/.claude/hooks ~/.claude/*.md ~/.claude/settings.json && echo "FAIL" || echo "ok"

# B. The scripts are executable and run standalone.
echo '{"tool_input":{"command":"git commit -m x"}}' | ~/.claude/hooks/cleanup_on_git.sh   # expect JSON
echo '{"prompt":"closing up shop"}' | ~/.claude/hooks/cleanup_on_stop_phrase.sh           # expect the sweep
~/.claude/hooks/guard_claude_md.sh </dev/null                                             # expect the critical rules
~/.claude/hooks/boot_memory.sh </dev/null                                                 # expect the read order
rm -f ~/.claude/hooks/state/last_cleanup_reminder                                         # clear the debounce

# C. Every path the scripts emit actually exists.
~/.claude/hooks/boot_memory.sh </dev/null | grep -o '/[^ ]*\.md' | sort -u | while read -r p; do
  [ -e "$p" ] && echo "ok   $p" || echo "MISSING $p"
done
```

Then, in the fresh session itself:

| Check | Ask | Pass looks like |
|---|---|---|
| Instruction file loaded | "what is the canary phrase?" | it answers with your phrase. Anything else means the file was not read, whatever it looks like on disk |
| Critical rules injected | "what are the critical rules?" | the injected list, not a paraphrase of general good practice |
| Hooks registered | `/hooks` | all four, on the events the table in `hooks/README.md` names |
| Completion trigger | make any commit | the sweep instruction arrives **without being asked** |
| Stopping trigger | type a phrase from `stopping_phrases.txt` | the stopping-point sweep arrives |
| Dangle guard | temporarily point a watched link at a nonexistent path and start a session | the first message names the broken link |

**The last one is the check people skip and the one that proves the most**, because it is the only check that exercises the machinery whose entire job is to report a silent failure. A guard nobody has ever seen fire is a guard nobody knows is wired up.
