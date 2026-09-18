# V1 Launch Gap Audit — The Angle Report

**Audit only.** No product or infrastructure changes were made for this issue.

Protected application checkpoint: `006ae52` — Add What Changed reader experience

GitHub issue: `#3`

Validation at audit time (non-destructive):

- `npm test` — 33 passed
- `npm run typecheck` — passed
- `npm run build` — passed (Next.js 16.2.10)
- `npm audit --omit=dev` — 6 production-tree advisories, including **critical Next.js** GHSA set (see L7)
- No production data was mutated

This is **not a feature wishlist**. It is the finite set of issues that would prevent a credible, safe, measurable public V1 on theanglereport.com.

---

## A. Executive launch assessment

**Current readiness:** The core product loop is real: NewsAPI-backed homepage stories, 60-second evidence-grounded brief, Understand Any Article, Ask The Angle, optional Deep Analysis, and best-effort What Changed. That loop is strong enough to launch **after** de-scoping fake surfaces, making briefs shareable, putting a cost/abuse lid on OpenAI, and cutting over the domain with honest legal/measurement basics.

**Largest risks**

1. **Credibility:** Homepage “Live” polls/forecasts are mock data; Sign in / Create account / Morning Brief look like products they are not.
2. **Share/SEO:** `/intelligence/[slug]` ignores the slug and requires `localStorage` (`politicalpulse_selected_article`). Shared URLs open “No story selected.”
3. **Cost/abuse:** OpenAI routes (`/api/analyze`, `/api/analyze-url`, `/api/chat`, plus related analyze-* / graph / preview) have **no app-level rate limit**. Anyone can burn spend.
4. **Legal/brand:** Privacy, Terms, and Contact still say PoliticalPulse and use `@politicalpulse.ai` mailboxes.
5. **Dependencies:** NewsAPI license for public production is **unverified in-repo**; Next.js 16.2.10 has published critical advisories.

**Already strong enough (do not expand)**

- Evidence-grounded brief + S# validation + conservative What Changed
- Failure isolation of Neon snapshot persist
- Homepage story cards from live `/api/news`
- Understand Any Article extract + analyze path
- Ask The Angle grounding prompt (still unauthenticated)

**Not a wishlist:** Forecasts product, debates, clustering, Angle+, browser extension, real polls, full auth, and AI-phrased What Changed are **out of V1**.

---

## B. Launch blocker table (MUST HAVE BEFORE LAUNCH)

