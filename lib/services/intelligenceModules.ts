import type { Article } from "@/app/types/article";

import type { PoliticalAnalysis } from "@/lib/ai/generatePoliticalAnalysis";
import type { SummaryAnalysis } from "@/lib/ai/generateSummary";

async function postArticle<T>(
  endpoint: string,
  article: Article
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    cache: "no-store",

    body: JSON.stringify({
      title: article.title,
      description: article.description,
      source: article.source,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `PoliticalPulse request failed: ${endpoint}`
    );
  }

  return (await response.json()) as T;
}

export async function generateSummaryModule(
  article: Article
): Promise<SummaryAnalysis> {
  return postArticle<SummaryAnalysis>(
    "/api/analyze-summary",
    article
  );
}

export async function generatePoliticalModule(
  article: Article
): Promise<PoliticalAnalysis> {
  return postArticle<PoliticalAnalysis>(
    "/api/analyze-political",
    article
  );
}