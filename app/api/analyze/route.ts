import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an impartial political news analyst.

Analyze the article and return ONLY valid JSON.

Return this exact format:

{
  "summary": "Brief neutral summary of the article.",
  "biasScore": 50,
  "lean": "Center",
  "biasReasoning": "Brief explanation of the bias rating.",
  "keyFacts": [
    "Fact 1",
    "Fact 2",
    "Fact 3"
  ],
  "factCheck": "Brief note on whether the claims appear factual, uncertain, or need verification.",
  "confidence": 85
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
- keyFacts must contain exactly 3 short facts.
- confidence must be between 0 and 100.
- Keep all responses concise.
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
    console.error("Analyze API Error:", error);

    return Response.json(
      { error: "Failed to analyze article" },
      { status: 500 }
    );
  }
}