| ID | Issue | User/business risk | Evidence | Smallest fix | Size | Deps | Validation |
|---|---|---|---|---|---|---|---|
| L1 | Homepage poll/forecast labeled **Live** but hardcoded | Visitors think The Angle Report runs live civic products it does not | `TopPollCard.tsx` (“Live”), `mockFeaturedPoll.ts`, `FeaturedForecastCard.tsx`, `MOCK_FORECASTS`, `/polls` `/forecasts` | Hide those homepage modules and nav/pages from V1, or relabel as illustrative (see Decision 3) | S | Decision 3 | Homepage has no Live poll/forecast |
| L2 | Sign in / Create free account is device localStorage, not accounts | Trust + security: fake identity, `next` query open-redirect-to-path | `lib/localAccount.ts`, `app/signin/page.tsx`, `PublicationNav` | Remove/hide account CTAs for V1 **or** keep with unmistakable “this device only” and no “Create free account” | S | Decision 1 | No CTA implies a real account |
| L3 | Morning Brief form stores email only in localStorage; after submit it admits “not connected yet” | Looks like a newsletter; fake conversion; privacy (email on device with success-adjacent UX) | `MorningBriefSignup.tsx` | Hide V1 **or** wire a real ESP with consent | S | Decision 2 | No fake subscribe success |
| L4 | Story URLs are not loadable/shareable/indexable | Share button copies a URL that cannot reconstruct the story; SEO of the core product is empty | `intelligence/[slug]/page.tsx` (no `params`/`slug`), `lib/selectedArticle.ts` | Persist enough article identity to reload the brief from the URL (query or encoded payload / server cache). Smallest: `?url=` + existing analyze-url/homepage article fields | M | — | Open `/intelligence/...` in a private window and see the story |
| L5 | Unauthenticated OpenAI with no rate limits | Runaway cost; DoS of quota; URL-analyzer abuse | `app/api/analyze/route.ts`, `analyze-url`, `chat`, `analyze-preview`, `intelligence-graph`, `summarize`, `compare`, `bias`; no `middleware.ts` | Per-IP rate limits on AI routes; tighter caps on analyze-url; optional kill switch env | M | L6 | Burst of requests is 429 |
| L6 | No application rate limiting / security headers | Abuse, some XSS/clickjacking classes, no CSP | `next.config.ts` empty; no middleware | Add headers (CSP report-only first) + IP throttle on `/api/*` AI | M | L5 | Headers present on HTML; AI 429 |
| L7 | Next 16.2.10 in `npm audit` critical advisory set | Supply-chain / framework RCE/DoS depending on features used | `npm audit --omit=dev`; `package.json` `"next": "16.2.10"` | Upgrade Next within 16.x after a dedicated regression pass (protected brief + homepage) | M | — | `npm audit` clear of critical Next; smoke homepage + brief |
| L8 | Legal/contact still PoliticalPulse + placeholder emails | Unprofessional; wrong entity; dead mailtos | `privacy/page.tsx`, `terms/page.tsx`, `contact/page.tsx` (`feedback@politicalpulse.ai`, etc.) | Rewrite for The Angle Report; real contact address | S | Legal review | Pages match brand; mailtos work |
| L9 | NewsAPI public-production license not verified in repo | Legal/ToS shutdown of homepage | `NEWS_API_KEY` in `.env.example`; `app/api/news/route.ts` | **Verify plan/license with NewsAPI** (external). If developer-only, do not put thousands of users on it | S | Ryan + NewsAPI | Written confirmation or alternative |
| L10 | No product analytics | Cannot validate the business | No gtag/PostHog/Vercel Analytics in app/package.json | Add one privacy-reasonable analytics tool + 8–10 events (see I) | S | Privacy copy | Events fire on homepage and brief |
| L11 | `/admin` is a public mock dashboard | Looks like an exposed ops console | `app/admin/page.tsx` | Unlist/noindex and/or auth-gate/remove from V1 | S | — | `/admin` not in nav; noindex or 404 |
| L12 | Production domain/cutover not encoded in repo | Coming-soon vs app project mix-up | Issue context: Vercel `political-news-ai-q8xr`, coming-soon `angle-report-coming-soon`, domain theanglereport.com | Follow package LP5; no code required for the checklist itself | M | DNS/Vercel | HTTPS apex/www serve this app |
| L13 | Privacy policy claims cookies/analytics/providers that do not match the live app | Legal inconsistency | `privacy/page.tsx` §§4–5 vs no analytics package | Align policy with actual V1 (localStorage keys, OpenAI, NewsAPI, Neon, Vercel) | S | L8, L10 | Counsel or founder review |
| L14 | Intelligence Share uses `window.location.href` which cannot restore state | Shared links fail (same as L4) | `ShareBriefButton.tsx` | Fixed by L4 | S | L4 | Share in private window |

---

## C. Should-have soon after launch

