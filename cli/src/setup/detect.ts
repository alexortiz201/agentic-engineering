import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Component, Context, State } from './types.ts';
import { legacyMigration } from './migration.ts';
import { digest, leaves, owned, portableDefaults, readSettings, safePath, stat, receiptFingerprint, isTodoSource, installedTodoVersion } from './files.ts';
function state(status: State['status'], installed: State['installed'], enabled: State['enabled'], evidence: string[], data: unknown): State {
  return { status, available: true, installed, enabled, loaded: 'unknown', evidence, fingerprint: digest(data) };
}
export function inspectBrew(ctx: Context) {
  if (ctx.brew || ctx.brewError) return;
  // Homebrew may initialize caches even for info. Isolate those incidental writes from HOME.
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-brew-detect-'));
  let result;
  try {
    result = ctx.run('brew', ['info', '--json=v2', '--installed'], {
      HOME: scratch, HOMEBREW_CACHE: path.join(scratch, 'cache'), HOMEBREW_LOGS: path.join(scratch, 'logs'),
      HOMEBREW_NO_ANALYTICS: '1', HOMEBREW_NO_AUTO_UPDATE: '1',
    });
  } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
  if (result.code === 127) { ctx.brew = { formulae: [], casks: [] }; ctx.brewError = 'Homebrew unavailable'; return; }
  if (result.code !== 0) { ctx.brewError = 'Unable to inspect Homebrew receipts'; return; }
  try { const v = JSON.parse(result.stdout); if (!Array.isArray(v.formulae) || !Array.isArray(v.casks)) throw Error(); ctx.brew = v; }
  catch { ctx.brewError = 'Invalid Homebrew metadata'; }
}
export function brewEntry(ctx: Context, c: Component): any {
  const list = c.brewKind === 'cask' ? ctx.brew?.casks : ctx.brew?.formulae;
  return list?.find(v => [v.name, v.full_name, v.token, ...(v.aliases ?? [])].includes(c.packageName));
}
export function detect(ctx: Context, c: Component): State {
  try {
    if (c.adapter === 'stow') {
      const migration = legacyMigration(ctx, c);
      if (migration) return migration;
      const files = leaves(ctx, c);
      const details = files.map(f => {
        const s = stat(f.target);
        return { relative: f.relative, source: digest(fs.statSync(f.source).isDirectory() ? { reference: fs.realpathSync(f.source) } : fs.readFileSync(f.source).toString('base64')),
          target: s?.isSymbolicLink() ? fs.readlinkSync(f.target) : s ? `foreign:${s.mode}:${s.size}:${s.mtimeMs}` : null,
          owned: owned(f.target, f.source) };
      });
      const count = details.filter(f => f.owned).length;
      const foreign = details.some(f => f.target !== null && !f.owned);
      const settings = c.id === 'pi-theme' ? readSettings(ctx) : undefined;
      const enabled = count === files.length && (c.id !== 'pi-theme' || settings?.theme === 'purple-dreams');
      return state(foreign ? 'conflict' : enabled ? 'current' : count ? 'partial' : 'missing',
        count > 0, c.id === 'foundations' ? false : enabled, [foreign ? 'Occupied foreign destination; never adopted' : `${count}/${files.length} exact owned leaf links`, ...(c.id === 'pi-theme' ? ['Theme selection is independently reconciled with a private rollback receipt'] : []), ...files.map(f => f.target)], { details, settings, ...(c.id === 'pi-theme' ? { receipt: receiptFingerprint(ctx, '.local/state/ae/theme.json') } : {}) });
    }
    if (c.adapter === 'defaults') {
      const v = readSettings(ctx); const expected = portableDefaults(ctx);
      const equal = Object.entries(expected).every(([k, value]) => JSON.stringify(v[k]) === JSON.stringify(value));
      return state(equal ? 'current' : Object.keys(v).length ? 'partial' : 'missing', Object.keys(v).length > 0, equal,
        ['Selected-key comparison; theme/packages/discovery and private keys excluded'], { v, expected, receipt: receiptFingerprint(ctx, '.local/state/ae/defaults.json') });
    }
    if (c.adapter === 'todo') {
      const v = readSettings(ctx);
      if (v.packages !== undefined && (!Array.isArray(v.packages) || v.packages.some((p: unknown) => typeof p !== 'string'))) {
        return state('conflict', 'unknown', 'unknown', ['Complex package declarations require manual reconciliation'], v);
      }
      const declarations: string[] = v.packages ?? [];
      const matching = declarations.filter(isTodoSource);
      const installed = installedTodoVersion(ctx);
      const accepted = c.accepted!.split('@').at(-1);
      const enabled = matching.length === 1 && matching[0] === c.accepted;
      const status = matching.length > 1 ? 'conflict' : enabled && installed === accepted ? 'current' : !matching.length && !installed ? 'missing' : installed && installed !== accepted ? 'update' : 'partial';
      return { ...state(status, !!installed, enabled, [`Declaration: ${matching.join(', ') || 'absent'}; cache version: ${installed ?? 'absent'}; accepted: ${accepted}`], { v, installed }), installedVersion: installed };
    }
    if (c.id === 'homebrew') {
      inspectBrew(ctx);
      return state(ctx.brewError === 'Homebrew unavailable' ? 'missing' : ctx.brew ? 'current' : 'unknown',
        ctx.brewError === 'Homebrew unavailable' ? false : ctx.brew ? true : 'unknown', 'unknown',
        [ctx.brewError ?? 'Homebrew metadata command succeeded'], ctx.brewError ?? 'available');
    }
    if (c.adapter === 'brew') {
      inspectBrew(ctx);
      if (!ctx.brew) return state('unknown', 'unknown', 'unknown', [ctx.brewError!], ctx.brewError);
      const entry = brewEntry(ctx, c);
      const versions = c.brewKind === 'cask' ? entry?.installed : entry?.installed?.map((v: any) => v.version);
      const installed = Array.isArray(versions) ? versions.length > 0 : !!versions;
      // Detect a common unreceipted app, not just a matching executable name.
      const apps: Record<string, string> = { ghostty: 'Ghostty.app', 'docker-desktop': 'Docker.app', 'ollama-app': 'Ollama.app', 'visual-studio-code': 'Visual Studio Code.app' };
      const artifact = apps[c.packageName!];
      const unmanaged = !installed && artifact && stat(path.join(ctx.applications ?? '/Applications', artifact));
      return { ...state(unmanaged ? 'conflict' : installed ? 'current' : 'missing', !!installed, 'unknown',
        [unmanaged ? 'Application exists without matching Homebrew receipt; adoption unsupported' : `Homebrew receipt: ${installed ? JSON.stringify(versions) : 'absent'}; unpinned declaration; upstream updates not inferred`], entry ?? null), installedVersion: installed ? (Array.isArray(versions) ? versions.join(', ') : String(versions)) : undefined,
        ...(unmanaged ? { ownership: 'unmanaged' as const } : {}) };
    }
    if (c.id === 'pi') {
      const shim = safePath(ctx.home, '.pi/agent/bin/pi');
      const receipt = safePath(ctx.home, '.pi/agent/install/managed-install.json');
      const versionFile = safePath(ctx.home, '.pi/agent/install/current-version');
      const entry = safePath(ctx.home, '.local/bin/pi');
      if (!stat(shim) && !stat(receipt)) {
        const other = ctx.run('which', ['pi']);
        return state(other.code === 0 ? 'conflict' : 'missing', other.code === 0, false, ['No official managed receipt/shim; existing global installs are not adopted'], other.stdout);
      }
      if (!stat(shim)?.isFile() || stat(shim)?.isSymbolicLink() || !stat(receipt)?.isFile() || stat(receipt)?.isSymbolicLink() || !stat(versionFile)?.isFile() || stat(versionFile)?.isSymbolicLink()) {
        return state('conflict', true, 'unknown', ['Unexpected managed Pi topology'], 'topology');
      }
      const version = fs.readFileSync(versionFile, 'utf8').trim();
      const managed = JSON.parse(fs.readFileSync(receipt, 'utf8'));
      if (managed.kind !== 'pi-managed-install' || managed.schemaVersion !== 1 || managed.layout !== 'releases-v1' || managed.entrypoint?.type !== 'symlink' || managed.entrypoint?.path !== entry || !(stat(shim)!.mode & 0o111)) {
        return state('conflict', true, 'unknown', ['Managed receipt/entrypoint or shim permissions require ownership review'], managed);
      }
      if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Invalid managed version marker');
      const metadata = safePath(ctx.home, `.pi/agent/install/releases/${version}/node_modules/@earendil-works/pi-coding-agent/package.json`);
      if (!stat(metadata)?.isFile() || stat(metadata)?.isSymbolicLink()) throw new Error('Managed release metadata absent or unmanaged');
      const release = JSON.parse(fs.readFileSync(metadata, 'utf8'));
      if (release.name !== '@earendil-works/pi-coding-agent' || release.version !== version) throw new Error('Managed release identity/version mismatch');
      const entryOwned = owned(entry, shim);
      const resolved = ctx.run('which', ['pi']);
      const resolution = resolved.code === 0 && [entry, shim].includes(resolved.stdout.trim());
      const status = version !== c.accepted ? 'update' : entryOwned && resolution ? 'current' : 'partial';
      return { ...state(status, true, !!entryOwned && resolution, [`Managed receipt and shim; version ${version}; accepted ${c.accepted}; PATH resolution ${resolution ? 'matches' : 'requires review'}`], { version, entryOwned, resolution }), installedVersion: version };
    }
    if (c.id === 'oh-my-zsh') {
      const p = safePath(ctx.home, '.oh-my-zsh/oh-my-zsh.sh');
      const present = !!stat(p)?.isFile();
      return state(present ? 'current' : 'missing', present, 'unknown', ['Upstream shell framework file; shell loading not measured'], present);
    }
    if (c.id === 'claude-code') {
      const which = ctx.run('which', ['claude']);
      if (which.code !== 0 || !which.stdout.trim()) return state('missing', false, false, ['Claude Code CLI not found in PATH'], null);
      const cli = which.stdout.trim();
      const ver = ctx.run(cli, ['--version']);
      const v = ver.code === 0 ? (ver.stdout.match(/\d+\.\d+\.\d+/) ?? [])[0] : undefined;
      // Authentication, sessions and project settings are not read.
      return { ...state(v ? 'current' : 'unknown', true, 'unknown',
        [v ? `Claude Code ${v}` : `CLI found at ${cli}; version unresolvable`,
          `PATH: ${cli}`, 'Authentication, sessions and project settings are independent; not read or modified'],
        { cli, version: v ?? null }), ...(v ? { installedVersion: v } : {}) };
    }
    const p = safePath(ctx.home, '.pi/agent/extensions/herdr-agent-state.ts');
    const s = stat(p);
    return state(s ? 'unknown' : 'missing', !!s, 'unknown', [s ? 'Reporter file present; generator ownership/version needs manual verification' : 'Reporter absent'], s ? [s.mode, s.size, s.mtimeMs] : null);
  } catch (error) {
    return state('conflict', 'unknown', 'unknown', [(error as Error).message], (error as Error).message);
  }
}
export function detectAll(ctx: Context, components: Component[]): Record<string, State> {
  return Object.fromEntries(components.map(c => [c.id, detect(ctx, c)]));
}
