/**
 * xhr_delay.js -- widen a transient async window by delaying matching XHRs.
 *
 * WHY THIS EXISTS
 *   Some defects only appear when an async gap is wide enough for a render to commit
 *   inside it. A collection is cleared and a refetch repopulates it; the defect needs a
 *   render to land during the empty frame. Locally the refetch is fast enough to miss
 *   the window; in production it is wide enough to hit it every time -- which is why the
 *   SAME defect reads "frequency: always" to a customer and "flaky" to a developer, and
 *   why the developer's instinct that it is not reproducible is wrong rather than unlucky.
 *
 *   This widens the local gap on demand, turning a production-only timing defect into a
 *   deterministic manual reproduction. In the case this was built for, the window was
 *   measured directly: 25ms and 36ms did NOT reproduce; 33ms, 125ms and 129ms DID.
 *
 * THE DOCTRINAL CAVEAT -- READ BEFORE USING THIS AS EVIDENCE
 *   A widened window is no longer the defect. This tool is an INVESTIGATION instrument:
 *   it is how you confirm a mechanism and find the boundary. It is not how you capture
 *   evidence that the defect existed, and a recording made under an artificial delay
 *   shows a symptom nobody experienced. Put the weight on a test that forces the
 *   condition deterministically, and say so where there is no organic capture.
 *   See handbook/11_VERIFYING_IN_A_BROWSER.md, "When to skip the pair entirely".
 *
 * WHY XHR AND NOT fetch()
 *   Many applications issue requests through a library that uses XMLHttpRequest rather
 *   than fetch(). Patching window.fetch on such an app is SILENTLY a no-op -- it does not
 *   error, it simply never fires, which reads as "no requests happened" from an instrument
 *   that was never wired up. Confirm the transport first (look for XMLHttpRequest in the
 *   network initiator column) before believing anything a fetch patch reports.
 *
 * WHY IT MATCHES THE BODY, NOT JUST THE URL
 *   An endpoint that carries its subject in the request BODY -- one URL serving every
 *   resource type, RPC-over-POST, GraphQL -- cannot be selected on the URL alone.
 *   Matching the URL would delay every request on the page, which is useless for
 *   isolating one collection. So the pattern is tested against the URL AND the
 *   serialized body. This generalizes to any single-endpoint API.
 *
 * USE
 *   Paste this whole file into the page (devtools console, or a scripting tool), then:
 *     __xhrDelay.on('<substring>', 400)  // delay matching XHRs by 400ms
 *     __xhrDelay.report()                // what has been delayed so far
 *     __xhrDelay.off()                   // restore the original XMLHttpRequest methods
 *
 *   It delays the *send*, which widens the whole round trip. That is the correct knob for
 *   a clear-then-refetch window: the collection is already empty when send is deferred.
 *
 * RUN RECORD
 *   Executed once, against a real application, on the workflow library this came from.
 *   Armed at 900ms; the target refetch matched in the BODY of a POST, was held 900ms and
 *   completed after 1005ms total. The fix under test held with an empty window roughly
 *   eight times wider than the one that had reproduced the defect reliably before it.
 *   This is the only tool in this directory with a recorded successful execution.
 *
 * LIMITS
 *   - Page-scoped. A reload removes it; re-paste after any hard navigation.
 *   - Delays the request, not the response parse. It cannot simulate a slow *render*.
 *   - `off()` restores the saved originals; if another patch wrapped XHR after this one,
 *     restore in reverse order or reload. Do not stack installs -- reload instead.
 *   - It widens a *request*, so it only reproduces defects whose window is bounded by a
 *     round trip. It cannot widen a gap created purely by render scheduling.
 *   - Choose the pattern narrowly. A shared endpoint matched loosely delays the whole page.
 */
(function () {
    if (window.__xhrDelay && window.__xhrDelay.__installed) {
        console.log('[xhr_delay] already installed; call __xhrDelay.off() first to reinstall');
        return;
    }

    var origOpen = XMLHttpRequest.prototype.open;
    var origSend = XMLHttpRequest.prototype.send;

    var state = {
        pattern: null,   // substring matched against the request URL
        ms: 0,
        log: [],
    };

    XMLHttpRequest.prototype.open = function (method, url) {
        this.__dpUrl = String(url);
        this.__dpMethod = method;
        return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        var self = this;
        var args = arguments;
        var url = self.__dpUrl || '';
        var bodyText = '';
        try {
            bodyText = typeof body === 'string' ? body : (body ? String(body) : '');
        } catch (e) { /* opaque body (Blob/FormData); URL matching still applies */ }
        var haystack = url + ' ' + bodyText;
        var matches = state.pattern && haystack.indexOf(state.pattern) !== -1;

        if (!matches || state.ms <= 0) {
            return origSend.apply(self, args);
        }

        var entry = {
            method: self.__dpMethod,
            url: url.length > 220 ? url.slice(0, 220) + '…' : url,
            matchedIn: url.indexOf(state.pattern) !== -1 ? 'url' : 'body',
            delayMs: state.ms,
            deferredAt: Math.round(performance.now()),
            sentAt: null,
            doneAt: null,
        };
        state.log.push(entry);
        console.log('[xhr_delay] holding ' + state.ms + 'ms →', entry.url);

        self.addEventListener('loadend', function () {
            entry.doneAt = Math.round(performance.now());
            console.log('[xhr_delay] completed after ' + (entry.doneAt - entry.deferredAt) + 'ms total');
        });

        setTimeout(function () {
            entry.sentAt = Math.round(performance.now());
            origSend.apply(self, args);
        }, state.ms);
    };

    window.__xhrDelay = {
        __installed: true,
        on: function (pattern, ms) {
            state.pattern = pattern;
            state.ms = ms;
            console.log('[xhr_delay] ON — delaying XHRs matching "' + pattern + '" by ' + ms + 'ms');
            return 'armed';
        },
        off: function () {
            XMLHttpRequest.prototype.open = origOpen;
            XMLHttpRequest.prototype.send = origSend;
            delete window.__xhrDelay;
            console.log('[xhr_delay] OFF — XMLHttpRequest restored');
            return 'restored';
        },
        clear: function () { state.pattern = null; state.ms = 0; return 'disarmed (patch still installed)'; },
        report: function () { return JSON.parse(JSON.stringify(state.log)); },
    };

    console.log('[xhr_delay] installed. Arm with __xhrDelay.on(<urlSubstring>, <ms>)');
})();
