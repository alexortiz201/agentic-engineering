# Mini live validation — 2026-11-14

Owner: Main Orchestrator, Mini Pi w7:p0. Evidence from actual host, separate from setup fixtures.

## Verified
- Host Mac Mini arm64; active shared checkout on physically local APFS. Main isolated integration worktree `/tmp/ae-migration-main` at published review baseline `8656a79767b2ef67aedd462b1081a2e0b0ed509f`.
- `pi --version`: **1.5.2**. PATH resolves `~/.pi/agent/bin/pi`; read-only `node setup/inspect-links.mjs --pi` verifies official managed receipt/entrypoint/shim topology, accepted version, no inherited profile override.
- `claude --version`: **2.1.325**; PATH resolves existing `~/.n/bin/claude`. Prior ENOEXEC issue is not reproduced; no reinstall or manager change.
- Inspector verifies **5/5 selective resource leaves** into shared local `harness/pi/packages/`, exact accepted hashes, correct ownership/modes/package scope; **zero blockers**, `handoffNeeded: false`. Workbench README/Foundations present. This establishes installation, not runtime loading.
- Actual five-resource headless bootstrap preview uses custom profile and instructions/theme/Workbench/Study/composer only. No apply/download prompt executed. Plan has no conflicts; selected resources are already owned. Separate full CLI tests run from clean isolated candidate: strict check/build and **63/63 pass, zero skips**.
- Settings is a local regular file, not a repository symlink. Auth exists locally. No credential values printed/copied. Portable preferences observed: openai-codex / gpt-6.1-sol / medium / purple-dreams; exact Todo 1.1.0 declaration retained. No lifecycle/Herdsman/subagent/Scout declaration in resource settings arrays.
- **369 existing session files** inventoried by inode/size/mtime only in a private baseline; no session restored, rewritten or opened by migration validation. Active agents may append normally. No auth refresh/login/model call performed for inventory.
- `herdr status`: client/server **0.9.5**, protocol compatible, no restart needed. `herdr integration status`: local Pi reporter **v9 current**, Claude reporter **v11 current**. Actual local and remote workers accepted tasks via installed agent prompt API; durable files are authoritative results.

## Recovery / preservation
- Requested external `/Volumes/DevDrive/Projects/backup-v1` **does not exist** on Mini. No backup material was deleted, overwritten or repurposed. This is a limitation, not verified external recovery.
- Existing private native migration checkpoint `~/.local/state/pi-native-consolidation/20261113T170838Z` exists, mode 0700, with private link metadata, patch/archive records and runtime recovery directories. Contents/credentials not published; not assumed current enough for whole-home restoration.
- Exact five-leaf private rollback receipt `~/.local/state/ae/handoffs/mini-pi-five-20261114T042028.825620Z/{manifest,result}.json` exists (directory 0700, files 0600). No rollback performed.
- New read-only validation baseline under `~/.local/state/ae/handoffs/mini-live-validation-20261114T172150Z/baseline.json` (0700/0600) stores private settings/auth digests and session metadata, not auth/session copies.
- Shared dirty Workbench/architecture/plans/root README preserved by 51-path SHA/mode baseline in OS temp; no shared checkout/reset/stash or bulk staging. Dotfiles extensively dirty and untouched.

## Evidence boundaries
Fresh composer native-loader/renderer compatibility is assigned to independent Mini reviewer. Existing operator-confirmed fresh-session visual acceptance is historical evidence, not recreated by inspector or fixtures. Auth refresh viability is demonstrated by this running authenticated session only, not by reading auth presence. No destructive offline/disconnect fault injection, unrelated install, PATH/settings/default/theme mutation or general computer config migration was performed.
