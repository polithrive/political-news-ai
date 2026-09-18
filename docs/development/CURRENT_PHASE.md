# Current Phase

Product: The Angle Report

## Checkpoints (do not conflate)

- **Protected application checkpoint:** `8c633b3` — Add story evidence snapshot writer
- **Protected workflow/docs checkpoint:** `b850c79` — Add agent collaboration workflow

`8c633b3` is the last application-behavior commit. `b850c79` only added agent collaboration files. Story-history runtime behavior is unchanged since `8c633b3`.

## Completed

- Phase 2B.1B — story-history database foundation
- Phase 2B.1C — evidence snapshot writer
- Phase 2B.1D **architecture audit** (documentation only; see `HANDOFF.md`)

## Current database architecture

- Neon / Postgres
- Drizzle
- Tables: `stories`, `story_snapshots`

## Current state

- Fresh successful analyses can persist evidence snapshots best-effort.
- Cache hits do not write snapshots.
- Duplicate fingerprints do not create duplicate snapshots.
- Snapshot persistence cannot break the 60-Second Brief.
- Temporary S# evidence IDs are not persisted.
- Story identity is the normalized primary URL (`story_key`).
- Database had 0 stories / 0 snapshots at the 2B.1C checkpoint.

## Next planned phase

Phase 2B.1D — **implement** deterministic snapshot diffing.

**IMPORTANT:** 2B.1D **implementation has not started.** The audit is complete; code for diffing is not authorized until this audit is reviewed and implementation is explicitly approved.

Do not implement visible What Changed UI yet.

## Future

Phase 2B.2 — visible What Changed experience after deterministic diffing has been validated.
