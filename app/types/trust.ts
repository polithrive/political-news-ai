export type TrustScore = {
  overall: number;

  evidenceStrength:
    | "Low"
    | "Medium"
    | "High";

  reportingAgreement: number;

  sourceCount: number;

  politicalDiversity:
    | "Low"
    | "Medium"
    | "High";
};