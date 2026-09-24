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
          Reader Poll
        </p>
      </div>

      <h2 className="mt-3 font-serif text-[1.05rem] font-bold leading-snug text-white">
        What Angle Report readers think
      </h2>

      <p className="mt-3 text-[12px] leading-5 text-[#9CB0C5]">
        No question is up yet. When one is tied to a current story, you can
        weigh in here. Answers come from our readers, not from a pollster.
      </p>
    </section>
  );
}
