#!/usr/bin/env python3
"""Real Clack PTY acceptance. Only temporary homes/fake package metadata; never live installs."""
import fcntl
import json
import os
import pathlib
import pty
import re
import select
import shutil
import struct
import subprocess
import tempfile
import termios
import time

ROOT = pathlib.Path(__file__).resolve().parents[2]
NODE = shutil.which('node')
assert NODE, 'Node is required'


def write(p, text, mode=0o600):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text)
    p.chmod(mode)


def prepare(home, bin_dir):
    # Prime accepted fixture state, not applications. The first 15 catalogue entries are current.
    for base in [*(ROOT / 'setup/computer' / p for p in ['git', 'gh', 'ghostty', 'herdr', 'ssh', 'zsh']), *(ROOT / 'harness/pi/packages').iterdir()]:
        for directory, _, files in os.walk(base):
            for name in files:
                if name in ['.DS_Store', '.stow-local-ignore']:
                    continue
                source = pathlib.Path(directory) / name
                target = home / source.relative_to(base)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.symlink_to(source)
    write(home / '.oh-my-zsh/oh-my-zsh.sh', '# fixture upstream framework')
    write(home / '.pi/agent/settings.json', (ROOT / 'harness/pi/settings.example.json').read_text())
    write(home / '.pi/agent/bin/pi', '#!/bin/sh\nexit 77\n', 0o755)  # must never be invoked
    write(home / '.pi/agent/install/current-version', '1.5.2\n')
    write(home / '.pi/agent/install/managed-install.json', json.dumps({'kind': 'pi-managed-install', 'schemaVersion': 1, 'layout': 'releases-v1', 'entrypoint': {'type': 'symlink', 'path': str(home / '.local/bin/pi')}}))
    write(home / '.pi/agent/install/releases/1.5.2/node_modules/@earendil-works/pi-coding-agent/package.json', json.dumps({'name': '@earendil-works/pi-coding-agent', 'version': '1.5.2'}))
    write(home / '.pi/agent/npm/node_modules/@arhen/pi-core-todo/package.json', json.dumps({'name': '@arhen/pi-core-todo', 'version': '1.1.0'}))
    (home / '.local/bin').mkdir(parents=True, exist_ok=True)
    (home / '.local/bin/pi').symlink_to(home / '.pi/agent/bin/pi')
    metadata = {'formulae': [], 'casks': []}
    seen = set()
    for manifest in (ROOT / 'setup/computer/manifests/brew').iterdir():
        for kind, name in re.findall(r'^(brew|cask) "([\w@+./-]+)"', manifest.read_text(), re.M):
            if (kind, name) in seen:
                continue
            seen.add((kind, name))
            metadata['formulae' if kind == 'brew' else 'casks'].append({'name': name, 'token': name, 'installed': [{'version': '1.0'}] if kind == 'brew' else '1.0'})
    write(bin_dir / 'brew', '#!/bin/sh\nif [ "$1" != info ]; then echo unexpected-package-effect >&2; exit 77; fi\nprintf \'%s\\n\' \'' + json.dumps(metadata) + "'\n", 0o755)
    write(bin_dir / 'which', f'#!/bin/sh\necho "{home / ".local/bin/pi"}"\n', 0o755)
    write(home / '.pi/agent/auth.json', 'fixture-auth-must-stay')
    write(home / '.pi/agent/sessions/existing.jsonl', 'fixture-session-must-stay')


def snapshot(home):
    result = {}
    for directory, _, files in os.walk(home):
        for name in files:
            p = pathlib.Path(directory) / name
            result[str(p.relative_to(home))] = ('link', os.readlink(p)) if p.is_symlink() else ('file', p.read_bytes())
    return result


