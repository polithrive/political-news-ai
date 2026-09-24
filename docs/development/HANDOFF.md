# Engineering Handoff

## Current Phase

**LP5 Phase 1 — Launch code readiness** is **complete** at `b267a51`.

**Visual Pass 1** (homepage rail / hero / Big Stories) is on branch `visual-pass-1`. It is **not** merged to `main`.

Local Cursor uses Neon **development** branch. Neon **main** is reserved for production.

**Production cutover has NOT occurred.**

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | `b1634e4` | De-scope incomplete V1 surfaces |
| LP2 | `fb658d0` | Make intelligence briefs directly shareable |
| LP3 | `ac16ee7` | Harden V1 cost abuse and security |
| LP3 cleanup | `8afe1c4` | Remove unnecessary homepage workaround |
| LP4 | `d18b592` | Add V1 product measurement |
| LP5 code | `b267a51` | Prepare V1 for production launch |

## Visual Pass 1 (`visual-pass-1`)

- Right rail: Trending Today + honest Poll + Forecast cards (no mock votes/odds, no `/polls` `/forecasts` restore).
- Hero: tighter spacing, smaller type, long-headline clamp; capitol photography kept.
- Big Stories: shared border chrome, title/summary clamps, stretch grid.
- Grid still `lg:row-span-2`; rail now has three cards so the empty navy column should fill from content, not min-height hacks.

## What was not done (this pass)

- No 60-second brief visual pass.
- No Understand Any Article / Check a Source / More Stories / footer pass.
- No mock poll/forecast data. No Neon/Vercel/env changes.

## Next recommended action

ChatGPT review of Visual Pass 1. Merge to `main` only if authorized. Do not cut over production from this handoff.


## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | `b1634e4` | De-scope incomplete V1 surfaces |
| LP2 | `fb658d0` | Make intelligence briefs directly shareable |
| LP3 | `ac16ee7` | Harden V1 cost abuse and security |
| LP3 cleanup | `8afe1c4` | Remove unnecessary homepage workaround |
| LP4 | `d18b592` | Add V1 product measurement |
| LP5 code | this commit | Prepare V1 for production launch |

## What this commit does

- Canonical origin in code: `https://theanglereport.com` (`lib/seo/siteUrl.ts`). `metadataBase` uses `NEXT_PUBLIC_APP_URL` when it is a valid http(s) URL, otherwise that origin.
- `app/sitemap.ts` lists `/`, `/about`, `/privacy`, `/terms`, `/contact` only.
- `app/robots.ts` sets Host `theanglereport.com`, sitemap URL, and keeps de-scoped `disallow` paths. `/intelligence` is **not** disallowed (shareable; crawlers may fetch, metadata says noindex).
- Valid `/intelligence/[slug]?u=` pages: **`noindex, follow`**. Malformed/missing `u`: **`noindex, nofollow`**. Shareable LP2 URLs unchanged.
- Branded OG/Twitter image via `app/opengraph-image.tsx` and `app/twitter-image.tsx` (1200×630). Wired in root metadata.
- Reader-facing PoliticalPulse copy on the supported V1 path (Ask The Angle errors/prompt brand, news/analyze/preview fallbacks, unrated source blurbs, timeline mock, homepage preview fallback). Internal keys, logs, and unused components were left alone.

## What was not done

- No DNS, Vercel dashboard, Production env, Web Analytics toggle, or Neon migrate.
- `www` redirect is **not** configured.
- Coming Soon still owns the public domain until Phase 2.
- `/article/[id]` still exists (noindex + robots disallow).

## Validation

- `npm test` (LP2/LP3/LP4 tests plus `lib/seo/launchMetadata.test.ts`)
- `npm run typecheck`
- `npm run build`
- `git diff --check`

## Files changed (principal)

- `lib/seo/*`, `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`
- `app/intelligence/[slug]/page.tsx`
- Ask The Angle / analyze / news / preview / source-ranking / timeline / homepage-preview copy
- `.env.example`, `docs/development/*`

## Remaining before public launch (Ryan)

1. NewsAPI production/commercial license.
2. Vercel Production env: `OPENAI_API_KEY`, `NEWS_API_KEY`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEXT_PUBLIC_APP_URL=https://theanglereport.com`.
3. Enable Web Analytics on Pro.
4. Migrate Production Neon (`stories`, `story_snapshots`).
5. Point apex + www at this Next app; redirect www → apex; retire Coming Soon.

## Next recommended action

Authorize **LP5 Phase 2 (configuration + cutover)** only after ChatGPT review of this code. Do not cut over from this handoff.

## Git status at handoff

Commit on `main` after push: `Prepare V1 for production launch`.
