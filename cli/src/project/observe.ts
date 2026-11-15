import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Component } from '../setup/types.ts';
import { digest, safePath, sourceLeaves, stat } from '../setup/files.ts';
import { resolve } from './resolve.ts';
import { RECEIPT_PATH, type Entry, type Observation, type ProjectContext, type Receipt } from './types.ts';

const sha256 = (bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex');
const leafProject = (c: Component) => { if (c.project?.kind !== 'leaf') throw new Error(`${c.id} is not a project leaf`); return c.project; };

// Read-only: the target must be an explicit, existing, real Git repository root outside the canonical checkout.
// Containment uses native (on-disk case) canonical paths plus a dev:ino ancestor comparison, so case variants of the
// canonical path on case-insensitive volumes cannot alias it.
export function projectTarget(root: string, target: string): string {
  const resolved = path.resolve(target);
  const s = stat(resolved);
  if (!s) throw new Error(`Target does not exist: ${resolved}`);
  if (s.isSymbolicLink() || !s.isDirectory()) throw new Error(`Target must be a real directory, not a symlink: ${resolved}`);
  const native = fs.realpathSync.native(resolved), repository = fs.realpathSync.native(root), repositoryId = fs.statSync(repository);
  const inside = (p: string) => { for (let d = p; ; d = path.dirname(d)) {
    const k = fs.statSync(d);
    if (k.dev === repositoryId.dev && k.ino === repositoryId.ino) return true;
    if (path.dirname(d) === d) return false;
  } };
  if (native === repository || native.startsWith(repository + path.sep) || inside(native)) throw new Error('Target must be outside the canonical checkout');
  if (native !== resolved) throw new Error(`Target path passes through a symlink or is not spelled in its canonical on-disk form; pass its real path: ${native}`);
  if (!stat(path.join(resolved, '.git'))) throw new Error(`Target is not a Git repository root (no .git): ${resolved}`);
  return resolved;
}

// Selected-only lazy source inspection: only called for leaves in the resolved selection.
export function leafEntries(root: string, c: Component): Entry[] {
  const p = leafProject(c);
  const base = path.join(fs.realpathSync(root), p.source);
  const s = stat(base);
  if (!s || !s.isDirectory()) throw new Error(`Source for ${c.id} is missing or not a directory: ${p.source}`);
  const files = sourceLeaves({ root }, { packageDir: path.dirname(p.source), packageName: path.basename(p.source) });
  if (!files.length) throw new Error(`Source for ${c.id} contains no files: ${p.source}`);
  // Canonical full-relative-path ordering: must equal the order readReceipt enforces (sourceLeaves walks per directory).
  return files.map(f => ({ relative: path.join(p.target, f.relative), source: path.join(p.source, f.relative), sha256: sha256(fs.readFileSync(f.source)) }))
    .sort((a, b) => a.relative < b.relative ? -1 : a.relative > b.relative ? 1 : 0);
}

export function buildReceipt(source: string, selected: string[], leaves: Record<string, Entry[]>): string {
  const body = { schema: 1 as const, source, selected: [...selected].sort(),
    leaves: Object.fromEntries(Object.keys(leaves).sort().map(k => [k, leaves[k]])) };
  return JSON.stringify({ ...body, integrity: digest(body) }, null, 2) + '\n';
}

const strict = (value: unknown, keys: string[], what: string) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join() !== [...keys].sort().join()) throw new Error(`Receipt refused: ${what} has unexpected shape`);
  return value as Record<string, any>;
};
const cleanRelative = (v: unknown) => typeof v === 'string' && v !== '' && !path.isAbsolute(v) && path.normalize(v) === v && !v.split(path.sep).includes('..');

