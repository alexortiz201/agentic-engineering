import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/components/catalog.ts';
import { detectAll } from '../src/setup/detect.ts';
import { execute, run } from '../src/setup/execute.ts';
import { plan } from '../src/setup/plan.ts';
import { readSettings } from '../src/setup/files.ts';
import type { Context, Selection } from '../src/setup/types.ts';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function fixture(t: TestContext, id: string) {
  const home = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-repeatability-')));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const ctx: Context = { root, home, platform: 'darwin', run: (cmd, args, env) => {
    assert.equal(cmd, 'stow', 'No runtime/package commands permitted');
    return run(cmd, args, env);
  } };
  const c = { ...catalog(root).find(c => c.id === id)!, dependencies: [] };
  const components = [c];
  const settings = path.join(home, '.pi/agent/settings.json');
  function write(value: object) {
    fs.mkdirSync(path.dirname(settings), { recursive: true });
    fs.writeFileSync(settings, JSON.stringify(value), { mode: 0o600 });
  }
  function preview(action: Selection['action']) {
    return plan(components, detectAll(ctx, components), { [id]: { action, scope: 'configuration', confirmed: action === 'remove' } });
  }
  function apply(action: Selection['action']) {
    const p = preview(action); assert.deepEqual(p.conflicts, []);
    const result = execute(ctx, components, p, true);
    assert.equal(result[0].status, 'success', JSON.stringify(result));
  }
  const receipt = path.join(home, '.local/state/ae', id === 'pi-defaults' ? 'defaults.json' : 'theme.json');
  const backups = path.join(home, '.local/state/ae/backups');
  function snapshot() {
    const result: Record<string, string> = {};
    function walk(dir: string) {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name), s = fs.lstatSync(p);
        if (s.isSymbolicLink()) result[path.relative(home, p)] = `link:${fs.readlinkSync(p)}`;
        else if (s.isDirectory()) walk(p);
        else result[path.relative(home, p)] = fs.readFileSync(p, 'base64');
      }
    }
    walk(home); return result;
  }
  return { ctx, c, components, write, preview, apply, settings, receipt, backups, snapshot };
}

test('explicit defaults reapply after selected-key drift remains removable with correct before-state', t => {
  const f = fixture(t, 'pi-defaults');
  const initial = { defaultModel: 'original', deviceId: 'private', theme: 'custom' };
  f.write(initial); f.apply('install');
  const applied = readSettings(f.ctx), originalReceipt = fs.readFileSync(f.receipt);
  const drift = { defaultModel: 'experiment', compaction: { enabled: false, personal: true } };
  f.write({ ...applied, ...drift });
  f.apply('install');
  assert.deepEqual(readSettings(f.ctx), applied);
  const receiptBackup = fs.readdirSync(f.backups).find(name => name.startsWith('defaults-'))!;
  assert.deepEqual(fs.readFileSync(path.join(f.backups, receiptBackup)), originalReceipt);
  assert.equal(fs.statSync(path.join(f.backups, receiptBackup)).mode & 0o777, 0o600);
  f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { ...initial, ...drift });
});

test('theme install/remove/manual change/reinstall restores the newly selected prior theme', t => {
  const f = fixture(t, 'pi-theme');
  f.write({ theme: 'original', deviceId: 'private' });
  f.apply('install');
  const originalReceipt = fs.readFileSync(f.receipt);
  f.apply('remove');
  f.write({ theme: 'new-choice', deviceId: 'private' });
  f.apply('install');
  assert.equal(readSettings(f.ctx).theme, 'purple-dreams');
  const receiptBackup = fs.readdirSync(f.backups).find(name => name.startsWith('theme-'))!;
  assert.deepEqual(fs.readFileSync(path.join(f.backups, receiptBackup)), originalReceipt);
  assert.equal(fs.statSync(path.join(f.backups, receiptBackup)).mode & 0o777, 0o600);
  f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { theme: 'new-choice', deviceId: 'private' });
});

for (const id of ['pi-defaults', 'pi-theme']) {
  test(`${id}: current rerun is a no-op with no receipt/settings/backup changes`, t => {
    const f = fixture(t, id); f.write({ theme: 'custom' }); f.apply('install');
    const before = f.snapshot(), p = f.preview('install');
    assert.equal(p.operations[0].kind, 'noop');
    assert.equal(execute(f.ctx, f.components, p, true)[0].status, 'skipped');
    assert.deepEqual(f.snapshot(), before);
  });

  for (const changed of ['settings', 'receipt'] as const) {
    test(`${id}: stale ${changed} refuses explicit reapply before mutations`, t => {
      const f = fixture(t, id); f.write({ theme: 'custom' }); f.apply('install');
      f.write({ ...readSettings(f.ctx), ...(id === 'pi-defaults' ? { defaultModel: 'drift' } : { theme: 'drift' }) });
      const p = f.preview('install');
      if (changed === 'settings') f.write({ ...readSettings(f.ctx), deviceId: 'later-private-change' });
      else fs.appendFileSync(f.receipt, '\n');
      const before = f.snapshot();
      assert.throws(() => execute(f.ctx, f.components, p, true), /changed after preview/);
      assert.deepEqual(f.snapshot(), before);
    });
  }

  for (const invalid of ['malformed', 'symlink', 'public-mode'] as const) {
    test(`${id}: ${invalid} receipt refuses reapply and removal without changes`, t => {
      const f = fixture(t, id); f.write({ theme: 'custom' }); f.apply('install');
      if (invalid === 'malformed') fs.writeFileSync(f.receipt, '{"unexpected":true}');
      else if (invalid === 'public-mode') fs.chmodSync(f.receipt, 0o644);
      else {
        const foreign = `${f.receipt}.foreign`;
        fs.renameSync(f.receipt, foreign); fs.symlinkSync(foreign, f.receipt);
      }
      const beforeRemove = f.snapshot();
      assert.throws(() => execute(f.ctx, f.components, f.preview('remove'), true), /receipt/i);
      assert.deepEqual(f.snapshot(), beforeRemove);
      f.write({ ...readSettings(f.ctx), ...(id === 'pi-defaults' ? { defaultModel: 'drift' } : { theme: 'drift' }) });
      const beforeInstall = f.snapshot();
      assert.throws(() => execute(f.ctx, f.components, f.preview('install'), true), /receipt/i);
      assert.deepEqual(f.snapshot(), beforeInstall);
    });
  }
}

