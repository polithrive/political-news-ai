# Engineering Handoff

## Current Phase

Phase 2B.1C (Story Evidence Snapshot Writer) is complete.

Phase 2B.1D **architecture audit is complete**. Phase 2B.1D **implementation has not started**.

GitHub issue: `polithrive/political-news-ai#1`

## Protected Checkpoint

Do not conflate these:

| Role | Hash | Message |
|---|---|---|
| Application (last runtime change) | `8c633b3e6567418603eb7e6658444655a8d69b15` | Add story evidence snapshot writer |
| Workflow/docs | `b850c79b0ac9954e45e0304a3ec7cc7024c59c3f` | Add agent collaboration workflow |

Repository HEAD at audit time should be `b850c79` or a later docs-only commit. Application behavior remains `8c633b3`.

Parent before 2B.1C: `d13401d` — Add story history database foundation.

## What Was Completed

2B.1C snapshot writer (see previous sections historically). This handoff’s new work is the **2B.1D audit only** (this file + `CURRENT_PHASE.md` wording). No runtime files were changed for the audit.

## Files Changed In Last Completed Phase

Application checkpoint `8c633b3` (12 files): `app/api/story-snapshots/route.ts`, `app/intelligence/[slug]/page.tsx`, `lib/services/buildEvidenceSnapshot.ts`, `lib/services/parseStorySnapshotInput.ts`, `lib/services/persistStorySnapshot.ts`, `lib/services/report.ts`, `lib/services/storyKey.ts`, `lib/services/storySnapshotFingerprint.ts`, `lib/services/storySnapshotInput.ts`, `lib/services/urlAnalysisReport.ts`, `package.json`, `package-lock.json`.

Audit (this pass): `docs/development/HANDOFF.md`, `docs/development/CURRENT_PHASE.md` only.

## Database State

At 2B.1C checkpoint verification: `stories` = 0, `story_snapshots` = 0. Audit did not query or write the database.

## Validation Status

Audit is documentation-only. After this update, run `git diff --check` / `git status` on the docs files. No `npm run build` required for the audit itself.

## Known Limitations / Technical Debt

Unchanged from 2B.1C: client-originated snapshot POST; no Phase 1 revalidation on persist; `story_key` is normalized primary URL only; fingerprint does not unique-dedupe identical fact strings; NewsAPI last-good is in-memory; Story Timeline is unrelated and may initialize from mock data.

## Next Recommended Action

