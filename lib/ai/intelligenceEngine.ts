import type { Article } from "@/app/types/article";
import type {
  IntelligenceReport,
  PoliticalPerspectiveAnalysis,
} from "@/app/types/report";

import { buildPoliticalPrompt } from "./buildPoliticalPrompt";
import { normalizePoliticalResponse } from "./normalizePoliticalResponse";
import { runPoliticalAnalysis } from "./openaiAnalysis";

import {
  gatherStorySources,
  type RankedArticle,
} from "@/lib/services/multiSource";
import {
  generatePoliticalPerspectives,
  type PoliticalPerspectives,
} from "@/lib/services/politicalPerspectives";
import { calculateSourceConsensus } from "@/lib/services/sourceConsensus";
import { getSourceRating } from "@/lib/services/sourceRanking";
import { calculateTrustScore } from "@/lib/services/trustScore";

function createFallbackSource(
  article: Article
): RankedArticle {
  return {
    article,

    sourceRating: getSourceRating(
      article.source?.name ?? "Unknown source"
    ),

    isPrimary: true,
  };
}

function createFallbackPerspectiveAnalysis({
  left,
  center,
  right,
  commonGround,
}: {
  left: string;
  center: string;
  right: string;
  commonGround: string[];
}): PoliticalPerspectiveAnalysis {
  return {
    progressive:
      left ||
      "A progressive perspective is not available from the current analysis.",

    centrist:
      center ||
      "A centrist perspective is not available from the current analysis.",

    conservative:
      right ||
      "A conservative perspective is not available from the current analysis.",

    consensus:
      commonGround.length > 0
        ? commonGround.join(" ")
        : "The current analysis did not identify clear areas of consensus.",

    disagreements: [],
  };
}

function normalizePerspectiveAnalysis(
  perspectives: PoliticalPerspectives
): PoliticalPerspectiveAnalysis {
  return {
    progressive:
      perspectives.progressive?.trim() ||
      "A progressive perspective is not available.",

    centrist:
      perspectives.centrist?.trim() ||
      "A centrist perspective is not available.",

    conservative:
      perspectives.conservative?.trim() ||
      "A conservative perspective is not available.",

    consensus:
      perspectives.consensus?.trim() ||
      "The analysis did not identify clear areas of consensus.",

    disagreements: Array.isArray(
      perspectives.disagreements
    )
      ? perspectives.disagreements
          .filter(
            (item): item is string =>
              typeof item === "string" &&
              item.trim().length > 0
          )
          .map((item) => item.trim())
      : [],
  };
}

export async function generatePoliticalIntelligence(
  article: Article
): Promise<IntelligenceReport> {
  let rankedSources: RankedArticle[];

  try {
    rankedSources = await gatherStorySources(article);
  } catch (error) {
    console.error(
      "PoliticalPulse failed to gather story sources:",
      error
    );

    rankedSources = [createFallbackSource(article)];
  }

  if (rankedSources.length === 0) {
    rankedSources = [createFallbackSource(article)];
  }

  const sourceConsensus =
    calculateSourceConsensus(rankedSources);

  const prompt = buildPoliticalPrompt({
    primaryArticle: article,
    sources: rankedSources,
    sourceConsensus,
  });

  /*
   * Generate the primary intelligence analysis and the
   * expanded political perspectives concurrently.
   *
   * The primary report remains the required result.
   * Expanded perspectives may fall back to the report's
   * existing left, center, and right analysis if their
   * dedicated generation request fails.
   */
  const [analysisResult, perspectiveResult] =
    await Promise.allSettled([
      runPoliticalAnalysis(prompt),
      generatePoliticalPerspectives(article),
    ]);

  if (analysisResult.status === "rejected") {
    console.error(
      "PoliticalPulse primary intelligence analysis failed:",
      analysisResult.reason
    );

    throw analysisResult.reason;
  }

  const sourceNames = Array.from(
    new Set(
      rankedSources
        .map((source) =>
          source.article.source?.name?.trim()
        )
        .filter(
          (sourceName): sourceName is string =>
            Boolean(sourceName)
        )
    )
  );

  const analysis = normalizePoliticalResponse(
    analysisResult.value,
    {
      sourceCount: sourceConsensus.sourceCount,

      sourceNames,

      fallbackConsensusScore:
        sourceConsensus.consensusScore,

      fallbackConfidence:
        sourceConsensus.averageReliability,

      fallbackSummary:
        article.description ||
        "No executive summary is available.",
    }
  );

  let perspectiveAnalysis: PoliticalPerspectiveAnalysis;

  if (perspectiveResult.status === "fulfilled") {
    perspectiveAnalysis = normalizePerspectiveAnalysis(
      perspectiveResult.value
    );
  } else {
    console.error(
      "PoliticalPulse expanded perspective analysis failed:",
      perspectiveResult.reason
    );

    perspectiveAnalysis =
      createFallbackPerspectiveAnalysis({
        left: analysis.perspectives.left,
        center: analysis.perspectives.center,
        right: analysis.perspectives.right,
        commonGround: analysis.commonGround,
      });
  }

  const trustScore = calculateTrustScore({
    confidence: analysis.confidence,

    consensusScore: analysis.consensusScore,

    sourceCount: sourceConsensus.sourceCount,

    averageReliability:
      sourceConsensus.averageReliability,

    politicalDistribution:
      sourceConsensus.politicalDistribution,
  });

  return {
    article,

    overview: {
      biasScore: analysis.biasScore,
      confidence: analysis.confidence,
      category: analysis.category,
      sourcesReviewed: analysis.sourcesReviewed,
    },

    trustScore,

    executiveSummary: analysis.summary,

    whyThisMatters: analysis.whyThisMatters,

    whoIsAffected: analysis.whoIsAffected,

    shortTermImpact: analysis.shortTermImpact,

    longTermImpact: analysis.longTermImpact,

    unansweredQuestions:
      analysis.unansweredQuestions,

    keyFacts: analysis.keyFacts,

    commonGround: analysis.commonGround,

    consensusScore: analysis.consensusScore,

    factCheck: analysis.factCheck,

    perspectives: analysis.perspectives,

    perspectiveAnalysis,

    evidence: analysis.evidence,
  };
}