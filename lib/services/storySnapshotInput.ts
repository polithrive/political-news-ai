export type StorySnapshotInputSource = {
  sourceId: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  title: string;
  isPrimary: boolean;
};

export type StorySnapshotInputSupport = {
  sourceId: string;
  publisher: string;
  supportText: string;
  supportField: "title" | "description";
};

export type StorySnapshotInputFact = {
  text: string;
  supportedBy: string[];
  evidence: StorySnapshotInputSupport[];
};

export type StorySnapshotInputCoverageDifference = {
  text: string;
  representedBy: string[];
};

export type StorySnapshotInputBrief = {
  corroboratedFacts: StorySnapshotInputFact[];
  uncertainties: string[];
  coverageDifferences: StorySnapshotInputCoverageDifference[];
  independentSourceCount: number;
  limitedEvidence: boolean;
};

export type StorySnapshotInput = {
  primary: {
    url: string;
    title: string;
    sourceName: string;
    publishedAt: string;
  };
  sources: StorySnapshotInputSource[];
  brief: StorySnapshotInputBrief;
};
