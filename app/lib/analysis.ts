import type { Article } from "../types/article";
import type { AnalysisResult } from "../types/analysis";

import { normalizeAnalysis } from "@/lib/ai/normalize";

const ANALYSIS_REQUEST_TIMEOUT_MS = 15_000;

type AnalysisInput =
  Parameters<typeof normalizeAnalysis>[0];

function createPreviewFallback(
  article: Article
): AnalysisResult {
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
  };
}

export async function analyzeArticle(
  article: Article
): Promise<AnalysisResult> {
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
      (await response.json()) as AnalysisInput;

    if (!response.ok) {
      console.warn(
        "PoliticalPulse AI preview request failed:",
        data
      );

      return createPreviewFallback(article);
    }

    return normalizeAnalysis(data);
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