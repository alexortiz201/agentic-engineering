# Air local checkout evidence — bounded read-only inspection

## Authority and scope

Read the actual shared [`SHARED_DEVDRIVE_PUBLICATION.md`](SHARED_DEVDRIVE_PUBLICATION.md) successfully from `/Volumes/DevDrive/Projects/agentic-engineering/plans/handoffs/`. Also read the shared repository's current `AGENTS.md`. This report is the sole filesystem write for this task. Inspection commands ran with the shared repository as CWD and explicitly targeted local fallback `L=/Users/alexanderortiz/Github/agentic-engineering`.

DevDrive remains the active shared development workspace; L remains the accepted local offline fallback and resource source. No Git mutation/network query, installation, link/source change, runtime/offline acceptance recheck, or settings/private-state inspection was performed. No agents were started. Exact link literals were examined only in-process and are omitted; no raw HOME inventory or machine identifiers are published.

## Local Git and filesystem snapshot

- Top level: `/Users/alexanderortiz/Github/agentic-engineering`.
- HEAD: `e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354`.
- Branch: `main`; status header `main...origin/main`, with no tracked or untracked changes reported.
- Index: empty (`diff --cached --name-only` returned no paths).
- Recent commits:
  - `e9c0a62 feat(pi): retain Air study and composer capabilities`
  - `7a7fdb4 docs(pi): support bidirectional promotion and explicit local apply`
  - `bdb76ca feat(pi): finalize native Mini profile and Air deployment handoff`
- `ls-tree -r --name-only HEAD -- harness/pi setup cli` returned no paths. Scoped status for those paths also returned no paths. Thus the proposed new package/setup/CLI sources are neither committed at this local HEAD nor present as untracked files in those scopes.
- The verified filesystem evidence places L on the local Data filesystem, not on the shared SMB volume. Relevant source parents were real directories, not directory symlinks.
- These are local/cached observations only; no claim of live remote freshness or availability of a future publication commit is made.

## Five known resources

For each HOME leaf, inspected every parent top-down using `lstat`, without traversing directory symlinks. All inspected parents were real directories; all five leaves were symlinks. Literal target normalization and realpath both identify exactly `L/pi/.pi/agent/<suffix>`. Only these approved targets were read/hashed. All five old source files are regular local files, are listed at local HEAD, and their live resolved bytes equal their corresponding old source bytes.

| Package | Suffix after `.pi/agent/` | Approved local ownership | Old/live SHA-256 | New local candidate |
|---|---|---|---|---|
| `pi-instructions` | `AGENTS.md` | Root `pi/` | `04d5065fac818554a1326df9227254dc4d3b21c4674986172a393eb2200b763e` | Absent |
| `pi-theme` | `themes/purple-dreams.json` | Root `pi/` | `73d86db506f25164edf7c7266898f9c7d349778a8ca55f30b129267c7ef3805a` | Absent |
| `workbench-skill` | `skills/workbench/SKILL.md` | Root `pi/` | `f17a20f40d793552e61450478203244af34ea8ef3fcf4bc50c7409cc8d20662f` | Absent |
| `study-skill` | `skills/agentic-engineering/SKILL.md` | Root `pi/` | `0e76c36a8e1806164b33f23d668484f283bf5316e52d25d2373e71edb5545e9f` | Absent |
| `composer` | `extensions/composer-highlight.ts` | Root `pi/` | `cdfcd4ba722253d3fb9488b5a5833cac8f2f5dc14369aebe9a5161cb1eb595d1` | Absent |

The expected new paths are `L/harness/pi/packages/<package>/.pi/agent/<suffix>`. Their parent/package trees are absent locally. Consequently candidate regular-file checks, candidate hashes/equality, and exactly-one-expected-leaf package checks are **not applicable / not verifiable**, not failed byte comparisons. No candidates were regenerated or copied. No leaf currently uses the new selective-package ownership.

## Requested local source presence

| Local path relative to L | Present/type | Committed at local HEAD |
|---|---|---|
| `harness/pi/accepted.json` | Absent | No |
| `setup/inspect-links.mjs` | Absent | No |
| `setup/bootstrap/setup` | Absent | No |
| `cli/package.json` | Absent | No |
| `workbench/README.md` | Regular file present | Not part of the requested candidate/setup Git-scope check |
| `workbench/foundations/` | Directory present | Not part of the requested candidate/setup Git-scope check |

The optional local inspector was not run: its required source and accepted manifest are absent. Direct bounded filesystem inspection supplied the resource evidence instead.

## Verdict, blockers and next action

**Accepted local root-Pi ownership is intact for all five resources. No relink or runtime migration is needed to use DevDrive as the active development CWD.** The local fallback does not yet contain the new selective candidates or setup/CLI implementation; therefore source-layout handoff validation is blocked on their approved publication and separately approved source-only local synchronization, not on an Air runtime defect.

Next action belongs to the Pi lead: finish scoped publication review and obtain explicit Git-write/publication approval. Any later local fast-forward must name the approved commit, recheck local cleanliness/ancestry and the unchanged five old resource bytes, and retain all old root source paths while these live links depend on them. A five-leaf local-to-local ownership handoff, if still desired, requires its own separate approval. No such actions were executed here.

Verification performed: actual shared-handoff read; local top-level/HEAD/branch/status/index/recent-log inspection using `GIT_OPTIONAL_LOCKS=0`; scoped candidate/setup/CLI tree and status checks; local filesystem check; five parent-chain/literal-target/realpath/regular-file/hash inspections; requested source presence checks. No accepted runtime or offline tests were repeated.
