import type { Article } from "./article";

export type IntelligenceOverview = {
  biasScore: number;
  confidence: number;
  category: string;
  sourcesReviewed: number;
};

export type ReportEvidence = {
  primarySources: string[];
  conflictingReporting: string[];
  methodology: string;
  lastAnalyzedAt: string;
};

export type IntelligenceReport = {
  article: Article;

  overview: IntelligenceOverview;

  executiveSummary: string;

  whyThisMatters: string;

  whoIsAffected: string[];

  shortTermImpact: string;

  longTermImpact: string;

  unansweredQuestions: string[];

  keyFacts: string[];

  commonGround: string[];

  consensusScore: number;

  factCheck: {
    verdict: string;
    explanation: string;
  };

  perspectives: {
    left: string;
    center: string;
    right: string;
  };

  evidence: ReportEvidence;
};