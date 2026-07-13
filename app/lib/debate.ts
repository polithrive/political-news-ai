import type {
  PoliticalPerspectiveAnalysis,
} from "@/app/types/report";
import type { Article } from "@/app/types/article";

type DebateApiResponse = {
  topic?: unknown;

  progressive?: {
    position?: unknown;
    strongestArguments?: unknown;
    primaryConcerns?: unknown;
  };

  centrist?: {
    position?: unknown;
    strongestArguments?: unknown;
    primaryConcerns?: unknown;
  };

  conservative?: {
    position?: unknown;
    strongestArguments?: unknown;
    primaryConcerns?: unknown;
  };

  areasOfAgreement?: unknown;
  mainDisagreements?: unknown;
  politicalPulseAnalysis?: unknown;
  debateTemperature?: unknown;
};

function toStringValue(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function toStringArray(value: unknown): string[] {
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
  );
}

function toClampedScore(
  value: unknown,
  fallback: number
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value))
  );
}

function createFallbackDebate(
  article: Article
): PoliticalPerspectiveAnalysis {
  return {
    topic:
      article.title ||
      "The central political debate",

    progressive: {
      position:
        "A dedicated progressive analysis is not currently available.",
      strongestArguments: [],
      primaryConcerns: [],
    },

    centrist: {
      position:
        "A dedicated centrist analysis is not currently available.",
      strongestArguments: [],
      primaryConcerns: [],
    },

    conservative: {
      position:
        "A dedicated conservative analysis is not currently available.",
      strongestArguments: [],
      primaryConcerns: [],
    },

    areasOfAgreement: [],

    mainDisagreements: [],

    politicalPulseAnalysis:
      "PoliticalPulse could not complete the dedicated debate analysis.",

    debateTemperature: 0,
  };
}

export async function generateDebateAnalysis(
  article: Article
): Promise<PoliticalPerspectiveAnalysis> {
  const response = await fetch(
    "/api/analyze/debate",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(article),
    }
  );

  if (!response.ok) {
    return createFallbackDebate(article);
  }

  const analysis =
    (await response.json()) as DebateApiResponse;

  return {
    topic: toStringValue(
      analysis.topic,
      article.title ||
        "The central political debate"
    ),

    progressive: {
      position: toStringValue(
        analysis.progressive?.position,
        "A dedicated progressive analysis is not currently available."
      ),

      strongestArguments: toStringArray(
        analysis.progressive
          ?.strongestArguments
      ),

      primaryConcerns: toStringArray(
        analysis.progressive?.primaryConcerns
      ),
    },

    centrist: {
      position: toStringValue(
        analysis.centrist?.position,
        "A dedicated centrist analysis is not currently available."
      ),

      strongestArguments: toStringArray(
        analysis.centrist?.strongestArguments
      ),

      primaryConcerns: toStringArray(
        analysis.centrist?.primaryConcerns
      ),
    },

    conservative: {
      position: toStringValue(
        analysis.conservative?.position,
        "A dedicated conservative analysis is not currently available."
      ),

      strongestArguments: toStringArray(
        analysis.conservative
          ?.strongestArguments
      ),

      primaryConcerns: toStringArray(
        analysis.conservative
          ?.primaryConcerns
      ),
    },

    areasOfAgreement: toStringArray(
      analysis.areasOfAgreement
    ),

    mainDisagreements: toStringArray(
      analysis.mainDisagreements
    ),

    politicalPulseAnalysis: toStringValue(
      analysis.politicalPulseAnalysis,
      "PoliticalPulse could not complete the dedicated debate synthesis."
    ),

    debateTemperature: toClampedScore(
      analysis.debateTemperature,
      50
    ),
  };
}