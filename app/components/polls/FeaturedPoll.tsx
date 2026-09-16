"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  MOCK_FEATURED_POLL,
  POLL_BAR_COLORS,
  type Poll,
} from "./mockFeaturedPoll";

const STORAGE_KEY = "angle-report-featured-poll-vote";

const BUTTON_STYLES: Record<string, string> = {
  yes: "bg-[#38BDF8] text-[#03111F] hover:bg-[#55C8FF]",
  no: "border border-[#FF2638] bg-transparent text-white hover:bg-[#FF2638]/10",
  unsure: "bg-[#0A2544] text-white hover:bg-[#12345A]",
};

type FeaturedPollProps = {
  relatedStoryTitle?: string;
  relatedStoryImage?: string;
};

export default function FeaturedPoll({
  relatedStoryTitle,
  relatedStoryImage,
}: FeaturedPollProps) {
  const [poll, setPoll] = useState<Poll>(MOCK_FEATURED_POLL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showArguments, setShowArguments] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedId(stored);
      }
    } catch {
      /* presentation-only persistence */
    }
  }, []);

  const hasVoted = Boolean(selectedId);
  const imageSrc = relatedStoryImage ?? poll.relatedStoryImage;

  const totalVotes = useMemo(
    () => poll.options.reduce((sum, option) => sum + option.votes, 0),
    [poll.options]
  );

  function vote(optionId: string) {
    if (hasVoted) {
      return;
    }

    setPoll((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId
          ? { ...option, votes: option.votes + 1 }
          : option
      ),
    }));
    setSelectedId(optionId);

    try {
      window.localStorage.setItem(STORAGE_KEY, optionId);
    } catch {
      /* presentation-only persistence */
    }
  }

  return (
    <section id="the-question" className="scroll-mt-28 py-8 sm:py-10">
      <div className="rounded-2xl bg-[#04162C] p-5 sm:p-6 lg:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
              The Question
            </p>
            <p className="text-sm text-[#9CB0C5]">
              {relatedStoryTitle ?? "What Angle Report readers think."}
            </p>
          </div>
          <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#9FE7C1]">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            Live Poll
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <div className="flex gap-4">
              {imageSrc ? (
                <div className="relative hidden h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl sm:block">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0">
                <h3 className="font-serif text-xl font-bold leading-snug text-white sm:text-[1.35rem]">
                  {poll.question}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {poll.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => vote(option.id)}
                      disabled={hasVoted}
                      suppressHydrationWarning
                      className={`min-w-[88px] rounded-lg px-5 py-2 text-sm font-semibold transition disabled:opacity-80 ${
                        selectedId === option.id
                          ? option.id === "yes"
                            ? "bg-[#38BDF8] text-[#03111F]"
                            : option.id === "no"
                              ? "bg-[#FF2638] text-white"
                              : "bg-[#7A93AA] text-[#03111F]"
                          : BUTTON_STYLES[option.id] ?? BUTTON_STYLES.unsure
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-[13px] text-[#9CB0C5]">
                  Vote to see results and how others are thinking.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Current Results ({totalVotes.toLocaleString()} votes)
            </p>

            <ul className="mt-4 space-y-3">
              {poll.options.map((option) => {
                const percent =
                  totalVotes > 0
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0;

                return (
                  <li key={option.id}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="text-[#D7E4F4]">{option.label}</span>
                      <span className="font-semibold text-white">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#020D21]">
                      <div
                        className={`h-full rounded-full ${POLL_BAR_COLORS[option.id] ?? "bg-[#38BDF8]"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {poll.arguments?.[0] ? (
              <blockquote className="mt-5 text-[13px] leading-6 text-[#C5D4E8]">
                “{poll.arguments[0].text}”
                <footer className="mt-1 text-[11px] text-[#7890AC]">
                  Reader voter comment
                </footer>
              </blockquote>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-between gap-3 text-[13px] font-semibold">
              <button
                type="button"
                onClick={() => setShowArguments((open) => !open)}
                className="text-[#55C8FF] hover:text-[#8EDCFF]"
                suppressHydrationWarning
              >
                See the arguments →
              </button>
              <Link href="/polls" className="text-[#55C8FF] hover:text-[#8EDCFF]">
                See more polls →
              </Link>
            </div>

            {showArguments && poll.arguments ? (
              <ul className="mt-4 space-y-3">
                {poll.arguments.map((item) => (
                  <li key={item.label} className="text-[13px] leading-6">
                    <span className="font-semibold text-white">
                      {item.label}.{" "}
                    </span>
                    <span className="text-[#9CB0C5]">{item.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-4 text-[11px] text-[#7890AC]">
              Reader poll — not a scientific public-opinion survey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
