# 🧾 Harness manifest -- what is actually installed on this bench

> Copy this file, fill it in against a real installation, and keep the copy with the bench it describes. **Nothing here is imported at runtime.**

**A conformance report says what a harness *can* do. A manifest says what *this bench* actually does.** Those are different documents and only one of them is a port plan. [`harnesses/`](../harnesses/README.md) holds the first kind; this is the template for the second.

The distinction is not pedantic. A harness's capability list is the set of things available to be used; a manifest is the set of things being used, each of which someone will have to rebuild on the next harness or deliberately drop. **Capability is not deployment**, and a port costed from a capability list is costed from the wrong document.

## The rule that makes this portable: key every row by capability, not by product feature

**A row whose identity is a product's feature name is an inventory of that product and ports to nothing.** A row whose identity is the capability it depends on ports mechanically, because [`harnesses/equivalents.md`](../harnesses/equivalents.md) already maps capabilities across harnesses.

| Written this way | Ports to |
|---|---|
| "a `PostToolUse` entry in `settings.json` matching `Bash`" | nothing -- it is one product's spelling |
| "`trigger:tool-completed` -- fires a command when a tool call matching a pattern finishes. **Currently realised as** a `PostToolUse` entry in `settings.json`" | any harness with a lifecycle surface, by one lookup |

Both sentences describe the same file. The second one survives the product being replaced, because the capability key is the stable half and the realisation is the disposable half. **Write the capability key first and the realisation second, every time**, including when there is only one harness in play and the second column looks redundant. It is redundant right up until the moment it is the only column that matters.

The keys used below are the vocabulary of [`foundations/Harness_Engineering/01_THE_CAPABILITY_SURFACE.md`](../foundations/Harness_Engineering/01_THE_CAPABILITY_SURFACE.md) and [`04_MECHANIZED_TRIGGERS.md`](../foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md). Extend the list when a bench genuinely does something new; **do not invent a key that is a product feature with the brand filed off**, which is the failure this whole convention exists to prevent.

## Row schema

Every table below uses the same six columns, so rows can be read across families.

| Column | Holds | Why it is there |
|---|---|---|
| **Capability key** | `family:verb` -- what this depends on, named without a product | The portable identity. This is what gets looked up during a port |
| **What it does** | One line, in terms of outcome | So a reader can decide whether it is worth porting at all |
| **Fires / loads when** | The trigger or load condition, stated neutrally | A trigger is half the behaviour, and the half most often lost in a port |
| **Realised as** | The product-specific spelling, with the exact path | The disposable half. **The only column allowed to name a product** |
| **If absent** | What actually breaks, concretely | A row nobody can cost is a row that gets dropped by accident |
| **Port** | `free` / `rebuild` / **`GAP`** | The output. `GAP` rows are the manifest's most valuable content |

**`If absent` is the column people skip and the one that decides the port.** A thing that would be missed by nobody should be recorded as such and then dropped rather than carried; a thing whose absence is silent is the thing that has to be rebuilt first. Writing "unknown" there is a legitimate answer and a better one than a guess.

## 1. Instruction -- text that reaches the model

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `instruction:always-loaded` | | | | | |
| `instruction:always-loaded-by-mechanism` | | | | | |
| `instruction:directory-scoped` | | | | | |
| `instruction:on-demand` | | | | | |
| `instruction:carried-forward` | | | | | |

**Separate `always-loaded` from `always-loaded-by-mechanism` even when both hold the same kind of text.** The first is found by file discovery and fails silently when the file moves; the second is pushed in by something that runs whether or not any file was found. They have opposite failure modes, so a manifest that merges them cannot answer the question a port actually asks -- *which of these still holds when the filesystem is not the one it was written on.*

## 2. Mechanized triggers -- things the runtime fires

One row per trigger. If a trigger exists only as an instruction the agent is meant to notice, **it does not belong in this table** -- it belongs in section 1, and the gap between the two tables is the honest measure of how much of this bench is mechanized.

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `trigger:session-opened` | | | | | |
| `trigger:prompt-submitted` | | | | | |
| `trigger:tool-completed` | | | | | |
| `trigger:run-finished` | | | | | |

For each, also record:

- **Filter placement.** Whether the narrowing is declarative, inside the mechanism, or both. [Both is the rule](../foundations/Harness_Engineering/04_MECHANIZED_TRIGGERS.md); a manifest row that says "declarative only" is flagging a version coupling.
- **Failure direction.** Does it degrade to silence or to breakage? A trigger that can block work is a gate and belongs in section 3.
- **Where the firing condition lives.** If it is data in its own file, name the file -- that is the part a port has to carry and the part most likely to be left behind.

