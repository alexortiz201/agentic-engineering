#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# pr_preflight.sh — check a PR satisfies the repo's gates BEFORE asking a human
#                   to review it.
#
# PURPOSE
#   Turn "why is this PR BLOCKED?" into a one-command answer. Reports base
#   branch, labels, milestone, mergeability, review decision, and the
#   status-check rollup reduced to the CURRENT state of each context.
#
# THE ROLLUP IS A HISTORY, NOT A SNAPSHOT
#   `gh pr view --json statusCheckRollup` returns EVERY run of every context,
#   oldest first — not the latest one per context. A context that failed at
#   16:39, was fixed, and passed at 17:08 appears as five FAILUREs and one
#   SUCCESS. Counting those rows naively reports a passing PR as "5 check(s)
#   FAILING", which this script did on the first real PR it met, until it learned to
#   de-duplicate. So: group by context name, keep only the most recent run
#   (`completedAt`, falling back to `startedAt` then `createdAt`; an entry with
#   none of them sorts oldest), and judge only that one. Two shapes appear in
#   the rollup and both must be handled — `CheckRun` (`name`, `status`,
#   `conclusion`, `completedAt`) and `StatusContext` (`context`, `state`,
#   `createdAt`).
#
# WHAT IT LOOKS FOR
#   1. A CHECK WHOSE LATEST RUN FAILED. The common, real case.
#   2. MISSING MILESTONE. Some repos run a required `check-milestone` action; a
#      PR with no milestone fails it, sits at BLOCKED, and nothing in the UI
#      explains that the fix is a dropdown. That is one repo's convention, not
#      a universal one, so a missing milestone is a WARNING here. Pass
#      --require-milestone in a repo that actually enforces it to make it a
#      hard failure.
#   3. A REQUIRED CHECK THAT NEVER REPORTED — a rollup entry with no status and
#      no conclusion. UNPROVEN: this is the condition the script was written
#      for, and on the only PR it has ever been run against it found zero. Be
#      sceptical of it as a diagnosis — a context configured as required but
#      never dispatched generally does not appear in the rollup at all, so the
#      symptom is silence, not a null row. It is still reported when seen, but
#      it is not the usual explanation for a blocked PR.
#
# AND `mergeStateStatus: BLOCKED` USUALLY MEANS NOBODY HAS REVIEWED IT
#   On the PR this was verified against, BLOCKED sat next to
#   `reviewDecision: REVIEW_REQUIRED` with every check green. BLOCKED is a
#   branch-protection verdict covering required reviews as well as required
#   checks, and a missing review is by far the most common cause. Read
#   reviewDecision before concluding anything about CI.
#
# INPUTS
#   --pr <number>        PR number. Required.
#   --repo <owner/name>  Optional; defaults to the repo in the current directory.
#   --require-milestone  Treat a missing milestone as a failure, not a warning.
#   --json               Also dump the raw gh JSON at the end.
#   --help
#
# OUTPUTS
#   A readable report of every gate, one row per check context showing its
#   latest run, with FAIL and NEVER REPORTED rows called out, and a final
#   verdict line.
#
# EXIT CODES
#   0  all gates satisfied — safe to request review
#   1  bad usage / gh or jq missing / PR not found
#   9  a gate failed: a failing check, a never-reported required context, or a
#      missing milestone when --require-milestone was passed
#
# READ-ONLY. Uses `gh pr view --json` only. It never edits the PR, never sets a
# milestone or label, never re-runs a workflow. Fixing what it reports is a
# deliberate human action.
# ---------------------------------------------------------------------------

usage() { awk 'NR<3 { next } /^#/ { started=1; sub(/^# ?/, ""); print; next } started { exit }' "$0"; }

PR=""
REPO=""
SHOW_JSON=0
REQUIRE_MILESTONE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --pr)   PR="${2:?--pr needs a value}"; shift 2 ;;
    --repo) REPO="${2:?--repo needs a value}"; shift 2 ;;
    --require-milestone) REQUIRE_MILESTONE=1; shift ;;
    --json) SHOW_JSON=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "pr_preflight: unknown argument '$1' (see --help)" >&2; exit 1 ;;
  esac
done

[ -n "$PR" ] || { echo "pr_preflight: --pr is required (see --help)" >&2; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "pr_preflight: gh is not installed" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "pr_preflight: jq is not installed" >&2; exit 1; }

GH_ARGS=(pr view "$PR" --json
  number,title,url,baseRefName,headRefName,isDraft,labels,milestone,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup)
if [ -n "$REPO" ]; then GH_ARGS+=(--repo "$REPO"); fi

echo "== pr_preflight (read-only)"
echo "   gh ${GH_ARGS[*]}"
echo

if ! DATA="$(gh "${GH_ARGS[@]}" 2>/dev/null)"; then
  echo "pr_preflight: could not read PR #$PR${REPO:+ in $REPO}. Wrong number, wrong repo, or not authenticated." >&2
  exit 1
fi

fail=0
warn=0

echo "-- identity"
echo "$DATA" | jq -r '"   #\(.number)  \(.title)\n   \(.url)\n   \(.headRefName) -> \(.baseRefName)\(if .isDraft then "   [DRAFT]" else "" end)"'

