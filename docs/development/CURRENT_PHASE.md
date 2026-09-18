# Current Phase

Product: The Angle Report

## Checkpoints (do not conflate)

- **Protected application checkpoint (2B.1C):** `8c633b3` — Add story evidence snapshot writer
- **Protected workflow/docs checkpoint:** `b850c79` — Add agent collaboration workflow
- **2B.1D audit:** `fc81f5a` — Document Phase 2B.1D architecture audit
- **Protected application checkpoint (2B.1D):** `43b5d95` — Add deterministic story snapshot diffing
- **2B.2 audit:** `d6b0dc2` — Document Phase 2B.2 What Changed audit
- **Protected application checkpoint (2B.2):** this implementation commit — Add What Changed reader experience

## Completed

- Phase 2B.1B — story-history database foundation
- Phase 2B.1C — evidence snapshot writer
- Phase 2B.1D — deterministic snapshot diff + pair lookup
- Phase 2B.2 audit
- Phase 2B.2 implementation — reader-facing What Changed module

## Current state

- What Changed appears in the 60-second brief only when the reader view model is non-empty.
- Missing-from-newer and count-only diffs stay internal.
- Fresh generate: setReport first, then persist POST returns `whatChanged`.
- Cache hit: GET `/api/story-snapshot-changes`.
- History failure cannot break the brief.

## Next planned phase

Not started. Do not add AI phrasing, clustering, or a public history feed unless separately authorized.
