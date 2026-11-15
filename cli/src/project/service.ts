import fs from 'node:fs';
import crypto from 'node:crypto';
import type { Component } from '../setup/types.ts';
import { safePath, stat } from '../setup/files.ts';
import { leafEntries, observe, projectTarget, readReceipt, receiptDirMissing } from './observe.ts';
import { planProject } from './plan.ts';
import { resolve } from './resolve.ts';
import type { LeafStatus, Observation, ProjectContext, ProjectPlan, Verification } from './types.ts';

export function context(root: string, target: string): ProjectContext { return { root: fs.realpathSync(root), target: projectTarget(root, target) }; }
const byId = (components: Component[], id: string) => components.find(c => c.id === id)!;

// Discovery reads catalog data only; no source tree is inspected.
export function listProject(components: Component[]) {
  return components.filter(c => c.project).map(c => c.project!.kind === 'leaf'
    ? { id: c.id, kind: 'leaf' as const, name: c.name, description: c.description, source: c.project!.source, target: c.project!.target, requires: c.project!.requires }
    : { id: c.id, kind: 'composition' as const, name: c.name, description: c.description, members: c.dependencies });
}

// Read-only. Source files are inspected only for leaves in the resolved selection.
export function previewProject(ctx: ProjectContext, components: Component[], ids: string[]): ProjectPlan {
  const resolution = resolve(components, ids);
  const { receipt, text } = readReceipt(ctx, components);
  const observations = resolution.leaves.map(id => observe(ctx, byId(components, id)));
  return planProject({ root: ctx.root, target: ctx.target, resolution, observations, receipt, receiptText: text, receiptDirMissing: receiptDirMissing(ctx) });
}

function leafStatus(o: Observation, recorded: unknown): { status: LeafStatus; evidence: string[] } {
  const states = o.entries.map(e => e.state), owned = states.filter(s => s === 'owned').length;
  if (states.some(s => s === 'foreign' || s === 'unsafe')) return { status: 'conflict', evidence: o.entries.filter(e => e.state === 'foreign' || e.state === 'unsafe').map(e => `${e.relative}: ${e.detail}`) };
  if (owned === 0) return { status: 'missing', evidence: ['No linked files present'] };
  if (owned < states.length) return { status: 'partial', evidence: [`${owned}/${states.length} files linked`] };
  const current = JSON.stringify(o.entries.map(({ relative, source, sha256 }) => ({ relative, source, sha256 })));
  if (!recorded) return { status: 'unrecorded', evidence: ['Links are owned but absent from the receipt; apply records them'] };
  if (JSON.stringify(recorded) !== current) return { status: 'update', evidence: ['Canonical source files or digests changed since the receipt was recorded (links are live); apply refreshes the receipt'] };
  return { status: 'current', evidence: [`${states.length}/${states.length} owned links match receipt digests`] };
}
const compose = (members: LeafStatus[]): LeafStatus => members.every(s => s === 'current') ? 'current'
  : members.includes('conflict') ? 'conflict' : members.every(s => s === 'missing') ? 'missing'
  : members.some(s => s === 'missing' || s === 'partial') ? 'partial' : members.includes('unrecorded') ? 'unrecorded' : 'update';

// Verifies actual links and ownership against canonical sources and the receipt. Defaults to the recorded selection.
export function verifyProject(ctx: ProjectContext, components: Component[], ids?: string[]): Verification {
  const { receipt } = readReceipt(ctx, components);
  if (receipt && receipt.source !== ctx.root) throw new Error(`Receipt records source checkout ${receipt.source}, not ${ctx.root}; reconcile manually`);
  const requested = ids?.length ? ids : receipt?.selected;
  if (!requested?.length) throw new Error('No project capabilities are recorded for this target; nothing to verify (pass --select)');
  const resolution = resolve(components, requested);
  const status = new Map<string, { status: LeafStatus; evidence: string[] }>();
  for (const id of resolution.order) {
    const c = byId(components, id);
    if (c.project!.kind === 'leaf') status.set(id, leafStatus(observe(ctx, c), receipt?.leaves[id]));
    else {
      const members = c.dependencies.map(d => status.get(d)!.status);
      status.set(id, { status: compose(members), evidence: c.dependencies.map(d => `${d}: ${status.get(d)!.status}`) });
    }
  }
  const capabilities = resolution.order.map(id => ({ id, kind: byId(components, id).project!.kind === 'leaf' ? 'leaf' as const : 'composition' as const, ...status.get(id)! }));
  return { ok: capabilities.every(c => c.status === 'current'), target: ctx.target, selected: resolution.selected, capabilities };
}

// Explicit approval is the reviewed plan fingerprint; a changed target/source/receipt makes it stale.
export function applyProject(ctx: ProjectContext, components: Component[], ids: string[], approval: string | undefined) {
  const plan = previewProject(ctx, components, ids);
  if (plan.conflicts.length) throw new Error(`Refusing to apply; ${plan.conflicts.length} conflict(s):\n- ${plan.conflicts.join('\n- ')}`);
  if (!approval) throw new Error(`Approval required: review the plan, then rerun with --approve ${plan.fingerprint}`);
  if (approval !== plan.fingerprint) throw new Error(`Stale or different plan: approved ${approval}, current ${plan.fingerprint}. Re-run plan and review again.`);
  const done: string[] = [];
  for (const op of plan.operations) {
    if (op.kind === 'noop' || op.kind === 'conflict') continue;
    try {
      const abs = safePath(ctx.target, op.path);
      if (op.kind === 'mkdir') {
        fs.mkdirSync(abs); // not recursive: parents come earlier in the plan; EEXIST fails closed
        const s = stat(abs); if (!s?.isDirectory() || s.isSymbolicLink()) throw new Error('Created directory is not a real directory');
      } else if (op.kind === 'link') fs.symlinkSync(op.source!, abs); // EEXIST fails closed; never replaces
      else {
        const tmp = `${abs}.ae-${crypto.randomUUID()}`;
        fs.writeFileSync(tmp, plan.nextReceipt, { flag: 'wx', mode: 0o644 });
        fs.renameSync(tmp, abs);
      }
      done.push(`${op.kind} ${op.path}`);
    } catch (error) {
      throw new Error(`Apply stopped at ${op.kind} ${op.path}: ${(error as Error).message}. Completed before failure: ${done.length ? done.join(', ') : 'nothing'}. Inspect target, then rerun plan.`);
    }
  }
  return { plan, applied: done, verification: verifyProject(ctx, components, ids) };
}

export function inspectProject(root: string, components: Component[], id: string, target?: string) {
  const resolution = resolve(components, [id]);
  const c = byId(components, id);
  const leaves = resolution.leaves.map(leaf => { // lazy: only the selected closure's sources are read
    const lc = byId(components, leaf), p = lc.project as { source: string; target: string };
    return { id: leaf, source: p.source, target: p.target, files: leafEntries(root, lc) };
  });
  return {
    id, kind: c.project!.kind, name: c.name, description: c.description, expands: resolution.order, leaves,
    requirements: resolution.requires.map(r => ({ id: r, name: byId(components, r).name, note: 'Advisory; project apply neither installs nor checks it. Pi additionally needs project trust before it loads project skills.' })),
    ...(target ? { verification: verifyProject(context(root, target), components, [id]) } : {}),
  };
}
