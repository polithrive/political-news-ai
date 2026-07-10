import type { AnalysisResult, FactCheckResult } from "@/app/types/analysis";

function normalizeFactCheck(
  factCheck: unknown
): FactCheckResult {
  if (typeof factCheck === "string") {
    return factCheck;
  }

  if (
    factCheck &&
    typeof factCheck === "object" &&
    "verdict" in factCheck &&
    "explanation" in factCheck
  ) {
    return {
      verdict: String((factCheck as any).verdict),
      explanation: String((factCheck as any).explanation),
    };
  }

  return {
    verdict: "Unavailable",
    explanation: "No fact check available.",
  };
}

export function normalizeAnalysis(data: any): AnalysisResult {
  return {
    summary: String(data.summary ?? "Summary unavailable."),
    biasScore:
      typeof data.biasScore === "number" ? data.biasScore : 50,
    lean: String(data.lean ?? "Center"),
    biasReasoning: String(
      data.biasReasoning ?? "No reasoning available."
    ),
    keyFacts: Array.isArray(data.keyFacts)
      ? data.keyFacts.map(String)
      : [],
    factCheck: normalizeFactCheck(data.factCheck),
    confidence:
      typeof data.confidence === "number"
        ? data.confidence
        : 0,
  };
}