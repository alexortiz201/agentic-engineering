# NAS SSH access and recovery

This is the public-safe operating guide. Keep the actual NAS account, model and
hostname, LAN and tailnet addresses, trust records, HTTPS endpoint, and recovery
receipts in the operator's private inventory. The repository ships portable SSH
configuration, not per-host aliases, credentials, or appliance state.

## Current configuration — November 23, 2026

Both Macs independently passed fresh, strict, passwordless SSH over the `nas`
(tailnet) and `nas-lan` (LAN) aliases. Each alias is machine-local, typically in
`~/.ssh/config.local` when using the canonical include. The Mini and Air may
use different address forms for LAN; confirm each alias on its own host rather
than copying configuration. The operator installed only the Mini's public key
and preserved the existing Air authorization. Earlier access denials are
historical; see [the diagnosis and resolution](NAS-SSH-DIAGNOSIS-REPORT.md).

## Tailnet rename and HTTPS verification

A tailnet rename was confirmed. SSH and NAS HTTPS/Serve are independent:
successful SSH does not confirm an HTTPS endpoint or certificate. Obtain the
current DNS suffix and expected Serve configuration from the operator's
private inventory. In an approved maintenance window, verify the correct
private node, DNS result, Serve listener and certificate name before updating
any saved client URLs. Do not disable TLS checks, publish an endpoint or infer
readiness from a Tailscale ping. Rex HTTPS is a separate application endpoint;
see [Rex recovery](REX-RECOVERY.md).

## Manual client follow-ups

1. Inspect `ssh -G nas` and `ssh -G nas-lan` locally; do not paste the full
   output or private endpoint/account values into tickets. Check that each
   effective alias still uses its intended endpoint and identity.
2. If separately authorized, verify each route from each intended client with
   a fresh connection and a benign remote identity check. Use `BatchMode=yes`,
   `StrictHostKeyChecking=yes`, `ControlMaster=no`, and `ControlPath=none`.
   Check the returned account and host against the private inventory; report
   only pass/fail. Reused SSH control connections are not acceptance evidence.
3. For a new or mismatched host key, independently attest the presented
   fingerprint against the NAS console or another already trusted channel.
   Never use an unverified `ssh-keyscan` result or disable strict checking.
   For default port 22, OpenSSH uses the unbracketed address in `known_hosts`;
   the `[address]:port` form is for an explicit non-default lookup. Preserve
   existing entries and back up the exact local file before an approved edit.
4. If host verification succeeds but authentication fails, check the local alias
   and offered public identity privately. The operator may then review the
   correct remote account and its authorized public keys. Never transfer SSH
   private keys or overwrite another client's authorization.

## Canonical versus live ownership

The [ownership map](OWNERSHIP.md) distinguishes the portable SSH include from
live host-specific configuration. Render imports on each host, preserving
local alias precedence and host trust. Exact rollback is local: compare the
current state with the approved receipt, revert only the matching alias/trust
change and retain subsequent edits. Do not move legacy recovery material under
this checklist; see [retirement gates](LEGACY-RETIREMENT.md).
