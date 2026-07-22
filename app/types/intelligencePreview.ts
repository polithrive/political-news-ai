export type IntelligencePreview = {
  summary: string;

  biasScore: number;

  lean: string;

  biasReasoning: string;

  keyFacts: string[];

  factCheck:
    | string
    | {
        verdict: string;
        explanation: string;
      };

  confidence: number;

  trustScore: number;

  consensusScore: number;

  sourcesReviewed: number;
};