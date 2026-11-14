import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/components/catalog.ts';
import { defaults, profiles } from '../src/profiles/index.ts';
import { detect, detectAll } from '../src/setup/detect.ts';
import { execute, cleanupReview, previousProfile, run, saveProfile } from '../src/setup/execute.ts';
import { plan } from '../src/setup/plan.ts';
import { leaves, readSettings, safePath } from '../src/setup/files.ts';
import type { Component, Context, Selection, State } from '../src/setup/types.ts';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function fixture(t: any) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-setup-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, 'repo'); const home = path.join(dir, 'home');
  fs.mkdirSync(home); fs.mkdirSync(root);
  fs.cpSync(path.join(repository, 'setup/computer'), path.join(root, 'setup/computer'), { recursive: true, verbatimSymlinks: true });
  fs.cpSync(path.join(repository, 'harness/pi'), path.join(root, 'harness/pi'), { recursive: true });
  fs.cpSync(path.join(repository, 'setup/resources'), path.join(root, 'setup/resources'), { recursive: true, verbatimSymlinks: true });
  fs.mkdirSync(path.join(root, 'workbench/foundations'), { recursive: true });
  let brew: any = { formulae: [], casks: [] };
  const calls: string[][] = []; let failure = '';
  function write(relative: string, text: string) { const p = path.join(home, relative); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text, { mode: 0o600 }); return p; }
  const ctx: Context = { root, home, platform: 'darwin', applications: path.join(dir, 'Applications'), run: (cmd, args, env) => {
    calls.push([cmd, ...args]);
    if (failure && [cmd, ...args].join(' ').includes(failure)) return { code: 1, stdout: '', stderr: 'fixture failure' };
    if (cmd === 'which') {
      // Only handle 'pi' resolution; all other CLI tools (e.g. claude) are absent in fixture homes.
      const piExists = fs.existsSync(path.join(home, '.pi/agent/bin/pi'));
      if (args[0] === 'pi') return { code: piExists ? 0 : 1, stdout: piExists ? path.join(home, '.local/bin/pi') + '\n' : '', stderr: '' };
      return { code: 1, stdout: '', stderr: '' };
    }
    if (cmd === 'brew') {
      if (args[0] === 'info') return { code: 0, stdout: JSON.stringify(brew), stderr: '' };
      const name = args.at(-1)!; const cask = args.includes('--cask');
      const list = cask ? brew.casks : brew.formulae;
      if (args[0] === 'install') list.push(cask ? { token: name, installed: '1.0' } : { name, installed: [{ version: '1.0' }] });
      else if (args[0] === 'uninstall') { const key = cask ? 'casks' : 'formulae'; brew[key] = list.filter((v: any) => (v.token ?? v.name) !== name); }
      return { code: 0, stdout: '', stderr: '' };
    }
    if (cmd.endsWith('/.pi/agent/bin/pi')) {
      const v = JSON.parse(fs.readFileSync(path.join(home, '.pi/agent/settings.json'), 'utf8'));
      if (args[0] === 'install') {
        write('.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json', JSON.stringify({ name: '@arhen/pi-core-todo', version: '1.1.0' }));
      } else {
        v.packages = v.packages.filter((p: string) => p !== args[1]); write('.pi/agent/settings.json', JSON.stringify(v));
        fs.rmSync(path.join(home, '.pi/agent/npm/node_modules/@arhen/pi-core-todo'), { recursive: true, force: true });
      }
      return { code: 0, stdout: '', stderr: '' };
    }
    if (cmd === 'stow') return run(cmd, args, env);
    throw new Error(`Unexpected fixture command ${cmd}`);
  } };
  const components = catalog(root);
  const component = (id: string) => components.find(c => c.id === id)!;
  function managedPi() {
    write('.pi/agent/bin/pi', '# fixture only, never executed\n');
    fs.chmodSync(path.join(home, '.pi/agent/bin/pi'), 0o755);
    write('.pi/agent/install/managed-install.json', JSON.stringify({ kind: 'pi-managed-install', schemaVersion: 1, layout: 'releases-v1', entrypoint: { type: 'symlink', path: path.join(home, '.local/bin/pi') } }));
    write('.pi/agent/install/releases/1.5.2/node_modules/@earendil-works/pi-coding-agent/package.json', JSON.stringify({ name: '@earendil-works/pi-coding-agent', version: '1.5.2' }));
    write('.pi/agent/install/current-version', '1.5.2\n');
    fs.mkdirSync(path.join(home, '.local/bin'), { recursive: true }); fs.symlinkSync(path.join(home, '.pi/agent/bin/pi'), path.join(home, '.local/bin/pi'));
  }
  function apply(selections: Record<string, Selection>, subset = components) {
    delete ctx.brew; delete ctx.brewError;
    const states = detectAll(ctx, subset); const planned = plan(subset, states, selections);
    assert.deepEqual(planned.conflicts, []);
    return execute(ctx, subset, planned, true);
  }
  return { ctx, components, component, calls, write, managedPi, apply, setBrew: (v: any) => { brew = v; delete ctx.brew; delete ctx.brewError; }, fail: (v: string) => { failure = v; } };
}
const selection = (action: Selection['action'], scope?: Selection['scope']): Selection => ({ action, scope, confirmed: action === 'remove' });