test('defaults current-value drift still refuses removal; explicit reapply requires approval', t => {
  const f = fixture(t, 'pi-defaults'); f.write({ theme: 'custom' }); f.apply('install');
  f.write({ ...readSettings(f.ctx), defaultModel: 'personal' });
  const before = f.snapshot();
  assert.throws(() => execute(f.ctx, f.components, f.preview('remove'), true), /changed since apply/);
  assert.throws(() => execute(f.ctx, f.components, f.preview('install'), false), /explicit approval/);
  assert.deepEqual(f.snapshot(), before);
});

test('defaults unmanaged receipt keys are never adopted on reapply', t => {
  const f = fixture(t, 'pi-defaults'); f.write({}); f.apply('install');
  const receipt = JSON.parse(fs.readFileSync(f.receipt, 'utf8'));
  receipt.before.deviceId = { present: true, value: 'private' }; receipt.applied.deviceId = 'managed?';
  fs.writeFileSync(f.receipt, JSON.stringify(receipt));
  f.write({ ...readSettings(f.ctx), defaultModel: 'personal' });
  const before = f.snapshot();
  assert.throws(() => execute(f.ctx, f.components, f.preview('install'), true), /unmanaged keys/);
  assert.deepEqual(f.snapshot(), before);
});

test('repeated defaults drift/reapply cycles preserve absence and the latest personal values', t => {
  const f = fixture(t, 'pi-defaults'); f.write({ deviceId: 'private' }); f.apply('install');
  for (const value of ['first', 'second']) {
    f.write({ ...readSettings(f.ctx), defaultModel: value });
    f.apply('install');
  }
  f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { deviceId: 'private', defaultModel: 'second' });
  assert.equal(fs.readdirSync(f.backups).filter(name => name.startsWith('defaults-')).length, 2);
});

test('after reapply, later managed drift refuses removal and later unrelated edits survive it', t => {
  const f = fixture(t, 'pi-defaults'); f.write({ deviceId: 'initial' }); f.apply('install');
  f.write({ ...readSettings(f.ctx), defaultModel: 'rebased' }); f.apply('install');
  const applied = readSettings(f.ctx);
  f.write({ ...applied, defaultModel: 'later-independent-edit', deviceId: 'later-private' });
  const before = f.snapshot();
  assert.throws(() => execute(f.ctx, f.components, f.preview('remove'), true), /changed since apply/);
  assert.deepEqual(f.snapshot(), before);
  // Restoring the applied managed key permits removal without erasing unrelated later edits.
  f.write({ ...applied, deviceId: 'later-private', personal: { added: true } });
  f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { defaultModel: 'rebased', deviceId: 'later-private', personal: { added: true } });
});

test('theme reinstall records a newly absent preference and removal leaves it absent', t => {
  const f = fixture(t, 'pi-theme'); f.write({ theme: 'original', deviceId: 'private' });
  f.apply('install'); f.apply('remove');
  f.write({ deviceId: 'private' });
  f.apply('install'); f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { deviceId: 'private' });
});

test('theme explicit reconfigure while installed rebases preference; later independent theme survives removal', t => {
  const f = fixture(t, 'pi-theme'); f.write({ theme: 'original' }); f.apply('install');
  f.write({ theme: 'personal-drift' }); f.apply('install');
  f.apply('remove'); assert.equal(readSettings(f.ctx).theme, 'personal-drift');
  f.apply('install');
  f.write({ theme: 'later-independent', deviceId: 'later-private' });
  f.apply('remove');
  assert.deepEqual(readSettings(f.ctx), { theme: 'later-independent', deviceId: 'later-private' });
});

test('theme unreceipted active selection and foreign resource remain protected', t => {
  const f = fixture(t, 'pi-theme'); f.write({ theme: 'custom' }); f.apply('install');
  fs.unlinkSync(f.receipt);
  const before = f.snapshot();
  assert.throws(() => execute(f.ctx, f.components, f.preview('remove'), true), /receipt/i);
  assert.deepEqual(f.snapshot(), before);
  const leaf = path.join(f.ctx.home, '.pi/agent/themes/purple-dreams.json');
  fs.unlinkSync(leaf); fs.writeFileSync(leaf, 'personal');
  const foreign = f.snapshot();
  assert.throws(() => execute(f.ctx, f.components, f.preview('install'), true), /conflicts/);
  assert.throws(() => execute(f.ctx, f.components, f.preview('remove'), true), /conflicts/);
  assert.deepEqual(f.snapshot(), foreign);
});
