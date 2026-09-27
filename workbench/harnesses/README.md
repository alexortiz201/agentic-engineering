# 🔀 Harnesses -- what each one actually does

Per-harness fact, kept deliberately outside `foundations/`.

The discipline is in [`foundations/Harness_Engineering/`](../foundations/Harness_Engineering/README.md) and names no product, because the rule keeping `foundations/` portable bars naming a harness. **This folder is where the names go.** It changes as often as these products do, which is often.

## What is in here

| File | Answers |
|---|---|
| 🅰️ [`claude_code.md`](claude_code.md) | What Claude Code provides, against the capability surface |
| 🅿️ [`pi.md`](pi.md) | What Pi provides, against the same surface |
| 🗺️ [`equivalents.md`](equivalents.md) | The vocabulary map, the injection points, and the lifecycle, side by side |
| 🔁 [`porting.md`](porting.md) | The mechanism-by-mechanism translation between them |

**What is deliberately not in here: what any one bench actually has installed.** These files say what each harness *can* do, and capability is not deployment -- a port costed from a capability list is costed from the wrong document. The inventory of a real installation is keyed by capability so that it looks up against [`equivalents.md`](equivalents.md) row by row, and its template is [`templates/harness_manifest.md`](../templates/harness_manifest.md). It lives there rather than here because a manifest describes a machine rather than a product, so it is filled in per bench and never committed.

Each conformance report answers the same questions in the same order, so they can be read side by side. **The gaps are the point** -- a feature comparison produces admiration, a conformance report produces a work list.

## The three questions this folder exists to answer

1. **"I am building this for one harness -- how does it work on the other?"** Read both conformance reports at the same heading.
2. **"Here is an existing flow on one harness -- how do we port it?"** Read [`porting.md`](porting.md), which is organised by mechanism rather than by feature, because the feature usually has no counterpart while the mechanism always does.
3. **"Can we build once and run on both?"** Partly, and the honest answer is in [`porting.md`](porting.md) under what actually moves. Skills and instruction files move. Gates, sub-agents and tool wiring are reimplemented against the same controller.

## Every file here carries a verification date

**A file in this folder opens with when it was verified, and against what version.** That is the convention, and it is not decoration: every claim here is a claim about a product that changes weekly, and a report that has quietly gone stale is worse than an absent one, because it will be believed.

Prefer a linked source over a remembered fact, and say which basis a claim rests on. Reading a product's source is stronger evidence than reading its documentation, and where only the documentation is available -- as with a closed-source harness -- say so rather than presenting both at the same confidence.

**`foundations/` is deliberately not dated, and the contrast is the point.** Discipline does not expire on a vendor's release schedule. A rule there earns its place by being true anywhere, so a date on it would suggest a shelf life it does not have -- and would invite the reader to discount it as stale when nothing about it had changed. Dating is for facts that rot. The two folders are split precisely so the rotting ones are quarantined here, where a date is the warning label.

**Do not write aspiration here.** If a capability is supplied by a third-party extension rather than the product, say so and say whose. If something was not verified, mark it unverified rather than rounding it up.