test('planner is deterministic, has no effects and does not mutate frozen observed or desired state', t => {
  const f = fixture(t); const states = detectAll(f.ctx, f.components);
  const requested: Record<string, Selection> = { 'config-git': selection('install') };
  function freeze<T>(value: T): T {
    if (value && typeof value === 'object') { Object.freeze(value); for (const child of Object.values(value)) freeze(child); }
    return value;
  }
  freeze(states); freeze(requested); freeze(f.components);
  const before = JSON.stringify({ states, requested, components: f.components }); const calls = f.calls.length;
  const first = plan(f.components, states, requested); const second = plan(f.components, states, requested);
  assert.deepEqual(first, second); assert.deepEqual(first.conflicts, []);
  assert.equal(JSON.stringify({ states, requested, components: f.components }), before);
  assert.equal(f.calls.length, calls); assert.deepEqual(fs.readdirSync(f.ctx.home), []);
  assert.equal(requested['brew-stow'], undefined); // dependency expansion belongs to plan, not user intent
});

test('all skipped components produce no execution commands or target filesystem changes', t => {
  const f = fixture(t); const planned = plan(f.components, detectAll(f.ctx, f.components), {});
  const calls = f.calls.length; const before = fs.readdirSync(f.ctx.home);
  const results = execute(f.ctx, f.components, planned, true);
  assert.ok(results.every(result => result.status === 'skipped'));
  assert.equal(f.calls.length, calls); assert.deepEqual(fs.readdirSync(f.ctx.home), before);
});

test('profiles visibly preselect recommendations on fresh/existing machines; current selections are no-ops', t => {
  const f = fixture(t); const states = detectAll(f.ctx, f.components);
  assert.equal(states.pi.status, 'missing'); assert.equal(states.foundations.status, 'missing');
  assert.equal(states.foundations.available, true); assert.equal(states.foundations.installed, false);
  const workstation = defaults('mac-workstation', f.components, states);
  const laptop = defaults('mac-laptop', f.components, states);
  assert.equal(workstation['brew-herdr'].action, 'install'); assert.equal(laptop['brew-herdr'].action, 'keep');
  assert.equal(laptop['brew-ollama-app'].action, 'keep'); assert.equal(laptop['brew-tailscale-app'].action, 'keep');
  assert.ok(Object.values(defaults('custom', f.components, states)).every(v => v.action === 'keep'));
  workstation['pi-theme'] = selection('keep'); assert.equal(workstation['pi-theme'].action, 'keep');
  f.managedPi(); const installed = detectAll(f.ctx, f.components);
  for (const profile of profiles) {
    const selections = defaults(profile.id, f.components, installed);
    assert.ok(Object.values(selections).every(v => v.action !== 'remove'));
    for (const id of profile.recommendations) assert.equal(selections[id].action, 'install');
  }
  const rerun = plan(f.components, installed, defaults('mac-workstation', f.components, installed));
  assert.equal(rerun.operations.find(o => o.component === 'pi')?.kind, 'noop');
  saveProfile(f.ctx, 'mac-laptop'); assert.equal(previousProfile(f.ctx), 'mac-laptop');
  saveProfile(f.ctx, 'custom'); assert.equal(previousProfile(f.ctx), 'custom');
});