ChatGPT/Ryan review this audit (issue #1). If approved, authorize **2B.1D implementation** of the pure diff + server-only pair lookup + deterministic tests — not What Changed UI.

## Do Not Do Yet

- Visible What Changed UI
- AI-generated story changes
- Semantic story clustering
- Authentication / history personalization
- Unrelated redesign / refactoring
- Schema migration (not required)
- Blocking 2B.1D on server-side fragment revalidation
- Importing `/api/timeline` or mock timeline into history diff

## Questions / Decisions Needed

Reviewer sign-off on:

1. Unique normalized **text/URL sets** as MVP identity (duplicate multiplicity is fingerprint-only noise).
2. Withholding publisher/support/title/`isPrimary` from material categories.
3. Conservative removal labels (missing ≠ false/retracted/resolved).
4. No public read API in 2B.1D.

## Git Status At Handoff

Expected after audit edits (uncommitted until authorized):

- Modified: `docs/development/HANDOFF.md`, `docs/development/CURRENT_PHASE.md`
- No runtime/database/env files

---

# Phase 2B.1D architecture audit

Audit of GitHub issue #1 against the repository. **No diffing implemented.**

## 1. Current architecture trace

Write path (2B.1C):

1. Fresh generate (not report-cache hit) → `{ report, snapshotInput }`.
2. Client `persistStorySnapshotBestEffort` POST `/api/story-snapshots`.
3. `parseStorySnapshotInput` (untrusted body) → `persistStorySnapshot` (`server-only`).
4. `tryBuildStoryKey(primary.url)` → `buildEvidenceSnapshot` (S# → URL by `sourceId`; drop invalid URLs / empty support) → `createStorySnapshotFingerprint` (SHA-256 / `node:crypto`).
5. Upsert `stories` on unique `story_key`; insert `story_snapshots`; `ON CONFLICT (story_id, fingerprint) DO NOTHING`.

There is **no read path** for snapshots today. No latest-pointer column. Neon-http Drizzle; no `db.transaction()`.

Fingerprint payload: canonical source URL **set**, sorted fact/uncertainty/coverage **text arrays** (whitespace collapsed, duplicates kept), `independentSourceCount`, `limitedEvidence`. Not included: publishers, support fragments, source titles, `isPrimary`, `capturedAt`, S# (already absent from JSONB).

`UNIQUE(story_id, fingerprint)` means any two persisted rows for one story are already distinct fingerprint states.

Story Timeline (`getMockTimeline`, `POST /api/timeline`, `StoryTimeline.tsx`) is only used under Deep Analysis. It is not on the persist path.

## 2. Recommended 2B.1D architecture

Smallest split:

1. **Pure** `diffEvidenceSnapshots(previous, current): EvidenceSnapshotDiff` in a module that imports only `EvidenceSnapshotV1` types + the same URL/text canonicalizers used by fingerprint (`tryBuildStoryKey`, `normalizeFingerprintText`). No Drizzle, no Neon, no `node:crypto`, no timeline, no AI.
2. **Server-only** `getLatestDistinctSnapshotPair(storyKey)` that loads the story by `story_key`, then the latest two snapshot rows, and returns `{ previous, current } | { reason: "none" | "single" }`.
3. **No HTTP API and no UI in 2B.1D.** Wire lookup+diff behind an internal function (callable later from a read API or 2B.2). Tests call the pure diff with fixtures; lookup can be unit-tested with mocked `getDb` or a later integration test.

Keep failure isolation: history lookup/diff must never run inside analyze routes or block brief generation.

## 3. Proposed TypeScript diff types/contract

```ts
export type SnapshotTextChange = {
  text: string;
};

export type SnapshotSourceChange = {
  url: string;
};

export type EvidenceSnapshotDiff = {
  hasMaterialChange: boolean;
  sourcesAdded: SnapshotSourceChange[];
  sourcesMissingFromNewer: SnapshotSourceChange[];
  factsAdded: SnapshotTextChange[];
  factsMissingFromNewer: SnapshotTextChange[];
  uncertaintiesAdded: SnapshotTextChange[];
  uncertaintiesMissingFromNewer: SnapshotTextChange[];
  coverageDifferencesAdded: SnapshotTextChange[];
  coverageDifferencesMissingFromNewer: SnapshotTextChange[];
  independentSourceCount: {
    previous: number;
    current: number;
  };
  limitedEvidence: {
    previous: boolean;
    current: boolean;
  };
};
```

MVP **include:** all of the above (set membership + the two scalar fields).

MVP **withhold:** source title / sourceName / publishedAt / isPrimary; fact publishers; support fragment/field/publisher; primary title/sourceName/publishedAt; `capturedAt`; schema_version; any “resolved” or “retracted” boolean.

Do not name fields `factsRetracted`, `uncertaintiesResolved`, or `sourcesRemoved` if that implies real-world retraction. `MissingFromNewer` is the required semantics.

## 4. Exact deterministic comparison rules

Canonicalize then compare **unique sets** (sorted arrays in the output for stability):

| Entity | Identity |
|---|---|
| Source | `tryBuildStoryKey(url)` if valid, else exclude from comparison (persisted rows should already be keys) |
| Fact | `normalizeFingerprintText(fact.text)` nonempty |
| Uncertainty | `normalizeFingerprintText(item)` nonempty |
| Coverage difference | `normalizeFingerprintText(item.text)` nonempty |
| Independent count | integer equality |
| limitedEvidence | boolean equality |

Set operations: `added = current \ previous`, `missingFromNewer = previous \ current`. Output arrays `localeCompare` sorted.

`hasMaterialChange` is true iff any added/missing set is nonempty OR counts differ OR `limitedEvidence` differs.

Ignore array order, duplicate URLs/texts within a snapshot, whitespace-only text differences, publisher spelling, support fragments, S#, timestamps.

**Exact normalized equality is sufficient for MVP.** Tradeoffs:

- **False negatives:** paraphrased same claim (`"Senate passed the bill"` vs `"the bill passed the Senate"`) looks like add + missing, not one edited fact. No embedding/AI matching in 2B.1D.
- **False positives:** trivial punctuation/casing (beyond whitespace collapse) looks like a new fact. Fingerprint already has the same limitation.
- Duplicate multiplicity (`["A","A"]` vs `["A"]`) is **not** a reader-material change; unique sets ignore it.

## 5. Conservative semantics for removals

Absence from the newer snapshot means only: **the later persisted evidence snapshot does not contain that string/URL.**

It does **not** mean: the claim is false; a publisher retracted; an uncertainty was resolved; coverage disagreement ended; a source disappeared from the world.

Internal/history copy (and any future 2B.2 UI) must use that wording. No AI layer in 2B.1D. 2B.2 may phrase later but must not invent causes.

## 6. Retrieval/query design

Server-only:

1. `SELECT id FROM stories WHERE story_key = $key LIMIT 1`. Missing story → `none`.
2. `SELECT id, captured_at, fingerprint, evidence FROM story_snapshots WHERE story_id = $id ORDER BY captured_at DESC, id DESC LIMIT 2`.

Tie-break: `id DESC` is deterministic. Snapshot `id` is `gen_random_uuid()`, so equal `captured_at` is ordered stably but not by wall-clock insert order. That is acceptable for MVP; concurrent same-millisecond inserts of two different fingerprints are rare.

- 0 rows → no diff (`none`)
- 1 row → no diff (`single`); fingerprint uniqueness does not create a pair
- 2+ rows → `current = rows[0]`, `previous = rows[1]` (already distinct fingerprints)

Do not diff by taking “latest vs any older with same fingerprint” — duplicates are not stored.

Lookup input is `story_key` (normalized primary URL), not client story UUID.

## 7. Schema/index verdict

**No migration.** Existing unique `(story_id, fingerprint)` plus index `(story_id, captured_at DESC)` is sufficient for `LIMIT 2` per story. A composite `(story_id, captured_at DESC, id DESC)` index is optional later, not required. Do not add `latest_snapshot_id`.

## 8. Trust-boundary verdict

**Do not block 2B.1D** on server-side Phase 1 revalidation.

Diffs are **internal comparisons of stored `EvidenceSnapshotV1` JSON**, not independently re-proven evidence. Visible claims (2B.2) must stay conservative and must not say the server re-validated fragments. Moving persist fully server-side remains debt, not a 2B.1D gate.

## 9. Test matrix

Pure `diffEvidenceSnapshots` fixtures (no DB):

| Case | Expected |
|---|---|
| Identical snapshots | `hasMaterialChange === false`, empty sets, equal scalars |
| Source URL added only | `sourcesAdded` only |
| Source URL missing from newer | `sourcesMissingFromNewer` only; **not** retracted |
| Corroborated fact text added | `factsAdded` |
| Fact text missing from newer | `factsMissingFromNewer`; **not** false/retracted |
| Uncertainty added | `uncertaintiesAdded` |
| Uncertainty missing from newer | `uncertaintiesMissingFromNewer`; **not** resolved |
| Coverage difference added/removed | corresponding coverage sets |
| `independentSourceCount` increase/decrease | scalars differ; `hasMaterialChange` true even if sets empty |
| `limitedEvidence` true→false and false→true | same |
| Source reordering only | no material change |
| Whitespace-only fact/uncertainty/coverage text | no material change |
| Duplicate source URLs in one snapshot | treated as one URL |
| Duplicate identical fact strings vs one copy | no material change (unique set) |
| Publisher/support/title/`isPrimary` only | no material change |
| Same fingerprint-aligned payload | `hasMaterialChange === false` |

Retrieval (mock DB or documented integration):

| Case | Expected |
|---|---|
| 0 snapshots | `none` |
| 1 snapshot | `single` |
| 2+ snapshots | pair, newest `captured_at` (then `id`) is `current` |
| Equal `captured_at` | stable `id DESC` order |
| Same event, different primary URLs | different `story_key`s; pairs never mixed |

Fingerprint alignment tests: build two snapshots, compare `createStorySnapshotFingerprint` vs `hasMaterialChange` (see §10).

No test may import timeline mocks as history input.

There is currently **no** unit-test runner in `package.json`; 2B.1D implementation should add a minimal one (e.g. `node:test` or vitest) for these fixtures only.

## 10. Risks / edge cases

**Fingerprint vs diff (intentional):**

- Duplicate fact/uncertainty/coverage **multiplicity** can change the fingerprint (sorted arrays) while unique-set diff reports no material change. **Prefer the diff.** Do not “fix” fingerprint in 2B.1D unless separately authorized; document the mismatch.
- Publisher/support/title-only edits: fingerprint **unchanged** → second snapshot **not stored**. Diff of persisted pairs will never see those as the sole delta. Pure-function comparison must also ignore them so in-memory tests match persist behavior.

**Fingerprint vs diff (should not happen if rules above are followed):**

- Diff reporting material change while fingerprints match: would mean leaking withheld fields into identity. Tests must forbid this.

Other risks:

- Paraphrase splits one claim into add+missing.
- Client MVP POST: diffs inherit untrusted-but-parsed snapshot quality.
- Empty DB: lookup returns none; UI later must no-op.
- neon-http: two sequential queries (story then snapshots) is fine; no transaction required.

## 11. Exact files that implementation would add/modify

**Add**

- `lib/services/diffEvidenceSnapshots.ts` — pure diff
- `lib/services/getStorySnapshotPair.ts` — `server-only` lookup
- a small test file next to the diff module (or `lib/services/diffEvidenceSnapshots.test.ts`)
- possibly `package.json` test script if a runner is introduced

**Do not modify for 2B.1D**

- `app/api/analyze/**`, `app/api/analyze-url/**`
- brief UI, report cache, timeline
- `lib/db/schema.ts` / drizzle migrations
- persist path, unless a later authorized fingerprint-dedupe change

**Do not add in 2B.1D**

- What Changed UI
- public GET history API (optional later)
- AI phrasing

## 12. Whether implementation is ready to authorize

**Yes — 2B.1D implementation of the contract above is ready to authorize** after this audit is reviewed.

**No** to Phase 2B.2 UI, schema changes, timeline coupling, or treating diffs as independently re-validated evidence.

## Documentation-state note (issue §10)

`CURRENT_PHASE.md` previously listed `8c633b3` as “current protected checkpoint” after `b850c79` landed. Correct wording: **application checkpoint `8c633b3`**, **workflow checkpoint `b850c79`**. 2B.1D audit complete; 2B.1D implementation not complete.
