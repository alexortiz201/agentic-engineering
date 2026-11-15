import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { catalog, projectCatalog } from '../src/components/catalog.ts';
import { digest } from '../src/setup/files.ts';
import { resolve } from '../src/project/resolve.ts';
import { applyProject, context, inspectProject, listProject, previewProject, verifyProject } from '../src/project/service.ts';
import type { Component } from '../src/setup/types.ts';

const real = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'));
const ID = 'project-engineering-skills';
function temp(t: any) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-project-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true })); return dir;
}
// Minimal canonical checkout: the catalog's declaration files plus the two real skill payloads.
function checkout(t: any) {
  const root = path.join(temp(t), 'canonical');
  for (const p of ['harness/pi/accepted.json', 'harness/pi/settings.example.json', 'setup/computer/manifests/brew',
    'harness/pi/packages/workbench-skill', 'harness/pi/packages/study-skill']) {
    fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.cpSync(path.join(real, p), path.join(root, p), { recursive: true });
  }
  return fs.realpathSync(root);
}
function repo(t: any) {
  const dir = path.join(temp(t), 'project'); fs.mkdirSync(path.join(dir, '.git'), { recursive: true }); return fs.realpathSync(dir);
}
function tree(dir: string, base = dir): string[] {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name), s = fs.lstatSync(p), rel = path.relative(base, p);
    if (s.isSymbolicLink()) return [`L ${rel} -> ${fs.readlinkSync(p)}`];
    if (s.isDirectory()) return [`D ${rel}`, ...tree(p, base)];
    return [`F ${rel} ${digest(fs.readFileSync(p).toString('base64'))}`];
  });
}
const wb = '.pi/skills/workbench/SKILL.md', study = '.pi/skills/agentic-engineering/SKILL.md', receiptPath = '.ae/project-capabilities.json';
function applyAll(root: string, target: string, ids: string[]) {
  const components = projectCatalog(root), ctx = context(root, target);
  return applyProject(ctx, components, ids, previewProject(ctx, components, ids).fingerprint);
}
function rewriteReceipt(target: string, mutate: (v: any) => void, sign = true) {
  const p = path.join(target, receiptPath), v = JSON.parse(fs.readFileSync(p, 'utf8'));
  mutate(v);
  if (sign) v.integrity = digest({ schema: v.schema, source: v.source, selected: v.selected, leaves: v.leaves });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
}
const leaf = (id: string, project = { source: `s/${id}`, target: `t/${id}`, requires: [] as string[] }): Component =>
  ({ id, name: id, description: id, owner: 'x', adapter: 'stow', dependencies: ['machine-only'], project: { kind: 'leaf', ...project } });
const comp = (id: string, dependencies: string[]): Component =>
  ({ id, name: id, description: id, owner: 'x', adapter: 'composition', dependencies, project: { kind: 'composition' } });

test('discovery lists project-applicable capabilities only and setup catalog is unchanged for machine use', () => {
  const found = listProject(projectCatalog(real));
  assert.deepEqual(found.map(c => c.id), ['workbench-skill', 'study-skill', ID]);
  assert.equal(found.find(c => c.id === ID)!.kind, 'composition');
  const machine = catalog(real);
  assert.ok(!machine.some(c => c.adapter === 'composition'), 'compositions must not enter machine setup');
  const wbSetup = machine.find(c => c.id === 'workbench-skill')!;
  assert.equal(wbSetup.adapter, 'stow'); assert.deepEqual(wbSetup.dependencies, ['pi', 'brew-stow']);
  assert.ok(!machine.find(c => c.id === 'composer')!.project);
});

