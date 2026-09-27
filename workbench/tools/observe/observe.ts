#!/usr/bin/env bun
/**
 * Reference implementation of `primitives/observation.md`.
 *
 * One adopter's answer, in one language. The blueprint is the portable part -- if this
 * file and the primitive disagree, the primitive is right and this is behind.
 *
 * Writes compact JSONL. Off unless opened; the open and close are what bound the cost.
 */

/**
 * 2 -- gaps split `disposition` (why it could not be seen) from `status` (what became of it),
 *      recorder failures moved out of `meta_change` into their own kind, and `close` gained a
 *      free-text `note` beside its enum. Records written under 1 stay readable: every field
 *      added here is optional on read, and nothing that existed was removed or renamed.
 */
const SCHEMA_VERSION = 2;

const KINDS = ['command', 'ui', 'handoff', 'prompt', 'decision', 'gap', 'meta_change', 'instrument_fault'] as const;
const CLOSE_REASONS = ['completed', 'abandoned', 'interrupted'] as const;
const EFFECTS = ['read', 'write'] as const;

/** Why the instrument could not look. Fixed at the moment the gap was noticed; never changes. */
const DISPOSITIONS = ['deferred', 'unobservable', 'not_permitted'] as const;
/** What has become of the gap since. Changes later, which is what `observe gap` is for. */
const GAP_STATUSES = ['open', 'corrected', 'worked_around', 'escalated', 'resolved'] as const;
/** The attributions a `meta_change` can be about. A recorder failure is not one of them. */
const META_FIELDS = ['model', 'harness', 'workspace'] as const;

type Kind = (typeof KINDS)[number];
type CloseReason = (typeof CLOSE_REASONS)[number];
type Effect = (typeof EFFECTS)[number];
type Disposition = (typeof DISPOSITIONS)[number];
type GapStatus = (typeof GAP_STATUSES)[number];
type MetaField = (typeof META_FIELDS)[number];

const root = (): string => process.env.OBSERVE_DIR ?? `${process.cwd()}/observations`;
const dirFor = (obsId: string): string => `${root()}/${obsId}`;
const recordPath = (obsId: string): string => `${dirFor(obsId)}/observation.jsonl`;

/**
 * Identity is `<subject>_<id>`. The subject makes a recording findable by the ticket it belongs
 * to; the id keeps two agents working the SAME ticket from writing into one file. There is no
 * global "currently open" pointer -- openness is derived by reading each record for a close
 * event, so two recordings can be open at once and neither can corrupt the other's state.
 */
const slug = (s: string): string => s.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');

const isKind = (v: string): v is Kind => (KINDS as readonly string[]).includes(v);
const isCloseReason = (v: string): v is CloseReason => (CLOSE_REASONS as readonly string[]).includes(v);
const isEffect = (v: string): v is Effect => (EFFECTS as readonly string[]).includes(v);
const isDisposition = (v: string): v is Disposition => (DISPOSITIONS as readonly string[]).includes(v);
const isGapStatus = (v: string): v is GapStatus => (GAP_STATUSES as readonly string[]).includes(v);
const isMetaField = (v: string): v is MetaField => (META_FIELDS as readonly string[]).includes(v);

const now = (): string => new Date().toISOString();

const refuse = (message: string): never => {
    console.error(`observe: ${message}`);
    process.exit(1);
};

/** Flags only; a positional would be ambiguous against free text in `--what`. */
const parseFlags = (argv: string[]): Record<string, string | true> =>
    argv.reduce<Record<string, string | true>>((acc, token, i) => {
        if (!token.startsWith('--')) return acc;
        const next = argv[i + 1];
        acc[token.slice(2)] = next && !next.startsWith('--') ? next : true;
        return acc;
    }, {});

const isClosed = async (obsId: string): Promise<boolean> =>
    (await lines(obsId)).some((l) => l.event === 'close');

const listObservations = async (): Promise<string[]> => {
    const glob = new Bun.Glob('*/observation.jsonl');
    const found: string[] = [];
    for await (const hit of glob.scan({ cwd: root() })) found.push(hit.split('/')[0]);
    return found.sort();
};

const listOpen = async (): Promise<string[]> => {
    const all = await listObservations();
    const open: string[] = [];
    for (const id of all) if (!(await isClosed(id))) open.push(id);
    return open;
};

/**
 * `--obs` is optional while exactly one recording is open, and required once more than one is.
 * Guessing between two open recordings is the collision this exists to prevent.
 */
