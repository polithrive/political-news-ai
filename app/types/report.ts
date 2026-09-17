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
   * evidence set. Homepage and URL reports may
   * both include this when related sources were
   * gathered.
   */
  relatedSources?: ReportRelatedSource[];
};

export type EvidenceBriefSupport = {
  sourceId: string;
  publisher: string;
  supportText: string;
  supportField: "title" | "description";
};

export type EvidenceBriefRejected = {
  kind: "fact" | "angle" | "coverage" | "uncertainty";
  reason: string;
  sourceId?: string;
  supportText?: string;
  claim?: string;
};

export type EvidenceBriefFact = {
  text: string;
  supportedBy: string[];
  evidence: EvidenceBriefSupport[];
};

export type EvidenceBriefAngle = {
  label: string;
  summary: string;
  representedBy: string[];
  evidence: EvidenceBriefSupport[];
};

export type EvidenceBriefCoverageDifference = {
  text: string;
  representedBy: string[];
  evidence: EvidenceBriefSupport[];
};

export type EvidenceBrief = {
  whatHappened: string;
  whyItMatters: string;
  corroboratedFacts: EvidenceBriefFact[];
  angles: EvidenceBriefAngle[];
  uncertainties: string[];
  coverageDifferences: EvidenceBriefCoverageDifference[];
  limitedEvidence: boolean;
  independentSourceCount: number;
  rejectedEvidence?: EvidenceBriefRejected[];
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

  /*
   * Evidence-grounded 60-Second Brief fields.
   * Optional so older cached reports remain readable.
   */
  brief?: EvidenceBrief;
};