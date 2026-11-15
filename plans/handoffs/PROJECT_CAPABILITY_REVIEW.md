# ARCHITECTURE REVIEW: FAIL (two material findings, both small repairs)

**Reviewed SHA:** `06d6914ffd062de99748aea8fb849a6043c80273` (worktree `/tmp/ae-close-review`, clean before and after; no tracked source, refs, index, HOME or DevDrive touched; reproductions ran only in `os.tmpdir()` copies).
**Reviewer role:** fresh, read-only. This review grants no publication authority; Main decides integration.

## Executable evidence

| Check | Result |
|---|---|
| `npm --prefix cli run check` | pass (`tsc --noEmit`) |
| `npm --prefix cli run build` | pass |
| `npm --prefix cli test` | 142 tests, 142 pass, 0 fail (matches Main's claim) |
| Adversarial scripts (scratchpad `repro.ts`, `repro2.ts`) | 2 confirmed defects below, 1 minor |

## What holds up (verified from code, not from claims)

- **One authority, no second registry/engine.** `projectLeaves` and `compositions` live in `components/catalog.ts`. `Component.project` is an optional field. `projectCatalog = catalog + compositions`, and `catalog()` (machine setup) never includes compositions. Test `discovery lists…` pins this. The machine `Component` for the two skills is unchanged (`adapter: 'stow'`, `dependencies: ['pi','brew-stow']`).
- **Leaf plus referencing composition, recursive reuse.** `resolve` is pure, with cycle, unknown and non-project rejection. Ordering is deterministic (sorted selection, declared dependency order, dependencies first). Diamond dedup uses `done`. A leaf's machine `dependencies` are ignored, and `requires` stays advisory.
- **Lazy discovery.** `list` reads catalog data only. `leafEntries` is called only for leaves in the resolved closure (`previewProject`, `inspectProject`). The unselected-source-removed test is real.
- **Deterministic preview and approval.** `planProject` is pure and has no clock. The fingerprint covers target, source, selection, order, operations (including the absolute link source and the sha256 of the receipt after), conflicts and the receipt before/after digests. `applyProject` recomputes the plan, refuses on conflicts before anything else, and demands an exact fingerprint match.
- **Ownership and replacement refusal.** Ownership is decided only from a fresh observation: a literal symlink resolving to exactly the canonical file. The receipt never drives a filesystem operation. `observe` recomputes paths from the catalog, so forged receipt paths cannot redirect effects. Existing file, dir, foreign or dangling symlink gives a conflict and the whole apply is refused. `mkdir` is non-recursive, `symlink` never clobbers, and `safePath` rejects symlinked or non-directory parents. Receipt writes are tmp (`wx`) then rename, which replaces only the receipt path.
- **No removal, no project-owned file edits.** The only files created are links, directories, and `.ae/project-capabilities.json`. No `AGENTS.md` or settings are touched, and unselected receipt leaves are preserved verbatim.
- **Idempotence and failure visibility.** A rerun yields all `noop`, with no `record` when the receipt text is byte-identical. Mid-apply failure stops, lists completed operations and does not roll back, as documented.
- **Home setup preserved.** `safePath` and `digest` are unchanged. `sourceLeaves` is a type-only `Pick<>` widening with identical runtime. The error text `Path escapes target home` now also appears for project paths (cosmetic only).

## Material findings

### F1 (correctness, self-bricking receipt): receipt entry order disagrees with the reader's canonical order. **Blocking.**

`leafEntries` returns entries in `sourceLeaves` walk order, which sorts names per directory and walks depth-first. `readReceipt` requires entries sorted by plain string order of the full `relative` path. These differ whenever a directory name is a prefix of a sibling name and the next character sorts below `/` (`-`, `.`, space and similar). Examples: `refs/` with `refs-extra.md`, or `scripts/` with `scripts.md`. Walk order gives `refs/a.md, refs-extra.md`, but the sort wants `refs-extra.md, refs/a.md`.

**Repro** (temp canonical copy; add `refs/a.md` and `refs-extra.md` under the workbench skill payload; temp project repo):
```
applyProject(...workbench-skill...)  -> THROWS "Receipt refused: entries for workbench-skill are not canonical"
```
- The effects have already happened: dirs, links and the receipt are written. The post-apply `verifyProject` then throws.
- Every later `plan`, `apply` and `verify` on that target throws the same error. The receipt can only be removed by hand.
- It is latent today because both real payloads contain only `SKILL.md`. The next realistic skill with a `references/` or `scripts/` sibling trips it.
- No test covers a nested or ordering-sensitive payload.

**Smallest repair:** in `leafEntries` (`cli/src/project/observe.ts`) sort the result with the same comparison the reader uses, `.sort((a, b) => (a.relative < b.relative ? -1 : a.relative > b.relative ? 1 : 0))`. Add a test with a payload containing `refs/a.md` and `refs-extra.md` that applies, verifies and reruns to a no-op plan. (Do not change `sourceLeaves`, which is shared with machine setup.)

### F2 (authority boundary): "target outside the canonical checkout" is bypassable by path case on a case-insensitive volume. **Blocking (small).**

`projectTarget` compares `path.resolve(target)` with `fs.realpathSync(root)` using `startsWith`, and checks `realpathSync(resolved) === resolved`. The JS `realpathSync` does not normalize case. On macOS APFS, which defaults to case-insensitive, `/…/AE-REV-x/canonical` and `/…/ae-rev-x/canonical` are the same directory. The canonical checkout passes as its own target, and the `.git` check is satisfied because the checkout is a Git repository.

**Repro** (temp canonical copy with a `.git`; target is the same path with a different case in one segment; FS confirmed case-insensitive on this host):
```
context(croot, swapCase(croot))  -> OK (no error)
applyProject(...)                -> applied: mkdir .ae, mkdir .pi, mkdir .pi/skills, mkdir .pi/skills/workbench,
                                    link .pi/skills/workbench/SKILL.md, record .ae/project-capabilities.json
canonical checkout now contains .ae and .pi
```
This writes untracked project state into the canonical source tree. It violates the documented rule that the target is "inside/equal to the canonical checkout → Command error". It needs a deliberate wrong-case path, so it is an operator-error or hostile-input guard rather than an everyday risk. It is still the one guard the architecture relies on to keep the canonical tree clean.

**Smallest repair:** in `projectTarget`, compare using `fs.realpathSync.native` for both the target and the repository (native canonicalizes on-disk case), and require `realpathSync.native(resolved) === resolved`. As an alternative or addition, refuse if any ancestor of the target has the same `dev:ino` as the canonical root. Add a test that is skipped when the filesystem is case-sensitive.

## Non-blocking observations (not violations)

- **N1:** A symlinked directory inside a payload (`lstat` says not a directory, so it is treated as a file) crashes in `readFileSync` with a raw `EISDIR` from `leafEntries` and `plan`. It fails closed and nothing is written. A clearer `Source …/dirlink is a symlinked directory; not supported` message would be nicer. Reproduced.
- **N2:** A failed receipt rename can leave `.ae/project-capabilities.json.ae-<uuid>`. This is within the documented "no rollback, rerun plan" model.
- **N3:** Links and `.ae/project-capabilities.json` are untracked and not git-excluded. An operator can accidentally commit them, with absolute checkout paths. This is within the documented absolute-link and stable-path limitation. A one-line README note would help, with no code change.
- **N4:** `architecture/project-capabilities.md` still says ARCHITECTURE REVIEW is PENDING. That is accurate now. Main should update it only after F1 and F2 are repaired and re-reviewed.
- **N5:** The documented limits (stable checkout, absolute links, no TOCTOU-proof transaction, no concurrent-writer lock, POSIX only, no removal, no nested ADW) are honestly stated and are not counted as violations. I found no unstated limitation beyond F1 and F2.

## Main's additional evidence (received mid-review, not independently re-run)

Main reported an external real-`git init` project run on unchanged 06d6914. It covered list and inspect, a deterministic plan run twice, refusal of a missing or wrong approval, a leaf install with study absent, verify, an exact no-op rerun, a later composition expansion and project-file preservation. It also reported that Pi 1.5.2 `loadSkills` found all three skills with no diagnostics. I did not repeat these. They are consistent with my code reading and do not touch F1 or F2. Both defects need payload shapes or path spellings those runs did not use (a nested payload with an ordering-sensitive sibling, and a case-variant target). This resolves the "native discovery unverified" doc caveat at loader level only. Full interactive trust and session behavior stays unverified, as Main noted.

## Required before PASS

1. Repair F1 (sort entries, plus an ordering test).
2. Repair F2 (native realpath containment, plus a case-variant test where the FS is case-insensitive).
3. Rerun `check`, `build` and `test`, then request a re-review of the delta only.

Everything else in scope (catalog extension, resolver, observe, plan, service, CLI, shared helper change, preserved home behavior) passes architectural review as written.

---

# ARCHITECTURE RE-REVIEW (delta, F1/F2): PASS

**Reviewed SHA:** `e6b42ab448c5c8bc2faf59785795c8ab4758ea80` (`fix(cli): canonicalize project boundaries and payload entry ordering`), delta from `06d6914`.
**Delta scope verified:** `git diff --stat 06d6914..HEAD` shows exactly two files, `cli/src/project/observe.ts` (+13/−4) and `cli/tests/project.test.ts` (+36). The shared safety helper, setup code, catalog, plan, service and CLI are unchanged. The worktree was clean before and after, and I wrote no source, refs or index. Reproductions ran only in `os.tmpdir()` or the scratchpad.
This verdict covers the F1/F2 repairs only. It grants no publication authority, and I make no claim about documentation (Main still owes the doc and native-discovery updates).

## Checks actually run

| Check | Result |
|---|---|
| `npm --prefix cli run check` | pass |
| `npm --prefix cli run build` | pass |
| `npm --prefix cli test` | 144 tests, 144 pass, 0 fail, 0 skipped (F1 and F2 tests both ran on this case-insensitive APFS host) |
| Original adversarial repros rerun against HEAD | F1 and F2 repros now behave correctly (below) |
| New tests run against the OLD `observe.ts` in a scratch `git archive` copy | Both new tests fail (13 of 15 pass, F1 and F2 fail), so they are real regression guards |

## F1: entry ordering. RESOLVED.

- **Change:** `leafEntries` sorts the mapped entries by `relative` with `<`/`>` string comparison. That is UTF-16 code-unit order, the same order the reader's default `.sort()` produces. The sort sits in `observe.ts`, so `sourceLeaves` and machine setup are untouched.
- **Repro rerun** (`refs/a.md` plus `refs-extra.md` in the payload):
  - `apply` succeeds, with mkdirs, three links and the record.
  - A later `plan` yields only no-op operations.
  - `verifyProject(...).ok === true`.
  - Before the fix the same payload threw `entries … are not canonical` after effects had landed.
- **Test quality:** the F1 test uses two ordering-sensitive sibling pairs (`refs/` with `refs-extra.md`, `scripts/` with `scripts.md`). It asserts all of the following:
  - a verified apply;
  - the recorded order is sorted;
  - link contents are correct;
  - the rerun plan is all no-op and the approved rerun applies nothing;
  - verify is ok;
  - the composition-over-missing-study status is `partial`.

## F2: canonical-checkout containment. RESOLVED.

- **Change:** `projectTarget` now uses `fs.realpathSync.native` (on-disk case) for both the target and the canonical root. It refuses when the target equals or is a descendant by native path, or when any ancestor of the target shares `dev:ino` with the canonical root. The `native !== resolved` check then rejects symlinks and non-canonical spellings, with a message that names the real path. Order matters and is correct: containment is checked before the spelling check, so the case-variant canonical path reports "outside the canonical checkout".
- **Repro rerun, case-variant of the canonical root:** `Target must be outside the canonical checkout`. A case-variant descendant is also refused. The earlier `apply` into the canonical copy (`repro2`) now fails at target validation, before any effect.
- **Test quality:** the F2 test covers the case-variant root, a case-variant descendant with a nested `.git`, a case-variant spelling of a descendant path component, and the canonical tree being unchanged (`tree()` comparison). It also checks that a mis-cased ordinary project is refused with a "canonical on-disk form" message. The guard is `t.skip` when the volume is case-sensitive. That is correct, since the alias cannot exist there, and it ran here (0 skipped).
- **Regression:** the existing symlink, unsafe-root and real-path tests still pass. The `dev:ino` ancestor walk terminates at the filesystem root.

## Remaining material issues

None.

## Non-blocking notes (carried forward, none is a violation)

- N1 from the first review is unchanged: a symlinked directory inside a payload still fails closed with a raw `EISDIR` (reproduced again). Nothing is written. It is out of scope for this delta, and a clearer message could be added later.
- `ctx.root` is still `fs.realpathSync(root)`, the non-native spelling. In the CLI it comes from `import.meta.url`, so it has on-disk case, and a wrong-case root is not an operator-supplied input. I do not consider this a defect.
- The old N2 (leftover receipt temp file), N3 (untracked, un-excluded links and receipt) and N5 (documented limits) are unchanged.
- Documentation is not part of this verdict. `architecture/project-capabilities.md` still says the architecture review is pending and native discovery is unverified. Main will update both after this verdict, as Main stated.

Stopping here.
