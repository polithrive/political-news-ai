import Link from "next/link";

import { ChartIcon } from "@/app/components/home/HomeIcons";

import {
  MOCK_FEATURED_POLL,
  POLL_BAR_COLORS,
  pollPercents,
} from "./mockFeaturedPoll";

export default function TopPollCard() {
  const { totalVotes, options } = pollPercents(MOCK_FEATURED_POLL);

  return (
    <section
      id="polls"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
          <ChartIcon className="h-4 w-4" />
          Today&apos;s top poll
        </p>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9FE7C1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          Live
        </p>
      </div>

      <h2 className="mt-3 font-serif text-[1.05rem] font-bold leading-snug text-white">
        {MOCK_FEATURED_POLL.question}
      </h2>

      <ul className="mt-4 space-y-2.5">
        {options.map((option) => (
          <li key={option.id}>
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="text-[#D7E4F4]">{option.label}</span>
              <span className="font-semibold text-white">{option.percent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#020D21]">
              <div
                className={`h-full rounded-full ${POLL_BAR_COLORS[option.id] ?? "bg-[#38BDF8]"}`}
                style={{ width: `${option.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[12px] text-[#9CB0C5]">
        {totalVotes.toLocaleString()} readers voted
      </p>

      <Link
        href="#the-question"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#214B70] px-3 py-2 text-sm font-semibold text-white hover:border-[#55C8FF]"
      >
        See more polls →
      </Link>
    </section>
  );
}
