/* ---------------------------------------------------------------------------
 * store_trace.js -- record state-container frames from the browser console.
 *
 * PURPOSE
 *   Subscribe to the app's own store and record a frame every time a watched
 *   value changes, with a `performance.now()` timestamp. This sees what DOM
 *   polling and a human observer both miss: state that exists for tens of
 *   milliseconds. In the session that produced this tool, a 33 ms empty frame
 *   was the entire bug.
 *
 * HOW TO USE
 *   Paste this whole file into the console of a HEADED browser attached to the
 *   dev server (claude-in-chrome's javascript_tool). Headed matters — it
 *   inherits the real logged-in session; headless does not.
 *
 *     1. edit CONFIG below (storeModule, select, watch)
 *     2. paste and run  -> installs window.__trace
 *     3. perform the action under test
 *     4. window.__trace.report()   -> frames + transient durations
 *     5. window.__trace.stop()     -> unsubscribe when done
 *
 * INPUTS   CONFIG object at the top of the file. Nothing else.
 * OUTPUTS  window.__trace = { frames, report(), stop(), reset(), config }
 *          report() returns { frames, transients, summary } — see below.
 *
 * WHY THE DYNAMIC IMPORT
 *   A dev server that serves modules individually (Vite) lets you reach the
 *   store from page context even when it was never attached to `window`:
 *       const mod = await import('/path/to/store/module.ts');
 *       const store = mod.SomeNamespace.store;
 *   Adjust CONFIG.storeModule / CONFIG.storePath per app. Against a production
 *   bundle this will not work — there is no module graph to import from.
 *
 * ⚠️ WARNING 1 — NEVER ADD A DEPENDENCY TO A MEMO OR EFFECT WHILE INSTRUMENTING.
 *   Adding a dependency to useMemo/useEffect so it can log something CHANGES THE
 *   SCHEDULING OF THE THING YOU ARE MEASURING, and in a race it fixes the bug.
 *   That happened, and it produced three consecutive false passes before anyone
 *   noticed the instrumentation was the fix. This tool exists precisely so no
 *   source file has to be touched: it observes from outside the component tree.
 *   Wrap, never rewrite.
 *
 * ⚠️ WARNING 2 — DO NOT PATCH `fetch` ON AN AXIOS APP.
 *   Monkey-patching window.fetch to inject latency or log requests is a common
 *   next move and it is silently a no-op on an app that uses axios/XHR. You
 *   will conclude "no requests happened" from an instrument that was never
 *   wired up. Confirm the transport first (look for XMLHttpRequest in the
 *   network initiator column) before believing anything a fetch patch reports.
 * ------------------------------------------------------------------------- */

(async () => {
  // ===== CONFIG =============================================================
  const CONFIG = {
    // Module that exposes the store, served by the dev server. REPLACE per app --
    // find it by grepping for where the store is created, not where it is imported.
    storeModule: '/REPLACE/path/to/store/module.ts',
    // Dotted path to the store inside that module's exports. REPLACE per app.
    storePath: 'REPLACE.store',

    // The slice of state this run cares about. Keep it cheap — it runs on
    // EVERY dispatch.
    select: (state) => state.collections[CONFIG.collectionKey],

    // Only used by the default `select` above; harmless otherwise.
    collectionKey: 'REPLACE_ME',

    // The values whose change defines a new frame. Keys become frame fields,
    // and any change in any of them records a frame. Keep these primitives —
    // they are compared with !==.
    watch: {
      watchable: (s) => s?.watchable,
      ready: (s) => s?.ready,
      n: (s) => s?.ids?.size ?? s?.ids?.length ?? 0,
    },

    // Optional: a frame is "transient" (a candidate race signature) when this
    // returns true. Default: an empty collection.
    isTransient: (frame) => frame.n === 0,

    // Guard rail — stop recording rather than growing without bound.
    maxFrames: 2000,
    // Log each frame to the console as it happens.
    echo: true,
  };
  // ==========================================================================

  const resolve = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  const mod = await import(CONFIG.storeModule);
  const store = resolve(mod, CONFIG.storePath);
  if (!store || typeof store.subscribe !== 'function') {
    throw new Error(
      `store_trace: no store at ${CONFIG.storeModule} -> ${CONFIG.storePath}. ` +
      `Check the path, and check you are on the dev server (a prod bundle has no module graph).`
    );
  }

  if (window.__trace && typeof window.__trace.stop === 'function') window.__trace.stop();

  const watchKeys = Object.keys(CONFIG.watch);

  const readFrame = () => {
    let slice;
    try {
      slice = CONFIG.select(store.getState());
    } catch (e) {
      slice = undefined;
    }
    const frame = { t: performance.now() };
    for (const k of watchKeys) {
      try {
        frame[k] = CONFIG.watch[k](slice);
      } catch (e) {
        frame[k] = '<throw>';
      }
    }
    return frame;
  };

  const changed = (prev, next) => {
    if (!prev) return true;
    return watchKeys.some((k) => prev[k] !== next[k]);
  };

  const frames = [];
  let dropped = 0;

  const snap = () => {
    const next = readFrame();
    const prev = frames[frames.length - 1];
    // Record on CHANGE only. Recording every dispatch buries the trace — a
    // normal page does thousands, and the frame that matters is one of them.
    if (!changed(prev, next)) return;
    if (frames.length >= CONFIG.maxFrames) { dropped += 1; return; }
    frames.push(next);
    if (CONFIG.echo) console.log('[__trace]', JSON.stringify(next));
  };

  snap();
  const unsubscribe = store.subscribe(snap);

  /* Duration of each frame = when the NEXT frame replaced it. The last frame is
   * still live, so its duration is measured to "now" and flagged open-ended.
   * This is the number that distinguishes "a render committed during the gap"
   * from "the gap never existed": a transient state lasting tens of ms is long
   * enough for React to commit a render against it, which is what makes it a
   * race rather than a curiosity. */
  const withDurations = () => {
    const now = performance.now();
    return frames.map((f, i) => {
      const end = i + 1 < frames.length ? frames[i + 1].t : now;
      return {
        ...f,
        t: Math.round(f.t),
        durationMs: Math.round(end - f.t),
        open: i + 1 === frames.length,
        transient: (() => { try { return !!CONFIG.isTransient(f); } catch (e) { return false; } })(),
      };
    });
  };

  window.__trace = {
    config: CONFIG,
    frames,
    stop() { unsubscribe(); return `[__trace] stopped after ${frames.length} frames`; },
    reset() { frames.length = 0; dropped = 0; snap(); return '[__trace] reset'; },
    report() {
      const detailed = withDurations();
      const transients = detailed.filter((f) => f.transient);
      return {
        frames: detailed,
        transients,
        summary: {
          frameCount: detailed.length,
          dropped,
          spanMs: detailed.length ? detailed[detailed.length - 1].t - detailed[0].t : 0,
          transientCount: transients.length,
          longestTransientMs: transients.reduce((m, f) => Math.max(m, f.durationMs), 0),
          // A transient long enough to be rendered against is the race signature.
          // Sub-millisecond transients are usually just two dispatches in a tick.
          raceSuspected: transients.some((f) => f.durationMs >= 1 && !f.open),
        },
      };
    },
  };

  console.log(
    `[__trace] watching ${watchKeys.join(', ')} via ${CONFIG.storePath}. ` +
    `Perform the action, then call window.__trace.report(), then window.__trace.stop().`
  );
  return window.__trace.report().summary;
})();
