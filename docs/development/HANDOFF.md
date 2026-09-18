# Engineering Handoff

## Current Phase

**LP4 — Measurement** is **complete**.

Protected starting checkpoint for this work: `8afe1c4` — Remove unnecessary homepage workaround.

Do **not** start LP5.

A GitHub issue titled “LP4 — Measurement” was **not** created: the local `gh` CLI is unauthenticated and no GitHub issue MCP was available. Create it later if you still want a tracking issue.

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | `b1634e4` | De-scope incomplete V1 surfaces |
| LP2 | `fb658d0` | Make intelligence briefs directly shareable |
| LP3 | `ac16ee7` | Harden V1 cost abuse and security |
| LP3 cleanup | `8afe1c4` | Remove unnecessary homepage workaround |
| LP4 | this commit | Add V1 product measurement |

## Analytics solution and why

**Vercel Web Analytics** via `@vercel/analytics`, on **Vercel Pro**.

Ryan already hosts the app on Vercel. This is the smallest production path: no extra analytics vendor account, no self-hosted pipeline, no user accounts, and no fingerprinting product. Custom funnel events require Pro. **Web Analytics Plus was not added** (no UTM dashboard, max **two custom properties** per event).

Hobby page views alone could not answer brief/analyze/chat/rate-limit questions.

## Cost and Ryan action

- **Plan:** Vercel Pro (already chosen). Custom events are included on Pro. Usage beyond the team’s event credit is billed by Vercel (on the order of cents per thousand events).
- **Plus ($10/mo) was not enabled.** Referrer/UTM breakdown in the Web Analytics UI is therefore limited. Standard page views still distinguish paths and Vercel’s visitor model (new vs returning at the platform level).
- **No new environment variables.** Do not add analytics API keys.
- **Dashboard enable step (required if not already on):** Vercel project → **Analytics** → enable **Web Analytics** for Production (and Preview if you want it there). Until that toggle is on, the script loads but the dashboard will not show data.
- After deploy, view data at: Vercel → the `political-news-ai` project → **Analytics** (Web Analytics). Custom events appear under Custom Events. Page views appear as paths **without** `?u=` article URLs.

## Event taxonomy

Central layer: `lib/analytics/taxonomy.ts`, `lib/analytics/track.ts`.

Every custom event has **at most two properties**, always named:

| Property | Meaning |
|---|---|
| `surface` | Where it happened (`home`, `search`, `feed`, `analyze`, `brief`, `chat`, `news`, `identity`, `api`) |
| `detail` | Closed outcome/bucket **or** an 8-character hex **storyRef** (FNV-1a of the canonical story key). Never a URL. |

| Event | When | Properties |
|---|---|---|
| `homepage_viewed` | Homepage mount, once per session in that tab | `surface=home` |
| `brief_selected` | 60-Second Brief control, or a homepage story title that opens the brief | `surface=home\|search`, `detail=storyRef` |
| `brief_ready` | Brief report is available (including cache) | `surface=feed\|analyze`, `detail=storyRef` |
| `brief_failed` | Brief could not be shown | `surface=feed\|analyze\|identity`, `detail=rate_limited\|disabled\|extract\|invalid\|generation\|missing\|malformed` |
| `evidence_opened` | First “See evidence” open on a brief | `surface=brief`, `detail=storyRef` |
| `angle_interacted` | First click on an angle card | `surface=brief`, `detail=storyRef` |
| `what_changed_toggled` | Module shown by default, Show/Hide, or “Reporting updated” | `surface=brief`, `detail=storyRef` |
| `ask_angle_opened` | Focus or first submit on Ask The Angle | `surface=chat`, `detail=storyRef` |
| `ask_angle_success` | Non-empty streamed answer | `surface=chat`, `detail=storyRef` |
| `ask_angle_failed` | Chat HTTP/empty/network failure | `surface=chat`, `detail=rate_limited\|disabled\|generation\|empty\|network` |
| `analyze_submitted` | Understand Any Article form submit | `surface=home` |
| `analyze_success` | URL-origin brief ready | `surface=analyze`, `detail=storyRef` |
| `analyze_failed` | URL-origin brief failed | `surface=analyze`, `detail=…` |
| `share_clicked` | Share control | `surface=brief`, `detail=storyRef` |
| `read_original_clicked` | Read original on homepage or brief | `surface=home\|brief`, `detail=storyRef` |
| `rate_limited` | Client received 429 on brief generate or chat | `surface=feed\|analyze\|chat`, `detail=bucket name` |

