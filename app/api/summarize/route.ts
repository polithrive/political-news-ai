import { openai } from "@/lib/ai/client";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

export async function POST(request: Request) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.aiGenerate,
    ai: true,
  });

  if (blocked) {
    return blocked;
  }

  try {
    const body = await request.json();

    const title = body.title || "No title provided";
    const description = body.description || "No description provided";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You summarize political news in a neutral, clear, non-partisan tone.",
        },
        {
          role: "user",
          content: `Summarize this article in 3 short sentences.

Title: ${title}

Description: ${description}`,
        },
      ],
    });

    return Response.json({
      summary: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI summary error:", error);

    return Response.json(
      {
        summary:
          "AI summary could not be generated right now. Please try again later.",
      },
      { status: 200 }
    );
  }
}