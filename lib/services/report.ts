import type { Article } from "@/app/types/article";
import type {
  DebatePerspective,
  IntelligenceReport,
  PoliticalPerspectiveAnalysis,
} from "@/app/types/report";

import {
  gatherStorySources,
  type RankedArticle,
} from "./multiSource";
import {
  calculateSourceConsensus,
} from "./sourceConsensus";
import { getSourceRating } from "./sourceRanking";
import { calculateTrustScore } from "./trustScore";

type DebatePerspectiveResponse = {
  position?: unknown;
  strongestArguments?: unknown;
  primaryConcerns?: unknown;
};

type AnalysisResponse = {
  summary?: unknown;
  whyThisMatters?: unknown;
  whoIsAffected?: unknown;
  shortTermImpact?: unknown;
  longTermImpact?: unknown;
  unansweredQuestions?: unknown;
  biasScore?: unknown;
  confidence?: unknown;
  category?: unknown;
  sourcesReviewed?: unknown;
  keyFacts?: unknown;
  commonGround?: unknown;
  consensusScore?: unknown;

  factCheck?: {
    verdict?: unknown;
    explanation?: unknown;
  };

  perspectives?: {
    left?: unknown;
    center?: unknown;
    right?: unknown;
  };

  perspectiveAnalysis?: {
    topic?: unknown;

    progressive?: DebatePerspectiveResponse;

    centrist?: DebatePerspectiveResponse;

    conservative?: DebatePerspectiveResponse;

    areasOfAgreement?: unknown;
    mainDisagreements?: unknown;
    politicalPulseAnalysis?: unknown;
    debateTemperature?: unknown;
  };

  evidence?: {
    primarySources?: unknown;
    conflictingReporting?: unknown;
    methodology?: unknown;
    lastAnalyzedAt?: unknown;
  };
};

