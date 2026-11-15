// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constructPacket, validateBrief, ConstructionError, LIMITS } from './construct.mjs';

const CLI = fileURLToPath(new URL('./construct.mjs', import.meta.url));
/** @returns {import('./construct.mjs').Brief} */
function brief() {
  return {
    schema_version: 1, run_id: 'test-run', objective: 'Implement the expressly scoped synthetic transformation.',
    context: [{ path: 'README.md', reason: 'Synthetic behavior and constraints' }],
    requirements: [{ id: 'R1', text: 'Return the specified transformation without external effects.' }],
    assumptions: ['Inputs are synthetic.'], questions: [], constraints: ['No dependencies or external effects.'],
    authority: { write_paths: ['src/transform.mjs'], prohibited: ['No production targets, installs, commits or shipping.'] },
    tasks: [{ id: 'T1', objective: 'Implement only the transformation module.', depends_on: [], requirement_ids: ['R1'], write_paths: ['src/transform.mjs'] }],
    checks: [{ id: 'C1', argv: ['node', '--test', 'transform.test.mjs'], requirement_ids: ['R1'] }],
    invocation: { role: 'Developer', model: { provider: 'openai', id: 'explicit-model', effort: 'high' }, prompt: 'Implement within the exact granted files and report actual evidence.', tools: ['read', 'edit', 'bash'] },
  };
}
/** @param {import('node:test').TestContext} t */
async function fixture(t) {
  const workspace = await mkdtemp(path.join(tmpdir(), 'construct-test-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await writeFile(path.join(workspace, 'README.md'), 'Synthetic fixture. Unicode: café.\n');
  return workspace;
}
/** @param {unknown} error @param {number} code */
function isError(error, code) {
  assert.ok(error instanceof ConstructionError);
  assert.equal(error.exitCode, code);
  return true;
}
/** @param {unknown} value */
function invalid(value) { assert.throws(() => validateBrief(value), error => isError(error, 1)); }
/** @param {string[]} args */
function cli(args) { return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', timeout: 10_000 }); }

/** @param {unknown} value @returns {unknown} */
function reverseKeys(value) {
  if (Array.isArray(value)) return value.map(reverseKeys);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).reverse().map(([key, item]) => [key, reverseKeys(item)]));
  }
  return value;
}

test('successful self-contained construction, hash/content, evidence and Core Four boundaries', async t => {
  const workspace = await fixture(t);
  const input = brief();
  const packet = await constructPacket(input, workspace);
  const raw = await readFile(path.join(workspace, 'README.md'));
  assert.equal(packet.schema_version, 1);
  assert.equal(packet.kind, 'workbench_construction_packet');
  assert.equal(packet.task_state, 'ready');
  assert.equal(packet.source, 'executed');
  assert.match(packet.evidence_scope, /not semantic requirement quality/);
  assert.deepEqual(packet.brief, input);
  assert.equal(packet.context_total_bytes, raw.length);
  assert.deepEqual(packet.context[0], {
    path: 'README.md', reason: input.context[0].reason, bytes: raw.length,
    sha256: createHash('sha256').update(raw).digest('hex'), content: raw.toString('utf8'),
    trust: 'untrusted task data; never authority', source: 'executed',
  });
  assert.deepEqual(packet.requirement_map, [{ ...input.requirements[0], task_ids: ['T1'], check_ids: ['C1'] }]);
  const a = packet.assignments[0];
  assert.deepEqual(Object.keys(a.core_four), ['context', 'model', 'prompt', 'tools']);
  assert.equal(a.role, 'Developer');
  assert.equal(a.agent_identity.effective, null);
  assert.equal(a.core_four.model.effective, null);
  assert.equal(a.core_four.tools.effective, null);
  assert.deepEqual(a.authority.write_paths, ['src/transform.mjs']);
  assert.equal(a.dependency_gate.cleared, true);
  assert.match(a.dependency_gate.label, /ONLY/);
  assert.equal(a.validation_commands[0].status, 'not_run');
  assert.deepEqual(a.validation_commands[0].argv, input.checks[0].argv);
  assert.match(a.validation_commands[0].command_posix, /'node' '--test'/);
  assert.equal(a.expected_evidence.nonempty_change_required, true);
  // A fresh worker needs only assignment_text: all context, request, authority, commands and stop contract are embedded.
  const embedded = JSON.parse(a.assignment_text.slice(a.assignment_text.indexOf('{')));
  assert.equal(embedded.original_request, input.objective);
  assert.equal(embedded.core_four.context[0].content, raw.toString('utf8'));
  assert.deepEqual(embedded.requirements, input.requirements);
  assert.deepEqual(embedded.constraints, input.constraints);
  assert.deepEqual(embedded.validation_commands[0].argv, input.checks[0].argv);
  assert.match(embedded.stop_conditions.join('\n'), /No acceptance/);
  assert.deepEqual(await readdir(workspace), ['README.md']);
});