test('discovery and unrelated-leaf planning never read unselected sources (lazy inspection)', t => {
  const root = checkout(t), target = repo(t);
  fs.rmSync(path.join(root, 'harness/pi/packages/study-skill'), { recursive: true });
  const components = projectCatalog(root);
  assert.equal(listProject(components).length, 3);
  const ctx = context(root, target);
  assert.deepEqual(previewProject(ctx, components, ['workbench-skill']).conflicts, []);
  assert.throws(() => previewProject(ctx, components, [ID]), /Source for study-skill is missing/);
  assert.throws(() => inspectProject(root, components, ID), /study-skill/);
});

test('requirements are advisory, explicit and exclude machine installers such as Stow', () => {
  const r = resolve(projectCatalog(real), [ID]);
  assert.deepEqual(r.requires, ['pi']);
  assert.ok(!r.order.includes('brew-stow') && !r.order.includes('pi'));
  const view = inspectProject(real, projectCatalog(real), 'workbench-skill');
  assert.equal(view.requirements[0].id, 'pi'); assert.match(view.requirements[0].note, /neither installs nor checks/);
  assert.equal(view.leaves[0].files[0].relative, wb); assert.match(view.leaves[0].files[0].sha256, /^[0-9a-f]{64}$/);
});

test('leaf and composition selection expand dependencies, nesting resolves recursively, cycles and misuse fail deterministically', () => {
  assert.deepEqual(resolve(projectCatalog(real), ['workbench-skill']).order, ['workbench-skill']);
  assert.deepEqual(resolve(projectCatalog(real), [ID]), { selected: [ID], order: ['workbench-skill', 'study-skill', ID], leaves: ['workbench-skill', 'study-skill'], requires: ['pi'] });
  const graph = [leaf('a'), leaf('b'), leaf('c'), comp('inner', ['a', 'b']), comp('outer', ['inner', 'c']), comp('top', ['outer', 'a'])];
  const frozen = structuredClone(graph);
  assert.deepEqual(resolve(graph, ['top']).order, ['a', 'b', 'inner', 'c', 'outer', 'top']);
  assert.deepEqual(resolve(graph, ['top']).leaves, ['a', 'b', 'c']);
  assert.deepEqual(resolve(graph, ['outer', 'inner', 'a', 'outer']), resolve(graph, ['a', 'inner', 'outer']), 'selection order/duplicates do not matter');
  assert.deepEqual(graph, frozen);
  assert.throws(() => resolve([leaf('a'), comp('x', ['y']), comp('y', ['x'])], ['x']), /Dependency cycle: x -> y -> x/);
  assert.throws(() => resolve([comp('x', ['x'])], ['x']), /Dependency cycle: x -> x/);
  assert.throws(() => resolve(graph, ['ghost']), /Unknown capability ghost/);
  assert.throws(() => resolve([comp('x', ['machine'])].concat({ ...leaf('machine'), project: undefined }), ['x']), /machine is not project-applicable \(required by x\)/);
  assert.throws(() => resolve(projectCatalog(real), ['pi']), /pi is not project-applicable/);
  assert.throws(() => resolve(graph, []), /Select at least one/);
  assert.throws(() => resolve([comp('empty', [])], ['empty']), /has no members/);
  assert.throws(() => resolve([leaf('a', { source: 's', target: 't', requires: ['nope'] })], ['a']), /requires unknown component nope/);
});

test('dry run is deterministic, read-only and does not mutate inputs', t => {
  const root = checkout(t), target = repo(t);
  fs.writeFileSync(path.join(target, 'AGENTS.md'), 'project instructions');
  const components = projectCatalog(root), frozen = structuredClone(components), before = tree(target);
  const first = previewProject(context(root, target), components, [ID]), second = previewProject(context(root, target), components, [ID]);
  assert.deepEqual(first, second); assert.deepEqual(tree(target), before); assert.deepEqual(components, frozen);
  assert.deepEqual(first.operations.map(o => `${o.kind} ${o.path}`),
    ['mkdir .ae', 'mkdir .pi', 'mkdir .pi/skills', 'mkdir .pi/skills/agentic-engineering', 'mkdir .pi/skills/workbench', `link ${wb}`, `link ${study}`, `record ${receiptPath}`]);
  assert.notEqual(previewProject(context(root, target), components, ['workbench-skill']).fingerprint, first.fingerprint);
});

