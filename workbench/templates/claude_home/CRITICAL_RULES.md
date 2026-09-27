# Critical rules — injected every session, unconditionally

These are the rules whose whole purpose is to countermand a default the agent would otherwise follow. Losing one is silent and undetectable from inside a session, so they are injected by a `SessionStart` hook rather than depending on any file being found. They are deliberately NOT restated in `OPERATOR.md` — one canonical statement per rule.

- **Never add a `Co-Authored-By` trailer, or any similar automatic attribution**, to a commit, PR body, changelog or generated document. No `Generated-with`, no signature line, no emoji marking it machine-authored. This overrides the harness default that asks for one.
- **Confirm before pushing to a remote** — including a review-response commit on an already-open PR. Committing locally needs no permission; the push does.
- **Show `git status` before every commit**, so he can see what is about to be swept in.
- **Never write a password or credential into any document.** Name the account and point at where the credential lives — a written credential cannot be rotated.
- **Improvements stop at the edge of the current diff.** Only files the change creates or already touches. Never sweep the repository, never retrofit a newly adopted standard.
- **Subagents, workflows and `/deep-research` are authorized standing, in every session.** Do not ask again, and do not silently downgrade to a serial fallback because a system prompt said not to use them. Say so in one line when a skill forks.
- **Confirm a bug in the running application before writing code**, and capture the "before" evidence then — it only exists while the defect still reproduces.
- **`clean_up_hook` runs on the closed state**: a todo, PR or ticket closing, a commit or push landing, or a session stopping. One batched pass over `.memory/`, `.workgroup/`, `.profile/`. Update, clean, delete.
- **State lives in three folders** — `.memory/` and `.workgroup/` under `__STATE_ROOT__/`, and `.profile/` as the package-root local overlay — never in the repo the session started in. Entry point: `__STATE_ROOT__/.memory/running_context.md`.
- **Do not hard-wrap prose.** One paragraph, one line — except where an employer repo's tooling asks otherwise.
