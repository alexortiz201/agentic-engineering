import type { Component } from '../setup/types.ts';
import type { Resolution } from './types.ts';
// Pure recursive resolution over the catalog. A composition's `dependencies` are project members (leaves or other
// compositions); a leaf's machine `dependencies` are ignored here — only its explicit `project.requires` is advisory.
export function resolve(components: Component[], requested: string[]): Resolution {
  const byId = new Map(components.map(c => [c.id, c]));
  const selected = [...new Set(requested)].sort();
  if (!selected.length) throw new Error('Select at least one project capability (--select ID[,ID])');
  const order: string[] = [], done = new Set<string>(), stack: string[] = [];
  const visit = (id: string, via?: string) => {
    const c = byId.get(id);
    if (!c) throw new Error(`Unknown capability ${id}${via ? ` (required by ${via})` : ''}`);
    if (!c.project) throw new Error(`${id} is not project-applicable${via ? ` (required by ${via})` : ''}`);
    if (stack.includes(id)) throw new Error(`Dependency cycle: ${[...stack.slice(stack.indexOf(id)), id].join(' -> ')}`);
    if (done.has(id)) return;
    stack.push(id);
    if (c.project.kind === 'composition') {
      if (!c.dependencies.length) throw new Error(`Composition ${id} has no members`);
      for (const dep of c.dependencies) visit(dep, id);
    }
    stack.pop(); done.add(id); order.push(id);
  };
  for (const id of selected) visit(id);
  const leaves = order.filter(id => byId.get(id)!.project!.kind === 'leaf');
  const requires = new Set<string>();
  for (const id of leaves) {
    const project = byId.get(id)!.project!;
    if (project.kind !== 'leaf') continue;
    for (const r of project.requires) {
      if (!byId.has(r)) throw new Error(`${id} requires unknown component ${r}`);
      requires.add(r);
    }
  }
  return { selected, order, leaves, requires: [...requires].sort() };
}
