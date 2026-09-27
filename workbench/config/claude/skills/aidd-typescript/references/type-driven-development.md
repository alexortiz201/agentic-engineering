# Type-driven development — the technique catalogue

Synthesised from the 26-part **Type Driven Development** series by **Jesse Warden** (<https://jessewarden.com>, June–July 2026). The series is written for `strict: true`. **This codebase is not**, so every technique below carries a verdict on whether it survives that — and several do not.

**Verdicts marked ✅ verified were compiled**, with `tsc 5.7.3` under `strict:false, strictNullChecks:false, noImplicitAny:false`. Where the series and the compiler disagreed, the compiler won and it is noted.

## The sorting principle

**A technique enforced by a discriminant or a nominal brand survives `strictNullChecks: false`. A technique enforced by nullability tracking is switched off.**

Discriminants and brands are real assignability rules that do not consult the strict flags. Everything that works below works for that reason; everything that fails, fails because its guarantee was "this cannot be null" and that guarantee is not being made.

Sort any further technique by that test before adopting it.

---

## Adopt

### `unknown` at every boundary, never `any`
Already this skill's rule. The series sharpens why: **`any` is contagious** — it flows through assignments and returns, so one at a boundary silently unchecks code far away. `unknown` localises the uncertainty and forces the check once.

✅ **Fully intact.** Property access on `unknown` errors at every strictness level; an explicit `: unknown` behaves exactly as under strict.

Two caveats that only exist here: narrowing with `typeof x === 'object'` does **not** exclude `null`, so keep the leading truthiness check; and `noImplicitAny: false` keeps minting *implicit* anys nobody annotated, so this is a discipline for code being written, not a net over the codebase.

### Discriminated unions, with an explicit `assertNever` arm
Replace flag soup — `{ isLoading, error, data }`, which permits states that cannot happen and that every consumer must defend against — with a tagged union carrying exactly the data valid in each state.

✅ **Narrowing and exhaustiveness both survive.** Verified: a missing case passed to `assertNever(x: never)` errors `TS2345`. Verified against a claim to the contrary: **`undefined` and `null` are *not* assignable to `never`** with `strictNullChecks` off.

**The rule that is specific to this configuration, and the single most useful finding in the series for us:**

```ts
switch (s.tag) {
  case 'loading': return 'l';
  case 'success': return s.data;
  default: return assertNever(s);   // ← mandatory
}
```

**The implicit form — a `switch` with no `default`, relying on the declared return type — is a silent no-op here.** Verified: missing a case compiles clean under our flags and errors `TS2366` under `strict`. The implicit fall-through returns `undefined`, which is assignable to `string` when nullability is not tracked. So exhaustiveness is only real if the `default: return assertNever(x)` arm is written by hand. It is a review rule, not a compiler guarantee.

Also worth knowing: **React Query's own narrowing gives you nothing here.** It types `data` as `TData | undefined` while pending and `TData` on success; with `strictNullChecks` off both collapse to `TData`, so `if (status === 'success')` buys no type information. Modelling your own view state as a tagged union is how that protection is recovered.

### Branded types for values that share a primitive but are not interchangeable
Ids, money, units, raw-versus-escaped strings.

```ts
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };
type DealId = Brand<string, 'DealId'>;
```

✅ **The nominal half is fully intact.** Verified: `const bad: DealId = "nope"` errors `TS2322` with strict off.

**Two corrections to the series, both verified:**

- **The brand blocks accident, not intent.** The claim that `'x' as Email` fails to compile is wrong at every strictness level — `string → string & brand` is a legal narrowing assertion and the cast compiles.
- **`null` is assignable to a branded type.** So a brand proves *was validated if present*, never *is present*.

### Smart constructors — returning a tagged result, not `T | undefined`
One function validates, and is the only way to produce the branded type, so an unvalidated value is unrepresentable downstream.

**The series' shape does not work here and must be changed.** A constructor returning `DealId | undefined` buys nothing: verified, passing the result straight into a function taking `DealId` compiles clean with strict off and errors `TS2345` under strict. The "you are forced to handle the invalid case" property *is* `strictNullChecks`.

```ts
export const makeDealId = (v: string): { ok: true; value: DealId } | { ok: false; error: string } =>
    /^\d+$/.test(v) ? { ok: true, value: v as DealId } : { ok: false, error: 'not numeric' };
```

✅ Reading `.value` off the failure branch is a **property** error, which the compiler still catches without nullability tracking. That is why the tagged shape survives and the union with `undefined` does not.

### Errors as values — tagged error unions
The failure type is a discriminated union of specific variants carrying their own context, not `Error` or `string`.

```ts
type FetchError =
  | { tag: 'Timeout'; seconds: number }
  | { tag: 'BadStatus'; code: number }
  | { tag: 'BadBody'; detail: string };
```

✅ **No degradation at all**, and **non-viral** — errors can be tagged without changing any caller's signature, so callers that ignore the tag keep compiling. That combination makes it the cheapest real win available. It lets a UI distinguish *retry this* from *you lack permission* without matching on message strings.

### Parse at the boundary, returning a tagged result
Already this skill's rule; the upgrade is the return shape. A boundary parser takes `unknown` and returns success-or-error rather than throwing or returning `null`.

✅ The `unknown` half is fully intact. **The exit from narrowing is the weak point**: a type predicate `(x): x is Person` is an unchecked assertion the compiler simply believes, and with strict off a guard that forgets a field yields a `Person` whose missing property the type system then swears is a `string`.

### Type proofs
Assert type-level facts as compiling code, so a refactor that breaks a relationship fails the typecheck rather than surfacing later.

```ts
export type Assert<_ extends true> = void;
export type Eq<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
export type _actionsAreExhaustive = Assert<Eq<Action['tag'], 'load' | 'ok' | 'fail'>>;
```

✅ Works identically under our flags. **Two gotchas:** `noUnusedLocals` is on, so a proof alias must be `export type`, not `type`, or it errors `TS6196`. And proofs *about nullability* are meaningless here — never assert that something cannot be null.

`@ts-expect-error` is the cheapest form and self-verifying, since the directive errors when the expected error stops occurring. It misfires only when the error you expect exists solely under `strict` — then the directive itself becomes the error. That is loud rather than silent, so it is usable with care.

### Capabilities as parameters
A function declares each side effect it needs as a function-typed parameter instead of importing an ambient client, so the signature is an auditable list of what it can reach.

✅ Independent of strictness. Immediate payoff in tests — stubs rather than module mocks. **Keep it to the file you are in**; threading a capability three levels down produces parameter explosion, which the series never acknowledges.

---

## Not enforced here — kept, with what disables each

**None of these is wrong.** Each is sound advice in the configuration the series was written for. They are recorded in full so that nothing is lost, and so that the day a compiler flag changes, the list of what becomes available is already written.

Two different reasons appear below, and they are not the same:

- **Disabled by configuration** — the technique works, but the guarantee it rests on is switched off here. Flip the flag and it is live.
- **Delegated** — the technique is correct and already covered by the JavaScript rules. Restating it here would duplicate a rule that exists.

### Maybe — *disabled by `strictNullChecks: false`*

**Rule.** Model absence as an explicit named type rather than letting `null`/`undefined` flow untyped, so a consumer must handle both cases before reading the value.

**Mechanism.** Either the lightweight `type EnvVar = string | undefined`, or the tagged `{ tag: 'some'; value: T } | { tag: 'none' }`.

**What disables it.** ✅ Verified: with `strictNullChecks` off, TypeScript removes `undefined` and `null` from unions — the lightweight form compiles identically to `string`. The tagged form still branches correctly, but `null` remains assignable to it and to the `T` inside, so it proves *you remembered to branch* and not *the value is there*.

**Re-enabled by.** `strictNullChecks`. At that point the lightweight form alone is worth adopting, and the tagged form becomes largely unnecessary.

### Non-empty collections — *disabled by `noUncheckedIndexedAccess: false`*

**Rule.** When a function genuinely requires at least one element, encode it — `type NonEmptyArray<T> = [T, ...T[]]` — and validate once at the boundary rather than re-checking `if (list.length)` at every use.

**What disables it.** The payoff is that `xs[0]` types as `T` rather than `T | undefined`. That difference only exists under `noUncheckedIndexedAccess`, which is off and is **not** implied by `strict`. Plain `T[]` already types `xs[0]` as `T` here, so the compiler is already lying in exactly the way this was meant to fix. What survives is a documented precondition enforced at the call site — real, but a fraction of the advertised value, against constant narrowing hops at every `filter`/`map`.

**Re-enabled by.** `noUncheckedIndexedAccess`, which is independently enableable and would do more on its own than the type alias does.

### Total functions — *disabled by `strictNullChecks: false`*

**Rule.** Narrow a function's *input* types until no input can crash it or return nonsense, instead of guarding inside the body — `divide(a: number, b: PositiveInteger)` cannot divide by zero.

**What disables it.** The branding half works. But functions here go partial overwhelmingly via `null`/`undefined`, and `null` is assignable to every branded type. It excludes the failure mode we rarely hit and cannot exclude the one we hit constantly.

**Re-enabled by.** `strictNullChecks`.

### Railway-oriented programming — *disabled by the scope rule, not by a flag*

**Rule.** Functions that can fail return `Result<T, E>`; compose with `andThen`/`map`/`mapErr` so the error track short-circuits and the failure set stays in the signature.

**What disables it.** Three things, and the first is ours rather than the compiler's. It **pays off only when a whole call graph is on the rails**, and converting one function forces every caller to change — which improvements-confined-to-touched-files forbids, so you unwrap at the boundary and pay the cost without the composition. It would also add a third error dialect beside React Query's `status`/`error` and existing `try/catch`. And the library that makes it ergonomic returns class instances, which break devtools time-travel, persistence and structural equality when they reach the store.

**Re-enabled by.** A deliberate decision to convert a whole call graph at once, which is a different kind of project from a change to touched files. The degenerate local case — a plain tagged result returned by a validating function and consumed in the same file — is already adopted above as the smart-constructor shape.

### `Result` as general policy — *disabled by the scope rule*

**Rule.** Any function that can fail returns `Result<T, E>` rather than throwing, so callers cannot reach the value without acknowledging the error branch.

**What disables it.** The pattern itself survives strict-off intact — enforcement is union narrowing, not nullability. It is **virality** that rules it out: changing a return type forces every caller to change, and callers live in untouched files. Note also that React Query already hands back a Result-shaped object at the fetch boundary, so the uncovered ground is thunks and plain utilities rather than data fetching.

**Where it is already in use.** New functions, and boundary parsers — both of which keep it contained.

### `@ts-expect-error`-driven development — *partially disabled*

**Rule.** Write the invalid call you want rejected, annotate it `@ts-expect-error`, then tighten the signature until the annotation is satisfied.

**What disables it.** It misfires whenever the error you are expecting exists only under `strict` — the directive then becomes an unused-directive error itself. That failure is loud rather than silent, so the technique remains usable with care; it simply cannot be applied to anything null-shaped here.

### Product types — *delegated to the JavaScript rules*

**Rule.** Group related data into a single object type rather than passing multiple positional primitives, so signatures are self-documenting and adding a field does not break call sites.

**Why it is not repeated.** The JavaScript guide already requires options objects and self-describing signatures with defaults in the parameter list. It is an API-design rule that happens to be written in TypeScript, not type-layer discipline — the erasure test puts it on the other side of the line. Worth knowing that the series treats it as groundwork for impossible-states modelling, which **is** adopted above.

### Immutability — *delegated to the JavaScript rules*

**Rule.** Never mutate; return copies via spread.

**Why it is not repeated.** Already required by the JavaScript guide, and the series explicitly blesses the convention-only version — its author waves off `readonly` and `Readonly<T>` as unnecessary. Redux reducers and React Query cache semantics already mandate it. Adding `readonly` on new exported types is free where it costs no churn, but it is an addition to his advice rather than his advice.

## Decisions that are not ours to make

Each would raise the ceiling, and each is out of scope for a change confined to touched files.

**A schema library.** Nothing of the kind is installed — no zod, valibot, ajv, yup, io-ts, arktype, fp-ts, neverthrow or Effect, direct or transitive. This is the largest available defect reduction **precisely because strictness is off**: a runtime `parse()` does not read compiler flags, so it buys back a guarantee the compiler is not currently making, at the boundary where most `any` originates. Per-endpoint once present, so it fits touched-files cleanly. It is a dependency decision, not a per-change one.

**Property testing.** Also absent. `fast-check` is runner-agnostic and drops inside an existing test without config changes, but it composes badly with riteway's one-assertion given/should narrative — a property test degrades that to `given: 'any string'`. Payoff concentrates narrowly: pure reducers, sorting and ranking, money and date maths.

**Three compiler flags, each far narrower than full `strict`:**

- `useUnknownInCatchVariables` — 194 files contain catch bindings, all currently typed `any`, which silently unwraps tagged errors at the catch site. This single flag would make the errors-as-values technique meaningfully stronger.
- `noUncheckedIndexedAccess` — would do more than the non-empty-collection type alias ever could, and is independently enableable.
- `strict` itself — the technique that most rewards it is impossible-states modelling, which currently delivers the combinatorial guarantee but not the "the data is actually there" one.

---

## What the author says about stopping

Reported faithfully, because it is thinner than 26 parts implies and it is the part most worth having. There is **no legacy-migration guidance and no tsconfig advice anywhere in the series** — the method posts address the loop, not adoption into existing code.

The only technical ROI statement in the whole run:

> "there is often a ROI balance of 'how much type-safety is actually valuable here' as well as 'are these types readable in this context / on this team'."

And:

> "Making Impossible States Impossible should definitely be the goal, but recognize it's not black and white; it's often a spectrum with nuance."

> "No shame deciding to be pragmatic & ship code."

**Readability on the team is named as a legitimate reason to stop.** Every other cost he lists — popularity, career, politics, loneliness — is sociological rather than engineering. Where a stopping heuristic is needed for work confined to touched files, it has to be supplied here rather than taken from the series.
