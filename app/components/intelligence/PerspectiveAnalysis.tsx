import type { IntelligenceReport } from "../../types/report";

type PerspectiveAnalysisProps = {
  report: IntelligenceReport;
};

type PerspectiveCardProps = {
  label: string;
  title: string;
  perspective: string;
  tone: "blue" | "slate" | "red";
};

const toneStyles = {
  blue: {
    label: "text-blue-300",
    border: "border-blue-500/20",
    background: "bg-blue-500/[0.06]",
    dot: "bg-blue-400",
  },
  slate: {
    label: "text-slate-300",
    border: "border-slate-700",
    background: "bg-slate-950/60",
    dot: "bg-slate-400",
  },
  red: {
    label: "text-red-300",
    border: "border-red-500/20",
    background: "bg-red-500/[0.06]",
    dot: "bg-red-400",
  },
} as const;

function PerspectiveCard({
  label,
  title,
  perspective,
  tone,
}: PerspectiveCardProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={`rounded-2xl border ${styles.border} ${styles.background} p-5`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${styles.dot}`}
        />

        <p
          className={`text-[11px] font-extrabold uppercase tracking-[0.16em] ${styles.label}`}
        >
          {label}
        </p>
      </div>

      <h3 className="mt-2 text-lg font-extrabold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {perspective}
      </p>
    </article>
  );
}

export default function PerspectiveAnalysis({
  report,
}: PerspectiveAnalysisProps) {
  return (
    <section
      aria-label="Perspective analysis"
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm"
    >
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          Perspective Analysis
        </p>

        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            How different sides may see this story
          </h2>

          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Compare how progressive, centrist, and
            conservative viewpoints may interpret the
            same reporting.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <PerspectiveCard
            label="Progressive framing"
            title="Left Perspective"
            perspective={report.perspectives.left}
            tone="blue"
          />

          <PerspectiveCard
            label="Centrist framing"
            title="Center Perspective"
            perspective={report.perspectives.center}
            tone="slate"
          />

          <PerspectiveCard
            label="Conservative framing"
            title="Right Perspective"
            perspective={report.perspectives.right}
            tone="red"
          />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
          <div
            aria-hidden="true"
            className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-bold text-slate-400"
          >
            i
          </div>

          <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            These summaries illustrate differences in
            political framing and emphasis. They do not
            imply that everyone within a political group
            holds the same view.
          </p>
        </div>
      </div>
    </section>
  );
}