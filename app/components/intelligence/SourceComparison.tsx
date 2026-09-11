import type { IntelligenceReport } from "@/app/types/report";

import {
  getSourceRating,
  type PoliticalLean,
} from "@/lib/services/sourceRanking";

type SourceComparisonProps = {
  report: IntelligenceReport;
};

function getReliabilityLabel(
  score: number
): string {
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

function getScoreStyles(score: number) {
  if (score >= 95) {
    return {
      text: "text-emerald-400",
      bar: "bg-emerald-400",
      border: "border-emerald-400/20",
    };
  }

  if (score >= 85) {
    return {
      text: "text-[#55C8FF]",
      bar: "bg-[#38BDF8]",
      border: "border-[#38BDF8]/20",
    };
  }

  if (score >= 75) {
    return {
      text: "text-amber-400",
      bar: "bg-amber-400",
      border: "border-amber-400/20",
    };
  }

  return {
    text: "text-[#FF6570]",
    bar: "bg-[#FF2638]",
    border: "border-[#FF2638]/20",
  };
}

function getLeanStyles(
  politicalLean: PoliticalLean
) {
  switch (politicalLean) {
    case "Left":
      return {
        badge:
          "border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#55C8FF]",
        label: "Progressive / Left",
      };

    case "Center":
      return {
        badge:
          "border-slate-400/25 bg-slate-400/10 text-slate-300",
        label: "Center",
      };

    case "Right":
      return {
        badge:
          "border-[#FF2638]/30 bg-[#FF2638]/10 text-[#FF6570]",
        label: "Conservative / Right",
      };

    default:
      return {
        badge:
          "border-[#17446D] bg-[#020D21]/60 text-[#9CB0C5]",
        label: politicalLean,
      };
  }
}

function ScoreCard({
  label,
  score,
  description,
}: {
  label: string;
  score: number;
  description: string;
}) {
  const styles = getScoreStyles(score);

  return (
    <div
      className={`rounded-xl border ${styles.border} bg-[#020D21]/55 p-4`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">
          {label}
        </p>

        <span
          className={`text-lg font-black ${styles.text}`}
        >
          {score}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0B213A]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
          style={{
            width: `${Math.max(
              0,
              Math.min(100, score)
            )}%`,
          }}
          aria-hidden="true"
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-[#7890A7]">
        {description}
      </p>
    </div>
  );
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
          (
            sourceName
          ): sourceName is string =>
            typeof sourceName === "string" &&
            Boolean(sourceName.trim())
        )
        .map((sourceName) =>
          sourceName.trim()
        )
    )
  );

  const displayedSources =
    sourceNames.length > 0
      ? sourceNames
      : ["Unknown Source"];

  const sourcesReviewed =
    report.overview.sourcesReviewed;

  const reportingAgreement =
    report.trustScore.reportingAgreement;

  const politicalDiversity =
    report.trustScore.politicalDiversity;

  return (
    <section
      aria-label="Source intelligence"
      className="relative overflow-hidden rounded-3xl border border-[#17446D] bg-[#04162C] shadow-2xl shadow-black/20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#38BDF8]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[#FF2638]/[0.035] blur-3xl"
      />

      <div className="relative border-b border-[#17446D]/70 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
              Source Intelligence™
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
              Understand the Reporting
              Behind the Story
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9CB0C5] sm:text-base">
              Compare source reliability,
              editorial approach, political
              context, and the overall reporting
              landscape used in this analysis.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#55C8FF]">
              Source Analysis
            </span>

            <span className="rounded-full border border-[#17446D] bg-[#061A31] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9CB0C5]">
              Reporting Context
            </span>
          </div>
        </div>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="space-y-6">
          <div className="grid gap-5 xl:grid-cols-2">
            {displayedSources.map(
              (sourceName) => {
                const rating =
                  getSourceRating(sourceName);

                const reliabilityLabel =
                  getReliabilityLabel(
                    rating.reliability
                  );

                const leanStyles =
                  getLeanStyles(
                    rating.politicalLean
                  );

                return (
                  <article
                    key={sourceName}
                    className="overflow-hidden rounded-2xl border border-[#17446D] bg-[#061A31] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#38BDF8]/40"
                  >
                    <div className="border-b border-[#17446D]/70 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7890A7]">
                            Source Profile
                          </p>

                          <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                            {rating.displayName}
                          </h3>

                          <p className="mt-2 text-sm text-[#8EA3B7]">
                            {rating.country} ·{" "}
                            {rating.ownershipType}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${leanStyles.badge}`}
                        >
                          {leanStyles.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ScoreCard
                          label="Reliability"
                          score={
                            rating.reliability
                          }
                          description={`${reliabilityLabel} reliability`}
                        />

                        <ScoreCard
                          label="Factual Reporting"
                          score={
                            rating.factualReporting
                          }
                          description="Score out of 100"
                        />
                      </div>

                      <div className="mt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#7890A7]">
                          Editorial Approach
                        </p>

                        <p className="mt-3 text-sm leading-7 text-[#B3C3D2] sm:text-base">
                          {
                            rating.editorialApproach
                          }
                        </p>
                      </div>

                      <div className="mt-5 rounded-xl border border-[#17446D]/70 bg-[#020D21]/55 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#55C8FF]">
                          Political Context
                        </p>

                        <p className="mt-3 text-sm leading-6 text-[#9CB0C5]">
                          {
                            rating.biasExplanation
                          }
                        </p>
                      </div>

                      <div className="mt-5 rounded-xl border border-[#38BDF8]/20 bg-[#38BDF8]/[0.045] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#55C8FF]">
                            The Angle Report
                          </p>

                          <span className="rounded-full border border-[#17446D] bg-[#020D21]/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#8EA3B7]">
                            Trust Summary
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#B3C3D2]">
                          {rating.trustSummary}
                        </p>
                      </div>

                      {rating.website ? (
                        <a
                          href={rating.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center text-sm font-bold text-[#55C8FF] transition hover:text-[#7DD3FC] hover:underline"
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
              }
            )}
          </div>

          <article className="rounded-2xl border border-[#38BDF8]/20 bg-[#061A31] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                  The Angle Report
                </p>

                <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                  Understanding the Reporting
                  Landscape
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#B3C3D2] sm:text-base">
                  The Angle Report reviewed{" "}
                  {sourcesReviewed} source
                  {sourcesReviewed === 1
                    ? ""
                    : "s"}{" "}
                  for this report.                   The current
                  source set produced a reporting
                  agreement score of{" "}
                  {reportingAgreement === null
                    ? "N/A"
                    : `${reportingAgreement}/100`}{" "}
                  and a
                  political diversity rating of{" "}
                  {politicalDiversity.toLowerCase()}.
                  Source ratings provide context
                  about general reporting
                  characteristics; they do not
                  determine whether every
                  individual article or claim is
                  accurate.
                </p>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:min-w-[360px] lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-xl border border-[#17446D]/70 bg-[#020D21]/55 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#7890A7]">
                    Sources
                  </p>

                  <p className="mt-2 text-xl font-black text-[#55C8FF]">
                    {sourcesReviewed}
                  </p>
                </div>

                <div className="rounded-xl border border-[#17446D]/70 bg-[#020D21]/55 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#7890A7]">
                    Agreement
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {reportingAgreement === null
                      ? "N/A"
                      : reportingAgreement}
                    {reportingAgreement === null ? null : (
                      <span className="text-xs text-[#7890A7]">
                        /100
                      </span>
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[#17446D]/70 bg-[#020D21]/55 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#7890A7]">
                    Diversity
                  </p>

                  <p className="mt-2 text-base font-black capitalize text-white">
                    {politicalDiversity}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="flex items-start gap-3 rounded-xl border border-[#17446D]/80 bg-[#020D21]/45 px-5 py-4">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#38BDF8]/35 text-[10px] font-black text-[#55C8FF]">
              i
            </div>

            <p className="text-sm leading-6 text-[#8299AE]">
              Source Intelligence™ ratings are
              contextual tools, not endorsements.
              The Angle Report evaluates the
              evidence and claims in each report
              separately from a publication&apos;s
              general source profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}