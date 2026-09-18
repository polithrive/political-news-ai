# Engineering Handoff

## Current Phase

**LP2 — Shareable briefs** (GitHub issue **#5**) is **complete**.

Protected application checkpoint after this work: **Make intelligence briefs directly shareable**.

Do **not** start LP3.

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | `b1634e4` | De-scope incomplete V1 surfaces |
| LP2 | this commit | Make intelligence briefs directly shareable |

## Chosen public story identity

Canonical identity is the **normalized article URL** (`tryBuildStoryKey`, same rules as snapshot `story_key`).

Public href: `/intelligence/[slug]?u=<canonical-url>`

- `slug` is derived from the title for readability. It is **not** the resolver key.
- `u` is the only required public identifier.
- Duplicate public schemes were not added (no `/story/` route, no encoded article blob).
- The `stories` table is **not** used for first-load resolution (a first-time story may have no snapshot).

### Current selectedArticle paths (audit)

**Writes (`saveSelectedArticle`):** StoryBriefLink, TrendingStoriesCard, MoreStoriesList title links, AnalyzeUrlForm, intelligence page after resolve, HeroSection, LiveNews, TrendingTopicsBanner.

**Reads (`getSelectedArticle`):** intelligence client only — used when `u` matches that stored URL, or for slug-only legacy links when the stored title slug matches.

### How a fresh browser resolves

1. Parse and validate `u` (http/https, no private/local hosts, tracking params stripped).
2. If the current `/api/news` feed contains that URL, use that homepage `Article` and the existing `generateIntelligenceReport` path.
3. Otherwise use `createUrlSubmittedArticle` + existing `generateIntelligenceReportFromUrl` (`/api/analyze-url`).
4. Report cache v4 still keys `source:title` and is local to that browser. Fresh browsers generate; they do not need selectedArticle.
5. What Changed still uses the resolved article’s primary URL / snapshot input. Cache hits still GET `/api/story-snapshot-changes`. Fresh generates still persist-then-read.

### URL-submitted articles

Understand Any Article still posts into the same intelligence page. The form now navigates with `?u=`, so a copied result URL is shareable. Fresh browsers load via analyze-url.

### localStorage role after LP2

- `politicalpulse_selected_article`: optional cache so the same browser can skip a feed lookup and keep homepage metadata.
- Report cache v4: unchanged optimization. Not a correctness dependency for opening a shared URL.

### SEO / indexing leftover (LP5)

- Valid `u` pages set a canonical `pathname?u=` and are indexable in principle (still client-rendered briefs).
- Missing/malformed `u` is `noindex`.
- No sitemap or OG images in LP2.
- Slug-only bookmarks are not a durable public identity.

## Files Changed In Last Completed Phase

- `lib/services/intelligenceIdentity.ts` + tests
- `app/intelligence/[slug]/page.tsx` (server metadata) + `IntelligenceReportClient.tsx`
- Homepage/story links: StoryBriefLink, Trending, More Stories, AnalyzeUrlForm, HeroSection, LiveNews, TrendingTopicsBanner
- `ShareBriefButton` / `StoryBriefHeader`
- Coordination docs + `package.json` test script

## Database State

Unchanged. No migration.

## Validation Status

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Direct-link / share / malformed URL browser checks

## Known Limitations / Technical Debt

- If a homepage story has rotated out of the NewsAPI/last-good feed, a shared link falls back to URL extraction (same engine as Understand Any Article), which can differ slightly from the original homepage brief.
- Report cache v4 remains per-browser and title/source keyed; not bumped.
- Extracted canonical URL after redirects can differ from the NewsAPI url; snapshot `story_key` follows the resolved primary URL used for that run.
- No app-level AI rate limits (LP3)
- Next.js 16.2.10 critical advisories remain (LP3 / L7)
- No product analytics (LP4)
- NewsAPI production license still unverified (L9)

## Next Recommended Action

Authorize **LP3 — cost, abuse, and security** only.

## Do Not Do Yet

- LP3 rate limits / SSRF / Next upgrade until a new authorization
- Forecasts/debates/clustering/AI What Changed/Angle+/extension
- Homepage or 60-second brief redesign
- Auth, ESP, or real polls
- Production DNS/domain changes
- Sitemap / social-image SEO pack (LP5)

## Questions / Decisions Needed

None for LP2. **Decision 4 (NewsAPI license)** still required before public scale.

## Git Status At Handoff

Commit on `main` after push: `Make intelligence briefs directly shareable`.
