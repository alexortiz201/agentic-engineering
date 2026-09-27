# 🎛️ Control-plane tests

What a composition must survive before anything runs it unattended. These are injections, not happy-path runs: each row names a fault to induce deliberately and the observation that must follow. A path that is never exercised fails the first time it matters, and the paths that matter unattended are exactly the ones a supervised run never reaches. The workflow being tested is composed per [composition](06_ADW_COMPOSITION.md); the gate behavior several rows assert is defined in [gates](08_GATES.md).

| Inject | Required observation |
|---|---|
| Valid result + current artifacts + all expected checks | Advances exactly once; trace reconstructs the transition |
| Malformed JSON, wrong enum/ID, empty/missing result | Blocks; no fallback to empty success |
| Missing/empty/outside-root/stale artifact | Blocks the consuming phase |
| Failed, `not_run`, or zero-test required suite | Blocks unless explicit bounded human waiver; never relabels as pass, and never as `applicable: false` |
| Gate run from a workspace other than the one under test, or against an empty diff | Blocks; reports observed workspace, `diff_base` and `changed_file_count`. Never reports pass |
| Corrupted state record -- truncated write, wrong run ID, state moved backwards, orthogonal `blocked` lost on update | Blocks; refuses to infer the missing state; preserves the corrupt record alongside the last known-good one |
| Cleanup omitted or resource leaked -- orphaned worker, held lock, retained worktree, open port, temp workspace after cancellation | Detects and reports the leak, names the owner, and blocks unattended reuse of the resource; never silently reclaims another run's workspace |
| Review claims approval while listing an unresolved `blocker` disposition | Blocks pending repair or explicit waiver; `risk_accepted` must name a human |
| Repair changes checked files | Invalidates and reruns affected downstream gates |
| Timeout, process crash, cancellation, partial external write | Preserves evidence; inspects effects before retry; stops owned workers |
| Completion signalled but not delivered -- the event is lost, emitted twice, or raised before the work settled | A bounded wait expires and the controller reads the phase's actual state independently rather than waiting further; silence is never read as in progress and never as success; a repeated signal advances the phase exactly once |
| Duplicate trigger or occupied workspace/port | Atomic claim/reservation prevents double execution; reports conflict |
| Denied capability, hook failure, agent attempts to alter gate policy | No unauthorized action; fails closed at the actual enforcement boundary |
| Invalid/expired waiver or unapproved destructive/shipping step | Blocks and asks for exact human authorization |

Retries are counted per kind under a shared cap, and a composition must **test each kind separately** -- an exhausted budget is a control-plane path like any other, and one that is never exercised fails the first time it matters. The kinds, the caps and why a single counter cannot express them are in [recovery and handoff](05_RECOVERY_AND_HANDOFF.md).

**Caps must not be evaded by starting new sessions or subagents.** Attempt accounting belongs to the task, not to the process counting it. A retry performed by a fresh session, a new subagent, a second worktree, or a re-issued run ID for the same task increments the same counter. A controller must carry `attempts` across resume and delegation, and must reject a resumed run whose counters are lower than the last persisted values.

Resume revalidates workspace, partial effects, configuration and artifacts; a session ID is not recovery or isolation.
