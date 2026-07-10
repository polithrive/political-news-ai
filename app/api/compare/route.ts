import { openai } from "@/lib/ai/client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.perspectiveComparison,
        },
        {
          role: "user",
          content: `
Topic:
${topic}

Return ONLY valid JSON in this exact format:

{
  "topic": "Topic name",
  "leftPerspective": "How left-leaning coverage may frame this topic.",
  "centerPerspective": "How centrist coverage may frame this topic.",
  "rightPerspective": "How right-leaning coverage may frame this topic.",
  "commonGround": [
    "Point of agreement 1",
    "Point of agreement 2",
    "Point of agreement 3"
  ],
  "majorDifferences": [
    "Difference 1",
    "Difference 2",
    "Difference 3"
  ],
  "politicalPulseInsight": "Neutral explanation of why the perspectives differ."
}

Rules:
- commonGround must contain exactly 3 items.
- majorDifferences must contain exactly 3 items.
- Keep each field concise.
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
    console.error("Compare API Error:", error);

    return Response.json(
      { error: "Failed to compare perspectives" },
      { status: 500 }
    );
  }
}