const resolveOpen = async (flags: Record<string, string | true>): Promise<string> => {
    const named = typeof flags.obs === 'string' ? flags.obs : null;
    if (named) {
        if (!(await Bun.file(recordPath(named)).exists())) refuse(`no recording named ${named}.`);
        if (await isClosed(named)) refuse(`${named} is already closed.`);
        return named;
    }
    const open = await listOpen();
    if (open.length === 0) refuse('no recording is open. `observe open --subject <ticket>` first.');
    if (open.length > 1) refuse(`${open.length} recordings are open — name one with --obs:\n  ${open.join('\n  ')}`);
    return open[0]!;
};

const append = async (obsId: string, entry: Record<string, unknown>): Promise<void> => {
    const line = `${JSON.stringify({ schema_version: SCHEMA_VERSION, obs_id: obsId, ...entry })}\n`;
    const path = recordPath(obsId);
    const existing = (await Bun.file(path).exists()) ? await Bun.file(path).text() : '';
    await Bun.write(path, existing + line);
};

const lines = async (obsId: string): Promise<Record<string, unknown>[]> =>
    (await Bun.file(recordPath(obsId)).text())
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((l) => JSON.parse(l));

const nextSeq = async (obsId: string): Promise<number> =>
    (await lines(obsId)).filter((l) => typeof l.seq === 'number').length;

const open = async (flags: Record<string, string | true>): Promise<void> => {
    const subject = flags.subject;
    if (typeof subject !== 'string') refuse('--subject is required, and names what is being worked on.');

    // <subject>_<id>. Several may be open at once, including several on the same subject.
    const obsId = `${slug(subject)}_${now().replace(/[:.]/g, '-')}`;
    if (await Bun.file(recordPath(obsId)).exists()) refuse(`${obsId} already exists.`);
    await append(obsId, {
        event: 'open',
        at: now(),
        subject,
        // Attribution, because behaviour credited to a process may belong to the model or the harness.
        model: typeof flags.model === 'string' ? flags.model : null,
        harness: typeof flags.harness === 'string' ? flags.harness : null,
        workspace: typeof flags.workspace === 'string' ? flags.workspace : process.cwd()
    });
    console.log(obsId);
};

/**
 * A gap answers two questions that a single slot cannot hold, and the corpus proved it: of 27
 * recorded gaps, 12 carried no usable disposition -- six sat outside the enum (`worked-around`,
 * `accepted`, `corrected -- ...`) and six were absent. The off-enum values were *more* informative
 * than the enum, which is the signal: recorders needed to say what BECAME of the gap and only had
 * the field that says why it was invisible. The cost is mechanical: a gap whose `what` begins
 * "RESOLVED" while its `disposition` reads `unobservable` is counted open by any consumer that
 * trusts the field.
 *
 *   --disposition  why the instrument could not look. True at the moment of the gap, forever.
 *   --status       what has happened to it since. Defaults to `open`, and is revised by `observe gap`.
 */
const validateGap = (flags: Record<string, string | true>): GapStatus => {
    if (typeof flags.tool !== 'string') refuse('a gap needs --tool: what could not look.');
    if (typeof flags.disposition !== 'string') {
        refuse(`a gap needs --disposition (${DISPOSITIONS.join('|')}): why it could not be seen.`);
    }
    if (!isDisposition(String(flags.disposition))) {
        refuse(
            `--disposition must be one of: ${DISPOSITIONS.join(', ')} — it says why the gap could not be seen. ` +
                `What became of it goes in --status (${GAP_STATUSES.join('|')}).`
        );
    }
    const status = typeof flags.status === 'string' ? flags.status : 'open';
    if (!isGapStatus(status)) refuse(`--status must be one of: ${GAP_STATUSES.join(', ')}`);
    return status as GapStatus;
};

/**
 * `meta_change` is for a change in what explains the behaviour -- the model, the harness, the
 * workspace -- because every conclusion after one has a different provenance from every conclusion
 * before it. Both of its recorded uses were instead a *recorder* failure, which describes the
 * instrument rather than the work. Requiring the two fields that define an attribution change is
 * what makes the misuse impossible rather than merely discouraged; `instrument_fault` is where the
 * misused entries belonged.
 */
const validateMetaChange = (flags: Record<string, string | true>): void => {
    if (typeof flags.field !== 'string' || !isMetaField(flags.field)) {
        refuse(
            `a meta_change needs --field (${META_FIELDS.join('|')}): which attribution changed. ` +
                'A failure of the recorder itself is --kind instrument_fault, not a meta_change.'
        );
    }
    if (typeof flags.to !== 'string') refuse('a meta_change needs --to: the value the attribution changed to.');
};

