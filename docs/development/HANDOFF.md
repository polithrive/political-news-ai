# Engineering Handoff

## Current Phase

Phase 2B.1D **implementation is complete** (deterministic snapshot diff + server-only pair retrieval + tests).

Phase 2B.2 (visible What Changed UI) has **not** started.

GitHub issue for the audit: `polithrive/political-news-ai#1`

## Protected Checkpoint

| Role | Hash / identity | Message |
|---|---|---|
| Snapshot writer (2B.1C) | `8c633b3e6567418603eb7e6658444655a8d69b15` | Add story evidence snapshot writer |
| Workflow/docs | `b850c79b0ac9954e45e0304a3ec7cc7024c59c3f` | Add agent collaboration workflow |
| 2B.1D audit | `fc81f5a1019746ebb107d3afaad17b8a43dc3d15` | Document Phase 2B.1D architecture audit |
| 2B.1D implementation | this commit on `main` | Add deterministic story snapshot diffing |

Do not treat 2B.1D as independently re-validated evidence. Diffs compare stored `EvidenceSnapshotV1` JSON only.

## What Was Completed

Implemented the approved 2B.1D audit contract:

- Pure `diffEvidenceSnapshots(previous, current)` using unique normalized source-URL / fact / uncertainty / coverage-text sets plus `independentSourceCount` and `limitedEvidence`.
- Conservative field names (`*MissingFromNewer`). No retracted/resolved/false flags.
- Publisher, support fragment, title, `isPrimary`, timestamps, and S# are ignored.
- Server-only `getLatestDistinctSnapshotPair(storyKey)`: normalize key, select story, `ORDER BY captured_at DESC, id DESC LIMIT 2`.
- Internal `diffLatestStorySnapshots` wires lookup + diff. **No HTTP route.**
- `interpretLatestSnapshotRows` / `sortSnapshotRowsNewestFirst` in `storySnapshotPair.ts` so retrieval semantics can be tested without importing `server-only`.
- `npm test` via `tsx` + `node:test` (24 passing).

Analyze routes, brief UI, report cache, timeline, persist path, and schema were not modified.

## Files Changed In Last Completed Phase

- `lib/services/diffEvidenceSnapshots.ts`
- `lib/services/diffEvidenceSnapshots.test.ts`
- `lib/services/storySnapshotPair.ts`
- `lib/services/getStorySnapshotPair.ts`
- `lib/services/getStorySnapshotPair.test.ts`
- `package.json`
- `package-lock.json`
- `docs/development/CURRENT_PHASE.md`
- `docs/development/HANDOFF.md`

## Database State

No writes or migrations. Schema unchanged: unique `story_key`, unique `(story_id, fingerprint)`, index `(story_id, captured_at DESC)`.

## Validation Status

- `npm test` — 24 passed, 0 failed
- `npm run typecheck` — passed
- `npm run build` — passed
- No `/api` history route added
- `/api/analyze` and `/api/analyze-url` still have no snapshot-pair/Neon lookup imports
- Tests do not import timeline mocks

## Known Limitations / Technical Debt

- Client-originated snapshot POST; server does not re-run Phase 1 fragment validation.
- Unique-set diff can report no material change while fingerprint changes on duplicate text multiplicity (intentional; prefer the diff).
- `story_key` is normalized primary URL only; same event, different URLs remain separate stories.
- Pair lookup is unused by UI until 2B.2.
- Equal `captured_at` tie-break is `id DESC` (stable, not insert-order).

## Next Recommended Action

Review 2B.1D implementation. If approved, authorize Phase 2B.2 What Changed UI that **consumes** `diffLatestStorySnapshots` / `diffEvidenceSnapshots` with conservative copy only.

## Do Not Do Yet

- Visible What Changed UI
- AI-generated story changes
- Public history GET API unless separately authorized
- Semantic story clustering
- Schema migrations / fingerprint rewrite
- Timeline as a history source
- Authentication / history personalization

## Questions / Decisions Needed

None for 2B.1D. 2B.2 still needs explicit authorization.

## Git Status At Handoff

After the 2B.1D implementation push: `main` should be clean and match `origin/main` at the implementation commit.

---

# Phase 2B.1D implementation notes

Approved audit (above, in git history at `fc81f5a`) remains the contract. Implementation followed it.

## Retrieval

`getLatestDistinctSnapshotPair`:

1. `tryBuildStoryKey` — invalid → `{ status: "none" }`
2. Select `stories.id` by `story_key` — missing → `{ status: "none" }`
3. Select snapshots for that `story_id` only (`ORDER BY captured_at DESC, id DESC LIMIT 2`)
4. 0 rows → `none`; 1 → `single`; 2 → `pair` with `current = rows[0]`, `previous = rows[1]`

Different primary URLs never share a pair because they are different `story_key`s.

## Diff rules (as implemented)

Canonicalize with `tryBuildStoryKey` and `normalizeFingerprintText`. Unique sets. Sorted `localeCompare` outputs. `hasMaterialChange` if any set delta or scalar delta.

## Tests

See `lib/services/diffEvidenceSnapshots.test.ts` and `lib/services/getStorySnapshotPair.test.ts`. Matrix from the audit is covered, including fingerprint alignment and the intentional duplicate-multiplicity mismatch.
