import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Component, Context } from './types.ts';
export const digest = (value: unknown) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function stat(p: string) { try { return fs.lstatSync(p); } catch (e: any) { if (e.code === 'ENOENT') return undefined; throw e; } }
export function safePath(home: string, relative: string): string {
  const resolved = path.resolve(home, relative);
  if (resolved === home || !resolved.startsWith(home + path.sep)) throw new Error('Path escapes target home');
  // Reject even symlinks that happen to resolve back inside HOME. Never traverse them.
  for (let p = path.dirname(resolved); p !== home; p = path.dirname(p)) {
    const s = stat(p);
    if (s && (!s.isDirectory() || s.isSymbolicLink())) throw new Error(`Unsafe parent: ${p}`);
  }
  if (stat(home)?.isSymbolicLink() || !stat(home)?.isDirectory()) throw new Error('Home must be a real existing directory');
  return resolved;
}
export function sourceLeaves(ctx: Context, c: Component): { source: string; relative: string }[] {
  const repository = fs.realpathSync(ctx.root);
  const base = path.join(repository, c.packageDir!, c.packageName!);
  const result: { source: string; relative: string }[] = [];
  function walk(dir: string) {
    for (const name of fs.readdirSync(dir).sort()) {
      const source = path.join(dir, name);
      if (['.DS_Store', '.stow-local-ignore'].includes(name)) continue;
      const s = fs.lstatSync(source);
      if (s.isDirectory()) walk(source);
      else {
        if (!fs.realpathSync(source).startsWith(repository + path.sep)) throw new Error('Source escapes repository');
        const relative = path.relative(base, source);
        result.push({ source, relative });
      }
    }
  }
  walk(base);
  return result;
}
export function leaves(ctx: Context, c: Component): { source: string; relative: string; target: string }[] {
  return sourceLeaves(ctx, c).map(f => ({ ...f, target: safePath(ctx.home, f.relative) }));
}
export function owned(target: string, source: string): boolean {
  return !!stat(target)?.isSymbolicLink() && path.resolve(path.dirname(target), fs.readlinkSync(target)) === source;
}
export function settingsPath(ctx: Context) {
  const p = safePath(ctx.home, '.pi/agent/settings.json');
  const s = stat(p);
  if (s && (!s.isFile() || s.isSymbolicLink())) throw new Error('Settings must be a local regular file; no adoption');
  return p;
}
export function readSettings(ctx: Context): Record<string, any> {
  const p = settingsPath(ctx);
  let value;
  try { value = stat(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; }
  catch { throw new Error('Invalid settings JSON; inspect privately (contents suppressed)'); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid settings object');
  return value;
}
export const isTodoSource = (value: string): boolean => /^npm:@arhen\/pi-core-todo(?:@[^/\s]+)?$/.test(value);
export function installedTodoVersion(ctx: Context): string | undefined {
  const p = safePath(ctx.home, '.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json');
  const s = stat(p); if (!s) return undefined;
  if (!s.isFile() || s.isSymbolicLink()) throw new Error('Unmanaged Todo metadata');
  const value = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (value.name !== '@arhen/pi-core-todo' || typeof value.version !== 'string') throw new Error('Todo package identity is not verified');
  return value.version;
}
export function portableDefaults(ctx: Context): Record<string, unknown> {
  const seed = JSON.parse(fs.readFileSync(path.join(ctx.root, 'harness/pi/settings.example.json'), 'utf8'));
  const { packages, theme, skills, extensions, prompts, ...values } = seed;
  return values;
}
export function privateDir(ctx: Context, relative: string): string {
  const p = safePath(ctx.home, relative);
  const s = stat(p);
  if (s && (!s.isDirectory() || s.isSymbolicLink() || (s.mode & 0o077))) throw new Error(`Private state directory has unsafe type/mode: ${p}`);
  fs.mkdirSync(p, { recursive: true, mode: 0o700 });
  return p;
}
// Receipts are part of the reviewed ownership state, not just settings values.
export function receiptFingerprint(ctx: Context, relative: string) {
  const p = safePath(ctx.home, relative), s = stat(p);
  return s ? { mode: s.mode, content: s.isFile() && !s.isSymbolicLink() ? digest(fs.readFileSync(p).toString('base64')) : null } : null;
}
export function replaceReceipt(ctx: Context, relative: string, value: unknown) {
  const p = safePath(ctx.home, relative), s = stat(p);
  if (s && (!s.isFile() || s.isSymbolicLink() || (s.mode & 0o077))) throw new Error('Unsafe private receipt; reconcile manually');
  privateDir(ctx, '.local/state/ae');
  if (s) {
    const dir = privateDir(ctx, '.local/state/ae/backups');
    fs.writeFileSync(path.join(dir, `${path.basename(p, '.json')}-${crypto.randomUUID()}.json`), fs.readFileSync(p), { flag: 'wx', mode: 0o600 });
  }
  const tmp = `${p}.ae-${crypto.randomUUID()}`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  fs.renameSync(tmp, p);
}
export function writeSettings(ctx: Context, values: Record<string, unknown>) {
  const p = settingsPath(ctx);
  const dir = privateDir(ctx, '.local/state/ae/backups');
  if (stat(p)) fs.writeFileSync(path.join(dir, `settings-${crypto.randomUUID()}.json`), fs.readFileSync(p), { flag: 'wx', mode: 0o600 });
  fs.mkdirSync(path.dirname(p), { recursive: true, mode: 0o700 });
  const tmp = `${p}.ae-${crypto.randomUUID()}`;
  fs.writeFileSync(tmp, JSON.stringify(values, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  fs.renameSync(tmp, p);
}
