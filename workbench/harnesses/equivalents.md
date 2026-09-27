# 🗺️ Claude world and Pi world

The vocabulary map, the injection points, and the lifecycle -- side by side.

> **Verified 2026-09-13**, against Pi **v0.85.1** (commit `71dca87`, read from source) and Claude Code as documented on that date (closed source, so documentation and observed behaviour only). Two moving targets; re-verify anything you are about to build on.

For the concept underneath this -- why the injection point you choose matters and which choices fail silently -- see [`foundations/Harness_Engineering/03_INJECTION_POINTS.md`](../foundations/Harness_Engineering/03_INJECTION_POINTS.md). This file is the per-harness fact.

## Vocabulary

Same idea, different name. Where the row says the formats match, an artifact genuinely moves.

| Idea | Claude world | Pi world | Portable? |
|---|---|---|---|
| Project instructions | `CLAUDE.md` | `AGENTS.md`, or `CLAUDE.md` as a fallback name | **Yes.** Pi reads the filename natively |
| Personal global instructions | `~/.claude/CLAUDE.md` | `~/.pi/agent/AGENTS.md` | **No.** Pi does not look in `~/.claude/` |
| Organisation-wide instructions | Managed policy file, or a `claudeMd` settings key | No equivalent | **No** |
| Packaged capability | Skill -- `SKILL.md` + frontmatter | Skill -- same standard | **Yes.** The one genuinely free asset |
| Named prompt | Slash command, `.claude/commands/*.md` | Prompt template, default `.pi/prompts/*.md`, path configurable | **Yes** -- body and positional args both port; point Pi at the directory |
| Delegated agent | Subagent, `.claude/agents/*.md`, built in | Not built in; an extension spawns a child process | Definition format matches; the mechanism does not |
| Gate before a tool runs | `PreToolUse` hook -- an external command | `pi.on("tool_call")` -- a typed function in-process | Same shape, different substrate |
| Command fired on an event | Hook -- a `hooks` entry in settings, matched on an event | `pi.on("<event>")` -- an extension subscribing to it | Same mechanism, different substrate; the command body ports, the wiring does not |
| Declarative permission policy | `permissions` in settings | None | **No.** Build it or bound the tool set |
| Response shaping | Output style | `SYSTEM.md` / `APPEND_SYSTEM.md` | Concept ports, format does not |
| External tool integration | Tool protocol servers, built in | Not built in; CLI tools surfaced as skills | The CLI-tool approach works on both |
| Installable bundle | Plugin | Package | Concept ports, format does not |
| Settings | `.claude/settings.json` | `.pi/settings.json` | Keys differ entirely |
| Extension point | Hooks, configured | Extensions, written in TypeScript | Different in kind |

## Injection points -- where text enters, and what it costs

The two columns that matter most are the last two. **Persistence** and **compaction survival** are what decide whether a thing you wrote is still in effect an hour into a run.

### Claude world

| What | Lands as | Persists | Survives compaction |
|---|---|---|---|
| `CLAUDE.md` | **A user message** after the system prompt -- not the system prompt itself | Yes | **Yes** -- re-read from disk and re-injected |
| Nested `CLAUDE.md` | A user message, loaded on demand when files in that directory are read | Yes | Reloads when matching files are read again |
| `--system-prompt` | Replaces the system prompt | Yes | Yes |
| `--append-system-prompt` | Appends to the system prompt | Yes | Yes |
| Output style | System prompt | Yes | Yes |
| Slash command | A user message -- the rendered body | As history | As history |
| Skill | Description only at startup; the **body enters as a user message on invocation** | Body persists once invoked | **Descriptions do not reload.** Only invoked skills persist, capped per skill |
| Subagent definition | The **subagent's own system prompt** -- it does not receive the parent's system prompt, history, skills or output style | Within that subagent | n/a |
| `@file` in an instruction file | Expanded inline, up to four hops | With its host | With its host |
| `UserPromptSubmit` hook stdout | Added to context, or structured via `additionalContext` | As history | As history |
| `SessionStart` hook stdout | Added to context; a `compact` matcher can re-inject after compaction | As history | Re-injectable by design |

### Pi world

