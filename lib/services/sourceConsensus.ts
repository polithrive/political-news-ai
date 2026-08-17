import type { RankedArticle } from "./multiSource";

export type SourceConsensus = {
  sourceCount: number;

  ratedSourceCount: number;

  averageReliability: number | null;

  averageFactualReporting: number | null;

  reportingAgreement: number | null;

  sourceQualityScore: number | null;

  sourceNames: string[];

  politicalDistribution: {
    left: number;
    center: number;
    right: number;
    mixed: number;
  };
};

function calculateAverage(
  values: number[]
): number | null {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  return Math.round(
    total / values.length
  );
}

function clampScore(
  value: number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

export function calculateSourceConsensus(
  sources: RankedArticle[]
): SourceConsensus {
  const politicalDistribution = {
    left: 0,
    center: 0,
    right: 0,
    mixed: 0,
  };

  for (const source of sources) {
    switch (
      source.sourceRating.politicalLean
    ) {
      case "Left":
        politicalDistribution.left += 1;
        break;

      case "Center":
        politicalDistribution.center += 1;
        break;

      case "Right":
        politicalDistribution.right += 1;
        break;

      default:
        politicalDistribution.mixed += 1;
        break;
    }
  }

  const ratedSources = sources.filter(
    (source) =>
      source.sourceRating.isRated
  );

  const reliabilityValues =
    ratedSources.map(
      (source) =>
        source.sourceRating.reliability
    );

  const factualReportingValues =
    ratedSources.map(
      (source) =>
        source.sourceRating
          .factualReporting
    );

  const averageReliability =
    calculateAverage(
      reliabilityValues
    );

  const averageFactualReporting =
    calculateAverage(
      factualReportingValues
    );

  const sourceQualityScore =
    averageReliability !== null &&
    averageFactualReporting !== null
      ? clampScore(
          (averageReliability +
            averageFactualReporting) /
            2
        )
      : null;

  /*
   * Reporting agreement is intentionally
   * unavailable when fewer than two
   * independent sources are present.
   *
   * We do NOT infer cross-source agreement
   * from source quality.
   */
  const reportingAgreement =
    sources.length >= 2
      ? null
      : null;

  return {
    sourceCount: sources.length,

    ratedSourceCount:
      ratedSources.length,

    averageReliability,

    averageFactualReporting,

    reportingAgreement,

    sourceQualityScore,

    sourceNames: sources.map(
      (source) =>
        source.article.source.name
    ),

    politicalDistribution,
  };
}