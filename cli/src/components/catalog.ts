import fs from 'node:fs';
import path from 'node:path';
import type { Component } from '../setup/types.ts';

export const configurationPairs: Record<string, string> = {
  'brew-ghostty': 'config-ghostty', 'brew-herdr': 'config-herdr', 'brew-git': 'config-git', 'brew-gh': 'config-gh',
};
export function catalog(root: string): Component[] {
  const pi = JSON.parse(fs.readFileSync(path.join(root, 'harness/pi/accepted.json'), 'utf8'));
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'harness/pi/settings.example.json'), 'utf8'));
  const { packages, theme, skills, extensions, prompts, ...defaultKeys } = seed;
  const result: Component[] = [];
  for (const [id, name, description] of [
    ['git', 'Git configuration', 'Portable defaults; private identity in ~/.gitconfig.local'],
    ['gh', 'GitHub CLI configuration', 'No credentials or hosts copied'],
    ['ghostty', 'Ghostty configuration', 'Includes Purple Dreams terminal palette'],
    ['herdr', 'Herdr configuration', 'Independent terminal configuration, not reporter/state'],
    ['ssh', 'SSH defaults', 'Private hosts in ~/.ssh/config.local; no keys'],
    ['zsh', 'Shell configuration', 'Requires an existing Oh My Zsh installation'],
  ]) {
    result.push({ id: `config-${id}`, name, description, owner: 'setup/computer', adapter: 'stow',
      dependencies: ['brew-stow', ...(id === 'zsh' ? ['oh-my-zsh'] : [])],
      packageDir: 'setup/computer', packageName: id });
  }
  for (const [id, name] of [
    ['pi-instructions', 'Pi instructions'], ['pi-theme', 'Purple Dreams (Pi)'],
    ['workbench-skill', 'Workbench Skill'], ['study-skill', 'Agentic Engineering Study Skill'],
    ['composer', 'Composer highlighting'],
  ]) result.push({ id, name, description: 'Independent Pi discovery leaf; does not load other capabilities',
    owner: 'harness/pi (staged)', adapter: 'stow', dependencies: ['pi', 'brew-stow'],
    ...(id === 'pi-theme' ? { configuration: { theme: 'purple-dreams' } } : {}),
    packageDir: 'harness/pi/packages', packageName: id });
  result.push(
    { id: 'homebrew', name: 'Homebrew', owner: 'official Homebrew installer', adapter: 'manual', dependencies: [],
      description: 'Existing package manager is reused; no privileged automatic bootstrap',
      manual: 'Install Homebrew using https://brew.sh after reviewing administrator/organization policy, then rerun setup. Homebrew self-install/removal is not automated.' },
    { id: 'pi', name: 'Pi runtime', owner: 'official managed installer', adapter: 'manual',
      description: `Accepted managed Pi ${pi.runtime}; existing installation reused`, accepted: pi.runtime, dependencies: [],
      manual: 'Install/upgrade/remove Pi only through a separately reviewed exact-version official installer. No runtime mutation implemented.' },
    { id: 'pi-defaults', name: 'Pi configuration defaults', owner: 'local settings', adapter: 'defaults',
      description: 'Selected portable keys only; excludes theme, discovery paths and package declarations', dependencies: ['pi'], configuration: defaultKeys },
    { id: 'todos', name: 'Todos', owner: 'native Pi package manager', adapter: 'todo',
      description: 'Exact accepted native package; preserves unrelated declarations and caches', dependencies: ['pi'], accepted: pi.todo },
    { id: 'pi-reporter', name: 'Herdr Pi reporter', owner: 'Herdr generated local integration', adapter: 'manual',
      description: 'No source copy; existing reporter left intact', dependencies: ['pi', 'brew-herdr'],
      manual: 'Review herdr integration status and local reporter ownership; approved herdr integration install pi is manual. Removal unsupported.' },
    { id: 'foundations', name: 'Foundations reference', owner: 'workbench/foundations', adapter: 'stow',
      description: 'Optional local reference link at ~/.local/share/ae/foundations; never a Pi discovery path or full Workbench install',
      dependencies: ['brew-stow'], packageDir: 'setup/resources', packageName: 'foundations' },
    { id: 'oh-my-zsh', name: 'Oh My Zsh', owner: 'upstream local checkout', adapter: 'manual',
      description: 'Existing shell framework; setup never resets or cleans it', dependencies: [],
      manual: 'Review and install Oh My Zsh using its official instructions before selecting shell configuration.' },
    { id: 'claude-code', name: 'Claude Code', owner: 'official Homebrew cask (brew-claude-code)', adapter: 'manual',
      description: 'Claude Code CLI; authentication, sessions, project configurations and global settings are independent and never read or modified',
      dependencies: [],
      manual: 'Install or remove Claude Code via its Homebrew cask (select brew-claude-code). Setup only detects the CLI version; it performs no authentication, model routing, subscription changes, project configuration or session management.' },
  );
  // Existing manifests remain the only package declarations. No brew bundle/cleanup.
  const seen = new Set<string>();
  for (const file of ['Brewfile.shared', 'Brewfile.mini', 'Brewfile.air']) {
    const text = fs.readFileSync(path.join(root, 'setup/computer/manifests/brew', file), 'utf8');
    for (const match of text.matchAll(/^(brew|cask) "([\w@+./-]+)"/gm)) {
      const [, kind, pkg] = match;
      const id = `brew-${pkg.replaceAll('/', '-')}`;
      if (seen.has(id)) continue;
      seen.add(id);
      result.push({ id, name: pkg, owner: 'Homebrew', adapter: 'brew', dependencies: ['homebrew'],
        brewKind: kind === 'brew' ? 'formula' : 'cask', packageName: pkg,
        description: `${kind} declaration from ${file}; unpinned; explicit fresh install only, no automatic upgrades` });
    }
  }
  return result;
}
