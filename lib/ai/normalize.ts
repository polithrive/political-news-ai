import type {
  AnalysisResult,
  FactCheckResult,
} from "@/app/types/analysis";

type FactCheckObject = {
  verdict: unknown;
  explanation: unknown;
};

type AnalysisInput = {
  summary?: unknown;
  biasScore?: unknown;
  lean?: unknown;
  biasReasoning?: unknown;
  keyFacts?: unknown;
  factCheck?: unknown;
  confidence?: unknown;
};

function isFactCheckObject(
  value: unknown
): value is FactCheckObject {
  return (
    typeof value === "object" &&
    value !== null &&
    "verdict" in value &&
    "explanation" in value
  );
}

function normalizeFactCheck(
  factCheck: unknown
): FactCheckResult {
  if (typeof factCheck === "string") {
    return factCheck;
  }

  if (isFactCheckObject(factCheck)) {
    return {
      verdict: String(factCheck.verdict),
      explanation: String(factCheck.explanation),
    };
  }

  return {
    verdict: "Unavailable",
    explanation: "No fact check available.",
  };
}

export function normalizeAnalysis(
  data: AnalysisInput
): AnalysisResult {
  return {
    summary: String(
      data.summary ?? "Summary unavailable."
    ),

    biasScore:
      typeof data.biasScore === "number"
        ? data.biasScore
        : 50,

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