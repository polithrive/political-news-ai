"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  MOCK_FEATURED_POLL,
  POLL_BAR_COLORS,
  pollPercents,
  type Poll,
} from "./mockFeaturedPoll";

const STORAGE_KEY = "angle-report-featured-poll-vote";

export default function FeaturedHomepagePoll() {
  const [poll] = useState<Poll>(MOCK_FEATURED_POLL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { options } = pollPercents(poll);

  function vote(optionId: string) {
    if (selectedId) {
      return;
    }

    setSelectedId(optionId);

    try {
      window.localStorage.setItem(STORAGE_KEY, optionId);
    } catch {
      /* presentation-only */
    }
  }

  return (
    <section
      id="the-question"
      className="scroll-mt-28 flex h-full flex-col rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#55C8FF]">
          The Question
        </p>
        <p className="text-[13px] text-[#9CB0C5]">
          Join the conversation. See how others think.
        </p>
      </div>

      <div className="mt-4 flex gap-4">
        {poll.relatedStoryImage ? (
          <div className="relative hidden h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl sm:block">
            <Image
              src={poll.relatedStoryImage}
              alt=""
              fill
              sizes="92px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold leading-snug text-white">
            {poll.question}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {poll.options.map((option) => {
              const isSelected = selectedId === option.id;
              const style =
                option.id === "yes"
                  ? "bg-[#38BDF8] text-[#03111F]"
                  : option.id === "no"
                    ? "bg-[#FF2638] text-white"
                    : "bg-[#0A2544] text-white";

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => vote(option.id)}
                  disabled={Boolean(selectedId)}
                  suppressHydrationWarning
                  className={`min-w-[84px] rounded-lg px-5 py-2 text-sm font-semibold ${
                    isSelected || !selectedId
                      ? style
                      : "bg-[#05182E] text-[#9CB0C5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {selectedId ? (
            <ul className="mt-4 space-y-2">
              {options.map((option) => (
                <li key={option.id}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="text-[#D7E4F4]">{option.label}</span>
                    <span className="font-semibold text-white">
                      {option.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#020D21]">
                    <div
                      className={`h-full rounded-full ${
                        POLL_BAR_COLORS[option.id] ?? "bg-[#38BDF8]"
                      }`}
                      style={{ width: `${option.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] text-[#9CB0C5]">
              Vote to see results and how others are thinking.
            </p>
          )}
        </div>
      </div>

      <Link
        href="#polls"
        className="mt-auto pt-4 text-sm font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
      >
        See more polls →
      </Link>
    </section>
  );
}
