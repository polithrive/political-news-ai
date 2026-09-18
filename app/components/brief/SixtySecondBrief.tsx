"use client";

import type { Article } from "@/app/types/article";
import type {
  EvidenceBriefAngle,
  EvidenceBriefCoverageDifference,
  EvidenceBriefFact,
  IntelligenceReport,
} from "@/app/types/report";
import type { EvidenceStrength } from "@/app/types/trust";
import type { WhatChangedViewModel } from "@/lib/services/whatChangedViewModel";

import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import { trackEvent } from "@/lib/analytics/track";

import CorroboratedFact from "./CorroboratedFact";
import WhatChanged from "./WhatChanged";
import {
  formatPublisherDisplayName,
  readerFacingBriefText,
  usableText,
} from "./briefUi";

type SixtySecondBriefProps = {
  article: Article;
  report: IntelligenceReport;
  whatChanged?: WhatChangedViewModel | null;
  storyRef?: string;
};

type BriefSource = {
  name: string;
  url?: string;
};

function uniqueSources(
  report: IntelligenceReport,
  article: Article
): BriefSource[] {
  const related = report.evidence.relatedSources ?? [];

  if (related.length > 0) {
    const seen = new Set<string>();
    const sources: BriefSource[] = [];

    for (const source of related) {
      const key = source.url || source.sourceName;

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      sources.push({
        name: formatPublisherDisplayName(
          source.sourceName || source.title,
          source.url
        ),
        url: source.url || undefined,
      });
    }

    return sources;
  }

  const names = (report.evidence.primarySources ?? [])
    .map((name) => name.trim())
    .filter(Boolean);
  const originName = article.source?.name?.trim();
  const uniqueNames = originName
    ? Array.from(new Set([originName, ...names]))
    : Array.from(new Set(names));

  return uniqueNames.map((name) => ({
    name: formatPublisherDisplayName(name),
  }));
}

function SectionEyebrow({
  title,
  support,
  className = "mb-3",
}: {
  title: string;
  support?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        {title}
      </h2>
      {support ? (
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#8EA3B7]">
          {support}
        </p>
      ) : null}
    </header>
  );
}

function reviewedSourcePhrase(count: number): string {
  if (count === 1) {
    return "one reviewed source";
  }

  return `${count} reviewed sources`;
}