// Read and strictly validate the local installation receipt. Any inconsistency refuses the whole operation.
export function readReceipt(ctx: ProjectContext, components: Component[]): { receipt?: Receipt; text: string | null } {
  let p: string;
  try { p = safePath(ctx.target, RECEIPT_PATH); } catch (e) { throw new Error(`Receipt refused: unsafe location (${(e as Error).message})`); }
  const s = stat(p);
  if (!s) return { text: null };
  if (!s.isFile() || s.isSymbolicLink()) throw new Error('Receipt refused: not a regular file');
  const text = fs.readFileSync(p, 'utf8');
  let value: any;
  try { value = JSON.parse(text); } catch { throw new Error('Receipt refused: invalid JSON'); }
  strict(value, ['schema', 'source', 'selected', 'leaves', 'integrity'], 'receipt');
  const { schema, source, selected, leaves, integrity } = value;
  if (schema !== 1) throw new Error('Receipt refused: unsupported schema');
  if (typeof source !== 'string' || !path.isAbsolute(source) || path.normalize(source) !== source) throw new Error('Receipt refused: invalid source root');
  if (!Array.isArray(selected) || !selected.every(v => typeof v === 'string') || selected.join() !== [...new Set(selected)].sort().join()) throw new Error('Receipt refused: invalid selection');
  if (digest({ schema, source, selected, leaves }) !== integrity) throw new Error('Receipt refused: integrity digest mismatch (edited or corrupt)');
  let expected: string[];
  try { expected = resolve(components, selected).leaves; } catch (e) { throw new Error(`Receipt refused: ${(e as Error).message}`); }
  if (!leaves || typeof leaves !== 'object' || Array.isArray(leaves) || Object.keys(leaves).join() !== [...expected].sort().join()) throw new Error('Receipt refused: recorded leaves do not match the recorded selection');
  for (const id of expected) {
    const project = leafProject(components.find(c => c.id === id)!);
    const entries = leaves[id];
    if (!Array.isArray(entries) || !entries.length) throw new Error(`Receipt refused: no entries for ${id}`);
    for (const raw of entries) {
      const e = strict(raw, ['relative', 'source', 'sha256'], `entry of ${id}`);
      if (!cleanRelative(e.relative) || !cleanRelative(e.source) || typeof e.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(e.sha256)) throw new Error(`Receipt refused: malformed entry for ${id}`);
      if (!e.source.startsWith(project.source + path.sep) || e.relative !== project.target + e.source.slice(project.source.length)) throw new Error(`Receipt refused: entry for ${id} claims a path outside its declared target (${e.relative})`);
    }
    if (entries.map((e: Entry) => e.relative).join('\0') !== [...entries].map((e: Entry) => e.relative).sort().join('\0')) throw new Error(`Receipt refused: entries for ${id} are not canonical`);
  }
  return { receipt: value as Receipt, text };
}

// Actual ownership: a target is owned only when it is a literal symlink to exactly its canonical source file.
export function observe(ctx: ProjectContext, c: Component): Observation {
  const repository = fs.realpathSync(ctx.root);
  const missing = new Set<string>();
  const entries = leafEntries(ctx.root, c).map(e => {
    let state: Observation['entries'][number]['state'], detail: string;
    try {
      const abs = safePath(ctx.target, e.relative), s = stat(abs), wanted = path.join(repository, e.source);
      if (!s) { state = 'missing'; detail = 'Not present'; }
      else if (s.isSymbolicLink()) {
        const actual = path.resolve(path.dirname(abs), fs.readlinkSync(abs));
        [state, detail] = actual === wanted ? ['owned', 'Linked to canonical source'] : ['foreign', `Existing symlink points elsewhere (${actual}); never adopted`];
      } else [state, detail] = ['foreign', `Existing ${s.isDirectory() ? 'directory' : 'file'} is not a managed link; preserved, never overwritten`];
      for (let d = path.dirname(e.relative); d !== '.'; d = path.dirname(d)) if (!stat(path.join(ctx.target, d))) missing.add(d);
    } catch (error) { state = 'unsafe'; detail = `Unsafe path refused: ${(error as Error).message}`; }
    return { ...e, state, detail };
  });
  const missingDirs = [...missing].sort((a, b) => a.split(path.sep).length - b.split(path.sep).length || a.localeCompare(b));
  return { id: c.id, entries, missingDirs };
}

export function receiptDirMissing(ctx: ProjectContext): boolean { return !stat(path.join(ctx.target, path.dirname(RECEIPT_PATH))); }
