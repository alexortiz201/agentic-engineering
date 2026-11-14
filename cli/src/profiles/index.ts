import type { Component, Selection, State } from '../setup/types.ts';
export const profiles = [
  { id: 'mac-workstation', label: 'mac-workstation', hint: 'Development workstation; optional heavy/server tools stay unselected',
    recommendations: ['brew-git', 'brew-stow', 'brew-n', 'brew-pnpm', 'brew-ripgrep', 'brew-ghostty', 'brew-herdr', 'config-git', 'config-ghostty', 'pi', 'pi-theme', 'todos', 'workbench-skill'] },
  { id: 'mac-laptop', label: 'mac-laptop', hint: 'Mobile essentials; no servers, model downloads, VPNs or background services',
    recommendations: ['brew-git', 'brew-stow', 'brew-n', 'brew-ripgrep', 'brew-ghostty', 'config-git', 'config-ghostty', 'pi', 'pi-theme', 'todos'] },
  { id: 'custom', label: 'custom', hint: 'Start with no requested changes', recommendations: [] },
];
export function defaults(profile: string, components: Component[], _states: Record<string, State>): Record<string, Selection> {
  const recommended = profiles.find(p => p.id === profile)?.recommendations ?? [];
  // Recommendations are visible choices, never effects. Current selections plan as no-ops;
  // conflicts/migrations still block, and all mutations require reviewed approval.
  return Object.fromEntries(components.map(c => [c.id, {
    action: recommended.includes(c.id) ? 'install' : 'keep',
  }]));
}