function StorySummary({
  whatHappened,
  whyItMatters,
}: {
  whatHappened: string | null;
  whyItMatters: string | null;
}) {
  if (!whatHappened && !whyItMatters) {
    return null;
  }

  const columns =
    whatHappened && whyItMatters
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1";

  return (
    <section className="grid gap-4" aria-label="The story">
      <div className={`grid ${columns} gap-4`}>
        {whatHappened ? (
          <article className="rounded-xl border border-[#17446D]/50 bg-[#04162C]/80 px-4 py-4 sm:px-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
              What happened
            </h2>
            <p className="mt-3 text-base leading-7 text-[#E6EDF4]">
              {whatHappened}
            </p>
          </article>
        ) : null}

        {whyItMatters ? (
          <article className="rounded-xl border border-[#17446D]/50 bg-[#04162C]/80 px-4 py-4 sm:px-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
              Why it matters
            </h2>
            <p className="mt-3 text-base leading-7 text-[#E6EDF4]">
              {whyItMatters}
            </p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function WhatWeKnow({
  facts,
  sourcesReviewed,
  storyRef,
}: {
  facts: EvidenceBriefFact[];
  sourcesReviewed: number;
  storyRef: string;
}) {
  const reviewedCount = Math.max(1, sourcesReviewed);

  return (
    <section>
      <SectionEyebrow
        title="What we know"
        className="mb-2"
        support={
          facts.length > 0
            ? "Key facts supported across the reporting reviewed."
            : undefined
        }
      />

      {facts.length > 0 ? (
        <div className="divide-y divide-[#17446D]/45 rounded-xl border border-[#17446D]/45 bg-[#04162C]/70 px-4 sm:px-5">
          {facts.map((fact, index) => (
            <CorroboratedFact
              key={`${fact.text}-${index}`}
              fact={fact}
              onEvidenceOpened={() => {
                trackEvent(
                  ANALYTICS_EVENTS.evidenceOpened,
                  { surface: "brief", detail: storyRef },
                  { onceKey: `evidence:${storyRef}` }
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="border-l-2 border-[#55C8FF]/80 pl-4">
          <p className="text-sm leading-6 text-[#D5E0EC]">
            Independent corroboration isn&apos;t available yet.
          </p>
          <p className="mt-1 text-sm leading-6 text-[#8EA3B7]">
            This brief is currently based on {reviewedSourcePhrase(reviewedCount)}.
          </p>
        </div>
      )}
    </section>
  );
}

function angleGridClass(count: number): string {
  if (count <= 1) {
    return "grid-cols-1";
  }

  if (count === 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }

  if (count === 3) {
    return "grid-cols-1 lg:grid-cols-3";
  }

  return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
}

function TheAngles({
  angles,
  storyRef,
}: {
  angles: EvidenceBriefAngle[];
  storyRef: string;
}) {
  if (angles.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionEyebrow
        title="The angles"
        support="How different parts of the reporting approach this story."
      />

      <div className={`grid gap-3 ${angleGridClass(angles.length)}`}>
        {angles.map((angle, index) => (
          <article
            key={`${angle.label}-${index}`}
            className="border-t border-[#17446D]/50 pt-3"
            onClick={() => {
              trackEvent(
                ANALYTICS_EVENTS.angleInteracted,
                { surface: "brief", detail: storyRef },
                { onceKey: `angle:${storyRef}` }
              );
            }}
          >
            <h3 className="font-serif text-lg font-black tracking-[-0.02em] text-white sm:text-xl">
              {angle.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#B5C3D2]">
              {angle.summary}
            </p>
            {angle.representedBy.length > 0 ? (
              <p className="mt-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#7A93AA]">
                {angle.representedBy
                  .map((name) => formatPublisherDisplayName(name))
                  .join(" · ")}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function StillUnclear({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionEyebrow title="Still unclear" />

      <div className="border-l-2 border-[#E8B84A] pl-4">
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-2.5 text-sm leading-6 text-[#E8D7B0]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B84A]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhereReportingDiffers({
  items,
}: {
  items: EvidenceBriefCoverageDifference[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionEyebrow
        title="Where reporting differs"
        support="Meaningful differences in how the reviewed reporting framed this story."
      />

      <ul className="divide-y divide-[#17446D]/45 border-t border-[#17446D]/40">
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`} className="py-3 first:pt-2">
            <p className="text-sm leading-6 text-[#D5E0EC]">{item.text}</p>
            {item.representedBy.length > 0 ? (
              <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#7A93AA]">
                {item.representedBy
                  .map((name) => formatPublisherDisplayName(name))
                  .join(" · ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-[4.75rem]">
      <p className="font-serif text-2xl font-black tracking-[-0.03em] text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8EA3B7]">
        {label}
      </p>
    </div>
  );
}

function ReportingReviewed({
  sources,
  sourcesReviewed,
  ratedSourceCount,
  evidenceStrength,
}: {
  sources: BriefSource[];
  sourcesReviewed: number | null;
  ratedSourceCount: number | null;
  evidenceStrength: EvidenceStrength | null;
}) {
  const visibleSources = sources.slice(0, 3);
  const extraCount = Math.max(0, sources.length - visibleSources.length);
  const reviewedCount =
    typeof sourcesReviewed === "number" && sourcesReviewed > 0
      ? sourcesReviewed
      : sources.length > 0
        ? sources.length
        : null;

  if (
    reviewedCount === null &&
    !evidenceStrength &&
    sources.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <SectionEyebrow title="Reporting reviewed" />

      <div className="border-t border-[#17446D]/40 pt-3">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {reviewedCount !== null ? (
            <Metric
              value={String(reviewedCount)}
              label={
                reviewedCount === 1
                  ? "source reviewed"
                  : "sources reviewed"
              }
            />
          ) : null}

          {typeof ratedSourceCount === "number" &&
          ratedSourceCount > 0 ? (
            <Metric
              value={String(ratedSourceCount)}
              label={
                ratedSourceCount === 1
                  ? "rated source"
                  : "rated sources"
              }
            />
          ) : null}

          {evidenceStrength ? (
            <Metric
              value={evidenceStrength.toUpperCase()}
              label="evidence strength"
            />
          ) : null}
        </div>

        {sources.length > 0 ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#D5E0EC]">
            {visibleSources.map((source, index) => (
              <span key={source.url || source.name} className="inline-flex">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#7DD3FC] underline decoration-[#31577A] underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
                  >
                    {source.name}
                  </a>
                ) : (
                  <span className="font-medium">{source.name}</span>
                )}
                {index < visibleSources.length - 1 ? (
                  <span className="ml-2 text-[#8EA3B7]">·</span>
                ) : null}
              </span>
            ))}
            {extraCount > 0 ? (
              <span className="text-[#8EA3B7]">+{extraCount}</span>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function SixtySecondBrief({
  article,
  report,
  whatChanged = null,
  storyRef = "unknown",
}: SixtySecondBriefProps) {
  const brief = report.brief;
  const whatHappened = readerFacingBriefText(
    brief ? brief.whatHappened : report.executiveSummary
  );
  const whyItMatters = readerFacingBriefText(
    brief ? brief.whyItMatters : report.whyThisMatters
  );
  const facts = (brief?.corroboratedFacts ?? [])
    .map((fact) => {
      const text = readerFacingBriefText(fact.text);

      if (!text) {
        return null;
      }

      return {
        ...fact,
        text,
      };
    })
    .filter(
      (fact): fact is NonNullable<typeof fact> => fact !== null
    );
  const angles = (brief?.angles ?? [])
    .map((angle) => ({
      ...angle,
      summary: readerFacingBriefText(angle.summary) ?? "",
    }))
    .filter(
      (angle) => usableText(angle.label) && angle.summary
    );
  const coverageDifferences = (brief?.coverageDifferences ?? [])
    .map((item) => ({
      ...item,
      text: readerFacingBriefText(item.text) ?? "",
    }))
    .filter((item) => item.text);
  const uncertainties = (brief?.uncertainties ?? [])
    .map((item) => readerFacingBriefText(item))
    .filter((item): item is string => Boolean(item));
  const sources = uniqueSources(report, article);
  const sourcesReviewed =
    typeof report.overview.sourcesReviewed === "number" &&
    report.overview.sourcesReviewed > 0
      ? report.overview.sourcesReviewed
      : typeof report.trustScore.sourceCount === "number" &&
          report.trustScore.sourceCount > 0
        ? report.trustScore.sourceCount
        : sources.length;
  const ratedSourceCount =
    typeof report.trustScore.ratedSourceCount === "number" &&
    report.trustScore.ratedSourceCount > 0
      ? report.trustScore.ratedSourceCount
      : null;
  const evidenceStrength =
    report.trustScore.evidenceStrength === "Low" ||
    report.trustScore.evidenceStrength === "Medium" ||
    report.trustScore.evidenceStrength === "High"
      ? report.trustScore.evidenceStrength
      : null;

  return (
    <div id="brief" className="mt-6 space-y-6 sm:mt-7 sm:space-y-7">
      <StorySummary
        whatHappened={whatHappened}
        whyItMatters={whyItMatters}
      />

      <WhatWeKnow
        facts={facts}
        sourcesReviewed={sourcesReviewed || sources.length || 1}
        storyRef={storyRef}
      />

      {whatChanged ? (
        <WhatChanged whatChanged={whatChanged} storyRef={storyRef} />
      ) : null}

      <TheAngles angles={angles} storyRef={storyRef} />

      <StillUnclear items={uncertainties} />

      <WhereReportingDiffers items={coverageDifferences} />

      <ReportingReviewed
        sources={sources}
        sourcesReviewed={sourcesReviewed || null}
        ratedSourceCount={ratedSourceCount}
        evidenceStrength={evidenceStrength}
      />
    </div>
  );
}
