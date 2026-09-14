export type CoverageFraming = {
  score: number;
  lean: string;
  reasoning?: string;
};

export const COVERAGE_METHODOLOGY_TITLE = "How coverage framing is scored";

export const COVERAGE_METHODOLOGY_SHORT =
  "This meter measures how the article is framed, not whether the event itself is left or right.";

export const COVERAGE_METHODOLOGY_POINTS = [
  "0 is strongly left-framed. 50 is balanced or neutral framing. 100 is strongly right-framed.",
  "The score comes from The Angle Report analysis of the supplied article and related reporting: language, emphasis, and what evidence is highlighted or omitted.",
  "It does not score publisher reputation, the politics of the underlying event, or public opinion.",
  "A score appears only after analysis is available. We do not guess from headlines alone.",
];

export function clampCoverageScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function leanFromCoverageScore(score: number): "Left" | "Center" | "Right" {
  if (score <= 40) {
    return "Left";
  }

  if (score >= 60) {
    return "Right";
  }

  return "Center";
}

export function coverageFromPreview(preview?: {
  biasScore?: number;
  lean?: string;
  biasReasoning?: string;
} | null): CoverageFraming | null {
  const score = clampCoverageScore(preview?.biasScore);

  if (score === null) {
    return null;
  }

  const lean =
    preview?.lean?.trim() || leanFromCoverageScore(score);

  return {
    score,
    lean,
    reasoning: preview?.biasReasoning?.trim() || undefined,
  };
}

export function shareCoverageText(input: {
  title: string;
  lean: string;
  score: number;
  url: string;
}): string {
  return [
    `${input.title}`,
    `Coverage framing: ${input.lean} (${input.score}/100)`,
    COVERAGE_METHODOLOGY_SHORT,
    input.url,
  ].join("\n\n");
}
