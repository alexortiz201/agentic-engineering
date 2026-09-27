# .workgroup

The components worked on together, and notes **about** working on them — never the work itself. **Never committed.**

```
<member>/README.md     what the component is, how it runs, what to know
PRs/<TICKET>.md        one file per tracker item, at this level because a ticket can span members
```

## The rule that is easy to get wrong

**This folder is disposable by design.** It is gitignored, it is one machine, and losing it should cost nothing.

So anything in it that **outlives the work** — a defect in shared tooling, an unfiled finding, a decision others need — moves to a tracked, shared home *before* the work closes. A per-ticket file names which of its contents those are, so the move can happen rather than being noticed afterwards.

What legitimately lives and dies here: live status, what was observed and when, what is in flight, what to look at next.
