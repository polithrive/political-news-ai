import type {
  PoliticalAnalysis,
} from "@/lib/ai/generatePoliticalAnalysis";

import type {
  SummaryAnalysis,
} from "@/lib/ai/generateSummary";

export type MergedAnalysis = {
  summary: string;
  whyThisMatters: string;
  whoIsAffected: string[];
  shortTermImpact: string;
  longTermImpact: string;
  unansweredQuestions: string[];

  biasScore: number;
  lean: "Left" | "Center" | "Right";
  biasReasoning: string;

  confidence: number;
  category: string;
  sourcesReviewed: number;
  keyFacts: string[];

  perspectives:
    PoliticalAnalysis["perspectives"];

  perspectiveAnalysis:
    PoliticalAnalysis["perspectiveAnalysis"];

  commonGround: string[];
  consensusScore: number;

  factCheck:
    SummaryAnalysis["factCheck"];

  brief?: unknown;

  evidence: {
    primarySources: string[];
    conflictingReporting: string[];
    methodology: string;
    lastAnalyzedAt: string;
  };
};

type MergeAnalysisInput = {
  summaryAnalysis: SummaryAnalysis;
  politicalAnalysis: PoliticalAnalysis;
  sourceName: string;

  sourcesReviewed?: number;
  primarySources?: string[];
  conflictingReporting?: string[];
  methodology?: string;
};

function clampScore(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

function normalizeSources(
  primarySources: string[] | undefined,
  fallbackSourceName: string
): string[] {
  const cleanedSources =
    (primarySources ?? [])
      .map((source) =>
        source.trim()
      )
      .filter(Boolean);

  if (
    cleanedSources.length === 0 &&
    fallbackSourceName.trim()
  ) {
    return [
      fallbackSourceName.trim(),
    ];
  }

  return Array.from(
    new Set(cleanedSources)
  );
}

export function mergeAnalysis({
  summaryAnalysis,
  politicalAnalysis,
  sourceName,
  sourcesReviewed,
  primarySources,
  conflictingReporting,
  methodology,
}: MergeAnalysisInput): MergedAnalysis {
  const normalizedPrimarySources =
    normalizeSources(
      primarySources,
      sourceName
    );

  const normalizedSourceCount =
    Number.isFinite(sourcesReviewed)
      ? Math.max(
          1,
          Math.round(
            sourcesReviewed ?? 1
          )
        )
      : Math.max(
          1,
          normalizedPrimarySources.length
        );

  return {
    summary:
      summaryAnalysis.summary,

    whyThisMatters:
      summaryAnalysis.whyThisMatters,

    whoIsAffected:
      summaryAnalysis.whoIsAffected,

    shortTermImpact:
      summaryAnalysis.shortTermImpact,

    longTermImpact:
      summaryAnalysis.longTermImpact,

    unansweredQuestions:
      summaryAnalysis.unansweredQuestions,

    biasScore:
      clampScore(
        politicalAnalysis.biasScore
      ),

    lean:
      politicalAnalysis.lean,

    biasReasoning:
      politicalAnalysis.biasReasoning,

    confidence:
      clampScore(
        summaryAnalysis.confidence
      ),

    category:
      summaryAnalysis.category,

    sourcesReviewed:
      normalizedSourceCount,

    keyFacts:
      summaryAnalysis.keyFacts,

    perspectives:
      politicalAnalysis.perspectives,

    perspectiveAnalysis:
      politicalAnalysis.perspectiveAnalysis,

    commonGround:
      politicalAnalysis.commonGround,

    consensusScore:
      clampScore(
        politicalAnalysis.consensusScore
      ),

    factCheck:
      summaryAnalysis.factCheck,

    brief: summaryAnalysis.brief,

    evidence: {
      primarySources:
        normalizedPrimarySources,

      conflictingReporting:
        conflictingReporting ?? [],

      methodology:
        methodology ??
        "The Angle Report analyzed the supplied article using separate summary and political-intelligence modules. When additional evidence sources are provided, the analysis is grounded in that broader evidence set rather than the primary article alone.",

      lastAnalyzedAt:
        new Date().toISOString(),
    },
  };
}