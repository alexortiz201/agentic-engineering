# 💉 Injection points

Every harness offers several distinct places to put text into a run. They are not interchangeable, and choosing the wrong one is a defect that produces no error -- the run works, and then behaves wrongly later, for reasons that are hard to trace back to the choice.

## The four questions that separate them

Any injection point is characterised by the answers to four questions. A harness's documentation usually answers the first and rarely answers the rest.

| Question | Why it decides the choice |
|---|---|
| **Where does it land in the request?** | Instructions carried above the conversation are weighted differently from a message inside it. The same words in the two positions do not produce the same behaviour |
| **Does it persist across turns?** | Standing policy must persist. Task detail must not, or it accumulates and competes with the task actually in hand |
| **Does it survive compaction?** | This is the one that catches people. A long run compacts its history, and whatever lived only in the history can silently disappear |
| **Is it re-sent every request?** | Persistent text is paid for on every call for the whole run. A large standing instruction is a recurring cost, not a one-off |

## The two families

Almost every injection point is one of two kinds, and the difference is the one to internalise first.

**Standing instruction.** Carried above the conversation, re-sent on every request, unchanged by anything the run does. This is where policy, role, constraints and conventions belong. It persists, it survives compaction, and it costs on every call.

**Conversational content.** A turn in the exchange. It enters once, occupies history, and is subject to whatever the harness does to history over a long run -- which includes being summarized away.

The failure this distinction prevents runs in both directions:

- **Task detail placed as a standing instruction** never leaves. Three tasks later it is still there, competing with the current one, and the model is still being told about a file that no longer matters.
- **Standing policy placed as conversational content** decays. It holds for a few turns, then the history compacts, and the constraint that was supposed to bound the whole run is gone -- with nothing reporting that it went.

**A rule that must hold for a whole run does not belong in the conversation.** If a harness offers no standing slot for it, the controller enforces it instead, because a constraint that can be summarized away was never a constraint.

## Layering, and why order is not precedence

Harnesses commonly assemble the standing instruction from several sources -- a base, a project file, an appended section, an override. Two things to establish for any given harness, because guessing wrong is silent:

- **Does a source replace or append?** A source that *replaces* the base prompt removes behaviour the harness relies on, which is sometimes exactly what is wanted and is never what is wanted by accident.
- **When several files could match, does one win or do they combine?** Both designs exist. Where one wins, adding a second file can silently suppress the first -- the new file appears to do nothing, and the old one stops being read.

**Position in the assembled prompt is not authority.** Later text does not override earlier text the way a configuration layer would; it is all one instruction, and contradictions between its parts are resolved by the model, unpredictably. Two sources that disagree do not produce the later one winning. They produce unreliable behaviour, which is worse than either.

## Injection during the run

Beyond the static slots, a harness may let code insert or rewrite content as the run proceeds -- before a turn, before each model call, or before the request is serialized. Where this exists it is powerful and it is the sharpest available tool for context management: pruning history, injecting a retrieved fact, or supplying state the model needs now and did not need earlier.

It is also the least portable thing in this document. **Treat dynamic injection as an optimisation, never as the mechanism.** A workflow that only behaves correctly because something was injected mid-run has a requirement it has not written down, and that requirement disappears on a harness without the hook.

## Choosing, in one pass

- **Is it true for the whole run, regardless of task?** Standing instruction.
- **Is it about this task only?** Conversational content.
- **Must it hold even if the history is summarized?** Standing instruction, or enforce it in the controller. Preferably both.
- **Is it large and rarely relevant?** Neither -- put it where it can be fetched on demand, and spend the standing slot on a pointer to it. A pointer costs a line per call; the document costs its whole length per call.
- **Is it a rule of the form "whenever Y happens, do X"?** Then the prior question is not which injection point but whether the runtime can fire it at all -- see [mechanized triggers](04_MECHANIZED_TRIGGERS.md). A trigger a runtime can observe should not be spending a standing slot.
- **Does it have to be obeyed rather than considered?** Neither. Instructions are weighted, not enforced. If it must hold, it is a gate, and a gate lives in code.

That last one is the most expensive mistake available here, because it looks solved. **Text is not enforcement**, however privileged its position in the request. A prohibition in a standing instruction is a strong prior and nothing more, and the moment it matters is exactly the moment a prior is not enough.