## 3. Gates -- things that refuse

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `gate:declarative-tool-policy` | | | | | |
| `gate:pre-tool-command` | | | | | |

**A gate recorded here is a gate that lives in the harness, which means it does not travel.** That is not a reason to omit it -- it is the reason to record it, because [a gate that exists only as a hook disappears on a harness without hooks](../foundations/Harness_Engineering/01_THE_CAPABILITY_SURFACE.md), silently. Where the same check also exists in a controller, say so in the row; where it does not, the row is a `GAP` regardless of how well it works today.

## 4. Packaged capability and bundles

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `capability:packaged` | | | | | |
| `bundle:installed-set` | | | | | |

Record **how each one is installed**, not just that it is: copied in, linked from elsewhere, or fetched from a registry. The three have different port costs and very different failure modes, and only one of them survives the source of the link being deleted.

## 5. External tools

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `tool:external-protocol-server` | | | | | |
| `tool:browser-control` | | | | | |
| `tool:local-binary` | | | | | |

**Say where each tool's configuration actually lives.** A tool configured in a local file ports by copying the file; one provisioned by an account or an organisation does not port at all, and the manifest is where that asymmetry gets noticed rather than discovered.

## 6. Invocation and delegation

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `invocation:default-model` | | | | | |
| `delegation:nested-agent` | | | | | |

## 7. State the bench reads and writes

| Capability key | What it does | Fires / loads when | Realised as | If absent | Port |
|---|---|---|---|---|---|
| `state:operator-store` | | | | | |
| `state:transcript` | | | | | |

## 8. Gap register -- rows with no equivalent

**Copy every `GAP` row from above into this one table.** Duplication is deliberate: the gaps are what a port costs, and a cost spread across eight tables is a cost nobody totals.

| Capability key | Why there is no equivalent | What the port must do instead | Decided? |
|---|---|---|---|

Three honest resolutions, in the order [the capability surface](../foundations/Harness_Engineering/01_THE_CAPABILITY_SURFACE.md) gives them: **build it on top**, **design around it**, or **narrow the claim**. Record which one was chosen. A `GAP` row with an empty `Decided?` cell is a decision that has not been made, which is different from one that has been made and is unfinished -- and the difference is exactly what a reader coming back cold needs.

## 9. Fragility register -- what breaks without anyone doing anything

Not a capability table. This is the set of things that are load-bearing today and would fail quietly tomorrow, and it is the section a bench most benefits from and least often has.

| What | Depends on | Failure is | Noticed how? |
|---|---|---|---|

Populate it from these questions, each of which has caught a real bench:

- **Which entries are links to somewhere else, and does that somewhere else outlive this bench?** A broken link usually reads as *absent* rather than as an error, so it produces silence rather than a message.
- **What has no committed copy anywhere?** A bench directory that is not under version control is safe from every repository operation and has no history, which is the same property viewed from both sides.
- **What does a mechanism depend on that could simply not be installed** -- a parser, a helper binary, a file of patterns?
- **Which detector shares a fate with the thing it detects?** A guard reporting a missing file must not live behind that file.
- **What is pinned to a version that auto-updates?** An auto-updating dependency is a fine thing and an unrecorded one is a moving floor.

## Porting with this file -- the three-step procedure

1. **Read the manifest**, top to bottom. Every row is either something to rebuild or something to deliberately drop; there is no third category, and marking a row "drop" is a real answer.
2. **Look each capability key up** in [`harnesses/equivalents.md`](../harnesses/equivalents.md) and rebuild against the target harness's spelling. [`harnesses/porting.md`](../harnesses/porting.md) is organised by mechanism for exactly this traversal.
3. **Work the gap register.** These do not have a lookup, which is why they are separated out -- each one is a build, a redesign, or a narrowed claim.

**Where a lookup comes back empty, do not conclude the port is blocked.** Ask [what the thing was achieving](../foundations/Harness_Engineering/02_PORTABILITY.md) rather than what the other harness calls it. Absence of a named equivalent proves a naming difference far more often than it proves a missing capability, and a configurable load path is not the same as a hardcoded one.

## Keeping it true

**A manifest is a claim about a live machine, so it rots exactly like a conformance report does.** Two properties keep it honest:

- **Date it, and date each row that was verified separately.** Undated, it will be believed at whatever age it happens to be.
- **Record the evidence, not the belief.** A row saying *"verified by piping a payload to the script"* is worth several saying *"installed"*. What was observed to reach the model is stronger than what was configured to.

Re-survey whenever the bench is reconfigured, and treat *"I do not know whether this still fires"* as a finding to write down rather than a gap to fill with something plausible.
