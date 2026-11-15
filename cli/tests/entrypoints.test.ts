import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function temp(t: any) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-entry-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true })); return dir;
}
function script(p: string, content: string) { fs.writeFileSync(p, `#!/bin/sh\n${content}\n`, { mode: 0o755 }); }

test('CLI runs without Pi/Herdr; headless dry-run is genuinely read-only and reports missing runtime', t => {
  const dir = temp(t); const bin = path.join(dir, 'bin'); const home = path.join(dir, 'home'); fs.mkdirSync(bin); fs.mkdirSync(home);
  script(path.join(bin, 'brew'), 'echo \'{"formulae":[],"casks":[]}\'');
  script(path.join(bin, 'which'), 'exit 1');
  const result = spawnSync(process.execPath, [path.join(root, 'cli/src/index.ts'), 'setup', '--dry-run', '--json', '--home', home, '--profile', 'custom', '--select', 'composer'],
    { encoding: 'utf8', env: { ...process.env, HOME: home, PATH: bin } });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.states.pi.status, 'missing');
  assert.ok(output.plan.conflicts.some((v: string) => v.includes('exact-version official installer')));
  assert.deepEqual(fs.readdirSync(home), []);
});

test('migration inventory records literal parent links and digests without disclosing file contents', t => {
  const dir = temp(t); const home = path.join(dir, 'home'); const outside = path.join(dir, 'outside');
  fs.mkdirSync(home); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(home, '.pi')); fs.writeFileSync(path.join(home, '.gitconfig'), 'private-content-never-print');
  const r = spawnSync(process.execPath, [path.join(root, 'setup/inspect-links.mjs'), '--home', home], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr); assert.doesNotMatch(r.stdout, /private-content-never-print/);
  const v = JSON.parse(r.stdout);
  assert.ok(v.records.some((x: any) => x.path === path.join(home, '.pi') && x.target === outside));
  assert.ok(v.records.some((x: any) => x.path === path.join(home, '.gitconfig') && x.sha256));
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('entrypoint refuses unknown flags, headless apply and nonexistent component IDs', t => {
  const dir = temp(t); const env = { ...process.env, HOME: dir };
  for (const args of [['setup', '--apply'], ['setup', '--json'], ['setup', '--dry-run', '--json', '--select', 'not-a-component']]) {
    const r = spawnSync(process.execPath, [path.join(root, 'cli/src/index.ts'), ...args], { encoding: 'utf8', env });
    assert.equal(r.status, 1); assert.match(r.stderr, /Setup stopped/);
  }
});

test('bootstrap existing runtime launches CLI help without application installs or HOME writes', t => {
  const home = temp(t);
  const result = spawnSync('/bin/sh', [path.join(root, 'setup/bootstrap/setup'), '--dry-run', '--json', '--home', home, '--profile', 'custom'],
    { encoding: 'utf8', env: { ...process.env, HOME: home } });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).profile, 'custom');
  assert.deepEqual(fs.readdirSync(home), []);
});

test('fresh Mac bootstrap cancellation stops before download or package installation', t => {
  const dir = temp(t); const bin = path.join(dir, 'bin'); fs.mkdirSync(bin);
  // No Node, npm, Pi, Herdr or Homebrew in this PATH. Only deterministic shell prerequisites.
  for (const command of ['dirname']) fs.symlinkSync(`/usr/bin/${command}`, path.join(bin, command));
  script(path.join(bin, 'uname'), 'if [ "$1" = -s ]; then echo Darwin; else echo arm64; fi');
  script(path.join(bin, 'curl'), `echo unexpected > '${path.join(dir, 'network-used')}'; exit 1`);
  const result = spawnSync('/bin/sh', [path.join(root, 'setup/bootstrap/setup')], { input: 'n\n', encoding: 'utf8', env: { HOME: dir, PATH: bin } });
  assert.equal(result.status, 1); assert.match(result.stdout, /Cancelled before download/);
  assert.equal(fs.existsSync(path.join(dir, 'network-used')), false);
});

