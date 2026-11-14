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

test('staged Pi resources are byte-identical to accepted live source', () => {
  const mapping: Record<string, string> = {
    'pi-instructions': 'AGENTS.md', 'pi-theme': 'themes/purple-dreams.json',
    'workbench-skill': 'skills/workbench/SKILL.md', 'study-skill': 'skills/agentic-engineering/SKILL.md',
    composer: 'extensions/composer-highlight.ts',
  };
  for (const [id, leaf] of Object.entries(mapping)) {
    assert.deepEqual(fs.readFileSync(path.join(root, 'harness/pi/packages', id, '.pi/agent', leaf)), fs.readFileSync(path.join(root, 'pi/.pi/agent', leaf)));
  }
  assert.deepEqual(fs.readFileSync(path.join(root, 'harness/pi/settings.example.json')), fs.readFileSync(path.join(root, 'pi/settings.example.json')));
});

test('temporary Pi staging generation is deterministic and never needs an active installation', t => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-stage-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.cpSync(path.join(root, 'pi'), path.join(dir, 'pi'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'setup')); fs.copyFileSync(path.join(root, 'setup/stage-pi.mjs'), path.join(dir, 'setup/stage-pi.mjs'));
  const snapshot = () => {
    const files: Record<string, string> = {};
    function walk(base: string) { for (const name of fs.readdirSync(base)) { const p = path.join(base, name); if (fs.statSync(p).isDirectory()) walk(p); else files[path.relative(dir, p)] = fs.readFileSync(p, 'base64'); } }
    walk(path.join(dir, 'harness')); return files;
  };
  for (let i = 0; i < 2; i++) assert.equal(spawnSync(process.execPath, [path.join(dir, 'setup/stage-pi.mjs')]).status, 0);
  const before = snapshot();
  assert.equal(spawnSync(process.execPath, [path.join(dir, 'setup/stage-pi.mjs')]).status, 0);
  assert.deepEqual(snapshot(), before);
});

test('shell source parses; portable configuration has no old-repository runtime dependencies', () => {
  for (const file of ['setup/computer/zsh/.zshrc', 'setup/computer/zsh/.oh-my-zsh/custom/env.sh']) {
    const check = spawnSync('zsh', ['-n', path.join(root, file)], { encoding: 'utf8' });
    assert.equal(check.status, 0, check.stderr);
    assert.doesNotMatch(fs.readFileSync(path.join(root, file), 'utf8'), /Projects\/dotfiles|Mac-mini\.local|Alex-O-Air-M2/);
  }
  const ssh = fs.readFileSync(path.join(root, 'setup/computer/ssh/.ssh/config'), 'utf8');
  assert.doesNotMatch(ssh, /HostName|192\.168|tailbe/);
  const git = fs.readFileSync(path.join(root, 'setup/computer/git/.gitconfig'), 'utf8');
  assert.match(git, /gitconfig\.local/); assert.doesNotMatch(git, /alexanderortiz/);
});
