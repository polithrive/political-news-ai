export type AnalysisResult = {
  summary: string;
  biasScore: number;
  lean: string;
  biasReasoning: string;
  keyFacts: string[];
  factCheck: string;
  confidence: number;
};