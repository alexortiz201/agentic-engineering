# .memory

Working state for the run, and what a fresh session needs to be useful. **Never committed.**

| File | Holds |
|---|---|
| `running_context.md` | What a cold session must know: where things are, the rules in force, where the gates stand. Corrected in place, kept to a screen |
| `todo_list.md` | The run's plan, as actionable steps. Worked top to bottom, and swept by `clean_up_hook` |
| `<topic>.md` | One topic per file, short and current. Delete one whose topic is resolved |

**Everything here is a prior snapshot to verify against current sources, never authority.** A note that contradicts the repository loses.
