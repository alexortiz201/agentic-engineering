import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { catalog } from '../src/components/catalog.ts';
import { profiles } from '../src/profiles/index.ts';
import { actionLabel, chooseProfile, cycleAction, rememberChoices, setAction, statusLabel } from '../src/prompts/choices.ts';
import { detect } from '../src/setup/detect.ts';
import { cleanupReview, execute } from '../src/setup/execute.ts';
import { plan } from '../src/setup/plan.ts';
import type { Component, Context, Selection, SetupSession, State, Status } from '../src/setup/types.ts';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const observed = (status: Status): State => ({ status, available: true, installed: status !== 'missing', enabled: 'unknown', loaded: 'unknown', evidence: [status === 'migration' ? 'Migration required; explicit source ownership handoff review' : status], fingerprint: status });

test('15 bulk selections calculate install/update/no-op automatically, without action decisions', () => {
  const components: Component[] = Array.from({ length: 15 }, (_, i) => ({ id: `c${i}`, name: `Component ${i}`, owner: 'fixture', description: '', dependencies: [], adapter: 'stow', packageDir: 'fixture', packageName: `c${i}` }));
  const states = Object.fromEntries(components.map((c, i) => [c.id, observed((['missing', 'update', 'current'] as Status[])[i % 3])]));
  const selected = Object.fromEntries(components.map(c => [c.id, { action: 'install' as const }]));
  const result = plan(components, states, selected);
  assert.deepEqual(result.conflicts, []);
  for (const kind of ['install', 'update', 'noop']) assert.equal(result.operations.filter(o => o.kind === kind).length, 5);
  const skipped = plan(components, states, {});
  assert.ok(skipped.operations.every(o => o.kind === 'skip'));
  for (const status of ['conflict', 'unknown', 'migration'] as Status[]) {
    const blocked = plan(components, { ...states, c0: observed(status) }, selected);
    assert.equal(blocked.operations.find(o => o.component === 'c0')?.kind, 'conflict');
    assert.ok(blocked.conflicts.length);
  }
});

test('direct tri-state choices invalidate old removal approval only when action changes', () => {
  const selections: Record<string, Selection> = {};
  cycleAction(selections, 'git'); assert.equal(selections.git.action, 'install');
  cycleAction(selections, 'git'); assert.equal(selections.git.action, 'remove');
  selections.git = { action: 'remove', scope: 'review', confirmed: true, cleanup: ['/owned'] };
  setAction(selections, 'git', 'remove'); assert.equal(selections.git.confirmed, true);
  cycleAction(selections, 'git'); assert.deepEqual(selections.git, { action: 'keep' });
  setAction(selections, 'git', 'remove'); assert.deepEqual(selections.git, { action: 'remove' });
});

test('profile recommendations are visible on existing installations; explicit overrides survive back/profile changes', () => {
  const components = catalog(root); const states = Object.fromEntries(components.map(c => [c.id, observed('current')]));
  const session: SetupSession = { profile: 'custom', selections: {} };
  chooseProfile(session, 'mac-workstation', components, states);
  for (const id of profiles[0].recommendations) assert.equal(session.selections[id].action, 'install');
  const choices = structuredClone(session.selections);
  choices['pi-theme'] = { action: 'keep' }; choices['config-ssh'] = { action: 'remove', scope: 'configuration', confirmed: true };
  rememberChoices(session, choices);
  chooseProfile(session, 'mac-laptop', components, states);
  assert.equal(session.selections['pi-theme'].action, 'keep'); assert.equal(session.selections['config-ssh'].confirmed, true);
  assert.equal(session.selections['brew-herdr'].action, 'keep'); // untouched workstation recommendation does not leak
  chooseProfile(session, 'mac-workstation', components, states);
  assert.equal(session.selections['pi-theme'].action, 'keep'); assert.equal(session.selections['brew-herdr'].action, 'install');
  assert.equal(session.selections['config-ssh'].confirmed, true);
  // Even an explicit choice equal to today's recommendation survives a different profile.
  rememberChoices(session, session.selections, ['brew-herdr']);
  chooseProfile(session, 'custom', components, states);
  assert.equal(session.selections['brew-herdr'].action, 'install');
  assert.equal(session.selections['pi-theme'].action, 'keep');
});

test('only explicitly selected and confirmed removals produce deletion operations', () => {
  const components = catalog(root); const states = Object.fromEntries(components.map(c => [c.id, observed('current')]));
  for (const scope of ['configuration', 'application', 'review'] as const) {
    const unconfirmed = plan(components, states, { 'config-git': { action: 'remove', scope } });
    assert.equal(unconfirmed.operations.find(o => o.component === 'config-git')?.kind, 'conflict');
    assert.ok(!unconfirmed.operations.some(o => o.kind === 'remove'));
    const confirmed = plan(components, states, { 'config-git': { action: 'remove', scope, confirmed: true } });
    assert.deepEqual(confirmed.operations.filter(o => o.kind === 'remove').map(o => o.component), ['config-git']);
  }
});

