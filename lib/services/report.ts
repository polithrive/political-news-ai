import type { Article } from "@/app/types/article";
import type { IntelligenceReport } from "@/app/types/report";

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

    whyThisMatters:
      "PoliticalPulse is determining why this story matters.",

    whoIsAffected: [],

    shortTermImpact:
      "PoliticalPulse is analyzing the likely short-term effects.",

    longTermImpact:
      "PoliticalPulse is analyzing the possible long-term effects.",

    unansweredQuestions: [],

    keyFacts: [],

    commonGround: [
      "All perspectives agree this event occurred.",
      "The issue may affect public policy.",
      "Additional developments may follow.",
    ],

    consensusScore: 82,

    factCheck: {
      verdict: "Pending",
      explanation: "Fact checking is being generated.",
    },

    perspectives: {
      left: "Generating left perspective...",
      center: "Generating center perspective...",
      right: "Generating right perspective...",
    },

    evidence: {
      primarySources: ["PoliticalPulse AI"],
      conflictingReporting: [],
      methodology:
        "PoliticalPulse AI is gathering information from multiple perspectives.",
      lastAnalyzedAt: new Date().toISOString(),
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

  const sourceName =
    article.source?.name?.trim() || "Article source unavailable";

  return {
    article,

    overview: {
      biasScore: analysis.biasScore ?? 50,
      confidence: analysis.confidence ?? 75,
      category: analysis.category ?? "Political",
      sourcesReviewed: analysis.sourcesReviewed ?? 1,
    },

    executiveSummary:
      analysis.summary ??
      article.description ??
      "No executive summary is available.",

    whyThisMatters:
      analysis.whyThisMatters ??
      "PoliticalPulse could not determine why this story matters from the available information.",

    whoIsAffected: Array.isArray(analysis.whoIsAffected)
      ? analysis.whoIsAffected
      : [],

    shortTermImpact:
      analysis.shortTermImpact ??
      "The short-term impact is not yet clear from the available information.",

    longTermImpact:
      analysis.longTermImpact ??
      "The long-term impact is not yet clear from the available information.",

    unansweredQuestions: Array.isArray(analysis.unansweredQuestions)
      ? analysis.unansweredQuestions
      : [],

    keyFacts: Array.isArray(analysis.keyFacts)
      ? analysis.keyFacts
      : [],

    commonGround: Array.isArray(analysis.commonGround)
      ? analysis.commonGround
      : [
          "The reported event or issue is relevant to the public discussion.",
          "Additional information may change how the story is understood.",
        ],

    consensusScore: analysis.consensusScore ?? 50,

    factCheck: {
      verdict: analysis.factCheck?.verdict ?? "Pending",
      explanation:
        analysis.factCheck?.explanation ??
        "Fact-checking details are not currently available.",
    },

    perspectives: {
      left:
        analysis.perspectives?.left ??
        "Left-leaning perspective analysis is not available.",
      center:
        analysis.perspectives?.center ??
        "Centrist perspective analysis is not available.",
      right:
        analysis.perspectives?.right ??
        "Right-leaning perspective analysis is not available.",
    },

    evidence: {
      primarySources:
        Array.isArray(analysis.evidence?.primarySources) &&
        analysis.evidence.primarySources.length > 0
          ? analysis.evidence.primarySources
          : [sourceName],

      conflictingReporting: Array.isArray(
        analysis.evidence?.conflictingReporting
      )
        ? analysis.evidence.conflictingReporting
        : [],

      methodology:
        analysis.evidence?.methodology ??
        "PoliticalPulse AI analyzes the supplied article, separates facts from interpretation, compares likely political perspectives, evaluates uncertainty, and produces a neutral intelligence assessment.",

      lastAnalyzedAt:
        analysis.evidence?.lastAnalyzedAt ??
        new Date().toISOString(),
    },
  };
}