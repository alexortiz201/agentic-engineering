import type { Component, Operation, Plan, Selection, State } from './types.ts';
import { configurationPairs } from '../components/catalog.ts';
export function plan(components: Component[], states: Record<string, State>, requested: Record<string, Selection>): Plan {
  const selections: Record<string, Selection> = structuredClone(requested);
  const byId = new Map(components.map(c => [c.id, c]));
  const conflicts: string[] = [];
  for (const id of Object.keys(selections)) if (!byId.has(id)) conflicts.push(`Unknown component ${id}`);
  const dependencies = new Set<string>();
  for (const [app, config] of Object.entries(configurationPairs)) {
    const selected = selections[app];
    if (selected?.action !== 'remove' || !selected.confirmed || !byId.has(config)) continue;
    if (states[config]?.status === 'missing') continue;
    if (selections[config]?.action === 'install') { conflicts.push(`${app} removal conflicts with ${config} installation`); continue; }
    if (['migration', 'conflict', 'unknown'].includes(states[config]?.status)) { conflicts.push(`${config} has ambiguous configuration ownership; application-and-configuration removal requires reconciliation`); continue; }
    selections[config] = { action: 'remove', scope: selected.scope === 'review' ? 'review' : 'configuration', confirmed: true, cleanup: selected.cleanup };
    dependencies.add(config);
  }
  const ordered: string[] = []; const visiting = new Set<string>(); const done = new Set<string>();
  function visit(id: string) {
    if (done.has(id)) return;
    if (visiting.has(id)) { conflicts.push(`Dependency cycle at ${id}`); return; }
    const c = byId.get(id);
    if (!c) { conflicts.push(`Missing dependency definition ${id}`); return; }
    visiting.add(id);
    if (selections[id]?.action === 'install') for (const dep of c.dependencies) {
      if (selections[dep]?.action === 'remove') conflicts.push(`${id} requires ${dep}, selected for removal`);
      else if (states[dep]?.status !== 'current') {
        if (!selections[dep] || selections[dep].action === 'keep') {
          selections[dep] = { action: 'install' }; dependencies.add(dep);
        }
      }
      visit(dep);
    }
    if (selections[id]?.action === 'remove') {
      for (const dep of c.dependencies) visit(dep);
      for (const [app, config] of Object.entries(configurationPairs)) if (config === id && selections[app]?.action === 'remove') visit(app);
    }
    visiting.delete(id); done.add(id); ordered.push(id);
  }
  for (const c of components) visit(c.id);
  // Keep operations explicit, including every skipped capability. Dependency order matters for execution.
  const operations: Operation[] = ordered.map(id => {
    const c = byId.get(id)!; const before = states[id];
    const selection = selections[id] ?? { action: 'keep' as const };
    const op = (kind: Operation['kind'], reason: string): Operation => ({
      component: id, kind, reason, dependency: dependencies.has(id), selection, before,
      details: kind === 'noop' || kind === 'skip' ? [] : [
        `Owner: ${c.owner}`,
        ...(c.adapter === 'stow' ? [`Stow source: ${c.packageDir}/${c.packageName}; exact target leaves:`, ...(before?.evidence ?? []).filter(v => v.startsWith('/'))] : []),
        ...(c.configuration && selection.action === 'install' ? [`Selected configuration values: ${JSON.stringify(c.configuration)}`] : []),
        ...(c.adapter === 'brew' ? [`Homebrew ${selection.action === 'remove' ? 'uninstall' : 'install'} --${c.brewKind} ${c.packageName}; no force, zap, bundle or blanket upgrade`] : []),
        ...(c.adapter === 'todo' ? [`Exact native package: ${c.accepted}; configuration-only removal retains cache`] : []),
      ],
    });
    if (selection.action === 'keep') return op('skip', 'No change requested');
    if (!before) return op('conflict', 'No observed state');
    if (selection.action === 'remove') {
      if (!selection.scope || !selection.confirmed) return op('conflict', 'Guided removal scope and explicit confirmation required');
      if (c.adapter === 'manual') return op('conflict', c.manual!);
      if (['migration', 'conflict', 'unknown'].includes(before.status)) return op('conflict', before.status === 'migration' ? before.evidence.join('; ') : 'Ambiguous ownership; removal refused');
      if (c.adapter === 'brew' && selection.scope === 'configuration') return op('noop', 'Application preserved; any owned paired configuration appears as a separate removal operation');
      if (c.adapter === 'stow' && selection.scope === 'application') return op('remove', 'Remove owned configuration only; application is a separate component');
      if (before.status === 'missing') return op('noop', 'Nothing managed is present');
      return op('remove', 'Remove only verified owned resources within confirmed scope');
    }
    if (before.status === 'current') return op('noop', 'Already current relative to accepted declaration; no upstream update');
    if (['migration', 'conflict', 'unknown'].includes(before.status)) return op('conflict', before.evidence.join('; '));
    if (c.adapter === 'manual') return op('conflict', c.manual!);
    if (c.adapter === 'brew' && before.status !== 'missing') return op('conflict', 'No accepted version pin: automatic Homebrew upgrades unsupported');
    if (c.adapter === 'defaults') return op('configure', 'Reconcile only selected portable defaults; backup first');
    return op(before.status === 'update' ? 'update' : 'install', c.adapter === 'brew' ? 'Install explicitly selected unversioned Homebrew declaration; no upgrade of installed packages' : 'Apply accepted selected component');
  });
  for (const op of operations) {
    if (op.kind !== 'remove') continue;
    for (const c of components) {
      if (!c.dependencies.includes(op.component)) continue;
      const dep = operations.find(o => o.component === c.id);
      if (states[c.id]?.installed !== false && dep?.kind !== 'remove') {
        conflicts.push(`Cannot remove ${op.component}: ${c.id} remains installed or ownership is unknown`);
      }
    }
  }
  // Dependents removed before dependencies, installs keep topological order.
  const removals = operations.filter(o => o.kind === 'remove').reverse();
  const rest = operations.filter(o => o.kind !== 'remove');
  for (const o of operations) if (o.kind === 'conflict') conflicts.push(`${o.component}: ${o.reason}`);
  return { operations: [...removals, ...rest], conflicts: [...new Set(conflicts)] };
}
