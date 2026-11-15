// Project capability installation. Definitions and dependencies live only in components/catalog.ts.
export type Resolution = {
  selected: string[];        // explicit request, sorted/deduplicated
  order: string[];           // every reachable project capability, dependencies first (deterministic)
  leaves: string[];          // leaf capabilities in `order`
  requires: string[];        // advisory machine component IDs; never installed or checked by project apply
};
// One linked file of a leaf: `source` is repository-relative, `relative` is project-relative.
export type Entry = { relative: string; source: string; sha256: string };
export type Receipt = {
  schema: 1; source: string;                       // realpath of the canonical checkout the links point into
  selected: string[]; leaves: Record<string, Entry[]>; integrity: string;
};
export type EntryState = 'missing' | 'owned' | 'foreign' | 'unsafe';
export type Observation = {
  id: string; entries: (Entry & { state: EntryState; detail: string })[]; missingDirs: string[];
};
export type Operation = { kind: 'mkdir' | 'link' | 'record' | 'noop' | 'conflict'; capability?: string; path: string; reason: string; source?: string };
export type ProjectPlan = {
  target: string; source: string; selected: string[]; order: string[]; requirements: string[];
  operations: Operation[]; conflicts: string[]; receipt: { path: string; before: string | null; after: string };
  fingerprint: string; nextReceipt: string;
};
export type LeafStatus = 'current' | 'update' | 'unrecorded' | 'partial' | 'missing' | 'conflict';
export type Verification = {
  ok: boolean; target: string; selected: string[];
  capabilities: { id: string; kind: 'leaf' | 'composition'; status: LeafStatus; evidence: string[] }[];
};
export type ProjectContext = { root: string; target: string };
export const RECEIPT_PATH = '.ae/project-capabilities.json';
