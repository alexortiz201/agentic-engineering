import assert from 'node:assert/strict';
import test from 'node:test';
import { slug } from './slug.mjs';

test('lowercases and separates words', () => {
  assert.equal(slug('  Workbench Engineering  '), 'workbench-engineering');
});
test('collapses punctuation and trims separators', () => {
  assert.equal(slug('---Build...Verify___Deliver!!!'), 'build-verify-deliver');
});
test('retains ASCII digits and existing word boundaries', () => {
  assert.equal(slug('API v2--READY'), 'api-v2-ready');
});
test('handles empty and punctuation-only strings', () => {
  for (const value of ['', ' ', '---', '!?']) assert.equal(slug(value), '');
});
test('does not transliterate Unicode', () => {
  assert.equal(slug('Crème brûlée'), 'cr-me-br-l-e');
});
test('rejects non-string inputs', () => {
  for (const value of [null, undefined, 42, {}, [], true]) {
    assert.throws(() => slug(value), TypeError);
  }
});
