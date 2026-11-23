# NAS access: LAN, Tailscale, SSH and SMB

This is configuration documentation, not authorization to change the NAS, network or credentials. See [home lab](HOME-LAB.md), [Rex recovery](REX-RECOVERY.md) and [ownership/retirement](LEGACY-RETIREMENT.md).

## Current configuration — November 23, 2026

The operator confirmed the tailnet rename in the Tailscale Admin Console on
November 23, 2026. All other entries below are current **operator-reported
configuration**, not independently tested in this documentation task. No credentials
or authentication keys are included.

| Item | Current configuration / status |
|---|---|
| Device | UGREEN NASync DXP4800 Plus |
| UGOS hostname / LAN IP | `nas` / `192.168.10.152` |
| LAN management | `http://nas.local:9999` (LAN/mDNS); direct-IP equivalent `http://192.168.10.152:9999` |
| Tailscale device name / IPv4 | `nas` / `100.94.64.37` |
| Current tailnet DNS suffix | `tarsier-atlas.ts.net` |
| Expected NAS HTTPS endpoint | `https://nas.tarsier-atlas.ts.net` — **unverified** |
| NAS Tailscale runtime | Docker Compose project `tailscale`, host networking, persistent state |
| Tailscale Serve | HTTPS port 443 → `http://127.0.0.1:9999` |
| SSH | `ssh nas`, administrator account `Alexander Ortiz`, SSH key authentication; operator-reported working configuration, not retested here |
| SMB shares | `Family Shared`, `personal_folder`; existing authentication and permissions remain unchanged |

### LAN versus Tailscale access

- On the home LAN, use the LAN management URL above. It is HTTP, not HTTPS;
  restrict its use to the trusted network. `nas.local` is an mDNS name and must not
  be assumed to resolve over Tailscale.
- Over Tailscale, use the new HTTPS FQDN **only after verification**. Serve terminates
  client HTTPS on port 443 and forwards to UGOS over loopback HTTP on port 9999.
  Host networking makes that loopback the NAS host's loopback. Persistent Tailscale
  state preserves enrollment; never commit/copy it into setup source.
- `ssh nas` is a per-machine OpenSSH alias, not automatically Tailscale SSH.
  Its destination comes from private `~/.ssh/config.local`; it may still select LAN
  access. `ssh -G nas` checks effective options, not authentication or reachability.
  Verify per-client DNS/routing, permissions and the existing host key before any
  separately approved endpoint change. Quote `User "Alexander Ortiz"` in private
  SSH configuration because the account contains a space. Do not copy private keys.
- Finder LAN examples: `smb://nas.local/Family%20Shared` and
  `smb://nas.local/personal_folder`. Tailscale candidates are
  `smb://100.94.64.37/Family%20Shared` and
  `smb://100.94.64.37/personal_folder`, subject to routing, NAS service binding,
  tailnet policy, NAS firewall and share permissions. `%20` encodes the space.
  These examples are **not connection-test results**. HTTPS Serve does not proxy
  SMB (normally TCP 445) or SSH (normally TCP 22); do not expose them publicly or
  broaden policies to make these examples work.
- Mini and Air each use Tailscale; Rex additionally integrates Tailscale for
  cross-machine terminal workflows. Rex nodes/endpoints are separate from the NAS
  endpoint and can be separate from each Mac's OS Tailscale node. Preserve existing
  sessions and obtain each actual Rex URL rather than guessing names from the NAS.
  Air's setup/runtime resources remain physically local for offline use.

## Tailnet rename and HTTPS verification

**Historical only:** previous tailnet `tailbe49f8.ts.net`, previous NAS URL
`https://nas.tailbe49f8.ts.net`. These are retained to explain the migration, not
as current connection targets. Current suffix: `tarsier-atlas.ts.net`.

Renaming changes the HTTPS hostname. A certificate for the old name does not
validate the new one: HTTPS certificates must be reissued for the new FQDN and
Serve's advertised endpoint must be verified. Do not assume immediate issuance,
that an old certificate covers both names, or that the old URL redirects.
Reissuance/readiness for this NAS is **not yet established**. This task changed
no live Tailscale/Serve configuration and performed no NAS endpoint tests.

Operator verification checklist, before replacing saved client URLs:

1. Confirm the NAS remains the intended device in the renamed tailnet, with its
   expected address and persistent state. Inspect its current Tailscale/Serve
   status in the existing Compose project; do not recreate state or guess a
   container/service name from the project name.
2. Confirm `nas.tarsier-atlas.ts.net` resolves to the intended NAS from a permitted
   tailnet client. Verify the HTTPS certificate has that exact hostname and is
   trusted/current; allow supported certificate reissuance without bypassing TLS.
3. Verify Serve still maps HTTPS 443 to `http://127.0.0.1:9999` and that UGOS is
   reachable through the new URL. A login page or redirect must remain on an
   expected origin; do not disclose credentials in test logs. For an initial
   certificate/HTTP check a user can run `curl -I https://nas.tarsier-atlas.ts.net`
   without `-k`; this alone does not prove full UI/login functionality.
4. Verify from Mini and Air separately, including a permitted off-LAN tailnet
   connection. Confirm SSH trust/key login and SMB access separately where needed;
   passing HTTPS does not prove either. Record date, client and outcome without
   publishing session tokens, certificates' private keys or credentials.
5. Keep independently verified recovery access. Any required Serve, enrollment,
   SSH or Docker repair is a separate approved operation, not part of this doc update.

## Manual client follow-ups

- **Observed on the Mini:** three old-suffix references remain in private
  `~/.ssh/config.local`. A saved Rex host **label** also contains the old suffix;
  that label alone does not establish whether its connection endpoint is stale.
  No record was changed and no private host/account mappings were copied here.
