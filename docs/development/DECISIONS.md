# Architecture Decision Log

These are decisions reflected in the current repository. They were not written as dated ADR records; do not invent dates or treat this as a historical ADR archive.

## Product

- The Angle Report represents **stories across sources**, not a single-publisher article summary.
- The **60-Second Brief** is the default reader experience.
- **Deep Analysis** is optional and collapsed by default.
- **Trust Score is de-emphasized** in the primary brief (source-count / evidence-strength only there; full score under Deep Analysis).
- Do **not** force every story into Left / Center / Right as the primary framing.

## Evidence

- Evidence claims require **validated provenance** (support fragment in the cited source’s title or description).
- **Corroborated facts require independent publisher support** (two remaining publishers after validation).
- **S1/S2… IDs are temporary** prompt/validation handles and must never become durable identity. Persisted evidence uses URLs.

## Acquisition

- NewsAPI **last-good fallback** exists in `lib/services/newsAcquisition.ts` and is **process-memory only** (not Neon, not durable across deploys).

## Story history

- Story history storage is **Neon / Postgres** with Drizzle (`stories`, `story_snapshots`).
- MVP `story_key` is the **normalized primary URL**.
- The same event under **different primary URLs may currently create separate stories**. Semantic event clustering is not implemented.
- Evidence snapshots are **append-only by materially different fingerprint**.
- **Duplicate fingerprint is idempotent** (`UNIQUE(story_id, fingerprint)` → persist status `duplicate`).
- **Database failure must never break analysis** or the 60-Second Brief.

## What Changed (future)

- What Changed must be based on **deterministic snapshot comparison before any AI phrasing**.
- The existing **Story Timeline must never be used as evidence** for What Changed (it can still initialize from mock data and is a separate UI).
- **No visible What Changed UI** until deterministic diffing is validated (Phase 2B.1D before Phase 2B.2).
