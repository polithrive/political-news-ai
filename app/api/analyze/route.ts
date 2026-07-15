import {
  generatePoliticalAnalysis,
  type PoliticalAnalysis,
} from "@/lib/ai/generatePoliticalAnalysis";
import {
  generateSummaryAnalysis,
  type SummaryAnalysis,
} from "@/lib/ai/generateSummary";
import { mergeAnalysis } from "@/lib/ai/mergeAnalysis";

type ArticleRequest = {
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

function logModuleFailure(
  moduleName: string,
  reason: unknown
): void {
  console.error(
    `Analyze API ${moduleName} failed:`,
    reason
  );
}

export async function POST(
  request: Request
) {
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

    const [
      summaryResult,
      politicalResult,
    ] = await Promise.allSettled([
      generateSummaryAnalysis({
        title,
        description,
        sourceName,
      }),

      generatePoliticalAnalysis({
        title,
        description,
        sourceName,
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
      logModuleFailure(
        "summary module",
        summaryResult.reason
      );
    }

    if (
      politicalResult.status === "rejected"
    ) {
      logModuleFailure(
        "political module",
        politicalResult.reason
      );
    }

    const analysis = mergeAnalysis({
      summaryAnalysis,
      politicalAnalysis,
      sourceName,
    });

    return Response.json(analysis);
  } catch (error) {
    console.error(
      "Analyze API orchestration error:",
      error
    );

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