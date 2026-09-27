# 🚦 Gate

An **independent** check on whether a transition may happen. Independent is the whole word: a gate evaluated by whatever produced the thing is not a gate, it is a self-assessment.

## Must contain

- **An identifier** from a declared namespace, so decisions compare across projects and runs.
- **What it checks**, as an expected set -- not "the tests", but *which* checks must have run.
- **How it is enforced** -- code, a person, or an agent's inspection. Say which; they are not interchangeable.
- **What it blocks** when it fails, and where control goes.

## The decision record

Beyond the common record fields:

| Field | Holds |
|---|---|
| `gate_id` | Which gate this is |
| `decision` | `pass` / `blocked` / `human_waived` |
| `reason` | Why, in terms a reader can check |
| `expected_checks` / `actual_checks` | The comparison -- **a gate that never compared these did not run** |
| `diff_base` / `changed_file_count` | What it observed. **Zero changed files is `blocked`, never `pass`** |
| `workspace` | Where it evaluated, so a wrong-tree pass is visible rather than plausible |
| `evidence_ref` | Where the raw output is kept |
| `next_state` | Where the run goes from here |

## Rules

- **`human_waived` is not a pass** and is never counted as one. The failing evidence stays.
- **A gate must observe its subject.** Record the base and the changed-file count; treat emptiness as evidence the gate never found what it was checking.
- **Record the workspace it actually resolved**, not the one it was supposed to use. A gate in the wrong tree records a correct-looking revision of the wrong thing.
- **Approval may not contradict an unresolved blocker.**
