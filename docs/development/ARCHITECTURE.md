# Architecture Reference (agent)

This document describes the architecture **as implemented**. Older product docs under `docs/` (especially `docs/ARCHITECTURE.md`) describe earlier PoliticalPulse intent and must not override this file when they conflict.

Story/event **semantic clustering does not exist** for story history. Homepage feed clustering (`lib/services/homepageCuration.ts`) is unrelated. Normalized primary URL is the current conservative story identity. The same real-world event reached via different primary URLs may create separate `stories` rows.

## 1. Application stack

- Next.js 16.2 (App Router), React 19, TypeScript, Tailwind 4
- OpenAI (`lib/ai/client.ts`, `OPENAI_API_KEY`)
- NewsAPI (`NEWS_API_KEY`; homepage acquisition in `lib/services/newsAcquisition.ts`)
- Neon Postgres via `@neondatabase/serverless` + Drizzle (`lib/db/`, neon-http; no interactive `db.transaction()`)
- Hosted on Vercel (`VERCEL_URL` used as an API base in multi-source gathering)

## 2. Evidence-grounded analysis pipeline

Selected article (homepage) or submitted URL is turned into an `EvidenceSource[]` + prompt context (`lib/services/evidenceContext.ts`), then into AI analysis plus a validated `EvidenceBrief` (`lib/services/evidenceBrief.ts`). Trust Score is computed separately (`lib/services/trustScore.ts`). The intelligence page (`app/intelligence/[slug]/page.tsx`) assembles the 60-Second Brief from the `IntelligenceReport`.

## 3. 60-Second Brief

Default reader UI is `app/components/brief/SixtySecondBrief.tsx`: what happened, why it matters, corroborated facts, angles, uncertainties, coverage differences, and a “Reporting reviewed” strip (source counts / evidence strength). Deep Analysis (`DeepAnalysis.tsx`) is collapsed by default and holds Trust Score, perspectives, timeline, graph, and other expanded sections.

## 4. EvidenceSource / S# temporary provenance

`createEvidenceSource` assigns `sourceId` as `S1`…`S6` in list order for prompting and validation only. The model must cite those IDs; support fragments must come from that source’s **title or description**. S# IDs are ephemeral per analysis run. Persisted snapshots store URLs, not S#.

## 5. EvidenceBrief validation

`normalizeEvidenceBrief` in `lib/services/evidenceBrief.ts`:

- Corroborated facts require `independentSourceCount >= 2`.
- Each kept fact needs validated `evidence[]` whose `supportText` matches the cited source’s title or description (`matchSupportText`).
- After validation, a fact needs **two independent publishers** or it is dropped into `rejectedEvidence`.
- Legacy name-only `supportedBy` without fragments is rejected.
- Coverage differences have a similar independence gate when evidence is limited.

This validation is **not** re-run inside snapshot persist (see MVP trust boundary below).

## 6. Trust Score relationship

`calculateTrustScore` uses confidence, source counts/quality, reporting agreement, and political diversity. Homepage computes it in `lib/services/report.ts`; URL analysis computes it on the server in `app/api/analyze-url/route.ts`. The primary brief does not show `trustScore.overall`; the full Trust Score UI lives under Deep Analysis.

## 7. Report cache v4

`lib/services/reportCache.ts`:

- Key: `politicalpulse:intelligence-report:v4:{source:title}` (normalized)
- TTL: 6 hours
- Storage: `localStorage` (sessionStorage fallback)
- Stored shape: `{ version, cachedAt, expiresAt, report }` — **`IntelligenceReport` only**. `snapshotInput` is never cached.

## 8. Homepage-selected analysis path

`generateIntelligenceReport` (`lib/services/report.ts`) gathers evidence on the client (`buildEvidenceContext` / NewsAPI-related sources), `POST /api/analyze` with `promptContext` (no Neon), normalizes the brief, calculates Trust Score, returns `{ report, snapshotInput }`. On cache miss the intelligence page caches the report then fire-and-forget persists.

`/api/analyze` does **not** gather evidence, compute Trust Score, or touch the database.

## 9. URL-submitted analysis path

`generateIntelligenceReportFromUrl` `POST /api/analyze-url`. The server extracts the article, builds evidence (including primary content), runs AI, and returns `{ article, evidence, trustScore, analysis }`. The client maps that into `{ article, report, snapshotInput }`. Analyze-url is independent of Neon.

## 10. Neon / Drizzle story history

