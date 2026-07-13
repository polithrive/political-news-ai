export type SuggestedQuestion = {
  id: string;

  text: string;
};

export type IntelligenceConfidence =
  | "Low"
  | "Medium"
  | "High";

export type IntelligenceAnswer = {
  content: string;

  reportSectionsUsed: string[];

  confidence: IntelligenceConfidence;

  suggestedQuestions: SuggestedQuestion[];
};

export type DebatePerspective = {
  perspective: string;

  summary: string;
};

export type DebateResult = {
  left: DebatePerspective;

  center: DebatePerspective;

  right: DebatePerspective;

  consensus: string;
};

export type TimelineEvent = {
  id: string;

  title: string;

  description: string;

  date?: string;
};

export type IntelligenceResponse = {
  answer: IntelligenceAnswer;

  debate?: DebateResult;

  timeline?: TimelineEvent[];
};