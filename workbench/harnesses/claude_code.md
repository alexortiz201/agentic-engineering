# 🅰️ Claude Code

Anthropic's coding agent. Closed source, available as a terminal CLI, desktop and web app, and IDE extensions.

> **Verified 2026-09-13.** Closed source, so every claim here rests on documentation and observed behaviour rather than on reading the implementation -- which is a weaker basis than the Pi report and should be treated as such.

The design is the inverse of Pi's: capabilities ship in the product and are configured rather than composed. That means most of the surface below is satisfied out of the box, and the cost is that the ones it does not satisfy are harder to add.

## Against the capability surface

| Capability | Provided | How |
|---|---|---|
| Bounded invocation | Yes | `claude -p "prompt"` headless; `--output-format stream-json` for an event stream |
| Model selection per call | Yes | `--model` flag, or `model:` frontmatter on a skill or subagent definition |
| Tool constraint per call | Yes | `--allowedTools` / `--disallowedTools`, `permissions` in `settings.json`, and a `tools:` list in a subagent definition |
| Structured return | Partly | No provider-level constrained decoding exposed. A tool with a schema is the practical route, and `--output-format json` returns a single result object |
| Distinguishable failure | Yes | Non-zero exit on failure; the stream-json result object carries an error flag |
| Retained transcript | Yes | Session transcripts on disk; the stream-json event log |

## Gating -- configured, and enforced by the harness

Gating has two mechanisms, and they sit at different levels.

**Permissions** are declarative, in `settings.json` -- allow and deny rules matched against tool invocations, with a permission mode governing how unmatched calls are treated. This is the mechanism most work uses, and it requires no code.

**Hooks** are configured commands that fire at lifecycle events. A `PreToolUse` hook runs before a tool executes and **can deny the call** by its exit status and output, which is the direct counterpart to Pi's blocking `tool_call` event. Other events cover session start, user prompt submission, post-tool, and stop.

The important structural difference from Pi: **a Claude Code hook is a configured external command, not a typed function in the same process.** It receives JSON on stdin and answers by exit code and stdout. That makes it language-agnostic and easy to wire, and it means the decision is not a typed object your controller shares a type system with.

**A hook can tighten but never loosen.** `PreToolUse` fires *before* the permission-mode check; a hook denial holds even under the most permissive mode, and a hook approval does not override a deny rule. That asymmetry is deliberate and is the property worth relying on.

**Interactive affordances exist and unattended runs do not get them.** Permission prompts assume a human. In headless runs the permission mode decides, and there is a flag that bypasses prompts entirely -- which is a real gate removed, not a formality, and belongs nowhere near an unattended run that can write.

### Hook mechanics, verified by building four of them

> **Verified 2026-09-16**, by writing and installing a working set against this harness. Stronger than the rest of this file, which rests on documentation -- these were established by observing what did and did not reach the model.

**What a hook returns depends on the event, and getting it wrong fails silently.**

- `SessionStart` and `UserPromptSubmit` inject **plain stdout** straight into context. Print text and it arrives.
- `PostToolUse` does **not**. Plain stdout from a `PostToolUse` hook is discarded; only `hookSpecificOutput.additionalContext` reaches the model, and it must be **nested under `hookSpecificOutput`** -- a top-level `additionalContext` key is accepted and silently ignored. A hook written the obvious way runs, exits cleanly, logs nothing wrong, and does nothing at all.

**Timeouts are not uniform.** `UserPromptSubmit` gets roughly **30 seconds**, where other events get on the order of ten minutes. A hook on that event has to be genuinely fast, and should bail early on input that is obviously not its case -- a very long prompt is pasted material rather than a sign-off, and checking its length is cheaper than matching patterns against it.

**Exit status is the blocking channel.** Exit `2` blocks the action; anything else does not. A hook that only observes should therefore **always exit `0`**, including on its own internal errors, so that a broken observer degrades to doing nothing rather than to blocking work. That is the [fail-open rule for observing hooks](../foundations/Agentic_Engineering/primitives/hook.md) with a concrete number attached.

**Declarative narrowing exists and should not be the only filter.** A `PostToolUse` entry can carry a matcher plus a further condition narrowing which invocations fire it. Useful, and worth pairing with the same check inside the script: if the declarative form is unsupported in a given version, or its shape changes, the script's own check still keeps it silent on every call it does not care about. The cost of the redundancy is one process spawn; the cost of relying on the declarative form alone is a hook that quietly fires on everything or on nothing.

**Verification is available and worth using**, because every failure above is silent. `/hooks` lists what is registered in a live session, and running the harness in debug mode shows each hook executing. A hook can also be exercised directly by piping it a payload on stdin, which is how to tell "my hook is wrong" apart from "my hook is not wired up".

## Configuration

- **`CLAUDE.md`** is the project instruction file, discovered in the working directory and ancestors, plus `~/.claude/CLAUDE.md` for personal global instructions and a managed policy location for organisation-wide ones. **It enters as a message in the conversation, not as part of the system prompt** -- which is why it is re-read from disk and re-injected after compaction rather than simply persisting.
- **`.claude/settings.json`** holds permissions, hooks, environment and model configuration, with a `settings.local.json` for personal overrides.
- **`.claude/commands/*.md`** are slash commands -- named prompt files invoked as `/name`.
- **`.claude/agents/*.md`** are subagent definitions, frontmatter carrying `name`, `description`, `tools`, `model`.
- **`.claude/skills/`** and `~/.agents/skills/` hold skills as `SKILL.md` directories following the Agent Skills standard. Only the **description** is present at startup; the body enters as a message when the skill is invoked, and then persists. **Skill descriptions do not reload after compaction** -- only the skills actually invoked survive it.
- **Output styles** modify the system prompt itself, unlike everything above.
- **`--system-prompt`** replaces the default system prompt; **`--append-system-prompt`** adds to it.

Where each of these lands, and what that costs, is tabulated against Pi in [`equivalents.md`](equivalents.md).

## Built in, and worth knowing are not portable

These are genuine advantages of the harness and each is a portability liability. Using them is fine; **depending on them silently is not.**

- **Sub-agents** are first class. A definition file is enough; the harness handles spawning, isolation of context, and returning a result.
- **A tool protocol** is built in, with configured servers exposing tools directly to the agent.
- **Hooks** are configured rather than written, so a gate is a settings entry rather than a program.
- **Plugins** bundle commands, agents, skills and hooks as an installable unit.

## What it is stronger at

Recorded because a comparison that only lists one side's advantages is not a comparison.

- **Out-of-the-box defaults.** A large standing instruction encoding practices that otherwise have to be built, and a low floor -- useful before it is configured.
- **Sub-agents, task tracking and multi-agent coordination are built in**, where a minimal harness requires each to be constructed.
- **Programmatic embedding is better supported**, with a more developed SDK surface.
- **Enterprise adoption.** Organisation-wide policy, managed configuration and support exist here and do not meaningfully exist in a single-maintainer open-source alternative. For an organisation rather than an individual this is frequently decisive on its own.

The trade is the other side of the same coin: strong defaults are opinions you did not choose, and a closed product changes on its owner's schedule rather than yours.

## Sources

[Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) · [Agent Skills specification](https://agentskills.io/specification)