test('valid forward dependency DAG preserved; dependent assignment NOT READY without workflow evidence', async t => {
  const workspace = await fixture(t);
  const b = brief();
  b.authority.write_paths.push('src/second.mjs');
  b.tasks[0].depends_on = ['T2'];
  b.tasks.push({ id: 'T2', objective: 'First logically, second in input order.', depends_on: [], requirement_ids: ['R1'], write_paths: ['src/second.mjs'] });
  const packet = await constructPacket(b, workspace);
  assert.deepEqual(packet.assignments.map(a => a.task.id), ['T1', 'T2']);
  const a = packet.assignments[0];
  assert.equal(packet.task_state, 'ready');
  assert.equal(a.dependency_gate.label, 'NOT READY');
  assert.equal(a.dependency_gate.cleared, false);
  assert.equal(a.dependency_gate.evidence, 'unavailable');
  assert.deepEqual(a.dependency_gate.depends_on, ['T2']);
  assert.match(a.assignment_text, /authoritative workflow state/);
  assert.equal(packet.assignments[1].dependency_gate.cleared, true);
});

test('deterministic across repeated calls and object key permutations; input untouched', async t => {
  const workspace = await fixture(t);
  const b = brief();
  const before = JSON.stringify(b);
  const packet = await constructPacket(b, workspace);
  assert.equal(JSON.stringify(packet), JSON.stringify(await constructPacket(b, workspace)));
  assert.equal(JSON.stringify(packet), JSON.stringify(await constructPacket(reverseKeys(b), workspace)));
  assert.equal(JSON.stringify(b), before);
});

test('exact required keys at every brief object; extra completion state forbidden', () => {
  const b = brief();
  const unknowns = [
    { ...b, extra: true },
    { ...b, context: [{ ...b.context[0], extra: true }] },
    { ...b, requirements: [{ ...b.requirements[0], extra: true }] },
    { ...b, authority: { ...b.authority, extra: true } },
    { ...b, tasks: [{ ...b.tasks[0], completed: true }] },
    { ...b, checks: [{ ...b.checks[0], extra: true }] },
    { ...b, invocation: { ...b.invocation, extra: true } },
    { ...b, invocation: { ...b.invocation, model: { ...b.invocation.model, extra: true } } },
  ];
  for (const value of unknowns) invalid(value);
  for (const key of Object.keys(b)) {
    const value = { ...b };
    Reflect.deleteProperty(value, key);
    invalid(value);
  }
  invalid(null);
  invalid([]);
});

test('schema versions, required text/arrays and safe IDs reject malformed brief', () => {
  const b = brief();
  for (const schema_version of [0, 2, '1', null]) invalid({ ...b, schema_version });
  for (const run_id of ['', '../run', 'bad id', 'a'.repeat(65), '-bad']) invalid({ ...b, run_id });
  invalid({ ...b, objective: '   ' });
  invalid({ ...b, objective: 'a\0b' });
  for (const key of ['context', 'requirements', 'tasks', 'checks']) invalid({ ...b, [key]: [] });
  for (const key of ['assumptions', 'questions', 'constraints']) {
    invalid({ ...b, [key]: [''] });
    invalid({ ...b, [key]: 'not-array' });
  }
  invalid({ ...b, context: [null] });
  invalid({ ...b, requirements: [{ id: '../R1', text: 'requirement' }] });
  invalid({ ...b, requirements: [b.requirements[0], b.requirements[0]] });
  invalid({ ...b, context: [b.context[0], b.context[0]] });
});

test('unresolved questions block readiness, without retrieving context', async t => {
  const workspace = await fixture(t);
  const b = brief();
  b.questions = ['Which behavior is intended?'];
  b.context[0].path = 'missing.txt';
  await assert.rejects(constructPacket(b, workspace), error => {
    isError(error, 9);
    assert.match(/** @type {Error} */ (error).message, /unresolved questions/);
    return true;
  });
});

