# What this backup refuses to carry

**A restore that silently omits something is worse than one that refuses and says what is missing.** Every item below is absent from `config/` on purpose. Each row names the thing, why it cannot be committed, and where the real value has to come from on a restore.

Captured 2026-09-16 against the live bench. If the live configuration gains a key, this table is the thing that goes stale first -- re-read `~/.claude/settings.json` against it before trusting the list.

## The excluded set

| Excluded | Why it cannot be published | Where the real value comes from on restore |
|---|---|---|
| **`autoMode.environment`** (2,750 chars, 26 entries) | The largest and most sensitive item by far. It enumerates the employer's protected branch names, the on-disk paths of environment and credential files, the internal package registry, protected IaC scopes, and the heuristic that classifies a target as production. Publishing it hands a reader a map of what is worth attacking and what is fenced off. | Re-run the harness's auto-mode environment setup against the employer repository, which is how this was generated. **Nothing reconstructs it from memory.** Until it is back, autonomous mode has no idea which branches and paths are dangerous -- see "What this costs" below. |
| **`autoMode.soft_deny`, second entry** | `Bash(git push:* -- <BRANCH>)`. The `$defaults` entry beside it is generic and is recorded in `settings.safe.json`'s shape; the second names a specific protected branch, which is employer topology. | Re-add as `Bash(git push:* -- <PROTECTED_BRANCH>)` with the real branch name. One line, trivially re-derived from the branch protection rules -- this is the cheapest item here. |
| **The plugin marketplace name and repo** | `extraKnownMarketplaces` keys on an employer-owned private GitHub repository. Both the org and the repo name are employer identifiers, and the repo is private, so the name is of no use to a reader who is not already inside. | Tokenised as `__MARKETPLACE_NAME__` / `__MARKETPLACE_REPO__` in `settings.safe.json`. Fill from the employer's plugin documentation. The `enabledPlugins` value (`sdlc@...`) is kept, since the plugin's own name is not the secret. |
| **`~/.claude/CLAUDE.md`** -- the real, filled global instruction file | It carries the employer name, the employer solution root, and the employer's stack-boot command in running prose, in three places that are not separable from the sentences around them. | Fill [`../templates/TEMPLATE_CLAUDE.md`](../templates/TEMPLATE_CLAUDE.md) -- it is that file with seven tokens punched out -- and move it to `~/.claude/CLAUDE.md` by hand. The harness refuses agent writes to that path, so this is a manual step regardless. |
| **The symlinked skills** (`aidd-*` except `aidd-typescript`, plus `find-skills`, `herdr`) | Not a disclosure problem -- a mechanical one. **A copied symlink is a dangling symlink**, and a dangling skill directory reads as *absent* rather than as an error, which is the failure mode this whole directory exists to avoid. They are also third-party content consumed read-only, which is not ours to redistribute. | Re-clone the upstream rule library and the agent-skill store, then re-create the links. The two locally-authored skills -- `aidd-typescript` and `ui-verify-manually` -- **are** committed here, because they exist in exactly one directory and that directory is not under version control. |
| **`~/.claude/settings.json` in full** | Contains every item above. | `settings.safe.json` is the publishable subset. Merging it is a manual step precisely so that the gap is noticed. |
| **Session state** -- `history.jsonl`, `sessions/`, `projects/`, `shell-snapshots/`, `paste-cache/`, `daemon*`, `hooks/state/` | Transcripts and caches of real work: employer code, customer names, ticket contents, credentials pasted in passing. Also worthless on a new machine. | Nothing to restore. `restore.sh` creates an empty `hooks/state/` so the debounce has somewhere to write. |
| **`~/.claude.json` and `backups/`** | Account identity, MCP server registrations and OAuth material. | Re-authenticate. Never back this up to anywhere public. |

## What this costs, stated plainly

**The bench restored from this repository alone is functionally complete and is not safety-equivalent.** The hooks fire, the rules inject, the shortcuts resolve, the skills load. What is gone is the policy that tells autonomous mode which branches, paths and infrastructure scopes are the dangerous ones -- and its absence is silent. Autonomous mode does not announce that it is operating without an environment definition; it simply treats an employer-protected branch the way it treats any other.

**So the ordering matters.** Restore `autoMode.environment` before running anything unattended, not after noticing that something unattended went somewhere it should not have.

## The one thing worth doing about this

`autoMode.environment` needs a home that is neither this public repository nor only the live `~/.claude/`. A **private** repository whose only job is to survive is the right shape -- the same upgrade path `~/.claude/CONFIG_SETUP.md` already recommends for the whole config cluster. Until it exists, the only copies are the live file and `~/.claude/settings.json.bak.*`, both on one disk.
