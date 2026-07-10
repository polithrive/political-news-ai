import type { SourceAnalysis } from "@/app/types/source";

export function getMockSourceAnalysis(
  sourceName: string
): SourceAnalysis {
  return {
    sourceName,
    reliabilityScore: 95,
    factualReporting: "High",
    politicalLean: "Center",
    historicalAccuracy: "Excellent",
    opinionLevel: "Low",
    primarySources: "Frequently Used",
    coverageStyle: "Breaking News",
    summary:
      "This publication is generally regarded as a reliable source of factual reporting with limited editorial opinion.",
  };
}