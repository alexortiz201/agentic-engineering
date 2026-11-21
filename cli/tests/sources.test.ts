import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/components/catalog.ts';
import { detectAll } from '../src/setup/detect.ts';
import { execute, run } from '../src/setup/execute.ts';
import { plan } from '../src/setup/plan.ts';
import { leaves } from '../src/setup/files.ts';
import type { Context } from '../src/setup/types.ts';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('every consolidated computer package installs/verifies/removes with actual GNU Stow', t => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-sources-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const original of catalog(root).filter(c => c.id.startsWith('config-'))) {
    const home = path.join(dir, original.id); fs.mkdirSync(home);
    const ctx: Context = { root, home, platform: 'darwin', run };
    const c = { ...original, dependencies: [] }; // Test resource contract, not stub upstream installers.
    const install = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'install' } });
    assert.deepEqual(install.conflicts, []);
    const result = execute(ctx, [c], install, true);
    assert.equal(result[0].status, 'success', `${c.id}: ${JSON.stringify(result)}`);
    for (const leaf of leaves(ctx, c)) assert.ok(fs.lstatSync(leaf.target).isSymbolicLink());
    if (c.id === 'config-zsh') {
      assert.ok(fs.statSync(path.join(home, '.local/bin/aircopy')).mode & 0o111);
      assert.ok(fs.statSync(path.join(home, '.oh-my-zsh/custom/plugins/colored-man-pages/nroff')).mode & 0o111);
    }
    const remove = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'remove', scope: 'configuration', confirmed: true } });
    assert.equal(execute(ctx, [c], remove, true)[0].status, 'success');
  }
});

test('shell provisioning refuses an existing unmanaged zshenv without changing local content', t => {
  const home = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-zshenv-conflict-')));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const local = path.join(home, '.zshenv');
  const original = '# Local shell prerequisites\nexport LOCAL_FIXTURE=preserve\n';
  fs.writeFileSync(local, original);
  const c = { ...catalog(root).find(c => c.id === 'config-zsh')!, dependencies: [] };
  const ctx: Context = { root, home, platform: 'darwin', run };
  const install = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'install' } });
  assert.ok(install.conflicts.length > 0);
  assert.throws(() => execute(ctx, [c], install, true), /Resolve all plan conflicts/);
  assert.equal(fs.readFileSync(local, 'utf8'), original);
  assert.equal(fs.lstatSync(local).isFile(), true);
  assert.deepEqual(fs.readdirSync(home), ['.zshenv']);
});

test('canonical Pi packages have exactly the supported regular discovery leaves', () => {
  const mapping: Record<string, string> = {
    'pi-instructions': 'AGENTS.md', 'pi-theme': 'themes/purple-dreams.json',
    'workbench-skill': 'skills/workbench/SKILL.md', 'study-skill': 'skills/agentic-engineering/SKILL.md',
    composer: 'extensions/composer-highlight.ts',
  };
  const packages = path.join(root, 'harness/pi/packages');
  assert.deepEqual(fs.readdirSync(packages).sort(), Object.keys(mapping).sort());
  for (const [id, leaf] of Object.entries(mapping)) {
    const base = path.join(packages, id);
    const inventory: string[] = [];
    function walk(dir: string) {
      for (const name of fs.readdirSync(dir)) {
        const file = path.join(dir, name), stat = fs.lstatSync(file);
        if (stat.isDirectory()) walk(file);
        else { assert.ok(stat.isFile(), `Non-regular source: ${file}`); inventory.push(path.relative(base, file)); }
      }
    }
    assert.ok(fs.lstatSync(base).isDirectory());
    walk(base);
    assert.deepEqual(inventory, [`.pi/agent/${leaf}`]);
    assert.ok(fs.readFileSync(path.join(base, inventory[0])).length > 0);
  }
  const accepted = JSON.parse(fs.readFileSync(path.join(root, 'harness/pi/accepted.json'), 'utf8'));
  assert.deepEqual(accepted, {
    runtime: '1.5.2', todo: 'npm:@arhen/pi-core-todo@1.1.0',
    baseline: 'e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354',
  });
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'harness/pi/settings.example.json'), 'utf8'));
  assert.deepEqual(seed.packages, [accepted.todo]);
});

test('canonical Pi sources install/repeat/remove without legacy root or generation', t => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-canonical-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const source = path.join(dir, 'source'), home = path.join(dir, 'home');
  fs.cpSync(path.join(root, 'harness/pi'), path.join(source, 'harness/pi'), { recursive: true });
  fs.mkdirSync(home);
  const components = catalog(root).filter(c => c.packageDir === 'harness/pi/packages');
  assert.equal(components.length, 5);
  assert.equal(fs.existsSync(path.join(source, 'pi')), false);
  assert.equal(fs.existsSync(path.join(root, 'setup/stage-pi.mjs')), false, 'Retired generator must not overwrite authored resources');
  assert.equal(fs.existsSync(path.join(source, 'setup/stage-pi.mjs')), false);
  const before = new Map<string, Buffer>();
  for (const original of components) {
    // Exercise discovery leaves only: no runtime, settings/theme preference or package effects.
    const c = { ...original, dependencies: [], configuration: undefined };
    const ctx: Context = { root: source, home, platform: 'darwin', run };
    for (const leaf of leaves(ctx, c)) before.set(leaf.source, fs.readFileSync(leaf.source));
    const install = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'install' } });
    assert.deepEqual(install.conflicts, []);
    const installed = execute(ctx, [c], install, true);
    assert.equal(installed[0].status, 'success', JSON.stringify(installed));
    for (const leaf of leaves(ctx, c)) assert.equal(fs.realpathSync(leaf.target), leaf.source);
    const repeat = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'install' } });
    assert.deepEqual(repeat.conflicts, []);
    assert.equal(repeat.operations[0].kind, 'noop');
    assert.equal(execute(ctx, [c], repeat, true)[0].status, 'skipped');
    const remove = plan([c], detectAll(ctx, [c]), { [c.id]: { action: 'remove', scope: 'configuration', confirmed: true } });
    assert.equal(execute(ctx, [c], remove, true)[0].status, 'success');
    for (const leaf of leaves(ctx, c)) assert.equal(fs.existsSync(leaf.target), false);
  }
  for (const [file, bytes] of before) assert.deepEqual(fs.readFileSync(file), bytes);
});

test('shell source parses; portable configuration has no old-repository runtime dependencies', () => {
  for (const file of ['setup/computer/zsh/.zshenv', 'setup/computer/zsh/.zshrc', 'setup/computer/zsh/.oh-my-zsh/custom/env.sh']) {
    const check = spawnSync('zsh', ['-n', path.join(root, file)], { encoding: 'utf8' });
    assert.equal(check.status, 0, check.stderr);
    assert.doesNotMatch(fs.readFileSync(path.join(root, file), 'utf8'), /Projects\/dotfiles|Mac-mini\.local|Alex-O-Air-M2/);
  }
  const ssh = fs.readFileSync(path.join(root, 'setup/computer/ssh/.ssh/config'), 'utf8');
  assert.doesNotMatch(ssh, /HostName|192\.168|tailbe/);
  const git = fs.readFileSync(path.join(root, 'setup/computer/git/.gitconfig'), 'utf8');
  assert.match(git, /gitconfig\.local/); assert.doesNotMatch(git, /alexanderortiz/);
});
