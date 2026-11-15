// Project-owned synthetic slice verifier, not a portable orchestration engine.
// Fixed commands only. No child launch, routing, acceptance or sandbox claim.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, lstatSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function snapshot(root) {
  const result = {};
  function visit(dir, prefix = '') {
    for (const name of readdirSync(dir).sort()) {
      const relative = prefix + name;
      const path = join(dir, name);
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) throw new Error('Fixture symlinks are prohibited');
      if (stat.isDirectory()) visit(path, relative + '/');
      else if (stat.isFile()) result[relative] = createHash('sha256').update(readFileSync(path)).digest('hex');
      else throw new Error('Fixture special files are prohibited');
    }
  }
  visit(root);
  return result;
}

export function verify(root, baseline) {
  const failures = [];
  const changed = (current) => [...new Set([...Object.keys(baseline), ...Object.keys(current)])]
    .sort().filter((path) => baseline[path] !== current[path]);
  const before = snapshot(root);
  const changedBefore = changed(before);
  if (changedBefore.length !== 1 || changedBefore[0] !== 'slug.mjs') failures.push('Expected exactly one changed file: slug.mjs');
  const checks = [];
  for (const argv of [['--test', 'slug.test.mjs'], ['--check', 'slug.mjs']]) {
    const started = Date.now();
    // A parent node:test runner exports internal context that can suppress
    // standalone child test execution. Checks must start a fresh test runner.
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, argv, { cwd: root, env, encoding: 'utf8', timeout: 10000, maxBuffer: 128 * 1024 });
    const status = result.error || result.signal ? 'error' : result.status === 0 ? 'passed' : 'failed';
    checks.push({ source: 'executed', command: ['node', ...argv], status, exit_code: result.status,
      signal: result.signal, duration_ms: Date.now() - started, stdout: result.stdout ?? '', stderr: result.stderr ?? '' });
    if (status !== 'passed') failures.push('Check did not pass: node ' + argv.join(' '));
  }
  const after = snapshot(root);
  if (JSON.stringify(before) !== JSON.stringify(after)) failures.push('Verification changed the fixture');
  return { schema_version: 1, source: 'executed', gate: failures.length ? 'blocked' : 'pass',
    task_state: 'validating', changed_files: changedBefore, failures, checks, observed_files: after };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    if (process.argv.length !== 6 || process.argv[2] !== '--workspace' || process.argv[4] !== '--baseline') throw new Error('Usage: node verify-fixture.mjs --workspace DIR --baseline FILE');
    const report = verify(resolve(process.argv[3]), JSON.parse(readFileSync(process.argv[5], 'utf8')));
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.gate === 'pass' ? 0 : 9;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
