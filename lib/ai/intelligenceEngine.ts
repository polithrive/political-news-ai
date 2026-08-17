import type { Article } from "@/app/types/article";
import type {
  DebatePerspective,
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

import {
  calculateSourceConsensus,
} from "@/lib/services/sourceConsensus";

import {
  getSourceRating,
} from "@/lib/services/sourceRanking";

import {
  calculateTrustScore,
} from "@/lib/services/trustScore";

function createFallbackSource(
  article: Article
): RankedArticle {
  return {
    article,

    sourceRating: getSourceRating(
      article.source?.name ??
        "Unknown source"
    ),

    isPrimary: true,
  };
}

function createDebatePerspective(
  position: string,
  fallback: string
): DebatePerspective {
  return {
    position:
      position.trim() || fallback,

    strongestArguments: [],

    primaryConcerns: [],
  };
}

function createFallbackPerspectiveAnalysis({
  article,
  left,
  center,
  right,
  commonGround,
}: {
  article: Article;
  left: string;
  center: string;
  right: string;
  commonGround: string[];
}): PoliticalPerspectiveAnalysis {
  return {
    topic:
      article.title ||
      "The central political debate",

    progressive:
      createDebatePerspective(
        left,
        "A progressive perspective is not available from the current analysis."
      ),

    centrist:
      createDebatePerspective(
        center,
        "A centrist perspective is not available from the current analysis."
      ),

    conservative:
      createDebatePerspective(
        right,
        "A conservative perspective is not available from the current analysis."
      ),

    areasOfAgreement:
      commonGround.length > 0
        ? commonGround
        : [
            "The current analysis did not identify clear areas of agreement.",
          ],

    mainDisagreements: [],

    politicalPulseAnalysis:
      "PoliticalPulse identified the primary viewpoints, but a dedicated debate synthesis was not available.",

    debateTemperature: 50,
  };
}

function normalizeStringArray(
  value: unknown
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
        .map((item) =>
          item.trim()
        )
        .filter(Boolean)
    )
  );
}

function normalizePerspectiveAnalysis(
  article: Article,
  perspectives: PoliticalPerspectives
): PoliticalPerspectiveAnalysis {
  const consensus =
    perspectives.consensus?.trim() ||
    "";

  const disagreements =
    normalizeStringArray(
      perspectives.disagreements
    );

  return {
    topic:
      article.title ||
      "The central political debate",

    progressive:
      createDebatePerspective(
        perspectives.progressive ??
          "",
        "A progressive perspective is not available."
      ),

    centrist:
      createDebatePerspective(
        perspectives.centrist ??
          "",
        "A centrist perspective is not available."
      ),

    conservative:
      createDebatePerspective(
        perspectives.conservative ??
          "",
        "A conservative perspective is not available."
      ),

    areasOfAgreement: consensus
      ? [consensus]
      : [
          "The analysis did not identify clear areas of agreement.",
        ],

    mainDisagreements:
      disagreements,

    politicalPulseAnalysis:
      consensus ||
      "PoliticalPulse identified the primary viewpoints, but a dedicated neutral synthesis was not available.",

    debateTemperature:
      disagreements.length >= 3
        ? 70
        : disagreements.length === 2
          ? 60
          : disagreements.length === 1
            ? 45
            : 25,
  };
}

