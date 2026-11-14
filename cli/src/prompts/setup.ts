import * as p from '@clack/prompts';
import type { Component, Context, Plan, Selection, State } from '../setup/types.ts';
import { cleanupReview } from '../setup/execute.ts';
import { BACK, navigationConfirm, navigationMultiselect, navigationSelect } from './controls.ts';
import { statusLabel } from './choices.ts';
export function answer<T>(value: T | symbol): T {
  if (p.isCancel(value)) { p.cancel('Cancelled. No further operations.'); process.exit(0); }
  return value as T;
}
// Only deliberate [−] selections enter this flow. [x] selections go straight to the planner.
export async function guideRemovals(ctx: Context, components: Component[], states: Record<string, State>, selections: Record<string, Selection>): Promise<'next' | 'back'> {
  for (const c of components) {
    const selected = selections[c.id];
    if (selected?.action !== 'remove' || selected.confirmed) continue;
    p.note(states[c.id].evidence.join('\n'), `${c.name}: ${statusLabel(c, states[c.id])}`);
    let stage: 'scope' | 'cleanup' | 'confirm' = 'scope';
    for (;;) {
      if (stage === 'scope') {
        const value = await navigationSelect({ message: `Removal depth for ${c.name}`, initialValue: selected.scope ?? 'configuration',
          options: [ { value: 'configuration', label: 'Configuration only', hint: 'Keep application, personal data, sessions and credentials' },
            { value: 'application', label: 'Application and configuration', hint: 'Supported uninstall plus owned paired configuration, shown separately in plan' },
            { value: 'review', label: 'Full cleanup review', hint: 'Inspect actual paths; unknown/private data is preserved' } ] });
        if (value === BACK) return 'back';
        selected.scope = answer(value);
        stage = selected.scope === 'review' ? 'cleanup' : 'confirm';
      }
      if (stage === 'cleanup') {
        let review: { path: string; evidence: string; removable: boolean }[];
        try { review = cleanupReview(ctx, c); }
        catch (e) {
          p.note((e as Error).message, 'Cleanup inspection blocked — choose a different removal scope');
          stage = 'scope'; continue;
        }
        p.note(review.map(v => `${v.path}\n  ${v.evidence}`).join('\n') || 'No known artifacts found. This is not an exhaustive system scan.', 'Actual cleanup evidence');
        const removable = review.filter(v => v.removable);
        if (removable.length) {
          const value = await navigationMultiselect({ message: 'Select owned configuration leaves (Stow packages require all leaves)',
            initialValues: selected.cleanup ?? [], options: removable.map(v => ({ value: v.path, label: v.path, hint: v.evidence })) });
          if (value === BACK) { stage = 'scope'; continue; }
          selected.cleanup = answer(value);
        }
        p.log.warn('Recursive cache, personal-data, credentials and session deletion is unsupported; those artifacts stay intact.');
        stage = 'confirm';
      }
      const value = await navigationConfirm(`Confirm ${selected.scope} removal for ${c.name}${c.adapter === 'brew' && selected.scope !== 'configuration' ? ', including Homebrew application uninstall' : ''}?`);
      if (value === BACK) { stage = selected.scope === 'review' ? 'cleanup' : 'scope'; continue; }
      if (answer(value)) selected.confirmed = true; else selections[c.id] = { action: 'keep' };
      break;
    }
  }
  return 'next';
}
export function renderPlan(planned: Plan) {
  for (const kind of ['install', 'update', 'configure', 'remove', 'noop', 'conflict', 'skip'] as const) {
    const ops = planned.operations.filter(o => o.kind === kind);
    if (!ops.length) continue;
    p.note(ops.map(o => `${o.component}${o.dependency ? ' (required dependency)' : ''}: ${o.reason}${o.details.length ? '\n  ' + o.details.join('\n  ') : ''}`).join('\n'), kind.toUpperCase());
  }
  if (planned.conflicts.length) p.log.error(planned.conflicts.join('\n'));
}