class Terminal:
    def __init__(self, home, bin_dir, dry=False, profile='custom'):
        self.master, slave = pty.openpty()
        fcntl.ioctl(slave, termios.TIOCSWINSZ, struct.pack('HHHH', 50, 140, 0, 0))
        env = dict(os.environ, HOME=str(home), PATH=str(bin_dir) + ':' + os.environ['PATH'], TERM='xterm-256color', CI='')
        self.process = subprocess.Popen([NODE, str(ROOT / 'cli/src/index.ts'), 'setup', '--home', str(home), '--profile', profile, *(['--dry-run'] if dry else [])], stdin=slave, stdout=slave, stderr=slave, env=env)
        os.close(slave)
        self.output = b''
        self.mark = 0

    @property
    def clean(self):
        return re.sub(rb'\x1b\[[0-?]*[ -/]*[@-~]', b'', self.output)

    def drain(self, delay=.06):
        while select.select([self.master], [], [], delay)[0]:
            try:
                data = os.read(self.master, 65536)
                if not data:
                    break
                self.output += data
            except OSError:
                break

    def send(self, value):
        self.drain()
        self.mark = len(self.clean)
        os.write(self.master, value)

    def wait(self, text):
        end = time.time() + 15
        while time.time() < end:
            self.drain()
            if text in self.clean[self.mark:]:
                return
            if self.process.poll() is not None:
                break
        raise AssertionError(f'Missing {text!r}; output tail: {self.clean[-2500:]!r}')

    def finish(self):
        self.process.wait(timeout=5)
        assert self.process.returncode == 0, self.clean[-2500:]
        assert b'requested action' not in self.clean  # regression: no per-component action prompts
        assert b'unexpected-package-effect' not in self.clean

    def close(self):
        if self.process.poll() is None:
            self.process.terminate()
            self.process.wait(timeout=5)
        os.close(self.master)


