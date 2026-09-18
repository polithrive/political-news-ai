# Engineering Handoff

## Current Phase

**LP1 — Public honesty / V1 de-scope** (GitHub issue **#4**) is **complete**.

Protected application checkpoint after this work: **De-scope incomplete V1 surfaces**.

Do **not** start LP2.

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | this commit | De-scope incomplete V1 surfaces |

## What Was Completed

Hid incomplete V1 surfaces instead of building them:

- Homepage: removed Live poll, featured forecast, and Discover News Lens; kept Trending Today
- Feature tools: kept Understand Any Article and Check a source; removed Follow topics / Explore timelines
- Nav/footer: removed Sign in, Create free account, Polls, Forecasts, Premium, My Angle, Morning Brief
- Unused sidebar/top bar: no account, premium, perspective, or library promotions
- Direct routes for polls, forecasts, sign-in, saved, watchlist, alerts, premium, timeline, and perspectives: honest “not in V1” page + noindex
- `/admin` returns 404 and is disallowed in `robots.ts`
- Privacy, Terms, Contact: The Angle Report branding; no `@politicalpulse.ai`; no invented email

## Files Changed In Last Completed Phase

- Homepage / chrome: `HomeRightRail`, `HomeFeatureTools`, `PublicationNav`, `Footer`, `navConfig`, `SidebarNav`, `TopBar`
- Unavailable surfaces: `app/components/v1/*`, de-scoped `page.tsx` files, `app/robots.ts`, `app/admin/*`
- Legal: `privacy`, `terms`, `contact`
- Coordination: `CURRENT_PHASE.md`, `HANDOFF.md`, `DECISIONS.md`

## Database State

Unchanged. No queries or writes.

## Validation Status

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Homepage / nav / footer / legal / `/admin` inspection

## Known Limitations / Technical Debt

- Shared brief URLs still require localStorage (LP2)
- No app-level AI rate limits (LP3)
- Next.js 16.2.10 critical advisories remain (LP3 / L7)
- No product analytics (LP4)
- NewsAPI production license still unverified (L9)
- No public contact inbox yet (Ryan launch-gate)
- Unused mock poll/forecast components remain in the repo but are unmounted
- Chat system prompt still says PoliticalPulse (audit S4; not LP1)

## Next Recommended Action

Authorize **LP2 (shareable briefs)** only. Do not start LP3–LP5 in the same pass.

## Do Not Do Yet

- LP2 shareable briefs until a new authorization
- Forecasts/debates/clustering/AI What Changed/Angle+/extension
- Homepage or 60-second brief redesign
- Auth, ESP, or real polls
- Production DNS/domain changes
- Inventing a monitored email address

## Questions / Decisions Needed

- **Decision 4 (NewsAPI license)** still required before public scale
- Publish a real contact inbox before claiming one in legal copy

## Git Status At Handoff

Commit on `main` after push: `De-scope incomplete V1 surfaces`.
