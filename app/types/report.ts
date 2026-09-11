import type { Article } from "./article";
import type { TrustScore } from "./trust";

export type IntelligenceOverview = {
  biasScore: number;
  confidence: number;
  category: string;
  sourcesReviewed: number;
};

export type ReportRelatedSource = {
  title: string;
  url: string;
  sourceName: string;
  isPrimary: boolean;
};

export type ReportEvidence = {
  primarySources: string[];
  conflictingReporting: string[];
  methodology: string;
  lastAnalyzedAt: string;

  /*
   * Optional richer source records from the
   * URL-analysis evidence set. Homepage reports
   * may omit this field.
   */
  relatedSources?: ReportRelatedSource[];
};

export type DebatePerspective = {
  position: string;
  strongestArguments: string[];
  primaryConcerns: string[];
};

export type PoliticalPerspectiveAnalysis = {
  topic: string;

  progressive: DebatePerspective;

  centrist: DebatePerspective;

  conservative: DebatePerspective;

  areasOfAgreement: string[];

  mainDisagreements: string[];

  politicalPulseAnalysis: string;

  debateTemperature: number;
};

export type IntelligenceReport = {
  article: Article;

  overview: IntelligenceOverview;

  trustScore: TrustScore;

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

  /*
   * Legacy perspective summaries used throughout
   * the existing Intelligence Report.
   */
  perspectives: {
    left: string;
    center: string;
    right: string;
  };

  /*
   * Dedicated structured data used by
   * PoliticalPulse Debate™.
   */
  perspectiveAnalysis: PoliticalPerspectiveAnalysis;

  evidence: ReportEvidence;
};