"use client";

import { useEffect, useState } from "react";

import type { Article } from "@/app/types/article";

import SectionHeader from "@/app/components/ui/SectionHeader";

import {
  generateTimeline,
  getMockTimeline,
  type TimelineEvent,
} from "@/lib/ai/timeline";

import { colors } from "@/lib/design/theme";

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
  return (
    <li className="relative grid gap-4 sm:grid-cols-[88px_32px_1fr] sm:gap-5">
      <div className="hidden pt-1 text-right sm:block">
        <p
          className="text-xs font-semibold uppercase tracking-[0.14em]"
          style={{
            color: colors.text.muted,
          }}
        >
          Event
        </p>

        <p
          className="mt-1 text-lg font-bold"
          style={{
            color: colors.text.primary,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[15px] top-0 h-full sm:relative sm:left-auto"
      >
        <div
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4"
          style={{
            backgroundColor: colors.brand.primary,
            borderColor: colors.background.surface,
            boxShadow: `0 0 0 1px ${colors.brand.primary}55`,
          }}
        >
          <span className="h-2 w-2 rounded-full bg-white" />
        </div>

        {!isLast && (
          <div
            className="absolute left-1/2 top-8 h-[calc(100%+1.5rem)] w-px -translate-x-1/2"
            style={{
              backgroundColor: colors.border.default,
            }}
          />
        )}
      </div>

      <article
        className="ml-12 overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:ml-0 sm:p-6"
        style={{
          backgroundColor: colors.background.elevated,
          borderColor: colors.border.default,
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: colors.brand.primary,
              }}
            >
              {event.date}
            </p>

            <h3
              className="mt-2 text-lg font-semibold tracking-tight sm:text-xl"
              style={{
                color: colors.text.primary,
              }}
            >
              {event.title}
            </h3>
          </div>

          <span
            className="rounded-full border px-3 py-1 text-xs font-semibold sm:hidden"
            style={{
              backgroundColor: `${colors.brand.primary}10`,
              borderColor: `${colors.brand.primary}30`,
              color: colors.brand.primary,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p
          className="mt-4 text-sm leading-7 sm:text-base sm:leading-8"
          style={{
            color: colors.text.secondary,
          }}
        >
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
    useState<TimelineEvent[]>(getMockTimeline());

  const [isLoading, setIsLoading] = useState(true);

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
          setTimelineEvents(generatedTimeline);
        }
      } catch (error) {
        console.error(
          "Failed to load timeline:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "PoliticalPulse could not refresh the timeline. Showing available context instead."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTimeline();

    return () => {
      isCancelled = true;
    };
  }, [article]);

  return (
    <section
      aria-label="Story timeline"
      aria-busy={isLoading}
      className="relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
      style={{
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor: `${colors.brand.primary}10`,
        }}
      />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            eyebrow="Story Timeline"
            title="How This Story Developed"
            subtitle="Follow the key events and decisions that shaped the current story."
          />

          <div
            className="shrink-0 rounded-xl border px-4 py-3"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor: colors.border.default,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                color: colors.text.muted,
              }}
            >
              Timeline Events
            </p>

            <p
              className="mt-1 text-2xl font-bold"
              style={{
                color: colors.text.primary,
              }}
            >
              {timelineEvents.length}
            </p>
          </div>
        </div>

        {isLoading && (
          <div
            role="status"
            className="mt-7 flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor: colors.border.default,
            }}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-pulse rounded-full"
              style={{
                backgroundColor:
                  colors.brand.primary,
              }}
            />

            <p
              className="text-sm"
              style={{
                color: colors.text.secondary,
              }}
            >
              Updating the timeline with the latest
              available story context…
            </p>
          </div>
        )}

        {errorMessage && (
          <div
            role="status"
            className="mt-7 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: `${colors.status.warning}0D`,
              borderColor: `${colors.status.warning}35`,
            }}
          >
            <p
              className="text-sm leading-6"
              style={{
                color: colors.text.secondary,
              }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {timelineEvents.length > 0 ? (
          <ol className="mt-8 space-y-6">
            {timelineEvents.map((event, index) => (
              <TimelineItem
                key={`${event.date}-${event.title}-${index}`}
                event={event}
                index={index}
                isLast={
                  index === timelineEvents.length - 1
                }
              />
            ))}
          </ol>
        ) : (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-dashed p-6 sm:p-8"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor: colors.border.default,
            }}
          >
            <p
              className="text-sm leading-7 sm:text-base"
              style={{
                color: colors.text.muted,
              }}
            >
              PoliticalPulse could not identify enough
              dated events to build a reliable timeline
              for this story.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}