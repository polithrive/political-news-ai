# Engineering Handoff

## Current Phase

Phase 2B.1C (Story Evidence Snapshot Writer) is complete and checkpointed.

Phase 2B.1D (deterministic snapshot diffing) has **not** started.

## Protected Checkpoint

`8c633b3e6567418603eb7e6658444655a8d69b15`

Message: `Add story evidence snapshot writer`

Parent application baseline before 2B.1C: `d13401d` — Add story history database foundation.

## What Was Completed

Phase 2B.1C adds best-effort persistence of `EvidenceSnapshotV1` after a **successful fresh** homepage or URL analysis.

- Client returns `{ report, snapshotInput }` from `generateIntelligenceReport` / `generateIntelligenceReportFromUrl`. `snapshotInput` is **not** part of `IntelligenceReport` and is **not** written to report-cache v4.
- Intelligence page caches the report, then `persistStorySnapshotBestEffort` POSTs `/api/story-snapshots` (not awaited; local try/catch + fetch `.catch`).
- Cache hits set the cached report and **do not** POST.
- Server treats the body as untrusted: size limits, `parseStorySnapshotInput`, rebuild snapshot + fingerprint, upsert `stories` on unique `story_key`, insert `story_snapshots` with unique `(story_id, fingerprint)`.
- S# IDs are mapped to source URLs by `sourceId` and are not persisted. Invalid URLs and unresolved IDs are dropped; facts with zero remaining support are dropped.
- `/api/analyze` and `/api/analyze-url` remain independent of Neon.

**Known MVP trust limitation:** the POST is client-originated. The server does not re-run Phase 1 fragment-in-title/description validation.

## Files Changed In Last Completed Phase

Application checkpoint `8c633b3` (12 files):

- `app/api/story-snapshots/route.ts`
- `app/intelligence/[slug]/page.tsx`
- `lib/services/buildEvidenceSnapshot.ts`
- `lib/services/parseStorySnapshotInput.ts`
- `lib/services/persistStorySnapshot.ts`
- `lib/services/report.ts`
- `lib/services/storyKey.ts`
- `lib/services/storySnapshotFingerprint.ts`
- `lib/services/storySnapshotInput.ts`
- `lib/services/urlAnalysisReport.ts`
- `package.json`
- `package-lock.json`

Related foundation (already in `d13401d`, not re-done in 2B.1C): `lib/db/*`, `drizzle/0000_story_history_foundation.sql`, `drizzle.config.ts`.

## Database State

At the 2B.1C checkpoint verification:

- `stories` = 0
- `story_snapshots` = 0

No extra migrations. Schema remains unique `story_key` and unique `(story_id, fingerprint)`. No `latest_snapshot_id`.

## Validation Status

2B.1C final pre-commit review:

- `npm run build` succeeded
- `git diff --check` clean
- Neon/Drizzle/`node:crypto` not in the browser bundle
- `.env.local` ignored and untracked
- No secrets in committed files
- Failure isolation and cache contract verified in code

## Known Limitations / Technical Debt

- Client-originated snapshot POST; server does not independently prove Phase 1 validation.
- `story_key` is normalized primary URL only; no semantic event clustering.
- Duplicate identical fact strings are not fingerprint-deduped (brief can theoretically emit them).
- NewsAPI last-good fallback is in-process memory only.
- Story Timeline can still initialize from mock data; it is not a history source.

## Next Recommended Action

Perform Phase 2B.1D architecture audit for deterministic snapshot diffing **before implementing it**.

## Do Not Do Yet

- Visible What Changed UI
- AI-generated story changes
- Semantic story clustering
- Authentication / history personalization
- Unrelated redesign / refactoring

## Questions / Decisions Needed

None required to start the 2B.1D **audit**. Implementation of diffing and What Changed UI remains unauthorized until that audit is approved.

Open debt to keep in mind during 2B.1D: whether snapshot assembly should move fully server-side before diffs are treated as independently trusted.

## Git Status At Handoff

At completion of 2B.1C (after push):

- Branch: `main`
- HEAD: `8c633b3` — Add story evidence snapshot writer
- Working tree: clean
- Remote: `origin/main` at the same commit

Subsequent collaboration-documentation files under `docs/development/` and `.cursor/rules/` (plus `AGENTS.md` updates) are **workflow infrastructure only** and may appear as uncommitted changes. They are not part of the 2B.1C application checkpoint.
