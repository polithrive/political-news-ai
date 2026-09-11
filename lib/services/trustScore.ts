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
    (
      averageReliability +
      averageFactualReporting
    ) /
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

function calculatePoliticalDiversityScore(
  politicalDiversity: PoliticalDiversity
): number {
  switch (politicalDiversity) {
    case "High":
      return 100;

    case "Medium":
      return 70;

    case "Low":
    default:
      return 40;
  }
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

  const politicalDiversity =
    calculatePoliticalDiversity(
      input.politicalDistribution,
      input.sourceCount
    );

  const politicalDiversityScore =
    calculatePoliticalDiversityScore(
      politicalDiversity
    );

  const confidenceScore =
    clamp(
      input.confidence
    );

  /*
   * The Angle Report Trust Score is evidence-led.
   *
   * AI confidence remains one signal, but the
   * score now gives more weight to actual source
   * corroboration, reporting alignment, source
   * quality, and source diversity.
   */
  let weightedScore =
    confidenceScore * 0.20 +
    corroborationScore * 0.30;

  /*
   * Source quality contributes only when
   * independently rated publisher information
   * is actually available.
   *
   * Missing ratings remain neutral.
   */
  if (
    sourceQualityScore !== null &&
    input.ratedSourceCount > 0
  ) {
    weightedScore +=
      sourceQualityScore * 0.20;
  } else {
    weightedScore +=
      50 * 0.20;
  }

  /*
   * Reporting agreement is based on the
   * evidence set's cross-source reporting
   * alignment.
   *
   * Missing agreement remains neutral rather
   * than being treated as evidence for or
   * against the story.
   */
  if (
    input.reportingAgreement !== null
  ) {
    weightedScore +=
      clamp(
        input.reportingAgreement
      ) * 0.20;
  } else {
    weightedScore +=
      50 * 0.20;
  }

  /*
   * Political diversity is a smaller supporting
   * signal. It rewards evidence sets that include
   * reporting from more than one ideological
   * classification without implying that balance
   * itself proves factual accuracy.
   */
  weightedScore +=
    politicalDiversityScore * 0.10;

  const cappedOverall =
    applySourceCountCap(
      weightedScore,
      input.sourceCount
    );

  const overall =
    clamp(
      cappedOverall
    );

  const evidenceStrength =
    calculateEvidenceStrength(
      input.sourceCount,
      input.ratedSourceCount,
      sourceQualityScore,
      input.reportingAgreement
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