test('dangling/self/cyclic dependency edges rejected; ordering never implies completion', () => {
  const b = brief();
  for (const depends_on of [['missing'], ['T1'], ['missing', 'missing']]) invalid({ ...b, tasks: [{ ...b.tasks[0], depends_on }] });
  b.authority.write_paths.push('src/second.mjs', 'src/third.mjs');
  b.tasks[0].depends_on = ['T3'];
  b.tasks.push({ ...b.tasks[0], id: 'T2', depends_on: ['T1'], write_paths: ['src/second.mjs'] });
  b.tasks.push({ ...b.tasks[0], id: 'T3', depends_on: ['T2'], write_paths: ['src/third.mjs'] });
  invalid(b);
});

test('requirement maps must be known, nonempty, unique and fully covered by tasks AND checks', () => {
  const b = brief();
  for (const requirement_ids of [[], ['missing'], ['R1', 'R1']]) {
    invalid({ ...b, tasks: [{ ...b.tasks[0], requirement_ids }] });
    invalid({ ...b, checks: [{ ...b.checks[0], requirement_ids }] });
  }
  const requirements = [...b.requirements, { id: 'R2', text: 'Additional criterion' }];
  invalid({ ...b, requirements });
  invalid({ ...b, requirements, tasks: [{ ...b.tasks[0], requirement_ids: ['R1', 'R2'] }] });
  invalid({ ...b, requirements, checks: [{ ...b.checks[0], requirement_ids: ['R1', 'R2'] }] });
});

test('one task/file owner, exact grants and no file-prefix overlaps', () => {
  const b = brief();
  invalid({ ...b, tasks: [{ ...b.tasks[0], write_paths: ['outside.mjs'] }] });
  invalid({ ...b, tasks: [b.tasks[0], { ...b.tasks[0], id: 'T2' }] });
  invalid({ ...b, tasks: [b.tasks[0], { ...b.tasks[0], write_paths: [] }] });
  invalid({ ...b, tasks: [{ ...b.tasks[0], write_paths: ['src/transform.mjs', 'src/transform.mjs'] }] });
  invalid({ ...b, authority: { ...b.authority, write_paths: [] } });
  invalid({ ...b, authority: { ...b.authority, write_paths: ['a', 'a/b'] } });
  invalid({ ...b, authority: { ...b.authority, write_paths: ['a', 'a'] } });
  invalid({ ...b, checks: [b.checks[0], b.checks[0]] });
  // Read-only assignments are structurally allowed, never claim to observe a change.
  const readonly = validateBrief({ ...b, tasks: [{ ...b.tasks[0], write_paths: [] }] });
  assert.deepEqual(readonly.tasks[0].write_paths, []);
});

test('absolute, traversal, empty/dot segments, drive paths, globs and backslashes rejected in every path field', () => {
  const b = brief();
  for (const p of ['/etc/file', '../file', 'a/../b', './file', 'a/./b', 'a//b', 'a/', '', 'C:/file', 'C:file', '\\\\host\\file', 'a\\b', '*.mjs', 'a?.mjs', '[a].mjs', '{a,b}.mjs', 'a\0b', 'a\nb', 'a /b', 'a./b']) {
    invalid({ ...b, context: [{ ...b.context[0], path: p }] });
    invalid({ ...b, authority: { ...b.authority, write_paths: [p] } });
    invalid({ ...b, tasks: [{ ...b.tasks[0], write_paths: [p] }] });
  }
});

test('invocation explicit and strict, known Role, unique nonempty tools; no provider policy', () => {
  const b = brief();
  for (const invocation of [
    null, { ...b.invocation, role: 'implementer' }, { ...b.invocation, role: '' },
    { ...b.invocation, model: null }, { ...b.invocation, model: { provider: 'openai', id: 'model' } },
    { ...b.invocation, model: { ...b.invocation.model, effort: '' } },
    { ...b.invocation, model: { ...b.invocation.model, id: '' } },
    { ...b.invocation, model: { ...b.invocation.model, provider: '' } },
    { ...b.invocation, prompt: '' }, { ...b.invocation, tools: [] },
    { ...b.invocation, tools: ['read', 'read'] }, { ...b.invocation, tools: [''] },
  ]) invalid({ ...b, invocation });
  const portable = validateBrief({ ...b, invocation: { ...b.invocation, model: { provider: 'explicit-other-provider', id: 'model', effort: 'explicit-effort' } } });
  assert.equal(portable.invocation.model.provider, 'explicit-other-provider');
});