function clampScore(
  value: number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

function applyConfidenceCap(
  confidence: number,
  sourceCount: number
): number {
  const normalizedConfidence =
    clampScore(confidence);

  if (sourceCount <= 1) {
    return Math.min(
      normalizedConfidence,
      65
    );
  }

  if (sourceCount === 2) {
    return Math.min(
      normalizedConfidence,
      80
    );
  }

  return normalizedConfidence;
}

export async function generatePoliticalIntelligence(
  article: Article
): Promise<IntelligenceReport> {
  let rankedSources: RankedArticle[];

  try {
    rankedSources =
      await gatherStorySources(
        article
      );
  } catch (error) {
    console.error(
      "PoliticalPulse failed to gather story sources:",
      error
    );

    rankedSources = [
      createFallbackSource(article),
    ];
  }

  if (
    rankedSources.length === 0
  ) {
    rankedSources = [
      createFallbackSource(article),
    ];
  }

  const sourceConsensus =
    calculateSourceConsensus(
      rankedSources
    );

  const prompt =
    buildPoliticalPrompt({
      primaryArticle: article,
      sources: rankedSources,
      sourceConsensus,
    });

  /*
   * Generate the primary intelligence
   * analysis and expanded political
   * perspectives concurrently.
   */
  const [
    analysisResult,
    perspectiveResult,
  ] =
    await Promise.allSettled([
      runPoliticalAnalysis(prompt),

      generatePoliticalPerspectives(
        article
      ),
    ]);

  if (
    analysisResult.status ===
    "rejected"
  ) {
    console.error(
      "PoliticalPulse primary intelligence analysis failed:",
      analysisResult.reason
    );

    throw analysisResult.reason;
  }

  const sourceNames =
    Array.from(
      new Set(
        rankedSources
          .map((source) =>
            source.article.source?.name?.trim()
          )
          .filter(
            (
              sourceName
            ): sourceName is string =>
              Boolean(sourceName)
          )
      )
    );

  /*
   * Source quality is unavailable when
   * PoliticalPulse has not formally rated
   * any of the gathered sources.
   *
   * A neutral fallback of 50 is used only
   * for normalization. It is not treated as
   * a verified source rating.
   */
  const fallbackConfidence =
    sourceConsensus.averageReliability ??
    50;

  /*
   * Political consensus is separate from
   * reporting agreement and source quality.
   * Therefore it receives no source-derived
   * fallback score.
   */
  const analysis =
    normalizePoliticalResponse(
      analysisResult.value,
      {
        sourceCount:
          sourceConsensus.sourceCount,

        sourceNames,

        fallbackConsensusScore: 0,

        fallbackConfidence,

        fallbackSummary:
          article.description ||
          "No executive summary is available.",
      }
    );

  const confidence =
    applyConfidenceCap(
      analysis.confidence,
      sourceConsensus.sourceCount
    );

  let perspectiveAnalysis:
    PoliticalPerspectiveAnalysis;

  if (
    perspectiveResult.status ===
    "fulfilled"
  ) {
    perspectiveAnalysis =
      normalizePerspectiveAnalysis(
        article,
        perspectiveResult.value
      );
  } else {
    console.error(
      "PoliticalPulse expanded perspective analysis failed:",
      perspectiveResult.reason
    );

    perspectiveAnalysis =
      createFallbackPerspectiveAnalysis({
        article,

        left:
          analysis.perspectives.left,

        center:
          analysis.perspectives.center,

        right:
          analysis.perspectives.right,

        commonGround:
          analysis.commonGround,
      });
  }

  const trustScore =
    calculateTrustScore({
      confidence,

      sourceCount:
        sourceConsensus.sourceCount,

      ratedSourceCount:
        sourceConsensus.ratedSourceCount,

      averageReliability:
        sourceConsensus
          .averageReliability,

      averageFactualReporting:
        sourceConsensus
          .averageFactualReporting,

      reportingAgreement:
        sourceConsensus
          .reportingAgreement,

      politicalDistribution:
        sourceConsensus
          .politicalDistribution,
    });

  /*
   * Conflicting reporting is meaningful only
   * when at least two independent sources were
   * actually analyzed.
   */
  const conflictingReporting =
    sourceConsensus.sourceCount >= 2
      ? analysis.evidence
          .conflictingReporting
      : [];

  const evidenceMethodology =
    sourceConsensus.sourceCount <= 1
      ? "PoliticalPulse analyzed the available source, evaluated available source metadata, generated parallel AI assessments, and limited report-level trust because independent corroboration was not available."
      : analysis.evidence
          .methodology;

  return {
    article,

    overview: {
      biasScore:
        analysis.biasScore,

      confidence,

      category:
        analysis.category,

      /*
       * Actual gathered sources are
       * authoritative. Do not rely on an
       * AI-generated source count.
       */
      sourcesReviewed:
        sourceConsensus.sourceCount,
    },

    trustScore,

    executiveSummary:
      analysis.summary,

    whyThisMatters:
      analysis.whyThisMatters,

    whoIsAffected:
      analysis.whoIsAffected,

    shortTermImpact:
      analysis.shortTermImpact,

    longTermImpact:
      analysis.longTermImpact,

    unansweredQuestions:
      analysis.unansweredQuestions,

    keyFacts:
      analysis.keyFacts,

    commonGround:
      analysis.commonGround,

    /*
     * This remains political/common-ground
     * consensus. It is not reporting
     * agreement.
     */
    consensusScore:
      analysis.consensusScore,

    factCheck:
      analysis.factCheck,

    perspectives:
      analysis.perspectives,

    perspectiveAnalysis,

    evidence: {
      /*
       * Prefer the sources PoliticalPulse
       * actually gathered rather than source
       * names generated by the model.
       */
      primarySources:
        sourceNames.length > 0
          ? sourceNames
          : analysis.evidence
              .primarySources,

      conflictingReporting,

      methodology:
        evidenceMethodology,

      lastAnalyzedAt:
        analysis.evidence
          .lastAnalyzedAt,
    },
  };
}