# Current Phase

Product: The Angle Report

## Checkpoints (do not conflate)

- **Protected application checkpoint (2B.1C):** `8c633b3` — Add story evidence snapshot writer
- **Protected workflow/docs checkpoint:** `b850c79` — Add agent collaboration workflow
- **2B.1D audit:** `fc81f5a` — Document Phase 2B.1D architecture audit
- **Protected application checkpoint (2B.1D):** `43b5d95` — Add deterministic story snapshot diffing

`43b5d95` is the last application-behavior commit. 2B.2 is **audit/design only** until implementation is explicitly authorized.

## Completed

- Phase 2B.1B — story-history database foundation
- Phase 2B.1C — evidence snapshot writer
- Phase 2B.1D — deterministic snapshot diff, server-only pair retrieval, tests
- Phase 2B.2 **architecture + UX audit** (documentation only; see `HANDOFF.md`)

## Current database architecture

- Neon / Postgres
- Drizzle
- Tables: `stories`, `story_snapshots`
- No schema change in 2B.1D or this audit

## Current state

- Snapshot persist is best-effort after fresh generate; cache hits do not write.
- Deterministic diffs exist but are unused by UI.
- There is **no** public history API and **no** What Changed UI.

## Next planned phase

Phase 2B.2 — implement the reader-facing What Changed module **after this audit is approved**.

**IMPORTANT:** 2B.2 **implementation has not started.**

Do not implement visible What Changed UI until this audit is reviewed and implementation is authorized.