test('apply links canonical payloads, preserves existing and unselected files, verifies, and reruns as a no-op', t => {
  const root = checkout(t), target = repo(t);
  fs.mkdirSync(path.join(target, '.pi/skills/other'), { recursive: true });
  fs.writeFileSync(path.join(target, '.pi/skills/other/SKILL.md'), 'mine');
  fs.writeFileSync(path.join(target, '.pi/settings.json'), '{"keep":true}');
  fs.writeFileSync(path.join(target, 'AGENTS.md'), 'agents'); fs.writeFileSync(path.join(target, 'CLAUDE.md'), 'claude');
  const preserved = tree(target);
  const result = applyAll(root, target, ['workbench-skill']);
  assert.equal(result.verification.ok, true);
  assert.equal(fs.readlinkSync(path.join(target, wb)), path.join(root, 'harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md'));
  assert.equal(fs.readFileSync(path.join(target, wb), 'utf8'), fs.readFileSync(path.join(root, 'harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md'), 'utf8'));
  assert.ok(!fs.existsSync(path.join(target, '.pi/skills/agentic-engineering')), 'unselected leaf untouched');
  for (const line of preserved) assert.ok(tree(target).includes(line), `preserved: ${line}`);
  const stable = tree(target), mtime = fs.statSync(path.join(target, receiptPath)).mtimeMs;
  const ctx = context(root, target), components = projectCatalog(root);
  const rerun = previewProject(ctx, components, ['workbench-skill']);
  assert.ok(rerun.operations.every(o => o.kind === 'noop'), JSON.stringify(rerun.operations));
  assert.deepEqual(applyProject(ctx, components, ['workbench-skill'], rerun.fingerprint).applied, []);
  assert.deepEqual(tree(target), stable); assert.equal(fs.statSync(path.join(target, receiptPath)).mtimeMs, mtime);
  // A later composition selection adds only what is missing and keeps the earlier recorded selection.
  const more = applyAll(root, target, [ID]);
  assert.deepEqual(more.applied, ['mkdir .pi/skills/agentic-engineering', `link ${study}`, `record ${receiptPath}`]);
  assert.ok(!more.applied.some(a => a.includes(wb)));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(target, receiptPath), 'utf8')).selected, [ID, 'workbench-skill']);
  assert.equal(verifyProject(ctx, components).ok, true);
});

test('real canonical Workbench Skill payload links into an isolated project and verifies', t => {
  const target = repo(t), before = tree(path.join(real, 'harness/pi/packages/workbench-skill'));
  const result = applyAll(real, target, ['workbench-skill']);
  assert.equal(result.verification.ok, true);
  assert.match(fs.readFileSync(path.join(target, wb), 'utf8'), /^---\nname: workbench/);
  assert.deepEqual(tree(path.join(real, 'harness/pi/packages/workbench-skill')), before, 'canonical source untouched');
});

test('apply requires the exact reviewed fingerprint; stale previews and missing approval change nothing', t => {
  const root = checkout(t), target = repo(t), components = projectCatalog(root), ctx = context(root, target);
  const plan = previewProject(ctx, components, [ID]), before = tree(target);
  assert.throws(() => applyProject(ctx, components, [ID], undefined), /Approval required/);
  assert.throws(() => applyProject(ctx, components, [ID], 'f'.repeat(64)), /Stale or different plan/);
  assert.deepEqual(tree(target), before);
  fs.mkdirSync(path.join(target, '.pi')); // target changed after review
  assert.throws(() => applyProject(ctx, components, [ID], plan.fingerprint), /Stale or different plan/);
  assert.deepEqual(fs.readdirSync(path.join(target, '.pi')), []);
  // Replacing the canonical source after review is stale too.
  const plan2 = previewProject(ctx, components, [ID]);
  fs.appendFileSync(path.join(root, 'harness/pi/packages/workbench-skill/.pi/agent/skills/workbench/SKILL.md'), '\nchanged');
  assert.throws(() => applyProject(ctx, components, [ID], plan2.fingerprint), /Stale or different plan/);
  assert.ok(!fs.existsSync(path.join(target, '.ae')));
});