for (const folded of [false, true]) test(`verified old dotfiles ${folded ? 'folded parent' : 'leaf'} is migration required, never current/update`, t => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-migration-label-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo'); const home = path.join(dir, 'home'); const old = path.join(dir, 'dotfiles');
  fs.mkdirSync(home); const pkg = folded ? 'ghostty' : 'git'; const relative = folded ? '.config/ghostty/config' : '.gitconfig';
  const write = (p: string, text: string) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
  write(path.join(repo, 'setup/computer', pkg, relative), 'new portable config');
  const oldLeaf = path.join(old, pkg, relative); write(oldLeaf, 'accepted old config');
  write(path.join(repo, 'setup/computer/source-provenance.json'), JSON.stringify({ files: [{ source: `${pkg}/${relative}`, sha256: createHash('sha256').update('accepted old config').digest('hex') }] }));
  const target = path.join(home, folded ? '.config/ghostty' : relative);
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.symlinkSync(folded ? path.dirname(oldLeaf) : oldLeaf, target);
  const c: Component = { id: `config-${pkg}`, name: 'Configuration', owner: 'setup/computer', adapter: 'stow', description: '', dependencies: [], packageDir: 'setup/computer', packageName: pkg };
  let commands = 0;
  const ctx: Context = { root: repo, home, platform: 'darwin', run: () => { commands++; throw new Error('No commands expected'); } };
  const s = detect(ctx, c);
  assert.equal(s.status, 'migration'); assert.equal(s.installed, true); assert.equal(s.ownership, 'legacy-dotfiles');
  assert.match(statusLabel(c, s), /Migration required/); assert.doesNotMatch(statusLabel(c, s), /current/i);
  assert.match(actionLabel(c, s, { action: 'install' }), /blocked/);
  for (const action of ['install', 'remove'] as const) {
    const reviewed = plan([c], { [c.id]: s }, { [c.id]: { action, scope: 'configuration', confirmed: true } });
    assert.ok(reviewed.conflicts.length); assert.throws(() => execute(ctx, [c], reviewed, true), /conflicts/);
  }
  assert.equal(commands, 0); assert.ok(fs.lstatSync(target).isSymbolicLink());
  write(oldLeaf, 'changed or unknown config');
  assert.equal(detect(ctx, c).status, 'conflict'); // changed content cannot inherit known ownership
  assert.ok(fs.lstatSync(target).isSymbolicLink());
});

test('application version is distinct from configuration ownership and requested action', () => {
  const components = catalog(root); const app = components.find(c => c.id === 'brew-ghostty')!; const config = components.find(c => c.id === 'config-ghostty')!;
  const installed = { ...observed('current'), installedVersion: '1.4.0' };
  assert.match(statusLabel(app, installed), /Installed 1.4.0.*unpinned/);
  assert.equal(actionLabel(app, installed, { action: 'install' }), 'no-op');
  assert.match(statusLabel(config, { ...observed('migration'), ownership: 'legacy-dotfiles' }), /Migration required.*old dotfiles/);
  assert.equal(actionLabel(config, observed('migration'), { action: 'keep' }), 'no change');
});

test('claude-code is not in any profile recommendation; install and remove plan as conflict (manual)', () => {
  const components = catalog(root);
  const c = components.find(c => c.id === 'claude-code');
  assert.ok(c, 'claude-code component exists in catalog');
  assert.equal(c!.adapter, 'manual');
  for (const p of profiles) assert.ok(!p.recommendations.includes('claude-code'), `claude-code must not be in ${p.id} recommendations`);
  // 'current' + install → noop (already installed); 'missing'/'unknown' + install → conflict (manual adapter)
  assert.equal(plan(components, { 'claude-code': observed('current') }, { 'claude-code': { action: 'install' } }).operations.find(o => o.component === 'claude-code')?.kind, 'noop');
  for (const status of ['missing', 'unknown'] as Status[]) {
    const installOp = plan(components, { 'claude-code': observed(status) }, { 'claude-code': { action: 'install' } }).operations.find(o => o.component === 'claude-code');
    assert.equal(installOp?.kind, 'conflict', `install with ${status} status plans as conflict (manual)`);
  }
  for (const status of ['missing', 'current', 'unknown'] as Status[]) {
    const removePlan = plan(components, { 'claude-code': observed(status) }, { 'claude-code': { action: 'remove', scope: 'configuration', confirmed: true } });
    assert.ok(removePlan.operations.find(o => o.component === 'claude-code')?.kind === 'conflict', `remove with ${status} plans as conflict`);
  }
  // Verify brew-claude-code exists alongside as the actual installation mechanism
  const brew = components.find(c => c.id === 'brew-claude-code');
  assert.ok(brew, 'brew-claude-code Homebrew cask exists alongside claude-code detection component');
});

test('cleanupReview throws for stow component with unsafe parent symlink — guideRemovals must catch this', t => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-cleanup-block-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo'); const home = path.join(dir, 'home');
  fs.mkdirSync(home);
  const src = path.join(repo, 'setup/computer/ghostty/.config/ghostty/config');
  fs.mkdirSync(path.dirname(src), { recursive: true }); fs.writeFileSync(src, 'fixture');
  fs.mkdirSync(path.join(home, '.config'), { recursive: true });
  const foreign = path.join(dir, 'foreign'); fs.mkdirSync(foreign);
  fs.symlinkSync(foreign, path.join(home, '.config/ghostty'));
  const c: Component = { id: 'config-ghostty', name: 'Ghostty', owner: 'setup/computer', adapter: 'stow', description: '', dependencies: [], packageDir: 'setup/computer', packageName: 'ghostty' };
  const ctx: Context = { root: repo, home, platform: 'darwin', run: () => { throw new Error('no commands expected'); } };
  assert.throws(() => cleanupReview(ctx, c), /Unsafe parent/, 'cleanupReview throws for unsafe parent — guideRemovals cleanup stage must catch and redirect to scope selection');
});