const add = async (flags: Record<string, string | true>): Promise<void> => {
    const obsId = await resolveOpen(flags);
    const kind = flags.kind;
    if (typeof kind !== 'string' || !isKind(kind)) refuse(`--kind must be one of: ${KINDS.join(', ')}`);
    if (typeof flags.what !== 'string') refuse('--what is required: what was actually done.');

    const effect = typeof flags.effect === 'string' ? flags.effect : 'read';
    if (!isEffect(effect)) refuse(`--effect must be one of: ${EFFECTS.join(', ')}`);

    // Everything not consumed above rides along as kind-specific fields. Flags arrive as
    // strings; the fields a consumer does arithmetic or joins on are coerced, and only those
    // -- blanket coercion would turn a version like "1.20" into a number and lose it.
    const reserved = new Set(['kind', 'what', 'effect', 'step', 'out-of-band', 'obs', 'status']);
    const numericFields = new Set(['exit', 'reconciled_by']);
    // A gap that does not say which instrument could not look, what kind of absence it is, and
    // what has become of it, records only that something was missed.
    const gapStatus = kind === 'gap' ? validateGap(flags) : null;
    if (kind === 'meta_change') validateMetaChange(flags);
    // `status` is reserved, so on any other kind it would be dropped without a word -- and a flag
    // that vanishes silently is the same failure class this split exists to close.
    if (kind !== 'gap' && typeof flags.status === 'string') refuse(`--status belongs to a gap, not a ${kind}.`);
    const extra = Object.fromEntries(
        Object.entries(flags)
            .filter(([k]) => !reserved.has(k))
            .map(([k, v]) => [k, numericFields.has(k) && typeof v === 'string' ? Number(v) : v])
    );

    const seq = await nextSeq(obsId);
    await append(obsId, {
        seq,
        at: now(),
        kind,
        effect,
        // Assigned by the recorder, later. Never requested from the subject.
        step: typeof flags.step === 'string' ? flags.step : null,
        in_band: flags['out-of-band'] !== true,
        what: flags.what,
        ...(gapStatus ? { status: gapStatus } : {}),
        ...extra
    });
    console.log(`${obsId} #${seq} ${kind}`);
};

/** The second pass. Labels are revisable; the record is not rewritten, a correction is appended. */
const label = async (flags: Record<string, string | true>): Promise<void> => {
    const obsId = await resolveOpen(flags);
    const seq = Number(flags.seq);
    if (!Number.isInteger(seq)) refuse('--seq must name the entry being labelled.');
    if (typeof flags.step !== 'string') refuse('--step is required.');
    if (seq >= (await nextSeq(obsId))) refuse(`no entry #${seq} in ${obsId}.`);

    await append(obsId, { event: 'label', at: now(), labels: seq, step: flags.step });
    console.log(`${obsId} #${seq} -> ${flags.step}`);
};

/**
 * What became of a gap is known later than the gap itself -- which is exactly why one field could
 * not hold both halves. So a status change is appended as a new opinion about an earlier entry, the
 * same shape `label` uses and for the same reason: the record is append-only, and overwriting the
 * entry would destroy the fact that the status ever moved.
 */
const gap = async (flags: Record<string, string | true>): Promise<void> => {
    const obsId = await resolveOpen(flags);
    const seq = Number(flags.seq);
    if (!Number.isInteger(seq)) refuse('--seq must name the gap entry whose status changed.');
    if (typeof flags.status !== 'string' || !isGapStatus(flags.status)) {
        refuse(`--status must be one of: ${GAP_STATUSES.join(', ')}`);
    }

    const target = (await lines(obsId)).find((l) => l.seq === seq);
    if (!target) refuse(`no entry #${seq} in ${obsId}.`);
    if (target!.kind !== 'gap') refuse(`#${seq} is a ${String(target!.kind)}, not a gap — only a gap carries a status.`);

    await append(obsId, {
        event: 'gap_status',
        at: now(),
        gap: seq,
        status: flags.status,
        ...(typeof flags.note === 'string' ? { note: flags.note } : {})
    });
    console.log(`${obsId} #${seq} -> ${flags.status}`);
};

/**
 * The enum is kept, and a note is added beside it. The drift it was drifting toward was real --
 * one recording closed with "built, gated and committed; stopped at the reproduction gap for an
 * operator decision", which is more informative than any of three words -- but the remedy is a slot
 * for the prose, not an open field. An enum is the only form a close reason can be counted in, and
 * a corpus that cannot be counted cannot say whether recordings are finishing. So: the enum carries
 * the machine-readable fact, the note carries what the enum cannot, and the note is required
 * whenever the recording did not simply finish.
 */