test('fresh bootstrap verifies and stages local runtime plus locked CLI dependencies, then launches wizard', t => {
  const dir = temp(t); const checkout = path.join(dir, 'checkout'); const bin = path.join(dir, 'bin'); fs.mkdirSync(bin);
  fs.mkdirSync(path.join(checkout, 'setup/bootstrap'), { recursive: true }); fs.mkdirSync(path.join(checkout, 'cli'));
  fs.copyFileSync(path.join(root, 'setup/bootstrap/setup'), path.join(checkout, 'setup/bootstrap/setup'));
  for (const command of ['dirname', 'mkdir', 'mktemp', 'grep', 'wc', 'tr', 'rm', 'shasum', 'tar', 'mv', 'cp']) {
    const found = spawnSync('/usr/bin/which', [command], { encoding: 'utf8' }).stdout.trim(); fs.symlinkSync(found, path.join(bin, command));
  }
  const release = 'node-v24.15.0-darwin-arm64'; const payload = path.join(dir, 'payload');
  fs.mkdirSync(path.join(payload, release, 'bin'), { recursive: true });
  fs.mkdirSync(path.join(payload, release, 'lib/node_modules/npm/bin'), { recursive: true });
  fs.writeFileSync(path.join(payload, release, 'lib/node_modules/npm/bin/npm-cli.js'), '// fixture');
  script(path.join(payload, release, 'bin/node'), 'if [ "$1" = -e ]; then exit 0; fi; case "$1" in */npm-cli.js) /bin/mkdir -p "$FIXTURE_CHECKOUT/cli/node_modules/@clack/prompts"; echo "$*" > "$FIXTURE_CHECKOUT/deps-evidence"; pwd > "$FIXTURE_CHECKOUT/deps-cwd" ;; *) echo fixture-wizard-launched ;; esac');
  const archive = path.join(dir, release + '.tar.gz');
  assert.equal(spawnSync('tar', ['-czf', archive, '-C', payload, release]).status, 0);
  const sums = path.join(dir, 'sums'); fs.writeFileSync(sums, createHash('sha256').update(fs.readFileSync(archive)).digest('hex') + '  ' + release + '.tar.gz\n');
  script(path.join(bin, 'uname'), 'if [ "$1" = -s ]; then echo Darwin; else echo arm64; fi');
  script(path.join(bin, 'curl'), `while [ "$1" != -o ]; do shift; done; shift; case "$1" in *SHASUMS256.txt) cp '${sums}' "$1" ;; *) cp '${archive}' "$1" ;; esac`);
  const r = spawnSync('/bin/sh', [path.join(checkout, 'setup/bootstrap/setup')], { input: 'y\ny\n', encoding: 'utf8', env: { HOME: dir, PATH: bin, FIXTURE_CHECKOUT: checkout } });
  assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /fixture-wizard-launched/);
  assert.match(fs.readFileSync(path.join(checkout, 'deps-evidence'), 'utf8'), /ci --ignore-scripts/);
  assert.equal(fs.readFileSync(path.join(checkout, 'deps-cwd'), 'utf8').trim(), fs.realpathSync(path.join(checkout, 'cli')));
  assert.ok(fs.existsSync(path.join(checkout, '.bootstrap', release, 'bin/node')));
  assert.equal(fs.existsSync(path.join(dir, '.pi')), false);
});

test('bootstrap official download flow verifies checksum before extraction (isolated command fixtures)', t => {
  const dir = temp(t); const checkout = path.join(dir, 'checkout'); const bin = path.join(dir, 'bin'); fs.mkdirSync(bin);
  fs.mkdirSync(path.join(checkout, 'setup/bootstrap'), { recursive: true });
  fs.copyFileSync(path.join(root, 'setup/bootstrap/setup'), path.join(checkout, 'setup/bootstrap/setup'));
  for (const command of ['dirname', 'mkdir', 'mktemp', 'grep', 'wc', 'tr', 'rm']) fs.symlinkSync(`/bin/${command}`, path.join(bin, command));
  // macOS tools aren't all in /bin; resolve deterministically using the parent test's PATH.
  for (const command of ['dirname', 'mkdir', 'mktemp', 'grep', 'wc', 'tr', 'rm']) {
    const p = path.join(bin, command); fs.unlinkSync(p);
    const found = spawnSync('/usr/bin/which', [command], { encoding: 'utf8' }).stdout.trim(); fs.symlinkSync(found, p);
  }
  script(path.join(bin, 'uname'), 'if [ "$1" = -s ]; then echo Darwin; else echo arm64; fi');
  script(path.join(bin, 'curl'), 'while [ "$1" != -o ]; do shift; done; shift; case "$1" in *SHASUMS256.txt) echo "bad  node-v24.15.0-darwin-arm64.tar.gz" > "$1" ;; *) echo payload > "$1" ;; esac');
  script(path.join(bin, 'shasum'), 'echo "fixture checksum mismatch" >&2; exit 1');
  script(path.join(bin, 'tar'), `echo unexpected > '${path.join(dir, 'extracted')}'; exit 1`);
  const result = spawnSync('/bin/sh', [path.join(checkout, 'setup/bootstrap/setup')], { input: 'y\n', encoding: 'utf8', env: { HOME: dir, PATH: bin } });
  assert.equal(result.status, 1); assert.match(result.stderr, /fixture checksum mismatch/);
  assert.equal(fs.existsSync(path.join(dir, 'extracted')), false);
});
