# Publication scope review — Commit 1 and Commit 2

**Reviewer:** Existing Claude agent (Mini), bounded read-only task per `SHARED_DEVDRIVE_PUBLICATION.md` § "Existing Claude agent"
**Date:** 2026-11-14
**Source handoff:** `/Volumes/DevDrive/Projects/agentic-engineering/plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md`
**Sole writable output:** this file. No staging, commit, fetch, checkout or push performed.

---

## Methodology

All inspection was read-only: `git diff`, `git status`, `find`, `readlink`, file reads, `grep`. No `git add`, `git stage`, `git stash`, `git checkout`, `git reset`, `git fetch` or `git push` was run. Sensitive file content is redacted; only structural observations are reported. This report covers the proposed two-commit allowlist, migration-only delta confirmation, privacy per file, dependency completeness and Git approach safety.

---

## 1. Allowlist file count verification

### Commit 1 — `feat(setup): consolidate selective provisioning and portable Pi packages`

| Category | Files | Count |
|---|---|---|
| Modified tracked: `.gitignore`, `AGENTS.md` | `.gitignore`, `AGENTS.md` | 2 |
| New untracked root | `SETUP.md` | 1 |
| New untracked `cli/` (excl. node_modules, dist) | 27 source/test/config files | 27 |
| New untracked `setup/` (incl. 2 symlinks, all subdirs) | 43 files | 43 |
| New untracked `harness/pi/` | 8 files | 8 |
| **Total Commit 1** | | **81** |

Proposal says "~81 files." Exact count is 81. ✓

The 43 `setup/` files include:
- `setup/ACCEPTANCE.md`, `setup/MIGRATION.md` (the "approval docs" referenced in the proposal)
- `setup/OWNERSHIP.md`, `setup/bootstrap/setup`, `setup/inspect-links.mjs`, `setup/stage-pi.mjs`
- `setup/computer/`: **36 entries** — 30 package leaves across `{git,gh,ssh,ghostty,herdr,zsh}/` (one of which is a relative symlink), 5 manifest files under `manifests/`, 1 provenance file (`source-provenance.json`)
- `setup/resources/foundations/.local/share/ae/foundations` (1 relative symlink)

The 8 `harness/pi/` files:
1. `harness/pi/accepted.json`
2. `harness/pi/README.md`
3. `harness/pi/settings.example.json`
4. `harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts`
5. `harness/pi/packages/pi-instructions/.pi/agent/AGENTS.md`
6. `harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json`
7. `harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md`
8. `harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md`

Exactly 8. ✓

### Commit 2 — `docs(setup): record shared workspace and durable publication handoff`

| File | Status |
|---|---|
| `plans/SETUP_CLI_CLAUDE_HANDOFF.md` | Untracked, present |
| `plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md` | Untracked, present |
| `plans/handoffs/PUBLICATION_SCOPE_REVIEW.md` | This file (new) |
| `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md` | Untracked, present; Pi reviewed and proposes inclusion. Disk-device identifier to be removed by Air before publication per handoff instructions. |

