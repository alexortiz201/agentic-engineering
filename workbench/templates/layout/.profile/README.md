# .profile

Who is operating this, and what is true of their machine. **Never committed.**

Two files, and keeping them apart is the point.

| File | Holds | Changes when |
|---|---|---|
| `preferences.md` | What the operator has **chosen** | They change their mind |
| `observed.json` | What is **true of this machine**, with when it was seen | Every walkthrough run |

**A preference cannot be probed and a fact must not be asked for.** "I prefer homebrew" is a preference — nothing on disk reveals it. "homebrew is installed" is a fact, and asking about it records a belief where an observation was available. Mixing them produces a file where some lines are stale and nothing marks which.
