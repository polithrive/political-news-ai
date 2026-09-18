# Engineering Handoff

## Current Phase

Phase 2B.1D implementation is complete (`43b5d95`).

Phase 2B.2 **architecture + UX audit is complete**. Phase 2B.2 **implementation has not started**.

GitHub issues: `#1` (2B.1D audit), `#2` (this 2B.2 audit).

## Protected Checkpoint

| Role | Hash | Message |
|---|---|---|
| 2B.1C writer | `8c633b3e6567418603eb7e6658444655a8d69b15` | Add story evidence snapshot writer |
| Workflow docs | `b850c79b0ac9954e45e0304a3ec7cc7024c59c3f` | Add agent collaboration workflow |
| 2B.1D audit | `fc81f5a1019746ebb107d3afaad17b8a43dc3d15` | Document Phase 2B.1D architecture audit |
| **Application (2B.1D)** | `43b5d95f66f1a6d2360e32d9068119ab26e0b80e` | Add deterministic story snapshot diffing |

## What Was Completed

This pass is **docs only**: Phase 2B.2 What Changed audit (issue #2). No runtime/UI code.

## Files Changed In Last Completed Phase

- `docs/development/HANDOFF.md`
- `docs/development/CURRENT_PHASE.md`

## Database State

Unchanged. Audit did not query or write Neon.

## Validation Status

- `git diff --check` / `git status` on these docs after the audit
- No `npm run build` required (no runtime changes)

## Known Limitations / Technical Debt

Unchanged from 2B.1D: client-originated snapshot POST; no Phase 1 revalidation; `story_key` = normalized primary URL; fingerprint duplicate-multiplicity mismatch vs unique-set diff.

## Next Recommended Action

Review this 2B.2 audit. If approved, authorize **implementation of the What Changed module** using the contract below — not clustering, not timeline, not AI phrasing.

## Do Not Do Yet

- Visible What Changed UI (until implementation is authorized)
- AI-generated change summaries
- Semantic story clustering
- Schema migrations
- Using Story Timeline / `/api/timeline` as history
- Broad brief redesign

## Questions / Decisions Needed

No **DECISION REQUIRED — RYAN**. Conservative defaults are recorded in the audit (placement, suppressed missing-from-newer, persist-then-read on fresh generate, GET on cache hit).

## Git Status At Handoff

Docs-only working tree until the audit commit is pushed.

---

# Phase 2B.2 What Changed — architecture + UX audit

Issue `#2`. Repository/code wins. Protected runtime: `43b5d95`.

## Product objective

Answer, for a **return visit to the same `story_key`**: what materially changed **between the two latest persisted evidence snapshots**?

Not a timeline. Not ground truth. Absence from the newer snapshot is **not** false / retracted / resolved / disproven.

---

## 1. Reader experience

**Placement (one slot, do not redesign the page):** inside `SixtySecondBrief`, **after What we know, before The angles**.

Current hierarchy in `SixtySecondBrief` + page:

Hero (`StoryBriefHeader`) → What happened / Why it matters → What we know → **[What changed]** → The angles → Still unclear → Where reporting differs → Reporting reviewed → Ask The Angle → Go deeper.

Why that slot: new corroborated facts sit next to What we know; the module stays in the 60-second scan, not buried in Go deeper, and not above the story summary.

**When it appears:** only if a **reader-facing view model** has at least one displayable item (see §2). Otherwise omit the section entirely (no empty card, no “nothing changed” on first visit).

**When omitted:** 0 snapshots; 1 snapshot; lookup `none`/`single`; Neon/error; `hasMaterialChange=false`; pair whose only internal deltas are withheld categories (missing-from-newer, independentSourceCount-only, sources-only without names, etc. — see §2).

**Collapsed/expanded:**

- **Expanded by default** if any `factsAdded`, `uncertaintiesAdded`, or `coverageDifferencesAdded` are shown.
- **Collapsed by default** if the only shown items are additional sources and/or a `limitedEvidence` note.
- Desktop and mobile: same component; full width of the brief column; no side rail. Use existing cards: `rounded-xl border border-[#17446D]/45 bg-[#04162C]/70`, eyebrow `text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]`.

**Hero “Updated” indicator:** **yes, but only when the module is actually shown.** Place a single quiet line in `StoryBriefHeader` meta row (with source · date), not a breaking-news badge:

- Copy: `Reporting updated` as a link to `#what-changed`
- Condition: reader view model is non-empty **and** we have `previous.capturedAt`
- Do **not** show merely because `hasMaterialChange` is true (scalar-only changes stay hidden)

---

## 2. Eligibility / display rules

Build a **reader filter** on top of `EvidenceSnapshotDiff`. Internal `hasMaterialChange` must not equal “show UI”.

| Situation | UI |
|---|---|
| 0 snapshots / `none` | Omit |
| 1 snapshot / `single` | Omit (first saved analysis) |
| Pair, `hasMaterialChange=false` | Omit |
| Pair, only `independentSourceCount` change | **Internal-only. Omit.** |
| Pair, `sourcesAdded` | Show up to **3** as “Additional reporting reviewed” **if** current snapshot has a display `sourceName` for that URL; otherwise omit that URL |
| Pair, `factsAdded` | **Show** up to **3** (highest value) |
| Pair, `uncertaintiesAdded` | **Show** up to **2** |
| Pair, `coverageDifferencesAdded` | **Show** up to **2** |
| Pair, any `*MissingFromNewer` | **MVP suppress entirely** (no reader benefit that stays conservative) |
| `limitedEvidence` true→false | Show one trust line |
| `limitedEvidence` false→true | Show one trust line |
| Duplicate fingerprint persist | After persist `duplicate`, latest pair is still previous vs stored current; apply the same filter (usually omit) |

**Display order:** facts → uncertainties → coverage differences → additional sources → limited-evidence note.

**Cap:** at most **8** visible items total (facts+uncertainties+coverage+sources). Drop from the bottom of the order if over cap.

**Do not reward churn:** paraphrase add+missing of the same idea is already a 2B.1D limitation; suppressing missing-from-newer avoids showing a scary “removed” list next to a rephrased fact.

---

## 3. Copy semantics (exact)

**Section eyebrow:** `What changed`

**Support line:** `Compared with the previous saved analysis`
If `previous.capturedAt` is a valid date, append: ` · {Month D, YYYY}` (same date style family as the header, **date only**, not time — avoids implying live news).

**Facts added (each item):**
Eyebrow: `New since the previous analysis`
Body: fact text (already normalized).
Optional control: `See evidence` only if the **current** snapshot fact with the same normalized text has URL-backed support (same pattern as `CorroboratedFact`). Disclosure in the evidence panel: `Saved with the latest analysis. This is not a new server-side recheck.`

**Uncertainties added:**
`New uncertainty in reviewed reporting` + text.

**Coverage added:**
`New difference in reviewed reporting` + text.

**Sources added:**
Group heading: `Additional reporting reviewed`
Each: publisher display name (from current snapshot `sourceName` + URL), linked if http(s).

**limitedEvidence true→false:**
`This brief now draws on more independent reporting than the previous saved analysis.`

**limitedEvidence false→true:**
`This brief now has more limited independent reporting than the previous saved analysis.`

**Forbidden words in this module:** retracted, debunked, resolved, proved, confirmed true, false, disproven, breaking.

**Empty/error:** render nothing. Do not say “We couldn’t check history.”

---

## 4. Data flow / server boundary

The intelligence page is a large `"use client"` component with `selectedArticle` in memory/localStorage and report-cache v4. **Do not convert the whole page to a Server Component** in 2B.2.

**Smallest architecture:**

1. **Pure mapper (client-safe):** `lib/services/whatChangedViewModel.ts` — `EvidenceSnapshotDiff` + current/previous rows → reader view model. Imports only types, `tryBuildStoryKey`, `normalizeFingerprintText`, display-name helper. **No** `server-only`, Drizzle, Neon, `node:crypto`.
2. **Narrow route handlers (server-only):**
   - Keep `POST /api/story-snapshots` as the write path. **Extend the JSON** after successful persist attempt with `{ status, whatChanged }` where `whatChanged` is the reader view model from `diffLatestStorySnapshots` **after** the write (or `null` if not a pair / not displayable). Failures still return `{ status: "skipped" }` without throwing to the client brief.
   - Add **`GET /api/story-snapshot-changes?url=`** (or `storyKey`) that calls `diffLatestStorySnapshots`, maps to the view model, returns `{ whatChanged: viewModel | null }`. Treat bad URL / DB error as `{ whatChanged: null }`. This is an **internal read API for this page**, not a public product history API (no listing, no auth, no extra stories).
3. **Do not** import `getStorySnapshotPair.ts` from `SixtySecondBrief` or the page module graph except via `fetch`.
4. **Do not** use Server Actions for this; existing fetch + route handlers match 2B.1C.

History lookup must **never** run inside `/api/analyze` or `/api/analyze-url` and must never delay `setReport`.

---

## 5. Timing / race

Today: `setReport` then fire-and-forget `POST /api/story-snapshots`. A parallel GET of the latest pair can compare **two older** snapshots (missing the in-flight write) or see **only one** row.

**Required orchestration change (still fail-closed):**

1. Fresh generate: `cacheReport` + `setReport` **first** (brief paints).
2. Then, in `persistStorySnapshotBestEffort` (or successor): **await** the persist POST **only to populate What Changed**, inside the existing try/catch. Use the response `whatChanged`. Do not `setErrorMessage` on persist failure; leave What Changed omitted.
3. **Do not** GET history **before** that persist attempt returns on a fresh generate.
4. Duplicate persist (`status: "duplicate"`): still return `whatChanged` from latest pair (correct previous vs already-stored current).
5. **No sleeps, no polling, no retries.**

Cache hit / reload: **no persist**. `GET /api/story-snapshot-changes` once after the report is on screen. Fail closed.

This is a deliberate, small change to write/read orchestration, not a redesign of 2B.1C isolation.

---

## 6. Cache behavior

Report cache v4 still stores **only** `IntelligenceReport`. Do **not** put diffs or view models in localStorage (they go stale vs Neon).

| Event | Behavior |
|---|---|
| Fresh generation | Brief from generate; What Changed from persist response after write |
| Report cache hit | Brief from v4; What Changed from GET; omit if null |
| Reload, cache valid | Same as cache hit |
| Revisit later, cache expired | Fresh generate path |
| Duplicate fingerprint | Persist `duplicate`; What Changed from post-write pair (usually omit) |
| Neon unavailable | Persist skipped / GET null; brief unchanged |

---

## 7. Story identity limitation

`story_key` = normalized primary URL. Homepage story A vs URL-submit of a different article URL for the “same event” are **separate histories**. UX: What Changed may be absent on a URL the reader thinks is the same story. **Do not add clustering in 2B.2.** Optional later helper copy is **out of scope** (would need a Ryan product call). Implementation should not mention other URLs.

---

## 8. Materiality (reader vs internal)

Keep 2B.1D `hasMaterialChange` as-is for tests/history correctness.

Reader priority:

1. New corroborated facts
2. New uncertainties
3. New coverage differences
4. Additional sources (named)
5. limitedEvidence transition

Withhold: missing-from-newer; independentSourceCount-only; unnamed source URLs; publisher/support/title (already non-identity).

---

## 9. Provenance

- **Source count on the module:** no extra Trust Score. Optional: “N additional sources” only as the additional-reporting group.
- **Publisher names:** yes, from **current snapshot** source/fact records for displayed items, via existing `formatPublisherDisplayName`.
- **See evidence:** only for displayed new facts with current-snapshot support fragments. Same UI pattern as What we know. Must not claim a new validation pass.
- **Timestamps:** previous snapshot `capturedAt` date on the support line only. Do not show a live “Updated 2 minutes ago” relative ticker.
- **Disclaimer (once, visually quiet):** `This compares saved analyses of this article URL. It is not a live news alert.`

---

## 10. Accessibility / performance

- Section: `<section id="what-changed" aria-labelledby="what-changed-heading">`
- Heading: visible `h2` using the same eyebrow pattern; if collapsed, `button` with `aria-expanded`, `aria-controls`.
- Keyboard: focus-visible outline `#38BDF8` like existing brief links.
- Screen reader: collapsed summary e.g. `What changed, 2 new items` / expanded reads each item.
- Motion: no animation required; if expand/collapse is used, `prefers-reduced-motion: reduce` → instant.
- Loading: **do not** reserve a large skeleton that shifts the brief. Omit until data exists (possible small late insert). Accept a **small** layout insert after persist/GET rather than polling. Do not block first paint of What happened / What we know.
- Error: omit module.
- No client interval polling.

---

## 11. Validation plan

**Unit (view model):** fixtures from 2B.1D diffs → empty vs facts vs sources vs limitedEvidence vs missing-from-newer suppressed; caps; sort order.

**Manual / browser (implementation phase):**

- First visit / one snapshot → no module, no header chip
- No material change / duplicate fingerprint → omit
- New fact → expanded module + header link
- Added source only → collapsed module
- Uncertainty added / coverage added → expanded
- limitedEvidence transition only → collapsed note
- Missing-from-newer-only pair → omit
- History unavailable / bad Neon → brief OK, no module
- Same event, different primary URL → independent omit/show
- Mobile: module readable, no horizontal overflow
- Cache hit / reload / revisit → GET path, no persist
- Fresh write race: What Changed must reflect persist-after-generate pair, not two older rows

Do not use mock timeline data.

---

## 12. Implementation scope

**Add**

- `lib/services/whatChangedViewModel.ts` (+ tests)
- `app/api/story-snapshot-changes/route.ts` (GET)
- `app/components/brief/WhatChanged.tsx`

**Modify**

- `app/api/story-snapshots/route.ts` — after persist, attach `whatChanged` (null-safe)
- `app/intelligence/[slug]/page.tsx` — await persist only for What Changed; GET on cache hit; pass props; never fail brief
- `app/components/brief/SixtySecondBrief.tsx` — slot after What we know
- `app/components/brief/StoryBriefHeader.tsx` — optional `Reporting updated` link
- `docs/development/*` after implementation

**Do not modify**

- `lib/db/schema.ts`, drizzle migrations
- `/api/analyze`, `/api/analyze-url`
- report-cache key/TTL/v4 shape
- timeline, persist fingerprint algorithm, story_key rules

**Defer**

- Phase 2B.2.x: AI phrasing of diffs
- Semantic clustering
- Public/user history feed
- Showing missing-from-newer
- Showing independentSourceCount-only
- RSC rewrite of the intelligence page

**Ready to authorize implementation?** Yes, after this audit is reviewed, for the scope above only.
