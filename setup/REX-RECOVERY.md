# Rex workstation recovery

This is a **manual recovery checklist**, not a new setup-wizard component or a
backup of application state. The wizard does not install Rex, enroll Tailscale,
restore remote hosts, authorize SSH keys, or change live computer ownership.
Follow [SETUP.md](../SETUP.md) and the [migration gates](MIGRATION.md) first.
Rex is beta software; verify names/options against the installed app and CLI.

## What this repository preserves

- Portable shell/plugin/theme sources in `computer/zsh/`, including terminal-aware
  Ghostty tint, a real prompt clock, one backspace setup, and one Homebrew prefix
  lookup. They remain staged until a separately approved per-host handoff; editing
  this source does not replace existing dotfiles links.
- This procedure for restoring the Rex launcher, bidirectional host access,
  identity checks, and local verification. Rex defaults currently suffice: no
  custom keybindings, agent scheduler, background polling, or reconnect script.
- Existing application declarations, including standalone Tailscale and Claude
  Code. Rex installation remains manual, not a fabricated Homebrew declaration.

Not preserved here: Rex sessions/scrollback, application preferences, private host
addresses, trust stores, authorized keys, account identity, SSH private keys,
Tailscale enrollment state/auth keys, or secrets. This checklist is not a complete
Mac backup. Keep any needed private recovery record in your existing approved
private backup/password manager, outside this repository. Signing back in may
assign a different endpoint; always obtain the actual address from the server.

## 1. Install and expose the native Rex CLI

Install the reviewed macOS beta from the official Rex distribution and launch it.
Do not copy an old executable, install an unrelated npm package, or replace its
server with a second service. Keep Herdr/Ghostty until their separate retirement
is approved.

In a local shell on **each Mac**:

```sh
command -v rex
```

If absent, check Rex's own CLI-install option first. The observed beta's managed
CLI lives at the following path, independent of whether the app is named Rex or
Rex Beta:

```sh
rex_cli="$HOME/Library/Application Support/com.superlogical.rex/RexServer/Versions/Current/Rex Server.app/Contents/MacOS/rex"
test -x "$rex_cli" && "$rex_cli" --version
```

After confirming that path and reviewing the target, a user-local symlink is an
optional manual fallback (not a bootstrap action):

```sh
mkdir -p "$HOME/.local/bin"
ln -s "$rex_cli" "$HOME/.local/bin/rex"
```

`ln -s` must refuse an occupied destination; do not add `-f` or overwrite a
foreign launcher. Inspect an existing link instead. The staged zsh template
already prefers `~/.local/bin`. Open a fresh terminal and verify again. The
`Versions/Current` link follows app-managed server updates; still verify after
an app update or relocation. A missing/changed bundle layout requires inspection,
not a guessed path.

## 2. Enable authenticated Rex access on both Macs

On each Mac, in **Settings → Server → Tailscale**:

1. Enable **Serve over Tailscale**, then sign into the intended account.
2. Prefer a recognizable Rex node name, such as `mini-rex` or `air-rex`.
3. Retain **Limit access to your Tailscale account**; do not broaden access to all
   tailnet members or add an anonymous HTTP listener.
4. In **Settings → Server → Remote Address**, wait for certificate readiness and
   copy the actual HTTPS URL. Its assigned name can differ from the preference.

Rex's embedded Tailscale node and the standalone macOS Tailscale app can coexist.
Two Macs can therefore have four nodes: one system node and one Rex node per Mac.
This is intentional for the current beta setup; do not delete either type as a
"duplicate" or migrate transport ownership without separate approval.

Read-only local confirmation (do not publish its private output):

```sh
rex --autostart=false whoami --json
```

Confirm the local account and host ID, `tailscale.state`, and
`tailscale.https.url`. HTTPS must validate normally. A hosts-file or SSH alias
such as `air` does not issue a certificate for `https://air`. Never disable TLS
verification to shorten the address. SSH is encrypted too, but the selected Rex
recovery path uses its authenticated Tailscale HTTPS endpoint in both directions.

## Tailnet rename follow-up

The operator confirmed the tailnet DNS name changed to **`tarsier-atlas.ts.net`**
on November 23, 2026. Rex certificates and saved endpoints must be checked against
each server's actual advertised URL, not changed by blind suffix substitution.
Certificates for a previous hostname do not validate its renamed replacement;
verify supported reissuance and readiness independently on both Macs.

