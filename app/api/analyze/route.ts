import { openai } from "@/lib/ai/client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const article = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.politicalAnalyst,
        },
        {
          role: "user",
          content: `
Generate a PoliticalPulse Intelligence Report for the following article.

Article title:
${article.title ?? "Title unavailable"}

Article description:
${article.description ?? "Description unavailable"}

Source:
${article.source?.name ?? "Source unavailable"}

Return this exact JSON structure:

{
  "summary": "A concise executive briefing explaining what happened.",
  "whyThisMatters": "A clear explanation of why this story is politically, socially, legally, or economically important.",
  "whoIsAffected": [
    "Affected group 1",
    "Affected group 2",
    "Affected group 3"
  ],
  "shortTermImpact": "The likely effects over the next several days, weeks, or months.",
  "longTermImpact": "The possible longer-term political, legal, economic, or social effects.",
  "unansweredQuestions": [
    "Important unanswered question 1",
    "Important unanswered question 2",
    "Important unanswered question 3"
  ],
  "biasScore": 50,
  "lean": "Center",
  "biasReasoning": "A concise explanation of why the article framing appears left, center, or right leaning.",
  "confidence": 85,
  "category": "Politics",
  "sourcesReviewed": 1,
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
    "explanation": "A concise explanation of what appears verified, uncertain, or in need of additional evidence."
  },
  "evidence": {
    "primarySources": [
      "Primary source or reporting organization 1",
      "Primary source or reporting organization 2"
    ],
    "conflictingReporting": [
      "A meaningful conflict, discrepancy, or uncertainty between available claims"
    ],
    "methodology": "A concise explanation of how the assessment was produced.",
    "lastAnalyzedAt": "ISO-8601 date and time"
  }
}

Rules:

- Return only valid JSON.
- Do not include markdown.
- Do not include text outside the JSON object.
- Base the analysis only on the supplied article information.
- Do not invent legislation, quotes, vote totals, dates, sources, or events.
- Clearly acknowledge when the supplied article does not provide enough information.
- biasScore must be a number from 0 to 100.
- A biasScore of 0 means strongly left-framed.
- A biasScore of 50 means neutral or centrist framing.
- A biasScore of 100 means strongly right-framed.
- confidence must be a number from 0 to 100.
- consensusScore must be a number from 0 to 100.
- sourcesReviewed must reflect the number of identifiable sources in the supplied article data.
- keyFacts must contain 3 to 5 concise facts when enough information exists.
- whoIsAffected must contain 2 to 5 concise groups when identifiable.
- unansweredQuestions must contain 2 to 5 concise questions.
- commonGround must contain 2 to 4 meaningful points when identifiable.
- Return lean as Left, Center, or Right.
- Return biasReasoning as one concise paragraph.
- Separate confirmed information from assumptions.
- If there is no identifiable conflicting reporting, return an empty conflictingReporting array.
- Use the article source in evidence.primarySources when available.
- Use the current date and time in ISO-8601 format for evidence.lastAnalyzedAt.
- If the article is not political, analyze it neutrally and set category appropriately.
`,
        },
      ],
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
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

        whyThisMatters:
          "PoliticalPulse could not determine why this story matters.",

        whoIsAffected: [],

        shortTermImpact:
          "Short-term impact analysis is currently unavailable.",

        longTermImpact:
          "Long-term impact analysis is currently unavailable.",

        unansweredQuestions: [],

        biasScore: 50,

        lean: "Center",

        biasReasoning: "Bias reasoning is not available.",

        confidence: 0,

        category: "Unknown",

        sourcesReviewed: 0,

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
          explanation:
            "The intelligence engine could not complete the fact-checking analysis.",
        },

        evidence: {
          primarySources: [],
          conflictingReporting: [],
          methodology:
            "PoliticalPulse could not complete its evidence assessment.",
          lastAnalyzedAt: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}