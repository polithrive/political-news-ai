"use client";

import { useEffect, useMemo, useState } from "react";

import {
  POLL_BAR_COLORS,
  pollVoteStorageKey,
  type Poll,
} from "./mockFeaturedPoll";

const BUTTON_STYLES: Record<string, string> = {
  yes: "bg-[#38BDF8] text-[#03111F] hover:bg-[#55C8FF]",
  no: "border border-[#FF2638] bg-transparent text-white hover:bg-[#FF2638]/10",
  unsure: "bg-[#0A2544] text-white hover:bg-[#12345A]",
};

type PollVoteCardProps = {
  poll: Poll;
  featured?: boolean;
};

export default function PollVoteCard({
  poll: initialPoll,
  featured = false,
}: PollVoteCardProps) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(pollVoteStorageKey(initialPoll.id));
      if (stored) {
        setSelectedId(stored);
      }
    } catch {
      /* presentation-only persistence */
    }
  }, [initialPoll.id]);

  const hasVoted = Boolean(selectedId);
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
      window.localStorage.setItem(pollVoteStorageKey(poll.id), optionId);
    } catch {
      /* presentation-only persistence */
    }
  }

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-[#17446D]/55 bg-[#04162C] ${
        featured ? "p-5 sm:p-6 lg:p-7" : "p-5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
          {featured ? "Today's top poll" : poll.category ?? "Reader poll"}
        </p>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9FE7C1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          Live
        </p>
      </div>

      <h2
        className={`mt-3 font-serif font-bold leading-snug text-white ${
          featured ? "text-xl sm:text-[1.45rem]" : "text-[1.08rem]"
        }`}
      >
        {poll.question}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {poll.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => vote(option.id)}
            disabled={hasVoted}
            suppressHydrationWarning
            className={`min-w-[84px] rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-80 ${
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
        {hasVoted
          ? `${totalVotes.toLocaleString()} readers voted`
          : "Vote to record your answer on this device."}
      </p>

      <ul className="mt-4 space-y-3">
        {poll.options.map((option) => {
          const percent =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

          return (
            <li key={option.id}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="text-[#D7E4F4]">{option.label}</span>
                <span className="font-semibold text-white">{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#020D21]">
                <div
                  className={`h-full rounded-full ${
                    POLL_BAR_COLORS[option.id] ?? "bg-[#38BDF8]"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {featured && poll.arguments ? (
        <ul className="mt-5 space-y-3">
          {poll.arguments.map((item) => (
            <li key={item.label} className="text-[13px] leading-6">
              <span className="font-semibold text-white">{item.label}. </span>
              <span className="text-[#9CB0C5]">{item.text}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-auto pt-4 text-[11px] text-[#7890AC]">
        Reader poll — not a scientific public-opinion survey.
      </p>
    </article>
  );
}
