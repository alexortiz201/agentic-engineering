# macOS developer tools — Air install-prompt diagnosis

**November 23, 2026 · P0 provisionally successful; normal-use observation pending.**
The operator accepted this P0 result as provisional. Air now selects its
installed standalone Command Line Tools (CLT). Apple's Git
and Python shims passed without an override, and no new installer request or
launch was observed in the sampled post-switch window. The original app/job
triggers remain unknown, so GUI popup resolution is not confirmed. Mini is the
working reference and was not changed.
Do not use this procedure to upgrade tools or change developer directories on
hosts that are working.

## Evidence and limits

- Before the switch, Air ran macOS 26.6.2 (25G83) and selected `/Applications/Xcode.app/Contents/Developer`,
  Xcode 27.2 (27B52), standalone CLT receipt 26.6.0.0.1781586589. Direct full
  Xcode `xcodebuild -version` succeeds, but its direct macOS SDK `-find git`
  **and** `-find python3` commands fail (exit 255). `libxcodebuildLoader.dylib`
  cannot load: CoreDevice references `_XPCTypeBool`, absent in the loaded
  Mercury framework. This reproduces the SDK lookup behind the reported
  `xcrun` failures without intentionally launching the install dialog. This is
  a specific loader failure, not proof of damaged Xcode app files or a verdict
  based on version numbers. No framework replacement or reinstall was attempted.
- A targeted Air unified-log sample found four `python3` installation requests.
  PID correlation identified shell parents (`zsh`/`bash`, also `sh` in an
  earlier chain); launchd spawned *Install Command Line Developer Tools* after
  the latest request. The log
  redacts the binary path and caller details. It does not establish the script
  or app that started the shell, nor whether the captured occurrences were
  earlier diagnostic commands or normal workflow. No Git installation request
  was identified in the same bounded log sample. The previously observed
  default Apple Git shim failure and the two SDK failures show a common
  failure path, **not** a common origin for both reported dialogs.
- Under temporary `DEVELOPER_DIR=/Library/Developer/CommandLineTools`, both
  direct CLT binaries and both absolute `/usr/bin` shims executed in a sparse
  environment from Air via Rex: Apple Git 2.50.1 opened the local Agentic
  Engineering checkout and resolved HEAD; Apple Python 3.9.6 imported `ssl`
  and `sqlite3` and ran an in-memory query. `xcrun` found both tools, reported
  the CLT macOS SDK, and ran Apple clang. The delegated Air agent independently
  confirmed direct and shim execution in sparse and inherited agent environments.
  These were pre-switch checks. A direct
  run with network and `/Volumes` reads denied (negative control passed) also
  passed local Git, Python, Homebrew Git/Python and the existing local Node/Pi
  version probes. This is local CLI execution evidence, not a GUI notification
  test or a new acceptance run of Pi migrations.
- Mini selects `/Library/Developer/CommandLineTools` (CLT 27.0); sparse Apple
  Git 2.54.0 and Apple Python 3.9.6 executed successfully, including a Git
  worktree check and Python `ssl` import. No Mini symptom was reported.

## Ownership and shell resolution (P0 scope)

| Family | Observed behavior | Keep |
|---|---|---|
| Apple SDK/CLT | Air's default now resolves and runs CLT. Full Xcode's SDK loader failure was diagnosed separately. Mini's global CLT works. | Apple owns these tools. Select the default per machine, not in shell startup, the setup wizard, or SMB. Preserve full Xcode for Apple-platform workflows. |
| Git/Python | Both fresh login shells resolve Homebrew Git 2.56.1 and Homebrew Python 3.15.2 in `/opt/homebrew/bin`; Air's Rex-launched noninteractive Zsh with inherited PATH also found Brew Git/Python. Apple shims are a separate fallback for sparse PATH or absolute callers. | Keep Homebrew Git under the existing manifest. Use Homebrew Python for regular work and project-specific pins/virtual environments where required; don't use Apple's Python as a project pin. Leave `/usr/local` alternatives untouched until actual callers and ownership are established. |
| Node / Pi | Login shells use local `~/.n/bin/node` (Mini 24.15.0, Air 24.16.0); a stripped/noninteractive Air shell need not have `node` on PATH. Air's native Pi version probe (1.6.0) used its local Node explicitly. | Keep local runtime management and native Pi; use explicit dependencies in any future noninteractive caller. No relinks, broad PATH changes, or P1 cleanup. |

[Provisioning ownership](OWNERSHIP.md) and the existing
[Homebrew manifests](computer/manifests/brew/) remain authoritative. No toolkit
manifest, version manager, startup file, or installed package was changed.
A bounded scan of Air's local checkout found no
full-Xcode requirement in the tested setup/harness. Selected LaunchAgent/Daemon
program fields did not identify a direct shim caller. Neither scan proves the
absence of host-wide dependencies.

