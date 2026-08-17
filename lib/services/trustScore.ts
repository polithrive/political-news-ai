import type {
  EvidenceStrength,
  PoliticalDiversity,
  TrustScore,
} from "@/app/types/trust";

type TrustScoreInput = {
  confidence: number;

  sourceCount: number;

  ratedSourceCount: number;

  averageReliability: number | null;

  averageFactualReporting: number | null;

  reportingAgreement: number | null;

  politicalDistribution: {
    left: number;
    center: number;
    right: number;
    mixed: number;
  };
};

function clamp(
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

function calculatePoliticalDiversity(
  distribution: TrustScoreInput["politicalDistribution"],
  sourceCount: number
): PoliticalDiversity {
  if (sourceCount <= 1) {
    return "Low";
  }

  const representedSides = [
    distribution.left,
    distribution.center,
    distribution.right,
    distribution.mixed,
  ].filter(
    (count) => count > 0
  ).length;

  if (
    sourceCount >= 4 &&
    representedSides >= 3
  ) {
    return "High";
  }

  if (representedSides >= 2) {
    return "Medium";
  }

  return "Low";
}

function calculateEvidenceStrength(
  sourceCount: number,
  ratedSourceCount: number,
  sourceQualityScore: number | null,
  reportingAgreement: number | null
): EvidenceStrength {
  if (sourceCount <= 1) {
    return "Low";
  }

  if (
    sourceCount >= 3 &&
    ratedSourceCount >= 2 &&
    sourceQualityScore !== null &&
    sourceQualityScore >= 80 &&
    reportingAgreement !== null &&
    reportingAgreement >= 70
  ) {
    return "High";
  }

  return "Medium";
}

function calculateSourceQualityScore(
  averageReliability: number | null,
  averageFactualReporting: number | null
): number | null {
  if (
    averageReliability === null ||
    averageFactualReporting === null
  ) {
    return null;
  }

  return clamp(
    (averageReliability +
      averageFactualReporting) /
      2
  );
}

function calculateCorroborationScore(
  sourceCount: number
): number {
  if (sourceCount <= 1) {
    return 20;
  }

  if (sourceCount === 2) {
    return 55;
  }

  if (sourceCount === 3) {
    return 75;
  }

  if (sourceCount === 4) {
    return 88;
  }

  return 100;
}

function applySourceCountCap(
  score: number,
  sourceCount: number
): number {
  if (sourceCount <= 1) {
    return Math.min(
      score,
      60
    );
  }

  if (sourceCount === 2) {
    return Math.min(
      score,
      75
    );
  }

  return score;
}

export function calculateTrustScore(
  input: TrustScoreInput
): TrustScore {
  const sourceQualityScore =
    calculateSourceQualityScore(
      input.averageReliability,
      input.averageFactualReporting
    );

  const corroborationScore =
    calculateCorroborationScore(
      input.sourceCount
    );

  const reportingAgreementScore =
    input.reportingAgreement;

  /*
   * Start with AI confidence, but never allow
   * AI confidence alone to dominate the score.
   */
  let weightedScore =
    clamp(input.confidence) * 0.35 +
    corroborationScore * 0.35;

  /*
   * Only use source-quality ratings when
   * PoliticalPulse actually has rated sources.
   */
  if (
    sourceQualityScore !== null &&
    input.ratedSourceCount > 0
  ) {
    weightedScore +=
      sourceQualityScore * 0.20;
  } else {
    /*
     * Unknown source quality should not be
     * treated as either positive or negative.
     */
    weightedScore += 50 * 0.20;
  }

  /*
   * Reporting agreement contributes only when
   * genuine cross-source agreement is available.
   */
  if (
    reportingAgreementScore !== null
  ) {
    weightedScore +=
      reportingAgreementScore * 0.10;
  } else {
    weightedScore += 50 * 0.10;
  }

  const cappedOverall =
    applySourceCountCap(
      weightedScore,
      input.sourceCount
    );

  const overall =
    clamp(cappedOverall);

  const evidenceStrength =
    calculateEvidenceStrength(
      input.sourceCount,
      input.ratedSourceCount,
      sourceQualityScore,
      input.reportingAgreement
    );

  const politicalDiversity =
    calculatePoliticalDiversity(
      input.politicalDistribution,
      input.sourceCount
    );

  return {
    overall,

    evidenceStrength,

    reportingAgreement:
      input.reportingAgreement,

    sourceCount:
      input.sourceCount,

    ratedSourceCount:
      input.ratedSourceCount,

    politicalDiversity,
  };
}