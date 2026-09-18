# Current Phase

Product: The Angle Report

## Checkpoints

- **Protected application checkpoint (pre-LP1):** `006ae52` — Add What Changed reader experience
- **LP1 public honesty:** `b1634e4` — De-scope incomplete V1 surfaces
- **LP2 shareable briefs:** `fb658d0` — Make intelligence briefs directly shareable
- **LP3 cost/abuse/security:** `ac16ee7` — Harden V1 cost abuse and security
- **LP3 homepage cleanup:** `8afe1c4` — Remove unnecessary homepage workaround
- **LP4 measurement:** `d18b592` — Add V1 product measurement
- **LP5 launch code readiness:** this commit — Prepare V1 for production launch

## Completed (product)

- Evidence-grounded 60-second brief
- Story history snapshots + deterministic diff
- What Changed reader module
- V1 launch gap **audit**
- **LP1** — hide incomplete V1 surfaces
- **LP2** — intelligence URLs resolve from `?u=` (canonical article URL) without requiring selectedArticle
- **LP3** — per-IP rate limits, `AI_DISABLED` kill switch, extract SSRF hardening, security headers, Next.js 16.3.3
- **LP4** — Vercel Web Analytics (Pro custom events, two properties) + typed funnel + sanitized ops logs
- **LP5 Phase 1** — production metadataBase, sitemap/robots, OG/Twitter image, shareable briefs `noindex,follow`

## Current state

LP5 **launch code** is ready. **Production cutover has NOT occurred.** `theanglereport.com` is still expected to serve Coming Soon until Ryan performs DNS/Vercel/env/Neon/NewsAPI configuration.

Do **not** start domain cutover unless authorized.

Do **not** start 2B.2.x AI phrasing, clustering, Angle+, forecasts-as-product, or other new features.

## Next planned work

**LP5 Phase 2 — production configuration and domain cutover**, if authorized.

Remaining launch gates: NewsAPI production license, Production env, Neon migrate, Vercel Pro + Web Analytics enablement, DNS away from Coming Soon.