| ID | Issue | Why not blocking | Smallest later fix |
|---|---|---|---|
| S1 | HomeHero hydration mismatch (Next overlay in dev) | Does not stop reading stories; hurts polish | Make date/locale render consistent (`HomeHero.tsx`) |
| S2 | NewsAPI last-good is process memory only | Homepage still degrades; empty cold start possible | Accept for V1; document; optional later durable cache |
| S3 | DNS-rebinding / redirect SSRF residual on extract | Private IPv4/localhost already blocked | Harden extract (deny metadata IPs, limit redirects) |
| S4 | Ask The Angle / chat still branded PoliticalPulse in the **system prompt** | User-visible UI is largely Angle; prompt leak is low | Rename prompt after launch |
| S5 | Unused PoliticalPulse components (`Hero.tsx`, `LiveNews.tsx`, etc.) | Not on current homepage | Delete or isolate later |
| S6 | Deep Analysis still has Left/Center/Right legacy | Collapsed by default; brief is primary | Do not promote in V1 marketing |
| S7 | Timeline API is mock | Inside Go Deeper only | Keep hidden in Go Deeper or stub copy |
| S8 | Accessibility: contrast, skip-link, search labels | Serious-barrier sweep after credibility pack | Keyboard pass on brief |
| S9 | `robots.ts` / `sitemap.ts` missing | After L4, add sitemap of homepage + legal | Generate once URLs are durable |
| S10 | Client-only search of already-fetched feed | Good enough for V1 catalog | Do not build a search engine |
| S11 | Image `unoptimized` remote URLs | Bandwidth; mixed quality | Allowlist + next/image later |
| S12 | npm audit moderate/high (nanoid, sharp, postcss, sanitize-html) | Next upgrade may pull several | Track with L7 |
| S13 | No error monitoring (Sentry/etc.) | Vercel logs exist | Add after analytics |
| S14 | What Changed rare until repeat visits | Product is correct; empty is OK | Do not fake history |

---

## D. V2 / later (does **not** delay launch)

| ID | Item |
|---|---|
| V1 | Semantic story clustering / event identity beyond URL |
| V2 | Real polls, forecasts, debates as products |
| V3 | Full authentication, saved stories, watchlist, alerts |
| V4 | Angle+ / payments / entitlements |
| V5 | AI-phrased What Changed |
| V6 | Browser extension |
| V7 | Professional / education tier |
| V8 | Multi-provider news acquisition |
| V9 | Server-side Phase 1 evidence revalidation of snapshots |
| V10 | Neon Auth / personalization |

---

## E. Route / feature truth table

| Surface | Visible? | Functional? | Prod-ready? | Launch action |
|---|---|---|---|---|
| Homepage stories | Y | Y (NewsAPI) | Near | **Keep** + hide mocks |
| 60-Second Brief | Y | Y | Y (with L4/L5) | **Keep** |
| What We Know / evidence | Y | Y | Y | **Keep** |
| What Changed | Y if pair | Y | Y (fail-closed) | **Keep** |
| Angles / unclear / coverage | Y | Y | Y | **Keep** |
| Ask The Angle | Y | Y (OpenAI) | Needs L5 | **Keep** with limits |
| Go Deeper | Y | Mixed (real analysis + mock timeline) | Partial | **Keep** collapsed; don’t market timeline |
| Read original | Y | Y (external) | Y | **Keep** |
| Understand Any Article | Y | Y | Needs L5 | **Keep** with limits |
| Search | Y | Filters in-memory feed | OK | **Keep** |
| Topic chips | Y | Query homepage `?q=` | OK | **Keep** |
| More stories / load more | Y | Y client list | OK | **Keep** |
| Trending Today | Y | Y from feed | OK | **Keep** |
| Today’s Top Poll | Y | Mock + “Live” | No | **Hide** or relabel |
| Featured Forecast | Y | Mock | No | **Hide** or relabel |
| Discover News Lens | Y | Links to signin/saved placeholder | No | **Hide** |
| Sign in / Create account | Y | localStorage | No | **Hide** or honest device-only |
| Morning Brief | Y | localStorage | No | **Hide** or real ESP |
| Follow topics | Y | `/saved` placeholder | No | **Hide** |
| Explore timelines | Y | `/timeline` placeholder | No | **Hide** (timeline remains in Go Deeper) |
| Check a source | Y | Same as URL analyze | Needs L5 | **Keep** |
| `/polls` `/forecasts` | Y if linked | Mock votes in localStorage | No | **Hide** from nav |
| `/signin` `/saved` `/watchlist` `/alerts` `/premium` | Y | Placeholder/local | No | **Hide** |
| `/admin` | Direct URL | Fake metrics | No | **Hide**/noindex |
| `/about` | Y | Real Angle copy | Y | **Keep** |
| `/privacy` `/terms` | Y | Real docs, wrong brand | No | **Fix** |
| `/contact` | Y | Placeholder emails | No | **Fix** |
| `/article/[id]` | Direct | Legacy summarize | Weak | **Defer**/noindex |
| `/perspectives/*` | Nav | Placeholder | No | **Hide** from V1 nav |
| `/coverage` `/research` | Some nav | URL form + copy | Optional | **Defer** or keep analyze form only |

