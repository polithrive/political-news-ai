"use client";

import { useEffect, useState } from "react";
import {
  generateTimeline,
  getMockTimeline,
  type TimelineEvent,
} from "@/lib/ai/timeline";
import type { Article } from "@/app/types/article";

type StoryTimelineProps = {
  article: Article;
};

export default function StoryTimeline({ article }: StoryTimelineProps) {
  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(getMockTimeline());

  useEffect(() => {
    async function loadTimeline() {
      try {
        const generatedTimeline = await generateTimeline(article);
        setTimelineEvents(generatedTimeline);
      } catch (error) {
        console.error("Failed to load timeline:", error);
      }
    }

    loadTimeline();
  }, [article]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
        Story Timeline
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        How This Story Developed
      </h2>

      <div className="mt-6 space-y-6">
        {timelineEvents.map((event, index) => (
          <div key={index} className="border-l border-red-500 pl-5">
            <p className="text-sm font-semibold text-red-400">{event.date}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}