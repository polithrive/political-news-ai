import type { Article } from "../types/article";
import type { IntelligenceReport } from "../types/report";

export function getMockIntelligenceReport(): IntelligenceReport {
  return {
    article: {
      title: "Loading report...",
      description: "Generating intelligence report...",
      url: "",
      urlToImage: "",
      publishedAt: new Date().toISOString(),
      source: {
        name: "PoliticalPulse",
      },
    },
    overview: {
      biasScore: 50,
      confidence: 0,
      category: "Analyzing",
      sourcesReviewed: 1,
    },
    executiveSummary: "Generating intelligence report...",
    keyFacts: [],
    factCheck: {
      verdict: "Pending",
      explanation: "Fact checking is being generated.",
    },
    perspectives: {
      left: "Generating left perspective...",
      center: "Generating center perspective...",
      right: "Generating right perspective...",
    },
  };
}

export async function generateIntelligenceReport(
  article: Article
): Promise<IntelligenceReport> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    throw new Error("Failed to generate intelligence report");
  }

  const analysis = await response.json();

  return {
    article,
    overview: {
      biasScore: analysis.biasScore ?? 50,
      confidence: analysis.confidence ?? 75,
      category: analysis.category ?? "Political",
      sourcesReviewed: 1,
    },
    executiveSummary:
      analysis.summary ?? article.description ?? "No summary available.",
    keyFacts: analysis.keyFacts ?? [],
    factCheck: {
      verdict: analysis.factCheck?.verdict ?? "Pending",
      explanation:
        analysis.factCheck?.explanation ??
        "Fact checking details are not available yet.",
    },
    perspectives: {
      left: analysis.perspectives?.left ?? "Left perspective not available.",
      center: analysis.perspectives?.center ?? "Center perspective not available.",
      right: analysis.perspectives?.right ?? "Right perspective not available.",
    },
  };
}