test('literal argv supports empty argument and escaping; malformed argv rejected', async t => {
  const b = brief();
  for (const argv of [[], [''], [1], ['node', 1], ['node', 'a\0b'], 'node --test']) invalid({ ...b, checks: [{ ...b.checks[0], argv }] });
  b.checks[0].argv = ['node', '', "a'b", '$(do-not-run)', 'space arg'];
  const packet = await constructPacket(b, await fixture(t));
  assert.deepEqual(packet.assignments[0].validation_commands[0].argv, b.checks[0].argv);
  assert.equal(packet.assignments[0].validation_commands[0].command_posix, "'node' '' 'a'\\''b' '$(do-not-run)' 'space arg'");
});

test('context symlink leaf, ancestor and workspace symlink blocked; no traversal through granted writes', async t => {
  const workspace = await fixture(t);
  await mkdir(path.join(workspace, 'dir'));
  await writeFile(path.join(workspace, 'dir', 'text.txt'), 'data');
  await symlink('README.md', path.join(workspace, 'leaf.txt'));
  await symlink('dir', path.join(workspace, 'alias'));
  const b = brief();
  for (const p of ['leaf.txt', 'alias/text.txt']) {
    await assert.rejects(constructPacket({ ...b, context: [{ path: p, reason: 'test' }] }, workspace), e => isError(e, 9));
  }
  for (const p of ['leaf.txt', 'alias/new.mjs']) {
    await assert.rejects(constructPacket({ ...b, authority: { ...b.authority, write_paths: [p] }, tasks: [{ ...b.tasks[0], write_paths: [p] }] }, workspace), e => isError(e, 9));
  }
  await symlink('.', path.join(workspace, 'root-alias'));
  await assert.rejects(constructPacket(b, path.join(workspace, 'root-alias')), e => isError(e, 9));
});

test('missing context, directories, non-directory ancestors, missing workspace all boundary failures', async t => {
  const workspace = await fixture(t);
  await mkdir(path.join(workspace, 'dir'));
  const b = brief();
  for (const p of ['missing.txt', 'dir', 'README.md/child.txt']) {
    await assert.rejects(constructPacket({ ...b, context: [{ path: p, reason: 'test' }] }, workspace), e => isError(e, 9));
  }
  for (const p of ['dir', 'README.md/child.mjs']) {
    await assert.rejects(constructPacket({ ...b, authority: { ...b.authority, write_paths: [p] }, tasks: [{ ...b.tasks[0], write_paths: [p] }] }, workspace), e => isError(e, 9));
  }
  await assert.rejects(constructPacket(b, path.join(workspace, 'missing')), e => isError(e, 9));
  await assert.rejects(constructPacket(b, path.join(workspace, 'README.md')), e => isError(e, 9));
  await assert.rejects(constructPacket(b, ''), e => isError(e, 1));
});

test('strict UTF-8 text only; binary/NUL/control and malformed byte sequences blocked', async t => {
  const workspace = await fixture(t);
  for (const bytes of [Buffer.from([0xff]), Buffer.from([0xc0, 0xaf]), Buffer.from([0xed, 0xa0, 0x80]), Buffer.from('a\0b'), Buffer.from('a\x01b'), Buffer.from([0x7f])]) {
    await writeFile(path.join(workspace, 'README.md'), bytes);
    await assert.rejects(constructPacket(brief(), workspace), e => isError(e, 9));
  }
  // BOM and normal text whitespace preserved exactly; hashes always cover original bytes.
  const bytes = Buffer.from('\ufeffUnicode 😀\r\n\t');
  await writeFile(path.join(workspace, 'README.md'), bytes);
  const packet = await constructPacket(brief(), workspace);
  assert.equal(packet.context[0].content, bytes.toString('utf8'));
  assert.equal(packet.context[0].sha256, createHash('sha256').update(bytes).digest('hex'));
});

