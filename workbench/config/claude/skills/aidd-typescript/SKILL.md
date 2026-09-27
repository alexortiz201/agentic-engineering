---
name: aidd-typescript
description: TypeScript type-layer discipline — strictness by hand, narrowing, erasure-safe constructs, and modeling illegal states out. Use when writing or reviewing TypeScript types, signatures, generics, or when working in a codebase with strict mode disabled.
compatibility: Composes with aidd-javascript, which governs everything this skill does not — see Composition.
---

# 🔷 TypeScript type-layer guide

Act as a top-tier engineer with serious type discipline to model data so that wrong states fail to compile.

## Composition — what this skill is not

**TypeScript is JavaScript plus a type layer that is erased at compile time.** Once the types are stripped, what runs is JavaScript. So everything about the code that survives compilation — composition, purity, immutability, naming, comments, control flow — is governed by [javascript](../aidd-javascript/SKILL.md) and is **not repeated here**.

```
f: source + type context → type-level decisions
```

This skill owns only what the compiler erases. Reach for javascript for the rest, [tdd](../aidd-tdd/SKILL.md) for test design, and [structure](../aidd-structure/SKILL.md) for where a type lives.

import references/type-driven-development.md

**The technique catalogue** -- what each pattern is, whether it survives `strictNullChecks: false`, and what to skip -- is in that reference. Read it when choosing a technique; the constraints below are the standing rules.

Synthesised from the 26-part *Type Driven Development* series by **Jesse Warden** (<https://jessewarden.com>), with every strictness verdict re-verified against the compiler.

Competencies {
  type modeling (making illegal states unrepresentable)
  narrowing (moving from unknown to known at a boundary)
  strictness by hand (writing as if strict were on when it is not)
  erasure-safe authoring (choosing constructs that leave no runtime trace)
}

## Scope — a hard constraint, not a preference

ScopeConstraints {
  Apply every rule below **only to files this change creates or already touches.**
  Never sweep the repository to conform existing files, however clearly they violate a rule.
  (a rule identifies work outside the current change) => report it, do not do it
  (the codebase already has a convention for something below) => conform to it; a standard is not a licence to introduce a second one
}

A wide diff cannot be reviewed for the change it was opened to make. Naming what was found and deliberately left alone is the correct deliverable.

## The erasure test

Constraints {
  Prefer constructs that vanish at compile time. If a type-level choice emits runtime code, it is a runtime choice and belongs to javascript's rules instead.
  Avoid `enum` — it emits an object. Use a union of string literals, with `as const` where a value list is needed.
  Avoid parameter properties (`constructor(private x)`), runtime `namespace` bodies, and legacy decorators. All emit.
  (the module setting is isolatedModules) => re-export types with `export type { T }`, never a bare re-export
  Type-only imports are `import type` so the import is guaranteed to erase.
}

## Strictness by hand

The rules that matter most where `strict` or `strictNullChecks` is **off**, because there the compiler cannot enforce them and they become authoring discipline.

Constraints {
  Write every touched file as though strictNullChecks were on.
  Never assign `null` or `undefined` to a non-nullable annotation. `let x: number = null` is the signature of a codebase the compiler has stopped protecting.
  (a lookup, find, index access, or map get can miss) => handle the missing branch explicitly at the call site; do not let the absent value flow onward
  A value that can be absent is typed `T | undefined` and narrowed before use — not annotated `T` and hoped for.
  Never use the non-null assertion `!` to silence a possibility. Narrow, or make the type honest.
  A brand proves **was validated if present**, never **is present** -- `null` is assignable to a branded type here. Do not read a brand as a null guarantee.
  A type predicate is an assertion the compiler believes rather than checks. A guard that forgets a field yields a value whose missing property the type system will then swear is present.
  New signatures declare their parameter and return types explicitly; implicit `any` is not acceptable in code being written even where the compiler permits it.
}

## any, unknown, and the boundary

Constraints {
  `unknown` over `any`, always. `unknown` forces the narrow that `any` skips.
  `any` is permissible only at a boundary the types cannot see — a parse, an untyped dependency, a legacy call — and only with an immediate narrow on the next line.
  `as` is an assertion that the compiler is wrong. Prefer a type guard, which is a claim the compiler can check.
  Parse at the boundary; trust inside. Validate once where data enters, then let the internal types carry the guarantee.
  (a cast appears in the middle of a module) => the boundary is in the wrong place
}

## Modeling

Constraints {
  Make illegal states unrepresentable. Prefer a discriminated union over an object of mutually-exclusive optional fields.
  Name the discriminant explicitly and **close every switch with `default: return assertNever(x)`**. Verified: the implicit form -- a switch with no default, relying on the declared return type -- compiles silently when a case is missing, because the implicit `undefined` is assignable to the return type where nullability is untracked. The explicit arm errors correctly. Exhaustiveness here is a review rule, not a compiler guarantee.
  (two values share a primitive type and are not interchangeable) => give each a branded type, `T & { readonly [brand]: 'Name' }`, and route construction through one function
  (a constructor validates) => return `{ ok: true, value } | { ok: false, error }`, never `T | undefined`. Reading `.value` off the failure branch is a property error the compiler still catches; the `undefined` union is erased and enforces nothing.
  (a function can fail in more than one way) => make the error a tagged union carrying each variant's own context, not `Error` or `string`. This one is free: callers that ignore the tag keep compiling.
  (a function reaches for an ambient client, fetch or storage) => take it as a function-typed parameter instead, so the signature lists what it can reach. Do not thread it deeper than the file being changed.
  `readonly` for data that is not meant to change — the type-level expression of javascript's immutability rule.
  Prefer inference for locals; annotate what is exported, because an exported signature is the contract and inference makes it change silently.
  Generics only to express a relationship between an input and an output. If a type parameter appears exactly once, it is doing no work — use the concrete type.
  (a type is becoming hard to read) => the data shape is probably wrong; fix the shape before reaching for more type machinery
}

## Steps

```sudolang
assessStrictness(project) => posture {
  read the compiler configuration: strict, strictNullChecks, noImplicitAny, allowJs, isolatedModules
  (strict is off) => every rule under "Strictness by hand" is authoring discipline, unenforced
  report which protections are absent rather than assuming the compiler is helping
}

modelTypes(change) => types {
  identify the states the data can actually be in
  (states are mutually exclusive) => discriminated union
  (a field is optional only in some states) => it belongs to one member, not to the whole
  make the absent case explicit in the type
}

narrowAtBoundaries(types) => safeSurface {
  locate where untyped or foreign data enters
  validate once, there
  (a narrow is needed deep inside) => move the boundary outward instead
}

verify(safeSurface) => report {
  run the project's typecheck over the touched files
  state which rules were applied, and name anything found outside scope that was deliberately left alone
}

review = assessStrictness |> modelTypes |> narrowAtBoundaries |> verify
```

Commands {
  🔷 /aidd-typescript review — apply the type discipline to the current change, touched files only
  📐 /aidd-typescript strictness — report which compiler protections are on, which are off, and what that makes the author responsible for
  📚 /aidd-typescript techniques — the catalogue: what survives strict being off, what is decoration, what to skip
}
