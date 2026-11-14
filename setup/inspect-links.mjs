#!/usr/bin/env node
// Read-only per-host inventory. Never prints settings/auth contents or follows target parent links.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const usage = 'Usage: node setup/inspect-links.mjs [--pi] [--home EXISTING_HOME]';
if (args.length === 1 && args[0] === '--help') { console.log(usage); process.exit(0); }
let piOnly = false, targetHome;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--pi' && !piOnly) piOnly = true;
  else if (args[i] === '--home' && !targetHome && args[i + 1] && !args[i + 1].startsWith('--')) targetHome = args[++i];
  else throw new Error(usage);
}
const home = path.resolve(targetHome ?? os.homedir());
if (fs.lstatSync(home).isSymbolicLink() || !fs.statSync(home).isDirectory()) throw new Error('Home must be a real directory');
if (piOnly) {
  console.log(JSON.stringify(inspectPi(fs.realpathSync(root), home), null, 2));
} else {
const paths = new Set(['.local/bin/pi', '.pi/agent/settings.json', '.pi/agent/install/current-version', '.pi/agent/extensions/herdr-agent-state.ts', '.agents/skills/herdr/SKILL.md']);
function walk(base, dir = base) {
  for (const name of fs.readdirSync(dir)) {
    if (['.DS_Store', '.stow-local-ignore'].includes(name)) continue;
    const p = path.join(dir, name);
    if (fs.lstatSync(p).isDirectory()) walk(base, p); else paths.add(path.relative(base, p));
  }
}
for (const pkg of ['gh', 'ghostty', 'git', 'herdr', 'ssh', 'zsh']) walk(path.join(root, 'setup/computer', pkg));
for (const pkg of fs.readdirSync(path.join(root, 'harness/pi/packages'))) walk(path.join(root, 'harness/pi/packages', pkg));
for (const pkg of fs.readdirSync(path.join(root, 'setup/resources'))) walk(path.join(root, 'setup/resources', pkg));
const records = new Map();
for (const relative of [...paths].sort()) {
  const pieces = relative.split(path.sep); let p = home;
  for (const part of pieces) {
    p = path.join(p, part);
    let stat;
    try { stat = fs.lstatSync(p); } catch (e) { if (e.code === 'ENOENT') { records.set(p, { path: p, type: 'absent' }); break; } throw e; }
    if (stat.isSymbolicLink()) { records.set(p, { path: p, type: 'symlink', target: fs.readlinkSync(p), mode: stat.mode & 0o777 }); break; }
    if (!stat.isDirectory()) {
      records.set(p, { path: p, type: stat.isFile() ? 'file' : 'other', mode: stat.mode & 0o777,
        ...(stat.isFile() ? { sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') } : {}) }); break;
    }
  }
}
console.log(JSON.stringify({ home, source: root, records: [...records.values()] }, null, 2));
}

// Fixed five-leaf, read-only host evidence. No settings/auth/session read, package resolution,
// Pi startup, Stow, network request or receipt write. Keep the old broader inventory unchanged.
function inspectPi(source, target) {
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const uid = process.getuid?.();
  const blockers = [];
  function command(cmd, argv) {
    const r = spawnSync(cmd, argv, { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0' } });
    return r.status === 0 ? r.stdout.trim() : undefined;
  }
  function parents(p, boundary) {
    const relative = path.relative(boundary, path.dirname(p));
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('Path escaped inspection boundary');
    let dir = boundary;
    for (const part of ['', ...relative.split(path.sep).filter(Boolean)]) {
      if (part) dir = path.join(dir, part);
      const s = fs.lstatSync(dir);
      if (!s.isDirectory() || s.isSymbolicLink()) throw new Error(`Unsafe parent: ${dir}`);
    }
  }
  function file(p, boundary) {
    parents(p, boundary);
    const s = fs.lstatSync(p);
    if (!s.isFile() || s.isSymbolicLink()) throw new Error(`Expected regular source/metadata file: ${p}`);
    if (s.uid !== uid || (s.mode & 0o022)) throw new Error(`Source/metadata ownership or write permissions require review: ${p}`);
    return { bytes: fs.readFileSync(p), uid: s.uid, mode: s.mode & 0o777 };
  }
  let accepted;
  try {
    accepted = JSON.parse(file(path.join(source, 'harness/pi/accepted.json'), source).bytes);
    if (!/^[a-f0-9]{40}$/.test(accepted.baseline) || !/^\d+\.\d+\.\d+$/.test(accepted.runtime)) throw Error();
  } catch { throw new Error('Invalid/untrusted accepted Pi source metadata'); }
  let storage = { type: 'unknown', local: false };
  if (process.platform === 'darwin') {
    const mounts = (command('/sbin/mount', []) ?? '').split('\n').map(v => / on (.+) \(([^,\)]+)/.exec(v)).filter(Boolean)
      .filter(v => source === v[1] || source.startsWith(v[1] === '/' ? '/' : v[1] + '/')).sort((a, b) => b[1].length - a[1].length);
    storage = { type: mounts[0]?.[2] ?? 'unknown', local: ['apfs', 'hfs', 'ufs'].includes(mounts[0]?.[2]) };
  } else if (process.platform === 'linux') {
    const type = command('stat', ['-f', '-c', '%T', source]) ?? 'unknown';
    storage = { type, local: ['ext2/ext3', 'xfs', 'btrfs', 'tmpfs', 'overlayfs', 'zfs'].includes(type) };
  }
  if (!storage.local) blockers.push('Source filesystem is not verified local; shared-source/offline dependency needs a host decision. Do not relink to a new network dependency.');
  if (process.platform !== 'darwin') blockers.push('macOS host acceptance is required.');
  const resources = Object.entries({
    'pi-instructions': 'AGENTS.md', 'pi-theme': 'themes/purple-dreams.json',
    'workbench-skill': 'skills/workbench/SKILL.md', 'study-skill': 'skills/agentic-engineering/SKILL.md',
    composer: 'extensions/composer-highlight.ts',
  }).map(([pkg, leaf]) => {
    const relative = `.pi/agent/${leaf}`, live = path.join(target, relative);
    const oldSource = path.join(source, 'pi', relative), proposedSource = path.join(source, 'harness/pi/packages', pkg, relative);
    const row = { package: pkg, live, oldSource, proposedSource, proposedLiteral: path.relative(path.dirname(live), proposedSource), blockers: [] };
    try {
      const proposed = file(proposedSource, source);
      const baseline = spawnSync('git', ['-C', source, 'show', `${accepted.baseline}:pi/${relative}`],
        { timeout: 5000, maxBuffer: 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' } });
      if (baseline.status !== 0 || !proposed.bytes.equals(baseline.stdout)) throw new Error('Candidate/accepted resource content differs or accepted Git blob unavailable');
      row.sha256 = hash(proposed.bytes); row.sourceUid = proposed.uid; row.sourceMode = proposed.mode;
      if (proposed.mode !== 0o644) throw new Error('Source mode differs from accepted 0644');
      const packageRoot = path.join(source, 'harness/pi/packages', pkg);
      const found = [];
      function leaves(dir) { for (const name of fs.readdirSync(dir)) { const p = path.join(dir, name); if (fs.lstatSync(p).isDirectory()) leaves(p); else found.push(path.relative(packageRoot, p)); } }
      leaves(packageRoot);
      if (found.length !== 1 || found[0] !== relative) throw new Error('Package contains unexpected leaves; full Stow scope requires review');
      parents(live, target);
      const s = fs.lstatSync(live);
      row.current = { type: s.isSymbolicLink() ? 'symlink' : 'occupied', uid: s.uid, mode: s.mode & 0o777 };
      if (!s.isSymbolicLink() || s.uid !== uid) throw new Error('Current leaf is not an operator-owned symlink');
      row.current.literal = fs.readlinkSync(live);
      const resolved = path.resolve(path.dirname(live), row.current.literal);
      row.current.resolved = resolved;
      // Never read an arbitrary current target just because its filename resembles a resource.
      if (resolved !== oldSource && resolved !== proposedSource) throw new Error('Current target is outside this checkout\'s verified old/new ownership; record it for explicit reconciliation');
      if (fs.realpathSync(live) !== resolved) throw new Error('Current target traverses another symlink');
      if (resolved === oldSource) {
        const old = file(oldSource, source);
        if (old.mode !== 0o644 || !old.bytes.equals(proposed.bytes)) throw new Error('Current legacy resource content/mode differs from accepted candidate');
      }
      row.current.ownership = resolved === oldSource ? 'accepted-root-pi' : 'selective-pi';
      row.oldCopy = resolved === oldSource ? 'verified-for-handoff' : 'not-required-for-canonical-verification';
      row.current.sha256 = row.sha256;
    } catch (e) { row.blockers.push(e.code === 'ENOENT' ? 'Required source, leaf or real parent is absent; inspect before approval' : e.message); }
    blockers.push(...row.blockers.map(v => `${pkg}: ${v}`));
    return row;
  });
  const workbench = { readme: path.join(source, 'workbench/README.md'), foundations: path.join(source, 'workbench/foundations') };
  try {
    for (const p of [workbench.readme, workbench.foundations]) {
      const real = fs.realpathSync(p);
      if (!real.startsWith(source + path.sep)) throw Error();
    }
    if (!fs.statSync(workbench.readme).isFile() || !fs.statSync(workbench.foundations).isDirectory()) throw Error();
  } catch { blockers.push('Canonical Workbench/Foundations are missing or outside this checkout; a harness-only copy is insufficient.'); }
  const runtime = { loading: 'not-tested', credentials: 'not-read', settings: 'not-read', sessions: 'not-read',
    profileOverridePresent: !!(process.env.PI_CODING_AGENT_DIR || process.env.PI_SELF_UPDATE_COMMAND) };
  if (runtime.profileOverridePresent) blockers.push('Inherited Pi profile/self-update override requires host review; no environment or startup file was changed.');
  try {
    const marker = file(path.join(target, '.pi/agent/install/current-version'), target).bytes.toString().trim();
    const receipt = JSON.parse(file(path.join(target, '.pi/agent/install/managed-install.json'), target).bytes);
    const shim = path.join(target, '.pi/agent/bin/pi'), entry = path.join(target, '.local/bin/pi');
    const shimFile = file(shim, target);
    parents(entry, target);
    const s = fs.lstatSync(entry);
    if (!s.isSymbolicLink() || s.uid !== uid || path.resolve(path.dirname(entry), fs.readlinkSync(entry)) !== shim || !(shimFile.mode & 0o111)) throw new Error('Managed entrypoint/shim topology requires review');
    if (receipt.kind !== 'pi-managed-install' || receipt.schemaVersion !== 1 || receipt.layout !== 'releases-v1' || receipt.entrypoint?.path !== entry || receipt.entrypoint?.type !== 'symlink') throw new Error('Managed receipt identity requires review');
    if (marker !== accepted.runtime) throw new Error('Managed version differs from accepted runtime; do not reinstall during a source-only handoff');
    const metadata = JSON.parse(file(path.join(target, `.pi/agent/install/releases/${marker}/node_modules/@earendil-works/pi-coding-agent/package.json`), target).bytes);
    if (metadata.name !== '@earendil-works/pi-coding-agent' || metadata.version !== marker) throw new Error('Managed release identity/version requires review');
    // Resolve PATH from filesystem metadata only; never execute an unknown launcher/version command.
    runtime.pathResolution = (process.env.PATH ?? '').split(path.delimiter).map(dir => path.resolve(dir || '.', 'pi')).find(p => {
      try { if (!fs.statSync(p).isFile()) return false; fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; }
    });
    if (![entry, shim].includes(runtime.pathResolution)) throw new Error('PATH does not resolve the managed entrypoint/shim');
    Object.assign(runtime, { version: marker, accepted: accepted.runtime, entrypoint: entry, shim, topology: 'verified' });
  } catch { blockers.push('Native managed runtime metadata/topology requires host review (no installation or auth action attempted).'); }
  return { schemaVersion: 1, mode: 'pi-handoff', host: { hostname: os.hostname(), platform: process.platform, arch: process.arch, uid, home: target },
    source, acceptedBaseline: accepted.baseline, sourceHead: command('git', ['-C', source, 'rev-parse', 'HEAD']),
    sourceChanges: command('git', ['-C', source, 'status', '--short', '--', 'pi', 'harness/pi', 'setup/inspect-links.mjs']), sourceStorage: storage,
    resources, runtime, workbench, blockers, readyForApproval: blockers.length === 0,
    handoffNeeded: resources.some(r => r.current?.ownership === 'accepted-root-pi'), approvalRequired: true,
    boundary: 'Read-only evidence, not execution authority. No resource loading or offline acceptance claimed; keep private and reverify immediately before any separately approved handoff.' };
}
