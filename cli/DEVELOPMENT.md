# Small, explicit setup utilities

The validated default is strict TypeScript + Node APIs + npm + sequential Clack prompts + `node:test`. Small `@clack/core` controls satisfy direct tri-state editing and preserved Backspace navigation; no new test runner, state library or plugin system was needed. Use a different approach only when existing code/tests demonstrate that the simpler pattern cannot meet a real requirement; document the concrete benefit and cost.

## State and flow

`setup/types.ts` defines `SetupSession` (user intent), `State` (detected facts), `Plan` (reviewed decisions), and `Result` (observed execution). A selection contains action, optional removal scope, confirmation and chosen cleanup leaves—there is no parallel removal-scope store to synchronize.

```ts
const session: SetupSession = { profile: 'custom', selections: {} };
const states = detectAll(ctx, components);       // observations, no provisioning
// Profile step sets initial recommendations (visible on existing machines too).
chooseProfile(session, 'mac-workstation', components, states);
// Component step: tri-state [x]/[−]/[ ] per component; backspace returns to profile.
const choices = await componentChoices(components, states, session.selections);
rememberChoices(session, choices.selections, choices.touched);
// Only deliberate [−] selections enter guided scope/cleanup/confirmation prompts.
await guideRemovals(ctx, components, states, session.selections);
const reviewed = plan(components, states, session.selections); // pure
// Render reviewed; obtain explicit approval. Never run effects in a prompt.
const results = execute(ctx, components, reviewed, approved); // calls verify
```

Execution checks preview fingerprints, preflights all active operations, uses narrow native installer/filesystem boundaries and verifies final state. Cancellation before approval changes nothing. A command failure stops later mutations and reports failure/partial state; private selected-settings backups and original sources support manual recovery. There is intentionally no custom transaction/resume framework. Inspect actual state and re-plan after interruption; do not force a stale plan.

## Add a recommendation profile

Add an entry beside the three existing entries in `src/profiles/index.ts`:

```ts
{ id: 'example', label: 'example', hint: 'Small CLI-only recommendation',
  recommendations: ['brew-git', 'brew-ripgrep'] }
```

Recommendations never establish installed state, force dependencies without preview, or remove excluded capabilities. Test fresh defaults, overrides and existing-machine reruns.

## Add a capability using an existing adapter

For a verified portable Stow package, add data to `catalog.ts` (illustrative, not an implemented component):

```ts
{ id: 'example-config', name: 'Example configuration', owner: 'setup/computer',
  adapter: 'stow', packageDir: 'setup/computer', packageName: 'example',
  description: 'Portable defaults only; private state remains local',
  dependencies: ['brew-stow'] }
```

Create only the real source package required by that capability. The existing adapter detects exact owned leaves, refuses foreign/parent links, preflights Stow and verifies links/removal. Reuse the existing Brewfiles rather than duplicating their package declarations. Do not make one adapter per file.

## Add detection or a genuinely different installer

Extend the existing concrete adapter switch only if its mechanism differs materially. Return observed status plus evidence/fingerprint; use `unknown`/`conflict` when ownership is insufficient. Report runtime loading as unknown without runtime evidence. Keep commands behind the injected `Context.run`; keep writes in execution helpers. Add the supported install/remove/version policy to the README matrix before exposing the capability. Do not claim unsupported operations work.

## Add a safety test

Follow the fixture helper in `tests/setup.test.ts`; it provides temporary homes, a controlled runner, native package command fixtures and actual GNU Stow:

```ts
test('current selection does not reinstall', t => {
  const f = fixture(t);
  f.apply({ 'config-git': { action: 'install' } });
  const before = f.calls.length;
  f.apply({ 'config-git': { action: 'install' } });
  assert.ok(!f.calls.slice(before).some(call => call[0] === 'stow'));
});
```

For planner tests, snapshot/freeze inputs and compare repeated outputs; no runner calls or target writes are allowed. For effects, test unknown ownership, failed commands, confirmation and private-data preservation as well as the happy path. `sources.test.ts` covers actual Stow contracts; `entrypoints.test.ts` covers bootstrap/CLI boundaries. Optional `terminal-probe.py` covers actual Clack interaction in temporary homes; its bulk apply contains only no-ops and an explicitly approved fixture profile receipt. None of these prove live Mini/Air application acceptance.

A future **actual** CLI command can be dispatched from `src/index.ts` with its own narrow module/tests. Do not implement hypothetical commands, ADWs or factories while working on setup.
