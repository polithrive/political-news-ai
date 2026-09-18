import {
  generatePoliticalAnalysis,
  type PoliticalAnalysis,
} from "@/lib/ai/generatePoliticalAnalysis";
import {
  generateSummaryAnalysis,
  type SummaryAnalysis,
} from "@/lib/ai/generateSummary";
import { mergeAnalysis } from "@/lib/ai/mergeAnalysis";
import { logOps } from "@/lib/ops/log";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

type ArticleRequest = {
  title?: unknown;
  description?: unknown;
  url?: unknown;

  source?: {
    name?: unknown;
  };

  evidenceContext?: unknown;
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

function createSummaryFallback(): SummaryAnalysis {
  return {
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

    brief: {
      whatHappened: "",
      whyItMatters: "",
      corroboratedFacts: [],
      angles: [],
      uncertainties: [],
      coverageDifferences: [],
    },
  };
}

function createPoliticalFallback(): PoliticalAnalysis {
  return {
    biasScore: 50,

    lean: "Center",

    biasReasoning:
      "Political framing could not be assessed from the available analysis.",

    perspectives: {
      left:
        "Progressive interpretation is currently unavailable.",

      center:
        "Centrist interpretation is currently unavailable.",

      right:
        "Conservative interpretation is currently unavailable.",
    },

    perspectiveAnalysis: {
      topic:
        "Political debate analysis is unavailable.",

      progressive: {
        position:
          "Progressive position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      centrist: {
        position:
          "Centrist position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      conservative: {
        position:
          "Conservative position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      areasOfAgreement: [],

      mainDisagreements: [],

      politicalPulseAnalysis:
        "PoliticalPulse could not complete the political perspective analysis.",

      debateTemperature: 0,
    },

    commonGround: [],

    consensusScore: 0,
  };
}

function logModuleFailure(moduleName: string): void {
  logOps("ai_failed", "analyze", moduleName);
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
      (await request.json()) as ArticleRequest;

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

    const evidenceContext = toSafeString(
      article.evidenceContext,
      ""
    );

    const evidenceContextValue =
      evidenceContext.length > 0
        ? evidenceContext
        : undefined;

    const [
      summaryResult,
      politicalResult,
    ] = await Promise.allSettled([
      generateSummaryAnalysis({
        title,
        description,
        sourceName,
        evidenceContext: evidenceContextValue,
      }),

      generatePoliticalAnalysis({
        title,
        description,
        sourceName,
        evidenceContext: evidenceContextValue,
      }),
    ]);

    const summaryAnalysis =
      summaryResult.status === "fulfilled"
        ? summaryResult.value
        : createSummaryFallback();

    const politicalAnalysis =
      politicalResult.status === "fulfilled"
        ? politicalResult.value
        : createPoliticalFallback();

    if (summaryResult.status === "rejected") {
      logModuleFailure("summary");
    }

    if (
      politicalResult.status === "rejected"
    ) {
      logModuleFailure("political");
    }

    const analysis = mergeAnalysis({
      summaryAnalysis,
      politicalAnalysis,
      sourceName,
    });

    return Response.json(analysis);
  } catch {
    logOps("unexpected", "analyze", "generation");

    return Response.json(
      {
        error:
          "PoliticalPulse could not process this article.",
      },
      {
        status: 500,
      }
    );
  }
}