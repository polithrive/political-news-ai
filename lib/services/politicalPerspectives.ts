import { openai } from "@/lib/ai/client";

import { PERSPECTIVE_PROMPT } from "@/lib/ai/prompts";

import type { Article } from "@/app/types/article";

export type PoliticalPerspectives = {
  progressive: string;

  centrist: string;

  conservative: string;

  consensus: string;

  disagreements: string[];
};

export async function generatePoliticalPerspectives(
  article: Article
): Promise<PoliticalPerspectives> {
  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: PERSPECTIVE_PROMPT,
        },
        {
          role: "user",
          content: `
Analyze this political story.

Title:
${article.title}

Description:
${article.description}

Return JSON:

{
  "progressive":"",
  "centrist":"",
  "conservative":"",
  "consensus":"",
  "disagreements":[]
}
          `,
        },
      ],
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "The Angle Report could not generate political perspectives."
    );
  }

  return JSON.parse(content);
}