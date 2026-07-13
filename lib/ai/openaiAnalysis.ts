import { openai } from "@/lib/ai/client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export async function runPoliticalAnalysis(
  prompt: string
): Promise<unknown> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.politicalAnalyst,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,

    response_format: {
      type: "json_object",
    },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "PoliticalPulse Intelligence Engine returned no analysis."
    );
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(
      "PoliticalPulse could not parse the AI response:",
      error
    );

    throw new Error(
      "PoliticalPulse Intelligence Engine returned invalid JSON."
    );
  }
}