import type { Action, Component, Selection, SetupSession, State } from '../setup/types.ts';
import { defaults } from '../profiles/index.ts';

export const glyph = (s?: Selection) => s?.action === 'install' ? '[x]' : s?.action === 'remove' ? '[−]' : '[ ]';
export function setAction(selections: Record<string, Selection>, id: string, action: Action) {
  if (selections[id]?.action !== action) selections[id] = { action }; // changing intent invalidates prior removal consent
}
export function cycleAction(selections: Record<string, Selection>, id: string) {
  const actions: Action[] = ['keep', 'install', 'remove'];
  setAction(selections, id, actions[(actions.indexOf(selections[id]?.action ?? 'keep') + 1) % actions.length]);
}
export function rememberChoices(session: SetupSession, next: Record<string, Selection>, touched: readonly string[] = []) {
  session.overrides ??= {};
  for (const [id, value] of Object.entries(next)) {
    if (touched.includes(id) || JSON.stringify(value) !== JSON.stringify(session.selections[id])) session.overrides[id] = structuredClone(value);
  }
  session.selections = structuredClone(next);
}
export function chooseProfile(session: SetupSession, profile: string, components: Component[], states: Record<string, State>) {
  session.profile = profile;
  session.selections = { ...defaults(profile, components, states), ...structuredClone(session.overrides ?? {}) };
}
export function statusLabel(c: Component, s: State): string {
  if (s.status === 'migration') return `Migration required · owner: ${s.ownership === 'legacy-dotfiles' ? 'old dotfiles' : 'accepted root pi/'} (replacement blocked)`;
  if (s.status === 'conflict') return 'Ownership conflict · replacement blocked';
  if (s.status === 'unknown') return 'Unknown ownership/state · blocked';
  if (c.adapter === 'stow') return s.status === 'current' ? 'Config owned by setup' : s.status === 'partial' ? 'Config incomplete / activation needed' : 'Config missing';
  if (s.installedVersion) return `Installed ${s.installedVersion}${c.accepted ? ` · accepted ${c.accepted.replace('npm:@arhen/pi-core-todo@', '')}` : ' · unpinned declaration'}${s.status === 'update' ? ' · update needed' : s.status === 'partial' ? ' · reconciliation needed' : ''}`;
  return s.status === 'current' ? 'Installed · declaration satisfied' : s.status === 'missing' ? 'Not installed' : 'Partially installed';
}
export function actionLabel(c: Component, s: State, selection?: Selection): string {
  if (!selection || selection.action === 'keep') return 'no change';
  if (selection.action === 'remove') return 'guided removal';
  if (['migration', 'conflict', 'unknown'].includes(s.status)) return 'blocked — review required';
  if (s.status === 'current') return 'no-op';
  if (s.status === 'update') return 'update to accepted';
  return c.adapter === 'defaults' || s.status === 'partial' ? 'configure / reconcile' : 'install';
}
