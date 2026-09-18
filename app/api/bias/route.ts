import OpenAI from "openai";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.aiGenerate,
    ai: true,
  });

  if (blocked) {
    return blocked;
  }

  try {
    const { title, description } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an impartial political analyst.

Analyze the news article and return ONLY valid JSON.

Return this format:

{
  "biasScore": 50,
  "lean": "Center",
  "reasoning": "Brief explanation of why this score was assigned."
}

Rules:
- biasScore must be between 0 and 100
- 0 = strongly left-leaning
- 50 = neutral/center
- 100 = strongly right-leaning
- lean must be one of:
  Left
  Lean Left
  Center
  Lean Right
  Right
- Keep reasoning under 60 words.
`,
        },
        {
          role: "user",
          content: `
Title:
${title}

Description:
${description}
`,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    return Response.json(
      JSON.parse(completion.choices[0].message.content!)
    );
  } catch (error) {
    console.error("Bias API Error:", error);

    return Response.json(
      { error: "Failed to analyze bias" },
      { status: 500 }
    );
  }
}