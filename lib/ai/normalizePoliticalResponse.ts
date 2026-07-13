export type NormalizedPoliticalResponse = {
  summary: string;
  whyThisMatters: string;
  whoIsAffected: string[];
  shortTermImpact: string;
  longTermImpact: string;
  unansweredQuestions: string[];
  biasScore: number;
  lean: "Left" | "Center" | "Right";
  biasReasoning: string;
  confidence: number;
  category: string;
  sourcesReviewed: number;
  keyFacts: string[];

  perspectives: {
    left: string;
    center: string;
    right: string;
  };

  commonGround: string[];
  consensusScore: number;

  factCheck: {
    verdict: string;
    explanation: string;
  };

  evidence: {
    primarySources: string[];
    conflictingReporting: string[];
    methodology: string;
    lastAnalyzedAt: string;
  };
};

type NormalizePoliticalResponseOptions = {
  sourceCount?: number;
  sourceNames?: string[];
  fallbackSummary?: string;
  fallbackConsensusScore?: number;
  fallbackConfidence?: number;
};

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeString(
  value: unknown,
  fallback: string
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalizedValue = value.trim();

  return normalizedValue || fallback;
}

function normalizeStringArray(
  value: unknown,
  maximumItems = 10
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter(
          (item): item is string =>
            typeof item === "string"
        )
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, maximumItems);
}

function normalizeScore(
  value: unknown,
  fallback: number
): number {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" &&
          value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return Math.max(0, Math.min(100, Math.round(fallback)));
  }

  return Math.max(
    0,
    Math.min(100, Math.round(numericValue))
  );
}

function normalizeCount(
  value: unknown,
  fallback: number
): number {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" &&
          value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return Math.max(0, Math.round(fallback));
  }

  return Math.max(0, Math.round(numericValue));
}

function normalizeLean(
  value: unknown
): "Left" | "Center" | "Right" {
  if (typeof value !== "string") {
    return "Center";
  }

  switch (value.trim().toLowerCase()) {
    case "left":
    case "left-leaning":
    case "lean left":
      return "Left";

    case "right":
    case "right-leaning":
    case "lean right":
      return "Right";

    default:
      return "Center";
  }
}

function normalizeIsoDate(
  value: unknown
): string {
  if (typeof value === "string") {
    const timestamp = Date.parse(value);

    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toISOString();
    }
  }

  return new Date().toISOString();
}

export function normalizePoliticalResponse(
  response: unknown,
  options: NormalizePoliticalResponseOptions = {}
): NormalizedPoliticalResponse {
  const data = isRecord(response) ? response : {};

  const perspectives = isRecord(data.perspectives)
    ? data.perspectives
    : {};

  const factCheck = isRecord(data.factCheck)
    ? data.factCheck
    : {};

  const evidence = isRecord(data.evidence)
    ? data.evidence
    : {};

  const fallbackSourceNames =
    normalizeStringArray(options.sourceNames, 10);

  const normalizedPrimarySources =
    normalizeStringArray(
      evidence.primarySources,
      10
    );

  const sourceCountFallback =
    options.sourceCount ??
    fallbackSourceNames.length ??
    1;

  return {
    summary: normalizeString(
      data.summary,
      options.fallbackSummary ??
        "PoliticalPulse could not generate an executive summary from the available reporting."
    ),

    whyThisMatters: normalizeString(
      data.whyThisMatters,
      "The broader significance of this story is not yet clear from the available reporting."
    ),

    whoIsAffected: normalizeStringArray(
      data.whoIsAffected,
      5
    ),

    shortTermImpact: normalizeString(
      data.shortTermImpact,
      "The short-term impact is not yet clear from the available reporting."
    ),

    longTermImpact: normalizeString(
      data.longTermImpact,
      "The long-term impact is not yet clear from the available reporting."
    ),

    unansweredQuestions: normalizeStringArray(
      data.unansweredQuestions,
      5
    ),

    biasScore: normalizeScore(
      data.biasScore,
      50
    ),

    lean: normalizeLean(data.lean),

    biasReasoning: normalizeString(
      data.biasReasoning,
      "The available reporting does not provide enough information for a detailed framing assessment."
    ),

    confidence: normalizeScore(
      data.confidence,
      options.fallbackConfidence ?? 50
    ),

    category: normalizeString(
      data.category,
      "Politics"
    ),

    sourcesReviewed: normalizeCount(
      data.sourcesReviewed,
      sourceCountFallback
    ),

    keyFacts: normalizeStringArray(
      data.keyFacts,
      5
    ),

    perspectives: {
      left: normalizeString(
        perspectives.left,
        "A supported left-leaning interpretation was not identifiable from the available reporting."
      ),

      center: normalizeString(
        perspectives.center,
        "A supported centrist interpretation was not identifiable from the available reporting."
      ),

      right: normalizeString(
        perspectives.right,
        "A supported right-leaning interpretation was not identifiable from the available reporting."
      ),
    },

    commonGround: normalizeStringArray(
      data.commonGround,
      4
    ),

    consensusScore: normalizeScore(
      data.consensusScore,
      options.fallbackConsensusScore ?? 50
    ),

    factCheck: {
      verdict: normalizeString(
        factCheck.verdict,
        "Insufficient evidence"
      ),

      explanation: normalizeString(
        factCheck.explanation,
        "The supplied reporting does not provide enough evidence for a stronger assessment."
      ),
    },

    evidence: {
      primarySources:
        normalizedPrimarySources.length > 0
          ? normalizedPrimarySources
          : fallbackSourceNames,

      conflictingReporting: normalizeStringArray(
        evidence.conflictingReporting,
        6
      ),

      methodology: normalizeString(
        evidence.methodology,
        "PoliticalPulse compared the supplied reporting, evaluated source metadata, identified areas of agreement and uncertainty, and generated a neutral intelligence assessment."
      ),

      lastAnalyzedAt: normalizeIsoDate(
        evidence.lastAnalyzedAt
      ),
    },
  };
}