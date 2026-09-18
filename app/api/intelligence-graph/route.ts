import { openai } from "@/lib/ai/client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";
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
Create a PoliticalPulse Intelligence Graph for the following article.

Article title:
${article.title ?? "Title unavailable"}

Article description:
${article.description ?? "Description unavailable"}

Article source:
${article.source?.name ?? "Source unavailable"}

Return this exact JSON structure:

{
  "centralStory": "A concise title representing the central political story",
  "nodes": [
    {
      "id": "story-1",
      "type": "Story",
      "title": "Central story title",
      "description": "A concise description of the central story"
    },
    {
      "id": "person-1",
      "type": "Person",
      "title": "Person name",
      "description": "Why this person is connected to the story"
    }
  ],
  "connections": [
    {
      "from": "story-1",
      "to": "person-1",
      "relationship": "How the person is connected to the central story"
    }
  ]
}

Allowed node types:

- Story
- Person
- Organization
- Legislation
- Court Case
- Government Agency
- Location
- Topic
- Historical Event

Rules:

- Return only valid JSON.
- Do not include markdown.
- Do not include text outside the JSON object.
- Include exactly one central Story node.
- The central Story node must use the id "story-1".
- Include 4 to 8 additional nodes when supported by the article.
- Every node id must be unique.
- Every connection must reference valid node ids.
- Every non-central node must connect directly or indirectly to "story-1".
- Use concise titles and descriptions.
- Do not invent people, legislation, court cases, organizations, dates, or events.
- Base the graph only on information contained in the supplied article.
- If the article lacks enough information for a specific node type, do not include that type.
- Prefer fewer accurate nodes over more speculative nodes.
- Relationships must explain the factual connection between nodes.
`,
        },
      ],
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No Intelligence Graph response returned");
    }

    const graph = JSON.parse(content);

    return Response.json(graph);
  } catch (error) {
    console.error("Intelligence Graph API error:", error);

    return Response.json(
      {
        centralStory: "Intelligence Graph unavailable",
        nodes: [],
        connections: [],
      },
      { status: 500 }
    );
  }
}