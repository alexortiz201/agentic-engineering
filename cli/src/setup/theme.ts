import fs from 'node:fs';
import path from 'node:path';
import type { Context } from './types.ts';
import { privateDir, readSettings, safePath, stat, writeSettings } from './files.ts';
const receiptPath = (ctx: Context) => safePath(ctx.home, '.local/state/ae/theme.json');
function receipt(ctx: Context): { present: boolean; value?: unknown } {
  const p = receiptPath(ctx); const s = stat(p);
  if (!s?.isFile() || s.isSymbolicLink()) throw new Error('No theme ownership receipt; reconcile active theme manually before removing it');
  let v;
  try { v = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { throw new Error('Invalid private theme receipt; inspect locally'); }
  if (typeof v.present !== 'boolean') throw new Error('Invalid theme receipt');
  return v;
}
export function themePreflight(ctx: Context, remove: boolean) {
  const current = readSettings(ctx);
  if (remove && current.theme === 'purple-dreams') receipt(ctx);
  if (!remove && stat(receiptPath(ctx)) && current.theme !== 'purple-dreams') {
    const old = receipt(ctx);
    if (Object.hasOwn(current, 'theme') !== old.present || old.present && JSON.stringify(current.theme) !== JSON.stringify(old.value)) throw new Error('Theme changed after setup; reconcile existing receipt manually');
  }
}
export function installTheme(ctx: Context) {
  const current = readSettings(ctx);
  if (current.theme === 'purple-dreams') return;
  const dir = privateDir(ctx, '.local/state/ae');
  if (!stat(receiptPath(ctx))) fs.writeFileSync(path.join(dir, 'theme.json'), JSON.stringify({ present: Object.hasOwn(current, 'theme'), value: current.theme }) + '\n', { flag: 'wx', mode: 0o600 });
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