const close = async (flags: Record<string, string | true>): Promise<void> => {
    const obsId = await resolveOpen(flags);
    const why = typeof flags.why === 'string' ? flags.why : 'completed';
    if (!isCloseReason(why)) {
        refuse(`--why must be one of: ${CLOSE_REASONS.join(', ')} — anything the enum cannot say goes in --note.`);
    }
    const note = typeof flags.note === 'string' ? flags.note : null;
    if (why !== 'completed' && !note) {
        refuse(`--note is required when --why is ${why}: the enum says it stopped, the note says what stopped it.`);
    }

    await append(obsId, { event: 'close', at: now(), why, note, entries: await nextSeq(obsId) });
    console.log(`${obsId} closed: ${why}${note ? ` — ${note}` : ''}`);
};

/**
 * A gap's status is the latest `gap_status` event for it, else the status written with the entry.
 * Absent in neither place means the record predates the split -- reported as `unrecorded`, never
 * defaulted to `open`, because assuming a gap is open when nothing says so is the same wrong
 * confidence the split was made to remove. `disposition` is printed verbatim, including values
 * outside today's enum, because older records hold some and the drift is evidence.
 */
const gapLedger = (all: Record<string, unknown>[]): string[] => {
    const latest = new Map<number, string>();
    for (const l of all) {
        if (l.event === 'gap_status' && typeof l.gap === 'number') latest.set(l.gap, String(l.status));
    }
    return all
        .filter((l) => l.kind === 'gap')
        .map((l) => {
            const seq = Number(l.seq);
            const written = typeof l.status === 'string' ? l.status : 'unrecorded';
            const now_ = latest.get(seq) ?? written;
            const disp = typeof l.disposition === 'string' ? l.disposition : 'unrecorded';
            const what = String(l.what ?? '').slice(0, 64);
            return `  #${seq} ${now_} [${disp}] ${what}`;
        });
};

const status = async (flags: Record<string, string | true>): Promise<void> => {
    const open = await listOpen();
    if (open.length === 0) {
        const total = (await listObservations()).length;
        console.log(total === 0 ? 'no recordings' : `no recording open (${total} closed)`);
        return;
    }
    if (open.length > 1 && typeof flags.obs !== 'string') {
        console.log(`${open.length} recordings open:`);
        for (const id of open) {
            const n = (await lines(id)).filter((l) => typeof l.seq === 'number').length;
            console.log(`  ${id} — ${n} entries`);
        }
        return;
    }
    const obsId = typeof flags.obs === 'string' ? flags.obs : open[0]!;
    const all = await lines(obsId);
    const entries = all.filter((l) => typeof l.seq === 'number');
    const digressions = entries.filter((l) => l.in_band === false).length;
    const byKind = entries.reduce<Record<string, number>>((acc, l) => {
        const k = String(l.kind);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
    }, {});
    console.log(`${obsId} open — ${entries.length} entries (${digressions} out of band)`);
    console.log(Object.entries(byKind).map(([k, n]) => `  ${k}: ${n}`).join('\n') || '  (none yet)');
    const gaps = gapLedger(all);
    if (gaps.length > 0) console.log(`gaps:\n${gaps.join('\n')}`);
    console.log(`  record: ${recordPath(obsId)}`);
};


/**
 * Prints the instructions a recorder is given. It exists so that a caller hands out a
 * *reference* rather than pasted text: instructions retyped into each prompt go stale the
 * first time this tool changes, and nothing announces that they have.
 */
