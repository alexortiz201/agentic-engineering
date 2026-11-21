import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const shell = path.join(root, 'setup/computer/zsh');
const theme = path.join(shell, '.oh-my-zsh/custom/themes/purpledreams.zsh-theme');
const zshrc = fs.readFileSync(path.join(shell, '.zshrc'), 'utf8');
const customEnv = fs.readFileSync(path.join(shell, '.oh-my-zsh/custom/env.sh'), 'utf8');

function run(script: string, env: NodeJS.ProcessEnv = {}): string {
  const result = spawnSync('/bin/zsh', ['-fc', script], {
    env: { PATH: '/usr/bin:/bin', TERM_PROGRAM: 'rex', ...env }, encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stderr, '');
  return result.stdout;
}

// Shell fixtures use controlled commands; startup tests isolate HOME/ZDOTDIR.
// No SSH connections, brew installs or clipboard access.
test('Pi clipboard forwarding reaches child processes in fresh shells and preserves explicit opt-out', t => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-clipboard-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  fs.copyFileSync(path.join(shell, '.zshenv'), path.join(home, '.zshenv'));
  for (const args of [['-c'], ['-lc'], ['-ic']]) {
    for (const value of [undefined, '', '0', '1']) {
      const result = spawnSync('/bin/zsh', [...args, `/bin/sh -c 'printf "%s" "$PI_CLIPBOARD_OSC52"'`], {
        env: {
          HOME: home, ZDOTDIR: home, PATH: '/usr/bin:/bin', TERM: 'xterm-256color',
          ...(value === undefined ? {} : { PI_CLIPBOARD_OSC52: value }),
        },
        encoding: 'utf8',
      });
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.equal(result.stderr, '');
      assert.equal(result.stdout, value || '1');
    }
  }
});

test('Homebrew plugins resolve the prefix once, reuse an exported prefix, and tolerate missing brew', t => {
  const fragment = zshrc.slice(zshrc.indexOf('ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='), zshrc.indexOf('export PROMPT_EOL_MARK='));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-startup-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  for (const plugin of ['zsh-autosuggestions', 'zsh-syntax-highlighting']) {
    const dir = path.join(tmp, 'share', plugin);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${plugin}.zsh`), `print -r -- '${plugin}'\n`);
  }
  fs.writeFileSync(path.join(tmp, 'brew'), '#!/bin/sh\necho called >> "$BREW_LOG"\nprintf "%s\\n" "$BREW_FIXTURE_PREFIX"\n', { mode: 0o755 });
  const env = { PATH: `${tmp}:/usr/bin:/bin`, BREW_LOG: path.join(tmp, 'calls'), BREW_FIXTURE_PREFIX: tmp };
  const expected = 'zsh-autosuggestions\nzsh-syntax-highlighting\n';
  assert.equal(run(fragment, env), expected);
  assert.equal(fs.readFileSync(env.BREW_LOG, 'utf8'), 'called\n');
  assert.equal(run(fragment, { ...env, HOMEBREW_PREFIX: tmp }), expected);
  assert.equal(fs.readFileSync(env.BREW_LOG, 'utf8'), 'called\n');
  assert.equal(run(fragment, { PATH: '/nonexistent' }), '');
});

test('theme background tint is Ghostty-only for local and remote shells', () => {
  const script = `scutil() { print fixture; }; source ${JSON.stringify(theme)}`;
  // Run outside any repository so the initial prompt never scans the working tree.
  for (const terminal of ['rex', 'herdr', 'xterm', 'ghostty']) {
    for (const remote of ['', 'fixture-ssh-connection']) {
      assert.equal(run(`cd /; ${script}`, { TERM_PROGRAM: terminal, SSH_CONNECTION: remote }),
        terminal === 'ghostty' ? (remote ? '\x1b]11;#241d14\x1b\\' : '\x1b]111\x1b\\') : '');
    }
  }
});

test('prompt clock, command exit status and completed timing remain correct', () => {
  assert.equal(run(`
    cd /
    scutil() { print fixture; }
    source ${JSON.stringify(theme)}
    (( EPOCHSECONDS > 0 )) || exit 11
    [[ -z "$(theme_command_duration)" ]] || exit 12
    theme_preexec
    [[ "$THEME_CMD_START" == <-> ]] || exit 13
    THEME_CMD_START=$(( EPOCHSECONDS - 3 ))
    false
    theme_set_prompt
    [[ "$RPROMPT" == *'3s'* && "$RPROMPT" == *'✕1'* ]] || exit 14
    [[ -z "\${THEME_CMD_START:-}" ]] || exit 15
    theme_set_prompt
    [[ "$RPROMPT" != *'3s'* && "$RPROMPT" != *'✕1'* ]] || exit 16
  `), '');
});

test('SSH tint preserves exit status without sending color escapes to Rex', t => {
  const fragment = customEnv.slice(customEnv.indexOf('supports_ghostty_bg_tint() {'), customEnv.indexOf('# Config aliases'));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-ssh-tint-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  fs.writeFileSync(path.join(tmp, 'ssh'), '#!/bin/sh\nexit 23\n', { mode: 0o755 });
  for (const terminal of ['ghostty', 'rex', 'herdr', 'xterm']) {
    const result = spawnSync('/bin/zsh', ['-fc', `${fragment}\nssh fixture-host; exit $?`], {
      env: { PATH: `${tmp}:/usr/bin:/bin`, TERM_PROGRAM: terminal }, encoding: 'utf8',
    });
    assert.equal(result.status, 23, result.stderr);
    assert.equal(result.stdout, terminal === 'ghostty' ? '\x1b]11;#241d14\x1b\\\x1b]111\x1b\\' : '');
  }
});

test('backspace initialization is terminal-only and portable private overrides survive', () => {
  assert.equal((zshrc.match(/stty erase/g) || []).length, 1);
  assert.match(zshrc, /\[\[ -t 0 \]\] && stty erase/);
  assert.doesNotMatch(customEnv, /stty erase/);
  assert.match(zshrc, /shell\.local\.zsh/);
  assert.doesNotMatch(zshrc, /export USER_EMAIL=/);
  assert.match(customEnv, /AE_PROJECT_HOME/);
  for (const file of [path.join(shell, '.zshrc'), path.join(shell, '.oh-my-zsh/custom/env.sh'), theme]) {
    const result = spawnSync('/bin/zsh', ['-n', file], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
});

test('Rex recovery is documented as manual, without personal endpoints or enrollment material', () => {
  const recovery = fs.readFileSync(path.join(root, 'setup/REX-RECOVERY.md'), 'utf8');
  const setup = fs.readFileSync(path.join(root, 'SETUP.md'), 'utf8');
  assert.match(setup, /setup\/REX-RECOVERY\.md/);
  assert.match(recovery, /manual recovery checklist/);
  assert.match(recovery, /Limit access to your Tailscale account/);
  assert.match(recovery, /rex hosts check --json/);
  assert.match(recovery, /rex -S air whoami --json/);
  assert.match(recovery, /No npm launcher repair/i);
  assert.doesNotMatch(recovery, /tailbe49f8|alexanderortiz|tailr\.fit|ssh-ed25519 AAAA|BEGIN .*PRIVATE KEY|tskey-/);
  assert.doesNotMatch(recovery, /npm config set|node .*install\.cjs|--allow-anonymous|StrictHostKeyChecking=no/);
});
