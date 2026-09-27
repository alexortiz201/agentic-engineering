#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# flake_triage.sh — decide whether full-suite failures are real regressions or
#                   load-induced flakes, by re-running the named suites alone.
#
# PURPOSE
#   A full run reports suite X failing. Before spending an hour on X, re-run X
#   BY ITSELF. A regression is deterministic; a flake is not. This script does
#   that mechanically, one suite at a time, and prints a verdict per suite.
#
# THE TELL
#   A real regression is STABLE across runs: the same suite, the same assertion,
#   every time, isolated or not. Load-induced failures VARY. The signature is
#   two consecutive full runs failing DIFFERENT, NON-OVERLAPPING suites — that
#   pattern is almost never a code change, because a code change cannot pick a
#   different victim each run. The failure modes to expect are test timeouts and
#   "element not found" assertions that run after a render, i.e. failures whose
#   cause is the machine being too busy to finish work inside a timeout, not the
#   work being wrong.
#
# INPUTS
#   --test-cmd <cmd>  Runner, with flags, that accepts a suite path as its last
#                     argument (default: yarn test --collectCoverage=false).
#                     Split on whitespace — no embedded quoted arguments.
#   --suite <path>    A suite reported as failing in the full run. Repeatable.
#                     Required, at least one.
#   --cwd <dir>       Directory to run in (default: current directory).
#   --repeat <n>      Isolated runs per suite (default 1). Use 2-3 when the
#                     first isolated run passes but you want stability evidence.
#   --log-dir <dir>   Where to write per-run output (default: a mktemp dir).
#   --help
#
# OUTPUTS
#   Per suite: isolated pass/fail (vs. the full-run failure you already have),
#   the log path, and a verdict — LIKELY LOAD FLAKE / LIKELY REAL.
#
# EXIT CODES
#   0  every named suite passed in isolation (all likely load flakes)
#   1  bad usage
#   8  at least one suite failed in isolation (at least one likely real)
#
# THE RULE THAT IS NOT NEGOTIABLE
#   NEVER RUN A FULL SUITE CONCURRENTLY WITH BROWSER AUTOMATION. A jest/vitest
#   full run saturates every core; a claude-in-chrome script then starves and
#   times out at 45 seconds, and you get two broken things to debug instead of
#   none. Finish one, then start the other. This script warns when the load
#   average is already high for the same reason: a triage run started on a busy
#   machine reproduces the very flake it is trying to rule out.
#
# Non-destructive: runs tests, writes logs, changes nothing else.
# ---------------------------------------------------------------------------

usage() { awk 'NR<3 { next } /^#/ { started=1; sub(/^# ?/, ""); print; next } started { exit }' "$0"; }

TEST_CMD="yarn test --collectCoverage=false"
RUN_CWD="$(pwd)"
REPEAT=1
LOG_DIR=""
SUITES=()

while [ $# -gt 0 ]; do
  case "$1" in
    --test-cmd) TEST_CMD="${2:?--test-cmd needs a value}"; shift 2 ;;
    --suite)    SUITES+=("${2:?--suite needs a value}"); shift 2 ;;
    --cwd)      RUN_CWD="${2:?--cwd needs a value}"; shift 2 ;;
    --repeat)   REPEAT="${2:?--repeat needs a value}"; shift 2 ;;
    --log-dir)  LOG_DIR="${2:?--log-dir needs a value}"; shift 2 ;;
    -h|--help)  usage; exit 0 ;;
    *) echo "flake_triage: unknown argument '$1' (see --help)" >&2; exit 1 ;;
  esac
done

if [ "${#SUITES[@]}" -eq 0 ]; then
  echo "flake_triage: at least one --suite is required (see --help)" >&2
  exit 1
fi
[ -d "$RUN_CWD" ] || { echo "flake_triage: no such --cwd: $RUN_CWD" >&2; exit 1; }
[ -n "$LOG_DIR" ] || LOG_DIR="$(mktemp -d "${TMPDIR:-/tmp}/flake-triage.XXXXXX")"
mkdir -p "$LOG_DIR"

echo "== flake_triage"
echo "   cwd      : $RUN_CWD"
echo "   test cmd : $TEST_CMD <suite>"
echo "   suites   : ${SUITES[*]}"
echo "   repeat   : $REPEAT"
echo "   logs     : $LOG_DIR"
echo

# --- load check -----------------------------------------------------------
NCPU="$(sysctl -n hw.ncpu 2>/dev/null || echo 1)"
LOAD1="$(sysctl -n vm.loadavg 2>/dev/null | awk '{print $2}')"
[ -n "$LOAD1" ] || LOAD1="$(uptime | sed 's/.*averages*: *//' | awk '{print $1}' | tr -d ',')"
echo "-- system load: 1-min ${LOAD1:-?} across ${NCPU} cores"
if [ -n "${LOAD1:-}" ] && awk -v l="$LOAD1" -v n="$NCPU" 'BEGIN { exit !(l > n * 0.7) }'; then
  cat <<'WARN'
   !! LOAD IS ALREADY HIGH.
   !! Triage started on a busy machine reproduces the flake it is trying to
   !! rule out, and an isolated "failure" here proves nothing.
   !! Stop any dev servers / browser automation and re-run.
   !! And in general: NEVER run a full suite concurrently with browser
   !! automation — CPU starvation produced 45s script timeouts.
WARN
fi
echo

# --- isolated re-runs -----------------------------------------------------
read -r -a CMD_ARR <<< "$TEST_CMD"
any_real=0

for suite in "${SUITES[@]}"; do
  safe="$(echo "$suite" | tr '/ ' '__')"
  passes=0
  fails=0
  for i in $(seq 1 "$REPEAT"); do
    log="$LOG_DIR/${safe}.run${i}.log"
    echo "-- isolated run $i/$REPEAT: ${CMD_ARR[*]} $suite"
    if ( cd "$RUN_CWD" && "${CMD_ARR[@]}" "$suite" ) >"$log" 2>&1; then
      echo "   PASS  ($log)"
      passes=$((passes + 1))
    else
      echo "   FAIL  ($log)"
      tail -20 "$log" | sed 's/^/      /'
      fails=$((fails + 1))
    fi
  done

  echo
  printf '   SUITE   %s\n' "$suite"
  printf '   full run reported : FAIL (the input to this triage)\n'
  printf '   isolated          : %s pass / %s fail of %s\n' "$passes" "$fails" "$REPEAT"
  if [ "$fails" -eq 0 ]; then
    printf '   VERDICT : LIKELY LOAD FLAKE — passes alone, fails only under a full run.\n'
    printf '             Re-run the full suite on an idle machine before treating it as a defect.\n'
  else
    printf '   VERDICT : LIKELY REAL — fails in isolation, so load is not the explanation.\n'
    printf '             Read %s and treat it as a regression.\n' "$LOG_DIR/${safe}.run1.log"
    any_real=1
  fi
  echo
done

echo "== logs in $LOG_DIR"
if [ "$any_real" -ne 0 ]; then
  echo "== at least one suite is LIKELY REAL" >&2
  exit 8
fi
echo "== all named suites pass in isolation — the full-run failures are likely load flakes"
echo "   confirmation: two consecutive full runs failing DIFFERENT, non-overlapping suites"
echo "   is the load signature; the same suite failing twice is not."
exit 0