const brief = async (flags: Record<string, string | true>): Promise<void> => {
    const subject = typeof flags.subject === 'string' ? flags.subject : '<ticket>';
    const dir = root();
    console.log(`## Record what you do, as you do it

Open a recording before anything else, and use the id it prints on every later call:

\`\`\`
export OBSERVE_DIR=${dir}
cd ${process.cwd()}
bun tools/observe/observe.ts open --subject ${subject} --model <model> --harness <harness> --workspace <path>
\`\`\`

Then record each discrete thing you do:

\`\`\`
observe add --obs <id> --kind command  --what "<why you ran it>" --cmd "<command>" --exit <code> --effect read|write
observe add --obs <id> --kind decision --what "<what you concluded>" --among "<options>" --chose "<choice>"
observe add --obs <id> --kind prompt   --what "<what you asked for>" --asked "<the ask>" --outcome "<what actually happened>"
observe add --obs <id> --kind ui       --what "<what you did>" --surface "<where>"
observe add --obs <id> --kind handoff  --what "<what you handed off>" --to "<who>" --reconciled_by <seq|null>
observe add --obs <id> --kind gap      --what "<what you could not see>" --why "<reason>" --tool "<what could not look>" --disposition deferred|unobservable|not_permitted [--status open|corrected|worked_around|escalated|resolved]
observe add --obs <id> --kind meta_change      --what "<why it changed>" --field model|harness|workspace --to "<new value>"
observe add --obs <id> --kind instrument_fault --what "<how the recording itself failed or was corrected>"
\`\`\`

And when a gap you recorded earlier is later closed, worked around or escalated, say so — do not rewrite the entry:

\`\`\`
observe gap --obs <id> --seq <n> --status corrected --note "<what closed it>"
\`\`\`

Rules:

- **A gap carries \`--tool\`, \`--disposition\` and \`--status\`, and the last two are different questions.** \`--disposition\` is **why it could not be seen**, fixed forever at the moment you noticed it: \`deferred\` = a later phase can see it; \`unobservable\` = nothing available can; \`not_permitted\` = the instrument declined, which reads exactly like an absent value and is the one that misleads. \`--status\` is **what has become of it**, defaults to \`open\`, and is revised later with \`observe gap\`. **Never put an outcome in \`--disposition\`** — a gap whose text begins "RESOLVED" while its disposition says \`unobservable\` is counted as still open by everything that reads it.
- **\`meta_change\` is only for a change of attribution** — the model, the harness or the workspace changed mid-recording, so everything after it has a different provenance from everything before. **A failure of the recorder itself is \`instrument_fault\`**: it describes the instrument, not the work, and mixing the two makes neither countable.
- **Record dead ends and false starts.** A record of only the successful path produces a workflow that cannot recover, which is the most common way these fail.
- **Mark a digression \`--out-of-band\`** rather than leaving it out. How often work is interrupted is itself a finding.
- **A \`prompt\` carries its \`outcome\`**, not just the ask — the ask does not determine the result, so the result is the fact.
- **Close it when you finish**: \`observe close --obs <id> --why completed|abandoned|interrupted [--note "<detail>"]\`. A recording with no terminator cannot be told from one still running. \`--why\` stays one of the three words so closes can be counted; **\`--note\` is required unless you closed \`completed\`**, and is where anything the three words cannot say belongs.`);
};

const USAGE = `observe — record work as it happens, so a workflow can be derived from it

  open   --subject <ticket> [--model <m>] [--harness <h>] [--workspace <p>]   → prints <ticket>_<id>
  add    --kind <${KINDS.join('|')}> --what <text> [--effect read|write] [--step <s>] [--out-of-band] [--obs <id>] [--<field> <v> ...]
  label  --seq <n> --step <s> [--obs <id>]     assign a step to an earlier entry
  gap    --seq <n> --status <${GAP_STATUSES.join('|')}> [--note <t>] [--obs <id>]
                                               record what became of an earlier gap
  close  [--why ${CLOSE_REASONS.join('|')}] [--note <text>] [--obs <id>]
  status [--obs <id>]
  brief  [--subject <ticket>]                  print the instructions to hand a recorder

Writes to $OBSERVE_DIR (default ./observations). Off unless opened.
Several recordings may be open at once, including several on one ticket. --obs is optional
while exactly one is open and required once more than one is.

A --kind gap requires --tool and --disposition (${DISPOSITIONS.join('|')}) -- why it could not be
seen -- and carries --status (${GAP_STATUSES.join('|')}, default open) for what became of it.
A --kind meta_change requires --field (${META_FIELDS.join('|')}) and --to; a failure of the
recorder itself is --kind instrument_fault.
--why on close stays an enum so closes can be counted; --note carries what it cannot say, and is
required whenever --why is not completed.`;

const main = async (): Promise<void> => {
    const [command, ...rest] = process.argv.slice(2);
    const flags = parseFlags(rest);
    const routes: Record<string, () => Promise<void>> = {
        open: () => open(flags),
        add: () => add(flags),
        label: () => label(flags),
        gap: () => gap(flags),
        close: () => close(flags),
        status: () => status(flags),
        brief: () => brief(flags)
    };
    const route = routes[command ?? ''];
    if (!route) {
        console.log(USAGE);
        process.exit(command ? 1 : 0);
    }
    await route();
};

await main();