## Air-only change and post-switch verification

The operator ran `sudo /usr/bin/xcode-select --switch /Library/Developer/CommandLineTools`
on Air. The matching sudo command record established the start of the observed
post-switch window. `xcode-select -p` with `DEVELOPER_DIR` unset confirmed the switch. The agent did
not need sudo or change the selector a second time.

- **Sparse noninteractive and Rex:** Mini and the delegated Air agent ran
  the absolute `/usr/bin/git` and `/usr/bin/python3` shims with no override.
  `xcrun --find` located both under standalone CLT. Apple Git 2.50.1 opened
  the physically local checkout and resolved HEAD. Apple Python 3.9.6 ran
  isolated stdlib probes, including a SHA-256 hash and an in-memory SQLite query.
  A fresh interactive login shell still executed Homebrew Git 2.56.1 and
  Python 3.15.2. The worker's separate sparse, sandboxed **noninteractive**
  login lookup found `/usr/local/bin` alternatives and recorded sandbox
  denials. That lookup is not evidence of normal interactive resolution or
  a popup trigger; it is not a reason to change PATH under P0. Repeating local
  Git and Python under a sandbox without network or `/Volumes` access passed
  with the global default, not an override.
- **Retested failure path, not an identified app:** the prior sparse/shell
  Apple shim paths were rerun. No normal app, script, or scheduled job could
  be attributed to the earlier Python dialogs; no Git dialog caller was found.
  No unknown app or service was restarted just to provoke a prompt.
- **Installer logs:** a bounded window from the switch-command record through
  the shim tests found **0 new install requests and 0 installer launches**.
  The Air agent independently confirmed zero through roughly 11½ minutes after
  the switch command. This is scoped log evidence, not direct GUI observation
  or a replay of both original workflows.
- **Full Xcode preserved:** explicit full-Xcode `xcodebuild -version` still
  returned Xcode 27.2 (27B52). No tool, framework, or package was reinstalled.
  The separate full-Xcode SDK lookup defect was not repaired or re-tested.

If the problem recurs, a no-override verification of the global default can
be run from the root of the physically local Agentic Engineering checkout:

```sh
/usr/bin/env -i HOME="$HOME" PATH=/usr/bin:/bin:/usr/sbin:/sbin \
  GIT_OPTIONAL_LOCKS=0 /bin/sh -ec '
    /usr/bin/xcrun --find git
    /usr/bin/xcrun --find python3
    /usr/bin/git --version
    /usr/bin/git rev-parse --is-inside-work-tree
    /usr/bin/python3 -IB -c "import ssl, sqlite3; print(sqlite3.connect(\":memory:\").execute(\"select 1\").fetchone()[0])"
  '
```

Expect both `xcrun` paths under CLT and all commands to succeed. Do not pursue
further repairs or caller attribution unless a popup returns. On recurrence,
cancel rather than install. Record the timestamp (with timezone), exact tool
name, and preceding app/action. Query a small window around the event before
changing anything; keep raw log lines private and report only the relevant
installer event, requester and parent evidence:

```sh
# Replace with the start of the recurrence window, in Air local time.
start='YYYY-MM-DD HH:MM:SS'
/usr/bin/log show --start "$start" --style compact \
  --predicate 'subsystem == "com.apple.dt.CommandLineTools.installondemand" AND eventMessage CONTAINS "installation request"'
```

**Rollback** (only if the CLT default causes a regression; restores the previous
full-Xcode selection and can reintroduce the diagnosed failure):

```sh
sudo /usr/bin/xcode-select --switch /Applications/Xcode.app/Contents/Developer
/usr/bin/env -u DEVELOPER_DIR /usr/bin/xcode-select -p
```

The switch does not uninstall Xcode. Launch Xcode normally for GUI workflows;
for explicit Xcode selection in one process:

```sh
env DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer /usr/bin/xcodebuild -version
```

The version check working does not repair the SDK loader. Separate diagnosis is required if full-Xcode SDK work is needed;
never copy over Apple frameworks or remove working CLT as part of this fix.

## P1: keep the intended manager in each execution context

Final verification snapshot (versions are observations, not provisioning pins):

| Tool | Mini fresh interactive login | Air normal login (operator-verified) |
|---|---|---|
| Homebrew | `/opt/homebrew/bin/brew` · 7.0.16 | `/opt/homebrew/bin/brew` · 7.0.16 |
| Git | `/opt/homebrew/bin/git` · 2.56.1 | `/opt/homebrew/bin/git` · 2.56.1 |
| Python | `/opt/homebrew/bin/python3` · 3.15.2 | `/opt/homebrew/bin/python3` · 3.15.2 |
| Node / npm | `~/.n/bin` · 24.15.0 / 12.0.1 | `~/.n/bin` · 24.16.0 / 12.2.2 |
| Claude Code | `~/.n/bin/claude` · 2.1.329 | `~/.n/bin/claude` · 2.1.325 |
| Pi | `~/.local/bin/pi` · 1.6.0 | `~/.local/bin/pi` · 1.6.0 |