4 files. *(Initial review recorded 3 files pending Pi's privacy decision; Pi has since reviewed the sanitized report and proposes including it.)*

### Confirmed excluded

| Excluded path | Reason per proposal |
|---|---|
| `README.md` | Explicit exclusion |
| `architecture/**` | Explicit exclusion |
| `workbench/**` | Explicit exclusion |
| `plans/AUTONOMOUS_WORKBENCH_HANDOFF.md`, `plans/BACKLOG.md`, `plans/WORKBENCH_CONSTRUCTION_SLICE.md` | "other existing plan/evidence WIP" |
| `plans/evidence/` | Explicit exclusion |
| `architecture/workbench-construction.md` | Explicit exclusion |
| `workbench/tools/construct/` | Explicit exclusion |
| `cli/node_modules/`, `cli/dist/` | Excluded by existing `.gitignore` entries |
| Root `pi/` (13 files) | Explicitly excluded; already committed at HEAD |
| `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md` | Now proposed for Commit 2 after Pi review; see Commit 2 table above |

No `.env*`, auth/settings/session/Todo state, generated build/cache output or credentials are present in the candidate tree. ✓

---

## 2. Migration-only delta confirmation

### `.gitignore` delta

Sole change: added `.bootstrap/` on a new line under the `# ── Dependencies / build output ──` section. No other lines added, removed or modified. This is a migration-only change: `.bootstrap/` is the bootstrap-local Node runtime cache directory created at provisioning time and correctly excluded from version control. No personal data added. ✓

### `AGENTS.md` delta

Lines removed: the Pi-ownership paragraph referencing `pi/air-provisioning.md` and old Air activation phrasing.

Lines added:
1. `cli/` ownership bullet — OWNED designation with pointer to `cli/README.md`
2. `setup/` ownership bullet — OWNED designation with pointer to `setup/OWNERSHIP.md` and `setup/MIGRATION.md`
3. `harness/pi/` ownership bullet — GENERATED MIGRATION CANDIDATE designation with authorship constraint (do not independently edit generated copies; root `pi/` remains sole authored authority; retire staging only after approved handoff)
4. Updated Pi-ownership paragraph — replaces `pi/air-provisioning.md` with `setup/MIGRATION.md`; adds shared DevDrive topology, Air offline fallback, accepted baseline `e9c0a625`, and coordination constraints

All added lines are setup/migration ownership documentation. No personal name, email, host credentials, session tokens or private paths are introduced. The macOS username `tailr.fit` does not appear in `AGENTS.md`. ✓ Migration-only delta confirmed.

---

## 3. Privacy assessment

### Computer config files (`setup/computer/`)

| File | Finding |
|---|---|
| `git/.gitconfig` | Uses `[include] path = ~/.gitconfig.local`; no personal name or email hardcoded. ✓ SAFE |
| `git/.gitignore_global` | Generic ignore patterns; no personal data. ✓ SAFE |
| `ssh/.ssh/config` | `Include ~/.ssh/config.local`; generic defaults only (UseKeychain, AddKeysToAgent, `~/.ssh/id_ed25519`); no private hosts or key paths. ✓ SAFE |
| `gh/.config/gh/config.yml` | Protocol, editor, prompt settings; no tokens, no hosts file. ✓ SAFE |
| `herdr/.config/herdr/config.toml` | Theme/color values only; no credentials or machine identifiers. ✓ SAFE |
| `ghostty/.config/ghostty/config` (symlink) | Relative symlink: `../../Library/Application Support/com.mitchellh.ghostty/config`. Target is a sibling file within the same package. Resolves correctly within the checkout. No personal data. ✓ SAFE |
| `ghostty/.config/ghostty/themes/purpledreams` | Theme palette entries only. ✓ SAFE |
| `ghostty/Library/Application Support/com.mitchellh.ghostty/config` | Theme/palette reference; no credentials. ✓ SAFE |
| `zsh/.zshrc` | Contains `load_lpass_api_keys` / `lpass_login_and_load_keys` helper functions. No credentials are hardcoded. `USER_EMAIL` referenced but sourced only from `~/.config/ae/shell.local.zsh` (private local override). Actual lpass loading is commented out. ⚠️ MINOR: discloses use of LastPass CLI as toolchain choice. Acceptable for personal public repo. |
| `zsh/.oh-my-zsh/custom/env.sh` | Generic shell helpers using `${HOME}`, `${AE_PROJECT_HOME:-}`; no personal identity or credentials. ✓ SAFE |
| `zsh/.local/bin/aircopy` | OSC 52 clipboard utility; no personal data. ✓ SAFE |
| `zsh/.oh-my-zsh/custom/plugins/*` | Generic shell plugin definitions (docker, gh, git, ssh-agent, vscode, colored-man-pages). No credentials. ✓ SAFE |
| `zsh/.oh-my-zsh/custom/themes/purpledreams.zsh-theme` | Theme color definitions. ✓ SAFE |
| `zsh/.stow-local-ignore` | Stow ignore list. ✓ SAFE |
| `source-provenance.json` | SHA-256 hashes of dotfiles file content + commit/dirty status. No credentials. ✓ SAFE |

### Brewfiles and global-package inventories

`Brewfile.shared` lists `lastpass-cli` and `tor` among standard CLI/GUI packages. These are package names — toolchain disclosure only. No credentials. ⚠️ MINOR: same level as `zshrc` lpass disclosure. Acceptable for personal public repo. `Brewfile.mini`, `Brewfile.air`, `bun/global-packages.txt`, `npm/global-packages.txt`: package names only. ✓ SAFE.

### `setup/resources/foundations/` symlink

`setup/resources/foundations/.local/share/ae/foundations` is a relative symlink: `../../../../../../workbench/foundations`. Resolved from its containing directory within the checkout, this reaches the checkout root then `workbench/foundations`, which is committed at HEAD. No absolute HOME paths or personal data. The symlink is safe to commit. ✓ SAFE.

The symlink target (`workbench/foundations/`) must exist in the repository for it to be useful after installation. It does: `workbench/foundations/` is committed at HEAD (the many modified `workbench/` files in the dirty tree are modifications to already-tracked content; the directory and its contents remain present). ✓

### `harness/pi/` files

`accepted.json` contains `runtime`, `todo` package reference, and `baseline` commit SHA. No personal paths or credentials. ✓ SAFE. The five package leaf files are Pi skill/theme/extension content. No credentials. ✓ SAFE.

### Plans documents (Commit 2)

`plans/SETUP_CLI_CLAUDE_HANDOFF.md`: References `w7:p28` (ephemeral Herdr pane ID, non-sensitive) and checkout path `/Volumes/DevDrive/Projects/agentic-engineering`. No credentials. ✓ SAFE.

`plans/handoffs/SHARED_DEVDRIVE_PUBLICATION.md`: References Air local checkout path `/Users/alexanderortiz/Github/agentic-engineering`. This is an operator-provided topology path (the macOS username `alexanderortiz` and the GitHub account `alexortiz201` are distinct). The path is not a credential; it appears here as explicit accepted topology documentation. No credentials. ✓ SAFE.

### `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md` (proposed for Commit 2 after Pi review)

Contains operator-provided Air local checkout path, five SHA-256 hashes of accepted Pi resource bytes, Git log and status summary. No HOME inventory, credentials or machine identifiers beyond the operator-provided topology path. The report explicitly omits raw HOME inventory per its authority section. Pi has reviewed and proposes including it in Commit 2; disk-device identifier to be removed by Air before publication per handoff instructions.

---

## 4. Dependency completeness

| Dependency | Required by | Present after Commit 1 |
|---|---|---|
| `pi/` (13 files) | `cli/tests/sources.test.ts` byte-equality tests; `setup/stage-pi.mjs` reads `pi/managed-lock/1.5.2/package.json`, `pi/settings.example.json`, `pi/.pi/agent/*` | Already committed at HEAD. ✓ |
| `harness/pi/packages/*/` | `cli/tests/sources.test.ts` right-hand equality checks; `setup/inspect-links.mjs --pi` candidate inspection | In Commit 1. ✓ |
| `setup/inspect-links.mjs` | `cli/tests/pi-inspection.test.ts` (12 tests) | In Commit 1 (`setup/`). ✓ |
| `cli/` (source, tests, lockfile) | Test suite; bootstrap entrypoint | In Commit 1. ✓ |
| `setup/stage-pi.mjs` | Stager tests in `cli/tests/sources.test.ts` | In Commit 1 (`setup/`). ✓ |
| `setup/bootstrap/setup` | User entry point; references `cli/node_modules/` for dep check | In Commit 1 (`setup/bootstrap/`). `cli/node_modules/` is excluded from Git (correct: users run bootstrap to install). ✓ |
| `setup/ACCEPTANCE.md`, `setup/MIGRATION.md` | Approval records; `setup/OWNERSHIP.md` references them | Both in Commit 1 (`setup/`). ✓ |
| `workbench/foundations/` | `setup/resources/foundations/` relative symlink target | Present at HEAD (tracked, pre-existing). ✓ |
| `scripts/install-pi.test.js` fixture | Existing Pi fixture test run | In root `scripts/` at HEAD (not part of either commit; already committed). ✓ |

No unresolved dependency found. After Commit 1, the full test suite (`63 tests`, 5 PTY scenarios) has all source dependencies present. ✓

---

## 5. Git approach safety

Proposal: empty index → explicit named file adds → two scoped commits → push to `refs/heads/setup/consolidation` (not main).

| Check | Assessment |
|---|---|
| Index state | `git diff --cached --name-only` returns no paths at inspection time. Index is empty. ✓ |
| Single Git writer | Required. Both Mini and Air access DevDrive. Air's task was explicitly read-only on Git. No other staging/commit authorized. The constraint must hold through the commit window. |
| Explicit file adds (not `git add .` or `git add -A`) | Correct. Blanket add would include excluded dirty files (`README.md`, `architecture/**`, `workbench/**`, other plans WIP). Explicit per-file adds are mandatory. ✓ |
| Review branch (`setup/consolidation`), not main | Sound. Prevents premature main promotion. ✓ |
| No force push | Explicitly required. ✓ |
| Pre-push live remote ref check | The handoff requires `git ls-remote --heads origin refs/heads/main refs/heads/setup/consolidation` before publishing (`setup/consolidation` must be absent or cleanly fast-forwardable). This read-only ref query is not a fetch and was not run in this review scope. The writer must run it immediately before the approved push window. |
| `C` = exact reviewed second commit, not moving HEAD | Important: `C` is a resolved SHA of the reviewed second commit, not the branch pointer. Lock it before push. ✓ |
| Staged commit file list inspection | Proposal requires inspecting each commit's file list before push. Correct safeguard. ✓ |

The approach is sound. The critical runtime check (live remote ref) is the writer's responsibility immediately before the push window.

---

## 6. Scope corrections and recommendations

### Correction 1 — explicit allowlist for `harness/pi/` staging

Git status shows `?? harness/` (whole directory is new). Currently only `harness/pi/` contains the 8 accepted files. The staging command must use explicit paths under `harness/pi/` or at minimum `git add harness/pi/` — **not** `git add harness/` — to avoid inadvertently staging any future `harness/` content added before the commit window.

**Recommendation:** Use explicit per-file paths or `git add harness/pi/` with a pre-stage content verification.

### Correction 2 — `setup/ACCEPTANCE.md` and `setup/MIGRATION.md` must be named explicitly in the allowlist

The proposal describes them as "approval docs" under `setup/`. Both are confirmed present and are untracked. Because they are the most consequential documentation files in `setup/`, the final Git staging plan should name them explicitly rather than relying on `git add setup/` sweeping them in. This reduces staging-time ambiguity.

**Recommendation:** Enumerate `setup/ACCEPTANCE.md` and `setup/MIGRATION.md` by name in the final staging allowlist.

### Correction 3 — `setup/resources/foundations/` relative symlink annotation

The `setup/resources/foundations/.local/share/ae/foundations` symlink points to `../../../../../../workbench/foundations` (relative, resolves within checkout). This is safe and self-contained. However, the commit message or staging plan should acknowledge this relative symlink so reviewers don't mistake it for a broken absolute link.

**Recommendation:** Note the relative symlink in the commit annotation or staging plan. No scope change required.

### Note — LastPass toolchain disclosure

`setup/computer/zsh/.zshrc` and `setup/computer/manifests/brew/Brewfile.shared` reveal use of LastPass CLI as a credential management tool. No credentials are exposed. For a personal public repository, this is an acceptable toolchain disclosure. No change required; noting here for operator awareness.

### Note — `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md` now proposed for Commit 2

Pi reviewed the sanitized report and proposes including it. It contains no private HOME inventory, credentials or session state. One disk-device identifier is to be removed by its owner (Air) before the commit window. No further redaction needed beyond that single removal.

---

## 7. Verdict

**Allowlist is complete and correct at 81 files for Commit 1 and 4 files for Commit 2.** No dependency gap found. No credentials or private state in any candidate public file. The `.gitignore` delta is minimal and correct. The `AGENTS.md` delta is migration-only. The Git approach (empty index + explicit adds + review branch + no force) is sound; the pre-push `git ls-remote` ref check is a mandatory safeguard the writer must perform.

**Three concrete corrections: all implemented in the final staging proposal above.**

1. `harness/pi/` staged using the explicit 81-path manifest — each harness leaf named individually, never `git add harness/`.
2. `setup/ACCEPTANCE.md` and `setup/MIGRATION.md` named explicitly in the manifest.
3. `setup/resources/foundations/` relative symlink annotated in the staging proposal with its within-checkout resolution.

No blocking privacy, dependency or safety concern identified against publication to `setup/consolidation` after a `git ls-remote` ref check immediately before the push window.

**Verification performed:** read `SHARED_DEVDRIVE_PUBLICATION.md`; inspected `git diff HEAD -- .gitignore AGENTS.md`; ran `git status --short`; ran `find` on `cli/`, `setup/`, `harness/pi/`, `harness/`, `setup/resources/`; inspected all `setup/computer/` files for credentials; inspected `setup/stage-pi.mjs`, `harness/pi/accepted.json`, `plans/SETUP_CLI_CLAUDE_HANDOFF.md`, `plans/handoffs/AIR_LOCAL_CHECKOUT_EVIDENCE.md`; checked `readlink` on all symlinks; confirmed index empty; confirmed `cli/node_modules/` and `cli/dist/` absent from tree. No write, stage or fetch commands were run.