| What | Lands as | Persists | Survives compaction |
|---|---|---|---|
| `AGENTS.md` / `CLAUDE.md` | **Inside the system prompt**, wrapped in a `<project_context>` block | Yes | Yes |
| `SYSTEM.md` | **Replaces** the built-in system prompt; does not suppress context files | Yes | Yes |
| `APPEND_SYSTEM.md` | Appends to the system prompt | Yes | Yes |
| `--system-prompt` / `--append-system-prompt` | Same two behaviours, per invocation; the append flag accepts text or a file path | Yes | Yes |
| Prompt template | A user message | As history | As history |
| Skill | Name and description in the system prompt at startup; body read on demand by the model | As history once read | As history |
| `before_agent_start` event | Can rewrite the system prompt for the run; chains across extensions | Yes | Yes |
| `context` event | Filters or replaces message history **before every model call** | Per call | n/a -- runs after compaction too |
| `before_provider_request` | Replaces the serialized payload wholesale | Per call | n/a |

### The difference that catches people

**Claude puts project instructions in the conversation; Pi puts them in the system prompt.**

That single divergence changes how the same file behaves. In Pi it is standing instruction -- above the conversation, unconditionally present, immune to anything that happens to history. In Claude it is a message, which is why Claude has to **re-read and re-inject it after compaction** to get the same effect. Both end up durable; only one is durable by construction.

The consequence for a portable workflow: **do not rely on the position, rely on the guarantee.** If a rule must hold for the whole run on both harnesses, the reliable place for it is the controller, and the instruction file is a strong hint rather than the mechanism.

## Lifecycle

Both harnesses expose events around the same run shape. The substrate is the difference: **Claude hooks are configured external commands that answer by exit code and JSON on stdout; Pi extensions are typed TypeScript functions in the same process.** One is language-agnostic and easy to wire; the other shares a type system with your controller.

| Point in the run | Claude world | Pi world |
|---|---|---|
| Session begins | `SessionStart` (matchers include `compact`) | `session_start` |
| User input received | `UserPromptSubmit` | `input` -- can continue, transform, or handle entirely |
| Named prompt expands | `UserPromptExpansion` -- **can block** | Handled before the `input` event |
| Before the model call | -- | `context` (filter history), `before_agent_start` (rewrite system prompt), `before_provider_request` (rewrite payload) |
| **Before a tool runs** | **`PreToolUse` -- can deny** | **`tool_call` -- can block** |
| Permission decision needed | `PermissionRequest`, `PermissionDenied` | No equivalent -- there is no permission system |
| After a tool runs | `PostToolUse`, `PostToolUseFailure`, `PostToolBatch` | `tool_result` -- can rewrite the result, cannot un-run the tool |
| Turn / message boundaries | `MessageDisplay`, `Stop`, `StopFailure` | `turn_start`, `turn_end`, `message_start`, `message_update`, `message_end` |
| Run actually finished | `Stop` | **`agent_settled`** -- not `agent_end`, which may still retry or compact |
| Subagent | `SubagentStart`, `SubagentStop` | n/a -- not built in |
| Compaction | `PreCompact` (**can block**), `PostCompact` | `session_before_compact` (**can cancel**), `session_compact` |
| Model switch | `PreModelSwitch` (**can deny**), `PostModelSwitch` | `model_select` (observe only) |
| Config or instructions change | `ConfigChange` (**can block**), `InstructionsLoaded`, `FileChanged` | -- |
| Trust decision | -- | `project_trust` -- **required**, decides whether project resources load |
| Session ends | `SessionEnd` | `session_shutdown` |

### Denying a tool call, concretely

**Claude world** -- either exit `2` from the hook, with stderr carrying the reason, or exit `0` with JSON:

```json
{ "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "..." } }
```

**Pi world** -- return a typed object from the handler:

```ts
return { block: true, reason: "..." };
```

Both prevent execution and feed the reason back to the model. In Pi, **throwing also blocks**, deliberately -- the dispatcher does not catch, so a broken gate fails closed.

### Firing a command on an event, rather than blocking one

> **Added 2026-09-16.** This section recombines the events and substrates verified above; no product behaviour was verified beyond what the tables already carry.

A rule of the form *"whenever Y happens, run X"* is, on both harnesses, a subscription to one of the lifecycle events above -- the same surface a gate uses, asked to fire rather than to deny. The concept and the decision of what belongs there are in [`foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md`](../foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md); this is the per-harness fact.