test('real Stow: computer provisioning from consolidated sources, repeat and config-only removal', t => {
  const f = fixture(t);
  const results = f.apply({ 'config-git': selection('install') });
  assert.equal(results.find(v => v.component === 'config-git')?.status, 'success');
  assert.equal(fs.realpathSync(path.join(f.ctx.home, '.gitconfig')), path.join(f.ctx.root, 'setup/computer/git/.gitconfig'));
  const calls = f.calls.length;
  const repeat = f.apply({ 'config-git': selection('install') });
  assert.equal(repeat.find(v => v.component === 'config-git')?.status, 'skipped');
  assert.ok(!f.calls.slice(calls).some(v => v[0] === 'stow'));
  const removed = f.apply({ 'config-git': selection('remove', 'configuration') });
  assert.equal(removed.find(v => v.component === 'config-git')?.status, 'success');
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.gitconfig')), false);
  assert.ok(fs.existsSync(path.join(f.ctx.root, 'setup/computer/git/.gitconfig')));
});

test('independent Pi leaves: theme + Todos never install Skill, composer or full Workbench', t => {
  const f = fixture(t); f.managedPi();
  f.write('.pi/agent/settings.json', JSON.stringify({ theme: 'dark', deviceId: 'private', packages: ['npm:unrelated@1.0.0'] }));
  f.write('.pi/agent/auth.json', 'secret-auth'); f.write('.pi/agent/sessions/existing.jsonl', 'session-data');
  const result = f.apply({ 'pi-theme': selection('install'), todos: selection('install') });
  assert.equal(result.filter(v => v.status === 'success').length, 3); // Stow prerequisite + two capabilities
  assert.equal(detect(f.ctx, f.component('pi-theme')).enabled, true);
  assert.equal(detect(f.ctx, f.component('todos')).status, 'current');
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi/agent/skills')), false);
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi/agent/extensions')), false);
  assert.equal(readSettings(f.ctx).deviceId, 'private');
  assert.deepEqual(readSettings(f.ctx).packages, ['npm:unrelated@1.0.0', 'npm:@arhen/pi-core-todo@1.1.0']);
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.pi/agent/auth.json'), 'utf8'), 'secret-auth');
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.pi/agent/sessions/existing.jsonl'), 'utf8'), 'session-data');
  assert.equal(detect(f.ctx, f.component('pi-theme')).loaded, 'unknown');
  f.apply({ 'pi-theme': selection('remove', 'configuration'), todos: selection('remove', 'configuration') });
  assert.equal(readSettings(f.ctx).theme, 'dark');
  assert.ok(fs.existsSync(path.join(f.ctx.home, '.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json')));
  f.apply({ 'pi-theme': selection('install') }); assert.equal(readSettings(f.ctx).theme, 'purple-dreams');
});

test('optional resources each install independently; no directory folding', t => {
  const f = fixture(t); f.managedPi();
  for (const id of ['pi-instructions', 'workbench-skill', 'study-skill', 'composer']) {
    const result = f.apply({ [id]: selection('install') });
    assert.equal(result.find(v => v.component === id)?.status, 'success');
    assert.ok(leaves(f.ctx, f.component(id)).every(v => fs.lstatSync(v.target).isSymbolicLink()));
  }
  assert.equal(fs.lstatSync(path.join(f.ctx.home, '.pi/agent/skills')).isSymbolicLink(), false);
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi/agent/themes')), false);
});

test('accepted Todo cache pins declaration without reinstall; outdated cache updates exact pin', t => {
  const f = fixture(t); f.managedPi();
  f.write('.pi/agent/settings.json', JSON.stringify({ packages: ['npm:@arhen/pi-core-todo', 'npm:other@4.0.0'] }));
  f.write('.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json', '{"name":"@arhen/pi-core-todo","version":"1.1.0"}');
  f.apply({ todos: selection('install') });
  assert.ok(!f.calls.some(v => v[0].endsWith('/.pi/agent/bin/pi')));
  assert.deepEqual(readSettings(f.ctx).packages, ['npm:@arhen/pi-core-todo@1.1.0', 'npm:other@4.0.0']);
  f.write('.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json', '{"name":"@arhen/pi-core-todo","version":"1.0.7"}');
  assert.equal(detect(f.ctx, f.component('todos')).status, 'update');
  f.apply({ todos: selection('install') });
  assert.ok(f.calls.some(v => v[1] === 'install' && v[2] === 'npm:@arhen/pi-core-todo@1.1.0'));
  assert.equal(detect(f.ctx, f.component('todos')).status, 'current');
});

