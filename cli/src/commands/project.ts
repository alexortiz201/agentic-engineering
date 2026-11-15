import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectCatalog } from '../components/catalog.ts';
import { applyProject, context, inspectProject, listProject, previewProject, verifyProject } from '../project/service.ts';
import type { ProjectPlan, Verification } from '../project/types.ts';

const HELP = `ae project <command>  (project-level capabilities; no machine setup, no installers)
  list    [--json]                                   Discover project-applicable capabilities
  inspect ID [--target REPO] [--json]                Members, expanded leaves, source files, requirements, optional state
  plan    --select ID[,ID] --target REPO [--json]    Read-only deterministic preview with approval fingerprint
  apply   --select ID[,ID] --target REPO --approve FINGERPRINT   Apply exactly the reviewed plan
  verify  --target REPO [--select ID[,ID]] [--json]  Check actual links/ownership/receipt (default: recorded selection)
REPO must be an existing real Git repository root (absolute real path). Links point at this canonical checkout.`;

function render(plan: ProjectPlan): string {
  return [`Target: ${plan.target}`, `Source: ${plan.source}`, `Selected: ${plan.selected.join(', ')}`, `Order: ${plan.order.join(' -> ')}`,
    ...(plan.requirements.length ? [`Advisory requirements (not installed/checked): ${plan.requirements.join(', ')}`] : []),
    ...plan.operations.map(o => `  ${o.kind.padEnd(8)} ${o.path}${o.capability ? ` [${o.capability}]` : ''} — ${o.reason}`),
    ...(plan.conflicts.length ? ['Conflicts (apply refused):', ...plan.conflicts.map(c => `  - ${c}`)] : []),
    `Receipt: ${plan.receipt.path} ${plan.receipt.before ?? 'absent'} -> ${plan.receipt.after}`,
    `Fingerprint: ${plan.fingerprint}`].join('\n');
}
function renderVerification(v: Verification): string {
  return [`Target: ${v.target}`, ...v.capabilities.map(c => `  ${c.status.padEnd(10)} ${c.id} (${c.kind})${c.evidence.length ? ` — ${c.evidence.join('; ')}` : ''}`), v.ok ? 'Verified: all current' : 'NOT verified'].join('\n');
}

export async function project(args: string[]) {
  const [sub, ...rest] = args;
  const values = new Map<string, string>(); const flags = new Set<string>(); const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    if (['--json', '--help'].includes(rest[i])) flags.add(rest[i]);
    else if (['--target', '--select', '--approve'].includes(rest[i]) && rest[i + 1] && !rest[i + 1].startsWith('--')) values.set(rest[i], rest[++i]);
    else if (!rest[i].startsWith('--') && sub === 'inspect') positional.push(rest[i]);
    else throw new Error(`Unknown/incomplete argument: ${rest[i]}`);
  }
  if (!sub || sub === '--help' || flags.has('--help')) { console.log(HELP); return; }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const components = projectCatalog(root);
  const ids = (values.get('--select') ?? '').split(',').filter(Boolean);
  const target = values.get('--target');
  const need = () => { if (!target) throw new Error('--target REPO is required'); return context(root, target); };
  const out = (json: unknown, text: string) => console.log(flags.has('--json') ? JSON.stringify(json, null, 2) : text);
  if (sub === 'list') {
    const items = listProject(components);
    out(items, items.map(c => `${c.id} (${c.kind}) — ${c.description}${c.kind === 'composition' ? `\n    members: ${c.members.join(', ')}` : `\n    ${c.source} -> <repo>/${c.target}`}`).join('\n'));
  } else if (sub === 'inspect') {
    if (positional.length !== 1) throw new Error('inspect needs exactly one capability ID');
    const v = inspectProject(root, components, positional[0], target);
    out(v, [`${v.id} (${v.kind}) — ${v.description}`, `Expands: ${v.expands.join(' -> ')}`,
      ...v.leaves.flatMap(l => [`Leaf ${l.id}: ${l.source} -> <repo>/${l.target}`, ...l.files.map(f => `    ${f.relative}  sha256:${f.sha256.slice(0, 12)}`)]),
      ...v.requirements.map(r => `Requires ${r.id} (${r.name}): ${r.note}`), ...('verification' in v && v.verification ? [renderVerification(v.verification)] : [])].join('\n'));
  } else if (sub === 'plan') {
    const plan = previewProject(need(), components, ids);
    out({ ...plan, nextReceipt: undefined }, `${render(plan)}\nNothing was changed.${plan.conflicts.length ? '' : `\nTo apply: ae project apply --target ${plan.target} --select ${plan.selected.join(',')} --approve ${plan.fingerprint}`}`);
    if (plan.conflicts.length) process.exitCode = 1;
  } else if (sub === 'apply') {
    const r = applyProject(need(), components, ids, values.get('--approve'));
    out({ applied: r.applied, plan: { ...r.plan, nextReceipt: undefined }, verification: r.verification },
      `${r.applied.length ? r.applied.map(a => `  ${a}`).join('\n') : '  nothing to change'}\n${renderVerification(r.verification)}`);
    if (!r.verification.ok) process.exitCode = 1;
  } else if (sub === 'verify') {
    const v = verifyProject(need(), components, ids);
    out(v, renderVerification(v));
    if (!v.ok) process.exitCode = 1;
  } else throw new Error(`Unknown project command: ${sub}`);
}