Inspect app Remote Hosts/bookmarks and CLI labels separately. A local saved Rex
host label still contains the previous suffix; that is a manual-review finding,
not proof its endpoint is broken. Validate the intended host ID, TLS and both
connection directions before separately approved record edits. Preserve existing
sessions and working recovery access; do not restart servers or delete sessions
to rename a bookmark. The [NAS rename checklist](NAS-SSH.md#tailnet-rename-and-https-verification)
records the DNS transition and NAS-specific Serve mapping; that NAS URL is not a
Rex server URL. No client records or live configuration were changed by this
update.

## 3. Restore both app connections, not just one

- On the Mini, **Add Remote Host…** using the Air's actual Rex HTTPS URL; use the
  display label `air` where the installed UI permits naming.
- On the Air, add the Mini's actual Rex HTTPS URL; use display label `mini`.
- Open a session hosted by the opposite Mac in each app. Viewing a Mini-hosted
  session from the Air does not automatically expose Air-hosted sessions to Mini.
- If replacing an old `ssh://mini` entry, verify HTTPS sessions before removing
  the old entry. Do not delete sessions or restart the server to rename a host.

The native **Settings → Remote Hosts** view reports connection status/failures and
provides retry controls. Verify recovery when a host is reachable again; do not
promise that every beta build automatically reconnects. No custom startup script
or filesystem mount is required. A hosting Mac must be awake and reachable.

## 4. Restore CLI labels separately and verify identity

The app's remote-host list and CLI `rex hosts` list may be separate in this beta.
Do not assume changing one updates the other. On each Mac, inspect first:

```sh
rex hosts --json
```

For a missing CLI label, set the appropriate **private** endpoint in the current
shell, then add it explicitly. Do not store the filled-in URL in this repository:

```sh
# On Mini: replace the placeholder with Air's actual Rex HTTPS URL.
AIR_REX_URL='https://REPLACE-WITH-AIR-REX-HOSTNAME'
rex -S "$AIR_REX_URL" whoami --json
rex hosts add air "$AIR_REX_URL"
rex hosts check --json
rex -S air whoami --json
rex -S air ls --json
```

On Air, repeat with `MINI_REX_URL`, `mini`, and the Mini's endpoint. If a label
already exists, inspect and use the installed `rex hosts edit --help`; do not
blindly remove/recreate records. Confirm the returned host ID and account match
the opposite Mac's **local** `whoami` result before running remote commands.
Named `-S` operations should only follow a successful reachability/identity check;
do not use a guessed `REX_SERVER` value that could fall back to a local server.

If desired, save labels, actual URLs, preferred node names and host IDs in your
private recovery record. Display labels are not DNS names, SSH aliases or proof
of machine identity. Signing in to a replaced server can change its host ID.

## 5. Optional SSH administration remains independent

Rex HTTPS access does not depend on SSH authorization. For SSH administration:

- Keep private host entries in `~/.ssh/config.local` when using this repository's
  staged SSH template. Existing legacy links need their approved ownership
  transition before that include can be assumed active.
- Verify the destination's actual local account with `whoami`.
- Verify its SSH host-key fingerprint on the destination, for example
  `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. Match it before trusting a new
  address. `.local` and Tailscale names may have separate known-host entries for
  the same key. Never disable host-key checks or trust a changed key blindly.
- On the destination, back up `authorized_keys` before editing. Preserve valid
  keys and add only the source Mac's reviewed **public** key as one unwrapped
  OpenSSH line. Verify fingerprints using `ssh-keygen -lf` on both sides.
- `~/.ssh` should be owned by the local account with mode 700; `authorized_keys`
  should have mode 600. Do not broadly chmod the home directory or change sshd
  policy to work around a malformed key. A correct file must parse successfully.
- Test each desired direction. SSH host trust, key authorization and Rex host
  connections are directional; success one way does not establish the reverse.

Do not commit `authorized_keys`, known-host files, actual host mappings or private
keys as part of this portable procedure. No copy of credentials is needed here.

## Bounded checks during setup migration

Use the terminal host actually running the session. Rex does not require
`HERDR_ENV=1`; that guard applies only to Herdr operations. Use the installed
`rex __internal skill` and command help as the syntax authority.

For an already configured remote host, inspect before running anything:

```sh
rex --autostart=false hosts list --json
rex --autostart=false -S air whoami --json
rex --autostart=false -S air ls --json
```

Verify remote identity, select the returned remote session explicitly, and keep
`-S air` on every remote command. A local session/block ID does not identify an
Air pane. Never set a guessed `REX_SERVER` or accept a fallback to local execution.
For approved bounded shell checks, use a separate `run --focus=false` block with
`--shell=none`, an explicit command and `--wait`; capture its returned block ID.
Do not inject commands into an occupied user/agent pane. Retain non-secret results
as evidence; do not restart servers, alter enrollment, or interrupt active sessions.

Use physically local canonical sources and verified local tools on Air. Rex
transport success alone does not establish source ownership, offline readiness,
Git availability or recovery acceptance. An unavailable Herdr context is not a
blocker for Rex operations. Conversely, having Rex access does not authorize
Herdr control from outside a Herdr-managed pane.

## 6. Fresh-shell and copy checks

Open a new local terminal on each Mac and inspect:

```sh
whence -a node npm claude pi rex
node --version
npm --version
claude --version
ssh-add -l
```

Confirm the intended installation managers and aliases/functions. Interactive
zsh loads `.zshrc`; agent subprocesses and SSH commands can inherit a leaner PATH.
A command missing there does not prove the interactive startup failed. Avoid
installing a competing copy just to fix PATH.

Claude's existing setup declaration uses the Homebrew cask. No npm launcher repair
or npm install-script policy is part of this bootstrap. Do not reinstall or switch
a working npm/native Claude to Homebrew without separate approval.

Native Rex text selection and Cmd+C use the viewing Mac's clipboard.
Copy-on-selection can replace clipboard contents after another selection; keep
it if desired. Pi fullscreen owns ordinary mouse selection instead; Shift-drag
bypasses it and uses Rex's native selection.

The portable shell package includes `setup/computer/zsh/.zshenv`, which exports
`PI_CLIPBOARD_OSC52=1` by default on either Mac. Pi then also forwards its fullscreen
copies through the terminal using OSC 52, even when Rex remote access supplies no
SSH environment markers. This is event-based forwarding to the connected terminal,
not continuous clipboard synchronization. The local host clipboard is still
written; use only trusted terminal clients and do not test with secrets. This does
not make Pi's application-owned selection into a native Rex selection or guarantee
that Cmd+C acts on it.

For a one-process test in an existing shell:

```sh
PI_CLIPBOARD_OSC52=1 pi
```

New zsh shells inherit the default after the shell package is installed; existing
Pi processes must be relaunched. Explicit `PI_CLIPBOARD_OSC52=0 pi` opts out. Test
Mini-hosted Pi to Air and Air-hosted Pi to Mini separately with harmless text,
pasting into a local app on the viewing Mac. Startup/environment tests do not
establish GUI or OSC 52 acceptance.

An existing unmanaged `~/.zshenv` is a provisioning conflict, not permission to
overwrite it. Preserve local content (for example RVM/Cargo setup) and review a
merge/ownership handoff before installing the package. The setup wizard must not
adopt or replace it automatically.

A standalone `pbcopy` on the remote host still writes only to that host's
clipboard. macOS Universal Clipboard is separate from Rex/Pi forwarding.

## Acceptance and backup limits

Before calling a restored machine ready, verify local CLI resolution, correct
host IDs/accounts, sessions visible in **both** apps, reachability/failure status,
a reconnect after a normal interruption, and copying harmless remote-pane text to
the viewing Mac. A read-only host list alone does not prove remote execution or
GUI/reconnect behavior. Never interrupt active work merely to run this checklist.

These are manual acceptance steps, not claims that this repository has run them
on a freshly provisioned Mac. Existing sessions and security enrollment require
application-supported recovery or the private backup strategy; the portable
bootstrap intentionally does not clone runtime databases.

References (external, beta/version-dependent):
[installation](https://www.superlogical.com/rex/docs/installation),
[Mac settings](https://www.superlogical.com/rex/docs/reference/mac-settings),
[remote access](https://www.superlogical.com/rex/docs/linux/remote-access).
Use installed `rex --help`/subcommand help when published docs differ.
