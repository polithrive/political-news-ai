import {
  generatePoliticalAnalysis,
} from "@/lib/ai/generatePoliticalAnalysis";

type PoliticalRequest = {
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
  try {
    const article =
      (await request.json()) as PoliticalRequest;

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

    const politicalAnalysis =
      await generatePoliticalAnalysis({
        title,
        description,
        sourceName,
      });

    return Response.json(
      politicalAnalysis
    );
  } catch (error) {
    console.error(
      "Political analysis API error:",
      error
    );

    return Response.json({
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
    });
  }
}