---

## F. API / cost / abuse map

| Route | Trigger | Auth | Limits seen | Abuse / cost |
|---|---|---|---|---|
| `GET /api/news` | Homepage | None | NewsAPI 429 → last-good memory; `revalidate: 300` | Quota; cold empty |
| `POST /api/analyze` | Homepage brief | None | None app-wide | **High** (summary + political) |
| `POST /api/analyze-url` | URL brief | None | URL allowlist http(s); SSRF partial | **High** extract + AI |
| `POST /api/chat` | Ask The Angle | None | Question 2k, context 40k, 12 msgs | **High** streaming |
| `POST /api/analyze-preview` | Homepage cards | None | In-flight cache | **Medium** burst |
| `POST /api/intelligence-graph` | Go Deeper open | None | None | **Medium** |
| `POST /api/analyze-*` / debate / summarize / compare / bias | Legacy/other UI | None | Varies | **Hide unused** from public UI |
| `POST /api/timeline` | Go Deeper | None | Returns **mock** | Low $; misleading |
| `POST /api/story-snapshots` | After fresh brief | None | 32 KiB body | Low $; write spam |
| `GET /api/story-snapshot-changes` | Cache hit brief | None | URL query | Low $ |

Models: primarily `gpt-4.1-mini` (`lib/ai/*`). Timeout 20s, `maxRetries: 0` (`lib/ai/client.ts`).

**Normal journey (order-of-magnitude):** homepage news fetch + 1–2 previews + one brief analyze ≈ several mini calls. **Worst public case:** scripted `/api/analyze-url` + `/api/chat` loops with no 429 → unbounded OpenAI bill.

**Minimum launch controls:** IP rate limit; max concurrent analyzes; analyze-url daily cap; optional `AI_DISABLED=1`; do not expose unused analyze-* from the homepage.

---

## G. Security / privacy / legal checklist

| Item | Status | Launch |
|---|---|---|
| SSRF private IPv4/localhost | Present in `articleExtractor.ts` | Keep; harden later (S3) |
| URL protocol check | http/https only | OK |
| XSS of article HTML | Brief uses text; markdown in chat — review | SHOULD |
| Open redirect | Sign-in `next` must start with `/` | OK if `/signin` ships |
| Rate limiting | **Missing** | MUST (L5/L6) |
| Secrets | `.env*` gitignored; `.env.example` names only | OK |
| Server-only DB | `persistStorySnapshot` / `getDb` server-only | OK |
| SQL injection | Drizzle parameterized | OK |
| CORS | Same-origin fetch from app | OK |
| Security headers / CSP | **Missing** | MUST (L6) |
| External links | `rel=noreferrer` on many | OK |
| Cookies | localStorage-heavy; no auth cookies | Disclose in privacy |
| Email consent | Morning Brief not a real processor | Hide or lawful capture |
| Copyright | Summaries + short fragments + source links, not full republication in brief | Still **needs legal review** of extractus full content on server |
| Privacy/Terms brand | PoliticalPulse | MUST (L8/L13) |
| Contact | Fake domains | MUST |
| This audit is not legal advice | — | Counsel for NewsAPI, privacy, copyright |

