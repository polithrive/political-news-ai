export type SnapshotSupportField = "title" | "description";

export type EvidenceSnapshotPrimaryV1 = {
  url: string;
  title: string;
  sourceName: string;
  publishedAt: string;
};

export type EvidenceSnapshotSourceV1 = {
  url: string;
  sourceName: string;
  publishedAt: string;
  title: string;
  isPrimary: boolean;
};

export type EvidenceSnapshotSupportV1 = {
  url: string;
  publisher: string;
  fragment: string;
  field: SnapshotSupportField;
};

export type EvidenceSnapshotFactV1 = {
  text: string;
  publishers: string[];
  support: EvidenceSnapshotSupportV1[];
};

export type EvidenceSnapshotCoverageDifferenceV1 = {
  text: string;
  publishers: string[];
};

export type EvidenceSnapshotV1 = {
  primary: EvidenceSnapshotPrimaryV1;
  sources: EvidenceSnapshotSourceV1[];
  facts: EvidenceSnapshotFactV1[];
  uncertainties: string[];
  coverageDifferences: EvidenceSnapshotCoverageDifferenceV1[];
  independentSourceCount: number;
  limitedEvidence: boolean;
};
