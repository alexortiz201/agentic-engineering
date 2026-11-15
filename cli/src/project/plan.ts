import path from 'node:path';
import { digest } from '../setup/files.ts';
import { buildReceipt } from './observe.ts';
import { RECEIPT_PATH, type Observation, type Operation, type ProjectPlan, type Receipt, type Resolution } from './types.ts';

export type PlanInput = {
  root: string; target: string; resolution: Resolution; observations: Observation[];
  receipt?: Receipt; receiptText: string | null; receiptDirMissing: boolean;
};
// Pure and deterministic: no filesystem, no clock, no mutation of inputs. The fingerprint is the approval token.
export function planProject(i: PlanInput): ProjectPlan {
  const conflicts: string[] = [];
  if (i.receipt && i.receipt.source !== i.root) conflicts.push(`Receipt records source checkout ${i.receipt.source}, not ${i.root}; reconcile manually (no cross-checkout adoption)`);
  const entriesOf = (o: Observation) => o.entries.map(({ relative, source, sha256 }) => ({ relative, source, sha256 }));
  const leaves = { ...(i.receipt?.leaves ?? {}), ...Object.fromEntries(i.observations.map(o => [o.id, entriesOf(o)])) };
  const selected = [...new Set([...(i.receipt?.selected ?? []), ...i.resolution.selected])].sort();
  const nextReceipt = buildReceipt(i.root, selected, leaves);
  const changed = nextReceipt !== i.receiptText;
  const dirs = new Set(i.observations.flatMap(o => o.missingDirs));
  if (changed && i.receiptDirMissing) dirs.add(path.dirname(RECEIPT_PATH));
  const operations: Operation[] = [...dirs].sort((a, b) => a.split(path.sep).length - b.split(path.sep).length || a.localeCompare(b))
    .map(p => ({ kind: 'mkdir' as const, path: p, reason: 'Create missing project directory' }));
  for (const o of i.observations) for (const e of o.entries) {
    if (e.state === 'owned') operations.push({ kind: 'noop', capability: o.id, path: e.relative, reason: e.detail });
    else if (e.state === 'missing') operations.push({ kind: 'link', capability: o.id, path: e.relative, source: path.join(i.root, e.source), reason: 'Link canonical source file' });
    else { operations.push({ kind: 'conflict', capability: o.id, path: e.relative, reason: e.detail }); conflicts.push(`${o.id}: ${e.relative}: ${e.detail}`); }
  }
  if (changed) operations.push({ kind: 'record', path: RECEIPT_PATH, reason: i.receiptText === null ? 'Create local installation receipt' : 'Reconcile local installation receipt' });
  const receipt = { path: RECEIPT_PATH, before: i.receiptText === null ? null : digest(i.receiptText), after: digest(nextReceipt) };
  const body = { target: i.target, source: i.root, selected: i.resolution.selected, order: i.resolution.order, operations, conflicts, receipt };
  return { target: i.target, source: i.root, selected: i.resolution.selected, order: i.resolution.order,
    requirements: i.resolution.requires, operations, conflicts, receipt, fingerprint: digest(body), nextReceipt };
}