test('existing files, foreign symlinks and unmanaged directories conflict without partial changes', t => {
  const root = checkout(t), components = projectCatalog(root);
  for (const [name, setup] of Object.entries({
    'regular file': (p: string) => fs.writeFileSync(p, 'user content'),
    'foreign symlink': (p: string) => fs.symlinkSync('/etc/hosts', p),
    'dangling symlink': (p: string) => fs.symlinkSync('/nonexistent/skill', p),
    'directory': (p: string) => fs.mkdirSync(p),
  })) {
    const target = repo(t);
    fs.mkdirSync(path.dirname(path.join(target, wb)), { recursive: true }); setup(path.join(target, wb));
    const ctx = context(root, target), before = tree(target), plan = previewProject(ctx, components, [ID]);
    assert.equal(plan.conflicts.length, 1, name); assert.match(plan.conflicts[0], /workbench-skill: .*SKILL\.md/, name);
    assert.throws(() => applyProject(ctx, components, [ID], plan.fingerprint), /Refusing to apply; 1 conflict/, name);
    assert.deepEqual(tree(target), before, `${name}: nothing created, including for the non-conflicting leaf`);
  }
});

test('symlinked or unsafe target roots and parents are refused', t => {
  const root = checkout(t), components = projectCatalog(root), base = temp(t);
  const real1 = repo(t), link = path.join(base, 'link'); fs.symlinkSync(real1, link);
  assert.throws(() => context(root, link), /real directory, not a symlink/);
  const parentLink = path.join(base, 'parent'); fs.symlinkSync(path.dirname(real1), parentLink);
  assert.throws(() => context(root, path.join(parentLink, 'project')), /passes through a symlink/);
  assert.throws(() => context(root, path.join(base, 'absent')), /does not exist/);
  const noGit = path.join(base, 'plain'); fs.mkdirSync(noGit);
  assert.throws(() => context(root, noGit), /not a Git repository root/);
  assert.throws(() => context(root, root), /outside the canonical checkout/);
  fs.mkdirSync(path.join(root, 'inside/.git'), { recursive: true });
  assert.throws(() => context(root, path.join(root, 'inside')), /outside the canonical checkout/);
  const file = path.join(base, 'file'); fs.writeFileSync(file, 'x');
  assert.throws(() => context(root, file), /real directory/);
  // Unsafe parents inside the repository surface as conflicts and block apply.
  const outside = temp(t);
  for (const make of [(p: string) => fs.symlinkSync(outside, path.join(p, '.pi')), (p: string) => fs.writeFileSync(path.join(p, '.pi'), 'file'),
    (p: string) => { fs.mkdirSync(path.join(p, '.pi')); fs.symlinkSync(outside, path.join(p, '.pi/skills')); }]) {
    const target = repo(t); make(target);
    const ctx = context(root, target), plan = previewProject(ctx, components, ['workbench-skill']), before = tree(target);
    assert.match(plan.conflicts.join(), /Unsafe path refused/);
    assert.throws(() => applyProject(ctx, components, ['workbench-skill'], plan.fingerprint), /Refusing to apply/);
    assert.deepEqual(tree(target), before); assert.deepEqual(fs.readdirSync(outside), []);
  }
  const target = repo(t); fs.symlinkSync(outside, path.join(target, '.ae'));
  assert.throws(() => previewProject(context(root, target), components, ['workbench-skill']), /Receipt refused: unsafe location/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('tampered, forged or foreign receipts are refused by plan, apply and verify without modification', t => {
  const root = checkout(t), components = projectCatalog(root);
  const cases: Record<string, [(v: any) => void, boolean, RegExp]> = {
    'edited without re-signing': [v => { v.selected = ['study-skill']; }, false, /integrity digest mismatch/],
    'forged target outside declared path': [v => { v.leaves['workbench-skill'][0].relative = '../AGENTS.md'; }, true, /malformed entry|outside its declared target/],
    'forged target elsewhere in project': [v => { v.leaves['workbench-skill'][0].relative = 'AGENTS.md'; }, true, /outside its declared target/],
    'unknown capability': [v => { v.selected = ['ghost']; }, true, /Unknown capability ghost/],
    'leaves mismatch selection': [v => { delete v.leaves['workbench-skill']; }, true, /do not match the recorded selection/],
    'extra field': [v => { v.extra = 1; }, true, /unexpected shape/],
    'bad digest': [v => { v.leaves['workbench-skill'][0].sha256 = 'zz'; }, true, /malformed entry/],
    'relative source root': [v => { v.source = 'relative/path'; }, true, /invalid source root/],
  };
  for (const [name, [mutate, sign, message]] of Object.entries(cases)) {
    const target = repo(t); applyAll(root, target, ['workbench-skill']);
    rewriteReceipt(target, mutate, sign);
    const ctx = context(root, target), before = tree(target);
    assert.throws(() => previewProject(ctx, components, ['workbench-skill']), message, name);
    assert.throws(() => applyProject(ctx, components, ['workbench-skill'], 'x'), message, name);
    assert.throws(() => verifyProject(ctx, components), message, name);
    assert.deepEqual(tree(target), before, name);
  }
  const garbage = repo(t); applyAll(root, garbage, ['workbench-skill']); fs.writeFileSync(path.join(garbage, receiptPath), '{not json');
  assert.throws(() => verifyProject(context(root, garbage), components), /invalid JSON/);
  const linked = repo(t); applyAll(root, linked, ['workbench-skill']);
  fs.renameSync(path.join(linked, receiptPath), path.join(linked, 'elsewhere.json')); fs.symlinkSync('elsewhere.json', path.join(linked, receiptPath));
  assert.throws(() => verifyProject(context(root, linked), components, ['workbench-skill']), /not a regular file/);
  // A receipt from another canonical checkout is never adopted or rewritten.
  const other = checkout(t), foreign = repo(t); applyAll(other, foreign, ['workbench-skill']);
  const ctx = context(root, foreign), before = tree(foreign), plan = previewProject(ctx, components, ['workbench-skill']);
  assert.match(plan.conflicts.join(), /different|not .*canonical|Receipt records source checkout/);
  assert.ok(plan.operations.some(o => o.kind === 'conflict') || plan.conflicts.length);
  assert.throws(() => applyProject(ctx, components, ['workbench-skill'], plan.fingerprint), /Refusing to apply/);
  assert.throws(() => verifyProject(ctx, components), /Receipt records source checkout/);
  assert.deepEqual(tree(foreign), before);
});

test('verify reconciles actual state: missing, partial, update, unrecorded and recovery', t => {
  const root = checkout(t), target = repo(t), components = projectCatalog(root), ctx = context(root, target);
  assert.throws(() => verifyProject(ctx, components), /nothing to verify/);
  assert.equal(verifyProject(ctx, components, [ID]).capabilities.find(c => c.id === ID)!.status, 'missing');
  applyAll(root, target, [ID]);
  const status = (id = ID) => verifyProject(ctx, components).capabilities.find(c => c.id === id)!.status;
  assert.equal(status(), 'current');
  fs.unlinkSync(path.join(target, wb));
  assert.equal(status('workbench-skill'), 'missing'); assert.equal(status(), 'partial');
  assert.equal(verifyProject(ctx, components).ok, false);
  const repair = previewProject(ctx, components, [ID]);
  assert.deepEqual(repair.operations.filter(o => o.kind !== 'noop').map(o => `${o.kind} ${o.path}`), [`link ${wb}`]);
  applyProject(ctx, components, [ID], repair.fingerprint); assert.equal(status(), 'current');
  fs.appendFileSync(path.join(root, 'harness/pi/packages/study-skill/.pi/agent/skills/agentic-engineering/SKILL.md'), '\nnew guidance');
  assert.equal(status('study-skill'), 'update'); assert.equal(status(), 'update');
  const refresh = previewProject(ctx, components, [ID]);
  assert.deepEqual(refresh.operations.filter(o => o.kind !== 'noop').map(o => o.kind), ['record']);
  applyProject(ctx, components, [ID], refresh.fingerprint); assert.equal(status(), 'current');
  fs.rmSync(path.join(target, '.ae'), { recursive: true });
  assert.equal(verifyProject(ctx, components, [ID]).capabilities[0].status, 'unrecorded');
  const record = previewProject(ctx, components, [ID]);
  assert.deepEqual(record.operations.filter(o => o.kind !== 'noop').map(o => `${o.kind} ${o.path}`), ['mkdir .ae', `record ${receiptPath}`]);
  applyProject(ctx, components, [ID], record.fingerprint); assert.equal(status(), 'current');
  fs.rmSync(path.join(target, study)); fs.writeFileSync(path.join(target, study), 'replaced by user');
  assert.equal(status(), 'conflict'); assert.equal(fs.readFileSync(path.join(target, study), 'utf8'), 'replaced by user');
});

const cli = path.join(real, 'cli/src/index.ts');
function run(args: string[], home: string) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: { ...process.env, HOME: home } });
}

