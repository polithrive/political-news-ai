import type { Article } from "./article";

export type IntelligenceOverview = {
  biasScore: number;
  confidence: number;
  category: string;
  sourcesReviewed: number;
};

export type IntelligenceReport = {
  article: Article;

  overview: IntelligenceOverview;

  executiveSummary: string;

  keyFacts: string[];

  factCheck: {
    verdict: string;
    explanation: string;
  };

  perspectives: {
    left: string;
    center: string;
    right: string;
  };

  commonGround: [
  "All perspectives agree this event occurred.",
  "The legislation affects federal policy.",
  "Additional developments are expected."
],
};