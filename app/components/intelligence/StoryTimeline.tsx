"use client";

import { useEffect, useState } from "react";

import type { Article } from "@/app/types/article";

import AnimatedCounter from "@/app/components/ui/AnimatedCounter";
import FadeIn from "@/app/components/ui/FadeIn";

import {
  generateTimeline,
  getMockTimeline,
  type TimelineEvent,
} from "@/lib/ai/timeline";

type StoryTimelineProps = {
  article: Article;
};

type TimelineItemProps = {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
};

function TimelineItem({
  event,
  index,
  isLast,
}: TimelineItemProps) {
  const factNumber = String(index + 1).padStart(
    2,
    "0"
  );

  return (
    <li className="relative grid gap-4 sm:grid-cols-[88px_32px_minmax(0,1fr)] sm:gap-5">
      <div className="hidden pt-1 text-right sm:block">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F879F]">
          Event
        </p>

        <p className="mt-1 text-lg font-extrabold text-white">
          {factNumber}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[15px] top-0 h-full sm:relative sm:left-auto"
      >
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#04162C] bg-[#38BDF8] shadow-[0_0_0_1px_rgba(56,189,248,0.25)]">
          <span className="h-2 w-2 rounded-full bg-[#020D21]" />
        </div>

        {!isLast ? (
          <div className="absolute left-1/2 top-8 h-[calc(100%+1.5rem)] w-px -translate-x-1/2 bg-[#17446D]" />
        ) : null}
      </div>

      <article className="ml-12 overflow-hidden rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#38BDF8]/35 hover:bg-[#061A31] sm:ml-0 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
              {event.date}
            </p>

            <h3 className="mt-2 text-lg font-extrabold tracking-tight text-white sm:text-xl">
              {event.title}
            </h3>
          </div>

          <span className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1 text-xs font-bold text-[#7DD3FC] sm:hidden">
            {factNumber}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#B5C3D2] sm:text-base sm:leading-8">
          {event.description}
        </p>
      </article>
    </li>
  );
}

export default function StoryTimeline({
  article,
}: StoryTimelineProps) {
  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(
      getMockTimeline()
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadTimeline() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const generatedTimeline =
          await generateTimeline(article);

        if (!isCancelled) {
          setTimelineEvents(
            generatedTimeline
          );
        }
      } catch (error) {
        console.error(
          "Failed to load timeline:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "The Angle Report could not refresh the timeline. Showing available context instead."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadTimeline();

    return () => {
      isCancelled = true;
    };
  }, [article]);

  return (
    <section
      aria-label="Story timeline"
      aria-busy={isLoading}
      className="relative overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#38BDF8]/5 blur-3xl"
      />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Story Timeline
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              How this story developed
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8EA3B7]">
              Follow the key events and decisions that shaped the current story.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F879F]">
              Timeline Events
            </p>

            <p className="mt-1 text-3xl font-black tracking-tight text-white">
              <AnimatedCounter
                value={timelineEvents.length}
              />
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            role="status"
            className="mt-7 flex items-center gap-3 rounded-xl border border-[#17446D]/60 bg-[#020D21]/60 px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#38BDF8]"
            />

            <p className="text-sm text-[#B5C3D2]">
              Updating the timeline with the latest available story context…
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <div
            role="status"
            className="mt-7 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3"
          >
            <p className="text-sm leading-6 text-amber-100">
              {errorMessage}
            </p>
          </div>
        ) : null}

        {timelineEvents.length > 0 ? (
          <ol className="mt-8 space-y-6">
            {timelineEvents.map(
              (event, index) => (
                <FadeIn
                  key={`${event.date}-${event.title}-${index}`}
                  delay={Math.min(
                    index * 80,
                    320
                  )}
                >
                  <TimelineItem
                    event={event}
                    index={index}
                    isLast={
                      index ===
                      timelineEvents.length - 1
                    }
                  />
                </FadeIn>
              )
            )}
          </ol>
        ) : (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-dashed border-[#214B70] bg-[#020D21]/55 p-6 sm:p-8"
          >
            <p className="text-sm leading-7 text-[#8EA3B7] sm:text-base">
              The Angle Report could not identify enough dated events to build a reliable timeline for this story.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}