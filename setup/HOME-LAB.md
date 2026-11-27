# Home-lab reference and onboarding

This is the canonical, public-safe reference for computers joining the operator's home lab. It is informational, not an installer or authorization to change infrastructure. Read it when working on the lab, not automatically for every agent session.

See [setup](../SETUP.md), [ownership](OWNERSHIP.md), [NAS access status](NAS-SSH.md), [retirement status](LEGACY-RETIREMENT.md), and [Rex recovery](REX-RECOVERY.md).

## Evidence and private inventory

Observations below date from November 2026. Reinspect before acting. Keep actual addresses, accounts, hardware identifiers, trust, access-control settings, credentials, and original detailed reports in approved private records. See [current NAS access](NAS-SSH.md#current-configuration--november-23-2026) for separately verified SSH status.

The original detailed home-lab and NAS reports were preserved byte-for-byte in a private local recovery directory before reconciliation. That local preservation is not an offsite backup or a complete dotfiles repository snapshot. Ask the operator for its location/access if needed.

## Equipment and responsibilities

| Resource | Role and capabilities | Evidence / limits |
|---|---|---|
| Mac mini | Primary development and agent host | Verify local interface and link speed before storage changes |
| MacBook Air | Interactive/mobile client and local execution host | Remote visibility is not offline runtime ownership |
| NAS | Centralized storage and separately managed SSH and HTTPS | [SSH verified](NAS-SSH-DIAGNOSIS-REPORT.md); HTTPS and SMB need independent checks |
| Local attached storage | Active development and a backup destination | Check backing device, mount semantics and recovery independently |
| Network and backup services | Separate infrastructure owners and recovery boundaries | Keep detailed equipment, routes and recovery policy private |

Do not infer Docker/Ollama availability from installed binaries or empty directories. No default Docker daemon socket was available in the original discovery; Ollama's directly inspected model blobs directory was empty. Running capabilities must be revalidated.

## Topology and access

```text
Home Ethernet switch (reported 1GbE ports)
  +-- Mini (observed 1GbE link) -- USB APFS DevDrive + PortableDrive
  |     +-- SMB exports to Air
  |     +-- network-backup destination for StartOS
  +-- NAS (negotiated speed/pool not inspected)

Air Rex client <-- Tailscale --> Mini Rex server
Mini Rex client <-- Tailscale --> Air Rex server
Air's physical access medium/uplink: not established
```

Routing, reservations and access controls belong in private inventory. A LAN mDNS name need not resolve remotely. Tailscale OS peers and Rex endpoints are separate. The operator confirmed the tailnet rename; the NAS HTTPS endpoint and certificate remain unverified. See the [NAS rename checklist](NAS-SSH.md#tailnet-rename-and-https-verification).

SSH uses existing aliases and per-machine keys. Canonical portable defaults are in `computer/ssh/.ssh/config`; personal host entries belong in **local** `~/.ssh/config.local`. Both Macs' SSH ownership handoffs are verified; other resources remain transitional (see the retirement report). Do not put private hosts into the portable template or automatically overwrite an existing file. Validate hostname, quoted username, port and effective options with `ssh -G` before connecting. Host-specific options must precede wildcard defaults because OpenSSH uses the first obtained value.

## Execution and storage boundaries

Pi, Claude, Rex and Herdr may execute on either Mac. Execution belongs to the terminal server host, not the viewing app. Mini-hosted terminals can survive Air client disconnection; that does not prove application checkpointing or automatic failover. Session labels do not establish a sole orchestration authority.

The active Mini source lives on attached storage. Home navigation, shell/Git/terminal config and selected historical resources include external links. Dependencies, build outputs, Git worktrees and live process CWDs exist there: it is not passive storage. Sessions, sockets and most caches are per-host internal state. Shared trees need coordinated nonoverlapping edits and one Git writer; separate offline Air resources must stay local.

Existing navigation checks backing filesystem/server identity, not just the mount name. A NAS mount with the same name will not automatically preserve those assumptions. Before relocation, inspect symlinks, saved CWDs, app databases, permissions, metadata, case behavior and watcher semantics on both Macs. Do not move Unix sockets, live VM disks or runtime databases onto unvalidated SMB.

The durable-storage recommendation is NAS-native copies for validated passive/shared data, with active data placement justified by semantics and measurements. Do not assume UGOS supports APFS USB read/write. Keep originals until copy verification and recovery acceptance. Current USB-2 DevDrive versus 1GbE NAS does not establish a blanket local-storage performance advantage.

Pi fullscreen copies can be forwarded with `PI_CLIPBOARD_OSC52=1` on the execution host. The canonical shell package already provides `computer/zsh/.zshenv`; this is event-based forwarding, not clipboard synchronization. New shells load it; an existing shell may need an explicit export before relaunch. Native Rex Shift-drag selection is a separate fallback. Test both directions with harmless text and trusted clients; never expose clipboard secrets.

## Backups and recovery

The prior audit observed a configured StartOS network backup destination. That is not proof of freshness, payload integrity or recoverability. Keep exact destinations and recovery-key custody private.

This backup path depends on Mini + DevDrive + LAN. NAS-native backup storage could remove Mini from that chain, but requires an approved supported destination change, preserved original set, fresh backup and controlled restore test. Never casually copy an actively changing application backup set or assume copying it updates the server's saved destination.

Do not infer backup coverage from an available destination. RAID and snapshots are not independent backups. Verify offline/offsite copies and recovery keys separately. Review effective share authorization privately; application libraries and databases need explicit network-storage support checks.

## Onboard or recover a computer

1. Obtain a reviewed canonical checkout and inspect local configuration ownership before applying anything. Recover private credentials/inventory separately, never through Git.
2. Verify actual LAN/DNS/reservations/routes, link negotiation and host trust. Do not invent VLAN/firewall/pool settings or bypass changed SSH keys.
3. Follow [SETUP.md](../SETUP.md) and its per-host handoff gates. Preserve personal override files, occupied destinations, Air offline resources and recovery copies. Legacy release tooling is for existing migration/recovery consumers, not a second setup authoring path.
4. Provision public portable defaults and privately reviewed host aliases through their documented owners. Validate `ssh -G` for intended hosts. Authenticate separately on each computer; no private-key cloning or account promotion.
5. Verify source/backing and permissions before restoring mounts/share paths. Keep sensitive live state local and restore only approved datasets.
6. Test terminal reconnect, both clipboard directions, and backup/restore. Record observed results; this checklist is not runtime acceptance evidence.

Bounded read-only discovery tools include `networksetup`, `ifconfig`, `route -n get default`, `diskutil list`, `diskutil apfs list`, `mount`, `sharing -l`, `smbutil statshares -a`, and `tailscale status`. Keep raw identifying output private. No port scan or write benchmark is needed for inventory.

## Unfinished work

- NAS SSH authentication passed independently on both Macs. Recheck key persistence after a future firmware change rather than reinstalling keys based on historical failed probes.
- Verify new-name HTTPS certificate issuance, MagicDNS, Serve backend and NAS SMB access after the tailnet rename; review [manual client follow-ups](NAS-SSH.md#manual-client-follow-ups).
- Actual NAS pool/filesystem, health/capacity, SMB capabilities, snapshots, APFS USB support, backup and UPS policy.
- Switch/controller management owner and privately stored recovery export; DHCP/DNS/firewall source of truth.
- StartOS service inventory, backup freshness/schedule and restore test.
- Air mounts/runtime ownership review; SSH ownership is already handed off, but endpoint changes still require separate review.
- Controlled local APFS versus NAS SMB performance/semantics tests before active-storage migration.
- Complete the explicit legacy-consumer retirement gates before archiving dotfiles.

NAS Tailscale enrollment is operator-reported current configuration, not future work. Retain stable local aliases; any private HostName update still requires ACL/DNS validation and host-key continuity checks. The tailnet rename does not itself authorize SSH, Rex or NAS changes. No new configuration layer is necessary.
