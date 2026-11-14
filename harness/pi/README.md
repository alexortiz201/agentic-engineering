# Selective Pi migration candidate

Generated from accepted root `pi/` by `node setup/stage-pi.mjs`. Do not edit the generated packages or seed independently. This is staging, not a second authored authority. Root `pi/` and its installer remain intact because current live links depend on them.

The new setup CLI installs **only selected** packages: instructions, theme, Workbench Skill, Study Skill, composer. It never Stows this entire directory. Defaults and Todos are independent operations. There are no legacy orchestration extensions here. Herdr's reporter remains generated locally by Herdr, not portable source.

After approving and applying the per-leaf handoff in `../../setup/MIGRATION.md` on both Macs, remove the root source in a separately reviewed change, retire staging generation, and make this directory the sole authored Pi owner. Do not move the old source before detaching its live links. This deliberately defers the physical relocation required by the target architecture until deployment authorization.

The accepted executable remains official managed Pi 1.5.2; Todo remains exactly 1.1.0. These resources do not install or wrap the executable. Runtime state/settings/auth/sessions/notes remain local. Runtime loading and offline acceptance require application-level checks after approved deployment, not just Stow fixtures.
