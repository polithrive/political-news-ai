import type { Article } from "../types/article";
import type { AnalysisResult } from "../types/analysis";
import { normalizeAnalysis } from "@/lib/ai/normalize";

export async function analyzeArticle(
  article: Article
): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: article.title,
      description: article.description,
      source: article.source,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze article.");
  }

  const data = await response.json();

  return normalizeAnalysis(data);
}