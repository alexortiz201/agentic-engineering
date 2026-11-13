'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-stow-'));
const invoke = (repo, home, ...args) => cp.spawnSync(path.join(repo, 'scripts/install-pi'), ['--target', home, ...args], {encoding:'utf8'});
const must = r => assert.equal(r.status, 0, r.stderr);
try {
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'pi/settings.example.json'), 'utf8'));
  assert.deepEqual(seed.packages, ['npm:@arhen/pi-core-todo@1.1.0'], 'pin the accepted installed todo version, not V2 or floating latest');
  assert.deepEqual(seed.extensions, [], 'no legacy orchestration or built-in extension exclusions');
  for (const key of ['deviceId', 'lastChangelogVersion', 'extensionChangelogVersions', 'sessionDir', 'selfUpdateCommand']) assert(!(key in seed), `local state/override in portable seed: ${key}`);
  const resources = ['AGENTS.md','skills/workbench/SKILL.md','skills/agentic-engineering/SKILL.md','themes/purple-dreams.json','extensions/composer-highlight.ts'];
  let repo = path.join(tmp, 'source'); const home = path.join(tmp, 'home');
  fs.mkdirSync(home); fs.cpSync(path.join(root, 'pi'), path.join(repo, 'pi'), {recursive:true});
  fs.mkdirSync(path.join(repo, 'scripts')); fs.copyFileSync(path.join(root, 'scripts/install-pi'), path.join(repo, 'scripts/install-pi')); fs.chmodSync(path.join(repo, 'scripts/install-pi'), 0o755);
  const state = path.join(home, '.pi/agent'); fs.mkdirSync(state, {recursive:true});
  for (const file of ['settings.json','auth.json','sessions/keep','cache/keep','npm/keep','extensions/herdr-agent-state.ts']) { const p=path.join(state,file); fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p, `local ${file}`); }
  must(invoke(repo,home)); assert(!fs.existsSync(path.join(state,'AGENTS.md')), 'plan mutated target');
  must(invoke(repo,home,'--apply')); must(invoke(repo,home,'--apply'));
  assert(!fs.existsSync(path.join(home,'managed-lock')) && !fs.existsSync(path.join(home,'acceptance.md')) && !fs.existsSync(path.join(home,'settings.example.json')) && !fs.existsSync(path.join(home,'air-provisioning.md')), 'repository specifications/evidence must not be deployed');
  assert(!fs.lstatSync(path.join(state, 'settings.json')).isSymbolicLink(), 'mutable settings must stay local');
  for (const f of resources) assert(fs.lstatSync(path.join(state,f)).isSymbolicLink());
  const moved=path.join(tmp,'moved'); fs.renameSync(repo,moved); repo=moved;
  // Existing dangling links are removed by Stow only when the old source is known;
  // relocation requires removing before moving or explicitly resolving old links.
  assert.notEqual(invoke(repo,home,'--apply').status,0, 'relocation conflict must not be adopted');
  for (const f of resources) fs.unlinkSync(path.join(state,f));
  must(invoke(repo,home,'--apply')); must(invoke(repo,home,'--remove')); assert(fs.existsSync(path.join(state,'AGENTS.md')));
  must(invoke(repo,home,'--remove','--apply')); must(invoke(repo,home,'--remove','--apply'));
  for (const f of ['settings.json','auth.json','sessions/keep','cache/keep','npm/keep','extensions/herdr-agent-state.ts']) assert.equal(fs.readFileSync(path.join(state,f),'utf8'),`local ${f}`);
  fs.writeFileSync(path.join(state,'AGENTS.md'),'foreign'); assert.notEqual(invoke(repo,home,'--apply').status,0); assert.equal(fs.readFileSync(path.join(state,'AGENTS.md'),'utf8'),'foreign');
  assert(!fs.existsSync(path.join(state,'themes/purple-dreams.json')), 'conflict preflight must prevent partial installation');
  console.log('Stow fixtures passed: plan, repeat, relocation conflict/recovery, removal, foreign conflict and local state');
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
