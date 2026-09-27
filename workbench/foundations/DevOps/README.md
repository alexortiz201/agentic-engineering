# 🚀 DevOps -- the environment the code runs in, and the path it takes to get there

Isolation, environments, credentials, release and rollback, and the infrastructure agents are given to work inside.

**Sandboxing an agent lives here**, and it is the reason this area exists. An agent that can reach a real environment with real credentials is a production concern before it is an agentic one, and the practices that contain it -- ephemeral workspaces, scoped short-lived credentials, declared and tested boundaries -- are operations practices that existed long before anything was delegated to a model.

## What belongs here

The test in [`foundations/README.md`](../README.md) asks whether a statement survives removing agents. That question sorts engineering from agentic work, but it cannot sort this area, because everything here survives it. So a second question runs after it:

**Does this concern the code itself, or the environment it runs in and the path it takes to get there?**

The environment and the path are here. The code is [`Software_Engineering/`](../Software_Engineering/README.md).

Concretely: isolation and sandboxes, environments and the movement of data between them, credential lifecycle, release, deploy, rollback, CI pipelines, and the observability of running systems. A rule about *what a test asserts* is engineering; a rule about *what the machine running it is allowed to reach* is here.

## What is in here

| File | Answers |
|---|---|
| 🏝️ [`01_ISOLATION_AND_SANDBOXING.md`](01_ISOLATION_AND_SANDBOXING.md) | What each isolation mechanism actually contains, and what makes a sandbox a tested boundary rather than a label |
| 🔑 [`02_CREDENTIALS_AND_ENVIRONMENTS.md`](02_CREDENTIALS_AND_ENVIRONMENTS.md) | Secret hygiene, moving data between environments, and acting against an external service |
| 🚢 [`03_RELEASE_AND_ROLLBACK.md`](03_RELEASE_AND_ROLLBACK.md) | Evidenced reversibility, the rollback ladder, and why merge is not deployment |

## Topics in scope but not yet written

**Observability of a running system** is defined in [`Software_Engineering/04_OBSERVABILITY.md`](../Software_Engineering/04_OBSERVABILITY.md), because the definition holds with agents removed. What belongs here when it is written is the *operational* half -- where signals are collected, how long they are retained, what alerts on them.


Named so a reader can tell missing from hidden. If you want one of these, it is not here yet: CI gating of running systems.

Material for both currently sits in [`Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md`](../Agentic_Engineering/03_AUTHORITY_AND_SAFETY.md) and [`04_VERIFICATION.md`](../Agentic_Engineering/04_VERIFICATION.md), and moves here as each topic is worked in depth rather than all at once. A topic earns a file when it is being dug into, not when it is mentioned.
