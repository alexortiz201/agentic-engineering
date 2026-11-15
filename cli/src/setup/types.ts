export type Action = 'keep' | 'install' | 'remove';
export type Scope = 'configuration' | 'application' | 'review';
export type Status = 'missing' | 'current' | 'update' | 'partial' | 'migration' | 'conflict' | 'unknown';
export type Component = {
  id: string; name: string; owner: string; description: string; dependencies: string[];
  adapter: 'stow' | 'brew' | 'defaults' | 'todo' | 'manual' | 'composition';
  packageDir?: string; packageName?: string; brewKind?: 'formula' | 'cask';
  accepted?: string; manual?: string; configuration?: Record<string, unknown>;
  // Explicit project applicability. Absent = machine-only. A leaf links its canonical `source` directory tree
  // (repository-relative) into the target project at `target`; `requires` are advisory machine component IDs that
  // project apply never installs or checks. A composition lists only project-applicable members in `dependencies`.
  project?: { kind: 'leaf'; source: string; target: string; requires: string[] } | { kind: 'composition' };
};
export type State = {
  status: Status; available: boolean; installed: boolean | 'unknown'; enabled: boolean | 'unknown';
  loaded: 'unknown'; evidence: string[]; fingerprint: string;
  installedVersion?: string;
  ownership?: 'setup' | 'legacy-dotfiles' | 'accepted-pi' | 'unmanaged';
};
export type Selection = { action: Action; scope?: Scope; confirmed?: boolean; cleanup?: string[] };
// User decisions only. Detected State and reviewed Plan remain separate snapshots.
export interface SetupSession {
  profile: string;
  selections: Record<string, Selection>;
  // Only explicit edits override recommendations when navigating between profiles.
  overrides?: Record<string, Selection>;
}
export type Operation = {
  component: string; kind: 'install' | 'update' | 'configure' | 'remove' | 'noop' | 'skip' | 'conflict';
  reason: string; details: string[]; dependency: boolean; selection: Selection; before: State;
};
export type Plan = { operations: Operation[]; conflicts: string[] };
export type Result = { component: string; status: 'success' | 'failed' | 'skipped' | 'partial'; detail: string };
export type CommandResult = { code: number; stdout: string; stderr: string };
export type Runner = (command: string, args: string[], env?: Record<string, string>) => CommandResult;
export type Context = {
  root: string; home: string; platform: string; run: Runner; applications?: string;
  brew?: { formulae: any[]; casks: any[] }; brewError?: string;
};
