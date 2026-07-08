import type { Article } from "../types/article";
import type { AnalysisResult } from "../types/analysis";

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
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze article.");
  }

  return response.json();
}