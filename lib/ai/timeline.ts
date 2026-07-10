import type { Article } from "@/app/types/article";

export type TimelineEvent = {
  date: string;
  title: string;
  description: string;
};

export function getMockTimeline(): TimelineEvent[] {
  return [
    {
      date: "Today",
      title: "Story is actively developing",
      description:
        "PoliticalPulse is monitoring new reporting, official responses, and public reaction as this story evolves.",
    },
    {
      date: "Recent Coverage",
      title: "Public and media attention increased",
      description:
        "The issue began receiving broader attention through media coverage, political commentary, and stakeholder reaction.",
    },
    {
      date: "Background",
      title: "Policy context shaped the debate",
      description:
        "The story connects to longer-running political disagreements, policy priorities, and public concerns.",
    },
  ];
}

export async function generateTimeline(
  article: Article
): Promise<TimelineEvent[]> {
  const response = await fetch("/api/timeline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    throw new Error("Failed to generate timeline");
  }

  const data = await response.json();

  return data.timeline;
}