function toStringValue(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function toNumberValue(
  value: unknown,
  fallback: number
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function toClampedScore(
  value: unknown,
  fallback: number
): number {
  const numericValue = toNumberValue(
    value,
    fallback
  );

  return Math.max(
    0,
    Math.min(100, Math.round(numericValue))
  );
}

function toPositiveCount(
  value: unknown,
  fallback: number
): number {
  const numericValue = toNumberValue(
    value,
    fallback
  );

  return Math.max(
    0,
    Math.round(numericValue)
  );
}

function toStringArray(
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
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function createFallbackRankedSource(
  article: Article
): RankedArticle {
  return {
    article,

    sourceRating: getSourceRating(
      article.source?.name ??
        "Unknown Source"
    ),

    isPrimary: true,
  };
}

function createDebatePerspective(
  perspective:
    | DebatePerspectiveResponse
    | undefined,
  fallbackPosition: string
): DebatePerspective {
  return {
    position: toStringValue(
      perspective?.position,
      fallbackPosition
    ),

    strongestArguments: toStringArray(
      perspective?.strongestArguments
    ),

    primaryConcerns: toStringArray(
      perspective?.primaryConcerns
    ),
  };
}

function createPerspectiveAnalysis(
  analysis: AnalysisResponse,
  article: Article,
  commonGround: string[]
): PoliticalPerspectiveAnalysis {
  const dedicatedAnalysis =
    analysis.perspectiveAnalysis;

  const areasOfAgreement =
    toStringArray(
      dedicatedAnalysis?.areasOfAgreement
    );

  const mainDisagreements =
    toStringArray(
      dedicatedAnalysis?.mainDisagreements
    );

  return {
    topic: toStringValue(
      dedicatedAnalysis?.topic,
      article.title ||
        "The central political debate"
    ),

    progressive: createDebatePerspective(
      dedicatedAnalysis?.progressive,
      toStringValue(
        analysis.perspectives?.left,
        "A dedicated progressive analysis is not available."
      )
    ),

    centrist: createDebatePerspective(
      dedicatedAnalysis?.centrist,
      toStringValue(
        analysis.perspectives?.center,
        "A dedicated centrist analysis is not available."
      )
    ),

    conservative:
      createDebatePerspective(
        dedicatedAnalysis?.conservative,
        toStringValue(
          analysis.perspectives?.right,
          "A dedicated conservative analysis is not available."
        )
      ),

    areasOfAgreement:
      areasOfAgreement.length > 0
        ? areasOfAgreement
        : commonGround,

    mainDisagreements,

    politicalPulseAnalysis:
      toStringValue(
        dedicatedAnalysis
          ?.politicalPulseAnalysis,
        "PoliticalPulse identified the major perspectives and areas of possible agreement, but a dedicated synthesis was not available."
      ),

    debateTemperature: toClampedScore(
      dedicatedAnalysis?.debateTemperature,
      50
    ),
  };
}

async function gatherRankedSources(
  article: Article
): Promise<RankedArticle[]> {
  try {
    const rankedSources =
      await gatherStorySources(article);

    return rankedSources.length > 0
      ? rankedSources
      : [
          createFallbackRankedSource(
            article
          ),
        ];
  } catch (error) {
    console.error(
      "Failed to gather ranked sources for report:",
      error
    );

    return [
      createFallbackRankedSource(article),
    ];
  }
}

async function requestReportAnalysis(
  article: Article
): Promise<AnalysisResponse> {
  const response = await fetch(
    "/api/analyze",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
      },

      cache: "no-store",

      body: JSON.stringify({
        title: article.title,
        description:
          article.description,
        url: article.url,
        source: article.source,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to generate intelligence report"
    );
  }

  return (await response.json()) as AnalysisResponse;
}

export function getMockIntelligenceReport(): IntelligenceReport {
  return {
    article: {
      title: "Loading report...",
      description:
        "Generating intelligence report...",
      url: "",
      urlToImage: "",
      publishedAt:
        new Date().toISOString(),

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

    trustScore: {
      overall: 0,
      evidenceStrength: "Low",
      reportingAgreement: 0,
      sourceCount: 1,
      politicalDiversity: "Low",
    },

    executiveSummary:
      "Generating intelligence report...",

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
      "The reported issue is part of an active public discussion.",
      "Additional reporting may change how the story is understood.",
    ],

    consensusScore: 0,

    factCheck: {
      verdict: "Pending",
      explanation:
        "Fact checking is being generated.",
    },

    perspectives: {
      left:
        "Generating left perspective...",
      center:
        "Generating center perspective...",
      right:
        "Generating right perspective...",
    },

    perspectiveAnalysis: {
      topic:
        "Generating debate topic...",

      progressive: {
        position:
          "Generating progressive position...",
        strongestArguments: [],
        primaryConcerns: [],
      },

      centrist: {
        position:
          "Generating centrist position...",
        strongestArguments: [],
        primaryConcerns: [],
      },

      conservative: {
        position:
          "Generating conservative position...",
        strongestArguments: [],
        primaryConcerns: [],
      },

      areasOfAgreement: [
        "PoliticalPulse is analyzing potential areas of agreement.",
      ],

      mainDisagreements: [],

      politicalPulseAnalysis:
        "PoliticalPulse is generating a neutral synthesis of the debate.",

      debateTemperature: 0,
    },

    evidence: {
      primarySources: [
        "PoliticalPulse AI",
      ],
      conflictingReporting: [],
      methodology:
        "PoliticalPulse AI is gathering and evaluating available reporting.",
      lastAnalyzedAt:
        new Date().toISOString(),
    },
  };
}

export async function generateIntelligenceReport(
  article: Article
): Promise<IntelligenceReport> {
  /*
   * Performance optimization:
   *
   * Source gathering and AI report generation are independent
   * during the initial report request, so they begin together.
   *
   * Previously:
   * gather sources -> wait -> generate AI report
   *
   * Now:
   * gather sources ─┐
   *                  ├-> assemble report
   * generate AI  ───┘
   */
  const [
    rankedSources,
    analysis,
  ] = await Promise.all([
    gatherRankedSources(article),
    requestReportAnalysis(article),
  ]);

  const sourceConsensus =
    calculateSourceConsensus(
      rankedSources
    );

  const sourceNames = Array.from(
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

  const analyzedSourceCount =
    sourceNames.length ||
    rankedSources.length ||
    1;

  const confidence = toClampedScore(
    analysis.confidence,
    sourceConsensus.averageReliability
  );

  const consensusScore =
    toClampedScore(
      analysis.consensusScore,
      sourceConsensus.consensusScore
    );

  const sourcesReviewed =
    toPositiveCount(
      analysis.sourcesReviewed,
      analyzedSourceCount
    );

  const returnedCommonGround =
    toStringArray(
      analysis.commonGround
    );

  const commonGround =
    returnedCommonGround.length > 0
      ? returnedCommonGround
      : [
          "Multiple reports identify the story as relevant to the public discussion.",
          "Further developments may change how the issue is understood.",
        ];

  const analysisPrimarySources =
    toStringArray(
      analysis.evidence
        ?.primarySources
    );

  const conflictingReporting =
    toStringArray(
      analysis.evidence
        ?.conflictingReporting
    );

  const trustScore =
    calculateTrustScore({
      confidence,
      consensusScore,
      sourceCount:
        sourceConsensus.sourceCount,
      averageReliability:
        sourceConsensus.averageReliability,
      politicalDistribution:
        sourceConsensus
          .politicalDistribution,
    });

  const perspectiveAnalysis =
    createPerspectiveAnalysis(
      analysis,
      article,
      commonGround
    );

  return {
    article,

    overview: {
      biasScore: toClampedScore(
        analysis.biasScore,
        50
      ),

      confidence,

      category: toStringValue(
        analysis.category,
        "Political"
      ),

      sourcesReviewed,
    },

    trustScore,

    executiveSummary:
      toStringValue(
        analysis.summary,
        article.description ||
          "No executive summary is available."
      ),

    whyThisMatters:
      toStringValue(
        analysis.whyThisMatters,
        "PoliticalPulse could not determine why this story matters from the available reporting."
      ),

    whoIsAffected: toStringArray(
      analysis.whoIsAffected
    ),

    shortTermImpact:
      toStringValue(
        analysis.shortTermImpact,
        "The short-term impact is not yet clear from the available reporting."
      ),

    longTermImpact:
      toStringValue(
        analysis.longTermImpact,
        "The long-term impact is not yet clear from the available reporting."
      ),

    unansweredQuestions:
      toStringArray(
        analysis.unansweredQuestions
      ),

    keyFacts: toStringArray(
      analysis.keyFacts
    ),

    commonGround,

    consensusScore,

    factCheck: {
      verdict: toStringValue(
        analysis.factCheck?.verdict,
        "Pending"
      ),

      explanation: toStringValue(
        analysis.factCheck
          ?.explanation,
        "Fact-checking details are not currently available."
      ),
    },

    perspectives: {
      left: toStringValue(
        analysis.perspectives?.left,
        "Left-leaning perspective analysis is not available."
      ),

      center: toStringValue(
        analysis.perspectives?.center,
        "Centrist perspective analysis is not available."
      ),

      right: toStringValue(
        analysis.perspectives?.right,
        "Right-leaning perspective analysis is not available."
      ),
    },

    perspectiveAnalysis,

    evidence: {
      primarySources:
        analysisPrimarySources.length >
        0
          ? analysisPrimarySources
          : sourceNames,

      conflictingReporting,

      methodology: toStringValue(
        analysis.evidence?.methodology,
        `PoliticalPulse gathered ${analyzedSourceCount} source${
          analyzedSourceCount === 1
            ? ""
            : "s"
        }, removed duplicate coverage, evaluated source metadata, calculated a preliminary source-set confidence score, and generated a neutral intelligence assessment.`
      ),

      lastAnalyzedAt:
        toStringValue(
          analysis.evidence
            ?.lastAnalyzedAt,
          new Date().toISOString()
        ),
    },
  };
}