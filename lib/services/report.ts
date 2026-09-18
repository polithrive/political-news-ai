import type { Article } from "@/app/types/article";
import type {
  DebatePerspective,
  IntelligenceReport,
  PoliticalPerspectiveAnalysis,
  ReportRelatedSource,
} from "@/app/types/report";

import {
  buildEvidenceContext,
  type EvidenceContext,
  type EvidenceSource,
} from "./evidenceContext";
import { normalizeEvidenceBrief } from "./evidenceBrief";
import {
  type RankedArticle,
} from "./multiSource";
import { getSourceRating } from "./sourceRanking";
import { calculateTrustScore } from "./trustScore";
import { createStorySnapshotInput } from "./buildEvidenceSnapshot";
import type { StorySnapshotInput } from "./storySnapshotInput";

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

  brief?: unknown;
};

function getDurationMs(
  startedAt: number
): number {
  return Math.round(
    performance.now() - startedAt
  );
}

function toStringValue(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" &&
    value.trim()
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
    Math.min(
      100,
      Math.round(numericValue)
    )
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
        "The Angle Report identified the major perspectives and areas of possible agreement, but a dedicated synthesis was not available."
      ),

    debateTemperature: toClampedScore(
      dedicatedAnalysis?.debateTemperature,
      50
    ),
  };
}

async function gatherHomepageEvidence(
  article: Article
): Promise<EvidenceContext> {
  try {
    return await buildEvidenceContext(article);
  } catch (error) {
    console.error(
      "Failed to gather ranked sources for report:",
      error
    );

    return buildEvidenceContext(article, {
      rankedSources: [
        createFallbackRankedSource(article),
      ],
    });
  }
}

function createRelatedSources(
  sources: EvidenceSource[]
): ReportRelatedSource[] {
  return sources
    .map((source) => ({
      title: source.title,
      url: source.url,
      sourceName: source.sourceName,
      isPrimary: source.isPrimary,
    }))
    .filter(
      (source) =>
        source.sourceName || source.title || source.url
    );
}

async function requestReportAnalysis(
  article: Article,
  evidenceContext: string
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
        evidenceContext,
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
        name: "The Angle Report",
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
      reportingAgreement: null,
      sourceCount: 1,
      ratedSourceCount: 0,
      politicalDiversity: "Low",
    },

    executiveSummary:
      "Generating intelligence report...",

    whyThisMatters:
      "The Angle Report is determining why this story matters.",

    whoIsAffected: [],

    shortTermImpact:
      "The Angle Report is analyzing the likely short-term effects.",

    longTermImpact:
      "The Angle Report is analyzing the possible long-term effects.",

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
        "The Angle Report is analyzing potential areas of agreement.",
      ],

      mainDisagreements: [],

      politicalPulseAnalysis:
        "The Angle Report is generating a neutral synthesis of the debate.",

      debateTemperature: 0,
    },

    evidence: {
      primarySources: [
        "The Angle Report AI",
      ],

      conflictingReporting: [],

      methodology:
        "The Angle Report AI is gathering and evaluating available reporting.",

      lastAnalyzedAt:
        new Date().toISOString(),
    },

    brief: {
      whatHappened: "",
      whyItMatters: "",
      corroboratedFacts: [],
      angles: [],
      uncertainties: [],
      coverageDifferences: [],
      limitedEvidence: true,
      independentSourceCount: 1,
    },
  };
}

