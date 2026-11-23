# Home-lab reference and onboarding

This is the canonical, public-safe reference for computers joining the operator's home lab. It is informational, not an installer or authorization to change infrastructure. Read it when working on the lab, not automatically for every agent session.

See [setup](../SETUP.md), [ownership](OWNERSHIP.md), [NAS access status](NAS-SSH.md), [retirement status](LEGACY-RETIREMENT.md), and [Rex recovery](REX-RECOVERY.md).

## Evidence and private inventory

Observations below come from November 2026 discovery; equipment facts supplied by the operator are labeled reported. Reinspect before acting. The operator-supplied nonsecret NAS addresses, administrator name and tailnet rename are now documented explicitly in [NAS access](NAS-SSH.md#current-configuration--november-23-2026). These are reported configuration, not fresh connectivity-test results. SSH fingerprints, private configuration, credentials, enrollment keys, reservation maps and original detailed reports remain outside public Git; keep them in approved private records/backups.

The original detailed home-lab and NAS reports were preserved byte-for-byte in a private local recovery directory before reconciliation. That local preservation is not an offsite backup or a complete dotfiles repository snapshot. Ask the operator for its location/access if needed.

## Equipment and responsibilities

| Resource | Role and capabilities | Evidence / limits |
|---|---|---|
| Mac mini | Primary always-on development/agent host; M4, 10 CPU cores, 24 GB RAM, nominal 256 GB internal SSD; 10GbE-capable controller | Observed; Ethernet negotiated 1GbE during audit |
| MacBook Air | Interactive/mobile development; can execute local agents or view Mini-hosted terminals | Rex connectivity observed; exact hardware/storage not inventoried |
| UGREEN NASync DXP4800 Plus | Centralized storage, SMB shares, UGOS management; Tailscale in persistent host-networked Compose project | Operator-reported current configuration November 23; earlier discovery did not authenticate. Current SSH/HTTPS/SMB acceptance still needs independent verification; see [access details](NAS-SSH.md). |
| NAS disk | 8 TB WD Red Plus | Reported; actual pool, health, firmware, free space, snapshots and UPS unknown |
| TP-Link TL-SG2210P V3 / Omada | Home Ethernet switch, 1GbE ports | Reported; controller configuration, VLANs, DHCP/DNS ownership and recovery exports unknown |
| DevDrive | Mini-attached SanDisk Extreme 55AE, approximately 2 TB APFS | Observed case-insensitive, unencrypted, noowners; **480 Mb/s USB negotiation** during audit, cause unknown |
| PortableDrive | Mini-attached SanDisk Extreme SSD, approximately 500 GB APFS | Observed case-insensitive, unencrypted, noowners; USB 5 Gb/s; includes personal assets and repository/build trees |
| StartOS server | Separate server using a Mini-hosted network backup destination | Backup UI screenshot observed; server hardware/service inventory not inspected |

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

Mini Ethernet and Wi-Fi were both active; default route used Ethernet. Routing, reservations and access controls belong in private inventory. A LAN mDNS name need not resolve remotely. Tailscale OS peers and Rex-managed endpoints can coexist; distinguish them. The operator now reports NAS enrollment as device `nas` and HTTPS Serve to UGOS; the tailnet was renamed to `tarsier-atlas.ts.net` on November 23, 2026, confirmed by the operator in the Admin Console. The expected NAS HTTPS URL needs new-name certificate issuance and endpoint verification; it is **not yet tested here**. See [current NAS access and rename checklist](NAS-SSH.md#tailnet-rename-and-https-verification). Never assume router port forwarding is required.

SSH uses existing aliases and per-machine keys. Canonical portable defaults are in `computer/ssh/.ssh/config`; personal host entries belong in **local** `~/.ssh/config.local`. Both Macs' SSH ownership handoffs are verified; other resources remain transitional (see the retirement report). Do not put private hosts into the portable template or automatically overwrite an existing file. Validate hostname, quoted username, port and effective options with `ssh -G` before connecting. Host-specific options must precede wildcard defaults because OpenSSH uses the first obtained value.

## Execution and storage boundaries

Pi, Claude, Rex and Herdr may execute on either Mac. Execution belongs to the terminal server host, not the viewing app. Mini-hosted terminals can survive Air client disconnection; that does not prove application checkpointing or automatic failover. Session labels do not establish a sole orchestration authority.

Observed active Mini source is under `/Volumes/DevDrive/Projects`. Home navigation, shell/Git/terminal config and selected historical resources include external links. Dependencies, build outputs, Git worktrees and live process CWDs exist there: it is not passive storage. Sessions, sockets and most caches are per-host internal state. Shared trees need coordinated nonoverlapping edits and one Git writer; separate offline Air resources must stay local.

Existing navigation checks backing filesystem/server identity, not just the mount name. A NAS mount with the same name will not automatically preserve those assumptions. Before relocation, inspect symlinks, saved CWDs, app databases, permissions, metadata, case behavior and watcher semantics on both Macs. Do not move Unix sockets, live VM disks or runtime databases onto unvalidated SMB.

The durable-storage recommendation is NAS-native copies for validated passive/shared data, with active data placement justified by semantics and measurements. Do not assume UGOS supports APFS USB read/write. Keep originals until copy verification and recovery acceptance. Current USB-2 DevDrive versus 1GbE NAS does not establish a blanket local-storage performance advantage.

Pi fullscreen copies can be forwarded with `PI_CLIPBOARD_OSC52=1` on the execution host. The canonical shell package already provides `computer/zsh/.zshenv`; this is event-based forwarding, not clipboard synchronization. New shells load it; an existing shell may need an explicit export before relaunch. Native Rex Shift-drag selection is a separate fallback. Test both directions with harmless text and trusted clients; never expose clipboard secrets.

## Backups and recovery

StartOS was configured to use a network folder under DevDrive on the Mini. The screenshot showed destination availability and a last-backup display of July 31, 2026, 1:34:43 PM. This is not proof of freshness, payload integrity or recoverability; timestamp scope, schedule, retention and independent copies need confirmation. Exact destination and recovery-key custody stay private.

This backup path depends on Mini + DevDrive + LAN. NAS-native backup storage could remove Mini from that chain, but requires an approved supported destination change, preserved original set, fresh backup and controlled restore test. Never casually copy an actively changing application backup set or assume copying it updates the server's saved destination.

No Mini Time Machine destination was configured during the audit; other backup methods remain unknown. One NAS HDD is not redundancy; RAID/snapshots are not independent backups. Preserve offline/offsite copies and recovery keys through a separate secure process. Mini SMB share configuration showed guest-enabled writable shares; effective authorization was not tested and requires review, not an assumption of safety. Application libraries such as Photos/databases need explicit network-storage support checks.

## Onboard or recover a computer

1. Obtain a reviewed canonical checkout and inspect local configuration ownership before applying anything. Recover private credentials/inventory separately, never through Git.
2. Verify actual LAN/DNS/reservations/routes, link negotiation and host trust. Do not invent VLAN/firewall/pool settings or bypass changed SSH keys.
3. Follow [SETUP.md](../SETUP.md) and its per-host handoff gates. Preserve personal override files, occupied destinations, Air offline resources and recovery copies. Legacy release tooling is for existing migration/recovery consumers, not a second setup authoring path.
4. Provision public portable defaults and privately reviewed host aliases through their documented owners. Validate `ssh -G` for intended hosts. Authenticate separately on each computer; no private-key cloning or account promotion.
5. Verify source/backing and permissions before restoring mounts/share paths. Keep sensitive live state local and restore only approved datasets.
6. Test terminal reconnect, both clipboard directions, and backup/restore. Record observed results; this checklist is not runtime acceptance evidence.

Bounded read-only discovery tools include `networksetup`, `ifconfig`, `route -n get default`, `diskutil list`, `diskutil apfs list`, `mount`, `sharing -l`, `smbutil statshares -a`, and `tailscale status`. Keep raw identifying output private. No port scan or write benchmark is needed for inventory.

## Unfinished work

- Independently verify the operator-reported NAS key login, effective administrator identity/shell and key persistence across exact UGOS firmware updates; do not reinstall keys based solely on historical failed probes.
- Verify new-name HTTPS certificate issuance, MagicDNS, Serve backend and NAS SMB access after the tailnet rename; review [manual client follow-ups](NAS-SSH.md#manual-client-follow-ups).
- Actual NAS pool/filesystem, health/capacity, SMB capabilities, snapshots, APFS USB support, backup and UPS policy.
- Switch/controller management owner and privately stored recovery export; DHCP/DNS/firewall source of truth.
- StartOS service inventory, backup freshness/schedule and restore test.
- Air mounts/runtime ownership review; SSH ownership is already handed off, but endpoint changes still require separate review.
- Controlled local APFS versus NAS SMB performance/semantics tests before active-storage migration.
- Complete the explicit legacy-consumer retirement gates before archiving dotfiles.

NAS Tailscale enrollment is operator-reported current configuration, not future work. Retain stable local aliases; any private HostName update still requires ACL/DNS validation and host-key continuity checks. The tailnet rename does not itself authorize SSH, Rex or NAS changes. No new configuration layer is necessary.
