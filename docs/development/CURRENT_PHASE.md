# Current Phase

Product: The Angle Report

## Checkpoints (do not conflate)

- **Protected application checkpoint (2B.1C):** `8c633b3` — Add story evidence snapshot writer
- **Protected workflow/docs checkpoint:** `b850c79` — Add agent collaboration workflow
- **2B.1D audit docs:** `fc81f5a` — Document Phase 2B.1D architecture audit
- **Protected application checkpoint (2B.1D):** the commit landing this implementation — Add deterministic story snapshot diffing

`8c633b3` remains the snapshot **writer**. 2B.1D adds deterministic **diff + pair lookup + tests** only.

## Completed

- Phase 2B.1B — story-history database foundation
- Phase 2B.1C — evidence snapshot writer
- Phase 2B.1D architecture audit
- Phase 2B.1D implementation — deterministic snapshot diff, server-only pair retrieval, tests

## Current database architecture

- Neon / Postgres
- Drizzle
- Tables: `stories`, `story_snapshots`
- **No schema change in 2B.1D**

## Current state

- Fresh successful analyses can persist evidence snapshots best-effort.
- Cache hits do not write snapshots.
- Two persisted snapshots for one `story_key` can be compared with `diffEvidenceSnapshots`.
- Latest pair lookup is server-only (`getLatestDistinctSnapshotPair` / `diffLatestStorySnapshots`).
- There is **no** public history API and **no** What Changed UI.
- Temporary S# evidence IDs are not persisted.
- Story identity is the normalized primary URL (`story_key`).

## Next planned phase

Phase 2B.2 — visible What Changed experience **after** this diffing is reviewed.

**IMPORTANT:** Phase 2B.2 has **not** started.

## Future

Do not implement visible What Changed UI until 2B.1D is reviewed and 2B.2 is explicitly authorized.
