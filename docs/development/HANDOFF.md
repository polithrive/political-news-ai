# Engineering Handoff

## Current Phase

**LP3 — Cost, abuse, and security** (GitHub issue **#6**) is **complete**.

Protected application checkpoint after this work: **Harden V1 cost abuse and security**.

Do **not** start LP4.

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| Application (2B.2) | `006ae52` | Add What Changed reader experience |
| LP1 | `b1634e4` | De-scope incomplete V1 surfaces |
| LP2 | `fb658d0` | Make intelligence briefs directly shareable |
| LP3 | this commit | Harden V1 cost abuse and security |

## Rate-limit architecture

In-memory sliding window (`lib/security/rateLimit.ts`). One `Map` of timestamps per **server instance**.

This is **not** distributed. On Vercel:

- Each serverless isolate has its own counters.
- Cold starts reset counters.
- Concurrent instances do not share quota.
- Determined attackers can exceed the documented numbers by spreading across instances.

It is still useful against casual abuse and accidental retry storms without adding Redis/Upstash.

**Client identity:** `getClientIp` in `lib/security/clientIp.ts`.

- When `VERCEL` is set: first hop of `X-Forwarded-For`, else `X-Real-IP`, else `unknown`.
- When `VERCEL` is not set: always `unknown` (do not trust spoofable forwarded headers).

No accounts. No cookies. No CAPTCHA.

### Endpoints and buckets

| Route | Cost class | Bucket | Limit / window | Kill switch |
|---|---|---|---|---|
| `POST /api/analyze-url` | extract + dual AI | `ai-expensive` | 8 / 10 min | yes |
| `POST /api/analyze` | dual AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/analyze-summary` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/analyze-political` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/analyze/debate` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/summarize` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/compare` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/bias` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/intelligence-graph` | AI | `ai-generate` | 24 / 10 min | yes |
| `POST /api/analyze-preview` | cached AI preview | `ai-preview` | 60 / 10 min | yes |
| `POST /api/chat` | AI | `ai-chat` | 40 / 10 min | yes |
| `POST /api/story-snapshots` | Neon write | `snapshots-write` | 40 / 10 min | no |
| `GET /api/story-snapshot-changes` | Neon read | `snapshots-read` | 90 / 10 min | no |
| `GET /api/news` | NewsAPI | `news` | 90 / 1 min | no |
| `POST /api/timeline` | mock, cheap | `cheap-api` | 40 / 10 min | no |

429 body: `{ error, retryAfterSeconds }` plus `Retry-After` header.

Preview is looser than `/api/analyze` so the homepage card grid can still load.

## Kill switch

Env: `AI_DISABLED=1` (also `true` / `yes` / `on`).

AI-generating routes return **503** `{ error: "AI analysis is temporarily unavailable..." }` before OpenAI is called. No secrets in the response.

Does **not** disable news acquisition or snapshot persist/read.

Documented in `.env.example`. Set in Vercel env to use without redeploying code (redeploy still needed if the variable is newly added to the project).

## SSRF changes

Previously `@extractus/article-extractor` fetched the URL (including redirects) after a hostname-only private IPv4 check.

Now:

1. `assertSafePublicHttpUrl` / `normalizeArticleUrl` — http(s) only, no userinfo, ports 80/443 only, blocked hosts (localhost, `.local`/`.internal`/`.corp`/`.lan`, metadata names, RFC1918, CGNAT, link-local/metadata 169.254, IPv6 loopback/ULA/link-local/multicast, IPv4-mapped private).
2. DNS lookup; any private/metadata A/AAAA fails closed.
3. `fetch` GET with `redirect: manual`, 10s timeout, 1.5 MB cap, HTML-ish content types.
4. Max 3 redirects; each `Location` is re-validated and re-resolved.
5. Extractor parses the **fetched HTML** only (not a follow-redirect fetch). Extractor-supplied `article.url` is re-checked; private values fall back to the fetch URL.

Residual: DNS rebinding between lookup and TCP/TLS connect (no IP-pinned TLS). Not a general proxy (no arbitrary method/host forwarding to the client).

## Security headers

Applied to `/:path*` in `next.config.ts`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-DNS-Prefetch-Control: off`
- `poweredByHeader: false`
- `Content-Security-Policy-Report-Only` (not enforcing)

**Why CSP is report-only:** Next.js 16 still emits inline/runtime scripts; publisher article images are arbitrary `https:`; LP4 analytics host is unknown. An enforcing CSP would be a product-break risk for V1.

Security headers apply to `/` and app routes. They are **not** applied to `/_next/image` or `/_next/static`, so they do not stack with Next's image-optimizer CSP.

Images: `formats: ["image/webp"]` so AVIF is not optimized. The homepage Capitol PNG is served `unoptimized` so the 16.3.3 optimizer cannot alter the lead visual.

Next 16.3.3 also enables a top-left DevTools badge and auto-rewrites `AGENTS.md` when it detects an agent. Product config sets `devIndicators: false` and `agentRules: false` so `next dev` matches the LP2 homepage chrome.

## Next.js versions

- Before: **16.2.10**
- After: **16.3.3** (and `eslint-config-next` 16.3.3)

16.2.11 patches the July 2026 GHSA set but **not** GHSA-2xp9-vwfh-vxw4 (AVIF/`libheif` RCE) or the August 2026 Windows RCE. Patched line for those is 16.3.3. Smallest appropriate secure 16.x.

Homepage follow-up commit: **Fix LP3 homepage regression** — 16.3.3 DevTools badge was covering the top-left brand; security headers no longer wrap `/_next/image`. Rate limits, kill switch, and SSRF are unchanged.

## `npm audit --omit=dev`

After Next.js 16.3.3:

- No Next.js production advisories remaining in this audit.
- Two **moderate** production advisories remain (not patched in this package; not Next itself):
  - `baseline-browser-mapping` GHSA-w5vr-8v7q-w6rv (DoS on invalid input)
  - `sanitize-html` GHSA-g8qq-57p8-ggw5 (SVG SMIL stored XSS in that library)
- `npm audit fix` was **not** run; it would be unrelated dependency churn outside LP3.

Critical Next.js items from 16.2.10 (July 2026 GHSA set + August 2026 AVIF/Windows RCE) are addressed by 16.3.3.

## Validation

- `npm test` (existing evidence/identity tests + new security tests)
- `npm run typecheck`
- `npm run build`
- `npm audit --omit=dev`
- `git diff --check`

Automated coverage includes: success under limit, 429 burst, independent buckets, kill switch 503, private/malformed URL reject, redirect SSRF, legitimate public URL normalize, security headers, analyze-url private 400, chat 503.

## Files changed

- `lib/security/*` (utilities + tests; `publicUrl.ts` is client-safe; `ssrf.ts` is imported only from the server extract path)
- `lib/services/articleExtractor.ts` (URL normalize)
- `lib/services/extractArticle.ts` (hardened fetch + parse)
- `app/api/*/route.ts` (public cost/abuse surfaces listed above)
- `next.config.ts`
- `package.json` / lockfile (Next 16.3.3)
- `.env.example` (`AI_DISABLED`)
- `docs/development/CURRENT_PHASE.md`, `HANDOFF.md`, `ARCHITECTURE.md`, `DECISIONS.md`

## Remaining security debt

- In-memory limiter is per-instance, not global.
- DNS-rebinding TOCTOU on extract fetch.
- Snapshot POST is still a client-originated contract (MVP trust boundary).
- Enforcing CSP deferred.
- Unused/legacy AI routes still exist but are now throttled + kill-switched.
- NewsAPI license still unverified (L9).
- No product analytics (LP4).

## Environment variables

| Name | Required | Effect |
|---|---|---|
| `AI_DISABLED` | no | `1`/`true`/`yes`/`on` disables AI routes (503) |
| `VERCEL` | set by Vercel | enables trust of platform forwarded IP |

Existing `OPENAI_API_KEY`, `NEWS_API_KEY`, `DATABASE_URL*` unchanged.

## Decisions required from Ryan

None for LP3. **Decision 4 (NewsAPI license)** still required before public scale.

## Next recommended action

Authorize **LP4 — Measurement** only. Do not start it from this handoff.

## Do not do yet

- LP4 analytics
- LP5 SEO/domain/cutover
- Forecasts/debates/clustering/AI What Changed/Angle+/extension
- Homepage or 60-second brief redesign
- Auth, ESP, or real polls
- Production DNS/domain changes

## Git status at handoff

Commit on `main` after push: `Harden V1 cost abuse and security`.