test('selected defaults preserve private fields/theme/discovery/packages and restore exact old values', t => {
  const f = fixture(t); f.managedPi();
  const before = { deviceId: 'identity', defaultModel: 'previous', theme: 'custom', packages: ['npm:other@1'], skills: ['/local/skill'], custom: true };
  f.write('.pi/agent/settings.json', JSON.stringify(before));
  f.apply({ 'pi-defaults': selection('install') });
  const applied = readSettings(f.ctx);
  assert.equal(applied.deviceId, 'identity'); assert.equal(applied.theme, 'custom'); assert.deepEqual(applied.skills, ['/local/skill']);
  assert.equal(applied.compaction.enabled, true);
  assert.equal(fs.statSync(path.join(f.ctx.home, '.pi/agent/settings.json')).mode & 0o777, 0o600);
  const backup = fs.readdirSync(path.join(f.ctx.home, '.local/state/ae/backups'))[0];
  assert.equal(fs.statSync(path.join(f.ctx.home, '.local/state/ae/backups', backup)).mode & 0o777, 0o600);
  f.apply({ 'pi-defaults': selection('remove', 'configuration') });
  assert.deepEqual(readSettings(f.ctx), before);
});

test('defaults removal refuses settings changed after apply; no receipt adoption', t => {
  const f = fixture(t); f.managedPi(); f.apply({ 'pi-defaults': selection('install') });
  const current = readSettings(f.ctx); current.defaultModel = 'user-experiment'; f.write('.pi/agent/settings.json', JSON.stringify(current));
  const planned = plan(f.components, detectAll(f.ctx, f.components), { 'pi-defaults': selection('remove', 'configuration') });
  assert.throws(() => execute(f.ctx, f.components, planned, true), /changed since apply/);
  assert.equal(readSettings(f.ctx).defaultModel, 'user-experiment');
});

