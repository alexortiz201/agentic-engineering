import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Component, Context, State } from './types.ts';
import { digest, sourceLeaves, stat } from './files.ts';

// Recognize a review candidate, not transfer ownership. Never detach or traverse an unknown parent link.
export function legacyMigration(ctx: Context, c: Component): State | undefined {
  if (c.adapter !== 'stow' || !['setup/computer', 'harness/pi/packages'].includes(c.packageDir!)) return;
  const computer = c.packageDir === 'setup/computer';
  const oldRoot = computer ? path.resolve(ctx.root, '../dotfiles') : path.join(ctx.root, 'pi');
  const oldBase = computer ? path.join(oldRoot, c.packageName!) : oldRoot;
  let provenance: { source: string; sha256: string }[] = [];
  if (computer) {
    try { provenance = JSON.parse(fs.readFileSync(path.join(ctx.root, 'setup/computer/source-provenance.json'), 'utf8')).files; }
    catch { return; }
  }
  const records: { path: string; target: string; hash: string }[] = [];
  for (const leaf of sourceLeaves(ctx, c)) {
    let current = ctx.home; let matched = false;
    const parts = leaf.relative.split(path.sep);
    for (let i = 0; i < parts.length; i++) {
      current = path.join(current, parts[i]);
      const s = stat(current); if (!s) break;
      if (s.isSymbolicLink()) {
        const literal = fs.readlinkSync(current);
        const target = path.resolve(path.dirname(current), literal);
        // Already-owned setup leaves can coexist with old leaves during an interrupted handoff.
        if (i === parts.length - 1 && target === leaf.source) { matched = true; break; }
        const expected = path.join(oldBase, ...parts.slice(0, i + 1));
        if (target !== expected) return;
        const oldLeaf = path.join(oldBase, leaf.relative);
        try {
          const real = fs.realpathSync(oldLeaf);
          if (!real.startsWith(fs.realpathSync(oldRoot) + path.sep) || !fs.statSync(real).isFile()) return;
          const bytes = fs.readFileSync(real);
          const hash = crypto.createHash('sha256').update(bytes).digest('hex');
          if (computer) {
            const entry = provenance.find(v => v.source === `${c.packageName}/${leaf.relative.split(path.sep).join('/')}`);
            if (!entry || entry.sha256 !== hash) return;
          } else if (!bytes.equals(fs.readFileSync(leaf.source))) return;
          records.push({ path: current, target: literal, hash }); matched = true;
        } catch { return; }
        break;
      }
      if (!s.isDirectory()) return; // Unknown regular file or non-directory parent.
    }
    if (!matched && stat(current)) return;
  }
  if (!records.length) return;
  const owner = computer ? 'legacy-dotfiles' : 'accepted-pi';
  return { status: 'migration', available: true, installed: true, enabled: 'unknown', loaded: 'unknown', ownership: owner,
    fingerprint: digest(records), evidence: [
      `Migration required: verified ${computer ? 'old dotfiles import digests' : 'accepted root Pi resource bytes'} and exact legacy link targets.`,
      `Possible managed migration: ${oldBase} → ${path.join(ctx.root, c.packageDir!, c.packageName!)}.`,
      'Review setup/MIGRATION.md and parent-directory/private contents explicitly. Automatic replacement/removal is blocked; this is not new ownership approval.',
      ...records.map(r => `${r.path} -> ${r.target}`),
    ] };
}
