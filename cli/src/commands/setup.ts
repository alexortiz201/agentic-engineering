import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import { catalog } from '../components/catalog.ts';
import { profiles } from '../profiles/index.ts';
import { detectAll } from '../setup/detect.ts';
import { execute, previousProfile, run, saveProfile } from '../setup/execute.ts';
import { plan } from '../setup/plan.ts';
import type { Context, Selection, SetupSession } from '../setup/types.ts';
import { answer, guideRemovals, renderPlan } from '../prompts/setup.ts';
import { BACK, componentChoices, navigationConfirm, navigationSelect } from '../prompts/controls.ts';
import { chooseProfile, rememberChoices } from '../prompts/choices.ts';

export async function setup(args: string[]) {
  const values = new Map<string, string>(); const flags = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    if (['--dry-run', '--json', '--help'].includes(args[i])) flags.add(args[i]);
    else if (['--home', '--profile', '--select', '--remove'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--')) values.set(args[i], args[++i]);
    else throw new Error(`Unknown/incomplete argument: ${args[i]}`);
  }
  if (flags.has('--help')) {
    console.log('ae setup [--dry-run] [--home EXISTING_HOME]\nHeadless preview: --dry-run --json [--profile PROFILE] [--select ID,ID] [--remove ID:configuration,ID:application]\nNo headless apply. No installation occurs on clone.'); return;
  }
  if (flags.has('--json') && !flags.has('--dry-run')) throw new Error('--json requires --dry-run; headless apply is intentionally unsupported');
  if (!flags.has('--json') && (!process.stdin.isTTY || !process.stdout.isTTY)) throw new Error('Interactive setup needs a terminal; use --dry-run --json for a headless preview');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const home = path.resolve(values.get('--home') ?? os.homedir());
  const ctx: Context = { root, home, platform: process.platform, run };
  if (!fs.statSync(home).isDirectory() || fs.lstatSync(home).isSymbolicLink()) throw new Error('Target home must be an existing real directory');
  const components = catalog(root);
  const session: SetupSession = { profile: values.get('--profile') ?? previousProfile(ctx) ?? 'custom', selections: {}, overrides: {} };
  if (!profiles.some(v => v.id === session.profile)) throw new Error(`Unknown profile: ${session.profile}`);
  for (const id of (values.get('--select') ?? '').split(',').filter(Boolean)) session.overrides![id] = { action: 'install' };
  for (const entry of (values.get('--remove') ?? '').split(',').filter(Boolean)) {
    const [id, scope] = entry.split(':');
    if (!['configuration', 'application', 'review'].includes(scope)) throw new Error(`Invalid removal scope: ${entry}`);
    session.overrides![id] = { action: 'remove', scope: scope as Selection['scope'] };
  }
  if (Object.keys(session.overrides!).some(id => !components.some(c => c.id === id))) throw new Error('Unknown component selection');
  let states = detectAll(ctx, components);
  chooseProfile(session, session.profile, components, states);
  if (flags.has('--json')) {
    console.log(JSON.stringify({ profile: session.profile, target: home, states, plan: plan(components, states, session.selections) }, null, 2)); return;
  }
  p.intro('Agentic Engineering · setup');
  p.log.info(`Target: ${home}\nSource: ${root}\nNo live ownership handoff or source relocation is automatic.`);
  let step: 'profile' | 'components' | 'review' = 'profile';
  let cursor = 0;
  for (;;) {
    if (step === 'profile') {
      const value = await navigationSelect({ message: 'Choose recommendations (never mandatory)', initialValue: session.profile,
        options: profiles.map(v => ({ value: v.id, label: v.label, hint: v.hint })) });
      if (value === BACK) { p.outro('No changes applied.'); return; }
      chooseProfile(session, answer(value), components, states);
      step = 'components'; continue;
    }
    if (step === 'components') {
      const choices = answer(await componentChoices(components, states, session.selections, cursor));
      rememberChoices(session, choices.selections, choices.touched); cursor = choices.cursor;
      if (choices.direction === 'back') { step = 'profile'; continue; }
      const removals = structuredClone(session.selections);
      const direction = await guideRemovals(ctx, components, states, removals);
      rememberChoices(session, removals);
      if (direction === 'back') continue;
      step = 'review';
    }
    const reviewed = plan(components, states, session.selections);
    renderPlan(reviewed);
    const choice = await navigationSelect({ message: flags.has('--dry-run') ? 'Dry-run complete: nothing applied' : 'Review before any changes',
      options: [ ...(reviewed.conflicts.length || flags.has('--dry-run') ? [] : [{ value: 'apply', label: 'Apply this exact plan' }]),
        { value: 'revise', label: 'Revise selections' }, { value: 'exit', label: 'Exit without changes' } ] });
    if (choice === BACK || answer(choice) === 'revise') {
      delete ctx.brew; delete ctx.brewError; states = detectAll(ctx, components); step = 'components'; continue;
    }
    if (choice === 'exit') { p.outro('No changes applied.'); return; }
    const approved = await navigationConfirm(`Approve these operations against ${home}? No broader migration is authorized.`);
    if (approved === BACK || !answer(approved)) continue;
    const results = execute(ctx, components, reviewed, true);
    const failures = results.filter(v => v.status === 'failed' || v.status === 'partial');
    for (const result of results.filter(v => v.status !== 'skipped')) {
      p.log[result.status === 'success' ? 'success' : 'error'](`${result.component}: ${result.status} — ${result.detail}`);
    }
    p.log.info(`${results.filter(v => v.status === 'success').length} verified; ${failures.length} failed/partial; ${results.filter(v => v.status === 'skipped').length} skipped/no-op.`);
    if (!failures.length) saveProfile(ctx, session.profile); else process.exitCode = 1;
    p.outro(failures.length ? 'Stopped safely. Inspect partial state and private backups before retrying.' : 'Selected operations verified. Actual harness loading still requires application reload/acceptance.');
    return;
  }
}
