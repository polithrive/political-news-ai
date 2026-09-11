import type { IntelligenceReport } from "@/app/types/report";

type ImpactAnalysisProps = {
  report: IntelligenceReport;
};

function BulletList({
  items,
  emptyMessage,
  tone,
}: {
  items: string[];
  emptyMessage: string;
  tone: "cyan" | "amber";
}) {
  const dotClass =
    tone === "cyan"
      ? "bg-[#38BDF8]"
      : "bg-amber-400";

  if (items.length === 0) {
    return (
      <p className="text-sm leading-6 text-[#6F879F]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3"
        >
          <span
            aria-hidden="true"
            className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dotClass}`}
          />

          <span className="text-sm leading-6 text-[#B5C3D2]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ImpactAnalysis({
  report,
}: ImpactAnalysisProps) {
  return (
    <section
      aria-label="Impact analysis"
      className="overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="border-b border-[#17446D]/60 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Impact Analysis
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              What this story means
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#8EA3B7]">
            Why the story matters, who may be affected, and what could happen next.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-[#FF2638]/20 bg-[#FF2638]/[0.05] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7A86]">
            Why this matters
          </p>

          <p className="mt-3 text-base leading-7 text-[#E6EDF4]">
            {report.whyThisMatters}
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/[0.05] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7DD3FC]">
              Who is most affected
            </p>

            <div className="mt-3">
              <BulletList
                items={report.whoIsAffected}
                emptyMessage="The affected groups could not be determined from the available information."
                tone="cyan"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Questions still unanswered
            </p>

            <div className="mt-3">
              <BulletList
                items={report.unansweredQuestions}
                emptyMessage="No major unanswered questions were identified."
                tone="amber"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Short-term impact
            </p>

            <p className="mt-3 text-sm leading-6 text-[#B5C3D2]">
              {report.shortTermImpact}
            </p>
          </div>

          <div className="rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Long-term impact
            </p>

            <p className="mt-3 text-sm leading-6 text-[#B5C3D2]">
              {report.longTermImpact}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}