The Air operator confirmed all seven tools in a normal login and confirmed
that the developer directory still selects standalone CLT. The existing Air
Rex agent matched the versions and selections above, except that it invokes
Pi's managed `~/.pi/agent/bin/pi` shim directly. Before the operator's login,
the Air agent reviewed the startup files and identifiable imports without
sourcing them: PATH initialization, local completion/cache and history effects,
prompt/session hooks, and dynamic imports. Static review did not establish that
network/update references run at login; no credential-related include was
followed. To reproduce the version probe from a normal terminal, run it from
the local checkout's `cli/` directory:

```zsh
printf 'login=%s interactive=%s\n' "$options[login]" "$options[interactive]"
for tool in brew git python3 node npm claude pi; do
  bin=$(whence -p -- "$tool") || { printf '%s: missing\n' "$tool"; continue; }
  printf '%s: %s\n' "$tool" "${bin/#$HOME/~}"
  HOMEBREW_NO_AUTO_UPDATE=1 HOMEBREW_NO_ANALYTICS=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false DISABLE_AUTOUPDATER=1 DISABLE_TELEMETRY=1 \
    "$bin" --version
done
```

A Rex `--shell=none` child intentionally skips startup: on Air it found system
Git/Python, but no Brew, Node/npm, Claude or Pi. This is not the active agent's
PATH or evidence of Intel/old Node selection. A no-shell child with the explicit
PATH below used native Brew/Git/Python and the selected local Node/npm, Claude
and Pi. The npm version check succeeded from the local `cli/` directory with its
normal npm config; forcing both config scopes to one test path was rejected by
npm and is not part of the supported procedure. No inspected supported caller
required remediation.

- Native `/opt/homebrew/bin` is the default for Homebrew, Git and Python on the
  two Apple Silicon Macs. Air also has an Intel-prefix Homebrew under
  `/usr/local`, with older Git and Python; a sparse, sandboxed noninteractive
  login resolved those instead of the native tools. This is a PATH risk, not
  evidence that an active job is broken. Keep the alternate prefix until a
  scoped caller/dependency review justifies removal; do not treat it as a
  fallback for canonical provisioning.
- Use the selected local Node/npm pair (`n` on these hosts) for setup. The
  CLI requires Node ≥22.19, and the checkout-local bootstrap fallback is not a
  second global manager. Mini's sparse login can find an older standalone
  Node 22.15.0 instead of the preferred Node. Air's selected `n` and Brew's
  alternate `n` are both present, but no inspected supported caller required
  the second manager entry. Use the selected pair; do not overwrite binaries,
  change login files, or remove alternatives based on the inventory alone.
- For setup jobs that do not inherit the intended login environment, choose
  the intended tool paths **in the job**, not globally. For these hosts, from
  a local checkout with dependencies already present, the following makes
  the intended precedence explicit for one read-only preview:

```sh
env PATH="$HOME/.n/bin:/opt/homebrew/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin" \
  /bin/sh setup/bootstrap/setup --dry-run --profile custom
```

  For other machines substitute their verified tool directories. Check
  `command -v brew git python3 node npm` and `node --version` in the job's
  environment before running an approved install. Apple shims and pinned
  project runtimes remain legitimate separate choices. Air needs no SMB
  binaries or provisioning source for normal local execution.
- Keep the existing npm-owned Claude CLI on both Macs. The canonical setup
  preview now blocks a selected Claude cask when the queried Homebrew has
  no matching receipt but a Claude CLI resolves on PATH. It neither adopts
  nor runs that CLI to make the ownership decision. A read-only Mini setup
  preview returned this conflict. On Air the explicit job PATH selected the
  intended native Brew, Git, Python, Node/npm, and existing Claude, with no
  matching native Brew cask receipt. The Air-local checkout was not updated to
  deploy the changed detector. Native Pi and locally managed Rex remain
  independent; keep current Herdr and Docker ownership.

**P1 accepted.** Typecheck, build, and all 153 tests passed, including refusal
if an unmanaged Claude appears after preview. The operator approved publishing
only the tooling docs, Claude guard, and its test. No installation, live PATH,
package manager, or developer directory changed during P1, and the Air-local
checkout was not updated. P0 remains provisionally resolved; investigate only
on recurrence. SMB recovery and dotfiles archival are separate and deferred.
