# 🔁 Porting between Claude Code and Pi

> **Verified 2026-09-13**, against Pi v0.85.1 and Claude Code as documented on that date. Every row is a claim about two moving targets; a stale row here is worse than a missing one, because it will be believed.

Organised by **mechanism**, not by feature. A feature often has no counterpart; the mechanism underneath it always does, and asking the mechanism question is what turns an apparently impossible port into a short one.

Read this with both conformance reports open: [`claude_code.md`](claude_code.md) and [`pi.md`](pi.md).

## The translation table

| Mechanism | Claude Code | Pi | What actually has to be done |
|---|---|---|---|
| **Project instructions** | `CLAUDE.md`, cwd and ancestors, plus `~/.claude/CLAUDE.md` | `AGENTS.md` or `CLAUDE.md`, cwd and ancestors, plus `~/.pi/agent/` | **Nearly free.** Pi reads `CLAUDE.md` natively. Two traps: an `AGENTS.md` beside it wins and the `CLAUDE.md` is never read, and `~/.claude/CLAUDE.md` is not on Pi's path |
| **Packaged capability** | Skill: `SKILL.md` + frontmatter | Skill: same standard, more permissive | **Free.** One settings line points Pi at the Claude skills directory. This is the single most portable asset you own |
| **Named prompt** | `.claude/commands/*.md`, invoked `/name` | Prompt template, default `.pi/prompts/*.md`, **load path configurable by extension** | **Nearly free.** The body moves unchanged and positional `$1`/`$2` works on both. Point Pi at the existing directory rather than copying files |
| **Gate that must block** | `PreToolUse` hook -- external command, denies by exit status | `pi.on("tool_call")` -- typed function, returns `{ block: true, reason }` | **Reimplement, same shape.** Both block before execution. Claude's is a configured command; Pi's is code in-process |
| **Permission policy** | `permissions` in `settings.json`, declarative | No permission system at all | **Build it or bound it.** Either a `tool_call` extension, or `--tools` as an allowlist, or containerize |
| **Sub-agent** | `.claude/agents/*.md`, harness spawns it | Not built in. Example extension spawns a child `pi` process | **Reimplement, or move it to the controller.** The definition frontmatter is the same shape, so the *content* ports |
| **Tool protocol server** | Built in, configured | Not built in, by stated preference | **Replace with a command-line tool plus a skill**, which is what Pi documents and which also works on Claude Code |
| **Model per phase** | `--model`, or `model:` frontmatter | `--model`, fuzzy pattern | **Free**, through the adapter |
| **Tool restriction** | `--allowedTools` / `--disallowedTools` | `--tools` / `--exclude-tools` / `--no-tools` | **Free**, through the adapter |
| **Headless run** | `claude -p`, `--output-format stream-json` | `pi -p`, `--mode json`, `--mode rpc` | **Free**, but watch Pi's JSON-mode exit code -- it returns `0` on an errored turn |

## The question to ask when something has no counterpart

**A correction that generalizes.** This table previously said named prompts needed rewriting on the grounds that the Claude directory appears nowhere in Pi's source. It does not -- because Pi reads whatever an extension points it at, and a harness built to be configured does not name conventions in its code. **Absence of a hardcoded path proves a default, not a limit.** When a port looks blocked by a missing convention, check whether the convention is configurable before believing it.

**Not** "what is the other harness's version of this feature." That question frequently has no answer and makes the port look blocked.

**Instead:** what was this feature achieving, and how does the other harness achieve that? A gate implemented as a lifecycle hook and a gate implemented as a controller step are the same mechanism -- nothing proceeds until a check passes -- and both harnesses can do that, one natively and one because your controller decides what runs next.

If the mechanism genuinely cannot be reproduced, that is a real gap for [the capability surface](../foundations/Harness_Engineering/01_THE_CAPABILITY_SURFACE.md) and a decision to make deliberately, rather than a translation to keep hunting for.

## Porting a gated flow -- the worked case

The common shape: a flow that runs work, then a check, then refuses to continue if the check fails.

**On Claude Code** this is usually a `PreToolUse` hook plus permission rules -- configuration, no code.

**On Pi** it is an extension subscribing to `tool_call` and returning `{ block: true, reason }`. Three things that are easy to get wrong:

- **`ctx.hasUI` is false in headless modes.** A gate that only blocks when a confirmation dialog says so disappears in exactly the runs nobody is watching. Block unconditionally; treat any dialog as decoration.
- **First block wins and short-circuits**, and project-local extensions load before global ones. A project extension cannot fabricate a permissive decision, but it can mutate the tool input before a later gate sees it.
- **Throwing also blocks.** The dispatcher deliberately does not catch, so a broken gate fails closed. Prefer the typed object anyway, because you control the reason the model is given.

**The better answer for a portable workflow is neither.** Put the gate in the controller, where it holds on both harnesses and can be tested with no harness present, and treat the harness-native gate as defence in depth rather than as the mechanism. Two enforcement points are not redundant when only one of them travels.

## What a "build once, run on both" workflow really looks like

**Moves unchanged:** skills, instruction-file content, prompt bodies, the controller, its state and gates, and every deterministic check.

**Needs a per-harness implementation:** invocation, model and tool flags, structured-output extraction, gate wiring if you want harness-native enforcement, and sub-agent spawning.

**Should not be attempted:** maintaining two hand-edited copies of the same workflow. Emit two artifacts from one definition if you must have two, and treat the emitted ones as build output nobody edits.

**The honest ceiling:** a workflow claimed to run on a harness it has never run on is a documentation claim, which ranks near the bottom of the evidence hierarchy for good reason. Two targets means testing on two.
