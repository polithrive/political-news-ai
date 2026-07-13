import type { TrustScore } from "@/app/types/trust";

type TrustScoreInput = {
  confidence: number;
  consensusScore: number;
  sourceCount: number;
  averageReliability: number;
  politicalDistribution: {
    left: number;
    center: number;
    right: number;
    mixed: number;
  };
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculatePoliticalDiversity(
  distribution: TrustScoreInput["politicalDistribution"]
): "Low" | "Medium" | "High" {
  const representedSides = [
    distribution.left,
    distribution.center,
    distribution.right,
    distribution.mixed,
  ].filter((count) => count > 0).length;

  if (representedSides >= 4) {
    return "High";
  }

  if (representedSides >= 2) {
    return "Medium";
  }

  return "Low";
}

function calculateEvidenceStrength(
  score: number
): "Low" | "Medium" | "High" {
  if (score >= 80) {
    return "High";
  }

  if (score >= 60) {
    return "Medium";
  }

  return "Low";
}

export function calculateTrustScore(
  input: TrustScoreInput
): TrustScore {
  const overall = clamp(
    input.confidence * 0.35 +
      input.consensusScore * 0.35 +
      input.averageReliability * 0.30
  );

  return {
    overall,

    evidenceStrength:
      calculateEvidenceStrength(overall),

    reportingAgreement: clamp(
      input.consensusScore
    ),

    sourceCount: input.sourceCount,

    politicalDiversity:
      calculatePoliticalDiversity(
        input.politicalDistribution
      ),
  };
}