export async function generateIntelligenceReport(
  article: Article
): Promise<{
  report: IntelligenceReport;
  snapshotInput: StorySnapshotInput;
}> {
  const totalStartedAt =
    performance.now();

  let sourceGatheringMs = 0;
  let aiAnalysisMs = 0;

  const evidenceStartedAt =
    performance.now();

  const evidenceContext =
    await gatherHomepageEvidence(
      article
    );

  sourceGatheringMs =
    getDurationMs(evidenceStartedAt);

  const analysisStartedAt =
    performance.now();

  const analysis =
    await requestReportAnalysis(
      article,
      evidenceContext.promptContext
    );

  aiAnalysisMs =
    getDurationMs(analysisStartedAt);

  const assemblyStartedAt =
    performance.now();

  const consensusStartedAt =
    performance.now();

  const sourceConsensus =
    evidenceContext.sourceConsensus;

  const consensusCalculationMs =
    getDurationMs(
      consensusStartedAt
    );

  const relatedSources =
    createRelatedSources(
      evidenceContext.sources
    );

  /*
   * Source names are derived from the sources
   * The Angle Report actually gathered rather
   * than from an AI-estimated source count.
   */
  const sourceNames = Array.from(
    new Set(
      [
        ...sourceConsensus.sourceNames,
        ...relatedSources.map(
          (source) => source.sourceName
        ),
      ]
        .map((sourceName) => sourceName.trim())
        .filter(Boolean)
    )
  );

  const analyzedSourceCount =
    sourceNames.length ||
    sourceConsensus.sourceCount ||
    evidenceContext.sourceCount ||
    1;

  const independentSourceCount =
    evidenceContext.independentSourceCount ||
    analyzedSourceCount;

  /*
   * AI confidence remains an analysis signal,
   * but unknown source quality no longer becomes
   * an artificial 75% confidence fallback.
   */
  const confidenceFallback =
    sourceConsensus.averageReliability ??
    50;

  const rawConfidence =
    toClampedScore(
      analysis.confidence,
      confidenceFallback
    );

  /*
   * A single-source report should not present
   * very high report-level confidence because
   * independent corroboration is unavailable.
   *
   * This is separate from Trust Score. The AI
   * may be confident in its interpretation, but
   * The Angle Report should communicate evidence
   * limitations consistently throughout the UI.
   */
  const confidence =
    analyzedSourceCount <= 1
      ? Math.min(
          rawConfidence,
          65
        )
      : analyzedSourceCount === 2
        ? Math.min(
            rawConfidence,
            80
          )
        : rawConfidence;

  /*
   * Political consensus is its own concept.
   * It measures agreement across political
   * perspectives and must never fall back to
   * source quality or reporting agreement.
   */
  const consensusScore =
    toClampedScore(
      analysis.consensusScore,
      0
    );

  /*
   * Use the actual gathered source count as the
   * authoritative number shown in the report.
   * The AI response is not authoritative here.
   */
  const sourcesReviewed =
    analyzedSourceCount;

  const returnedCommonGround =
    toStringArray(
      analysis.commonGround
    );

  /*
   * Deep Analysis may still use a generic
   * compatibility fallback. Evidence-grounded
   * brief fields never inherit that text.
   */
  const commonGround =
    returnedCommonGround.length > 0
      ? returnedCommonGround
      : [
          "The Angle Report identified potential areas of agreement in the available analysis.",
          "Additional reporting may change how the issue is understood.",
        ];

  const analysisPrimarySources =
    toStringArray(
      analysis.evidence
        ?.primarySources
    );

  /*
   * Conflicting reporting can only be meaningfully
   * assessed when multiple independent sources
   * were actually gathered.
   */
  const conflictingReporting =
    independentSourceCount >= 2
      ? toStringArray(
          analysis.evidence
            ?.conflictingReporting
        )
      : [];

  const executiveSummary =
    toStringValue(
      analysis.summary,
      article.description ||
        "No executive summary is available."
    );

  const whyThisMatters =
    toStringValue(
      analysis.whyThisMatters,
      "The Angle Report could not determine why this story matters from the available reporting."
    );

  const brief = normalizeEvidenceBrief({
    rawBrief: analysis.brief,
    sources: evidenceContext.sources,
    independentSourceCount,
    whatHappenedFallback: executiveSummary,
    whyItMattersFallback: whyThisMatters,
  });

  const trustScoreStartedAt =
    performance.now();

  const trustScore =
    calculateTrustScore({
      confidence,

      sourceCount:
        sourceConsensus.sourceCount,

      ratedSourceCount:
        sourceConsensus.ratedSourceCount,

      averageReliability:
        sourceConsensus.averageReliability,

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

  const trustScoreCalculationMs =
    getDurationMs(
      trustScoreStartedAt
    );

  const perspectiveAnalysis =
    createPerspectiveAnalysis(
      analysis,
      article,
      commonGround
    );

  /*
   * Evidence language must reflect the amount of
   * corroboration actually available.
   */
  const evidenceMethodology =
    independentSourceCount <= 1
      ? "The Angle Report analyzed the available source, evaluated available source metadata, generated evidence-aware AI assessments, and limited report-level trust because independent corroboration was not available."
      : `The Angle Report gathered ${analyzedSourceCount} sources across ${independentSourceCount} independent publishers, removed duplicate coverage, evaluated available source metadata, compared the reporting set, and generated a neutral intelligence assessment from that evidence context.`;

  const report: IntelligenceReport = {
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

    executiveSummary,

    whyThisMatters,

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
        independentSourceCount <= 1
          ? "Independent corroboration is not currently available, so the central claims require additional verification."
          : "Fact-checking details are not currently available."
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
      /*
       * Prefer the sources The Angle Report actually
       * gathered. AI-provided source names are used
       * only when the gathered list is unavailable.
       */
      primarySources:
        sourceNames.length > 0
          ? sourceNames
          : analysisPrimarySources,

      conflictingReporting,

      methodology:
        evidenceMethodology,

      lastAnalyzedAt:
        toStringValue(
          analysis.evidence
            ?.lastAnalyzedAt,
          new Date().toISOString()
        ),

      relatedSources:
        relatedSources.length > 0
          ? relatedSources
          : undefined,
    },

    brief,
  };

  const reportAssemblyMs =
    getDurationMs(
      assemblyStartedAt
    );

  const totalReportMs =
    getDurationMs(
      totalStartedAt
    );

  console.info(
    "The Angle Report performance:",
    {
      article:
        article.title.slice(0, 100),

      sourceCount:
        evidenceContext.sourceCount,

      independentSourceCount,

      ratedSourceCount:
        sourceConsensus.ratedSourceCount,

      sourceGatheringMs,
      aiAnalysisMs,
      consensusCalculationMs,
      trustScoreCalculationMs,
      reportAssemblyMs,
      totalReportMs,
      briefRejectedEvidence:
        brief.rejectedEvidence?.length ?? 0,
    }
  );

  return {
    report,
    snapshotInput: createStorySnapshotInput({
      primary: {
        url: article.url,
        title: article.title,
        sourceName: article.source.name,
        publishedAt: article.publishedAt,
      },
      sources: evidenceContext.sources,
      brief,
    }),
  };
}
