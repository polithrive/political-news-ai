# Current Phase

Product: The Angle Report

## Checkpoints

- **Protected application checkpoint (pre-LP1):** `006ae52` — Add What Changed reader experience
- **LP1 public honesty:** `b1634e4` — De-scope incomplete V1 surfaces
- **LP2 shareable briefs:** `fb658d0` — Make intelligence briefs directly shareable
- **LP3 cost/abuse/security:** `ac16ee7` — Harden V1 cost abuse and security
- **LP3 homepage cleanup:** `8afe1c4` — Remove unnecessary homepage workaround
- **LP4 measurement:** this commit — Add V1 product measurement

## Completed (product)

- Evidence-grounded 60-second brief
- Story history snapshots + deterministic diff
- What Changed reader module
- V1 launch gap **audit**
- **LP1** — hide incomplete V1 surfaces
- **LP2** — intelligence URLs resolve from `?u=` (canonical article URL) without requiring selectedArticle
- **LP3** — per-IP rate limits, `AI_DISABLED` kill switch, extract SSRF hardening, security headers, Next.js 16.3.3
- **LP4** — Vercel Web Analytics (Pro custom events, two properties) + typed funnel + sanitized ops logs

## Current state

LP4 is complete. Do **not** start LP5 unless authorized.

Do **not** start 2B.2.x AI phrasing, clustering, Angle+, forecasts-as-product, or other new features.

## Next planned work

**LP5 — Domain cutover**, if authorized.

Ryan must enable Web Analytics in the Vercel project dashboard if it is not already on.

NewsAPI production license remains a launch gate.
