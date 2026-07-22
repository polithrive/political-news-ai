import type { Article } from "../types/article";
import type { IntelligencePreview } from "../types/intelligencePreview";

const ANALYSIS_REQUEST_TIMEOUT_MS = 15_000;

type PreviewApiResponse = Partial<IntelligencePreview>;

function clampScore(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value))
  );
}

function normalizeSourcesReviewed(
  value: unknown
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(0, Math.round(value));
}

function normalizeString(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : fallback;
}

function normalizeStringArray(
  value: unknown,
  maximumItems: number
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string" &&
        Boolean(item.trim())
    )
    .map((item) => item.trim())
    .slice(0, maximumItems);
}

function normalizeLean(
  value: unknown
): "Left" | "Center" | "Right" {
  if (
    value === "Left" ||
    value === "Right"
  ) {
    return value;
  }

  return "Center";
}

function normalizeFactCheck(
  value: unknown
): IntelligencePreview["factCheck"] {
  if (typeof value === "string") {
    return value.trim() || "Unavailable";
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const candidate = value as Record<
      string,
      unknown
    >;

    return {
      verdict: normalizeString(
        candidate.verdict,
        "Unavailable"
      ),

      explanation: normalizeString(
        candidate.explanation,
        "The supplied information does not support independent verification."
      ),
    };
  }

  return {
    verdict: "Unavailable",

    explanation:
      "The supplied information does not support independent verification.",
  };
}

function normalizePreview(
  value: unknown,
  article: Article
): IntelligencePreview {
  const candidate =
    value !== null &&
    typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    summary: normalizeString(
      candidate.summary,
      article.description?.trim() ||
        "PoliticalPulse could not generate an AI preview for this story."
    ),

    biasScore: clampScore(
      candidate.biasScore
    ),

    lean: normalizeLean(candidate.lean),

    biasReasoning: normalizeString(
      candidate.biasReasoning,
      "Political framing could not be determined from the available information."
    ),

    keyFacts: normalizeStringArray(
      candidate.keyFacts,
      2
    ),

    factCheck: normalizeFactCheck(
      candidate.factCheck
    ),

    confidence: clampScore(
      candidate.confidence
    ),

    trustScore: clampScore(
      candidate.trustScore
    ),

    consensusScore: clampScore(
      candidate.consensusScore
    ),

    sourcesReviewed:
      normalizeSourcesReviewed(
        candidate.sourcesReviewed
      ),
  };
}

function createPreviewFallback(
  article: Article
): IntelligencePreview {
  return {
    summary:
      article.description?.trim() ||
      "PoliticalPulse could not generate an AI preview for this story.",

    biasScore: 50,

    lean: "Center",

    biasReasoning:
      "The AI preview was unavailable, so political framing could not be assessed.",

    keyFacts: [],

    factCheck: {
      verdict: "Unavailable",

      explanation:
        "The preview request did not complete within the available time.",
    },

    confidence: 0,

    trustScore: 0,

    consensusScore: 0,

    sourcesReviewed: 0,
  };
}

export async function analyzeArticle(
  article: Article
): Promise<IntelligencePreview> {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, ANALYSIS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "/api/analyze-preview",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        cache: "no-store",

        signal: controller.signal,

        body: JSON.stringify({
          title: article.title,
          description: article.description,
          source: article.source,
        }),
      }
    );

    const data =
      (await response.json()) as PreviewApiResponse;

    if (!response.ok) {
      console.warn(
        "PoliticalPulse AI preview request failed:",
        data
      );

      return createPreviewFallback(article);
    }

    return normalizePreview(data, article);
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.warn(
        "PoliticalPulse AI preview timed out."
      );

      return createPreviewFallback(article);
    }

    console.error(
      "PoliticalPulse AI preview encountered an unexpected error:",
      error
    );

    return createPreviewFallback(article);
  } finally {
    window.clearTimeout(timeoutId);
  }
}