# Engineering Handoff

## Current Phase

Phase 2B.2 **implementation is complete** (What Changed reader module).

GitHub issue: `#2`

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| 2B.1C writer | `8c633b3e6567418603eb7e6658444655a8d69b15` | Add story evidence snapshot writer |
| 2B.1D implementation | `43b5d95f66f1a6d2360e32d9068119ab26e0b80e` | Add deterministic story snapshot diffing |
| 2B.2 audit | `d6b0dc2` | Document Phase 2B.2 What Changed audit |
| 2B.2 implementation | this commit on `main` | Add What Changed reader experience |

Use `git log -1` for the 2B.2 implementation hash after push.

## What Was Completed

Implemented the approved 2B.2 audit:

- `buildWhatChangedViewModel` filters 2B.1D diffs for reader display (facts/uncertainties/coverage/named sources/limitedEvidence notes). Suppresses missing-from-newer and independentSourceCount-only.
- `POST /api/story-snapshots` still persists, then attaches `whatChanged` from the latest pair (or null).
- `GET /api/story-snapshot-changes?url=` returns `{ whatChanged }` or null. Fail closed.
- Intelligence page: `setReport` first; await persist only to set What Changed; cache hits GET once. Isolation preserved.
- UI: What Changed after What we know; header `Reporting updated` only when the module is shown and `previousCapturedAt` exists.

No schema change. Analyze routes untouched. Report cache v4 unchanged. Timeline unused.

## Files Changed In Last Completed Phase

- `lib/services/whatChangedViewModel.ts`
- `lib/services/whatChangedViewModel.test.ts`
- `app/api/story-snapshot-changes/route.ts`
- `app/api/story-snapshots/route.ts`
- `app/components/brief/WhatChanged.tsx`
- `app/components/brief/SixtySecondBrief.tsx`
- `app/components/brief/StoryBriefHeader.tsx`
- `app/intelligence/[slug]/page.tsx`
- `package.json`
- `docs/development/CURRENT_PHASE.md`
- `docs/development/HANDOFF.md`

## Database State

No migrations. Audit/implementation did not require new tables.

## Validation Status

- `npm test` — 33 passed (24 existing + 9 view-model)
- `npm run typecheck` — passed
- `npm run build` — passed; `/api/story-snapshot-changes` listed
- Client bundle does not include `getLatestDistinctSnapshotPair` / `diffLatestStorySnapshots`
- GET unknown URL → `{"whatChanged":null}`
- Browser: homepage still loads; first-visit omit covered by unit tests (DB typically 0/1 snapshots). Full two-snapshot UI needs a story with two persisted fingerprints.

## Known Limitations / Technical Debt

- Client-originated snapshot POST; no Phase 1 revalidation.
- Same event, different primary URL → separate history; module may be absent.
- Late insert of What Changed after persist/GET (accepted; no skeleton).
- Header hydration overlay on homepage is pre-existing (`HomeHero`), not introduced here.

## Next Recommended Action

Review 2B.2. Do not start AI phrasing or clustering without a new issue.

## Do Not Do Yet

- AI-generated change summaries
- Semantic clustering
- Public/user history feed
- Showing missing-from-newer
- Showing independentSourceCount-only
- RSC rewrite of the intelligence page

## Questions / Decisions Needed

None.

## Git Status At Handoff

After push: `main` clean at the 2B.2 implementation commit.

---

The Phase 2B.2 audit contract remains in git at `d6b0dc2` (`HANDOFF.md` history). Implementation followed that contract.