---

## H. SEO / indexability

| Item | Status |
|---|---|
| Homepage title/description | Present (`app/layout.tsx`) |
| OG/Twitter text | Present; **no images**, no `metadataBase` |
| Canonical | Missing |
| `robots.ts` / `sitemap.ts` | Missing (layout robots index:true) |
| Favicon | Next default / app icons — verify `app/` icons |
| Story pages | **Not indexable as content**; slug unused; no article JSON-LD |
| Share | Copies unusable URL (L4/L14) |
| Duplicate thin pages | Many placeholder routes may get indexed | noindex placeholders |

**Launch-critical:** L4. Without it, Google and social cannot show the product.

---

## I. Analytics measurement plan

**Now:** none.

**V1 minimum events** (one tool, e.g. Vercel Analytics + a few custom events, or Plausible):

- `homepage_view`
- `story_open` (source: homepage | url-analyze | search)
- `brief_ready`
- `what_changed_impression` / `what_changed_toggle`
- `ask_angle_submit`
- `analyze_url_submit`
- `read_original_click`
- `share_brief_click`
- `error_brief` / `error_api`

Plus: referrer, device, and **server-side** OpenAI/NewsAPI error + approximate token/spend logs (not in the browser).

Do **not** install in this audit.

---

## J. Production cutover checklist