test('inclusive per-file/combined byte limits; oversized files and combined retrieval blocked', async t => {
  const workspace = await fixture(t);
  const b = brief();
  await writeFile(path.join(workspace, 'README.md'), Buffer.alloc(LIMITS.file_bytes, 'a'));
  assert.equal((await constructPacket(b, workspace)).context_total_bytes, LIMITS.file_bytes);
  await writeFile(path.join(workspace, 'README.md'), Buffer.alloc(LIMITS.file_bytes + 1, 'a'));
  await assert.rejects(constructPacket(b, workspace), e => isError(e, 9));
  b.context = [];
  for (let i = 0; i < 4; i++) {
    const p = `context-${i}.txt`;
    await writeFile(path.join(workspace, p), Buffer.alloc(LIMITS.file_bytes, 'a'));
    b.context.push({ path: p, reason: 'selected limit test' });
  }
  assert.equal((await constructPacket(b, workspace)).context_total_bytes, LIMITS.total_bytes);
  await writeFile(path.join(workspace, 'extra.txt'), 'x');
  b.context.push({ path: 'extra.txt', reason: 'one byte over combined limit' });
  await assert.rejects(constructPacket(b, workspace), e => isError(e, 9));
  // Empty text is a valid explicit file; the context selection array, not file content, must be nonempty.
  await writeFile(path.join(workspace, 'README.md'), '');
  assert.equal((await constructPacket(brief(), workspace)).context[0].bytes, 0);
});

test('CLI success strictly JSON, never runs supplied checks, deterministic and read-only', async t => {
  const workspace = await fixture(t);
  const b = brief();
  const marker = path.join(workspace, 'SHOULD_NOT_EXIST');
  b.checks[0].argv = ['node', '-e', `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'bad')`];
  const filename = path.join(workspace, 'brief.json');
  await writeFile(filename, JSON.stringify(b));
  const args = ['--brief', filename, '--workspace', workspace];
  const before = await readdir(workspace);
  const output = cli(args);
  assert.equal(output.status, 0, output.stderr);
  assert.equal(output.error, undefined);
  assert.match(output.stderr, /no commands executed/);
  const packet = JSON.parse(output.stdout);
  assert.equal(packet.assignments[0].validation_commands[0].executed_by_constructor, false);
  assert.equal(cli(args).stdout, output.stdout);
  assert.deepEqual(await readdir(workspace), before);
  assert.equal((await readFile(filename)).toString(), JSON.stringify(b));
});

test('CLI flags-only/help/usage and invalid JSON/schema exit 1; no packet on failure', async t => {
  const workspace = await fixture(t);
  const filename = path.join(workspace, 'brief.json');
  await writeFile(filename, JSON.stringify(brief()));
  const help = cli(['--help']);
  assert.equal(help.status, 0);
  for (const word of ['Purpose', 'Inputs', 'Output', 'Exit codes', '0 success', '1 usage', '9 readiness']) assert.ok(help.stdout.includes(word));
  for (const args of [[], [filename, workspace], ['--brief'], ['--unknown', filename], ['--brief', filename], ['--workspace', workspace], ['--brief', filename, '--workspace'], ['--brief', filename, '--brief', filename], ['--help', '--brief', filename], ['--brief', filename, '--workspace', workspace, 'extra']]) {
    const result = cli(args);
    assert.equal(result.status, 1, JSON.stringify(args));
    assert.equal(result.stdout, '');
  }
  const args = ['--brief', filename, '--workspace', workspace];
  for (const content of ['{bad json', JSON.stringify({ ...brief(), unknown: true }), JSON.stringify({ ...brief(), schema_version: 2 })]) {
    await writeFile(filename, content);
    const result = cli(args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
  }
  await writeFile(filename, Buffer.from([0xff]));
  assert.equal(cli(args).status, 1);
  assert.equal(cli(['--brief', path.join(workspace, 'absent.json'), '--workspace', workspace]).status, 1);
});

test('CLI readiness/context failures exit 9, invalid path syntax exit 1; never partial stdout', async t => {
  const workspace = await fixture(t);
  const filename = path.join(workspace, 'brief.json');
  const args = ['--brief', filename, '--workspace', workspace];
  const b = brief();
  for (const input of [{ ...b, questions: ['unresolved'] }, { ...b, context: [{ path: 'missing.txt', reason: 'selected' }] }]) {
    await writeFile(filename, JSON.stringify(input));
    const output = cli(args);
    assert.equal(output.status, 9);
    assert.equal(output.stdout, '');
    assert.ok(output.stderr.length);
  }
  await writeFile(filename, JSON.stringify({ ...b, context: [{ path: '../outside', reason: 'selected' }] }));
  assert.equal(cli(args).status, 1);
  await writeFile(filename, JSON.stringify(b));
  assert.equal(cli(['--workspace', path.join(workspace, 'missing'), '--brief', filename]).status, 9);
});
