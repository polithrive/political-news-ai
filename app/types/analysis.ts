export type FactCheckResult =
  | string
  | {
      verdict: string;
      explanation: string;
    };

export type AnalysisResult = {
  summary: string;

  biasScore: number;

  lean: string;

  biasReasoning: string;

  keyFacts: string[];

  factCheck: FactCheckResult;

  confidence: number;

  trustScore?: number;

  consensusScore?: number;

  sourcesReviewed?: number;

  whyThisMatters?: string;
};