- [ ] DNS: theanglereport.com (+ www) → Vercel app project `political-news-ai-q8xr` (not coming-soon)
- [ ] HTTPS + apex/www canonical **DECISION** (prefer https://theanglereport.com)
- [ ] Production env: `OPENAI_API_KEY`, `NEWS_API_KEY`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEXT_PUBLIC_APP_URL=https://theanglereport.com`
- [ ] Confirm Neon migrations applied on **production** (`stories`, `story_snapshots`)
- [ ] Preview vs Production secrets differ
- [ ] Coming-soon project disabled or redirected
- [ ] `metadataBase` = production URL
- [ ] Rollback: previous Vercel deployment
- [ ] Logs: Vercel + Neon
- [ ] NewsAPI production license confirmed (L9)
- [ ] Legal pages live (L8)
- [ ] `/admin` not public (L11)

---

## K. Ordered finite launch plan (5 packages)

Do **not** invent new product phases. Implement these sequentially.

### LP1 — Public honesty (de-scope)

- **Objective:** Nothing on the homepage or chrome claims a product that is fake.
- **Scope:** Hide/remove Live poll, forecast, news lens, follow/timeline CTAs, fake account CTAs (per Decision 1–3), Morning Brief (per Decision 2), `/admin` noindex or 404; strip PoliticalPulse from Privacy/Terms/Contact; real contact email.
- **Likely files:** `HomePublication` / `HomeRightRail` / `HomeFeatureTools` / `PublicationNav` / `navConfig.ts` / `MorningBriefSignup` / `Footer` / `privacy` / `terms` / `contact` / `admin`.
- **Acceptance:** Stranger can use Today → brief without hitting Live-fake or Sign-up-fake.
- **Excluded:** Building polls, auth, ESP (unless Decision 2 is “wire ESP”).

### LP2 — Shareable briefs

- **Objective:** A URL opened in a private window shows the same story’s brief (or a clear analyze-from-URL path).
- **Scope:** Use slug or query to recover article URL; generate or cache as today; Share uses that URL. Keep localStorage as cache, not as the only source of truth.
- **Likely files:** `app/intelligence/[slug]/page.tsx`, `lib/selectedArticle.ts`, `ShareBriefButton.tsx`, maybe `StoryBriefLink`.
- **Acceptance:** Copy link → incognito → brief or “analyzing this URL”, never empty selectedArticle dead-end as the default share path.
- **Excluded:** Full server-side report store, user accounts, clustering.

### LP3 — Cost, abuse, framework hygiene

- **Objective:** Public traffic cannot unbounded-bill OpenAI; known critical Next advisories addressed.
- **Scope:** Rate-limit AI routes; optional global AI disable; request caps already on chat/snapshots; Next patch + homepage/brief regression.
- **Likely files:** new `middleware.ts` or route wrappers, `next.config.ts` headers, `package.json`.
- **Acceptance:** 429 under burst; `npm audit` without critical Next; brief still generates for a normal user.
- **Excluded:** WAF product, captcha unless abuse appears.

### LP4 — Measure and see failures

- **Objective:** Know if V1 works as a business.
- **Scope:** One analytics tool + event list in I; error monitoring or at least Vercel alerting; log NewsAPI 429 and OpenAI errors without secrets.
- **Likely files:** `app/layout.tsx`, thin client trackers on brief/homepage, privacy section update.
- **Acceptance:** Dashboard shows homepage views and story opens within 24h of traffic.
- **Excluded:** Full product analytics suite, heatmaps.

### LP5 — Cut over theanglereport.com

- **Objective:** The public domain serves this app, legally named, with env/DB correct.
- **Scope:** DNS/Vercel/coming-soon, env, Neon prod, robots after LP2, L9 license.
- **Likely files:** `layout.tsx` metadataBase; maybe `robots.ts`/`sitemap.ts`.
- **Acceptance:** Launch gate in L is all checked.
- **Excluded:** Rebranding campaigns, Angle+.

---

## L. Launch gate

**The Angle Report V1 is ready to launch** only when all of the following are true:

1. Homepage and nav do not present Live polls/forecasts, fake accounts, or fake newsletter success (LP1 + Decisions 1–3).
2. A shared brief URL works in a clean browser (LP2).
3. AI routes rate-limit; a burst cannot freely drain OpenAI (LP3).
4. Next.js critical audit items are accepted as patched or documented-risk-accepted in writing (LP3).
5. Privacy, Terms, Contact use The Angle Report and a monitored inbox (LP1).
6. NewsAPI production use is licensed or an alternative is in place (L9).
7. Analytics records homepage views and story opens (LP4).
8. theanglereport.com HTTPS serves this Vercel app; coming-soon is not the public site (LP5).
9. `/admin` is not a public fake ops console (L11).
10. Core path still works: Today → 60-second brief → Read original, plus Understand Any Article, without Neon failures breaking the brief.

Until then: **not ready**.

---

## Decisions required — Ryan

These are genuine product/business forks. Engineering should not pick silently.

### Decision 1 — Accounts at V1

- **A:** Hide Sign in / Create free account / Saved / Premium (recommended for honesty).
- **B:** Keep a clearly labeled “remember this browser” email with no “account” claims.

### Decision 2 — Morning Brief

- **A:** Hide the form until an ESP exists.
- **B:** Wire Buttondown/Resend/etc. with consent language in Privacy.

### Decision 3 — Polls and forecasts on the homepage

- **A:** Hide entirely (recommended).
- **B:** Keep but remove “Live” and label “Illustrative — not a real poll.”

### Decision 4 — NewsAPI

Confirm the current NewsAPI plan allows public production traffic at intended volume. If not, homepage cannot scale on that key.

No other launch decisions are required to start LP1–LP5.

---

## Technical notes

- Intelligence selected-article key remains `politicalpulse_selected_article` (`lib/selectedArticle.ts`).
- Report cache v4 is localStorage-only (`lib/services/reportCache.ts`).
- Neon: `stories`, `story_snapshots` only; unused Neon Auth was previously observed in the hosted DB as marketplace residue — **do not depend on it**.
- Homepage search is client filter of the fetched feed, not NewsAPI `q`.
- Article extraction can hold full text **server-side** for analysis; the 60-second brief shows summaries/short support fragments + links.
- `NEXT_PUBLIC_APP_URL` exists in `.env.example` but layout does not set `metadataBase` from it today.
