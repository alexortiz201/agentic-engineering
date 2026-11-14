import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const mapping: Record<string, string> = {
  'pi-instructions': 'AGENTS.md', 'pi-theme': 'themes/purple-dreams.json',
  'workbench-skill': 'skills/workbench/SKILL.md', 'study-skill': 'skills/agentic-engineering/SKILL.md', composer: 'extensions/composer-highlight.ts',
};
function fixture(t: any) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-pi-inspect-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo'), home = path.join(dir, 'home'), bin = path.join(dir, 'bin');
  fs.mkdirSync(home); fs.mkdirSync(bin);
  const write = (p: string, content: string, mode = 0o644) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content, { mode }); };
  write(path.join(repo, 'setup/inspect-links.mjs'), fs.readFileSync(path.join(root, 'setup/inspect-links.mjs'), 'utf8'));
  write(path.join(repo, 'workbench/README.md'), '# Fixture Workbench'); fs.mkdirSync(path.join(repo, 'workbench/foundations'));
  const baseline = 'a'.repeat(40), blobs: Record<string, string> = {};
  for (const [pkg, leaf] of Object.entries(mapping)) {
    const relative = `.pi/agent/${leaf}`, body = `accepted fixture ${pkg}\n`;
    write(path.join(repo, 'pi', relative), body); write(path.join(repo, 'harness/pi/packages', pkg, relative), body);
    const live = path.join(home, relative); fs.mkdirSync(path.dirname(live), { recursive: true }); fs.symlinkSync(path.join(repo, 'pi', relative), live);
    blobs[relative] = body;
  }
  write(path.join(repo, 'harness/pi/accepted.json'), JSON.stringify({ baseline, runtime: '1.5.2', todo: 'npm:@arhen/pi-core-todo@1.1.0' }));
  write(path.join(bin, 'blobs.json'), JSON.stringify(blobs));
  // Controlled Git read boundary; never create/commit in the real repository or use network.
  write(path.join(bin, 'git'), `#!${process.execPath}\nconst fs=require('node:fs'); const args=process.argv.slice(2); fs.appendFileSync(${JSON.stringify(path.join(bin, 'calls'))},args.join(' ')+'\\n'); if(args[2]==='show'){const k=args[3].split(':pi/')[1];process.stdout.write(JSON.parse(fs.readFileSync(${JSON.stringify(path.join(bin, 'blobs.json'))},'utf8'))[k]);}else if(args[2]==='rev-parse')console.log('${baseline}');else if(args[2]!=='status')process.exit(77);\n`, 0o755);
  write(path.join(home, '.pi/agent/bin/pi'), '#!/bin/sh\nexit 77\n', 0o755);
  write(path.join(home, '.pi/agent/install/current-version'), '1.5.2\n');
  write(path.join(home, '.pi/agent/install/managed-install.json'), JSON.stringify({ kind: 'pi-managed-install', schemaVersion: 1, layout: 'releases-v1', entrypoint: { type: 'symlink', path: path.join(home, '.local/bin/pi') } }));
  write(path.join(home, '.pi/agent/install/releases/1.5.2/node_modules/@earendil-works/pi-coding-agent/package.json'), JSON.stringify({ name: '@earendil-works/pi-coding-agent', version: '1.5.2' }));
  fs.mkdirSync(path.join(home, '.local/bin'), { recursive: true }); fs.symlinkSync(path.join(home, '.pi/agent/bin/pi'), path.join(home, '.local/bin/pi'));
  // Intentionally invalid/private files: this inspector must not parse or print them.
  write(path.join(home, '.pi/agent/settings.json'), 'private-settings-not-valid-json', 0o600);
  write(path.join(home, '.pi/agent/auth.json'), 'private-auth-never-read', 0o600);
  write(path.join(home, '.pi/agent/sessions/keep'), 'private-session', 0o600);
  const snapshot = () => {
    const output: Record<string, string> = {};
    function walk(dir: string) { for (const name of fs.readdirSync(dir)) { const p = path.join(dir, name); const s = fs.lstatSync(p); if (s.isDirectory()) walk(p); else output[path.relative(home, p)] = s.isSymbolicLink() ? fs.readlinkSync(p) : fs.readFileSync(p).toString('base64'); } }
    walk(home); return output;
  };
  const inspect = (environment: NodeJS.ProcessEnv = {}) => {
    const before = snapshot();
    const r = spawnSync(process.execPath, [path.join(repo, 'setup/inspect-links.mjs'), '--pi', '--home', home], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${path.join(home, '.local/bin')}${path.delimiter}${process.env.PATH}`, PI_CODING_AGENT_DIR: '', PI_SELF_UPDATE_COMMAND: '', ...environment } });
    assert.equal(r.status, 0, r.stderr); assert.deepEqual(snapshot(), before);
    assert.doesNotMatch(r.stdout + r.stderr, /private-settings|private-auth|private-session/);
    return JSON.parse(r.stdout);
  };
  return { dir, repo, home, bin, write, inspect, live: (leaf: string) => path.join(home, '.pi/agent', leaf) };
}

test('five-leaf Air evidence reports exact old/new literals, hashes and managed topology without reading private state or invoking Pi', t => {
  const f = fixture(t); const report = f.inspect();
  assert.equal(report.resources.length, 5); assert.equal(report.approvalRequired, true); assert.equal(report.handoffNeeded, true);
  assert.equal(report.runtime.topology, 'verified'); assert.equal(report.runtime.settings, 'not-read'); assert.equal(report.runtime.loading, 'not-tested');
  for (const row of report.resources) {
    assert.deepEqual(row.blockers, []); assert.equal(row.current.ownership, 'accepted-root-pi');
    assert.equal(row.current.uid, process.getuid?.()); assert.equal(row.current.sha256, row.sha256);
    assert.equal(path.resolve(path.dirname(row.live), row.proposedLiteral), row.proposedSource);
  }
  assert.equal(report.readyForApproval, process.platform === 'darwin' && report.sourceStorage.local);
  const calls = fs.readFileSync(path.join(f.bin, 'calls'), 'utf8');
  assert.doesNotMatch(calls, /commit|fetch|checkout|reset|install/);
});

test('already migrated leaves are recognized without planning relinks', t => {
  const f = fixture(t);
  for (const [pkg, leaf] of Object.entries(mapping)) { const p = f.live(leaf); fs.unlinkSync(p); fs.symlinkSync(path.join(f.repo, 'harness/pi/packages', pkg, '.pi/agent', leaf), p); }
  const r = f.inspect(); assert.ok(r.resources.every((row: any) => row.current.ownership === 'selective-pi' && row.blockers.length === 0)); assert.equal(r.handoffNeeded, false);
});

test('canonical verification has no root-layout dependency after fixture handoff', t => {
  const f = fixture(t);
  for (const [pkg, leaf] of Object.entries(mapping)) { const p = f.live(leaf); fs.unlinkSync(p); fs.symlinkSync(path.join(f.repo, 'harness/pi/packages', pkg, '.pi/agent', leaf), p); }
  fs.rmSync(path.join(f.repo, 'pi'), { recursive: true }); // Disposable fixture only, never real shared sources.
  const r = f.inspect();
  assert.ok(r.resources.every((row: any) => row.blockers.length === 0 && row.oldCopy === 'not-required-for-canonical-verification'));
  assert.equal(r.handoffNeeded, false);
});

test('unsafe or missing discovery parent is recorded and not traversed', t => {
  const f = fixture(t); const outside = path.join(f.dir, 'outside'); fs.mkdirSync(outside);
  fs.rmSync(path.join(f.home, '.pi/agent/skills'), { recursive: true }); fs.symlinkSync(outside, path.join(f.home, '.pi/agent/skills'));
  const report = f.inspect(); assert.equal(report.readyForApproval, false);
  assert.ok(report.resources.filter((row: any) => ['workbench-skill', 'study-skill'].includes(row.package)).every((row: any) => row.blockers.some((v: string) => v.includes('Unsafe parent'))));
  assert.deepEqual(fs.readdirSync(outside), []);
  fs.unlinkSync(path.join(f.home, '.pi/agent/skills'));
  assert.ok(f.inspect().resources.filter((row: any) => ['workbench-skill', 'study-skill'].includes(row.package)).every((row: any) => row.blockers.some((v: string) => v.includes('absent'))));
});

test('foreign and regular current resources are preserved and block simple five-leaf approval', t => {
  const f = fixture(t); const p = f.live('AGENTS.md'); fs.unlinkSync(p);
  const foreign = path.join(f.dir, 'unknown'); f.write(foreign, 'do-not-follow-unknown-target'); fs.symlinkSync(foreign, p);
  const foreignReport = f.inspect(); assert.equal(foreignReport.readyForApproval, false);
  assert.match(foreignReport.resources[0].blockers.join(), /outside this checkout/);
  fs.unlinkSync(p); f.write(p, 'private-regular-leaf');
  assert.match(f.inspect().resources[0].blockers.join(), /not an operator-owned symlink/);
});

test('changed accepted Git blob, extra Stow leaf and source symlink each block approval', t => {
  const f = fixture(t); const blobs = JSON.parse(fs.readFileSync(path.join(f.bin, 'blobs.json'), 'utf8'));
  blobs['.pi/agent/AGENTS.md'] = 'different accepted bytes'; f.write(path.join(f.bin, 'blobs.json'), JSON.stringify(blobs));
  assert.match(f.inspect().resources[0].blockers.join(), /content differs/);
  f.write(path.join(f.repo, 'harness/pi/packages/composer/extra'), 'unexpected');
  assert.match(f.inspect().resources[4].blockers.join(), /unexpected leaves/);
  const theme = path.join(f.repo, 'harness/pi/packages/pi-theme/.pi/agent/themes/purple-dreams.json');
  fs.unlinkSync(theme); fs.symlinkSync(path.join(f.repo, 'pi/.pi/agent/themes/purple-dreams.json'), theme);
  assert.match(f.inspect().resources[1].blockers.join(), /Expected regular/);
});

test('runtime metadata mismatch blocks approval without touching installation or parsing private settings', t => {
  const f = fixture(t); f.write(path.join(f.home, '.pi/agent/install/current-version'), '9.9.9\n');
  const r = f.inspect(); assert.equal(r.readyForApproval, false); assert.ok(r.blockers.some((v: string) => v.includes('runtime metadata')));
  assert.equal(r.runtime.credentials, 'not-read');
  f.write(path.join(f.home, '.pi/agent/install/current-version'), '1.5.2\n');
  f.write(path.join(f.bin, 'pi'), '#!/bin/sh\nexit 77\n', 0o755);
  const shadowed = f.inspect(); assert.equal(shadowed.readyForApproval, false); assert.equal(shadowed.runtime.pathResolution, path.join(f.bin, 'pi'));
  const overridden = f.inspect({ PI_CODING_AGENT_DIR: '/private-do-not-print', PI_SELF_UPDATE_COMMAND: 'private-command' });
  assert.equal(overridden.runtime.profileOverridePresent, true); assert.ok(overridden.blockers.some((v: string) => v.includes('Inherited Pi')));
  assert.doesNotMatch(JSON.stringify(overridden), /private-do-not-print|private-command/);
});

test('harness-only or externally redirected Workbench checkout blocks host approval', t => {
  const f = fixture(t); fs.rmSync(path.join(f.repo, 'workbench'), { recursive: true });
  assert.ok(f.inspect().blockers.some((v: string) => v.includes('Workbench/Foundations')));
  const outside = path.join(f.dir, 'external-workbench'); fs.mkdirSync(outside); fs.symlinkSync(outside, path.join(f.repo, 'workbench'));
  assert.ok(f.inspect().blockers.some((v: string) => v.includes('Workbench/Foundations')));
});

test('read-only report plus native selective Stow supports fixture handoff, refuses legacy re-adoption, and targeted rollback', t => {
  const f = fixture(t); const before = f.inspect();
  const args = [`--dir=${path.join(f.repo, 'harness/pi/packages')}`, `--target=${f.home}`, '--no-folding', '--restow'];
  const pkgs = Object.keys(mapping);
  assert.notEqual(spawnSync('stow', [...args, '--simulate', ...pkgs]).status, 0);
  for (const row of before.resources) { assert.equal(fs.readlinkSync(row.live), row.current.literal); fs.unlinkSync(row.live); }
  const simulate = spawnSync('stow', [...args, '--simulate', ...pkgs], { encoding: 'utf8' }); assert.equal(simulate.status, 0, simulate.stderr);
  assert.ok(before.resources.every((row: any) => !fs.existsSync(row.live)));
  const apply = spawnSync('stow', [...args, ...pkgs], { encoding: 'utf8' }); assert.equal(apply.status, 0, apply.stderr);
  assert.ok(f.inspect().resources.every((row: any) => row.current.ownership === 'selective-pi'));
  assert.notEqual(spawnSync('stow', [`--dir=${f.repo}`, `--target=${f.home}`, '--no-folding', '--simulate', '--restow', 'pi']).status, 0);
  for (const row of before.resources) {
    assert.equal(fs.readlinkSync(row.live), row.proposedLiteral);
    fs.unlinkSync(row.live); fs.symlinkSync(row.current.literal, row.live);
  }
  assert.ok(f.inspect().resources.every((row: any) => row.current.ownership === 'accepted-root-pi'));
  for (const [leaf, body] of [['settings.json', 'private-settings-not-valid-json'], ['auth.json', 'private-auth-never-read'], ['sessions/keep', 'private-session']]) assert.equal(fs.readFileSync(path.join(f.home, '.pi/agent', leaf), 'utf8'), body);
});

test('network source blocks simple approval even with five valid old links and verified runtime', t => {
  const f = fixture(t); const preload = path.join(f.bin, 'network.mjs');
  // Substitute only the OS read boundary, not inspection decisions or private state.
  f.write(preload, `import cp from 'node:child_process'; import { syncBuiltinESMExports } from 'node:module'; const original=cp.spawnSync; cp.spawnSync=(cmd,args,opts)=>cmd==='/sbin/mount'?{status:0,stdout:${JSON.stringify(`//server/DevDrive on ${f.repo} (smbfs, nodev)\n`)}}:cmd==='stat'&&args[0]==='-f'?{status:0,stdout:'smbfs\\n'}:original(cmd,args,opts); syncBuiltinESMExports();`);
  const r = f.inspect({ NODE_OPTIONS: `--import=${preload}` });
  assert.equal(r.sourceStorage.type, 'smbfs'); assert.equal(r.sourceStorage.local, false); assert.equal(r.readyForApproval, false);
  assert.ok(r.resources.every((row: any) => row.blockers.length === 0));
  assert.ok(r.blockers.some((v: string) => v.includes('shared-source/offline')));
});

test('writable source permissions block approval instead of inheriting ownership', t => {
  const f = fixture(t); fs.chmodSync(path.join(f.repo, 'harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts'), 0o666);
  assert.match(f.inspect().resources[4].blockers.join(), /ownership or write permissions/);
});

test('inspection rejects duplicate and mutating flags; help needs no target state', t => {
  const f = fixture(t); const script = path.join(f.repo, 'setup/inspect-links.mjs');
  for (const args of [['--pi', '--pi'], ['--pi', '--apply'], ['--home'], ['--home', f.home, '--home', f.home]]) {
    assert.notEqual(spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' }).status, 0);
  }
  const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' }); assert.equal(help.status, 0); assert.match(help.stdout, /--pi/);
});