test('CLI: documented commands work end-to-end, refuse bad input, and never touch HOME', t => {
  const home = temp(t), target = repo(t);
  assert.match(run(['project', '--help'], home).stdout, /list .*inspect .*plan .*apply .*verify/s);
  const list = JSON.parse(run(['project', 'list', '--json'], home).stdout);
  assert.deepEqual(list.map((c: any) => c.id), ['workbench-skill', 'study-skill', ID]);
  assert.match(run(['project', 'inspect', ID, '--json'], home).stdout, /"expands"/);
  assert.equal(run(['project', 'plan', '--select', ID], home).status, 1);            // target required
  assert.equal(run(['project', 'plan', '--target', target, '--select', 'ghost'], home).status, 1);
  assert.equal(run(['project', 'plan', '--target', target, '--bogus'], home).status, 1);
  assert.equal(run(['project', 'frobnicate'], home).status, 1);
  const plan = run(['project', 'plan', '--target', target, '--select', ID, '--json'], home);
  assert.equal(plan.status, 0, plan.stderr); const fingerprint = JSON.parse(plan.stdout).fingerprint;
  assert.deepEqual(fs.readdirSync(target), ['.git']);
  assert.equal(run(['project', 'apply', '--target', target, '--select', ID], home).status, 1);
  assert.equal(run(['project', 'apply', '--target', target, '--select', ID, '--approve', 'bad'], home).status, 1);
  const applied = run(['project', 'apply', '--target', target, '--select', ID, '--approve', fingerprint], home);
  assert.equal(applied.status, 0, applied.stderr); assert.match(applied.stdout, /Verified: all current/);
  assert.equal(run(['project', 'verify', '--target', target], home).status, 0);
  assert.equal(JSON.parse(run(['project', 'plan', '--target', target, '--select', ID, '--json'], home).stdout).operations.every((o: any) => o.kind === 'noop'), true);
  fs.rmSync(path.join(target, wb));
  assert.equal(run(['project', 'verify', '--target', target], home).status, 1);
  assert.deepEqual(fs.readdirSync(home), [], 'no HOME writes');
  assert.match(run(['--help'], home).stdout, /ae project/);
  assert.match(run(['setup', '--help'], home).stdout, /ae setup/);
});
