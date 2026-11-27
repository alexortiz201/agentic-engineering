# NAS SSH diagnosis

**Resolved and independently verified on both Macs on November 23, 2026.**
This report does not establish NAS HTTPS/Serve readiness. Exact endpoints,
account and device identifiers, trust fingerprints, and before-state receipts
remain in private storage.

There were two separate failures:

1. **Host trust lookup.** The Mini had the correctly attested ED25519 host key
   under the bracketed endpoint with `:22`, but default-port OpenSSH looked up
   the unbracketed address. A lookup for that name was initially empty; the
   bracketed lookup found the independently verified fingerprint. Reverse key
   matches for other names were not proof of trust for the requested endpoint.
   The targeted correction added the same verified key under the unbracketed
   address without replacing the original entries or disabling strict checking.
2. **User authorization.** Fresh connections then passed host verification but
   returned `Permission denied (publickey,password)`. Earlier apparent LAN
   success could have reused a multiplexed session. The operator added the
   Mini's public key to the intended NAS account while preserving the Air key.

Separate fresh connections then passed from both Macs, using both `nas` and
`nas-lan`, with `BatchMode=yes`, `StrictHostKeyChecking=yes`, `ControlMaster=no`
and `ControlPath=none`. All returned the expected account and appliance identity
without password prompts or host-key warnings. The Air configuration was not
changed, and no other NAS authentication or services were changed.

For a future regression, follow the [client-side verification and rollback
checklist](NAS-SSH.md#manual-client-follow-ups). Do not edit `authorized_keys`
or re-establish host trust solely because an earlier test may have reused a
control connection.
