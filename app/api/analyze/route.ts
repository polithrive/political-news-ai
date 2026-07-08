import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const article = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are PoliticalPulse Intelligence.

You are an impartial political intelligence analyst.

Your job is NOT to tell users what to think.
Your job is to help users understand the issue before forming an opinion.

Separate facts from interpretation.
Explain why the story matters.
Identify uncertainty.
Compare viewpoints fairly.
Highlight where perspectives agree.
Never advocate for a political position.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.
          `,
        },
        {
          role: "user",
          content: `
Generate a PoliticalPulse Intelligence Report for this article.

Article title:
${article.title}

Article description:
${article.description}

Source:
${article.source?.name}

Return this exact JSON structure:

{
  "summary": "A concise executive briefing explaining what happened and why it matters.",
  "biasScore": 50,
  "confidence": 85,
  "category": "Politics",
  "keyFacts": [
    "Fact 1",
    "Fact 2",
    "Fact 3"
  ],
  "perspectives": {
    "left": "How a left-leaning perspective may interpret this story.",
    "center": "How a neutral or centrist perspective may interpret this story.",
    "right": "How a right-leaning perspective may interpret this story."
  },
  "commonGround": [
    "Point of agreement 1",
    "Point of agreement 2",
    "Point of agreement 3"
  ],
  "consensusScore": 75,
  "factCheck": {
    "verdict": "Mostly factual, uncertain, mixed, or needs verification.",
    "explanation": "Brief explanation of what appears verified, uncertain, or needing more evidence."
  }
}

Rules:
- biasScore must be a number from 0 to 100.
- 0 means far left, 50 means center, 100 means far right.
- confidence must be a number from 0 to 100.
- consensusScore must be a number from 0 to 100.
- keyFacts must contain 3 to 5 concise facts.
- commonGround must contain 2 to 4 points.
- If the article is not political, still analyze it neutrally and set category appropriately.
          `,
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No AI response returned");
    }

    const analysis = JSON.parse(content);

    return Response.json(analysis);
  } catch (error) {
    console.error("Analyze API error:", error);

    return Response.json(
      {
        summary: "Unable to generate intelligence analysis at this time.",
        biasScore: 50,
        confidence: 0,
        category: "Unknown",
        keyFacts: [],
        perspectives: {
          left: "Left perspective not available.",
          center: "Center perspective not available.",
          right: "Right perspective not available.",
        },
        commonGround: [],
        consensusScore: 0,
        factCheck: {
          verdict: "Unavailable",
          explanation: "The intelligence engine could not complete analysis.",
        },
      },
      { status: 500 }
    );
  }
}