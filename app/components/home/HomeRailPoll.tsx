import { ChartIcon } from "@/app/components/home/HomeIcons";

export default function HomeRailPoll() {
  return (
    <section
      aria-labelledby="home-rail-poll-heading"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-3.5"
    >
      <div className="flex items-center justify-between gap-2">
        <p
          id="home-rail-poll-heading"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]"
        >
          <ChartIcon className="h-4 w-4" />
          Live Poll
        </p>
      </div>

      <h2 className="mt-3 font-serif text-[1.05rem] font-bold leading-snug text-white">
        A sourced reader poll will appear here.
      </h2>

      <div className="mt-4 space-y-2.5" aria-hidden="true">
        <div className="h-1.5 rounded-full bg-[#020D21]" />
        <div className="h-1.5 rounded-full bg-[#020D21]" />
        <div className="h-1.5 rounded-full bg-[#020D21]" />
      </div>

      <p className="mt-3 text-[12px] leading-5 text-[#9CB0C5]">
        When we publish a question tied to a real story, you&apos;ll vote here.
        Results will come from Angle Report readers — not estimates.
      </p>
    </section>
  );
}
