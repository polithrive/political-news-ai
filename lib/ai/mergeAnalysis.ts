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

  perspectives: PoliticalAnalysis["perspectives"];

  perspectiveAnalysis:
    PoliticalAnalysis["perspectiveAnalysis"];

  commonGround: string[];
  consensusScore: number;

  factCheck: SummaryAnalysis["factCheck"];

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
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value))
  );
}

export function mergeAnalysis({
  summaryAnalysis,
  politicalAnalysis,
  sourceName,
}: MergeAnalysisInput): MergedAnalysis {
  return {
    summary: summaryAnalysis.summary,
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

    biasScore: clampScore(
      politicalAnalysis.biasScore
    ),

    lean: politicalAnalysis.lean,

    biasReasoning:
      politicalAnalysis.biasReasoning,

    confidence: clampScore(
      summaryAnalysis.confidence
    ),

    category: summaryAnalysis.category,

    sourcesReviewed: 1,

    keyFacts: summaryAnalysis.keyFacts,

    perspectives:
      politicalAnalysis.perspectives,

    perspectiveAnalysis:
      politicalAnalysis.perspectiveAnalysis,

    commonGround:
      politicalAnalysis.commonGround,

    consensusScore: clampScore(
      politicalAnalysis.consensusScore
    ),

    factCheck: summaryAnalysis.factCheck,

    evidence: {
      primarySources: [sourceName],

      conflictingReporting: [],

      methodology:
        "PoliticalPulse generated two parallel analyses from the supplied article title, description, and source: one focused on factual summary and impact, and one focused on political framing, viewpoints, agreement, and disagreement. Full article extraction was disabled for Alpha performance.",

      lastAnalyzedAt:
        new Date().toISOString(),
    },
  };
}