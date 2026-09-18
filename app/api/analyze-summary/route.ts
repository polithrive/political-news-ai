import {
  generateSummaryAnalysis,
} from "@/lib/ai/generateSummary";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

type SummaryRequest = {
  title?: unknown;
  description?: unknown;

  source?: {
    name?: unknown;
  };
};

function toSafeString(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : fallback;
}

export async function POST(
  request: Request
) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.aiGenerate,
    ai: true,
  });

  if (blocked) {
    return blocked;
  }

  try {
    const article =
      (await request.json()) as SummaryRequest;

    const title = toSafeString(
      article.title,
      "Title unavailable"
    );

    const description = toSafeString(
      article.description,
      "Description unavailable"
    );

    const sourceName = toSafeString(
      article.source?.name,
      "Source unavailable"
    );

    const summaryAnalysis =
      await generateSummaryAnalysis({
        title,
        description,
        sourceName,
      });

    return Response.json(
      summaryAnalysis
    );
  } catch (error) {
    console.error(
      "Summary analysis API error:",
      error
    );

    return Response.json({
      summary:
        "PoliticalPulse could not complete the executive summary for this story.",

      whyThisMatters:
        "Additional information is needed to determine the story’s broader significance.",

      whoIsAffected: [],

      shortTermImpact:
        "Short-term impact analysis is currently unavailable.",

      longTermImpact:
        "Long-term impact analysis is currently unavailable.",

      unansweredQuestions: [
        "What additional reporting is available?",
        "Which claims require independent verification?",
      ],

      keyFacts: [],

      factCheck: {
        verdict: "Unavailable",

        explanation:
          "PoliticalPulse could not complete the fact-check assessment.",
      },

      category: "Unknown",

      confidence: 0,
    });
  }
}