import type { Metadata } from "next";

import Footer from "@/app/components/Footer";
import PollVoteCard from "@/app/components/polls/PollVoteCard";
import { MOCK_POLLS } from "@/app/components/polls/mockFeaturedPoll";
import SiteShell from "@/app/components/shell/SiteShell";

export const metadata: Metadata = {
  title: "Polls",
  description:
    "Vote on today's reader polls and see how Angle Report readers are splitting on the biggest questions.",
};

export default function PollsPage() {
  const [featuredPoll, ...morePolls] = MOCK_POLLS;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Polls
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
          What readers think today
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#9CB0C5] sm:text-lg">
          These are Angle Report reader polls, not scientific public-opinion
          surveys. Vote once per question on this device, then see how others
          split.
        </p>

        <div className="mt-8">
          <PollVoteCard poll={featuredPoll} featured />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
              More polls
            </h2>
            <p className="text-sm text-[#9CB0C5]">
              Other questions readers are answering this week.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {morePolls.map((poll) => (
              <PollVoteCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </SiteShell>
  );
}
