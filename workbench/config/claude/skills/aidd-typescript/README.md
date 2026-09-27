# aidd-typescript

Type-layer discipline for TypeScript: strictness by hand, narrowing, erasure-safe constructs, and modeling illegal states out.

**Locally authored, not upstream.** The rest of the `aidd-*` set is symlinked from a third-party open-source rule library, which is consumed read-only; this one was written to fill a gap in it and lives here as a real directory rather than inside that checkout. Keep that distinction when comparing behaviour against upstream — this skill is ours, and changes to it are not changes to that library.

## Why it exists

The upstream set's JavaScript guide is titled "JavaScript/TypeScript" and its body is pure JavaScript: composition, immutability, naming, comments. Nothing in it addresses `any` versus `unknown`, narrowing, discriminated unions, generics, `readonly`, or strictness. Measured across the installed skills, the TypeScript-shaped vocabulary amounted to the word "interface" used structurally and a single `as const`.

That is a real gap rather than an oversight of emphasis, because **the type layer is the half a JavaScript rule set cannot reach.**

## The composition principle

TypeScript is JavaScript plus a type layer that is erased at compile time. Everything surviving compilation is already governed by the JavaScript guide, so this skill deliberately owns only what the compiler erases and delegates the rest. Two skills sharing the same function should share the abstraction; duplicating the runtime rules here would be inlining, not composition.

The practical consequence when reviewing: if a finding would still be true with every type annotation deleted, it belongs to the JavaScript guide, not this one.

## Why strictness-by-hand is the centre of it

Where a project disables `strict` or `strictNullChecks`, these rules cannot be enforced by the compiler and become authoring discipline. That is not a hypothetical posture — it is the common case in a mature codebase that predates strict mode, and it is precisely where a defect can be simultaneously wrong and type-correct.

The motivating example: a selector whose composite key lookup missed, returning an absent value that flowed into a comparator and silently disabled a sort. With null-checking off, nothing in the type system objected. The same code under strict mode does not compile.

## Attribution

The technique catalogue in [`references/type-driven-development.md`](references/type-driven-development.md) is synthesised from the 26-part **Type Driven Development** series by **Jesse Warden** — <https://jessewarden.com>, June–July 2026. The framing, the technique set, and most of the worked examples are his.

What is ours is the **verdict per technique**, because the series is written for `strict: true` and this codebase is not. Every strictness claim was re-verified against `tsc` rather than carried over, and three of the series' claims did not survive that:

- `type EnvVar = string | undefined` compiles identically to `string` — the `Maybe` example erases to nothing.
- A smart constructor returning `T | undefined` enforces nothing; the tagged-result shape does.
- `'x' as Email` compiles at every strictness level — a brand blocks accident, not intent.

None of that is a criticism of the series. It is what happens when advice written for one configuration meets another, and it is the reason the reference exists rather than a link.

**Nothing from the series is discarded.** Techniques this codebase cannot enforce are kept in full, each labelled with *what* disables it — a compiler flag in most cases, the touched-files scope rule in two — and what would bring it back. The day `strictNullChecks` is turned on, the list of newly-available techniques is already written.

## What was deliberately not ruled on

- **`interface` versus `type`.** No position taken. Both are idiomatic, and a repository that has settled on one should not acquire a second convention because a rule set arrived.
- **Blanket removal of `any`.** The rules govern code being written. Existing `any` outside the current change is left alone by the scope constraint, which is deliberate: the alternative is a diff nobody can review.

## Commands

| | |
|---|---|
| `/aidd-typescript review` | apply the discipline to the current change, touched files only |
| `/aidd-typescript strictness` | report which compiler protections are on, which are off, and what that makes the author responsible for |
| `/aidd-typescript techniques` | the catalogue — what survives strict being off, what is decoration, what to skip |
