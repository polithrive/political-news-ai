import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = body.title || "No title provided";
    const description = body.description || "No description provided";

    const completion = await client.chat.completions.create({
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