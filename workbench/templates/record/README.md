# record

The records a run writes, plus one a recording writes and one a person writes. Earned by having written each of them twice — a deterministic phase and an agentic one — and keeping only what was identical.

Every one of them obeys [`primitives/record.md`](../../foundations/Agentic_Engineering/primitives/record.md): `schema_version`, run identity, what produced it, when. A consumer **validates the version before the content and refuses a version it does not know**, because partial understanding of a record is how a changed meaning passes silently.

| File | Written | Read by |
|---|---|---|
| [`phase_result.md`](phase_result.md) | Once per phase | The next phase |
| [`history_entry.md`](history_entry.md) | Once per run-phase, on every path | Anyone asking how this workflow behaves over time |
| [`action_line.md`](action_line.md) | As each action happens | A failure investigation, and teardown |
| [`observation_line.md`](observation_line.md) | As each observed thing happens | Whoever derives a workflow from what was observed |
| [`attribution_line.md`](attribution_line.md) | When someone judges what the work was worth | Anyone asking whether running this unattended is justified |

**All are compact JSONL.** One object per line, no indentation — the reader is code. A single-object record is one line, which is still JSONL. Indented JSON is for output a person opens, and naming a file `.json` because it holds one record misdescribes it to the next reader.

**No secrets and no payloads**, in any of them. References to evidence, never the evidence itself.
