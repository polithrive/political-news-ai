import type { IntelligenceReport } from "@/app/types/report";

import SectionHeader from "@/app/components/ui/SectionHeader";

import {
  getSourceRating,
  type PoliticalLean,
} from "@/lib/services/sourceRanking";

import { colors } from "@/lib/design/theme";

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

function getLeanPresentation(
  politicalLean: PoliticalLean
) {
  switch (politicalLean) {
    case "Left":
      return {
        backgroundColor:
          colors.political.progressiveSoft,
        borderColor:
          colors.political.progressive,
        color:
          colors.political.progressive,
      };

    case "Center":
      return {
        backgroundColor:
          colors.political.centristSoft,
        borderColor:
          colors.political.centrist,
        color:
          colors.political.centrist,
      };

    case "Right":
      return {
        backgroundColor:
          colors.political.conservativeSoft,
        borderColor:
          colors.political.conservative,
        color:
          colors.political.conservative,
      };

    default:
      return {
        backgroundColor:
          colors.background.muted,
        borderColor:
          colors.border.default,
        color:
          colors.text.secondary,
      };
  }
}

function getScoreColor(
  score: number
): string {
  if (score >= 95) {
    return colors.status.success;
  }

  if (score >= 85) {
    return colors.status.info;
  }

  if (score >= 75) {
    return colors.status.warning;
  }

  return colors.status.danger;
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

  return (
    <section
      aria-label="Source intelligence"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-[0_20px_55px_rgba(37,54,74,0.08)] sm:p-8 lg:p-10"
      style={{
        backgroundColor:
          colors.background.surface,
        borderColor:
          colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${colors.status.info}10`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="Source Intelligence™"
          title="Understand the Reporting Behind the Story"
          subtitle="Compare source reliability, editorial approach, political context, and the overall reporting landscape used in this analysis."
        />

        <div className="mt-8 space-y-6">
          <div className="grid gap-5 xl:grid-cols-2">
            {displayedSources.map(
              (sourceName) => {
                const rating =
                  getSourceRating(
                    sourceName
                  );

                const reliabilityLabel =
                  getReliabilityLabel(
                    rating.reliability
                  );

                const leanPresentation =
                  getLeanPresentation(
                    rating.politicalLean
                  );

                const reliabilityColor =
                  getScoreColor(
                    rating.reliability
                  );

                const factualColor =
                  getScoreColor(
                    rating.factualReporting
                  );

                return (
                  <article
                    key={sourceName}
                    className="overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      backgroundColor:
                        colors.background
                          .elevated,
                      borderColor:
                        colors.border.default,
                    }}
                  >
                    <div
                      className="border-b p-5 sm:p-6"
                      style={{
                        borderColor:
                          colors.border
                            .default,
                      }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p
                            className="text-xs font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color:
                                colors.text
                                  .muted,
                            }}
                          >
                            Source Profile
                          </p>

                          <h3
                            className="mt-2 text-xl font-semibold tracking-tight"
                            style={{
                              color:
                                colors.text
                                  .primary,
                            }}
                          >
                            {
                              rating.displayName
                            }
                          </h3>

                          <p
                            className="mt-2 text-sm"
                            style={{
                              color:
                                colors.text
                                  .secondary,
                            }}
                          >
                            {rating.country} ·{" "}
                            {
                              rating.ownershipType
                            }
                          </p>
                        </div>

                        <span
                          className="w-fit rounded-full border px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor:
                              leanPresentation.backgroundColor,
                            borderColor:
                              `${leanPresentation.borderColor}55`,
                            color:
                              leanPresentation.color,
                          }}
                        >
                          {
                            rating.politicalLean
                          }{" "}
                          lean
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div
                          className="rounded-xl border p-4"
                          style={{
                            backgroundColor:
                              colors.background
                                .surface,
                            borderColor:
                              colors.border
                                .default,
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  colors.text
                                    .primary,
                              }}
                            >
                              Reliability
                            </p>

                            <span
                              className="text-lg font-bold"
                              style={{
                                color:
                                  colors.text
                                    .primary,
                              }}
                            >
                              {
                                rating.reliability
                              }
                            </span>
                          </div>

                          <div
                            className="mt-3 h-2.5 overflow-hidden rounded-full"
                            style={{
                              backgroundColor:
                                colors.background
                                  .muted,
                            }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${rating.reliability}%`,
                                backgroundColor:
                                  reliabilityColor,
                              }}
                              aria-hidden="true"
                            />
                          </div>

                          <p
                            className="mt-2 text-xs"
                            style={{
                              color:
                                colors.text
                                  .muted,
                            }}
                          >
                            {
                              reliabilityLabel
                            }{" "}
                            reliability
                          </p>
                        </div>

                        <div
                          className="rounded-xl border p-4"
                          style={{
                            backgroundColor:
                              colors.background
                                .surface,
                            borderColor:
                              colors.border
                                .default,
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  colors.text
                                    .primary,
                              }}
                            >
                              Factual Reporting
                            </p>

                            <span
                              className="text-lg font-bold"
                              style={{
                                color:
                                  colors.text
                                    .primary,
                              }}
                            >
                              {
                                rating.factualReporting
                              }
                            </span>
                          </div>

                          <div
                            className="mt-3 h-2.5 overflow-hidden rounded-full"
                            style={{
                              backgroundColor:
                                colors.background
                                  .muted,
                            }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${rating.factualReporting}%`,
                                backgroundColor:
                                  factualColor,
                              }}
                              aria-hidden="true"
                            />
                          </div>

                          <p
                            className="mt-2 text-xs"
                            style={{
                              color:
                                colors.text
                                  .muted,
                            }}
                          >
                            Score out of 100
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.16em]"
                          style={{
                            color:
                              colors.text
                                .muted,
                          }}
                        >
                          Editorial Approach
                        </p>

                        <p
                          className="mt-2 text-sm leading-7 sm:text-base"
                          style={{
                            color:
                              colors.text
                                .secondary,
                          }}
                        >
                          {
                            rating.editorialApproach
                          }
                        </p>
                      </div>

                      <div
                        className="mt-5 rounded-xl border p-4"
                        style={{
                          backgroundColor:
                            colors.background
                              .surface,
                          borderColor:
                            colors.border
                              .default,
                        }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.16em]"
                          style={{
                            color:
                              colors.text
                                .muted,
                          }}
                        >
                          Political Context
                        </p>

                        <p
                          className="mt-2 text-sm leading-6"
                          style={{
                            color:
                              colors.text
                                .secondary,
                          }}
                        >
                          {
                            rating.biasExplanation
                          }
                        </p>
                      </div>

                      <div className="mt-5">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.16em]"
                          style={{
                            color:
                              colors.brand.primary,
                          }}
                        >
                          PoliticalPulse Trust
                          Summary
                        </p>

                        <p
                          className="mt-2 text-sm leading-6"
                          style={{
                            color:
                              colors.text
                                .secondary,
                          }}
                        >
                          {
                            rating.trustSummary
                          }
                        </p>
                      </div>

                      {rating.website ? (
                        <a
                          href={rating.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center text-sm font-semibold transition hover:underline"
                          style={{
                            color:
                              colors.brand
                                .secondary,
                          }}
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

          <article
            className="rounded-2xl border p-6"
            style={{
              backgroundColor:
                colors.status.successSoft,
              borderColor:
                `${colors.status.success}35`,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color:
                  colors.status.success,
              }}
            >
              PoliticalPulse Observation
            </p>

            <h3
              className="mt-3 text-xl font-semibold tracking-tight"
              style={{
                color: colors.text.primary,
              }}
            >
              Understanding the Reporting
              Landscape
            </h3>

            <p
              className="mt-4 text-sm leading-7 sm:text-base"
              style={{
                color:
                  colors.text.secondary,
              }}
            >
              PoliticalPulse reviewed{" "}
              {
                report.overview
                  .sourcesReviewed
              }{" "}
              source
              {report.overview
                .sourcesReviewed === 1
                ? ""
                : "s"}{" "}
              for this report. The current
              source set produced a reporting
              agreement score of{" "}
              {
                report.trustScore
                  .reportingAgreement
              }
              /100 and a political diversity
              rating of{" "}
              {report.trustScore.politicalDiversity.toLowerCase()}.
              Source ratings provide context
              about general reporting
              characteristics; they do not
              determine whether every
              individual article or claim is
              accurate.
            </p>
          </article>

          <div
            className="rounded-xl border px-5 py-4"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor:
                colors.border.default,
            }}
          >
            <p
              className="text-sm leading-6"
              style={{
                color: colors.text.muted,
              }}
            >
              Source Intelligence™ ratings are
              contextual tools, not endorsements.
              PoliticalPulse evaluates the evidence
              and claims in each report separately
              from a publication&apos;s general
              source profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}