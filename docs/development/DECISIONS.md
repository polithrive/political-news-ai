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

## V1 launch de-scope (LP1)

Ryan’s decisions for public V1 honesty:

- **Accounts:** Hide Sign in / Create free account / Saved / Premium / related account chrome. Do not ship a fake identity product. (`lib/localAccount.ts` may remain unused.)
- **Morning Brief:** Hide the footer form until a real ESP and consent language exist. Do not invent a monitored newsletter.
- **Polls and forecasts:** Hide entirely. Do not relabel mocks as Live or illustrative on the homepage.
- **NewsAPI production license:** Launch-gate only (audit L9 / Decision 4). Not part of LP1.
- **SSRF hardening:** Later (audit S3 / LP3), not LP1.

## Cost, abuse, and security (LP3)

- **No accounts.** Public V1 is protected with per-IP rate limits and an env kill switch, not authentication.
- **Rate limiter is in-process memory** (one Map per Node/serverless instance). It is **not** a distributed quota. Cold starts, multiple Vercel instances, and rolling deploys each have their own counters. Document this honestly; do not treat it as a WAF.
- **Trust forwarded IPs only on Vercel** (`VERCEL` set). Off-platform, all callers share identity `unknown` rather than honoring client-supplied `X-Forwarded-For`.
- **`AI_DISABLED`** (1/true/yes/on) returns HTTP 503 on AI-generating routes without a code redeploy. It does not hide secrets and does not disable `/api/news` or snapshot persistence.
- **Understand Any Article** fetches HTML itself (GET, `redirect: manual`, hop + DNS checks) and then parses. It is not a general-purpose proxy.
- **CSP is Report-Only** for V1. Enforcing CSP would risk Next.js inline/runtime scripts, arbitrary publisher images, and LP4 analytics hosts that are not chosen yet.
- **Next.js 16.3.3** is the smallest 16.x release that patches the July 2026 GHSA set **and** the August 2026 AVIF/Windows critical issues. Do not treat 16.2.11 as sufficient.
- **Legal contact:** Brand as The Angle Report. Do **not** invent a public email; Contact must say no inbox is published yet.
- De-scope is **reversible hide / noindex / 404**, not a redesign and not building auth, ESP, or real polls.

## Public brief URLs (LP2)

- Public identity is the **normalized article URL** in query param `u`.
- Title slug is cosmetic.
- `localStorage` selectedArticle is cache/optimization only.
- Do not serialize the full article object into the query string.
- Do not introduce a second analysis pipeline or a new DB table for first-load shareability.