`lib/db/schema.ts`:

- `stories`: `id`, unique `story_key`, `primary_url`, timestamps. No `latest_snapshot_id`.
- `story_snapshots`: `story_id` FK, `captured_at`, `fingerprint`, `schema_version`, `evidence` JSONB (`EvidenceSnapshotV1`). Unique `(story_id, fingerprint)`. Index `(story_id, captured_at DESC)`.

Writes: `lib/services/persistStorySnapshot.ts` (`server-only`). Upsert story by `story_key`, then insert snapshot; conflict → `duplicate`.

## 11. EvidenceSnapshotV1

`lib/db/evidence.ts`: `primary` (url, title, sourceName, publishedAt); `sources[]` (url, sourceName, publishedAt, title, isPrimary); `facts[]` (text, publishers, support `{ url, publisher, fragment, field }` where field is `title` | `description`); `uncertainties[]`; `coverageDifferences[]`; `independentSourceCount`; `limitedEvidence`. No S#, no article body, no Trust Score, no chat.

## 12. story_key behavior

`lib/services/storyKey.ts` + `normalizeArticleUrl`: http/https only; fragment removed; hostname lowercased; leading `www.` stripped; `utm_*`, `fbclid`, `gclid`, `mc_cid`, `mc_eid` dropped; remaining query params kept and sorted (duplicate keys preserved as separate pairs); trailing slash stripped except `/`; path casing and scheme preserved. Invalid/private URLs yield `null`.

## 13. Snapshot fingerprint

`lib/services/storySnapshotFingerprint.ts`: SHA-256 (`node:crypto`, server-only persist path) of canonical source URL set, sorted fact/uncertainty/coverage texts, `independentSourceCount`, and `limitedEvidence`. Source order and duplicate source URLs do not change the hash. Whitespace-only text differences do not.

## 14. Snapshot persistence API

`POST /api/story-snapshots`: treat body as untrusted. Enforce Content-Length and 32 KiB cap, `parseStorySnapshotInput` (unknown fields not persisted; identity/version fields rejected), rebuild snapshot + fingerprint on the server, persist. Responses: `{ status: "stored" | "duplicate" | "skipped" }`.

Client contract assembly: `createStorySnapshotInput` in `lib/services/buildEvidenceSnapshot.ts`. S# → URL mapping is by `sourceId`, not array index; unresolved IDs and invalid URLs are dropped; facts with zero support are dropped.

## 15. Failure isolation

`persistStorySnapshotBestEffort` on the intelligence page wraps `JSON.stringify` / `fetch` and is not awaited. Persist runs only after successful fresh generation. Cache hits skip persist. Persist failures cannot fail generate, report cache, or brief render. Analyze routes do not import Neon.

## 16. Server / client boundaries

- Client: report assembly, brief UI, report-cache v4, snapshot POST trigger.
- Server: `/api/analyze`, `/api/analyze-url`, `/api/story-snapshots`, Drizzle/Neon, fingerprint hashing.
- `persistStorySnapshot` is `server-only`. Database modules must not leak into the browser bundle.

## 17. Public brief identity (LP2)

Canonical public story identity is the **normalized article URL** (`tryBuildStoryKey` / `story_key` rules), not the cosmetic title slug and not `localStorage`.

Public path: `/intelligence/[slug]?u=<canonical-article-url>`.

- `slug` is `createSlug(title)` (or `story`) for readability. Resolution keys off `u`.
- `localStorage` (`politicalpulse_selected_article`) and report cache v4 remain **optimizations** for the same browser.
- Fresh browsers resolve `u` against the current homepage feed (same `/api/news` last-good path). If there is no feed match, they use the existing **Understand Any Article** `/api/analyze-url` pipeline.
- Slug-only URLs without `u` are not a shareable identity; they may still open in the same browser if selectedArticle matches the slug.
- Share copies the canonical `pathname?u=` URL, not a hash-only or storage-dependent route.

No schema change. No second analysis engine. Full-article bodies are not placed in the public URL.

### MVP trust boundary (technical debt)

The snapshot POST is **client-originated** because validated `EvidenceBrief` and full `EvidenceSource[]` still coexist on the client after fresh analysis. The server rebuilds the snapshot and fingerprint from a parsed contract but **does not independently re-run Phase 1 fragment-in-title/description validation**. A crafted body that resembles a validated brief can be stored. Persist should eventually move fully into the server-side evidence-analysis pipeline.
