# NAS SSH: informational integration status

This is documentation of an existing local alias, not authorization for further NAS integration. See [home lab](HOME-LAB.md) and [ownership/retirement](LEGACY-RETIREMENT.md).

## Canonical versus live ownership

Agentic Engineering is the single authored setup authority. Its portable SSH template, `computer/ssh/.ssh/config`, includes `~/.ssh/config.local` before global defaults. Personal network aliases/accounts belong in that private local include after an approved handoff; do not copy private endpoint data into public source.

The Mini has **not** completed that handoff. Its active `~/.ssh/config` still points into the legacy repository. The working NAS block there is preserved unchanged. Air SSH points into a local versioned legacy release; it does not yet contain the new NAS alias. No NAS-side changes were performed.

Why legacy was used: the earlier task explicitly named that repository, and live symlink inspection confirmed it owned Mini SSH. The implementation followed the live owner, but mistakenly treated that as permission to author new authoritative documentation there. Live deployment ownership does not supersede canonical authoring authority.

## Existing behavior and checks

The Mini alias uses LAN hostname resolution, a quoted administrator name containing a space, port 22, and a 30-second keepalive. It precedes `Host *` because OpenSSH uses the first obtained value. Shared Ed25519 identity, Keychain/agent integration, multiplexing and existing host entries were preserved. The expanded control-socket path contains the username's space; parsing passed, live multiplex operation remains unverified.

Evidence from the integration and reconciliation:
- `ssh -G nas` resolves the intended private hostname/account, port and keepalive on Mini.
- An offline OpenSSH regression test in legacy `.no-stow/tests/ssh-config.test.js` checks that mini, air, GitHub, phone and server effective options are unchanged. This new test is retained alongside the unchanged live config as compatibility evidence, not a new setup authoring route.
- `realpath ~/.ssh/config` confirms Mini still consumes legacy source.
- An existing public Ed25519 identity matches the loaded agent identity; private key contents were not read or copied.
- Existing trusted host-key entries for the NAS's hostname and reserved address matched. Trust was not added/bypassed; independent console verification was not performed.
- Direct and alias `BatchMode=yes` probes returned `Permission denied (publickey,password)`. No password guesses, key installation or settings changes were made. Remote identity/shell are **not verified**.
- Air was reachable for read-only inspection; its current `ssh -G nas` still resolves the bare alias/local Mac account, not the new destination.

The server emitted a non-post-quantum key-exchange warning in the earlier direct probe; algorithms were not changed. Exact addresses, account names, fingerprint material and original detailed output remain private.

## Authentication remains blocked

The reported administrator shell is bash; the separate regular NAS account must remain non-administrative. Do not disable password authentication or promote accounts to make access work.

The existing public key is the first candidate to evaluate, not a reason to generate another key. A user can test interactive password authentication privately. Installing a key requires separate approval, inspection of actual account home/permissions and supported exact-version UGOS guidance. `authorized_keys` persistence across firmware updates is **unknown**; do not rely on it as the sole recovery route. No NAS login or authentication changes are authorized by the documentation reconciliation.

## Future handoff, recovery, and Tailscale

An approved SSH-only migration must privately preserve existing host entries, prepare the documented local include, preflight exact link ownership, preserve rollback material and validate both existing aliases and NAS behavior. Do not run whole-home legacy Air deployment simply for this alias: it includes protected historical Pi consumers. Do not edit a verified Air release in place or clone Mini private keys.

New computers should use canonical setup plus private host inventory, not legacy bootstrap. For existing hosts, [migration gates](MIGRATION.md) still apply. Unknown or unmanaged files must not be adopted/overwritten.

Keep the alias stable for future NAS Tailscale enrollment. After separate approval and DNS/ACL/host-key verification, change only the privately configured hostname. No guessed Tailscale endpoint, new management framework, or remote access policy is added here.

Rollback of the earlier alias would remove only its new block from the live legacy source, but **no rollback is performed here**: preserving current Mini SSH behavior is a requirement. Original detailed reports and their associated README content have been preserved privately before removing redundant legacy documentation.
