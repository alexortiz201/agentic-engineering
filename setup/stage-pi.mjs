#!/usr/bin/env node
// Temporary migration staging only. Root pi/ remains canonical until approved handoff.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const leaves = {
  'pi-instructions': 'AGENTS.md',
  'pi-theme': 'themes/purple-dreams.json',
  'workbench-skill': 'skills/workbench/SKILL.md',
  'study-skill': 'skills/agentic-engineering/SKILL.md',
  'composer': 'extensions/composer-highlight.ts',
};
for (const [id, leaf] of Object.entries(leaves)) {
  const dest = path.join(root, 'harness/pi/packages', id, '.pi/agent', leaf);
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(path.join(root, 'pi/.pi/agent', leaf), dest);
}
copyFileSync(path.join(root, 'pi/settings.example.json'), path.join(root, 'harness/pi/settings.example.json'));
const manifest = JSON.parse(readFileSync(path.join(root, 'pi/managed-lock/1.5.2/package.json'), 'utf8'));
writeFileSync(path.join(root, 'harness/pi/accepted.json'), JSON.stringify({ runtime: manifest.version, todo: JSON.parse(readFileSync(path.join(root, 'pi/settings.example.json'), 'utf8')).packages.find(p => p.startsWith('npm:@arhen/pi-core-todo@')), baseline: 'e9c0a625f0ad07a134eab7e8a07fd23ad4bd7354' }, null, 2) + '\n');
