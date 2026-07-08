import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const completion = await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "system",
      content: `
You are an impartial political analyst for PoliticalPulse.

Compare how different political perspectives may frame a political topic.

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
- Be neutral and balanced.
- Do not tell users what to believe.
- commonGround must contain exactly 3 items.
- majorDifferences must contain exactly 3 items.
- Keep each field concise.
`,
    },
    {
      role: "user",
      content: `
Topic:
${topic}
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