test('foreign, dangling and parent directory links refuse adoption or traversal', t => {
  const f = fixture(t); f.write('.gitconfig', 'personal');
  assert.equal(detect(f.ctx, f.component('config-git')).status, 'conflict');
  const p = plan(f.components, detectAll(f.ctx, f.components), { 'config-git': selection('install') });
  assert.ok(p.conflicts.length); assert.throws(() => execute(f.ctx, f.components, p, true), /conflicts/);
  fs.unlinkSync(path.join(f.ctx.home, '.gitconfig')); fs.symlinkSync('/nonexistent/private', path.join(f.ctx.home, '.gitconfig'));
  assert.equal(detect(f.ctx, f.component('config-git')).status, 'conflict');
  const outside = path.join(path.dirname(f.ctx.home), 'outside'); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(f.ctx.home, '.pi'));
  assert.equal(detect(f.ctx, f.component('composer')).status, 'conflict');
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('shared dependencies cannot be removed while an installed dependent remains', t => {
  const f = fixture(t); f.apply({ 'config-git': selection('install') });
  const p = plan(f.components, detectAll(f.ctx, f.components), { 'brew-stow': selection('remove', 'application') });
  assert.ok(p.conflicts.some(v => v.includes('config-git remains')));
});

test('dependency removal runs after dependent removal', t => {
  const f = fixture(t); f.apply({ 'config-git': selection('install') });
  const p = plan(f.components, detectAll(f.ctx, f.components), { 'config-git': selection('remove', 'configuration'), 'brew-stow': selection('remove', 'application') });
  assert.deepEqual(p.conflicts, []);
  assert.ok(p.operations.findIndex(v => v.component === 'config-git') < p.operations.findIndex(v => v.component === 'brew-stow'));
});

test('guided cleanup requires confirmation, actual owned paths, preserves ambiguous files', t => {
  const f = fixture(t); f.apply({ 'config-git': selection('install') });
  f.write('.gitconfig.local', 'personal identity');
  const c = f.component('config-git'); const states = detectAll(f.ctx, f.components);
  assert.ok(plan(f.components, states, { [c.id]: { action: 'remove', scope: 'review' } }).conflicts.length);
  const review = cleanupReview(f.ctx, c); assert.ok(review.every(v => v.removable));
  const malicious = plan(f.components, states, { [c.id]: { action: 'remove', scope: 'review', confirmed: true, cleanup: [path.join(f.ctx.home, '.gitconfig.local')] } });
  assert.throws(() => execute(f.ctx, f.components, malicious, true), /not verifiably owned/);
  const selected = { [c.id]: { action: 'remove' as const, scope: 'review' as const, confirmed: true, cleanup: review.map(v => v.path) } };
  f.apply(selected);
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.gitconfig.local'), 'utf8'), 'personal identity');
});

test('actual leftover review never claims recursive personal/cache purge support', t => {
  const f = fixture(t); f.write('Library/Caches/com.mitchellh.ghostty/cache', 'unknown');
  const review = cleanupReview(f.ctx, f.component('config-ghostty'));
  assert.ok(review.some(v => !v.removable && v.path.endsWith('com.mitchellh.ghostty')));
});

test('Homebrew fresh application install, config-only no-op and supported application removal', t => {
  const f = fixture(t);
  f.apply({ 'brew-ripgrep': selection('install') });
  assert.equal(detect(f.ctx, f.component('brew-ripgrep')).status, 'current');
  const results = f.apply({ 'brew-ripgrep': selection('remove', 'configuration') });
  assert.equal(results.find(v => v.component === 'brew-ripgrep')?.status, 'skipped');
  assert.equal(detect(f.ctx, f.component('brew-ripgrep')).installed, true);
  f.apply({ 'brew-ripgrep': selection('remove', 'application') });
  assert.equal(detect(f.ctx, f.component('brew-ripgrep')).installed, false);
});

test('Todo application removal preserves auth/session/personal notes and unrelated package', t => {
  const f = fixture(t); f.managedPi(); f.apply({ todos: selection('install') });
  f.write('.pi/agent/auth.json', 'private'); f.write('.pi/docs/AGENTIC_ENGINEERING/notes.md', 'notes');
  const v = readSettings(f.ctx); v.packages.push('npm:unrelated@2'); f.write('.pi/agent/settings.json', JSON.stringify(v));
  f.apply({ todos: selection('remove', 'application') });
  assert.equal(detect(f.ctx, f.component('todos')).installed, false);
  assert.deepEqual(readSettings(f.ctx).packages, ['npm:unrelated@2']);
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.pi/agent/auth.json'), 'utf8'), 'private');
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.pi/docs/AGENTIC_ENGINEERING/notes.md'), 'utf8'), 'notes');
});

test('state/source race and missing approval stop before any writes', t => {
  const f = fixture(t); const p = plan(f.components, detectAll(f.ctx, f.components), { 'config-git': selection('install') });
  assert.throws(() => execute(f.ctx, f.components, p, false), /approval/);
  fs.appendFileSync(path.join(f.ctx.root, 'setup/computer/git/.gitconfig'), '\n# changed after preview\n');
  assert.throws(() => execute(f.ctx, f.components, p, true), /changed after preview/);
  assert.deepEqual(fs.readdirSync(f.ctx.home), []);
});

test('partial command failure is reported and later operations stop, not simulated success', t => {
  const f = fixture(t); f.managedPi(); f.fail('install npm:@arhen/pi-core-todo');
  const results = f.apply({ todos: selection('install'), 'brew-ripgrep': selection('install') });
  assert.equal(results.find(v => v.component === 'todos')?.status, 'partial'); // declaration pinned before failing package command
  assert.equal(results.find(v => v.component === 'brew-ripgrep')?.status, 'skipped');
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi/agent/extensions/composer-highlight.ts')), false);
});

test('partial removal failure never claims application uninstalled', t => {
  const f = fixture(t); f.apply({ 'config-git': selection('install') });
  f.fail('--delete git');
  const result = f.apply({ 'config-git': selection('remove', 'configuration') });
  assert.equal(result.find(v => v.component === 'config-git')?.status, 'failed');
  assert.ok(fs.existsSync(path.join(f.ctx.home, '.gitconfig')));
});

test('new runtime, reporter and unpinned upgrades have explicit unsupported boundaries', t => {
  const f = fixture(t);
  const p = plan(f.components, detectAll(f.ctx, f.components), { composer: selection('install') });
  assert.ok(p.conflicts.some(v => v.includes('exact-version official installer')));
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi')), false);
  const states = detectAll(f.ctx, f.components); states['brew-git'] = { ...states['brew-git'], status: 'update' };
  assert.ok(plan(f.components, states, { 'brew-git': selection('install') }).conflicts.some(v => v.includes('No accepted version pin')));
});

test('malformed private settings are refused without echoing parse contents into reports', t => {
  const f = fixture(t); f.write('.pi/agent/settings.json', 'private-secret-parse-sentinel');
  const state = detect(f.ctx, f.component('pi-defaults'));
  assert.equal(state.status, 'conflict'); assert.doesNotMatch(JSON.stringify(state), /private-secret-parse-sentinel/);
});

test('safe paths reject escape and private state symlink interception', t => {
  const f = fixture(t); assert.throws(() => safePath(f.ctx.home, '../outside'), /escapes/);
  fs.mkdirSync(path.join(f.ctx.home, '.local/state'), { recursive: true });
  fs.symlinkSync(path.dirname(f.ctx.home), path.join(f.ctx.home, '.local/state/ae'));
  assert.throws(() => saveProfile(f.ctx, 'custom'), /unsafe|Unsafe/);
});

test('source-only Pi handoff refuses old links, supports approved fixture detachment and exact rollback', t => {
  const f = fixture(t); f.managedPi();
  const c = f.component('composer'); const leaf = leaves(f.ctx, c)[0];
  const old = path.join(f.ctx.root, 'pi/.pi/agent/extensions/composer-highlight.ts');
  fs.mkdirSync(path.dirname(old), { recursive: true }); fs.copyFileSync(leaf.source, old);
  fs.mkdirSync(path.dirname(leaf.target), { recursive: true }); fs.symlinkSync(old, leaf.target);
  const original = fs.readlinkSync(leaf.target); const originalContent = fs.readFileSync(leaf.target);
  assert.equal(detect(f.ctx, c).status, 'migration');
  const blocked = plan(f.components, detectAll(f.ctx, f.components), { composer: selection('install') });
  assert.ok(blocked.conflicts.some(v => v.includes('Migration required')));
  assert.throws(() => execute(f.ctx, f.components, blocked, true), /conflicts/);
  // Explicit per-leaf authorization exists only inside this disposable fixture.
  assert.equal(fs.readlinkSync(leaf.target), original); fs.unlinkSync(leaf.target);
  f.apply({ composer: selection('install') }); assert.deepEqual(fs.readFileSync(leaf.target), originalContent);
  f.apply({ composer: selection('remove', 'configuration') });
  assert.equal(fs.existsSync(leaf.target), false); fs.symlinkSync(original, leaf.target);
  assert.equal(fs.readlinkSync(leaf.target), original); assert.deepEqual(fs.readFileSync(old), originalContent);
});

test('similar package names are not owned Todos; forged runtime/package metadata is refused', t => {
  const f = fixture(t); f.managedPi();
  f.write('.pi/agent/settings.json', JSON.stringify({ packages: ['npm:@arhen/pi-core-todo-extra@9'] }));
  f.apply({ todos: selection('install') });
  assert.deepEqual(readSettings(f.ctx).packages, ['npm:@arhen/pi-core-todo-extra@9', 'npm:@arhen/pi-core-todo@1.1.0']);
  f.apply({ todos: selection('remove', 'configuration') });
  assert.deepEqual(readSettings(f.ctx).packages, ['npm:@arhen/pi-core-todo-extra@9']);
  f.write('.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json', '{"name":"unrelated","version":"1.1.0"}');
  assert.equal(detect(f.ctx, f.component('todos')).status, 'conflict');
  f.write('.pi/agent/install/releases/1.5.2/node_modules/@earendil-works/pi-coding-agent/package.json', '{"name":"unrelated","version":"1.5.2"}');
  assert.equal(detect(f.ctx, f.component('pi')).status, 'conflict');
});

test('Foundations remains available but uninstalled until selected; reference never enables Pi discovery', t => {
  const f = fixture(t);
  f.write('.pi/agent/auth.json', 'keep');
  assert.equal(detect(f.ctx, f.component('foundations')).installed, false);
  f.apply({ foundations: selection('install') });
  const state = detect(f.ctx, f.component('foundations'));
  assert.equal(state.installed, true); assert.equal(state.enabled, false); assert.equal(state.loaded, 'unknown');
  assert.equal(fs.realpathSync(path.join(f.ctx.home, '.local/share/ae/foundations')), path.join(f.ctx.root, 'workbench/foundations'));
  assert.equal(fs.existsSync(path.join(f.ctx.home, '.pi/agent/skills')), false);
  f.apply({ foundations: selection('remove', 'configuration') });
  assert.ok(fs.existsSync(path.join(f.ctx.root, 'workbench/foundations')));
  assert.equal(fs.readFileSync(path.join(f.ctx.home, '.pi/agent/auth.json'), 'utf8'), 'keep');
});

test('application and configuration removal plans paired owned config before package uninstall', t => {
  const f = fixture(t); f.apply({ 'config-git': selection('install'), 'brew-git': selection('install') });
  const p = plan(f.components, detectAll(f.ctx, f.components), { 'brew-git': selection('remove', 'application') });
  assert.deepEqual(p.conflicts, []);
  assert.ok(p.operations.findIndex(o => o.component === 'config-git') < p.operations.findIndex(o => o.component === 'brew-git'));
  const result = execute(f.ctx, f.components, p, true);
  assert.equal(result.find(v => v.component === 'config-git')?.status, 'success');
  assert.equal(result.find(v => v.component === 'brew-git')?.status, 'success');
});

test('claude-code: detected as missing when CLI absent, current with version when found; never reads credentials or settings', t => {
  const f = fixture(t);
  // Fixture runner returns code 1 for 'which claude' — absent by default
  const c = f.component('claude-code');
  const absent = detect(f.ctx, c);
  assert.equal(absent.status, 'missing'); assert.equal(absent.installed, false);
  // Any install/remove selection produces conflict (manual adapter; no provisioning implemented)
  for (const action of ['install', 'remove'] as const) {
    const p = plan(f.components, { 'claude-code': absent }, { 'claude-code': action === 'remove' ? selection('remove', 'configuration') : selection('install') });
    assert.ok(p.conflicts.some(msg => /brew-claude-code|no authentication|No.*authentication|installation|detect/i.test(msg) || p.operations.find(o => o.component === 'claude-code')?.kind === 'conflict'));
  }
  // Simulate CLI found with known version via a controlled context
  let calls: string[][] = [];
  const ctxPresent: typeof f.ctx = { ...f.ctx, run: (cmd, args) => {
    calls.push([cmd, ...args]);
    if (cmd === 'which' && args[0] === 'claude') return { code: 0, stdout: '/opt/homebrew/bin/claude\n', stderr: '' };
    if (cmd === '/opt/homebrew/bin/claude' && args[0] === '--version') return { code: 0, stdout: '1.2.3\n', stderr: '' };
    return f.ctx.run(cmd, args);
  }};
  const present = detect(ctxPresent, c);
  assert.equal(present.status, 'current'); assert.equal(present.installed, true);
  assert.equal(present.installedVersion, '1.2.3');
  assert.ok(present.evidence.some(e => /not read|not modified|independent/i.test(e)));
  assert.ok(!present.evidence.some(e => /auth|session|credential/i.test(e) && !/independent|not read/i.test(e)));
  assert.equal(calls.filter(c => !['which', '/opt/homebrew/bin/claude'].includes(c[0])).length, 0, 'only which + --version called');
  // Simulate CLI found but --version fails
  const ctxUnknown: typeof f.ctx = { ...f.ctx, run: (cmd, args) => {
    if (cmd === 'which' && args[0] === 'claude') return { code: 0, stdout: '/usr/local/bin/claude\n', stderr: '' };
    if (cmd === '/usr/local/bin/claude') return { code: 1, stdout: '', stderr: 'exit' };
    return f.ctx.run(cmd, args);
  }};
  const unknown = detect(ctxUnknown, c);
  assert.equal(unknown.status, 'unknown'); assert.equal(unknown.installed, true);
  assert.equal(unknown.installedVersion, undefined);
});

test('Mini and Air fixture paths resolve locally without DevDrive or old dotfiles checkout', t => {
  const f = fixture(t);
  for (const machine of ['mini', 'air']) {
    const home = path.join(path.dirname(f.ctx.home), machine); fs.mkdirSync(home);
    const ctx = { ...f.ctx, home };
    const c = { ...f.component('config-ghostty'), dependencies: [] };
    const planned = plan([c], detectAll(ctx, [c]), { [c.id]: selection('install') });
    assert.equal(execute(ctx, [c], planned, true)[0].status, 'success');
    for (const leaf of leaves(ctx, c)) assert.ok(fs.realpathSync(leaf.target).startsWith(f.ctx.root));
    const palette = path.join(home, '.config/ghostty/themes/purpledreams');
    assert.ok(fs.readFileSync(palette, 'utf8').length > 0); // offline resource resolution, not live app acceptance
  }
});