| | Claude world | Pi world |
|---|---|---|
| How it is declared | A `hooks` entry in `.claude/settings.json`: an event name, an optional matcher, a command to run | `pi.on("<event>", handler)` inside a TypeScript extension |
| What actually runs | An external command -- JSON on stdin, answers by exit code and stdout | A typed function in the agent's own process |
| Firing points that suit a trigger | `SessionStart`, `UserPromptSubmit`, `PreToolUse` / `PostToolUse`, `Stop`, `SessionEnd`, `PreCompact` / `PostCompact` | `session_start`, `input`, `tool_call` / `tool_result`, `turn_end`, `agent_settled`, `session_shutdown` |
| Narrowing which occurrences fire | A matcher on the event, plus whatever the command decides for itself | The handler receives the typed event and decides |
| Feeding text back into the run | Hook stdout enters context on `UserPromptSubmit` and `SessionStart`, or structured via `additionalContext` | Return from `input`, or inject through `context` / `before_agent_start` |

**The shape people arrive with is a script that checks whether the event has happened and, if so, runs the command** -- polling, because nothing was watching on its behalf. Both harnesses replace the checking half: the runtime already knows the event occurred and hands it over. **What ports is the command; what does not is the polling**, and dropping it is the point rather than a detail of the translation.

Two consequences specific to these two harnesses:

- **Claude's is configuration, Pi's is code.** A trigger on Claude Code can be added without a build step and is language-agnostic; the same trigger on Pi shares a type system with the controller and can read the typed event. Neither is better in general and the difference decides how much of the trigger's logic sits in the wiring versus in the command.
- **Pi has no session-scoped "run finished" distinct from the turn.** `agent_settled` is the honest end-of-run point, not `agent_end`, which may still retry or compact -- a trigger hung on the wrong one of those fires early and looks intermittent.

## The asymmetries worth knowing before you build

- **A Claude hook can tighten but never loosen.** `PreToolUse` fires *before* the permission-mode check, a hook `deny` blocks even under the most permissive mode, and a hook `allow` does not override a deny rule. Pi has no permission layer for a gate to interact with at all, so its extension *is* the policy.
- **Pi's gate is a policy layer, not a security boundary.** Pi ships no sandbox and says so; extensions run with the process's permissions. Claude's permission system is enforced by the harness. Neither is a substitute for isolation -- see [`DevOps/01_ISOLATION_AND_SANDBOXING.md`](../foundations/DevOps/01_ISOLATION_AND_SANDBOXING.md).
- **Pi's headless gate has a trap.** `ctx.hasUI` is `false` in `print` and `json` modes. A gate that only blocks when a confirmation dialog says so silently disappears in exactly the runs nobody is watching.
- **Exit codes differ in a way that will bite a controller.** Claude's headless mode returns non-zero on failure. Pi's `-p` does, but **`--mode json` returns `0` even when the turn errored** -- inspect the event stream, not the status.
- **Structured output is provider-level in Pi, tool-level in Claude.** Pi exposes `constrainedSampling` with `strict: "require"`, or a terminating tool carrying a typed payload. Claude offers `--output-format json` with a supplied schema.
- **Subagents are free in one world and a build in the other.** Claude spawns them from a definition file. Pi's reference approach spawns a child `pi --mode json -p` process per delegation and parses its event stream -- which is, notably, exactly what a controller would do anyway.

## Tools

| | Claude world | Pi world |
|---|---|---|
| Built-in set | File read/write/edit, search, shell, web, task management | `read`, `write`, `edit`, `bash`; `grep`, `find`, `ls` exist and are **off by default** |
| Override a built-in | Not exposed | Register a tool with the same name |
| Register a tool in-loop | Not exposed -- arrives as a skill or an external server | Yes, at runtime as well as when embedding |
| Restrict per invocation | `--allowedTools` / `--disallowedTools`, plus permission rules | `--tools` (strict allowlist), `--exclude-tools`, `--no-tools`, `--no-builtin-tools` |
| Restrict at runtime | Permission rules and modes | `setActiveTools(names)` from an extension |
| Add a tool | Tool protocol server, or a skill wrapping a CLI | `registerTool()` in an extension, at load or after startup |
| Replace a built-in | Not exposed | Register a tool with the same name |
| Read-only run | Allow only read-shaped tools | `--tools read,grep,find,ls` -- **omitting `bash` is what makes it read-only**; an allowlist containing `bash` is not a restriction |

## Sources

[Claude Code docs](https://code.claude.com/docs/en/hooks.md) · [earendil-works/pi](https://github.com/earendil-works/pi) · [Agent Skills specification](https://agentskills.io/specification)
