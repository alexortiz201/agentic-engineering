import fs from 'node:fs';
import type { Context } from './types.ts';
import { readSettings, replaceReceipt, safePath, stat, writeSettings } from './files.ts';
const receiptPath = (ctx: Context) => safePath(ctx.home, '.local/state/ae/theme.json');
function receipt(ctx: Context): { present: boolean; value?: unknown } {
  const p = receiptPath(ctx); const s = stat(p);
  if (!s?.isFile() || s.isSymbolicLink() || (s.mode & 0o077)) throw new Error('No theme ownership receipt; reconcile active theme manually before removing it');
  let v;
  try { v = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { throw new Error('Invalid private theme receipt; inspect locally'); }
  if (!v || typeof v.present !== 'boolean' || v.present && !Object.hasOwn(v, 'value')) throw new Error('Invalid theme receipt');
  return v;
}
export function themePreflight(ctx: Context, remove: boolean) {
  const current = readSettings(ctx);
  if (remove && current.theme === 'purple-dreams') receipt(ctx);
  // An explicit install may choose Purple Dreams again after personal preference drift.
  // Validate retained evidence before archiving it; never adopt an ambiguous receipt.
  if (!remove && stat(receiptPath(ctx))) receipt(ctx);
}
export function installTheme(ctx: Context) {
  const current = readSettings(ctx);
  if (current.theme === 'purple-dreams') return;
  themePreflight(ctx, false);
  replaceReceipt(ctx, '.local/state/ae/theme.json', { present: Object.hasOwn(current, 'theme'), value: current.theme });
  writeSettings(ctx, { ...current, theme: 'purple-dreams' });
}
export function removeTheme(ctx: Context) {
  const current = readSettings(ctx);
  if (current.theme === 'purple-dreams') {
    const old = receipt(ctx);
    if (old.present) current.theme = old.value; else delete current.theme;
    writeSettings(ctx, current);
  }
  // Keep receipt as recovery evidence; no arbitrary personal-file cleanup.
}
