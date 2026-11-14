import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import type { Component, Context, Operation, Plan, Result, Runner } from './types.ts';
import { detect } from './detect.ts';
import { catalog, configurationPairs } from '../components/catalog.ts';
import { installTheme, removeTheme, themePreflight } from './theme.ts';
import { digest, leaves, owned, portableDefaults, privateDir, readSettings, safePath, settingsPath, stat, writeSettings, isTodoSource, installedTodoVersion } from './files.ts';
export const run: Runner = (command, args, env = {}) => {
  const environment: NodeJS.ProcessEnv = { ...process.env, HOMEBREW_NO_AUTO_UPDATE: '1', HOMEBREW_NO_INSTALL_UPGRADE: '1', ...env };
  // Package commands must use the native HOME profile, never an inherited legacy override.
  delete environment.PI_CODING_AGENT_DIR;
  delete environment.PI_SELF_UPDATE_COMMAND;
  const r = spawnSync(command, args, { encoding: 'utf8', timeout: 180_000, maxBuffer: 8 * 1024 * 1024, env: environment });
  return { code: r.error ? (r.error as any).code === 'ENOENT' ? 127 : 1 : r.status ?? 1,
    stdout: r.stdout ?? '', stderr: r.error?.message ?? r.stderr ?? '' };
};
function command(ctx: Context, cmd: string, args: string[]) {
  const r = ctx.run(cmd, args, { HOME: ctx.home });
  if (r.code !== 0) throw new Error(`${path.basename(cmd)} failed (exit ${r.code}); inspect locally; no success assumed`);
}
function stowArgs(ctx: Context, c: Component, remove: boolean, simulate: boolean) {
  return [`--dir=${path.join(ctx.root, c.packageDir!)}`, `--target=${ctx.home}`, '--no-folding',
    ...(simulate ? ['--simulate'] : []), remove ? '--delete' : '--restow', c.packageName!];
}
function receiptPath(ctx: Context) { return safePath(ctx.home, '.local/state/ae/defaults.json'); }
function readReceipt(ctx: Context): any {
  const p = receiptPath(ctx); const s = stat(p);
  if (!s || !s.isFile() || s.isSymbolicLink()) throw new Error('No trustworthy defaults receipt; removal requires manual selected-key review');
  let value;
  try { value = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { throw new Error('Invalid private defaults receipt; inspect locally'); }
  if (value.version !== 1 || !value.before || !value.applied) throw new Error('Invalid defaults receipt');
  return value;
}
function saveReceipt(ctx: Context, value: unknown) {
  privateDir(ctx, '.local/state/ae');
  const p = receiptPath(ctx);
  if (stat(p)) throw new Error('Existing defaults receipt requires reconciliation, not overwrite');
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
}
function defaultRemoval(ctx: Context): Record<string, unknown> {
  const receipt = readReceipt(ctx); const current = readSettings(ctx);
  const allowed = portableDefaults(ctx);
  if (Object.keys(receipt.applied).some(k => !Object.hasOwn(allowed, k)) || Object.keys(receipt.before).some(k => !Object.hasOwn(allowed, k))) throw new Error('Receipt contains unmanaged keys');
  for (const [k, value] of Object.entries(receipt.applied)) {
    if (JSON.stringify(current[k]) !== JSON.stringify(value)) throw new Error(`Defaults key changed since apply: ${k}; refusing removal`);
    const old = receipt.before[k];
    if (!old || typeof old.present !== 'boolean') throw new Error('Invalid defaults before-state');
    if (old.present) current[k] = old.value; else delete current[k];
  }
  return current;
}
export function cleanupReview(ctx: Context, c: Component): { path: string; evidence: string; removable: boolean }[] {
  const list: { path: string; evidence: string; removable: boolean }[] = [];
  if (configurationPairs[c.id]) {
    const pair = catalog(ctx.root).find(v => v.id === configurationPairs[c.id]);
    if (pair) list.push(...cleanupReview(ctx, pair));
  }
  if (c.adapter === 'stow') {
    for (const f of leaves(ctx, c)) if (stat(f.target)) list.push({ path: f.target,
      evidence: owned(f.target, f.source) ? `Exact link to ${f.source}` : 'Foreign occupied path; preserved', removable: owned(f.target, f.source) });
  }
  const known = c.id === 'todos' ? ['.pi/agent/npm/node_modules/@arhen/pi-core-todo']
    : c.id === 'brew-ghostty' || c.id === 'config-ghostty' ? ['Library/Caches/com.mitchellh.ghostty', 'Library/Application Support/com.mitchellh.ghostty']
    : c.id.includes('herdr') ? ['.config/herdr', '.local/state/herdr'] : [];
  for (const relative of known) {
    try { const p = safePath(ctx.home, relative); if (stat(p)) list.push({ path: p, evidence: 'Known application location, not proof of setup ownership; retained (recursive purge unsupported)', removable: false }); }
    catch { list.push({ path: path.join(ctx.home, relative), evidence: 'Unsafe parent; not inspected or traversed', removable: false }); }
  }
  return list;
}
function preflight(ctx: Context, c: Component, op: Operation) {
  if (c.id === 'pi-theme') themePreflight(ctx, op.kind === 'remove');
  if (c.adapter === 'stow') {
    const files = leaves(ctx, c);
    for (const f of files) if (stat(f.target) && !owned(f.target, f.source)) throw new Error(`Foreign leaf: ${f.target}`);
    // GNU Stow can only remove its own links; no --adopt or directory traversal.
  }
  if (c.adapter === 'defaults' || c.adapter === 'todo') {
    settingsPath(ctx); readSettings(ctx);
    if (op.kind === 'remove' && c.adapter === 'defaults') defaultRemoval(ctx);
  }
  if (op.selection.scope === 'review') {
    const review = cleanupReview(ctx, c);
    for (const p of op.selection.cleanup ?? []) if (!review.some(v => v.path === p && v.removable)) throw new Error(`Cleanup not verifiably owned: ${p}`);
    // Config-only Stow removal is all-or-none. Do not imply per-file selection when unsupported.
    if (c.adapter === 'stow' && review.filter(v => v.removable).some(v => !op.selection.cleanup?.includes(v.path))) throw new Error('Stow package cleanup requires selecting all owned leaves, or choose configuration-only scope');
  }
}
function apply(ctx: Context, c: Component, op: Operation) {
  const remove = op.kind === 'remove';
  if (c.adapter === 'stow') {
    command(ctx, 'stow', stowArgs(ctx, c, remove, true));
    if (remove && c.id === 'pi-theme') removeTheme(ctx);
    command(ctx, 'stow', stowArgs(ctx, c, remove, false));
    if (!remove && c.id === 'pi-theme') installTheme(ctx);
  } else if (c.adapter === 'brew') {
    if (ctx.platform !== 'darwin') throw new Error('Homebrew execution is supported on macOS only');
    command(ctx, 'brew', [remove ? 'uninstall' : 'install', c.brewKind === 'cask' ? '--cask' : '--formula', c.packageName!]);
    delete ctx.brew; delete ctx.brewError;
  } else if (c.adapter === 'defaults') {
    if (remove) {
      writeSettings(ctx, defaultRemoval(ctx));
    } else {
      const values = portableDefaults(ctx); const current = readSettings(ctx);
      const before = Object.fromEntries(Object.keys(values).map(k => [k, { present: Object.hasOwn(current, k), ...(Object.hasOwn(current, k) ? { value: current[k] } : {}) }]));
      // Record rollback data first. A failed write leaves an explicit recovery receipt, not a silent overwrite.
      saveReceipt(ctx, { version: 1, before, applied: values });
      writeSettings(ctx, { ...current, ...values });
    }
  } else if (c.adapter === 'todo') {
    const current = readSettings(ctx);
    const packages: string[] = current.packages ?? [];
    const related = packages.filter(isTodoSource);
    if (remove && related.some(p => p !== c.accepted)) throw new Error('Different Todo declaration requires separately reviewed native-package reconciliation');
    if (remove && op.selection.scope !== 'application') {
      writeSettings(ctx, { ...current, packages: packages.filter(p => p !== c.accepted) });
    } else {
      const cli = safePath(ctx.home, '.pi/agent/bin/pi');
      if (!remove) {
        const updated = related.length ? packages.map(p => related.includes(p) ? c.accepted! : p) : [...packages, c.accepted!];
        writeSettings(ctx, { ...current, packages: updated });
        // An accepted installed cache needs only a declaration pin, not a reinstall.
        const installed = installedTodoVersion(ctx);
        if (installed === c.accepted!.split('@').at(-1)) return;
      }
      command(ctx, cli, [remove ? 'remove' : 'install', c.accepted!]);
    }
  } else throw new Error(c.manual ?? 'Unsupported operation');
}
export function verify(ctx: Context, c: Component, op: Operation): { ok: boolean; detail: string } {
  const after = detect(ctx, c);
  if (op.kind !== 'remove') return { ok: after.status === 'current', detail: after.evidence.join('; ') };
  if (c.adapter === 'stow') {
    const remaining = leaves(ctx, c).filter(f => stat(f.target));
    return { ok: remaining.length === 0, detail: remaining.length ? 'Some destinations remain; inspect manually' : 'Owned leaf links removed; source, containers and personal files retained' };
  }
  if (c.adapter === 'defaults') {
    const receipt = readReceipt(ctx); const current = readSettings(ctx);
    const ok = Object.entries(receipt.before).every(([k, old]: [string, any]) => old.present ? JSON.stringify(current[k]) === JSON.stringify(old.value) : !Object.hasOwn(current, k));
    return { ok, detail: 'Recorded prior selected-key values compared after restoration; private settings retained' };
  }
  if (c.adapter === 'todo') {
    const enabled = (readSettings(ctx).packages ?? []).includes(c.accepted);
    return { ok: !enabled && (op.selection.scope !== 'application' || after.installed === false), detail: 'Exact declaration removed; auth/sessions and unrelated packages retained' };
  }
  return { ok: after.installed === false, detail: after.evidence.join('; ') };
}
export function execute(ctx: Context, components: Component[], planned: Plan, approve: boolean): Result[] {
  if (!approve) throw new Error('Execution requires explicit approval of the rendered plan');
  if (planned.conflicts.length) throw new Error('Resolve all plan conflicts before execution');
  const byId = new Map(components.map(c => [c.id, c]));
  const results: Result[] = [];
  const active = planned.operations.filter(o => !['noop', 'skip'].includes(o.kind));
  // Refuse stale plans across the entire transaction before first mutation.
  delete ctx.brew; delete ctx.brewError;
  for (const op of active) {
    const c = byId.get(op.component); if (!c) throw new Error('Unknown planned component');
    if (detect(ctx, c).fingerprint !== op.before.fingerprint) throw new Error(`State/source changed after preview: ${c.id}`);
    preflight(ctx, c, op);
  }
  let stopped = false;
  for (const op of planned.operations) {
    const c = byId.get(op.component)!;
    if (stopped || op.kind === 'skip' || op.kind === 'noop') {
      results.push({ component: c.id, status: 'skipped', detail: stopped ? 'Stopped after failure; no automatic rollback or further mutations' : op.reason }); continue;
    }
    try {
      // Recheck immediately before each mutation, except receipt changes intentionally caused by approved dependencies.
      preflight(ctx, c, op);
      apply(ctx, c, op);
      const check = verify(ctx, c, op);
      if (check.ok && op.kind === 'remove' && c.adapter === 'defaults') fs.unlinkSync(receiptPath(ctx));
      results.push({ component: c.id, status: check.ok ? 'success' : 'partial', detail: check.detail });
      if (!check.ok) stopped = true;
    } catch (e) {
      const changed = detect(ctx, c).fingerprint !== op.before.fingerprint;
      results.push({ component: c.id, status: changed ? 'partial' : 'failed', detail: (e as Error).message }); stopped = true;
    }
  }
  return results;
}
export function saveProfile(ctx: Context, profile: string) {
  const dir = privateDir(ctx, '.local/state/ae');
  const p = safePath(ctx.home, '.local/state/ae/profile.json');
  if (stat(p) && (!stat(p)?.isFile() || stat(p)?.isSymbolicLink())) throw new Error('Unsafe profile receipt');
  const tmp = path.join(dir, `profile-${crypto.randomUUID()}`);
  fs.writeFileSync(tmp, JSON.stringify({ profile }) + '\n', { flag: 'wx', mode: 0o600 }); fs.renameSync(tmp, p);
}
export function previousProfile(ctx: Context): string | undefined {
  const p = safePath(ctx.home, '.local/state/ae/profile.json');
  if (!stat(p)) return undefined;
  if (!stat(p)?.isFile() || stat(p)?.isSymbolicLink()) throw new Error('Unsafe profile receipt');
  try { return JSON.parse(fs.readFileSync(p, 'utf8')).profile; }
  catch { throw new Error('Invalid private profile receipt; inspect locally'); }
}
