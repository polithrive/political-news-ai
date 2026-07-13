import type { RankedArticle } from "./multiSource";

export type SourceConsensus = {
  sourceCount: number;
  averageReliability: number;
  averageFactualReporting: number;
  consensusScore: number;
  sourceNames: string[];
  politicalDistribution: {
    left: number;
    center: number;
    right: number;
    mixed: number;
  };
};

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  return Math.round(total / values.length);
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
    switch (source.sourceRating.politicalLean) {
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

  const averageReliability = calculateAverage(
    sources.map(
      (source) => source.sourceRating.reliability
    )
  );

  const averageFactualReporting = calculateAverage(
    sources.map(
      (source) =>
        source.sourceRating.factualReporting
    )
  );

  const sourceCountScore = Math.min(
    sources.length * 12,
    60
  );

  const qualityScore = Math.round(
    (averageReliability +
      averageFactualReporting) /
      2
  );

  const consensusScore = Math.min(
    100,
    Math.round(
      sourceCountScore * 0.4 +
        qualityScore * 0.6
    )
  );

  return {
    sourceCount: sources.length,
    averageReliability,
    averageFactualReporting,
    consensusScore,
    sourceNames: sources.map(
      (source) => source.article.source.name
    ),
    politicalDistribution,
  };
}