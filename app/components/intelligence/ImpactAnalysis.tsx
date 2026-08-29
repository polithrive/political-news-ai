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
  tone: "blue" | "amber";
}) {
  const dotClass =
    tone === "blue"
      ? "bg-blue-400"
      : "bg-amber-400";

  if (items.length === 0) {
    return (
      <p className="text-sm leading-6 text-slate-500">
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

          <span className="text-sm leading-6 text-slate-300">
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
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm"
    >
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          Impact Analysis
        </p>

        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            What this story means
          </h2>

          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Why the story matters, who may be affected,
            and what could happen next.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red-300">
            Why this matters
          </p>

          <p className="mt-3 text-base leading-7 text-slate-100">
            {report.whyThisMatters}
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-300">
              Who is most affected
            </p>

            <div className="mt-3">
              <BulletList
                items={report.whoIsAffected}
                emptyMessage="The affected groups could not be determined from the available information."
                tone="blue"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
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
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
              Short-term impact
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {report.shortTermImpact}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-300">
              Long-term impact
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {report.longTermImpact}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}