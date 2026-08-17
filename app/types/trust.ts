export type EvidenceStrength =
  | "Low"
  | "Medium"
  | "High";

export type PoliticalDiversity =
  | "Low"
  | "Medium"
  | "High";

export type TrustScore = {
  overall: number;

  evidenceStrength: EvidenceStrength;

  /*
   * Cross-source reporting agreement.
   *
   * null means PoliticalPulse does not have
   * enough independent reporting to calculate
   * a meaningful agreement score.
   */
  reportingAgreement: number | null;

  sourceCount: number;

  ratedSourceCount: number;

  politicalDiversity: PoliticalDiversity;
};