echo
echo "-- labels"
labels="$(echo "$DATA" | jq -r '[.labels[].name] | join(", ")')"
echo "   ${labels:-<none>}"

echo
echo "-- milestone"
milestone="$(echo "$DATA" | jq -r '.milestone.title // ""')"
if [ -z "$milestone" ]; then
  if [ "$REQUIRE_MILESTONE" -eq 1 ]; then
    echo "   MISSING — this repo was declared to enforce one (--require-milestone), so the"
    echo "   required check will FAIL and the PR will sit at BLOCKED."
    echo "   Fix: set a milestone on the PR, then re-run the check."
    fail=1
  else
    echo "   MISSING — warning, not a failure. Some repos run a required \`check-milestone\`"
    echo "   action and most do not; pass --require-milestone in one that does. Otherwise"
    echo "   set it from the ticket if the repo's convention wants it."
    warn=1
  fi
else
  echo "   $milestone"
fi

echo
echo "-- merge state"
echo "$DATA" | jq -r '"   mergeable        : \(.mergeable // "?")\n   mergeStateStatus : \(.mergeStateStatus // "?")\n   reviewDecision   : \(.reviewDecision // "<none yet>")"'
if [ "$(echo "$DATA" | jq -r '.mergeStateStatus // ""')" = "BLOCKED" ] \
   && [ "$(echo "$DATA" | jq -r '.reviewDecision // ""')" = "REVIEW_REQUIRED" ]; then
  echo "   note: BLOCKED here is the missing review, not a check. Branch protection reports"
  echo "         one status for required reviews and required checks alike."
fi

echo
echo "-- status checks (latest run per context)"

# The rollup is a history: every run of every context, oldest first. Collapse it
# to one row per context — the most recent run wins — before judging anything.
# Both CheckRun and StatusContext shapes are normalised here.
LATEST="$(echo "$DATA" | jq '
  [ .statusCheckRollup[]?
    | { name:   ((.name // .context // "<unnamed>") | tostring),
        status: ((.status // "") | tostring),
        concl:  ((.conclusion // .state // "") | tostring),
        ts:     ((.completedAt // .startedAt // .createdAt // "") | tostring) } ]
  | group_by(.name)
  | map( length as $n | (sort_by(.ts) | last) + { runs: $n } )
  | sort_by(.name)')"

context_count="$(echo "$LATEST" | jq 'length')"
if [ "$context_count" -eq 0 ]; then
  echo "   NO CHECKS REPORTED AT ALL — if this repo has required checks, they are all"
  echo "   permanently pending and the PR cannot merge. Do not wait; investigate."
  fail=1
else
  total_runs="$(echo "$DATA" | jq '[.statusCheckRollup[]?] | length')"
  echo "   $context_count context(s), collapsed from $total_runs run(s) in the rollup."
  echo "$LATEST" | jq -r '
    .[]
    | . as $c
    | (if $c.runs > 1 then "   [latest of \($c.runs) runs]" else "" end) as $hist
    | if ($c.status == "" and $c.concl == "") then
        "   NEVER REPORTED  \($c.name)   <- no status and no conclusion\($hist)"
      elif (($c.concl | ascii_upcase) | IN("SUCCESS", "NEUTRAL", "SKIPPED")) then
        "   pass            \($c.name)   (\($c.concl))\($hist)"
      elif ($c.concl == "") then
        "   pending         \($c.name)   (status \($c.status))\($hist)"
      elif (($c.status | ascii_upcase) == "COMPLETED" or $c.status == "") then
        "   FAIL            \($c.name)   (\($c.concl))\($hist)"
      else
        "   pending         \($c.name)   (status \($c.status), \($c.concl))\($hist)"
      end'

  never="$(echo "$LATEST" | jq '[.[] | select(.status == "" and .concl == "")] | length')"
  failing="$(echo "$LATEST" | jq '[.[]
      | select(.concl != "")
      | select((.status | ascii_upcase) == "COMPLETED" or .status == "")
      | select(((.concl | ascii_upcase) as $c | $c != "SUCCESS" and $c != "NEUTRAL" and $c != "SKIPPED"))] | length')"

  if [ "$never" -gt 0 ]; then
    echo
    echo "   $never context(s) NEVER REPORTED — no status and no conclusion on their latest"
    echo "   run. Rare, and unproven as a diagnosis (see the header). Check the workflow"
    echo "   still exists and its path filter still matches before blaming a stale"
    echo "   required-context setting."
    fail=1
  fi
  if [ "$failing" -gt 0 ]; then
    echo
    echo "   $failing check(s) FAILING on their latest run."
    fail=1
  fi
fi

if [ "$SHOW_JSON" -eq 1 ]; then
  echo
  echo "-- raw"
  echo "$DATA" | jq .
fi

echo
if [ "$fail" -eq 0 ]; then
  if [ "$warn" -gt 0 ]; then
    echo "== PASS (with warnings) — no gate failed; read the warnings above before requesting review."
  else
    echo "== PASS — gates satisfied; safe to request review."
  fi
  exit 0
fi
echo "== FAIL — fix the items above before asking for review." >&2
exit 9