Automatic **page views** (stripped of query/hash) still measure visits to `/`, `/intelligence/[slug]`, etc.

`trackEvent` swallows errors, dynamic-imports `@vercel/analytics`, and uses `onceKey` for view/ready/fail duplicates from React re-renders. A throwing tracker cannot break the UI.

## What Ryan can measure after traffic

- How many people visit (page views + `homepage_viewed`)
- New vs returning (Vercel visitor model, not accounts)
- Rough source mix (Vercel page-view referrer if the project exposes it on Pro; **not** UTM Plus)
- Which stories get interest (`brief_selected` / `brief_ready` grouped by `detail` storyRef; paths show slugs only)
- 60-Second Brief clicks (`brief_selected`) vs briefs that render (`brief_ready`) vs failures (`brief_failed`)
- Evidence, angles, What Changed, Ask The Angle, Understand Any Article, share, Read original
- Analyze success vs fail
- Client-visible rate limits
- Drop-off by comparing those event counts (not a dedicated funnel builder)

## Privacy / data minimization

- No article bodies, Ask The Angle question text, pasted URLs, API keys, or PII in events or ops logs.
- Shareable `?u=` article URLs are stripped from pageview URLs in `beforeSend`.
- Story grouping uses `storyRefFromUrl` (hash of canonical story key), not the URL.
- Event property values are allowlisted / hex-only; URL-like strings are dropped.
- Privacy policy (`app/privacy/page.tsx`) updated to describe Vercel Web Analytics.

## Operational visibility

Not a custom observability platform. Vercel runtime logs get one JSON line via `lib/ops/log.ts`:

- `rate_limited` / `ai_disabled` from `enforcePublicEndpointGuard`
- `ai_failed` / `unexpected` on analyze and chat failures (no error objects, no prompts)
- `extract_failed` when URL extraction returns nothing
- `newsapi_failed` on NewsAPI HTTP errors (status + pool only; **no request URL**, which could have included secrets in older logs)

View: Vercel → project → **Logs**. Filter for `"app":"angle-report"`.

## Tests performed

- `npm test` (includes `lib/analytics/taxonomy.test.ts`, `lib/ops/log.test.ts`, existing LP2/LP3 tests)
- `npm run typecheck`
- `npm run build`
- `git diff --check`

## Files changed (principal)

- `lib/analytics/*`, `lib/ops/log.ts`
- `app/components/analytics/ProductAnalytics.tsx`
- `app/layout.tsx`, `app/page.tsx`, `app/privacy/page.tsx`
- Homepage brief/analyze/share/read-original controls
- Intelligence brief, What Changed, evidence, Ask The Angle
- `lib/security/guardRequest.ts`, analyze / analyze-url / chat / news routes, `newsAcquisition.ts`
- `next.config.ts` (report-only CSP allows `va.vercel-scripts.com`)
- `package.json` / lockfile (`@vercel/analytics`)
- `docs/development/CURRENT_PHASE.md`, `HANDOFF.md`, `ARCHITECTURE.md`, `DECISIONS.md`

## Remaining measurement limitations

- Two custom properties: cannot attach both a storyRef **and** a reason on the same event (failures use reason; success uses storyRef).
- No Web Analytics Plus: weak UTM reporting.
- `brief_ready` `surface=feed` includes both homepage-selected and shared feed stories.
- Title clicks on More stories / Trending also fire `brief_selected` (they open the same brief).
- In-memory LP3 rate limits are still per-instance; ops logs will under-count distributed abuse.
- Custom events do nothing useful on Hobby; Pro is required.
- GitHub issue for LP4 was not opened.

## Environment / Vercel settings

| Name | Required | Effect |
|---|---|---|
| *(none new)* | | Web Analytics does not use a project env var |
| `AI_DISABLED` | no | unchanged |
| `VERCEL` | set by Vercel | unchanged |

Enable Web Analytics in the dashboard as described above.

## Decisions required from Ryan

Enable Web Analytics in Vercel if it is not already enabled. **Decision 4 (NewsAPI license)** still required before public scale.

## Next recommended action

Authorize **LP5 — domain cutover** only. Do not start it from this handoff.

## Do not do yet

- LP5 SEO/domain/cutover
- Web Analytics Plus unless Ryan later wants UTM
- Forecasts/debates/clustering/AI What Changed/Angle+/extension
- Homepage or 60-second brief redesign
- Auth, ESP, or real polls
- Production DNS/domain changes

## Git status at handoff

Commit on `main` after push: `Add V1 product measurement`.