- **Rex, both Macs:** inspect actual remote HTTPS URLs/certificate readiness,
  app Remote Hosts/bookmarks and CLI host records separately; validate identity
  and bidirectional access before separately approved edits. Do not restart or
  delete sessions to change a saved address. See [Rex recovery](REX-RECOVERY.md#tailnet-rename-follow-up).
- **LastPass:** manually review saved NAS/Rex URL fields and matching rules for the
  old suffix. No vault entries/passwords were opened, exported or modified.
- **Other clients:** review browser bookmarks/password-manager URLs, Finder
  favorites/login mounts, saved SMB server names, Shortcuts, launch items and
  scripts outside this repository. Review Air-local records separately. Not all
  of these use the tailnet FQDN; keep LAN names and Tailscale IPv4 references when
  still appropriate. Search results here do not establish a complete client inventory.

See the [documentation update report](TAILNET-RENAME-REPORT.md) for search scope,
completion status and remaining verification.

## Historical SSH integration evidence

The following sections preserve earlier failed-login observations and the later
ownership handoff. They do not contradict the operator's newer report of key
login; this task has not independently confirmed that report.

## Canonical versus live ownership

Agentic Engineering is the single authored setup authority. Its portable SSH template, `computer/ssh/.ssh/config`, includes `~/.ssh/config.local` before global defaults. Personal network aliases/accounts belong in that private local include after an approved handoff; do not copy private endpoint data into public source.

**Update, November 23:** Mini and Air SSH now point to their respective local canonical `setup/computer/ssh/.ssh/config`, with private 0600 `~/.ssh/config.local` host entries. Mini's NAS options are preserved exactly; Air's pre-existing host behavior is also preserved (no new Air NAS alias was introduced). Seven effective alias dumps, private include resolution, native Stow rehearsal and live rollback/reapply passed separately on each host through independent Rex recovery access. See [handoff evidence](LEGACY-RETIREMENT.md). No NAS-side changes or successful NAS authentication are claimed. The earlier integration evidence below describes the before-state, not current ownership.

Why legacy was used: the earlier task explicitly named that repository, and live symlink inspection confirmed it owned Mini SSH. The implementation followed the live owner, but mistakenly treated that as permission to author new authoritative documentation there. Live deployment ownership does not supersede canonical authoring authority.

## Existing behavior and checks

The Mini alias uses LAN hostname resolution, a quoted administrator name containing a space, port 22, and a 30-second keepalive. It precedes `Host *` because OpenSSH uses the first obtained value. Shared Ed25519 identity, Keychain/agent integration, multiplexing and existing host entries were preserved. The expanded control-socket path contains the username's space; parsing passed, live multiplex operation remains unverified.

Evidence from the integration and reconciliation:
- `ssh -G nas` resolves the intended private hostname/account, port and keepalive on Mini.
- An offline OpenSSH regression test in legacy `.no-stow/tests/ssh-config.test.js` checks that mini, air, GitHub, phone and server effective options are unchanged. This new test is retained alongside the unchanged live config as compatibility evidence, not a new setup authoring route.
- At initial integration, `realpath ~/.ssh/config` confirmed Mini consumed legacy source; the November 23 handoff above supersedes that ownership observation.
- An existing public Ed25519 identity matches the loaded agent identity; private key contents were not read or copied.
- Existing trusted host-key entries for the NAS's hostname and reserved address matched. Trust was not added/bypassed; independent console verification was not performed.
- Direct and alias `BatchMode=yes` probes returned `Permission denied (publickey,password)`. No password guesses, key installation or settings changes were made. Remote identity/shell are **not verified**.
- Air was reachable for read-only inspection; its current `ssh -G nas` still resolves the bare alias/local Mac account, not the new destination.

The server emitted a non-post-quantum key-exchange warning in the earlier direct probe; algorithms were not changed. Exact addresses, account names, fingerprint material and original detailed output remain private.

## Earlier authentication blocker (historical)

The reported administrator shell is bash; the separate regular NAS account must remain non-administrative. Do not disable password authentication or promote accounts to make access work.

The existing public key is the first candidate to evaluate, not a reason to generate another key. A user can test interactive password authentication privately. Installing a key requires separate approval, inspection of actual account home/permissions and supported exact-version UGOS guidance. `authorized_keys` persistence across firmware updates is **unknown**; do not rely on it as the sole recovery route. No NAS login or authentication changes are authorized by the documentation reconciliation.

## Recovery and future Tailscale

The SSH-only handoffs are now complete; the following constraints remain applicable to future computers and other configuration handoffs. Use current canonical owners, not the retired per-host legacy SSH leaf. Private rollback receipts retain the old literals and hashes without publishing account data.

An approved SSH-only migration must privately preserve existing host entries, prepare the documented local include, preflight exact link ownership, preserve rollback material and validate both existing aliases and NAS behavior. Do not run whole-home legacy Air deployment simply for this alias: it includes protected historical Pi consumers. Do not edit a verified Air release in place or clone Mini private keys.

New computers should use canonical setup plus private host inventory, not legacy bootstrap. For existing hosts, [migration gates](MIGRATION.md) still apply. Unknown or unmanaged files must not be adopted/overwritten.

NAS Tailscale enrollment is now operator-reported current configuration; the earlier future-enrollment plan is superseded. Keep the alias stable. Any private destination change still needs separate approval and DNS/policy/host-key verification. Documentation of the new expected HTTPS hostname does not authorize any live access-policy change.

Historically, alias rollback meant removing only its new block from then-live legacy source. That is **not** a current recovery instruction: canonical SSH plus private includes now own the live configuration. Use the verified per-host handoff receipts for an approved rollback; **none is performed here**. Original detailed reports and their associated README content have been preserved privately before removing redundant legacy documentation.
