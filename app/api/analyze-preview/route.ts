import { generateCachedPreview } from "@/lib/ai/generateCachedPreview";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

type PreviewRequest = {
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
    bucket: RATE_LIMIT_BUCKETS.aiPreview,
    ai: true,
  });

  if (blocked) {
    return blocked;
  }

  try {
    const article =
      (await request.json()) as PreviewRequest;

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

    const analysis =
      await generateCachedPreview({
        title,
        description,
        sourceName,
      });

    return Response.json(analysis);
  } catch (error) {
    console.error(
      "Analyze preview API error:",
      error
    );

    return Response.json({
      summary:
        "The Angle Report could not generate an AI preview for this story.",

      biasScore: 50,

      lean: "Center",

      biasReasoning:
        "The article framing could not be evaluated.",

      keyFacts: [],

      factCheck: {
        verdict: "Unavailable",

        explanation:
          "The preview analysis could not be completed.",
      },

      confidence: 0,
    });
  }
}