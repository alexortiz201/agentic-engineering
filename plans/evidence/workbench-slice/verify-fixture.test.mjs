import assert from 'node:assert/strict';
import test from 'node:test';
import { cpSync, mkdtempSync, writeFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { snapshot, verify } from './verify-fixture.mjs';

const fixture = fileURLToPath(new URL('./fixture/', import.meta.url));
// Independent known-good control, never written into the actual managed subject.
const control = `export function slug(value) {
  if (typeof value !== 'string') throw new TypeError('Expected a string');
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}\n`;
function seed() {
  const root = mkdtempSync(join(tmpdir(), 'workbench-gate-control-'));
  cpSync(fixture, root, { recursive: true });
  return { root, baseline: snapshot(root) };
}

test('accepts exactly the granted nonempty behavioral implementation', () => {
  const { root, baseline } = seed();
  writeFileSync(join(root, 'slug.mjs'), control);
  const result = verify(root, baseline);
  assert.equal(result.gate, 'pass');
  assert.deepEqual(result.changed_files, ['slug.mjs']);
  assert.ok(result.checks.every((check) => check.status === 'passed'));
});

test('rejects a no-op even when every behavioral check passes', () => {
  const { root } = seed();
  writeFileSync(join(root, 'slug.mjs'), control);
  const baseline = snapshot(root);
  const result = verify(root, baseline);
  assert.equal(result.gate, 'blocked');
  assert.deepEqual(result.changed_files, []);
  assert.ok(result.checks.every((check) => check.status === 'passed'));
});

test('rejects scope drift even when behavioral checks pass', () => {
  const { root, baseline } = seed();
  writeFileSync(join(root, 'slug.mjs'), control);
  writeFileSync(join(root, 'unauthorized.txt'), 'Synthetic scope control');
  const result = verify(root, baseline);
  assert.equal(result.gate, 'blocked');
  assert.ok(result.changed_files.includes('unauthorized.txt'));
  assert.ok(result.checks.every((check) => check.status === 'passed'));
});

test('rejects a nonempty in-scope change that fails behavioral checks', () => {
  const { root, baseline } = seed();
  writeFileSync(join(root, 'slug.mjs'), 'export function slug(value) { return String(value); }\n');
  const result = verify(root, baseline);
  assert.equal(result.gate, 'blocked');
  assert.deepEqual(result.changed_files, ['slug.mjs']);
  assert.equal(result.checks[0].status, 'failed');
});

test('rejects symlink subject contamination before running checks', () => {
  const { root, baseline } = seed();
  symlinkSync(join(root, 'slug.test.mjs'), join(root, 'alias.mjs'));
  assert.throws(() => verify(root, baseline), /symlinks/);
});
