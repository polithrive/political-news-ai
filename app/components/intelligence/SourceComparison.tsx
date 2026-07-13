import type { IntelligenceReport } from "@/app/types/report";

import {
  getSourceRating,
  type PoliticalLean,
} from "@/lib/services/sourceRanking";

import ReportSection from "./ReportSection";

type SourceComparisonProps = {
  report: IntelligenceReport;
};

function getReliabilityLabel(score: number): string {
  if (score >= 95) {
    return "Exceptional";
  }

  if (score >= 90) {
    return "Very high";
  }

  if (score >= 80) {
    return "High";
  }

  if (score >= 70) {
    return "Moderate";
  }

  return "Limited";
}

function getLeanClassName(
  politicalLean: PoliticalLean
): string {
  switch (politicalLean) {
    case "Left":
      return "border-blue-800/70 bg-blue-950/30 text-blue-300";

    case "Center":
      return "border-violet-800/70 bg-violet-950/30 text-violet-300";

    case "Right":
      return "border-red-800/70 bg-red-950/30 text-red-300";

    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

function getScoreBarClassName(score: number): string {
  if (score >= 95) {
    return "bg-emerald-400";
  }

  if (score >= 85) {
    return "bg-cyan-400";
  }

  if (score >= 75) {
    return "bg-amber-400";
  }

  return "bg-red-400";
}

export default function SourceComparison({
  report,
}: SourceComparisonProps) {
  const sourceNames = Array.from(
    new Set(
      [
        ...report.evidence.primarySources,
        report.article.source?.name,
      ]
        .filter(
          (sourceName): sourceName is string =>
            typeof sourceName === "string" &&
            Boolean(sourceName.trim())
        )
        .map((sourceName) => sourceName.trim())
    )
  );

  const displayedSources =
    sourceNames.length > 0
      ? sourceNames
      : ["Unknown Source"];

  return (
    <ReportSection
      title="Source Intelligence™"
      subtitle="Understand the reliability, editorial approach, and political context of the reporting behind this analysis"
      icon="📰"
    >
      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-2">
          {displayedSources.map((sourceName) => {
            const rating =
              getSourceRating(sourceName);

            const reliabilityLabel =
              getReliabilityLabel(
                rating.reliability
              );

            return (
              <article
                key={sourceName}
                className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80"
              >
                <div className="border-b border-slate-700 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Source profile
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-white">
                        {rating.displayName}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        {rating.country} ·{" "}
                        {rating.ownershipType}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getLeanClassName(
                        rating.politicalLean
                      )}`}
                    >
                      {rating.politicalLean} lean
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-300">
                          Reliability
                        </p>

                        <span className="text-lg font-bold text-white">
                          {rating.reliability}
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full ${getScoreBarClassName(
                            rating.reliability
                          )}`}
                          style={{
                            width: `${rating.reliability}%`,
                          }}
                          aria-hidden="true"
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {reliabilityLabel} reliability
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-300">
                          Factual reporting
                        </p>

                        <span className="text-lg font-bold text-white">
                          {rating.factualReporting}
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full ${getScoreBarClassName(
                            rating.factualReporting
                          )}`}
                          style={{
                            width: `${rating.factualReporting}%`,
                          }}
                          aria-hidden="true"
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        Score out of 100
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Editorial approach
                    </p>

                    <p className="mt-2 leading-7 text-slate-300">
                      {rating.editorialApproach}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Political context
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {rating.biasExplanation}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      PoliticalPulse trust summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {rating.trustSummary}
                    </p>
                  </div>

                  {rating.website ? (
                    <a
                      href={rating.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Visit official website
                      <span
                        className="ml-2"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <article className="rounded-2xl border border-emerald-800/60 bg-emerald-950/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            PoliticalPulse observation
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            Understanding the reporting landscape
          </h3>

          <p className="mt-4 leading-7 text-slate-300">
            PoliticalPulse reviewed{" "}
            {report.overview.sourcesReviewed} source
            {report.overview.sourcesReviewed === 1
              ? ""
              : "s"}{" "}
            for this report. The current source set produced a
            reporting agreement score of{" "}
            {report.trustScore.reportingAgreement}/100 and a
            political diversity rating of{" "}
            {report.trustScore.politicalDiversity.toLowerCase()}.
            Source ratings provide context about general
            reporting characteristics; they do not determine
            whether every individual article or claim is
            accurate.
          </p>
        </article>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-4">
          <p className="text-sm leading-6 text-slate-500">
            Source Intelligence™ ratings are contextual tools,
            not endorsements. PoliticalPulse evaluates the
            evidence and claims in each report separately from
            a publication&apos;s general source profile.
          </p>
        </div>
      </div>
    </ReportSection>
  );
}