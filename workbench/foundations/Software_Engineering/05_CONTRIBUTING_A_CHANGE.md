# 📝 Contributing a change

What a change publishes about itself, and to whom. The commit message, the pull request body, the changelog entry -- surfaces written once, read long afterwards, and **editable by nobody**.

Distinct from [code review](03_CODE_REVIEW.md), which evaluates whether a change is right. This is about what the change says it is.

## The form

```
<type>(<scope>): <one-line title>

- <what moved>
- <what moved>
```

**The type says what kind of change this is**, and it is the field that makes a history filterable -- which is the whole reason a message has a grammar rather than only a style.

| Type | For |
|---|---|
| `feat` | New behaviour someone can use |
| `fix` | Broken behaviour now correct |
| `refactor` | Structure changed, behaviour deliberately unchanged |
| `perf` | Same behaviour, measurably faster or cheaper |
| `test` | Tests added or changed, with no production code change |
| `docs` | Documentation only |
| `build` / `ci` | The build, the dependencies, or the pipeline |
| `chore` | Mechanical maintenance with no behavioural effect |
| `revert` | Undoes an earlier change, naming it |

**Scope is optional and names the area touched**, not the file list. Use it where a repository has areas a reader would filter by, and leave it empty where it would only repeat the type.

**One type per commit.** A change needing two is two commits -- the type is a claim about the whole commit, and a commit that is both a fix and a refactor makes the history unfilterable and the fix unrevertable.

**The title is one line, in the imperative, and says what changed.** Then bullets, one per thing that moved. Someone reading history is scanning to locate a change, not being persuaded it was a good one, and prose defeats scanning in a way bullets do not.

**Over-explaining is the common failure, and it is not a harmless one.** Reasoning put into a message is reasoning put where it cannot be read in context, cannot be corrected, and will not be found by anyone looking for it. Why a change is right belongs in the changed files, in a design document, or in the discussion attached to the change -- all three of which can be revised when the reasoning turns out to be wrong. A message cannot.

So: if a bullet needs a paragraph to justify it, the paragraph belongs somewhere else. The test is whether a line describes **what moved** or **why it should have**.

**Nothing that is not what changed belongs in the message.** Generated footers, tooling signatures and authorship markers describe the circumstances of the writing rather than the change, so none of them are the message's content.

### Never append authorship

**A version control system already records who authored a commit.** It is a field on the commit, it is what every tool reads to answer the question, and where commits are signed it is the only answer that can be trusted. **A footer naming an author, a tool or a model duplicates a field that already exists** -- and a duplicate of an identity is worse than no duplicate, because the two can disagree and only one of them is authoritative.

So it is not a matter of taste. The trailer:

- **Restates the author field**, less reliably, in a place nothing queries.
- **Can contradict it**, at which point a reader has to know which to believe.
- **Cannot be corrected**, since the message cannot be edited, while the author field travels with a commit that can be re-signed.
- **Accumulates**, because it is appended by default rather than written on purpose, until every message in a history carries the same lines and none of them carry information.

**A message ends on its last substantive line.** Where tooling appends such a trailer by default, that default is turned off; a convention that adds noise to every commit in a repository is not a convention worth inheriting.


## A derived title is written from what was confirmed

Where the title of a change is derived from an originating report -- a defect record, a request, a ticket -- **compose it from the mechanism that was confirmed, and never copy the report's own title across.** That title states the guess somebody made before anyone looked, and it is frequently the claim the investigation refuted.

The cost is asymmetric, which is why this is worth a rule rather than a preference. A wrong sentence in a comment is read once; a wrong title is the most-read, longest-lived and least-re-examined surface the change has, and it will be the thing quoted back years later by people who never opened the diff.

## What must never appear

- **Credentials and secrets.** Already stated at [`DevOps/02`](../DevOps/02_CREDENTIALS_AND_ENVIRONMENTS.md) and not restated here -- except for the part that file is about the files: **the message is a surface of its own.**
- **The mechanism of a weakness that was just fixed.** See below.
- **Anything belonging to an owner other than the repository's owner.** An organization's name, an identifier from its tracker, an internal hostname, a path from its infrastructure, a colleague's name. Where one repository is used to work on subjects belonging to several owners, this is the boundary, and the message is the half of it most easily forgotten.

### Describe the change, not the weakness

**A fix is a disclosure.** The commit that repairs a vulnerability also documents it, and it documents it against **every copy of the code that has not taken the fix yet** -- other deployments, older releases, forks, anything on a slower upgrade path. A message precise enough to be helpful is precise enough to be a set of instructions.

So the bullets carry **what changed**, not what was possible before it changed. A message saying a parameter is now validated describes the change; one naming the parameter, the payload shape and what it reached describes the exploit, and that second half buys a reader nothing they cannot get from the diff once they are entitled to it.

The rule follows from the surface rather than from the subject matter: **a message is published at once, to everyone, permanently, and cannot be edited.** A diff can sit behind an embargo, a private repository or a delayed release; the message describing it travels with the commit. That asymmetry is the whole argument -- **the right place for the detail is the advisory that ships on the disclosing party's schedule**, not the history that ships on the commit's.

This is not an argument for vague messages generally. It is narrow: **detail about how something could be abused is the part that is withheld**, and everything else stays as specific as it always should be.

## The message is not covered by whatever guards the files

Ignore rules, fenced directories and redaction all operate on **content**. A message is none of those things. The predictable failure is a repository whose files are scrupulously general and whose history names the organization, the ticket and the environment in plain text -- because the discipline was applied to what was being written and not to what was being said about it.

**Apply the same rule to the message that applies to the file it describes.** If a directory is fenced because of who owns it, the messages touching it are fenced by the same reasoning.

## History is not editable, whatever the interface suggests

**A later commit does not redact an earlier one.** Correcting a file leaves every prior version intact and reachable, and anyone who cloned already has it. The remedies are rewriting history or accepting the disclosure, and both are decisions for whoever owns the repository rather than for whoever noticed.

Two consequences worth holding while writing rather than afterwards:

- **The cost of a mistake here is paid at the moment it is pushed**, not when it is discovered. Review of a message is worth more than correction of one, because correction is mostly unavailable.
- **On finding something already published, report it and say plainly that it remains in history.** Quietly amending the current state and letting the report imply the exposure has ended is the specific failure -- it converts a known problem into an unknown one.
