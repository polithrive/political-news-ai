# Current Phase

Product: The Angle Report

Current protected checkpoint: `8c633b3` — Add story evidence snapshot writer

## Completed

- Phase 2B.1B — story-history database foundation
- Phase 2B.1C — evidence snapshot writer

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

Phase 2B.1D — deterministic snapshot diffing.

**IMPORTANT:** Phase 2B.1D has **not** started.

Do not implement visible What Changed UI yet.

## Future

Phase 2B.2 — visible What Changed experience after deterministic diffing has been validated.