def run(case):
    with tempfile.TemporaryDirectory(prefix='ae-terminal-') as temp:
        temp = pathlib.Path(temp).resolve()
        home, bin_dir = temp / 'home', temp / 'bin'
        home.mkdir(); bin_dir.mkdir()
        prepare(home, bin_dir)
        before = snapshot(home)
        terminal = None
        try:
            if case == 'bulk':
                terminal = Terminal(home, bin_dir)
                terminal.wait(b'Choose recommendations'); terminal.send(b'\r')
                terminal.wait(b'Component choices')
                for _ in range(15):
                    terminal.send(b'x\x1b[B')
                terminal.wait(b'15 selected')
                terminal.send(b'\r'); terminal.wait(b'Review before any changes')
                terminal.send(b'\r'); terminal.wait(b'Approve these operations')
                assert b'Removal depth' not in terminal.clean
                # Confirm -> review -> choices -> profile; no provisioning during any backward navigation.
                terminal.send(b'\x7f'); terminal.wait(b'Review before any changes')
                terminal.send(b'\x7f'); terminal.wait(b'15 selected')
                terminal.send(b'\x7f'); terminal.wait(b'Choose recommendations')
                assert snapshot(home) == before
                # Switch to laptop: 15 explicit edits survive, plus 5 untouched laptop recommendations.
                terminal.send(b'\x1b[A\r'); terminal.wait(b'20 selected')
                terminal.send(b'\x7f'); terminal.wait(b'Choose recommendations')
                terminal.send(b'\x1b[B\r'); terminal.wait(b'15 selected')
                terminal.send(b'\r'); terminal.wait(b'Review before any changes')
                terminal.send(b'\r'); terminal.wait(b'Approve these operations')
                assert snapshot(home) == before
                terminal.send(b'y'); terminal.wait(b'Selected operations verified.')
                terminal.finish()
                after = snapshot(home)
                profile = after.pop('.local/state/ae/profile.json')
                assert json.loads(profile[1]) == {'profile': 'custom'}
                assert after == before  # 15 current selections: no reinstall, only explicitly approved profile receipt
                print('PTY PASS: 15 direct selections -> plan -> final confirmation; back/profile overrides preserved; current no-op apply')
            elif case == 'removal':
                terminal = Terminal(home, bin_dir, dry=True)
                terminal.wait(b'Choose recommendations'); terminal.send(b'\r'); terminal.wait(b'Component choices')
                terminal.send(b'-\r'); terminal.wait(b'Removal depth')
                terminal.send(b'\x7f'); terminal.wait('[−] Git configuration'.encode())
                terminal.send(b'\r'); terminal.wait(b'Removal depth')
                terminal.send(b'\x1b[B\x1b[B\r'); terminal.wait(b'Select owned configuration leaves')
                terminal.send(b'a\r'); terminal.wait(b'Confirm review removal')
                terminal.send(b'\x7f'); terminal.wait(b'[x]')
                terminal.send(b'\x7f'); terminal.wait(b'Removal depth')
                terminal.send(b'\x1b[A\r'); terminal.wait(b'Confirm application removal')
                terminal.send(b'\x7f'); terminal.wait(b'Removal depth')
                terminal.send(b'\x1b[A\r'); terminal.wait(b'Confirm configuration removal')
                terminal.send(b'y'); terminal.wait(b'Dry-run complete')
                assert b'REMOVE' in terminal.clean
                terminal.send(b'\x1b[B\r'); terminal.wait(b'No changes applied.')
                terminal.finish(); assert snapshot(home) == before
                print('PTY PASS: deliberate [-] only -> all three scopes, back navigation, dry-run removal; links/auth/sessions untouched')
            elif case == 'recommendations':
                terminal = Terminal(home, bin_dir, dry=True, profile='mac-workstation')
                terminal.wait(b'Choose recommendations'); terminal.send(b'\r'); terminal.wait(b'13 selected')
                terminal.send(b'\x7f'); terminal.wait(b'Choose recommendations')
                terminal.send(b'\r'); terminal.wait(b'13 selected')
                terminal.send(b'\x1b'); terminal.wait(b'Cancelled. No further operations.')
                terminal.finish(); assert snapshot(home) == before
                print('PTY PASS: existing-machine recommendations visibly preselected and retained by Backspace; Escape cancels')
            elif case == 'cleanup_blocked':
                # Convert config-ghostty to a parent-symlink (conflict) state.
                # prepare() created real dirs and leaf symlinks; remove them and replace
                # .config/ghostty with a foreign directory symlink to trigger the Unsafe parent path.
                for leaf in [home / '.config/ghostty/config', home / '.config/ghostty/themes/purpledreams']:
                    if leaf.is_symlink():
                        leaf.unlink()
                for d in [home / '.config/ghostty/themes', home / '.config/ghostty']:
                    if d.is_dir() and not d.is_symlink():
                        d.rmdir()
                foreign = temp / 'foreign_ghostty'
                foreign.mkdir()
                (home / '.config/ghostty').symlink_to(foreign)
                before = snapshot(home)  # re-snapshot with modified fixture
                terminal = Terminal(home, bin_dir, dry=True)
                terminal.wait(b'Choose recommendations'); terminal.send(b'\r')
                terminal.wait(b'Component choices')
                # config-ghostty is at index 2; navigate down twice, mark remove, submit
                terminal.send(b'\x1b[B\x1b[B')
                terminal.send(b'-'); terminal.send(b'\r')
                terminal.wait(b'Removal depth')
                # Navigate to Full cleanup review (3rd option; down twice, then enter)
                terminal.send(b'\x1b[B\x1b[B\r')
                terminal.wait(b'Cleanup inspection blocked')
                terminal.wait(b'Removal depth')  # returned to scope selection without crash
                terminal.send(b'\x1b')           # Escape to cancel
                terminal.wait(b'Cancelled. No further operations.')
                terminal.finish(); assert snapshot(home) == before
                print('PTY PASS: cleanup full-review for unsafe-parent component presents blocked note; navigates back to scope, no crash')
            else:
                terminal = Terminal(home, bin_dir, dry=True)
                terminal.wait(b'Choose recommendations'); terminal.send(b'\r'); terminal.wait(b'Component choices')
                terminal.send(b'\x03'); terminal.wait(b'Cancelled. No further operations.')
                terminal.finish(); assert snapshot(home) == before
                print('PTY PASS: Ctrl+C cancels selection safely')
        finally:
            if terminal:
                terminal.close()


for scenario in ['bulk', 'removal', 'recommendations', 'cleanup_blocked', 'cancel']:
    run(scenario)
