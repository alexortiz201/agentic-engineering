import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { detect } from '../src/setup/detect.ts';
import { run } from '../src/setup/execute.ts';
import type { Component, Context } from '../src/setup/types.ts';

function temp(t: any) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-computer-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

const gitComponent: Component = {
  id: 'config-git', name: 'Git configuration', description: 'Portable defaults', owner: 'setup/computer',
  adapter: 'stow', dependencies: [], packageDir: 'setup/computer', packageName: 'git',
};

test('legacyMigration: leaf link with matching sibling-dotfiles provenance digest reports migration status', t => {
  const dir = temp(t);
  const checkout = path.join(dir, 'agentic-engineering');
  const dotfiles = path.join(dir, 'dotfiles');
  const home = path.join(dir, 'home');

  // Minimal computer/git package — one file
  fs.mkdirSync(path.join(checkout, 'setup/computer/git'), { recursive: true });
  const content = '[core]\n\texcludesFile = ~/.gitignore_global\n';
  fs.writeFileSync(path.join(checkout, 'setup/computer/git/.gitconfig'), content);

  // Provenance entry whose hash matches the dotfiles copy (simulates pre-portable-template import)
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  fs.writeFileSync(path.join(checkout, 'setup/computer/source-provenance.json'), JSON.stringify({
    commit: 'fixture', dirty: false,
    files: [{ source: 'git/.gitconfig', destination: 'git/.gitconfig', sha256: hash, symlink: null }],
  }));

  // Sibling dotfiles with matching content
  fs.mkdirSync(path.join(dotfiles, 'git'), { recursive: true });
  fs.writeFileSync(path.join(dotfiles, 'git', '.gitconfig'), content);

  // Home: leaf symlink pointing to the dotfiles copy (old Stow layout)
  fs.mkdirSync(home);
  fs.symlinkSync(path.join(dotfiles, 'git', '.gitconfig'), path.join(home, '.gitconfig'));

  const ctx: Context = { root: checkout, home, platform: 'darwin', run };
  const state = detect(ctx, gitComponent);

  assert.equal(state.status, 'migration', `Expected migration; got ${state.status}: ${state.evidence.join('; ')}`);
  assert.equal(state.ownership, 'legacy-dotfiles');
  assert.ok(state.evidence.some(e => e.includes('Migration required')));
  assert.ok(state.evidence.some(e => e.includes('blocked')));
  // Detection is read-only: dotfiles source and home symlink are untouched
  assert.equal(fs.readFileSync(path.join(dotfiles, 'git', '.gitconfig'), 'utf8'), content);
  assert.ok(fs.lstatSync(path.join(home, '.gitconfig')).isSymbolicLink());
});

test('legacyMigration: absent provenance falls through to normal stow detection (missing)', t => {
  const dir = temp(t);
  const checkout = path.join(dir, 'agentic-engineering');
  const home = path.join(dir, 'home');

  // Minimal computer/git package; no provenance file and no sibling dotfiles
  fs.mkdirSync(path.join(checkout, 'setup/computer/git'), { recursive: true });
  fs.writeFileSync(path.join(checkout, 'setup/computer/git/.gitconfig'), '[core]\n');
  fs.mkdirSync(home);

  const ctx: Context = { root: checkout, home, platform: 'darwin', run };
  const state = detect(ctx, gitComponent);

  // No provenance → legacyMigration returns undefined → normal detection: no link in home → missing
  assert.equal(state.status, 'missing');
  assert.equal(state.installed, false);
  assert.deepEqual(fs.readdirSync(home), []); // detection is genuinely read-only
});

test('legacyMigration: provenance hash mismatch falls through to normal stow detection (conflict)', t => {
  const dir = temp(t);
  const checkout = path.join(dir, 'agentic-engineering');
  const dotfiles = path.join(dir, 'dotfiles');
  const home = path.join(dir, 'home');

  fs.mkdirSync(path.join(checkout, 'setup/computer/git'), { recursive: true });
  fs.writeFileSync(path.join(checkout, 'setup/computer/git/.gitconfig'), '[core]\n');

  // Provenance hash does not match the dotfiles content (tampered or unrelated file)
  fs.writeFileSync(path.join(checkout, 'setup/computer/source-provenance.json'), JSON.stringify({
    commit: 'fixture', dirty: false,
    files: [{ source: 'git/.gitconfig', destination: 'git/.gitconfig', sha256: 'nomatch', symlink: null }],
  }));

  // Sibling dotfiles with different content
  fs.mkdirSync(path.join(dotfiles, 'git'), { recursive: true });
  fs.writeFileSync(path.join(dotfiles, 'git', '.gitconfig'), 'other-content\n');

  // Home: leaf symlink pointing to the dotfiles copy (hash mismatch blocks migration recognition)
  fs.mkdirSync(home);
  fs.symlinkSync(path.join(dotfiles, 'git', '.gitconfig'), path.join(home, '.gitconfig'));

  const ctx: Context = { root: checkout, home, platform: 'darwin', run };
  const state = detect(ctx, gitComponent);

  // Hash mismatch: legacyMigration returns undefined; link points elsewhere → conflict
  assert.notEqual(state.status, 'migration');
  assert.equal(state.status, 'conflict');
  assert.equal(fs.readFileSync(path.join(dotfiles, 'git', '.gitconfig'), 'utf8'), 'other-content\n');
});
